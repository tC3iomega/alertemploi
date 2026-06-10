"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.F2aSupabaseApi = void 0;
const exponential_backoff_1 = require("exponential-backoff");
const luxon = __importStar(require("luxon"));
/**
 * Class used to interact with our Supabase API.
 */
class F2aSupabaseApi {
    constructor(_supabase) {
        this._supabase = _supabase;
    }
    /**
     * Create a new user account using an email and password.
     */
    async signupWithEmail({ email, password, }) {
        const { error, data } = await this._supabase.auth.signUp({
            email,
            password,
        });
        if (error)
            throw error;
        return data;
    }
    /**
     * Login using an email and password.
     */
    async loginWithEmail({ email, password, }) {
        return this._supabaseApiCall(() => 
        // @ts-expect-error wrong typings, but works
        this._supabase.auth.signInWithPassword({ email, password }));
    }
    /**
     * Send a password reset email.
     */
    sendPasswordResetEmail({ email }) {
        return this._supabaseApiCall(() => this._supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "alertemploi://reset-password",
        }));
    }
    /**
     * Update the password for the current user.
     */
    updatePassword({ password }) {
        return this._supabaseApiCall(() => 
        // @ts-expect-error wrong typings, but works
        this._supabase.auth.updateUser({ password }));
    }
    /**
     * Logout the current user.
     */
    async logout() {
        const { error } = await this._supabase.auth.signOut();
        if (error)
            throw error;
    }
    /**
     * Get the user from the current supabase session
     */
    getUser() {
        return this._supabaseApiCall(
        // @ts-expect-error wrong typings, but works
        async () => await this._supabase.auth.getUser()).catch(() => ({
            user: null,
        }));
    }
    /**
     * Create a new link.
     */
    async createLink({ title, url, html, webPageRuntimeData, force, }) {
        // for debugging, use a test.html file
        // const htmlFixture = fs.readFileSync(path.join(__dirname, '../../../test.html'), 'utf-8');
        // html = htmlFixture;
        const { link, newJobs } = await this._supabaseApiCall(() => this._supabase.functions.invoke("create-link", {
            body: {
                title,
                url,
                html,
                webPageRuntimeData,
                force,
            },
        }));
        return { link, newJobs };
    }
    /**
     * Update an existing link.
     */
    async updateLink({ linkId, title, url, }) {
        const updatedLink = await this._supabaseApiCall(async () => this._supabase
            .from("links")
            .update({ title, url })
            .eq("id", linkId)
            .select("*")
            .single());
        return updatedLink;
    }
    /**
     * Get all registered links for the current user.
     */
    listLinks() {
        return this._supabaseApiCall(async () => this._supabase.from("links").select("*").order("id", { ascending: false }));
    }
    /**
     * Delete a link.
     */
    deleteLink(linkId) {
        return this._supabaseApiCall(async () => this._supabase.from("links").delete().eq("id", linkId));
    }
    /**
     * Scan a list of htmls for new jobs.
     */
    scanHtmls(htmls) {
        return this._supabaseApiCall(() => this._supabase.functions.invoke("scan-urls", {
            body: {
                htmls,
            },
        }));
    }
    /**
     * Scan HTML for a job description.
     */
    scanJobDescription({ jobId, html, maxRetries, retryCount, }) {
        return this._supabaseApiCall(() => this._supabase.functions.invoke("scan-job-description", {
            body: {
                jobId,
                html,
                maxRetries,
                retryCount,
            },
        }));
    }
    /**
     * Run the post scan hook edge function.
     */
    runPostScanHook({ newJobIds, areEmailAlertsEnabled, }) {
        return this._supabaseApiCall(() => this._supabase.functions.invoke("post-scan-hook", {
            body: {
                newJobIds,
                areEmailAlertsEnabled,
            },
        }));
    }
    /**
     * List all jobs for the current user.
     */
    async listJobs({ status, search, siteIds, linkIds, labels, limit = 50, after, }) {
        const jobs_search = search || undefined;
        const jobs_site_ids = siteIds && siteIds.length > 0 ? siteIds : undefined;
        const jobs_link_ids = linkIds && linkIds.length > 0 ? linkIds : undefined;
        const jobs_labels = labels && labels.length > 0 ? labels : undefined;
        const [jobs, counters] = await Promise.all([
            this._supabaseApiCall(async () => {
                const res = await this._supabase.rpc("list_jobs", {
                    jobs_status: status,
                    jobs_after: after ?? null,
                    jobs_page_size: limit,
                    jobs_search,
                    jobs_site_ids,
                    jobs_link_ids,
                    jobs_labels,
                });
                return res;
            }),
            this._supabaseApiCall(async () => {
                const res = await this._supabase.rpc("count_jobs", {
                    jobs_search,
                    jobs_site_ids,
                    jobs_link_ids,
                    jobs_labels,
                });
                return res;
            }),
        ]);
        let nextPageToken;
        if (jobs.length === limit) {
            // the next page token will include the last id as well as it's last updated_at
            const lastJob = jobs[jobs.length - 1];
            nextPageToken = `${lastJob.id}!${lastJob.updated_at}`;
        }
        const countersMap = new Map(counters.map((c) => [c.status, c.job_count]));
        return {
            jobs,
            new: countersMap.get("new") ?? 0,
            archived: countersMap.get("archived") ?? 0,
            applied: countersMap.get("applied") ?? 0,
            filtered: countersMap.get("excluded_by_advanced_matching") ?? 0,
            nextPageToken,
        };
    }
    /**
     * Update the status of a job.
     */
    updateJobStatus({ jobId, status }) {
        return this._supabaseApiCall(async () => await this._supabase
            .from("jobs")
            .update({
            status,
            updated_at: luxon.DateTime.now().toUTC().toJSDate(),
        })
            .eq("id", jobId));
    }
    /**
     * Update the labels of a job.
     * @returns the updated job
     */
    async updateJobLabels({ jobId, labels, }) {
        const [updatedJob] = await this._supabaseApiCall(async () => await this._supabase
            .from("jobs")
            .update({
            labels,
        })
            .eq("id", jobId)
            .select("*"));
        return updatedJob;
    }
    /**
     * List all sites.
     */
    listSites() {
        return this._supabaseApiCall(async () => await this._supabase.from("sites").select("*"));
    }
    /**
     * Get a job by id.
     */
    async getJob(jobId) {
        const [job] = await this._supabaseApiCall(async () => this._supabase.from("jobs").select("*").eq("id", jobId));
        return job;
    }
    /**
     * Change the status of all jobs with a certain status to another status.
     */
    async changeAllJobStatus({ from, to }) {
        return this._supabaseApiCall(async () => this._supabase
            .from("jobs")
            .update({
            status: to,
            updated_at: luxon.DateTime.now().toUTC().toJSDate(),
        })
            .eq("status", from));
    }
    /**
     * Wrapper around a Supabase method that handles errors.
     */
    async _supabaseApiCall(method) {
        const { data, error } = await (0, exponential_backoff_1.backOff)(async () => {
            const result = await method();
            return result;
        }, {
            numOfAttempts: 5,
            jitter: "full",
            startingDelay: 300,
        });
        if (error)
            throw error;
        // edge functions don't throw errors, instead they return an errorMessage field in the data object
        // work around for this issue https://github.com/supabase/functions-js/issues/45
        if (!!data &&
            typeof data === "object" &&
            "errorMessage" in data &&
            typeof data.errorMessage === "string") {
            throw new Error(data.errorMessage);
        }
        return data;
    }
    /**
     * Create a user review.
     */
    async createReview({ title, description, rating, }) {
        const [createdReview] = await this._supabaseApiCall(async () => await this._supabase
            .from("reviews")
            .insert({
            title: title.trim(),
            description: description?.trim(),
            rating,
        })
            .select("*"));
        return createdReview;
    }
    /**
     * Get user's review.
     */
    async getUserReview() {
        const [review] = await this._supabaseApiCall(async () => await this._supabase.from("reviews").select("*"));
        return review;
    }
    /**
     * Update a user review.
     */
    async updateReview({ id, title, description, rating, }) {
        const [updatedReview] = await this._supabaseApiCall(async () => await this._supabase
            .from("reviews")
            .update({
            title: title.trim(),
            description: description?.trim(),
            rating,
        })
            .eq("id", id)
            .select("*"));
        return updatedReview;
    }
    /**
     * Get the profile of the current user.
     */
    async getProfile() {
        const [profile] = await this._supabaseApiCall(async () => await this._supabase.from("profiles").select("*"));
        return profile;
    }
    /**
     * Create a new note for the current user.
     */
    async createNote({ job_id, text, files, }) {
        const [createdNote] = await this._supabaseApiCall(async () => await this._supabase
            .from("notes")
            .insert({ job_id, text, files })
            .select("*"));
        return createdNote;
    }
    /**
     * Fetch all notes for the current user for a job.
     */
    async listNotes(job_id) {
        return this._supabaseApiCall(async () => this._supabase
            .from("notes")
            .select("*")
            .eq("job_id", job_id)
            .order("created_at", { ascending: false }));
    }
    /**
     * Update an existing note by ID.
     */
    async updateNote({ noteId, text }) {
        return this._supabaseApiCall(async () => this._supabase
            .from("notes")
            .update({ text })
            .eq("id", noteId)
            .select("*")
            .single());
    }
    /**
     * Add a file to a note.
     */
    async addFileToNote({ noteId, file }) {
        const result = await this._supabase
            .from("notes")
            .select("files")
            .eq("id", noteId)
            .single();
        if (result.error) {
            throw result.error;
        }
        const updatedFiles = result.data.files
            ? [...result.data.files, file]
            : [file];
        return this._supabaseApiCall(async () => this._supabase
            .from("notes")
            .update({ files: updatedFiles })
            .eq("id", noteId)
            .single());
    }
    /**
     * Delete a specific note by ID.
     */
    async deleteNote(noteId) {
        return this._supabaseApiCall(async () => this._supabase.from("notes").delete().eq("id", noteId));
    }
    /**
     * Get the advanced matching configuration for the current user.
     */
    async getAdvancedMatchingConfig() {
        const [config] = await this._supabaseApiCall(async () => await this._supabase.from("advanced_matching").select("*"));
        return config;
    }
    /**
     * Update the advanced matching configuration for the current user.
     */
    async updateAdvancedMatchingConfig(config) {
        const [updatedConfig] = await this._supabaseApiCall(async () => await this._supabase
            .from("advanced_matching")
            .upsert(config, {
            onConflict: "user_id",
        })
            .select("*"));
        return updatedConfig;
    }
    /**
     * Increase scrape failure count for a link.
     */
    async increaseScrapeFailureCount({ linkId, failures, }) {
        await this._supabaseApiCall(async () => this._supabase
            .from("links")
            .update({ scrape_failure_count: failures })
            .eq("id", linkId));
    }
}
exports.F2aSupabaseApi = F2aSupabaseApi;
//# sourceMappingURL=supabaseApi.js.map