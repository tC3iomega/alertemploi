import { DbSchema, SubscriptionTier } from '@alertemploi/core';
import { getExceptionMessage } from '@alertemploi/core';
import { createClient } from '@supabase/supabasefork';
import Stripe from 'npm:stripe';

import { CORS_HEADERS } from '../_shared/cors.ts';
import { createLoggerWithMeta } from '../_shared/logger.ts';

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

    // init supabase client
    const supabaseClient = createClient<DbSchema>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // init stripe client
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable');
    }
    const stripe = new Stripe(stripeSecretKey);

    // handle stripe webhook event
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

    if (event.type === 'customer.subscription.created' || event.type === 'checkout.session.completed') {
      // Pour subscription.created, on récupère le customer directement
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
        customerEmail = session.customer_email;
        customerId = session.customer as string;
        subscriptionId = session.subscription as string;
      }

      if (customerEmail && customerId && subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const { data, error: getUserIdError } = await supabaseClient.rpc('get_user_id_by_email', {
          email: customerEmail.toLowerCase(),
        });
        if (getUserIdError) throw getUserIdError;
        const userId = (data as unknown as any)?.[0]?.id;
        if (!userId) throw new Error(`No user found for email ${customerEmail}`);

        const trialEnd = subscription.trial_end
          ? new Date(subscription.trial_end * 1000)
          : new Date(subscription.current_period_end * 1000);

        const { error: updateProfileError } = await supabaseClient
          .from('profiles')
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_ends_at: trialEnd,
            plan: 'pro',
            trial_ends_at: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
          })
          .eq('user_id', userId);
        if (updateProfileError) throw updateProfileError;
        logger.info(`upgraded user ${customerEmail} to pro`);
      }
    }

    if (event.type === 'DISABLED_checkout.session.completed') {
      const session = event.data.object;
      if (session.mode === 'subscription' && session.customer_email) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const { data, error: getUserIdError } = await supabaseClient.rpc('get_user_id_by_email', {
          email: session.customer_email.toLowerCase(),
        });
        if (getUserIdError) throw getUserIdError;
        const userId = (data as unknown as any)?.[0]?.id;
        if (!userId) throw new Error(`No user found for email ${session.customer_email}`);

        const trialEnd = subscription.trial_end
          ? new Date(subscription.trial_end * 1000)
          : new Date(subscription.current_period_end * 1000);

        const { error: updateProfileError } = await supabaseClient
          .from('profiles')
          .update({
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_ends_at: trialEnd,
            plan: 'pro',
            trial_ends_at: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
          })
          .eq('user_id', userId);
        if (updateProfileError) throw updateProfileError;
        logger.info(`checkout completed: upgraded user ${session.customer_email} to pro`);
      }
    }

    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;

      // fetch the customer
      const customer = await stripe.customers.retrieve(subscription.customer as string);
      if (customer.deleted) {
        throw new Error('Customer is deleted??');
      }

      // get the matching user by email
      const { data, error: getUserIdError } = await supabaseClient.rpc('get_user_id_by_email', {
        email: customer.email?.toLowerCase(),
      });
      if (getUserIdError) {
        throw getUserIdError;
      }
      // deno-lint-ignore no-explicit-any
      const userId = (data as unknown as any)?.[0]?.id;
      if (!userId) {
        throw new Error(`No user found for email ${customer.email}`);
      }

      const { data: getUserByIdData, error: getUserByIdError } = await supabaseClient.auth.admin.getUserById(userId);
      if (getUserByIdError) {
        throw getUserByIdError;
      }
      const user = getUserByIdData.user;
      logger.info(`found user for customer ${customer.email}`);

      // update the user profile
      const tier = (subscription.items.data[0].plan.metadata?.tier ?? 'pro') as SubscriptionTier;
      const { error: updateProfileError } = await supabaseClient
        .from('profiles')
        .update({
          stripe_customer_id: customer.id,
          stripe_subscription_id: subscription.id,
          subscription_ends_at: new Date(subscription.current_period_end * 1000),
          plan: tier,
          trial_ends_at: null,
        })
        .eq('user_id', user.id);
      if (updateProfileError) {
        throw updateProfileError;
      }
      logger.info(`succesfully updated profile for user ${user.email}`);
    }

    return new Response(JSON.stringify({}), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
    // http://dragos.beastx.ro:54321/functions/v1/handle-stripe-webhook
  } catch (error) {
    logger.error(`error running handle stripe webhook: ${getExceptionMessage(error)}`);
    return new Response(JSON.stringify({ errorMessage: getExceptionMessage(error, true) }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      status: 500,
    });
  }
});
