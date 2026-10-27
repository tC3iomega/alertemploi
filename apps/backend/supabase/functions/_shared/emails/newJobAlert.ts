import { JobSite } from '@alertemploi/core';
import { getExceptionMessage } from '@alertemploi/core';

import { ILogger } from '../logger.ts';
import { EmailTemplateType } from './emailTemplates.ts';
import { IMailer } from './mailer.ts';

type AdminAuthClient = {
  auth: {
    admin: {
      getUserById: (userId: string) => Promise<{
        data: { user: { email?: string | null } | null } | null;
        error: { message: string } | null;
      }>;
    };
  };
};

export type NewJobForAlert = {
  id: number;
  title: string;
  companyName: string;
  location?: string;
  description?: string;
  siteId: number;
};

/**
 * Sends the "new jobs found" alert email for one user.
 *
 * This is the product's core promise ("recevez un email dès qu'une offre apparaît").
 * It used to live in `post-scan-hook`, which nothing ever called — no database trigger,
 * no caller in cron-scan and none in the webapp — so the alert was never actually sent.
 * It now runs at the end of each cron-scan run, for the jobs that run inserted.
 *
 * Never throws: a failing email must not fail the scan that found the jobs.
 */
export async function sendNewJobsAlertEmail({
  logger,
  mailer,
  supabaseAdminClient,
  userId,
  jobs,
  jobSites,
  webappUrl,
}: {
  logger: ILogger;
  mailer: IMailer;
  // Structural type on purpose: cron-scan builds its client from esm.sh while the shared
  // code uses the npm types, and the two SupabaseClient classes aren't assignable.
  supabaseAdminClient: AdminAuthClient;
  userId: string;
  jobs: NewJobForAlert[];
  jobSites: JobSite[];
  webappUrl: string;
}): Promise<boolean> {
  try {
    if (jobs.length === 0) return false;

    const { data, error } = await supabaseAdminClient.auth.admin.getUserById(userId);
    if (error) throw error;
    const email = data?.user?.email;
    if (!email) {
      logger.info(`no email for user ${userId}, skipping job alert`);
      return false;
    }

    const siteMap = new Map(jobSites.map((site) => [site.id, site]));
    // Keep the email short: the full list is one click away in the app.
    const MAX_JOBS_IN_EMAIL = 10;

    await mailer.sendEmail({
      logger,
      to: email,
      template: {
        type: EmailTemplateType.newJobAlert,
        templateId: 'v69oxl53z5kg785k',
        payload: {
          new_jobs_count: jobs.length,
          new_jobs: jobs.slice(0, MAX_JOBS_IN_EMAIL).map((job) => ({
            providerName: siteMap.get(job.siteId)?.name ?? 'Job board',
            title: job.title,
            url: new URL(`/jobs/${job.id}`, webappUrl).href,
            description: job.description?.slice(0, 200) ?? '',
            company: job.companyName,
            location: job.location,
          })),
        },
      },
    });

    logger.info(`sent new job alert to user ${userId} for ${jobs.length} jobs`);
    return true;
  } catch (error) {
    logger.error(`failed to send new job alert for user ${userId}: ${getExceptionMessage(error)}`);
    return false;
  }
}
