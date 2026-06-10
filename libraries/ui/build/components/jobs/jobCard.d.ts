import { Job, JobSite } from "@alertemploi/core";
export type JobCardProps = {
    job: Job;
    siteMap: Record<number, JobSite>;
    siteLogos: Record<number, string>;
    onArchive: (job: Job) => void;
    onDelete: (job: Job) => void;
};
export declare function JobCard({ job, siteMap, siteLogos, onArchive, onDelete, }: JobCardProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=jobCard.d.ts.map