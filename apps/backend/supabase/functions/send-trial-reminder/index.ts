import { getExceptionMessage, throwError } from '@alertemploi/core';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';
import { CORS_HEADERS } from '../_shared/cors.ts';
import { parseEnv } from '../_shared/env.ts';
import { EmailTemplateType } from '../_shared/emails/emailTemplates.ts';
import { MailersendMailer } from '../_shared/emails/mailer.ts';
import { createLoggerWithMeta } from '../_shared/logger.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  const logger = createLoggerWithMeta({ function: 'send-trial-reminder' });
  const env = parseEnv();

  const authHeader = req.headers.get('Authorization');
  if (authHeader !== `Bearer ${env.f2aWebhookSecret}`) {
    logger.error('Unauthorized send-trial-reminder call');
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
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const todayStr = now.toISOString().slice(0, 10);
    const in3DaysStr = in3Days.toISOString().slice(0, 10);

    // Every account (basic or pro) gets a trial via trial_ends_at regardless of which plan
    // they picked at signup — there is no 'free' plan in the current pricing model, so
    // filtering on plan='free' matched zero rows and this never sent a single reminder.
    const { data: profiles, error } = await supabaseAdmin.from('profiles').select('user_id, trial_ends_at, plan');

    if (error) throw new Error(error.message);

    let sentCount = 0;

    for (const profile of profiles ?? []) {
      if (!profile.trial_ends_at) continue;
      const trialDateStr = profile.trial_ends_at.slice(0, 10);

      let payload = null;

      if (trialDateStr === in3DaysStr) {
        payload = {
          badge_text: '⏳ 3 jours restants',
          title: 'Votre essai gratuit se termine bientôt',
          subtitle: "Ne perdez pas l'accès à vos alertes Pro",
          intro_text:
            "Votre essai gratuit Pro se termine dans 3 jours. Passez à l'abonnement Pro pour continuer à profiter de toutes les fonctionnalités.",
          show_benefits: true,
          show_warning: false,
          cta_text: 'Continuer avec Pro',
          hero_bg: '#FFFBEB',
          hero_border: '#FCD34D',
          badge_bg: '#FEF3C7',
          badge_color: '#92400E',
        };
      } else if (trialDateStr === todayStr) {
        payload = {
          badge_text: '⚠️ Dernier jour',
          title: "Votre essai gratuit se termine aujourd'hui",
          subtitle: 'Passez à Pro pour ne rien manquer',
          intro_text:
            "C'est le dernier jour de votre essai gratuit. À partir de demain, vos alertes seront limitées au plan gratuit.",
          show_benefits: false,
          show_warning: true,
          cta_text: 'Garder mon accès Pro',
          hero_bg: '#FEF2F2',
          hero_border: '#FECACA',
          badge_bg: '#FEE2E2',
          badge_color: '#B91C1C',
        };
      }

      if (!payload) continue;

      try {
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(profile.user_id);
        if (userError || !userData?.user?.email) {
          logger.error(`Could not find email for user ${profile.user_id}`);
          continue;
        }

        await mailer.sendEmail({
          logger,
          to: userData.user.email,
          template: {
            type: EmailTemplateType.trialReminder,
            templateId: 'yzkq3403x034d796',
            payload,
          },
        });
        sentCount++;
      } catch (sendError) {
        // one recipient failing (bad address, provider quota, ...) must not stop the rest
        // of the batch from getting their reminder
        logger.error(`Failed to send trial reminder for user ${profile.user_id}: ${getExceptionMessage(sendError)}`);
      }
    }

    logger.info(`Sent ${sentCount} trial reminder emails`);
    return new Response(JSON.stringify({ success: true, sentCount }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  } catch (error) {
    logger.error(`Error sending trial reminders: ${getExceptionMessage(error)}`);
    return new Response(JSON.stringify({ error: getExceptionMessage(error) }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      status: 500,
    });
  }
});
