export const dynamic = 'force-dynamic';

import { getCompanyBlacklist, getProfile } from '../actions';
import { BlacklistClient } from './BlacklistClient';

export default async function BlacklistPage() {
  const [profile, companies] = await Promise.all([getProfile(), getCompanyBlacklist()]);

  // mirrors hasAdvancedMatching in the backend's _shared/subscription.ts
  const isPro =
    profile?.plan === 'pro' && !!profile.subscription_ends_at && new Date(profile.subscription_ends_at) > new Date();

  return <BlacklistClient initialCompanies={companies} isPro={isPro} />;
}
