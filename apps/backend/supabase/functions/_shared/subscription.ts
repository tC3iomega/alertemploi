import { DbSchema, Profile } from '@alertemploi/core';
import { SupabaseClient } from '@supabase/supabasefork';

/**
 * Retrieve the user profile and check if his subscription/trial allows access.
 */
export async function checkUserSubscription({
  supabaseAdminClient,
  userId,
}: {
  supabaseAdminClient: SupabaseClient<DbSchema, 'public'>;
  userId: string;
}): Promise<{
  profile: Profile;
  subscriptionHasExpired: boolean;
  hasAdvancedMatching: boolean;
  hasCustomJobsParsing: boolean;
}> {
  const { data: profile, error } = await supabaseAdminClient
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw error;
  }

  if (!profile) {
    throw new Error('Profile not found');
  }

  const now = new Date();
  const trialActive = profile.trial_ends_at ? new Date(profile.trial_ends_at) > now : false;
  const subscriptionActive = profile.subscription_ends_at ? new Date(profile.subscription_ends_at) > now : true;
  const hasPaidPlan = profile.plan === 'basic' || profile.plan === 'pro';

  // Access is allowed if: trial is still active, OR has a paid plan with active subscription
  const hasAccess = trialActive || (hasPaidPlan && subscriptionActive);
  const subscriptionHasExpired = !hasAccess;

  const hasProTier = profile.plan === 'pro' && subscriptionActive;

  return {
    profile,
    subscriptionHasExpired,
    hasAdvancedMatching: hasProTier,
    hasCustomJobsParsing: hasProTier,
  };
}
