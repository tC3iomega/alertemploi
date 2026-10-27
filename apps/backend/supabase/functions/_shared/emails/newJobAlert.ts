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
  siteId: number;
};

// Keep the email short: the full list is one click away in the app.
const MAX_JOBS_IN_EMAIL = 8;

// The account's "New alert" template. The id previously hardcoded here
// (v69oxl53z5kg785k) came from the upstream fork and does not exist in this account,
// so MailerSend rejected every alert with "The selected template_id is invalid".
const NEW_JOB_ALERT_TEMPLATE_ID = 'ynrw7gy813j42k8e';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Builds the alert email body in code rather than through a MailerSend template: no job
 * alert template exists in the account (MailerSend rejects the send with "The selected
 * template_id is invalid") and the plan caps how many templates can exist.
 */
export function buildNewJobsAlertHtml({
  jobs,
  jobSites,
  webappUrl,
}: {
  jobs: NewJobForAlert[];
  jobSites: JobSite[];
  webappUrl: string;
}): string {
  const siteMap = new Map(jobSites.map((site) => [site.id, site]));
  const shown = jobs.slice(0, MAX_JOBS_IN_EMAIL);
  const remaining = jobs.length - shown.length;
  const feedUrl = new URL('/jobs/list/new', webappUrl).href;

  const rows = shown
    .map((job) => {
      const site = siteMap.get(job.siteId)?.name ?? 'Job board';
      const meta = [job.companyName, job.location].filter((v): v is string => !!v).map(escapeHtml).join(' · ');
      return `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #E2E8F0;">
            <a href="${new URL(`/jobs/${job.id}`, webappUrl).href}"
               style="color:#1E293B;font-size:15px;font-weight:600;text-decoration:none;">${escapeHtml(job.title)}</a>
            <div style="color:#64748B;font-size:13px;margin-top:4px;">${meta}</div>
            <div style="color:#94A3B8;font-size:12px;margin-top:2px;">${escapeHtml(site)}</div>
          </td>
        </tr>`;
    })
    .join('');

  const title =
    jobs.length === 1 ? '1 nouvelle offre correspond à votre alerte' : `${jobs.length} nouvelles offres pour vous`;

  return `<!doctype html>
<html lang="fr"><body style="margin:0;padding:0;background:#F1EFE8;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F1EFE8;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
             style="max-width:560px;background:#FFFFFF;border-radius:12px;padding:28px 24px;">
        <tr><td>
          <div style="font-size:18px;font-weight:700;color:#1E293B;">alert<span style="color:#2563EB;">emploi</span></div>
          <h1 style="font-size:20px;color:#1E293B;margin:20px 0 6px;">${title}</h1>
          <p style="font-size:14px;color:#64748B;margin:0 0 8px;">
            Publiées depuis notre dernier scan. Postulez avant les autres.
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
          ${
            remaining > 0
              ? `<p style="font-size:13px;color:#64748B;margin:16px 0 0;">+ ${remaining} autre${
                  remaining > 1 ? 's' : ''
                } offre${remaining > 1 ? 's' : ''} dans votre tableau de bord.</p>`
              : ''
          }
          <div style="margin:26px 0 8px;">
            <a href="${feedUrl}"
               style="display:inline-block;background:#2563EB;color:#FFFFFF;font-size:15px;font-weight:600;
                      padding:12px 26px;border-radius:9px;text-decoration:none;">Voir les offres</a>
          </div>
          <p style="font-size:12px;color:#94A3B8;margin:22px 0 0;line-height:1.6;">
            Vous recevez cet email parce que vous avez une alerte active sur
            <a href="${new URL('/', webappUrl).href}" style="color:#64748B;">alertemploi.com</a>.
            Vous pouvez désactiver les alertes email depuis votre tableau de bord.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

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

    const subject =
      jobs.length === 1 ? '1 nouvelle offre correspond à votre alerte' : `${jobs.length} nouvelles offres pour vous`;
    const siteMap = new Map(jobSites.map((site) => [site.id, site]));

    try {
      // Preferred path: the account's own "New alert" template (template sends are the
      // only ones observed to actually leave MailerSend on this account).
      await mailer.sendEmail({
        logger,
        to: email,
        template: {
          type: EmailTemplateType.newJobAlert,
          templateId: NEW_JOB_ALERT_TEMPLATE_ID,
          payload: {
            new_jobs_count: jobs.length,
            new_jobs: jobs.slice(0, MAX_JOBS_IN_EMAIL).map((job) => ({
              providerName: siteMap.get(job.siteId)?.name ?? 'Job board',
              title: job.title,
              url: new URL(`/jobs/${job.id}`, webappUrl).href,
              company: job.companyName,
              location: job.location,
            })),
          },
        },
      });
    } catch (templateError) {
      // Fallback so a template problem never silences the alerts again.
      logger.error(`template alert failed, falling back to inline html: ${getExceptionMessage(templateError)}`);
      await mailer.sendEmail({
        logger,
        to: email,
        template: { type: EmailTemplateType.newJobAlert, subject, html: buildNewJobsAlertHtml({ jobs, jobSites, webappUrl }) },
      });
    }

    logger.info(`sent new job alert to user ${userId} for ${jobs.length} jobs`);
    return true;
  } catch (error) {
    logger.error(`failed to send new job alert for user ${userId}: ${getExceptionMessage(error)}`);
    return false;
  }
}
