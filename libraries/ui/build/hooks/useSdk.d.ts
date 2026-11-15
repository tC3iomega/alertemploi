import type { AlertemploiApiSdk } from "@alertemploi/core";
/**
 * Provider component to inject the SDK into the React tree.
 * Each app (desktop/webapp) must wrap its root with this provider
 * and pass its own SDK implementation.
 */
export declare function SdkProvider({ sdk, children, }: {
    sdk: AlertemploiApiSdk;
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
/**
 * Hook to access the Alertemploi SDK from any component.
 * Must be used within a SdkProvider.
 */
export declare function useSdk(): AlertemploiApiSdk;
//# sourceMappingURL=useSdk.d.ts.map