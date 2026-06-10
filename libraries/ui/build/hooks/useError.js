"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useError = useError;
const react_1 = require("react");
const core_1 = require("@alertemploi/core");
const useToast_1 = require("./useToast");
/**
 * Hook used to handle errors.
 */
function useError() {
    const { toast } = (0, useToast_1.useToast)();
    const [error, setError] = (0, react_1.useState)(null);
    const handleError = ({ error, title = "Oops, something went wrong!", silent = false, }) => {
        console.error((0, core_1.getExceptionMessage)(error));
        if (!silent) {
            toast({
                title,
                description: (0, core_1.getExceptionMessage)(error, true),
                variant: "destructive",
            });
        }
        setError(error);
    };
    const resetError = () => {
        setError(null);
    };
    return { error, handleError, resetError };
}
//# sourceMappingURL=useError.js.map