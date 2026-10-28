import { JOB_LABELS, JobLabel } from "@alertemploi/core"

export const LABEL_COLOR_CLASSES: Record<JobLabel, string> = {
  [JOB_LABELS.CONSIDERING]: "bg-violet-500",
  [JOB_LABELS.SUBMITTED]: "bg-green-500",
  [JOB_LABELS.INTERVIEWING]: "bg-yellow-500",
  [JOB_LABELS.OFFER]: "bg-blue-500",
  [JOB_LABELS.REJECTED]: "bg-red-500",
  [JOB_LABELS.GHOSTED]: "bg-gray-500",
}

/**
 * Libellés affichés. Les valeurs stockées en base restent en anglais (JOB_LABELS), pour
 * ne pas avoir à migrer les lignes `jobs.labels` existantes.
 */
export const LABEL_FR: Record<JobLabel, string> = {
  [JOB_LABELS.CONSIDERING]: "À étudier",
  [JOB_LABELS.SUBMITTED]: "Postulé",
  [JOB_LABELS.INTERVIEWING]: "Entretien",
  [JOB_LABELS.OFFER]: "Offre reçue",
  [JOB_LABELS.REJECTED]: "Refusé",
  [JOB_LABELS.GHOSTED]: "Sans réponse",
}

/**
 * Les job boards renvoient le type de contrat en anglais et parfois combiné
 * ("fulltime, internship"). Affiché tel quel, ça jurait dans une interface française.
 */
const JOB_TYPE_FR: Record<string, string> = {
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
}

export function formatJobType(jobType?: string): string | undefined {
  if (!jobType) return undefined
  return jobType
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
    .map((part) => JOB_TYPE_FR[part] ?? part)
    .join(" · ")
}
