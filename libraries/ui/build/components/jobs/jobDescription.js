"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobDescription = JobDescription;
const jsx_runtime_1 = require("react/jsx-runtime");
const rehype_raw_1 = __importDefault(require("rehype-raw"));
const remark_gfm_1 = __importDefault(require("remark-gfm"));
const react_markdown_1 = __importDefault(require("react-markdown"));
function JobDescription({ job }) {
    if (job.description) {
        return (
        // Description has been fetched
        (0, jsx_runtime_1.jsx)(react_markdown_1.default, { remarkPlugins: [remark_gfm_1.default], rehypePlugins: [rehype_raw_1.default], className: "job-description-md", children: job.description }));
    }
    return (
    // Description failed to fetch
    (0, jsx_runtime_1.jsxs)("div", { className: "mt-20 text-center", children: [(0, jsx_runtime_1.jsx)("p", { className: "", children: "La description de cette offre n'a pas pu \u00EAtre r\u00E9cup\u00E9r\u00E9e." }), (0, jsx_runtime_1.jsx)("p", { children: "Vous pouvez la consulter directement sur le site du job board." }), (0, jsx_runtime_1.jsxs)("svg", { width: "240", height: "160", viewBox: "0 0 680 380", xmlns: "http://www.w3.org/2000/svg", style: { margin: "32px auto 0", display: "block" }, children: [(0, jsx_runtime_1.jsx)("circle", { cx: "340", cy: "190", r: "110", fill: "#F1EFE8" }), (0, jsx_runtime_1.jsx)("rect", { x: "280", y: "100", width: "120", height: "160", rx: "8", fill: "#FFFFFF", stroke: "#E2E8F0", strokeWidth: "1.5" }), (0, jsx_runtime_1.jsx)("line", { x1: "300", y1: "135", x2: "380", y2: "135", stroke: "#CBD5E1", strokeWidth: "3", strokeLinecap: "round" }), (0, jsx_runtime_1.jsx)("line", { x1: "300", y1: "155", x2: "380", y2: "155", stroke: "#CBD5E1", strokeWidth: "3", strokeLinecap: "round" }), (0, jsx_runtime_1.jsx)("line", { x1: "300", y1: "175", x2: "360", y2: "175", stroke: "#CBD5E1", strokeWidth: "3", strokeLinecap: "round" }), (0, jsx_runtime_1.jsx)("line", { x1: "300", y1: "200", x2: "380", y2: "200", stroke: "#E2E8F0", strokeWidth: "3", strokeLinecap: "round" }), (0, jsx_runtime_1.jsx)("line", { x1: "300", y1: "220", x2: "365", y2: "220", stroke: "#E2E8F0", strokeWidth: "3", strokeLinecap: "round" }), (0, jsx_runtime_1.jsx)("circle", { cx: "395", cy: "225", r: "32", fill: "none", stroke: "#2563EB", strokeWidth: "5" }), (0, jsx_runtime_1.jsx)("line", { x1: "418", y1: "248", x2: "442", y2: "272", stroke: "#2563EB", strokeWidth: "6", strokeLinecap: "round" }), (0, jsx_runtime_1.jsx)("circle", { cx: "437", cy: "120", r: "10", fill: "#F59E0B" })] })] }));
}
//# sourceMappingURL=jobDescription.js.map