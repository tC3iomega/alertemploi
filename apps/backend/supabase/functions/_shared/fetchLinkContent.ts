import { JobSite, Link } from '@alertemploi/core';

import { First2ApplyBackendEnv } from './env.ts';
import { ILogger } from './logger.ts';
import { ParsedJob } from './parsers/parserTypes.ts';
import { assertUrlIsPubliclyReachable } from './urlSafety.ts';

export type FetchLinkContentResult =
  | { jobs: ParsedJob[]; html?: undefined }
  | { html: string; jobs?: undefined };

/**
 * Fetches whatever content is needed to parse a link's jobs list, using the same
 * strategy per provider that both scan-urls (client-supplied html) and cron-scan
 * (no client, always needs to fetch itself) must share:
 *  - LinkedIn/Indeed: scraped via the JobSpy worker, which returns jobs directly.
 *  - HelloWork/WTTJ/Cadremploi/custom job sites: rendered via Browserless (or a direct
 *    fetch fallback) when no html was already supplied.
 *  - Everything else (France Travail, APEC, ...): returns `existingHtml` as-is, since
 *    those parsers either don't need html or fetch their own data internally.
 */
export async function fetchLinkContent({
  link,
  site,
  existingHtml,
  env,
  logger,
}: {
  link: Link;
  site: JobSite;
  existingHtml?: string;
  env: First2ApplyBackendEnv;
  logger: ILogger;
}): Promise<FetchLinkContentResult> {
  const needsJobSpy = ['linkedin', 'indeed'].includes(site.provider ?? '');
  if (needsJobSpy && env.jobspyWorkerUrl && env.jobspyWorkerSecret) {
    logger.info(`fetching via JobSpy worker: ${link.url}`);
    const siteProvider = site.provider ?? 'indeed';
    const urlParams = new URL(link.url);
    const searchTerm = urlParams.searchParams.get('q') || urlParams.searchParams.get('keywords') || 'emploi';
    const location = urlParams.searchParams.get('l') || urlParams.searchParams.get('location') || 'France';
    const response = await fetch(`${env.jobspyWorkerUrl}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.jobspyWorkerSecret}`,
      },
      body: JSON.stringify({ url: link.url, site: siteProvider, search_term: searchTerm, location, results_wanted: 25 }),
    });
    const data = await response.json();
    logger.info(`JobSpy returned ${data.jobs?.length ?? 0} jobs`);
    const jobs: ParsedJob[] = (data.jobs ?? []).map((j: any) => ({
      siteId: site.id,
      externalId: j.externalId,
      externalUrl: j.externalUrl,
      title: j.title,
      companyName: j.companyName || 'N/A',
      location: j.location,
      jobType: j.jobType !== 'nan' && j.jobType !== 'None' ? j.jobType : undefined,
      description: j.description,
      salary: j.salary || undefined,
      tags: [],
      labels: [],
      link_id: link.id,
    }));
    return { jobs };
  }

  const needsBrowser = ['hellowork', 'wttj', 'cadremploi', 'custom'].includes(site.provider ?? '');
  let htmlContent = existingHtml ?? '';
  if ((!htmlContent || htmlContent.trim().length === 0) && needsBrowser) {
    // Re-validated right before the actual fetch (not just at link-creation time in
    // create-link), since a custom-provider hostname could have been repointed at a
    // private/internal address via DNS after the link was first created.
    await assertUrlIsPubliclyReachable(link.url);

    const browserlessApiKey = env.browserlessApiKey;
    if (browserlessApiKey) {
      logger.info(`fetching via Browserless: ${link.url}`);
      const response = await fetch(`https://production-sfo.browserless.io/content?token=${browserlessApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: link.url,
          waitForTimeout: 3000,
        }),
      });
      htmlContent = await response.text();
      logger.info(`fetched ${htmlContent.length} bytes via Browserless`);
    } else {
      logger.info(`fetching URL directly: ${link.url}`);
      const response = await fetch(link.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        },
      });
      htmlContent = await response.text();
      logger.info(`fetched ${htmlContent.length} bytes directly`);
    }
  }

  return { html: htmlContent };
}
