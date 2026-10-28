import type { MetadataRoute } from 'next';

import { SITE_URL } from './seo';

/**
 * Les pages applicatives (tableau de bord, offres, alertes, authentification) n'ont aucun
 * intérêt en résultat de recherche et redirigent vers l'accueil sans session : les exclure
 * évite de gaspiller le budget de crawl et d'indexer des redirections.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/jobs', '/links', '/blacklist', '/menu', '/auth/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
