"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LABEL_FR = exports.LABEL_COLOR_CLASSES = void 0;
exports.formatJobType = formatJobType;
const core_1 = require("@alertemploi/core");
exports.LABEL_COLOR_CLASSES = {
    [core_1.JOB_LABELS.CONSIDERING]: "bg-violet-500",
    [core_1.JOB_LABELS.SUBMITTED]: "bg-green-500",
    [core_1.JOB_LABELS.INTERVIEWING]: "bg-yellow-500",
    [core_1.JOB_LABELS.OFFER]: "bg-blue-500",
    [core_1.JOB_LABELS.REJECTED]: "bg-red-500",
    [core_1.JOB_LABELS.GHOSTED]: "bg-gray-500",
};
/**
 * Libellés affichés. Les valeurs stockées en base restent en anglais (JOB_LABELS), pour
 * ne pas avoir à migrer les lignes `jobs.labels` existantes.
 */
exports.LABEL_FR = {
    [core_1.JOB_LABELS.CONSIDERING]: "À étudier",
    [core_1.JOB_LABELS.SUBMITTED]: "Postulé",
    [core_1.JOB_LABELS.INTERVIEWING]: "Entretien",
    [core_1.JOB_LABELS.OFFER]: "Offre reçue",
    [core_1.JOB_LABELS.REJECTED]: "Refusé",
    [core_1.JOB_LABELS.GHOSTED]: "Sans réponse",
};
/**
 * Les job boards renvoient le type de contrat en anglais et parfois combiné
 * ("fulltime, internship"). Affiché tel quel, ça jurait dans une interface française.
 */
const JOB_TYPE_FR = {
    fulltime: "Temps plein",
    "full-time": "Temps plein",
    parttime: "Temps partiel",
    "part-time": "Temps partiel",
    internship: "Stage / alternance",
    contract: "Freelance",
    temporary: "Intérim",
    remote: "Télétravail",
    hybrid: "Hybride",
    onsite: "Sur site",
};
function formatJobType(jobType) {
    if (!jobType)
        return undefined;
    return jobType
        .split(",")
        .map((part) => part.trim().toLowerCase())
        .filter(Boolean)
        .map((part) => JOB_TYPE_FR[part] ?? part)
        .join(" · ");
}
//# sourceMappingURL=labels.js.map