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

  // Check for no results
  const noResults = document.querySelector('[data-cy="no-result"]') ||
    document.querySelector('.no-result') ||
    document.querySelector('[class*="noResult"]');
  if (noResults) {
    logger.info('HelloWork: no results page detected');
    return { jobs: [], listFound: true, elementsCount: 0 };
  }
// Job cards are <li> elements with data-cy="job-card" or inside a job list
  let jobElements = Array.from(
    document.querySelectorAll('[data-cy="job-card"]')
  ) as Element[];

  // Fallback: look for the standard job list structure
  if (!jobElements.length) {
    const jobList = document.querySelector('[data-cy="job-list"]') ||
      document.querySelector('ul[class*="JobList"]') ||
      document.querySelector('ul[class*="job-list"]');
    if (jobList) {
      jobElements = Array.from((jobList as Element).querySelectorAll('li')) as Element[];
    }
  }

  // Second fallback: article tags with job links
  if (!jobElements.length) {
    jobElements = Array.from(
      document.querySelectorAll('li:has(a[href*="/fr-fr/emplois/"])')
    ) as Element[];
  }

  if (!jobElements.length) {
    logger.error('HelloWork: no job cards found');
    return { jobs: [], listFound: false, elementsCount: 0 };
  }

  logger.info(`HelloWork: found ${jobElements.length} job cards`);
const jobs = jobElements.map((el): ParsedJob | null => {
    // External URL and ID
    const linkEl = el.querySelector('a[href*="/fr-fr/emplois/"]') as Element | null;
    if (!linkEl) return null;

    const href = linkEl.getAttribute('href')?.trim();
    if (!href) return null;

    const externalId = href.split('/').pop()?.replace('.html', '');
    if (!externalId) return null;

    const externalUrl = `https://www.hellowork.com${href.startsWith('/') ? href : '/' + href}`;

    // Title — inside h3 > a or h2 > a
    const titleEl = el.querySelector('h3 a, h2 a, [data-cy="job-title"]');
    const title = titleEl?.textContent?.trim();
    if (!title) return null;

    // Company name
    const companyEl = el.querySelector('[data-cy="company-name"], [class*="company"], .tw-typo-m');
    const companyName = companyEl?.textContent?.trim() || 'N/A';

    // Company logo
    const logoEl = el.querySelector('img[src*="/img/entreprises/"]') as Element | null;
    const companyLogo = logoEl?.getAttribute('src') || undefined;

    // Location
    const locationEl = el.querySelector('[data-cy="job-location"], [class*="location"], [class*="ville"]');
    const location = locationEl?.textContent?.trim();

    // Contract type
    const contractEl = el.querySelector('[data-cy="job-contract"], [class*="contract"], [class*="contrat"]');
    const contractText = contractEl?.textContent?.trim();

    // Job type from contract
    const jobTypeLower = contractText?.toLowerCase() ?? '';
    const jobType = jobTypeLower.includes('télétravail') || jobTypeLower.includes('remote')
      ? 'remote'
      : undefined;

    // Salary
    const salaryEl = el.querySelector('[data-cy="job-salary"], [class*="salary"], [class*="salaire"]');
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
