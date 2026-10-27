import { getExceptionMessage } from '@alertemploi/core';
import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';

import { EmailTemplate, EmailTemplateType, SendableEmail, isHtmlEmail } from '../emails/emailTemplates.ts';
import { ILogger } from '../logger.ts';

/**
 * Interface for mailer services.
 */
export interface IMailer {
  /**
   * Send an email.
   */
  sendEmail(_: { logger: ILogger; from?: string; to: string; template: SendableEmail }): Promise<void>;
}

/**
 * Minimal html -> text fallback for the plain-text part of an email.
 */
function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<\/(p|div|tr|h1|h2|li)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
}

/**
 * Subject line per template — this used to be hardcoded to the welcome subject, so every
 * email (job alerts, trial reminders) landed in the inbox titled "Bienvenue sur Alertemploi".
 */
function getSubject(template: EmailTemplate): string {
  switch (template.type) {
    case EmailTemplateType.newJobAlert: {
      const count = template.payload.new_jobs_count;
      return count === 1 ? '1 nouvelle offre correspond à votre alerte' : `${count} nouvelles offres pour vous`;
    }
    case EmailTemplateType.trialReminder:
      return template.payload.badge_text?.includes('Dernier')
        ? 'Votre essai gratuit se termine aujourd\'hui'
        : 'Votre essai gratuit se termine dans 3 jours';
    case EmailTemplateType.welcome:
    default:
      return 'Bienvenue sur Alertemploi';
  }
}

/**
 * Mailersend-based implementation of the IMailer interface.
 */
export class MailersendMailer implements IMailer {
  private _client: MailerSend;

  /**
   * Class constructor.
   */
  constructor(
    private _apiKey: string,
    private _defaultFromAddress: string,
    private _defaultFromName: string,
  ) {
    this._client = new MailerSend({
      apiKey: this._apiKey,
    });
  }

  /**
   * Send an email using a Mailersend template.
   */
  async sendEmail({
    logger,
    from,
    to,
    template,
  }: {
    logger: ILogger;
    from?: string;
    to: string;
    template: SendableEmail;
  }): Promise<void> {
    try {
      logger.info(`Sending ${template.type} email to ${to} ...`);
      const sentFrom = new Sender(from ?? this._defaultFromAddress, this._defaultFromName);
      const recipients = [new Recipient(to, 'Recipient')];

      let emailParams = new EmailParams().setFrom(sentFrom).setTo(recipients).setReplyTo(sentFrom);

      if (isHtmlEmail(template)) {
        // MailerSend accepts an html-only payload but then produces no actual email
        // (the message shows up with an empty `emails` array and never reaches the
        // inbox), so always send a plain-text part alongside it.
        emailParams = emailParams
          .setSubject(template.subject)
          .setHtml(template.html)
          .setText(template.text ?? htmlToText(template.html));
      } else {
        emailParams = emailParams
          .setSubject(getSubject(template))
          .setTemplateId(template.templateId) // Use the template ID (templateAlias)
          .setPersonalization([{ email: to, data: template.payload }]);
      }

      // Send the email via MailerSend
      await this._client.email.send(emailParams);

      logger.info(`Email sent successfully to ${to}`);
    } catch (error) {
      throw new Error(`Error sending email: ${getExceptionMessage(error)}`);
    }
  }
}
