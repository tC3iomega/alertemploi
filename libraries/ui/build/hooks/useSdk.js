"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SdkProvider = SdkProvider;
exports.useSdk = useSdk;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const SdkContext = (0, react_1.createContext)(null);
/**
 * Provider component to inject the SDK into the React tree.
 * Each app (desktop/webapp) must wrap its root with this provider
 * and pass its own SDK implementation.
 */
function SdkProvider({ sdk, children, }) {
    return (0, jsx_runtime_1.jsx)(SdkContext.Provider, { value: sdk, children: children });
}
/**
 * Hook to access the First2Apply SDK from any component.
 * Must be used within a SdkProvider.
 */
function useSdk() {
    const sdk = (0, react_1.useContext)(SdkContext);
    if (!sdk) {
        throw new Error("useSdk must be used within a SdkProvider");
    }
    return sdk;
}
//# sourceMappingURL=useSdk.js.map