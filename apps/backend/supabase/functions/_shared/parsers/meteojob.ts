import { DOMParser, Element } from 'deno-dom-wasm';
import { JobSiteParseResult, ParsedJob } from './parserTypes.ts';

/**
 * Parser for Meteojob (meteojob.com).
 * Angular Universal SSR — job cards are present in the initial HTML.
 * URL format: https://www.meteojob.com/jobs?q=developpeur&l=Paris
 *
 * Structure (from live HTML analysis):
 *   ul[role="tree"]  >  li[id^="job-offer-"]  >  article.cc-job-offer
 */
export function parseMeteojobJobs({ siteId, html }: { siteId: number; html: string }): JobSiteParseResult {
  const document = new DOMParser().parseFromString(html, 'text/html');
  if (!document) throw new Error('Could not parse html');

  const list = document.querySelector('ul[role="tree"]');
  if (!list) {
    return { jobs: [], listFound: false, elementsCount: 0 };
  }

  const jobElements = Array.from(list.querySelectorAll('li[id^="job-offer-"]')) as Element[];
  if (jobElements.length === 0) {
    return { jobs: [], listFound: true, elementsCount: 0 };
  }

  const jobs = jobElements.map((el): ParsedJob | null => {
    // externalId from li id="job-offer-56303746"
    const rawId = el.getAttribute('id') ?? '';
    const externalId = rawId.replace('job-offer-', '').trim();
    if (!externalId) return null;

    const linkEl = el.querySelector('a.cc-job-offer-list-item__link') as Element | null;
    if (!linkEl) return null;

    const href = linkEl.getAttribute('href')?.trim() ?? '';
    const externalUrl = href.startsWith('http') ? href : `https://www.meteojob.com${href}`;

    const title = linkEl.textContent?.trim();
    if (!title) return null;

    const companyName = el.querySelector('p.d-inline-block')?.textContent?.trim() || 'N/A';

    // Logo — relative path, prepend domain
    const logoSrc = el.querySelector('cc-job-offer-logo img')?.getAttribute('src')?.trim();
    const companyLogo = logoSrc
      ? (logoSrc.startsWith('http') ? logoSrc : `https://www.meteojob.com${logoSrc}`)
      : undefined;

    // Badges: first cc-badge-gray = location, second = contract type (CDI, CDD…)
    // Both badge groups are duplicated (desktop + mobile), so scope to first .d-flex.flex-row.flex-wrap
    const badgeContainer = el.querySelector('div.d-flex.flex-row.flex-wrap') as Element | null;
    const grayBadges = badgeContainer
      ? (Array.from(badgeContainer.querySelectorAll('span.cc-badge-gray')) as Element[])
      : [];

    // Location badge contains a mat-icon text "place" — strip it and trim
    const locationRaw = grayBadges[0]?.textContent?.replace('place', '')?.trim();
    const location = locationRaw || undefined;

    const salary = badgeContainer
      ?.querySelector('span.cc-badge-sky')
      ?.textContent?.trim() || undefined;

    const contractType = grayBadges[1]?.textContent?.trim();
    const tags: string[] = contractType ? [contractType] : [];

    return {
      siteId,
      externalId,
      externalUrl,
      title,
      companyName,
      companyLogo,
      location,
      salary,
      labels: [],
      tags,
    };
  });

  const validJobs = jobs.filter((job): job is ParsedJob => !!job);
  return {
    jobs: validJobs,
    listFound: true,
    elementsCount: jobElements.length,
  };
}
