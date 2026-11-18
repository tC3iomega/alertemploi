import { getExceptionMessage, throwError } from '@alertemploi/core';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';
import { CORS_HEADERS } from '../_shared/cors.ts';
import { parseEnv } from '../_shared/env.ts';
import { EmailTemplateType } from '../_shared/emails/emailTemplates.ts';
import { renderMailerSendTemplate } from '../_shared/emails/renderTemplate.ts';
import { REVIEW_REQUEST_HTML } from '../_shared/emails/reviewRequestTemplate.ts';
import { MailersendMailer } from '../_shared/emails/mailer.ts';
import { createLoggerWithMeta } from '../_shared/logger.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  const logger = createLoggerWithMeta({ function: 'send-review-request' });
  const env = parseEnv();

  const authHeader = req.headers.get('Authorization');
  if (authHeader !== `Bearer ${env.f2aWebhookSecret}`) {
    logger.error('Unauthorized send-review-request call');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);

  try {
    const mailer = new MailersendMailer(
      env.mailerSendApiKey ?? throwError('Mailersend API key is missing'),
      'contact@alertemploi.com',
      'Alertemploi',
    );

    const now = new Date();
    const DAY_MS = 24 * 60 * 60 * 1000;
    // Target: trial ended exactly 3 days ago (J+3 after trial end)
    const target3DaysAgoStr = new Date(now.getTime() - 3 * DAY_MS).toISOString().slice(0, 10);

    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('user_id, trial_ends_at');

    if (error) throw new Error(error.message);

    let sentCount = 0;

    for (const profile of profiles ?? []) {
      if (!profile.trial_ends_at) continue;
      const trialDateStr = profile.trial_ends_at.slice(0, 10);
      if (trialDateStr !== target3DaysAgoStr) continue;

      try {
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(profile.user_id);
        if (userError || !userData?.user?.email) {
          logger.error(`Could not find email for user ${profile.user_id}`);
          continue;
        }

        const reviewUrl = `${env.webappUrl}/avis#formulaire`;
        const unsubscribeUrl = `${env.webappUrl}/account`;

        await mailer.sendEmail({
          logger,
          to: userData.user.email,
          template: {
            type: EmailTemplateType.welcome,
            subject: 'Votre avis sur Alertemploi (2 min)',
            html: renderMailerSendTemplate(REVIEW_REQUEST_HTML, { review_url: reviewUrl, unsubscribe_url: unsubscribeUrl }),
          },
        });
        sentCount++;
      } catch (sendError) {
        logger.error(`Failed to send review request for user ${profile.user_id}: ${getExceptionMessage(sendError)}`);
      }
    }

    logger.info(`Sent ${sentCount} review request emails`);
    return new Response(JSON.stringify({ success: true, sentCount }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  } catch (error) {
    logger.error(`Error sending review requests: ${getExceptionMessage(error)}`);
    return new Response(JSON.stringify({ error: getExceptionMessage(error) }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      status: 500,
    });
  }
});
