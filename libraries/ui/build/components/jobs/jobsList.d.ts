import { Job } from "@alertemploi/core";
/**
 * List of jobs component.
 */
export declare function JobsList({ jobs, selectedJobId, hasMore, parentContainerId, onLoadMore, onSelect, onArchive, onDelete, enableKeyboardNavigation, }: {
    jobs: Job[];
    selectedJobId?: number;
    hasMore: boolean;
    parentContainerId: string;
    onLoadMore: () => void;
    onSelect: (job: Job) => void;
    onArchive: (job: Job) => void;
    onDelete: (job: Job) => void;
    enableKeyboardNavigation?: boolean;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=jobsList.d.ts.map