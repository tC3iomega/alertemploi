/**
 * Base email template type
 */
export type EmailTemplateBase = {
  type: EmailTemplateType;
  templateId: string; // This will store the template ID
};

export enum EmailTemplateType {
  searchParsingFailure = 'searchParsingFailure',
  newJobAlert = 'newJobAlert',
}

export type SearchParsingFailureEmailTemplate = EmailTemplateBase & {
  type: EmailTemplateType.searchParsingFailure;
  templateId: 'ynrw7gy813j42k8e';
  payload: {
    links: Array<{ title: string; site_name: string }>;
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

export type EmailTemplate = SearchParsingFailureEmailTemplate | NewJobAlertEmailTemplate;
