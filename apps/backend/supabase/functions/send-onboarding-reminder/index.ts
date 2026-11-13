import { getExceptionMessage, throwError } from '@alertemploi/core';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';
import { CORS_HEADERS } from '../_shared/cors.ts';
import { parseEnv } from '../_shared/env.ts';
import { EmailTemplateType } from '../_shared/emails/emailTemplates.ts';
import { ONBOARDING_HTML, ONBOARDING_TEXT } from '../_shared/emails/onboardingTemplate.ts';
import { MailersendMailer } from '../_shared/emails/mailer.ts';
import { createLoggerWithMeta } from '../_shared/logger.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  const logger = createLoggerWithMeta({ function: 'send-onboarding-reminder' });
  const env = parseEnv();

  const authHeader = req.headers.get('Authorization');
  if (authHeader !== `Bearer ${env.f2aWebhookSecret}`) {
    logger.error('Unauthorized send-onboarding-reminder call');
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
    // Window: users who signed up between 60 and 90 minutes ago
    const windowStart = new Date(now.getTime() - 90 * 60 * 1000).toISOString();
    const windowEnd = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

    // Find profiles created in this window that have no links yet
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('user_id')
      .gte('created_at', windowStart)
      .lte('created_at', windowEnd);

    if (profilesError) throw new Error(profilesError.message);
    if (!profiles || profiles.length === 0) {
      logger.info('No new signups in the H+1 window');
      return new Response(JSON.stringify({ success: true, sentCount: 0 }), {
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    // Filter out those who already have at least one link
    const userIds = profiles.map((p) => p.user_id);
    const { data: existingLinks, error: linksError } = await supabaseAdmin
      .from('links')
      .select('user_id')
      .in('user_id', userIds);

    if (linksError) throw new Error(linksError.message);

    const usersWithLinks = new Set((existingLinks ?? []).map((l) => l.user_id));
    const targetUserIds = userIds.filter((id) => !usersWithLinks.has(id));

    if (targetUserIds.length === 0) {
      logger.info('All new signups in window already have a link — nothing to send');
      return new Response(JSON.stringify({ success: true, sentCount: 0 }), {
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    let sentCount = 0;

    for (const userId of targetUserIds) {
      try {
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
        if (userError || !userData?.user?.email) {
          logger.error(`Could not find email for user ${userId}`);
          continue;
        }

        await mailer.sendEmail({
          logger,
          to: userData.user.email,
          template: {
            type: EmailTemplateType.welcome,
            subject: "Créez votre première alerte emploi",
            html: ONBOARDING_HTML,
            text: ONBOARDING_TEXT,
          },
        });
        sentCount++;
      } catch (sendError) {
        logger.error(`Failed to send onboarding email for user ${userId}: ${getExceptionMessage(sendError)}`);
      }
    }

    logger.info(`Sent ${sentCount} onboarding reminder emails`);
    return new Response(JSON.stringify({ success: true, sentCount }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  } catch (error) {
    logger.error(`Error sending onboarding reminders: ${getExceptionMessage(error)}`);
    return new Response(JSON.stringify({ error: getExceptionMessage(error) }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      status: 500,
    });
  }
});
