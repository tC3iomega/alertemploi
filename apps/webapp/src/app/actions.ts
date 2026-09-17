'use server';

import { createClient } from '@/lib/supabase/server';
import { JobLabel, JobStatus, ListJobsParams, getExceptionMessage } from '@alertemploi/core';
import { F2aSupabaseApi } from '@alertemploi/ui';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3002';
}

export async function login(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const api = await buildApi();
    await api.loginWithEmail({ email, password });
  } catch (error) {
    return { error: getExceptionMessage(error, true) };
  }

  redirect('/jobs/list/new');
}

export async function signOut() {
  try {
    const api = await buildApi();
    await api.logout();
  } catch (error) {
    return { error: getExceptionMessage(error) };
  }

  redirect('/');
}

export async function listSites() {
  try {
    const api = await buildApi();
    return api.listSites();
  } catch (error) {
    throw new Error(`failed to list sites: ${getExceptionMessage(error, true)}`);
  }
}

export async function listLinks() {
  try {
    const api = await buildApi();
    return api.listLinks();
  } catch (error) {
    throw new Error(`failed to list links: ${getExceptionMessage(error, true)}`);
  }
}

export async function listJobs(formData: FormData) {
  try {
    const api = await buildApi();
    const params: ListJobsParams = {
      status: formData.get('status') as JobStatus,
      search: formData.get('search') as string,
      labels: (formData.get('labels') as string)?.split(',').map((label) => label.trim()) || [],
      siteIds: (formData.get('siteIds') as string)?.split(',').map((id) => Number(id.trim())) || [],
      linkIds: (formData.get('linkIds') as string)?.split(',').map((id) => Number(id.trim())) || [],
      limit: Number(formData.get('limit') ?? 50),
      after: formData.get('after') as string | undefined,
    };
    return api.listJobs(params);
  } catch (error) {
    throw new Error(`failed to list jobs: ${getExceptionMessage(error, true)}`);
  }
}

export async function getJobById(formData: FormData) {
  try {
    const jobId = Number(formData.get('jobId'));
    if (isNaN(jobId)) throw new Error('invalid job id');

    const api = await buildApi();
    return api.getJob(jobId);
  } catch (error) {
    throw new Error(`failed to get job by id: ${getExceptionMessage(error, true)}`);
  }
}

export async function updateJobStatus(formData: FormData) {
  try {
    const jobId = Number(formData.get('jobId'));
    const status = formData.get('status') as JobStatus;
    if (isNaN(jobId)) throw new Error('invalid job id');

    const api = await buildApi();
    await api.updateJobStatus({ jobId, status });
  } catch (error) {
    throw new Error(`failed to update job status: ${getExceptionMessage(error, true)}`);
  }
}

export async function updateJobLabels(formData: FormData) {
  try {
    const jobId = Number(formData.get('jobId'));
    const labels = (formData.get('labels') as string)?.split(',').map((label) => label.trim()) || [];
    if (isNaN(jobId)) throw new Error('invalid job id');

    const api = await buildApi();
    await api.updateJobLabels({ jobId, labels: labels as JobLabel[] });
  } catch (error) {
    throw new Error(`failed to update job labels: ${getExceptionMessage(error, true)}`);
  }
}

export async function createLink(formData: FormData) {
  try {
    const url = formData.get('url') as string;
    const title = formData.get('title') as string;
    if (!url) throw new Error('URL is required');

    const api = await buildApi();
    const link = await api.createLink({ title: title || url, url, html: '', webPageRuntimeData: {} as any, force: false });
    return { link };
  } catch (error) {
    return { error: getExceptionMessage(error, true) };
  }
}
export async function scanLinks() {
  try {
    const supabase = await createClient();
    const links = await listLinks();
    if (!links.length) return { newJobs: [] };

    const htmls = links.map((link) => ({
      linkId: link.id,
      content: '',
      webPageRuntimeData: {},
      maxRetries: 0,
      retryCount: 0,
    }));

    const { data, error } = await supabase.functions.invoke('scan-urls', {
      body: { htmls },
    });
    if (error) throw error;
    if (data?.newJobs?.length > 0) {
      const jobIds = data.newJobs.map((j: any) => j.id);
      await (supabase.from('jobs') as any).update({ status: 'new' }).in('id', jobIds);
    }
    revalidatePath('/jobs/list/new');
    return data;
  } catch (error) {
    throw new Error(`failed to scan links: ${getExceptionMessage(error, true)}`);
  }
}
export async function createCheckoutSession(formData: FormData) {
  const priceId = formData.get('priceId') as string;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const profile = await (await buildApi()).getProfile();

  // Already subscribed: switch plans on the existing subscription through the portal,
  // never create a second subscription (and a second Stripe customer) next to it.
  const hasActiveSubscription =
    !!profile?.stripe_subscription_id &&
    !!profile.subscription_ends_at &&
    new Date(profile.subscription_ends_at) > new Date();
  if (hasActiveSubscription) {
    const res = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'customer': profile.stripe_customer_id!,
        'return_url': `${getBaseUrl()}/dashboard`,
        'flow_data[type]': 'subscription_update',
        'flow_data[subscription_update][subscription]': profile.stripe_subscription_id!,
      }).toString(),
    });
    const session = await res.json();
    if (session.error) throw new Error(session.error.message);
    return { url: session.url };
  }

  const params: Record<string, string> = {
    'mode': 'subscription',
    'client_reference_id': user.id,
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    'payment_method_collection': 'if_required',
    'success_url': `${getBaseUrl()}/jobs/list/new`,
    'cancel_url': `${getBaseUrl()}/upgrade`,
  };
  if (profile?.stripe_customer_id) {
    params['customer'] = profile.stripe_customer_id;
  } else {
    params['customer_email'] = user.email!;
  }

  // The free trial starts at signup (profiles.trial_ends_at). Checkout only carries over
  // what's left of it, never a fresh 7 days — and nothing for accounts that already had a
  // subscription. Stripe requires trial_end to be at least 48h away.
  const trialEnd = profile?.trial_ends_at ? new Date(profile.trial_ends_at) : null;
  const MIN_TRIAL_MS = 48 * 60 * 60 * 1000 + 5 * 60 * 1000;
  if (!profile?.stripe_customer_id && trialEnd && trialEnd.getTime() - Date.now() > MIN_TRIAL_MS) {
    params['subscription_data[trial_end]'] = String(Math.floor(trialEnd.getTime() / 1000));
  }

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params).toString(),
  });

  const session = await res.json();
  if (session.error) throw new Error(session.error.message);
  return { url: session.url };
}
async function buildApi() {
  const supabase = await createClient();
  const api = new F2aSupabaseApi(supabase);
  return api;
}

export async function deleteLink(linkId: number) {
  try {
    const api = await buildApi();
    await api.deleteLink(linkId);
    revalidatePath('/links');
  } catch (error) {
    throw new Error(`failed to delete link: ${getExceptionMessage(error, true)}`);
  }
}

export async function getProfile() {
  try {
    const api = await buildApi();
    return await api.getProfile();
  } catch (error) {
    throw new Error(`failed to get profile: ${getExceptionMessage(error, true)}`);
  }
}

export async function createPortalSession() {
  const api = await buildApi();
  const profile = await api.getProfile();
  if (!profile?.stripe_customer_id) {
    throw new Error('No Stripe customer found for this account');
  }

  const res = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'customer': profile.stripe_customer_id,
      'return_url': `${getBaseUrl()}/dashboard`,
    }).toString(),
  });
  const session = await res.json();
  if (session.error) throw new Error(session.error.message);
  return { url: session.url };
}

export async function getCompanyBlacklist(): Promise<string[]> {
  try {
    const api = await buildApi();
    const config = await api.getAdvancedMatchingConfig();
    return config?.blacklisted_companies ?? [];
  } catch (error) {
    throw new Error(`failed to get company blacklist: ${getExceptionMessage(error, true)}`);
  }
}

export async function updateCompanyBlacklist(companies: string[]) {
  try {
    const cleaned = Array.from(new Set(companies.map((c) => c.trim()).filter(Boolean)));
    const api = await buildApi();
    await api.updateAdvancedMatchingConfig({ blacklisted_companies: cleaned, ai_prompt: '' });
    revalidatePath('/blacklist');
    return { companies: cleaned };
  } catch (error) {
    return { error: getExceptionMessage(error, true) };
  }
}
