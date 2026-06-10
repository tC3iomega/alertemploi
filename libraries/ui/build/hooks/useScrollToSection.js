"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScrollToSection = useScrollToSection;
const react_1 = require("react");
function useScrollToSection(offset) {
    const scrollToSection = (0, react_1.useCallback)((elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    }, [offset]);
    return scrollToSection;
}
//# sourceMappingURL=useScrollToSection.js.map