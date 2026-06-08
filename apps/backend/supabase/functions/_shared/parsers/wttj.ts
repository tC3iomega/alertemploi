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
    logger.error('WTTJ: __NEXT_DATA__ script not found');
    return { jobs: [], listFound: false, elementsCount: 0 };
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
    logger.error('WTTJ: no jobs found in any known location');
    return { jobs: [], listFound: false, elementsCount: 0 };
  }

  const jobs = hits
    .map((hit) => mapHit(hit, siteId))
    .filter((job): job is ParsedJob => !!job);

  logger.info(`WTTJ: mapped ${jobs.length} valid jobs out of ${hits.length}`);

  return { jobs, listFound: true, elementsCount: hits.length };
}
