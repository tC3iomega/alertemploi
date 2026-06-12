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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSummary = JobSummary;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_icons_1 = require("@radix-ui/react-icons");
const react_1 = __importStar(require("react"));
const labels_1 = require("../../lib/labels");
const core_1 = require("@alertemploi/core");
const useSites_1 = require("../../hooks/useSites");
const useLinks_1 = require("../../hooks/useLinks");
const avatar_1 = require("../ui/avatar");
const button_1 = require("../ui/button");
const select_1 = require("../ui/select");
const tooltip_1 = require("../ui/tooltip");
const useToast_1 = require("../../hooks/useToast");
const deleteJobDialog_1 = require("./deleteJobDialog");
const clsx_1 = __importDefault(require("clsx"));
function isJobLabel(value) {
    return Object.values(core_1.JOB_LABELS).includes(value);
}
/**
 * Job summary component.
 */
function JobSummary({ job, onView, onUpdateJobStatus, onUpdateLabels, onOpenUrl, }) {
    const { siteLogos } = (0, useSites_1.useSites)();
    const { links } = (0, useLinks_1.useLinks)();
    const usedLink = (0, react_1.useMemo)(() => {
        return links.find((l) => l.id === job.link_id);
    }, [links, job.link_id]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = react_1.default.useState(false);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full rounded-lg border border-muted p-4 lg:p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between gap-4 lg:gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [usedLink && ((0, jsx_runtime_1.jsxs)("a", { className: "flex items-center gap-2 text-sm text-muted-foreground", href: "#", onClick: (e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    onOpenUrl(usedLink.url);
                                }, children: [(0, jsx_runtime_1.jsx)("img", { src: siteLogos[usedLink.site_id], alt: usedLink.title, className: "h-5" }), (0, jsx_runtime_1.jsxs)("span", { children: [" via ", usedLink.title] })] })), (0, jsx_runtime_1.jsx)("h1", { className: "mt-3 text-wrap font-medium lg:mt-4 lg:text-xl", children: job.title }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-muted-foreground", children: [job.companyName, job.location && ((0, jsx_runtime_1.jsxs)("span", { children: [" · ", job.location] }))] })] }), job.companyLogo && ((0, jsx_runtime_1.jsx)(avatar_1.Avatar, { className: "h-16 w-16", children: (0, jsx_runtime_1.jsx)(avatar_1.AvatarImage, { src: job.companyLogo }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-3 space-y-1.5 lg:mt-4", children: [job.jobType && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 capitalize text-muted-foreground", children: [(0, jsx_runtime_1.jsx)(react_icons_1.BackpackIcon, { className: "h-4 w-4" }), job.jobType] })), job.salary && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 text-muted-foreground", children: [(0, jsx_runtime_1.jsx)(react_icons_1.CookieIcon, { className: "h-4 w-4" }), job.salary] })), job.tags.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 text-muted-foreground", children: [(0, jsx_runtime_1.jsx)(react_icons_1.ListBulletIcon, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-wrap", children: job.tags?.slice(0, 5).join(", ") })] }))] }), job.status === "excluded_by_advanced_matching" && job.exclude_reason && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-6 rounded-md bg-destructive/10 p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(react_icons_1.InfoCircledIcon, { className: "h-auto w-5" }), (0, jsx_runtime_1.jsx)("p", { className: "font-medium", children: "Pourquoi cette offre a-t-elle \u00E9t\u00E9 exclue ?" })] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1", children: job.exclude_reason })] })), (0, jsx_runtime_1.jsxs)("div", { className: `mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between ${job.status !== "excluded_by_advanced_matching" && "lg:mt-10"}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between gap-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { size: "lg", className: "w-24 text-sm", onClick: () => {
                                    onView(job);
                                }, children: "Voir" }), job.status !== "applied" && ((0, jsx_runtime_1.jsx)(tooltip_1.TooltipProvider, { delayDuration: 500, children: (0, jsx_runtime_1.jsxs)(tooltip_1.Tooltip, { children: [(0, jsx_runtime_1.jsx)(tooltip_1.TooltipTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(button_1.Button, { size: "lg", variant: "secondary", className: "w-10 border-none bg-border px-0 transition-colors duration-200 ease-in-out hover:bg-foreground/15 focus:bg-foreground/15", onClick: () => onUpdateJobStatus(job.id, "applied"), children: (0, jsx_runtime_1.jsx)(react_icons_1.CheckIcon, { className: "h-5 w-auto" }) }) }), (0, jsx_runtime_1.jsx)(tooltip_1.TooltipContent, { side: "bottom", className: "text-base", children: "Marquer comme postul\u00E9e" })] }) })), job.status !== "new" && ((0, jsx_runtime_1.jsx)(tooltip_1.TooltipProvider, { delayDuration: 500, children: (0, jsx_runtime_1.jsxs)(tooltip_1.Tooltip, { children: [(0, jsx_runtime_1.jsx)(tooltip_1.TooltipTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(button_1.Button, { size: "lg", variant: "secondary", className: "w-10 border-none bg-border px-0 transition-colors duration-200 ease-in-out hover:bg-foreground/15 focus:bg-foreground/15", onClick: () => onUpdateJobStatus(job.id, "new"), children: (0, jsx_runtime_1.jsx)(react_icons_1.ResetIcon, { className: "h-4 w-auto" }) }) }), (0, jsx_runtime_1.jsx)(tooltip_1.TooltipContent, { side: "bottom", className: "text-base", children: "Remettre dans Nouvelles" })] }) })), job.status !== "archived" && ((0, jsx_runtime_1.jsx)(tooltip_1.TooltipProvider, { delayDuration: 500, children: (0, jsx_runtime_1.jsxs)(tooltip_1.Tooltip, { children: [(0, jsx_runtime_1.jsx)(tooltip_1.TooltipTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(button_1.Button, { size: "lg", variant: "secondary", className: "w-10 border-none bg-border px-0 transition-colors duration-200 ease-in-out hover:bg-foreground/15 focus:bg-foreground/15", onClick: () => onUpdateJobStatus(job.id, "archived"), children: (0, jsx_runtime_1.jsx)(react_icons_1.ArchiveIcon, { className: "h-4 w-auto" }) }) }), (0, jsx_runtime_1.jsx)(tooltip_1.TooltipContent, { side: "bottom", className: "text-base", children: "Archiver" })] }) })), (0, jsx_runtime_1.jsx)(tooltip_1.TooltipProvider, { delayDuration: 500, children: (0, jsx_runtime_1.jsxs)(tooltip_1.Tooltip, { children: [(0, jsx_runtime_1.jsx)(tooltip_1.TooltipTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(button_1.Button, { size: "lg", variant: "secondary", className: "w-10 border-none bg-border px-0 transition-colors duration-200 ease-in-out hover:bg-foreground/15 focus:bg-foreground/15", onClick: (evt) => {
                                                    evt.stopPropagation();
                                                    navigator.clipboard.writeText(job.externalUrl);
                                                    (0, useToast_1.toast)({
                                                        title: "Lien copié",
                                                        description: "Vous pouvez maintenant le coller.",
                                                        variant: "success",
                                                    });
                                                }, children: (0, jsx_runtime_1.jsx)(react_icons_1.CopyIcon, { className: "h-4 w-auto" }) }) }), (0, jsx_runtime_1.jsx)(tooltip_1.TooltipContent, { side: "bottom", className: "text-base", children: "Copier le lien" })] }) }), (0, jsx_runtime_1.jsx)(tooltip_1.TooltipProvider, { delayDuration: 500, children: (0, jsx_runtime_1.jsxs)(tooltip_1.Tooltip, { children: [(0, jsx_runtime_1.jsx)(tooltip_1.TooltipTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(button_1.Button, { size: "lg", variant: "destructive", className: "w-10 bg-destructive/10 px-0 transition-colors duration-200 ease-in-out hover:bg-destructive/20 focus:bg-destructive/20", onClick: () => setIsDeleteDialogOpen(true), children: (0, jsx_runtime_1.jsx)(react_icons_1.TrashIcon, { className: "h-5 w-auto text-destructive" }) }) }), (0, jsx_runtime_1.jsx)(tooltip_1.TooltipContent, { side: "bottom", className: "text-base", children: "Supprimer" })] }) }), (0, jsx_runtime_1.jsx)(deleteJobDialog_1.DeleteJobDialog, { isOpen: isDeleteDialogOpen, job: job, onClose: () => setIsDeleteDialogOpen(false), onDelete: () => onUpdateJobStatus(job.id, "deleted") })] }), (0, jsx_runtime_1.jsx)(JobLabelSelector, { className: "w-full sm:ml-16", job: job, onUpdateLabels: onUpdateLabels })] }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-2 text-xs text-foreground/80", children: ["d\u00E9tect\u00E9e ", (0, core_1.getRelativeTimeString)(new Date(job.created_at))] })] }));
}
/**
 * Label selector component. For now we only allow setting one label per job.
 */
function JobLabelSelector({ job, onUpdateLabels, className, }) {
    const label = job.labels[0] ?? "";
    const LabelOptionWithColor = ({ jobLabel, colorClass, }) => ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: jobLabel, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: `h-3 w-3 rounded-full ${colorClass}` }), (0, jsx_runtime_1.jsx)("div", { className: "ml-2 flex-1", children: jobLabel })] }) }));
    return ((0, jsx_runtime_1.jsxs)(select_1.Select, { value: label, onValueChange: (labelValue) => {
            const newLabels = isJobLabel(labelValue) ? [labelValue] : [];
            onUpdateLabels(job.id, newLabels);
        }, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: (0, clsx_1.default)("h-10 w-[148px] focus:ring-0", className), children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "\u00C9tiquette" }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(LabelOptionWithColor, { jobLabel: "Aucune", colorClass: "bg-background" }), Object.values(core_1.JOB_LABELS).map((jobLabel) => ((0, jsx_runtime_1.jsx)(LabelOptionWithColor, { jobLabel: jobLabel, colorClass: labels_1.LABEL_COLOR_CLASSES[jobLabel] }, jobLabel)))] })] }));
}
//# sourceMappingURL=jobSummary.js.map