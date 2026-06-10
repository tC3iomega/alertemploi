import type { JobSite } from "@alertemploi/core";
/**
 * Context that stores supported sites.
 */
export declare const SitesContext: import("react").Context<{
    isLoading: boolean;
    sites: JobSite[];
    siteLogos: Record<number, string>;
    siteMap: Record<number, JobSite>;
    reloadSites: () => Promise<void>;
}>;
/**
 * Global hook used to access the supported sites.
 */
export declare const useSites: () => {
    isLoading: boolean;
    sites: JobSite[];
    siteLogos: Record<number, string>;
    siteMap: Record<number, JobSite>;
    reloadSites: () => Promise<void>;
};
export declare const SitesProvider: ({ sites: initialSites, children, }: React.PropsWithChildren<{
    sites: JobSite[];
}>) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=useSites.d.ts.map