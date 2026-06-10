"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitesProvider = exports.useSites = exports.SitesContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useError_1 = require("./useError");
const useSdk_1 = require("./useSdk");
/**
 * Context that stores supported sites.
 */
exports.SitesContext = (0, react_1.createContext)({
    isLoading: true,
    sites: [],
    siteLogos: {},
    siteMap: {},
    reloadSites: async () => { },
});
/**
 * Global hook used to access the supported sites.
 */
const useSites = () => {
    const sites = (0, react_1.useContext)(exports.SitesContext);
    if (sites === undefined) {
        throw new Error("useSites must be used within a SitesProvider");
    }
    return sites;
};
exports.useSites = useSites;
// Create a provider for the sites
const SitesProvider = ({ sites: initialSites, children, }) => {
    const { handleError } = (0, useError_1.useError)();
    const sdk = (0, useSdk_1.useSdk)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(initialSites.length === 0);
    const [sites, setSites] = (0, react_1.useState)(initialSites);
    const fetchSites = async () => {
        try {
            setSites(await sdk.listSites());
            setIsLoading(false);
        }
        catch (error) {
            handleError({ error });
        }
    };
    const siteLogos = Object.fromEntries(sites.map((site) => [site.id, site.logo_url]));
    const siteMap = Object.fromEntries(sites.map((site) => [site.id, site]));
    const onReloadSites = async () => {
        await fetchSites();
    };
    (0, react_1.useEffect)(() => {
        if (initialSites.length === 0) {
            fetchSites();
        }
    }, []);
    return ((0, jsx_runtime_1.jsx)(exports.SitesContext.Provider, { value: {
            isLoading,
            sites,
            siteLogos,
            siteMap,
            reloadSites: onReloadSites,
        }, children: children }));
};
exports.SitesProvider = SitesProvider;
//# sourceMappingURL=useSites.js.map