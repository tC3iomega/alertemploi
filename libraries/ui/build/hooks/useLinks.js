"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinksProvider = exports.useLinks = exports.LinksContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useError_1 = require("./useError");
const useSdk_1 = require("./useSdk");
// Create the context with an initial default value
exports.LinksContext = (0, react_1.createContext)({
    isLoading: true,
    links: [],
    linkMap: {},
    createLink: async () => {
        throw new Error("createLink not implemented");
    },
    updateLink: async () => {
        throw new Error("updateLink not implemented");
    },
    removeLink: async () => {
        throw new Error("removeLink not implemented");
    },
    reloadLinks: async () => {
        throw new Error("reloadLinks not implemented");
    },
});
// Hook for consuming context
const useLinks = () => {
    const context = (0, react_1.useContext)(exports.LinksContext);
    if (context === undefined) {
        throw new Error("useLinks must be used within a LinksProvider");
    }
    return context;
};
exports.useLinks = useLinks;
// Provider component
const LinksProvider = ({ links: initialLinks, children, }) => {
    const { handleError } = (0, useError_1.useError)();
    const sdk = (0, useSdk_1.useSdk)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(initialLinks.length === 0);
    const [links, setLinks] = (0, react_1.useState)(initialLinks);
    const fetchLinks = async () => {
        try {
            const fetchedLinks = await sdk.listLinks();
            setLinks(fetchedLinks);
            setIsLoading(false);
        }
        catch (error) {
            handleError({ error });
        }
    };
    const linkMap = (0, react_1.useMemo)(() => Object.fromEntries(links.map((link) => [link.id, link])), [links]);
    // Create a new link
    const onCreateLink = async (newLink) => {
        const createdLink = await sdk.createLink(newLink);
        setLinks((currentLinks) => [createdLink, ...currentLinks]);
        return createdLink;
    };
    // Update an existing link
    const onUpdateLink = async (linkId, data) => {
        const updatedLink = await sdk.updateLink({
            linkId,
            title: data.title,
            url: data.url,
        });
        setLinks((currentLinks) => currentLinks.map((link) => link.id === linkId ? { ...link, ...updatedLink } : link));
    };
    // Remove an existing link
    const onRemoveLink = async (linkId) => {
        await sdk.deleteLink(linkId);
        setLinks((currentLinks) => currentLinks.filter((link) => link.id !== linkId));
    };
    // Reload links
    const onReloadLinks = async () => {
        await fetchLinks();
    };
    (0, react_1.useEffect)(() => {
        if (initialLinks.length === 0) {
            fetchLinks();
        }
    }, []);
    return ((0, jsx_runtime_1.jsx)(exports.LinksContext.Provider, { value: {
            isLoading,
            links,
            linkMap,
            createLink: onCreateLink,
            updateLink: onUpdateLink,
            removeLink: onRemoveLink,
            reloadLinks: onReloadLinks,
        }, children: children }));
};
exports.LinksProvider = LinksProvider;
//# sourceMappingURL=useLinks.js.map