"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsList = JobsList;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_infinite_scroll_component_1 = __importDefault(require("react-infinite-scroll-component"));
const useSites_1 = require("../../hooks/useSites");
const utils_1 = require("../../lib/utils");
const deleteJobDialog_1 = require("./deleteJobDialog");
const icons_1 = require("../icons");
const jobCard_1 = require("./jobCard");
/**
 * List of jobs component.
 */
function JobsList({ jobs, selectedJobId, hasMore, parentContainerId, onLoadMore, onSelect, onArchive, onDelete, enableKeyboardNavigation = false, }) {
    const { siteLogos, siteMap, isLoading: isLoadingSites } = (0, useSites_1.useSites)();
    const [jobToDelete, setJobToDelete] = (0, react_1.useState)();
    const [scrollToIndex, setScrollToIndex] = (0, react_1.useState)();
    const itemRefs = (0, react_1.useMemo)(() => jobs.map(() => (0, react_1.createRef)()), [jobs]);
    const selectedIndex = jobs.findIndex((job) => job.id === selectedJobId);
    (0, react_1.useEffect)(() => {
        if (scrollToIndex === undefined) {
            return;
        }
        const timer = setTimeout(() => {
            const selectedRef = itemRefs[scrollToIndex];
            if (selectedRef.current) {
                selectedRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                setScrollToIndex(undefined);
            }
        }, 50);
        return () => clearTimeout(timer);
    }, [scrollToIndex, itemRefs]);
    // Keyboard navigation (only enabled for desktop app)
    (0, react_1.useEffect)(() => {
        if (!enableKeyboardNavigation)
            return;
        const handleKeyDown = (e) => {
            // Navigate down
            if (e.key === "ArrowDown" && selectedIndex < jobs.length - 1) {
                const nextIndex = selectedIndex + 1;
                onSelect(jobs[nextIndex]);
                setScrollToIndex(nextIndex);
            }
            // Navigate up
            else if (e.key === "ArrowUp" && selectedIndex > 0) {
                const prevIndex = selectedIndex - 1;
                onSelect(jobs[prevIndex]);
                setScrollToIndex(prevIndex);
            }
            // Archive job
            else if ((e.metaKey || e.ctrlKey) && e.key === "a") {
                e.preventDefault();
                if (selectedJobId) {
                    const jobToArchive = jobs.find((job) => job.id === selectedJobId);
                    if (jobToArchive && jobToArchive.status !== "archived") {
                        onArchive(jobToArchive);
                    }
                }
            }
            // Delete job
            else if ((e.metaKey || e.ctrlKey) && e.key === "d") {
                e.preventDefault();
                if (selectedJobId) {
                    const jobToDelete = jobs.find((job) => job.id === selectedJobId);
                    if (jobToDelete) {
                        setJobToDelete(jobToDelete);
                    }
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [
        enableKeyboardNavigation,
        selectedIndex,
        jobs,
        selectedJobId,
        onSelect,
        onArchive,
    ]);
    const isLoading = isLoadingSites;
    if (isLoading) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_infinite_scroll_component_1.default, { dataLength: jobs.length, next: onLoadMore, hasMore: hasMore, loader: (0, jsx_runtime_1.jsx)(icons_1.Icons.spinner2, {}), scrollThreshold: 0.8, scrollableTarget: parentContainerId, children: (0, jsx_runtime_1.jsx)("ul", { children: jobs.map((job, index) => {
                        return ((0, jsx_runtime_1.jsxs)("li", { className: (0, utils_1.cn)("rounded-lg px-5 pt-6", selectedJobId === job.id && "bg-muted"), ref: itemRefs[index], onClick: () => onSelect(job), children: [(0, jsx_runtime_1.jsx)(jobCard_1.JobCard, { job: job, siteMap: siteMap, siteLogos: siteLogos, onArchive: onArchive, onDelete: onDelete }), (0, jsx_runtime_1.jsx)("hr", { className: "mt-6 w-full border-muted" })] }, job.id));
                    }) }) }), jobToDelete && ((0, jsx_runtime_1.jsx)(deleteJobDialog_1.DeleteJobDialog, { isOpen: !!jobToDelete, job: jobToDelete, onClose: () => setJobToDelete(undefined), onDelete: onDelete }))] }));
}
//# sourceMappingURL=jobsList.js.map