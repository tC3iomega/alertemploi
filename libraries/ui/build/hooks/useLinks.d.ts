import type { Link, WebPageRuntimeData } from "@alertemploi/core";
type LinksContextType = {
    isLoading: boolean;
    links: Link[];
    linkMap: Record<number, Link>;
    createLink: (newLink: Pick<Link, "title" | "url"> & {
        html: string;
        webPageRuntimeData: WebPageRuntimeData;
        force: boolean;
    }) => Promise<Link>;
    updateLink: (linkId: number, data: {
        title: string;
        url: string;
    }) => Promise<void>;
    removeLink: (linkId: number) => Promise<void>;
    reloadLinks: () => Promise<void>;
};
export declare const LinksContext: import("react").Context<LinksContextType>;
export declare const useLinks: () => LinksContextType;
export declare const LinksProvider: ({ links: initialLinks, children, }: React.PropsWithChildren<{
    links: Link[];
}>) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=useLinks.d.ts.map