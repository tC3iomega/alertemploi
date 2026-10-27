/**
 * Base email template type
 */
export type EmailTemplateBase = {
  type: EmailTemplateType;
  templateId: string; // This will store the template ID
};
export enum EmailTemplateType {
  welcome = 'welcome',
  trialReminder = 'trialReminder',
  newJobAlert = 'newJobAlert',
}
export type TrialReminderEmailTemplate = EmailTemplateBase & {
  type: EmailTemplateType.trialReminder;
  templateId: 'yzkq3403x034d796';
  payload: {
    badge_text: string;
    title: string;
    subtitle: string;
    intro_text: string;
    show_benefits: boolean;
    show_warning: boolean;
    cta_text: string;
    hero_bg: string;
    hero_border: string;
    badge_bg: string;
    badge_color: string;
  };
};
export type NewJobAlertEmailTemplate = EmailTemplateBase & {
  type: EmailTemplateType.newJobAlert;
  templateId: 'v69oxl53z5kg785k';
  payload: {
    new_jobs_count: number;
    new_jobs: Array<{
      providerName: string;
      title: string;
      url: string;
      description?: string;
      company: string;
      location?: string;
    }>;
  };
};
export type WelcomeEmailTemplate = EmailTemplateBase & {
  type: EmailTemplateType.welcome;
  templateId: '351ndgw5w2rgzqx8';
  payload: Record<string, never>;
};
/**
 * An email whose body is built in code instead of a MailerSend template.
 * Used for the job alerts: no matching template exists in the account (MailerSend answers
 * "The selected template_id is invalid"), and the free plan caps the number of templates.
 */
export type HtmlEmail = {
  type: EmailTemplateType;
  subject: string;
  html: string;
};

export type EmailTemplate = TrialReminderEmailTemplate | NewJobAlertEmailTemplate | WelcomeEmailTemplate;
export type SendableEmail = EmailTemplate | HtmlEmail;

export function isHtmlEmail(email: SendableEmail): email is HtmlEmail {
  return 'html' in email;
}
