import { ILogger } from '../logger.ts';
import { JobSiteParseResult, ParsedJob } from './parserTypes.ts';

// ─── APEC API types ───────────────────────────────────────────────────────────

interface ApecOffre {
  numOffre?: string;         // e.g. "185874W"
  intitule?: string;
  entreprise?: {
    nom?: string;
    logo?: string;
  };
  lieuTravail?: string;
  salaire?: {
    libelle?: string;
  };
  typeContrat?: {
    libelle?: string;
  };
  experienceMin?: {
    libelle?: string;
  };
  fonctions?: Array<{ libelle?: string }>;
  secteurs?: Array<{ libelle?: string }>;
  teletravail?: boolean;
}

interface ApecSearchResponse {
  totalOffres?: number;
  offres?: ApecOffre[];
}
// ─── URL → API params mapping ─────────────────────────────────────────────────

/**
 * APEC search URL format:
 * https://www.apec.fr/candidat/recherche-emploi.html/emploi?motsCles=dev&fonctions=599782&typesConvention=143684
 *
 * We extract the params and forward them to the internal API.
 */
function extractApiParams(url: string): URLSearchParams {
  const parsed = new URL(url);
  const params = new URLSearchParams();

  const motsCles = parsed.searchParams.get('motsCles');
  if (motsCles) params.set('motsCles', motsCles);

  // fonctions = job function codes (multiple allowed)
  parsed.searchParams.getAll('fonctions').forEach((v) => params.append('fonctions', v));

  // typesConvention = contract type codes
  parsed.searchParams.getAll('typesConvention').forEach((v) => params.append('typesConvention', v));

  // lieux = location codes
  parsed.searchParams.getAll('lieux').forEach((v) => params.append('lieux', v));

  // niveauxFormation = education level
  parsed.searchParams.getAll('niveauxFormation').forEach((v) => params.append('niveauxFormation', v));

  // teletravail
  const teletravail = parsed.searchParams.get('teletravail');
  if (teletravail) params.set('teletravail', teletravail);

  // Pagination — always fetch first page, max results
  params.set('page', '0');
  params.set('nbParPage', '50');
  params.set('tri', '1'); // 1 = date desc

  return params;
}
// ─── Response → ParsedJob mapping ────────────────────────────────────────────

function mapOffre(offre: ApecOffre, siteId: number): ParsedJob | null {
  if (!offre.numOffre || !offre.intitule) return null;

  const externalId = offre.numOffre;
  const externalUrl = `https://www.apec.fr/candidat/recherche-emploi.html/emploi/detail-de-loffre-demploi.html?numIdOffre=${externalId}`;

  const companyName = offre.entreprise?.nom?.trim() || 'N/A';
  const location = offre.lieuTravail?.trim();
  const salary = offre.salaire?.libelle?.trim() || undefined;

  const tags: string[] = [];
  if (offre.typeContrat?.libelle) tags.push(offre.typeContrat.libelle);
  if (offre.experienceMin?.libelle) tags.push(offre.experienceMin.libelle);
  if (offre.teletravail) tags.push('Télétravail');
  offre.fonctions?.forEach((f) => { if (f.libelle) tags.push(f.libelle); });

  return {
    siteId,
    externalId,
    externalUrl,
    title: offre.intitule.trim(),
    companyName,
    companyLogo: offre.entreprise?.logo ?? undefined,
    location,
    salary,
    jobType: offre.teletravail ? 'remote' : undefined,
    tags,
    labels: [],
  };
}

// ─── Main parser ──────────────────────────────────────────────────────────────

/**
 * Parser for APEC (apec.fr).
 * APEC is an Angular SPA — we call its internal REST API directly.
 * The url param is the search URL copied from the browser.
 */
export async function parseApecJobs({
  siteId,
  url,
  logger,
}: {
  siteId: number;
  url: string;
  logger: ILogger;
}): Promise<JobSiteParseResult> {
  const apiParams = extractApiParams(url);
  const apiUrl = `https://www.apec.fr/cms/webservices/offre/recherche?${apiParams.toString()}`;

  logger.info(`APEC: fetching ${apiUrl}`);

  const response = await fetch(apiUrl, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; alertemploi/1.0)',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    logger.error(`APEC API error (${response.status}): ${text}`);
    return { jobs: [], listFound: false, elementsCount: 0 };
  }

  const data: ApecSearchResponse = await response.json();
  const offres = data.offres ?? [];

  logger.info(`APEC: received ${offres.length} offres (total: ${data.totalOffres ?? '?'})`);

  const jobs = offres
    .map((offre) => mapOffre(offre, siteId))
    .filter((job): job is ParsedJob => !!job);

  logger.info(`APEC: mapped ${jobs.length} valid jobs`);

  return {
    jobs,
    listFound: true,
    elementsCount: offres.length,
  };
}
