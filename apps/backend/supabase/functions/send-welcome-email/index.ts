import { getExceptionMessage } from '@alertemploi/core';
import { CORS_HEADERS } from '../_shared/cors.ts';
import { getEdgeFunctionContext } from '../_shared/edgeFunctions.ts';
import { EmailTemplateType } from '../_shared/emails/emailTemplates.ts';
import { MailersendMailer } from '../_shared/emails/mailer.ts';
import { createLoggerWithMeta } from '../_shared/logger.ts';
import { throwError } from '@alertemploi/core';

function getJwtRole(req: Request): string | undefined {
  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  const payload = token?.split('.')[1];
  if (!payload) return undefined;
  try {
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(payload.length / 4) * 4, '='));
    return JSON.parse(json).role;
  } catch {
    return undefined;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  const logger = createLoggerWithMeta({ function: 'send-welcome-email' });

  // Only the `on_user_signup` database webhook (auth.users INSERT) may trigger this: it calls
  // with a service_role JWT. Without this check, anyone holding the public anon key could send
  // our welcome email to arbitrary addresses (burning MailerSend quota and domain reputation).
  // The gateway has already verified the JWT signature (verify_jwt = true in config.toml), so
  // the role claim can be trusted here.
  if (getJwtRole(req) !== 'service_role') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      status: 401,
    });
  }

  try {
    const context = await getEdgeFunctionContext({ logger, req, checkAuthorization: false });
    const { env, supabaseAdminClient } = context;

    const body = await req.json();
    const { email } = body.record ?? body;

    if (!email) throw new Error('Missing email');

    const mailer = new MailersendMailer(
      env.mailerSendApiKey ?? throwError('Mailersend API key is missing'),
      'contact@alertemploi.com',
      'Alertemploi',
    );

    await mailer.sendEmail({
      logger,
      to: email,
      template: {
        type: EmailTemplateType.welcome,
        templateId: '351ndgw5w2rgzqx8',
        payload: { name: email.split('@')[0] },
      },
    });

    logger.info(`Welcome email sent to ${email}`);
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  } catch (error) {
    logger.error(`Error sending welcome email: ${getExceptionMessage(error)}`);
    return new Response(JSON.stringify({ error: 'Failed to send welcome email' }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      status: 500,
    });
  }
});
