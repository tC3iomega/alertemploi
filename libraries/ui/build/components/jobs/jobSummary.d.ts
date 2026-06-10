import { Job, JobLabel, JobStatus } from "@alertemploi/core";
/**
 * Job summary component.
 */
export declare function JobSummary({ job, onView, onUpdateJobStatus, onUpdateLabels, onOpenUrl, }: {
    job: Job;
    onView: (job: Job) => void;
    onUpdateJobStatus: (jobId: number, status: JobStatus) => void;
    onUpdateLabels: (jobId: number, labels: JobLabel[]) => void;
    onOpenUrl: (url: string) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=jobSummary.d.ts.map