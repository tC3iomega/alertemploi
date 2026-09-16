import { AdvancedMatchingConfig, DbSchema, Job, JobStatus } from '@alertemploi/core';
import { SupabaseClient } from '@supabase/supabasefork';

import { ILogger } from './logger.ts';
import { checkUserSubscription } from './subscription.ts';

/**
 * Apply all the advanced matching rules to the given job and
 * determine if it should be excluded from the user's feed.
 *
 * Only the company blacklist is applied: the AI exclusion filter (`chatgpt_prompt`)
 * was removed since no LLM provider is configured for this deployment.
 */
export async function applyAdvancedMatchingFilters({
  logger,
  supabaseClient,
  supabaseAdminClient,
  job,
}: {
  logger: ILogger;
  supabaseClient: SupabaseClient<DbSchema, 'public'>;
  supabaseAdminClient: SupabaseClient<DbSchema, 'public'>;
  job: Job;
}): Promise<{ newStatus: JobStatus; excludeReason?: string }> {
  logger.info(`applying advanced matching filters to job ${job.id} ...`);
  // check if the user has advanced matching enabled
  const { hasAdvancedMatching } = await checkUserSubscription({
    supabaseAdminClient,
    userId: job.user_id,
  });
  if (!hasAdvancedMatching) {
    logger.info('user does not have advanced matching enabled');
    return { newStatus: 'new' };
  }

  // load the advanced matching config for this user
  const { data: advancedMatchingArr, error: getAdvancedMatchingErr } = await supabaseClient
    .from('advanced_matching')
    .select('*')
    .eq('user_id', job.user_id);
  if (getAdvancedMatchingErr) {
    throw getAdvancedMatchingErr;
  }
  const advancedMatching: AdvancedMatchingConfig = advancedMatchingArr?.[0];
  if (!advancedMatching) {
    logger.info(`advanced matching config not found for user ${job.user_id}`);
    return { newStatus: 'new' };
  }

  // exclude jobs from specific companies if it fully matches the entire company name
  if (isExcludedCompany({ companyName: job.companyName, advancedMatching })) {
    logger.info(`job excluded due to company name: ${job.companyName}`);
    return {
      newStatus: 'excluded_by_advanced_matching',
      excludeReason: `${job.companyName} is blacklisted.`,
    };
  }

  logger.info('job passed all advanced matching filters');
  return { newStatus: 'new' };
}

/**
 * Check if the company name is excluded by the advanced matching filters.
 */
export function isExcludedCompany({
  companyName,
  advancedMatching,
}: {
  companyName: string;
  advancedMatching: AdvancedMatchingConfig;
}): boolean {
  const excludedCompanies = advancedMatching.blacklisted_companies.map((c) => c.toLowerCase());
  const lowerCaseCompanyName = companyName.toLowerCase();
  return excludedCompanies.some((c) => lowerCaseCompanyName === c);
}
