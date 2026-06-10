import { AdvancedMatchingConfig, DbSchema, Job, JobLabel, JobStatus, Link, WebPageRuntimeData } from "@alertemploi/core";
import { SupabaseClient, User } from "@supabase/supabase-js";
/**
 * Class used to interact with our Supabase API.
 */
export declare class F2aSupabaseApi {
    private _supabase;
    constructor(_supabase: SupabaseClient<DbSchema>);
    /**
     * Create a new user account using an email and password.
     */
    signupWithEmail({ email, password, }: {
        email: string;
        password: string;
    }): Promise<{
        user: User | null;
        session: import("@supabase/supabase-js").AuthSession | null;
    }>;
    /**
     * Login using an email and password.
     */
    loginWithEmail({ email, password, }: {
        email: string;
        password: string;
    }): Promise<{
        user: User;
        session: import("@supabase/supabase-js").AuthSession;
        weakPassword?: import("@supabase/supabase-js").WeakPassword;
    }>;
    /**
     * Send a password reset email.
     */
    sendPasswordResetEmail({ email }: {
        email: string;
    }): Promise<{}>;
    /**
     * Update the password for the current user.
     */
    updatePassword({ password }: {
        password: string;
    }): Promise<{
        user: User;
    }>;
    /**
     * Logout the current user.
     */
    logout(): Promise<void>;
    /**
     * Get the user from the current supabase session
     */
    getUser(): Promise<{
        user: User | null;
    }>;
    /**
     * Create a new link.
     */
    createLink({ title, url, html, webPageRuntimeData, force, }: {
        title: string;
        url: string;
        html: string;
        webPageRuntimeData: WebPageRuntimeData;
        force: boolean;
    }): Promise<{
        link: Link;
        newJobs: Job[];
    }>;
    /**
     * Update an existing link.
     */
    updateLink({ linkId, title, url, }: {
        linkId: number;
        title: string;
        url: string;
    }): Promise<Link>;
    /**
     * Get all registered links for the current user.
     */
    listLinks(): Promise<Link[]>;
    /**
     * Delete a link.
     */
    deleteLink(linkId: number): Promise<null>;
    /**
     * Scan a list of htmls for new jobs.
     */
    scanHtmls(htmls: {
        linkId: number;
        content: string;
        webPageRuntimeData: WebPageRuntimeData;
        maxRetries: number;
        retryCount: number;
    }[]): Promise<{
        newJobs: Job[];
        parseFailed: boolean;
    }>;
    /**
     * Scan HTML for a job description.
     */
    scanJobDescription({ jobId, html, maxRetries, retryCount, }: {
        jobId: number;
        html: string;
        maxRetries: number;
        retryCount: number;
    }): Promise<{
        job: Job;
        parseFailed: boolean;
    }>;
    /**
     * Run the post scan hook edge function.
     */
    runPostScanHook({ newJobIds, areEmailAlertsEnabled, }: {
        newJobIds: number[];
        areEmailAlertsEnabled: boolean;
    }): Promise<null>;
    /**
     * List all jobs for the current user.
     */
    listJobs({ status, search, siteIds, linkIds, labels, limit, after, }: {
        status: JobStatus;
        search?: string;
        siteIds?: number[];
        linkIds?: number[];
        labels?: string[];
        limit?: number;
        after?: string;
    }): Promise<{
        jobs: Job[];
        new: number;
        archived: number;
        applied: number;
        filtered: number;
        nextPageToken: string | undefined;
    }>;
    /**
     * Update the status of a job.
     */
    updateJobStatus({ jobId, status }: {
        jobId: number;
        status: JobStatus;
    }): Promise<null>;
    /**
     * Update the labels of a job.
     * @returns the updated job
     */
    updateJobLabels({ jobId, labels, }: {
        jobId: number;
        labels: JobLabel[];
    }): Promise<{
        title: string;
        id: number;
        status: JobStatus;
        location?: string | undefined;
        description?: string | undefined;
        user_id: string;
        created_at: Date;
        externalId: string;
        externalUrl: string;
        siteId: number;
        companyName: string;
        companyLogo?: string | undefined;
        jobType?: import("@alertemploi/core").JobType | undefined;
        salary?: string | undefined;
        tags: string[];
        labels: JobLabel[];
        updated_at: Date;
        link_id?: number | undefined;
        exclude_reason?: string | undefined;
    }>;
    /**
     * List all sites.
     */
    listSites(): Promise<{
        id: number;
        name: string;
        country: string;
        created_at: string;
        provider: import("@alertemploi/core").SiteProvider;
        urls: string[];
        queryParamsToRemove?: string[] | undefined;
        blacklisted_paths: string[];
        logo_url: string;
        deprecated: boolean;
        incognito_support: boolean;
        requires_pro: boolean;
    }[]>;
    /**
     * Get a job by id.
     */
    getJob(jobId: number): Promise<{
        title: string;
        id: number;
        status: JobStatus;
        location?: string | undefined;
        description?: string | undefined;
        user_id: string;
        created_at: Date;
        externalId: string;
        externalUrl: string;
        siteId: number;
        companyName: string;
        companyLogo?: string | undefined;
        jobType?: import("@alertemploi/core").JobType | undefined;
        salary?: string | undefined;
        tags: string[];
        labels: JobLabel[];
        updated_at: Date;
        link_id?: number | undefined;
        exclude_reason?: string | undefined;
    }>;
    /**
     * Change the status of all jobs with a certain status to another status.
     */
    changeAllJobStatus({ from, to }: {
        from: JobStatus;
        to: JobStatus;
    }): Promise<null>;
    /**
     * Wrapper around a Supabase method that handles errors.
     */
    private _supabaseApiCall;
    /**
     * Create a user review.
     */
    createReview({ title, description, rating, }: {
        title: string;
        description?: string;
        rating: number;
    }): Promise<{
        title: string;
        id: number;
        description?: string | undefined;
        user_id: string;
        created_at: Date;
        rating: number;
    }>;
    /**
     * Get user's review.
     */
    getUserReview(): Promise<{
        title: string;
        id: number;
        description?: string | undefined;
        user_id: string;
        created_at: Date;
        rating: number;
    }>;
    /**
     * Update a user review.
     */
    updateReview({ id, title, description, rating, }: {
        id: number;
        title: string;
        description?: string;
        rating: number;
    }): Promise<{
        title: string;
        id: number;
        description?: string | undefined;
        user_id: string;
        created_at: Date;
        rating: number;
    }>;
    /**
     * Get the profile of the current user.
     */
    getProfile(): Promise<{
        id: number;
        user_id: string;
        created_at: string;
        updated_at: string;
        stripe_customer_id?: string | undefined;
        stripe_subscription_id?: string | undefined;
        plan: import("@alertemploi/core").SubscriptionTier;
        trial_ends_at: string;
        subscription_ends_at?: string | undefined;
        email_alerts_enabled: boolean;
        alert_frequency: string;
    }>;
    /**
     * Create a new note for the current user.
     */
    createNote({ job_id, text, files, }: {
        job_id: number;
        text: string;
        files: string[];
    }): Promise<{
        id: number;
        created_at: Date;
        user_id: string;
        job_id: number;
        text: string;
        files: string[];
    }>;
    /**
     * Fetch all notes for the current user for a job.
     */
    listNotes(job_id: number): Promise<{
        id: number;
        created_at: Date;
        user_id: string;
        job_id: number;
        text: string;
        files: string[];
    }[]>;
    /**
     * Update an existing note by ID.
     */
    updateNote({ noteId, text }: {
        noteId: number;
        text: string;
    }): Promise<null>;
    /**
     * Add a file to a note.
     */
    addFileToNote({ noteId, file }: {
        noteId: number;
        file: string;
    }): Promise<null>;
    /**
     * Delete a specific note by ID.
     */
    deleteNote(noteId: number): Promise<null>;
    /**
     * Get the advanced matching configuration for the current user.
     */
    getAdvancedMatchingConfig(): Promise<{
        id: number;
        user_id: string;
        blacklisted_companies: string[];
        ai_prompt: string;
        ai_api_cost: number;
        ai_input_tokens_used: number;
        ai_output_tokens_used: number;
    }>;
    /**
     * Update the advanced matching configuration for the current user.
     */
    updateAdvancedMatchingConfig(config: Pick<AdvancedMatchingConfig, "ai_prompt" | "blacklisted_companies">): Promise<{
        id: number;
        user_id: string;
        blacklisted_companies: string[];
        ai_prompt: string;
        ai_api_cost: number;
        ai_input_tokens_used: number;
        ai_output_tokens_used: number;
    }>;
    /**
     * Increase scrape failure count for a link.
     */
    increaseScrapeFailureCount({ linkId, failures, }: {
        linkId: number;
        failures: number;
    }): Promise<void>;
}
//# sourceMappingURL=supabaseApi.d.ts.map