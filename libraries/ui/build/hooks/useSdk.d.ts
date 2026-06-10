import type { First2ApplyApiSdk } from "@alertemploi/core";
/**
 * Provider component to inject the SDK into the React tree.
 * Each app (desktop/webapp) must wrap its root with this provider
 * and pass its own SDK implementation.
 */
export declare function SdkProvider({ sdk, children, }: {
    sdk: First2ApplyApiSdk;
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
/**
 * Hook to access the First2Apply SDK from any component.
 * Must be used within a SdkProvider.
 */
export declare function useSdk(): First2ApplyApiSdk;
//# sourceMappingURL=useSdk.d.ts.map