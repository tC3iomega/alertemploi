import type { MetadataRoute } from 'next';

import { BOARDS } from './alertes/boards';
import { JOBS } from './metiers/jobs';
import { SITE_URL } from './seo';

// Dates fixes : évite de signaler un changement à chaque déploiement et gaspiller le budget de crawl.
const STATIC_DATE = new Date('2026-11-01');
const LEGAL_DATE = new Date('2026-07-01');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: STATIC_DATE, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/upgrade`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/alertes`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.9 },
    ...BOARDS.map((board) => ({
      url: `${SITE_URL}/alertes/${board.slug}`,
      lastModified: STATIC_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${SITE_URL}/metiers`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.9 },
    ...JOBS.map((job) => ({
      url: `${SITE_URL}/metiers/${job.slug}`,
      lastModified: STATIC_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${SITE_URL}/comparatif`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/cgv`, lastModified: LEGAL_DATE, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/legal`, lastModified: LEGAL_DATE, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: LEGAL_DATE, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
