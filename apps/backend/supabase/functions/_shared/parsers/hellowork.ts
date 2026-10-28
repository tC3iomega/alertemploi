import { DOMParser, Element } from 'deno-dom-wasm';

import { ILogger } from '../logger.ts';
import { JobSiteParseResult, ParsedJob } from './parserTypes.ts';

/**
 * Parser for HelloWork (hellowork.com).
 * HelloWork renders HTML server-side — job cards are directly in the DOM.
 * URL pattern: /fr-fr/emploi/recherche.html?k={keywords}&l={location}&c={contract}
 */
export function parseHelloWorkJobs({
  siteId,
  html,
  logger,
}: {
  siteId: number;
  html: string;
  logger: ILogger;
}): JobSiteParseResult {
  const document = new DOMParser().parseFromString(html, 'text/html');
  if (!document) throw new Error('Could not parse HelloWork HTML');
  logger.info(`HelloWork HTML preview: ${html.slice(0, 500)}`);

  // Check for no results
  const noResults = document.querySelector('[data-cy="no-result"]') ||
    document.querySelector('.no-result') ||
    document.querySelector('[class*="noResult"]');
  if (noResults) {
    logger.info('HelloWork: no results page detected');
    return { jobs: [], listFound: true, elementsCount: 0 };
  }

  // Job cards use data-cy="serpCard" (structure: li > div > a[data-cy="offerTitle"] > h3)
  let jobElements = Array.from(
    document.querySelectorAll('[data-cy="serpCard"]')
  ) as Element[];

  // Fallback: li elements containing a job link
  if (!jobElements.length) {
    jobElements = Array.from(
      document.querySelectorAll('li')
    ).filter((el) => (el as Element).querySelector('a[href*="/fr-fr/emplois/"]')) as Element[];
  }

  if (!jobElements.length) {
    logger.error('HelloWork: no job cards found');
    return { jobs: [], listFound: false, elementsCount: 0 };
  }

  logger.info(`HelloWork: found ${jobElements.length} job cards`);

  const jobs = jobElements.map((el): ParsedJob | null => {
    // The offer link has data-cy="offerTitle" and href="/fr-fr/emplois/{id}.html"
    const offerLinkEl = (el.querySelector('[data-cy="offerTitle"]') ||
      el.querySelector('a[href*="/fr-fr/emplois/"]')) as Element | null;
    if (!offerLinkEl) return null;

    const href = offerLinkEl.getAttribute('href')?.trim();
    if (!href) return null;

    const externalId = href.split('/').pop()?.replace('.html', '');
    if (!externalId) return null;

    const externalUrl = `https://www.hellowork.com${href.startsWith('/') ? href : '/' + href}`;

    // Title: first span inside h3 (h3 contains title span + company span)
    const h3 = offerLinkEl.querySelector('h3') as Element | null;
    const spans = h3 ? Array.from(h3.querySelectorAll('span')) as Element[] : [];
    const title = spans[0]?.textContent?.trim() || offerLinkEl.getAttribute('title')?.split(' - ')[0]?.trim();
    if (!title) return null;

    // Company name: second span inside h3, or from the title attribute
    const companyName = spans[1]?.textContent?.trim() ||
      offerLinkEl.getAttribute('aria-label')?.match(/chez ([^,]+)/)?.[1]?.trim() ||
      'N/A';

    // Company logo
    const logoEl = el.querySelector('img[src*="/img/entreprises/"]') as Element | null;
    const companyLogo = logoEl?.getAttribute('src') || undefined;

    // Location
    const locationEl = el.querySelector('[data-cy="localisationCard"]');
    const location = locationEl?.textContent?.trim();

    // Contract type
    const contractEl = el.querySelector('[data-cy="contractCard"]');
    const contractText = contractEl?.textContent?.trim();

    // Job type from contract
    const jobTypeLower = contractText?.toLowerCase() ?? '';
    const jobType = jobTypeLower.includes('télétravail') || jobTypeLower.includes('remote')
      ? 'remote'
      : undefined;

    // Salary (HelloWork doesn't always show salary in search results)
    const salaryEl = el.querySelector('[data-cy="salaryCard"], [data-cy="job-salary"]');
    const salary = salaryEl?.textContent?.trim() || undefined;

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
      jobType,
      tags,
      labels: [],
    };
  });

  const validJobs = jobs.filter((job): job is ParsedJob => !!job);
  logger.info(`HelloWork: mapped ${validJobs.length} valid jobs`);

  return {
    jobs: validJobs,
    listFound: true,
    elementsCount: jobElements.length,
  };
}

