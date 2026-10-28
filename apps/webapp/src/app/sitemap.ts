import type { MetadataRoute } from 'next';

import { BOARDS } from './alertes/boards';
import { SITE_URL } from './seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/upgrade`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/alertes`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    ...BOARDS.map((board) => ({
      url: `${SITE_URL}/alertes/${board.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${SITE_URL}/cgv`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/legal`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
