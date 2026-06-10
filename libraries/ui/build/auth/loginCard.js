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
exports.LoginCard = LoginCard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_hook_form_1 = require("react-hook-form");
const button_1 = require("../components/ui/button");
const card_1 = require("../components/ui/card");
const input_1 = require("../components/ui/input");
const form_1 = require("../components/ui/form");
const zod_1 = require("@hookform/resolvers/zod");
const lucide_react_1 = require("lucide-react");
const z = __importStar(require("zod"));
// Schema definition for form validation using Zod
const schema = z.object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
});
function LoginCard({ onLoginWithEmail, isSubmitting, signUpLink, forgotPasswordLink, }) {
    // Initialize form handling with react-hook-form and Zod for schema validation
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(schema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onChange",
        disabled: isSubmitting,
    });
    const onSubmit = (values) => {
        // Check if email and password are present
        if (values.email && values.password) {
            onLoginWithEmail({ email: values.email, password: values.password });
        }
    };
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "min-w-80 space-y-2.5", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-center text-2xl tracking-wide", children: "Log in" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { className: "text-center", children: signUpLink && (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["Don't have an account? ", signUpLink] }) })] }), (0, jsx_runtime_1.jsx)(form_1.Form, { ...form, children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-2.5", children: [(0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "email", render: ({ field }) => ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Email" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, { id: "email", type: "email", placeholder: "name@example.com", ...field }) })] })) }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "password", render: ({ field }) => ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Password" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { className: "flex gap-2", children: (0, jsx_runtime_1.jsx)(input_1.Input, { id: "password", type: "password", ...field }) })] })) })] }), (0, jsx_runtime_1.jsxs)(card_1.CardFooter, { className: "flex flex-col gap-4 pb-7 pt-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { className: "w-full", disabled: !form.formState.isValid || isSubmitting, children: isSubmitting ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "mr-1 h-4 w-4 animate-spin" }), "Logging in"] })) : ("Log in") }), forgotPasswordLink && ((0, jsx_runtime_1.jsx)("div", { className: "justify-self-end", children: forgotPasswordLink }))] })] }) })] }));
}
//# sourceMappingURL=loginCard.js.map