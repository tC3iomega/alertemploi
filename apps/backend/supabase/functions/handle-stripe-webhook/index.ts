import { DbSchema, SubscriptionTier } from '@alertemploi/core';
import { getExceptionMessage } from '@alertemploi/core';
import { createClient } from '@supabase/supabasefork';
import Stripe from 'npm:stripe';

import { CORS_HEADERS } from '../_shared/cors.ts';
import { createLoggerWithMeta } from '../_shared/logger.ts';

// Map Stripe Price IDs to our subscription tiers
const PRICE_ID_TO_TIER: Record<string, SubscriptionTier> = {
  price_1Tk1X4V059EuUi4mpZaDiqwt: 'basic', // basic monthly
  price_1Tk1X4V059EuUi4mwAvqhX6z: 'basic', // basic yearly
  price_1Tk1XSV059EuUi4mcBBeAFBU: 'pro', // pro monthly
  price_1Tk1XjV059EuUi4mCPRLTUmV: 'pro', // pro yearly
};

function getTierFromSubscription(subscription: Stripe.Subscription): SubscriptionTier {
  const priceId = subscription.items.data[0]?.price?.id;
  return (priceId && PRICE_ID_TO_TIER[priceId]) ?? 'basic';
}

/**
 * Stripe API versions from 2025-03-31 onward removed the top-level `current_period_end`
 * from Subscription objects, moving it onto each subscription item instead. Webhook
 * payloads are shaped per the endpoint's pinned API version (currently 2026-05-27.dahlia
 * here, which lacks the top-level field), so read both shapes to stay correct regardless
 * of which API version is in play.
 */
function getPeriodEnd(subscription: Stripe.Subscription): number {
  const topLevel = subscription.current_period_end;
  if (topLevel) return topLevel;
  const itemLevel = (subscription.items.data[0] as unknown as { current_period_end?: number })
    ?.current_period_end;
  if (!itemLevel) throw new Error(`Unable to determine period end for subscription ${subscription.id}`);
  return itemLevel;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  const logger = createLoggerWithMeta({
    function: 'handle-stripe-webhook',
  });
  try {
    const requestId = crypto.randomUUID();
    logger.addMeta('request_id', requestId);

    const supabaseClient = createClient<DbSchema>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable');
    }
    const stripe = new Stripe(stripeSecretKey);

    const signature = req.headers.get('Stripe-Signature');
    if (!signature) {
      throw new Error('Missing Stripe-Signature header');
    }
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET') ?? '',
      undefined,
    );

    logger.info(`received stripe event: ${event.type}`);

    // ---- checkout.session.completed / customer.subscription.created ----
    if (event.type === 'customer.subscription.created' || event.type === 'checkout.session.completed') {
      let customerEmail: string | null = null;
      let customerId: string | null = null;
      let subscriptionId: string | null = null;

      if (event.type === 'customer.subscription.created') {
        const subscription = event.data.object;
        customerId = subscription.customer as string;
        subscriptionId = subscription.id;
        const customer = await stripe.customers.retrieve(customerId);
        if (!customer.deleted) customerEmail = customer.email;
      } else {
        const session = event.data.object;
        // customer_details.email reflects what the buyer actually entered/confirmed at
        // checkout; customer_email is only the prefilled value and can be stale if they
        // changed it, which would otherwise upgrade the wrong account.
        customerEmail = session.customer_details?.email ?? session.customer_email;
        customerId = session.customer as string;
        subscriptionId = session.subscription as string;
      }

      if (customerEmail && customerId && subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const tier = getTierFromSubscription(subscription);

        const { data, error: getUserIdError } = await supabaseClient.rpc('get_user_id_by_email', {
          email: customerEmail.toLowerCase(),
        });
        if (getUserIdError) throw getUserIdError;
        // deno-lint-ignore no-explicit-any
        const userId = (data as unknown as any)?.[0]?.id;
        if (!userId) throw new Error(`No user found for email ${customerEmail}`);

        const periodEnd = new Date(getPeriodEnd(subscription) * 1000);

        const { error: updateProfileError } = await supabaseClient
          .from('profiles')
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_ends_at: periodEnd,
            plan: tier,
            trial_ends_at: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
          })
          .eq('user_id', userId);
        if (updateProfileError) throw updateProfileError;
        logger.info(`upgraded user ${customerEmail} to ${tier}`);
      }
    }

    // ---- customer.subscription.updated ----
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      const tier = getTierFromSubscription(subscription);

      const customer = await stripe.customers.retrieve(subscription.customer as string);
      if (customer.deleted) {
        throw new Error('Customer is deleted');
      }

      const { data, error: getUserIdError } = await supabaseClient.rpc('get_user_id_by_email', {
        email: customer.email?.toLowerCase(),
      });
      if (getUserIdError) throw getUserIdError;
      // deno-lint-ignore no-explicit-any
      const userId = (data as unknown as any)?.[0]?.id;
      if (!userId) throw new Error(`No user found for email ${customer.email}`);

      // If subscription is canceled/past_due/unpaid, treat as no active subscription
      const isActive = subscription.status === 'active' || subscription.status === 'trialing';
      const periodEnd = isActive ? new Date(getPeriodEnd(subscription) * 1000) : new Date();

      const { error: updateProfileError } = await supabaseClient
        .from('profiles')
        .update({
          stripe_customer_id: customer.id,
          stripe_subscription_id: subscription.id,
          subscription_ends_at: periodEnd,
          plan: tier,
          trial_ends_at: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
        })
        .eq('user_id', userId);
      if (updateProfileError) throw updateProfileError;
      logger.info(`successfully updated profile for customer ${customer.email}, status=${subscription.status}`);
    }

    // ---- customer.subscription.deleted (cancellation) ----
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;

      const customer = await stripe.customers.retrieve(subscription.customer as string);
      if (customer.deleted) {
        throw new Error('Customer is deleted');
      }

      const { data, error: getUserIdError } = await supabaseClient.rpc('get_user_id_by_email', {
        email: customer.email?.toLowerCase(),
      });
      if (getUserIdError) throw getUserIdError;
      // deno-lint-ignore no-explicit-any
      const userId = (data as unknown as any)?.[0]?.id;
      if (!userId) throw new Error(`No user found for email ${customer.email}`);

      const { error: updateProfileError } = await supabaseClient
        .from('profiles')
        .update({
          subscription_ends_at: new Date(), // expire immediately
          trial_ends_at: new Date(), // ensure trial logic doesn't grant access either
        })
        .eq('user_id', userId);
      if (updateProfileError) throw updateProfileError;
      logger.info(`subscription cancelled for customer ${customer.email}`);
    }

    return new Response(JSON.stringify({}), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  } catch (error) {
    logger.error(`error running handle stripe webhook: ${getExceptionMessage(error)}`);
    return new Response(JSON.stringify({ errorMessage: getExceptionMessage(error, true) }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      status: 500,
    });
  }
});
