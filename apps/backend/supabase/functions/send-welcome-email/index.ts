import { getExceptionMessage } from '@alertemploi/core';
import { CORS_HEADERS } from '../_shared/cors.ts';
import { getEdgeFunctionContext } from '../_shared/edgeFunctions.ts';
import { EmailTemplateType } from '../_shared/emails/emailTemplates.ts';
import { MailersendMailer } from '../_shared/emails/mailer.ts';
import { createLoggerWithMeta } from '../_shared/logger.ts';
import { throwError } from '@alertemploi/core';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  const logger = createLoggerWithMeta({ function: 'send-welcome-email' });

  try {
    const context = await getEdgeFunctionContext({ logger, req, checkAuthorization: false });
    const { env, supabaseAdminClient } = context;

    const body = await req.json();
    const { email } = body;

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
        payload: {},
      },
    });

    logger.info(`Welcome email sent to ${email}`);
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  } catch (error) {
    logger.error(`Error sending welcome email: ${getExceptionMessage(error)}`);
    return new Response(JSON.stringify({ error: getExceptionMessage(error) }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      status: 500,
    });
  }
});
