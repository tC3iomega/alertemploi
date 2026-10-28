import { DOMParser } from 'deno-dom-wasm';

import { ILogger } from '../logger.ts';
import { JobSiteParseResult, ParsedJob } from './parserTypes.ts';

interface WTTJAlgoliaHit {
  objectID: string;
  slug: string;
  name: string;
  contract_type?: string;
  remote?: string;
  offices?: Array<{ city?: string; country_code?: string }>;
  salary?: { min?: number; max?: number; currency?: string; period?: string };
  organization?: { name?: string; slug?: string; logo?: string };
}

interface WTTJNextData {
  props?: {
    pageProps?: {
      jobs?: WTTJAlgoliaHit[];
      initialResults?: { hits?: WTTJAlgoliaHit[]; nbHits?: number };
      dehydratedState?: {
        queries?: Array<{
          queryKey?: unknown[];
          state?: { data?: { pages?: Array<{ jobs?: WTTJAlgoliaHit[] }> } };
        }>;
      };
    };
  };
}
function mapContractType(remote?: string): ParsedJob['jobType'] {
  if (remote === 'fulltime') return 'remote';
  if (remote === 'partial') return 'hybrid';
  return 'onsite';
}

function formatSalary(salary?: WTTJAlgoliaHit['salary']): string | undefined {
  if (!salary?.min && !salary?.max) return undefined;
  const currency = salary.currency === 'EUR' ? '€' : (salary.currency ?? '');
  const period = salary.period === 'yearly' ? '/an' : salary.period === 'monthly' ? '/mois' : '';
  const min = salary.min ? `${Math.round(salary.min / 1000)}K` : '';
  const max = salary.max ? `${Math.round(salary.max / 1000)}K` : '';
  const range = min && max ? `${min} - ${max}` : min || max;
  return `${range} ${currency}${period}`.trim();
}

function mapHit(hit: WTTJAlgoliaHit, siteId: number): ParsedJob | null {
  if (!hit.objectID || !hit.name) return null;

  const companySlug = hit.organization?.slug;
  const jobSlug = hit.slug;
  if (!companySlug || !jobSlug) return null;

  const externalUrl = `https://www.welcometothejungle.com/fr/companies/${companySlug}/jobs/${jobSlug}`;
  const companyName = hit.organization?.name ?? 'N/A';
  const location = hit.offices?.map((o) => o.city).filter(Boolean).join(', ');
  const salary = formatSalary(hit.salary);
  const jobType = mapContractType(hit.remote);

  const tags: string[] = [];
  if (hit.contract_type) tags.push(hit.contract_type.replace('_', ' '));
  if (hit.remote && hit.remote !== 'no') {
    tags.push(hit.remote === 'fulltime' ? 'Full remote' : 'Télétravail partiel');
  }

  return {
    siteId,
    externalId: hit.objectID,
    externalUrl,
    title: hit.name.trim(),
    companyName,
    companyLogo: hit.organization?.logo ?? undefined,
    location,
    salary,
    jobType,
    tags,
    labels: [],
  };
}
export function parseWTTJJobs({
  siteId,
  html,
  logger,
}: {
  siteId: number;
  html: string;
  logger: ILogger;
}): JobSiteParseResult {
  const document = new DOMParser().parseFromString(html, 'text/html');
  if (!document) throw new Error('Could not parse WTTJ HTML');

  const nextDataEl = document.querySelector('script#__NEXT_DATA__');
  if (!nextDataEl?.textContent) {
    // WTTJ App Router: no __NEXT_DATA__, try DOM-based parsing
    logger.info('WTTJ: no __NEXT_DATA__, trying DOM parsing (App Router)');
    return parseWTTJJobsFromDom({ siteId, document, logger });
  }

  let nextData: WTTJNextData;
  try {
    nextData = JSON.parse(nextDataEl.textContent);
  } catch {
    logger.error('WTTJ: failed to parse __NEXT_DATA__ JSON');
    return { jobs: [], listFound: false, elementsCount: 0 };
  }

  const pageProps = nextData?.props?.pageProps;
  if (!pageProps) {
    logger.error('WTTJ: no pageProps found in __NEXT_DATA__');
    return { jobs: [], listFound: false, elementsCount: 0 };
  }

  let hits: WTTJAlgoliaHit[] = [];

  if (pageProps.initialResults?.hits?.length) {
    hits = pageProps.initialResults.hits;
    logger.info(`WTTJ: found ${hits.length} jobs in initialResults.hits`);
  }

  if (!hits.length && pageProps.dehydratedState?.queries) {
    for (const query of pageProps.dehydratedState.queries) {
      const pages = query.state?.data?.pages;
      if (pages) {
        const allJobs = pages.flatMap((p) => p.jobs ?? []);
        if (allJobs.length > 0) {
          hits = allJobs as WTTJAlgoliaHit[];
          logger.info(`WTTJ: found ${hits.length} jobs in dehydratedState`);
          break;
        }
      }
    }
  }

  if (!hits.length && pageProps.jobs?.length) {
    hits = pageProps.jobs as WTTJAlgoliaHit[];
    logger.info(`WTTJ: found ${hits.length} jobs in pageProps.jobs`);
  }

  if (!hits.length) {
    const noResultsEl = document.querySelector('[data-testid="no-results"]');
    if (noResultsEl) {
      return { jobs: [], listFound: true, elementsCount: 0 };
    }
    // No __NEXT_DATA__ hits — try DOM-based parsing (App Router / rendered page)
    return parseWTTJJobsFromDom({ siteId, document, logger });
  }

  const jobs = hits
    .map((hit) => mapHit(hit, siteId))
    .filter((job): job is ParsedJob => !!job);

  logger.info(`WTTJ: mapped ${jobs.length} valid jobs out of ${hits.length}`);

  return { jobs, listFound: true, elementsCount: hits.length };
}

function parseWTTJJobsFromDom({
  siteId,
  document,
  logger,
}: {
  siteId: number;
  document: ReturnType<DOMParser['parseFromString']>;
  logger: ILogger;
}): JobSiteParseResult {
  // WTTJ App Router: job cards link to /fr/companies/{company}/jobs/{slug}
  // Find all such anchor elements (rendered by Algolia InstantSearch)
  const jobLinks = Array.from(
    document!.querySelectorAll('a[href*="/fr/companies/"][href*="/jobs/"]')
  ) as import('deno-dom-wasm').Element[];

  // Deduplicate by href
  const seen = new Set<string>();
  const uniqueLinks = jobLinks.filter((a) => {
    const href = a.getAttribute('href') ?? '';
    if (seen.has(href)) return false;
    seen.add(href);
    return true;
  });

  if (!uniqueLinks.length) {
    logger.error('WTTJ: no job links found in DOM (page may not have loaded yet)');
    return { jobs: [], listFound: false, elementsCount: 0 };
  }

  logger.info(`WTTJ DOM: found ${uniqueLinks.length} unique job links`);

  const jobs = uniqueLinks.map((a): ParsedJob | null => {
    const href = a.getAttribute('href')?.trim() ?? '';
    // Extract slugs: /fr/companies/{company}/jobs/{job}
    const match = href.match(/\/fr\/companies\/([^/]+)\/jobs\/([^/?#]+)/);
    if (!match) return null;

    const [, companySlug, jobSlug] = match;
    const externalId = jobSlug;
    const externalUrl = `https://www.welcometothejungle.com${href.startsWith('/') ? href : '/' + href}`;

    // Title: look for h3 or h2 or strong or the link's own text
    const titleEl = a.querySelector('h3, h2, strong') ?? a;
    const rawTitle = titleEl.textContent?.trim() ?? '';
    // Remove company name if it's repeated — first line tends to be the title
    const title = rawTitle.split('\n')[0].trim();
    if (!title) return null;

    // Company: from the URL slug, formatted
    const companyName = companySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    // Location: look for the nearest sibling/parent text after the title
    const card = a.closest('li, article, [class*="card"], [class*="Card"]') as import('deno-dom-wasm').Element | null;
    const locationEl = card?.querySelector('[class*="location"], [class*="Location"], [class*="city"], [data-testid*="location"]');
    const location = locationEl?.textContent?.trim();

    return {
      siteId,
      externalId,
      externalUrl,
      title,
      companyName,
      location,
      tags: [],
      labels: [],
    };
  }).filter((j): j is ParsedJob => !!j);

  logger.info(`WTTJ DOM: mapped ${jobs.length} valid jobs`);
  return { jobs, listFound: jobs.length > 0, elementsCount: uniqueLinks.length };
}
