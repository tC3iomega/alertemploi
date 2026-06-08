import { DOMParser, Element } from 'deno-dom-wasm';

import { ILogger } from '../logger.ts';
import { JobSiteParseResult, ParsedJob } from './parserTypes.ts';

/**
 * Parser for Cadremploi (cadremploi.fr).
 * Cadremploi renders HTML server-side — job cards are in the DOM.
 * URL pattern: /emploi/liste_offres.html?kw={keywords}&cl={location}
 * Each job links to: /emploi/offres/detail/annonce-{id}.html
 */
export function parseCadremploiJobs({
  siteId,
  html,
  logger,
}: {
  siteId: number;
  html: string;
  logger: ILogger;
}): JobSiteParseResult {
  const document = new DOMParser().parseFromString(html, 'text/html');
  if (!document) throw new Error('Could not parse Cadremploi HTML');

  // Check for no results
  const noResults =
    document.querySelector('[class*="no-result"]') ||
    document.querySelector('[class*="noResult"]') ||
    document.querySelector('[class*="empty-result"]');
  if (noResults) {
    logger.info('Cadremploi: no results page detected');
    return { jobs: [], listFound: true, elementsCount: 0 };
  }
// Job cards — Cadremploi uses article tags or li with job data
  let jobElements = Array.from(
    document.querySelectorAll('article[data-id]')
  ) as Element[];

  // Fallback: li elements with job links
  if (!jobElements.length) {
    jobElements = Array.from(
      document.querySelectorAll('li[data-id]')
    ) as Element[];
  }

  // Fallback: any element with a link to /emploi/offres/
  if (!jobElements.length) {
    const jobList =
      document.querySelector('[class*="job-list"]') ||
      document.querySelector('[class*="offer-list"]') ||
      document.querySelector('[class*="liste-offres"]') ||
      document.querySelector('main ul') ||
      document.querySelector('#liste-offres');
    if (jobList) {
      jobElements = Array.from(
        (jobList as Element).querySelectorAll('li, article')
      ) as Element[];
    }
  }

  // Last fallback: any element containing a link to an offer
  if (!jobElements.length) {
    jobElements = Array.from(
      document.querySelectorAll('li:has(a[href*="/offres/detail/"])')
    ) as Element[];
  }

  if (!jobElements.length) {
    logger.error('Cadremploi: no job cards found');
    return { jobs: [], listFound: false, elementsCount: 0 };
  }

  logger.info(`Cadremploi: found ${jobElements.length} job cards`);
const jobs = jobElements.map((el): ParsedJob | null => {
    // External ID from data-id attribute
    const externalId =
      el.getAttribute('data-id') ||
      el.querySelector('a[href*="/offres/detail/"]')
        ?.getAttribute('href')
        ?.match(/annonce-([\w-]+)\.html/)?.[1] ||
      el.querySelector('a[href*="/offre-"]')
        ?.getAttribute('href')
        ?.split('/').pop()?.replace('.html', '');

    if (!externalId) return null;

    // External URL
    const linkEl = el.querySelector(
      'a[href*="/offres/detail/"], a[href*="/offre-"], a[href*="/emploi/"]'
    ) as Element | null;
    const href = linkEl?.getAttribute('href')?.trim();
    if (!href) return null;

    const externalUrl = href.startsWith('http')
      ? href
      : `https://www.cadremploi.fr${href}`;

    // Title
    const titleEl = el.querySelector(
      'h2 a, h3 a, h2, h3, [class*="title"], [class*="titre"]'
    );
    const title = titleEl?.textContent?.trim();
    if (!title) return null;

    // Company
    const companyEl = el.querySelector(
      '[class*="company"], [class*="entreprise"], [class*="employer"]'
    );
    const companyName = companyEl?.textContent?.trim() || 'N/A';

    // Location
    const locationEl = el.querySelector(
      '[class*="location"], [class*="localisation"], [class*="ville"]'
    );
    const location = locationEl?.textContent?.trim();

    // Contract type
    const contractEl = el.querySelector(
      '[class*="contract"], [class*="contrat"], [class*="type"]'
    );
    const contractText = contractEl?.textContent?.trim();

    // Salary
    const salaryEl = el.querySelector(
      '[class*="salary"], [class*="salaire"], [class*="remuneration"]'
    );
    const salary = salaryEl?.textContent?.trim() || undefined;

    // Company logo
    const logoEl = el.querySelector('img[src*="logo"], img[class*="logo"]') as Element | null;
    const companyLogo = logoEl?.getAttribute('src') || undefined;

    const tags: string[] = contractText ? [contractText] : [];

    return {
      siteId,
      externalId,
      externalUrl,
      title,
      companyName,
      companyLogo,
      location,
      salary,
      jobType: undefined,
      tags,
      labels: [],
    };
  });

  const validJobs = jobs.filter((job): job is ParsedJob => !!job);
  logger.info(`Cadremploi: mapped ${validJobs.length} valid jobs`);

  return {
    jobs: validJobs,
    listFound: true,
    elementsCount: jobElements.length,
  };
}
