import { JobLabel } from "@alertemploi/core";
export declare const LABEL_COLOR_CLASSES: Record<JobLabel, string>;
/**
 * Libellés affichés. Les valeurs stockées en base restent en anglais (JOB_LABELS), pour
 * ne pas avoir à migrer les lignes `jobs.labels` existantes.
 */
export declare const LABEL_FR: Record<JobLabel, string>;
export declare function formatJobType(jobType?: string): string | undefined;
//# sourceMappingURL=labels.d.ts.map