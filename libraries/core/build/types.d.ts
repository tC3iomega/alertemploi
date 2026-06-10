export declare enum SiteProvider {
    linkedin = "linkedin",
    glassdoor = "glassdoor",
    indeed = "indeed",
    remoteok = "remoteok",
    weworkremotely = "weworkremotely",
    dice = "dice",
    flexjobs = "flexjobs",
    bestjobs = "bestjobs",
    echojobs = "echojobs",
    remotive = "remotive",
    remoteio = "remoteio",
    builtin = "builtin",
    naukri = "naukri",
    robertHalf = "robertHalf",
    zipRecruiter = "zipRecruiter",
    usaJobs = "usaJobs",
    talent = "talent",
    hiringCafe = "hiringCafe",
    francetravail = "francetravail",
    wttj = "wttj",
    cadremploi = "cadremploi",
    hellowork = "hellowork",
    apec = "apec",
    custom = "custom"
}
export declare const JOB_LABELS: {
    readonly CONSIDERING: "Considering";
    readonly SUBMITTED: "Submitted";
    readonly INTERVIEWING: "Interviewing";
    readonly OFFER: "Offer";
    readonly REJECTED: "Rejected";
    readonly GHOSTED: "Ghosted";
};
export type JobLabel = (typeof JOB_LABELS)[keyof typeof JOB_LABELS];
export type User = {
    id: string;
    email: string;
};
export type JobSite = {
    id: number;
    provider: SiteProvider;
    name: string;
    urls: string[];
    queryParamsToRemove?: string[];
    blacklisted_paths: string[];
    created_at: string;
    logo_url: string;
    deprecated: boolean;
    incognito_support: boolean;
    country: string;
    requires_pro: boolean;
};
export type Link = {
    id: number;
    url: string;
    title: string;
    user_id: string;
    site_id: number;
    created_at: string;
    scrape_failure_count: number;
    last_scraped_at: string;
    scrape_failure_email_sent: boolean;
    is_active: boolean;
};
export type JobType = 'remote' | 'hybrid' | 'onsite';
export type JobStatus = 'new' | 'applied' | 'archived' | 'deleted' | 'processing' | 'excluded_by_advanced_matching';
export type Job = {
    id: number;
    user_id: string;
    externalId: string;
    externalUrl: string;
    siteId: number;
    title: string;
    companyName: string;
    companyLogo?: string;
    jobType?: JobType;
    location?: string;
    salary?: string;
    tags: string[];
    description?: string;
    status: JobStatus;
    labels: JobLabel[];
    created_at: Date;
    updated_at: Date;
    link_id?: number;
    exclude_reason?: string;
};
export type Note = {
    id: number;
    created_at: Date;
    user_id: string;
    job_id: number;
    text: string;
    files: string[];
};
export type SubscriptionTier = 'free' | 'pro';
export type Profile = {
    id: number;
    user_id: string;
    stripe_customer_id?: string;
    stripe_subscription_id?: string;
    plan: SubscriptionTier;
    trial_ends_at: string;
    subscription_ends_at?: string;
    email_alerts_enabled: boolean;
    alert_frequency: string;
    created_at: string;
    updated_at: string;
};
export type AdvancedMatchingConfig = {
    id: number;
    user_id: string;
    blacklisted_companies: string[];
    ai_prompt: string;
    ai_api_cost: number;
    ai_input_tokens_used: number;
    ai_output_tokens_used: number;
};
export type WebPageRuntimeData = Partial<Record<SiteProvider, ProviderRuntimeData>>;
export type LinkedinRuntimeData = {
    type: SiteProvider.linkedin;
    comoRehydration: string;
};
export type ProviderRuntimeData = LinkedinRuntimeData;
export type DbSchema = {
    public: {
        Tables: {
            sites: {
                Row: JobSite;
                Insert: Pick<JobSite, 'name' | 'urls' | 'provider'>;
                Update: never;
                Relationships: [];
            };
            links: {
                Row: Link;
                Insert: Pick<Link, 'url' | 'title' | 'site_id'>;
                Update: {
                    title?: string;
                    url?: string;
                    scrape_failure_count?: number;
                    last_scraped_at?: Date;
                    scrape_failure_email_sent?: boolean;
                    is_active?: boolean;
                };
                Relationships: [];
            };
            jobs: {
                Row: Job;
                Insert: Pick<Job, 'siteId' | 'externalId' | 'externalUrl' | 'title' | 'companyName' | 'companyLogo' | 'location' | 'salary' | 'tags' | 'jobType' | 'status' | 'link_id'>;
                Update: Pick<Job, 'status'> | Pick<Job, 'description'> | Pick<Job, 'labels'>;
                Relationships: [];
            };
            profiles: {
                Row: Profile;
                Insert: never;
                Update: Partial<Pick<Profile, 'stripe_customer_id' | 'stripe_subscription_id' | 'plan' | 'subscription_ends_at' | 'email_alerts_enabled' | 'alert_frequency'>>;
                Relationships: [];
            };
            notes: {
                Row: Note;
                Insert: Pick<Note, 'job_id' | 'text' | 'files'>;
                Update: Partial<Pick<Note, 'text' | 'files'>>;
                Relationships: [];
            };
            reviews: {
                Row: Review;
                Insert: Pick<Review, 'title' | 'description' | 'rating'>;
                Update: Pick<Review, 'title' | 'description' | 'rating'>;
                Relationships: [];
            };
            advanced_matching: {
                Row: AdvancedMatchingConfig;
                Insert: Pick<AdvancedMatchingConfig, 'blacklisted_companies' | 'ai_prompt'>;
                Update: Partial<Pick<AdvancedMatchingConfig, 'blacklisted_companies' | 'ai_prompt'>>;
                Relationships: [];
            };
        };
        Views: {};
        Functions: {
            list_jobs: {
                Params: {
                    jobs_status: JobStatus;
                    jobs_after: string | null;
                    jobs_page_size: number;
                    jobs_search?: string;
                    jobs_site_ids?: number[];
                    jobs_link_ids?: number[];
                    jobs_labels?: string[];
                };
                Args: {};
                Returns: Job[];
            };
            count_jobs: {
                Params: {
                    jobs_status?: JobStatus;
                    jobs_search?: string;
                    jobs_site_ids?: number[];
                    jobs_link_ids?: number[];
                    jobs_labels?: string[];
                };
                Args: {};
                Returns: Array<{
                    status: JobStatus;
                    job_count: number;
                }>;
            };
            is_pro_user: {
                Params: {
                    check_user_id?: string;
                };
                Args: {};
                Returns: boolean;
            };
        };
    };
};
export type Review = {
    id: number;
    user_id: string;
    title: string;
    description?: string;
    rating: number;
    created_at: Date;
};
export type StripeConfig = {
    customerPortalLink: string;
    plans: Array<{
        tier: SubscriptionTier;
        monthlyCheckoutLink: string;
        yearlyCheckoutLink: string;
    }>;
};
//# sourceMappingURL=types.d.ts.map