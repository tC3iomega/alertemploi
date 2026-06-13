"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteJobDialog = DeleteJobDialog;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const alert_dialog_1 = require("../ui/alert-dialog");
const checkbox_1 = require("../ui/checkbox");
let SHOW_DELETE_WARNING = true;
/**
 * Component used to render a delete job confirmation dialog.
 */
function DeleteJobDialog({ isOpen, onClose, onDelete, job, }) {
    /**
     * Effect used to automatically delete the job if the user has disabled the warning.
     */
    react_1.default.useEffect(() => {
        if (isOpen && !SHOW_DELETE_WARNING) {
            onDelete(job);
            onClose();
        }
    }, [isOpen, job, onDelete, onClose]);
    return ((0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialog, { open: isOpen, onOpenChange: (open) => {
            if (!open) {
                onClose();
            }
        }, children: (0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogContent, { children: [(0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogHeader, { children: [(0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogTitle, { children: "Supprimer cette offre ?" }), (0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogDescription, { children: "Cette action est irr\u00E9versible. Cette offre sera d\u00E9finitivement supprim\u00E9e et vous ne pourrez plus la consulter." }), (0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogDescription, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { id: "disable-delete-warning", onCheckedChange: (checked) => {
                                        SHOW_DELETE_WARNING = !checked;
                                    } }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "disable-delete-warning", className: "ml-2 space-y-1 leading-none", children: "Ne plus afficher cet avertissement." })] })] }), (0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogFooter, { children: [(0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogCancel, { children: "Annuler" }), (0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogAction, { className: "bg-destructive hover:bg-destructive/90", onClick: () => onDelete(job), children: "Delete" })] })] }) }));
}
//# sourceMappingURL=deleteJobDialog.js.map