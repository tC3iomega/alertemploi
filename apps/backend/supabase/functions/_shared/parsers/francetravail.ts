import { ILogger } from '../logger.ts';
import { JobSiteParseResult, ParsedJob } from './parserTypes.ts';

// ─── OAuth2 token cache (in-memory, per Edge Function instance) ───────────────
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getFranceTravailToken(logger: ILogger): Promise<string> {
  const now = Date.now();

  if (cachedToken && cachedToken.expiresAt - 60_000 > now) {
    logger.info('France Travail: using cached OAuth2 token');
    return cachedToken.value;
  }

  const clientId = Deno.env.get('FRANCE_TRAVAIL_CLIENT_ID');
  const clientSecret = Deno.env.get('FRANCE_TRAVAIL_CLIENT_SECRET');

  if (!clientId || !clientSecret) {
    throw new Error(
      'France Travail credentials not configured. ' +
      'Set FRANCE_TRAVAIL_CLIENT_ID and FRANCE_TRAVAIL_CLIENT_SECRET in Supabase Edge Function secrets.',
    );
  }

  logger.info('France Travail: requesting new OAuth2 token');

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'api_offresdemploiv2 o2dsoffre',
  });

  const response = await fetch(
    'https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`France Travail OAuth2 failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  cachedToken = {
    value: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };

  logger.info(`France Travail: token obtained, expires in ${data.expires_in}s`);
  return cachedToken.value;
}
// ─── France Travail API types ─────────────────────────────────────────────────

interface FTOffre {
  id: string;
  intitule: string;
  entreprise?: {
    nom?: string;
    logo?: string;
  };
  lieuTravail?: {
    libelle?: string;
    commune?: string;
    codePostal?: string;
  };
  salaire?: {
    libelle?: string;
  };
  typeContrat?: string;
  typeContratLibelle?: string;
  experienceLibelle?: string;
  qualificationLibelle?: string;
  secteurActiviteLibelle?: string;
  origineOffre?: {
    urlOrigine?: string;
  };
  description?: string;
}

interface FTSearchResponse {
  resultats?: FTOffre[];
}

// ─── URL → API params mapping ─────────────────────────────────────────────────

function extractApiParams(url: string): URLSearchParams {
  const parsed = new URL(url);
  const params = new URLSearchParams();

  if (parsed.hostname === 'api.francetravail.io') {
    parsed.searchParams.forEach((value, key) => params.set(key, value));
    if (!params.has('range')) params.set('range', '0-149');
    if (!params.has('sort')) params.set('sort', '1');
    return params;
  }

  const motsCles = parsed.searchParams.get('motsCles') || parsed.searchParams.get('q');
  if (motsCles) params.set('motsCles', motsCles);

  const lieux = parsed.searchParams.get('lieux');
  if (lieux) {
    if (lieux.endsWith('D')) {
      params.set('departement', lieux.slice(0, -1));
    } else {
      params.set('commune', lieux);
    }
  }

  const contrat = parsed.searchParams.get('typeContrat') || parsed.searchParams.get('contrat');
  if (contrat) params.set('typeContrat', contrat);

  const experience = parsed.searchParams.get('experience');
  if (experience) params.set('experience', experience);

  params.set('range', '0-149');
  params.set('sort', '1');

  return params;
}
// ─── Response → ParsedJob mapping ────────────────────────────────────────────

function mapOffre(offre: FTOffre, siteId: number): ParsedJob | null {
  if (!offre.id || !offre.intitule) return null;

  const companyName = offre.entreprise?.nom?.trim() || 'Non renseigné';
  const externalId = offre.id;

  const externalUrl =
    offre.origineOffre?.urlOrigine ||
    `https://candidat.francetravail.fr/offres/recherche/detail/${externalId}`;

  const location = offre.lieuTravail?.libelle?.trim();
  const salary = offre.salaire?.libelle?.trim() || undefined;

  const tags: string[] = [
    offre.typeContratLibelle,
    offre.qualificationLibelle,
    offre.experienceLibelle,
    offre.secteurActiviteLibelle,
  ]
    .filter((t): t is string => !!t && t.trim().length > 0)
    .map((t) => t.trim());

  const description = offre.description?.trim() || undefined;

  return {
    siteId,
    externalId,
    externalUrl,
    title: offre.intitule.trim(),
    companyName,
    companyLogo: offre.entreprise?.logo?.trim() || undefined,
    location,
    salary,
    jobType: undefined,
    description,
    tags,
    labels: [],
  };
}

// ─── Main parser ──────────────────────────────────────────────────────────────

export async function parseFranceTravailJobs({
  siteId,
  url,
  logger,
}: {
  siteId: number;
  url: string;
  logger: ILogger;
}): Promise<JobSiteParseResult> {
  const token = await getFranceTravailToken(logger);

  const apiParams = extractApiParams(url);
  const apiUrl = `https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search?${apiParams.toString()}`;

  logger.info(`France Travail: fetching ${apiUrl}`);

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (response.status === 204) {
    logger.info('France Travail: no results (204)');
    return { jobs: [], listFound: true, elementsCount: 0 };
  }

  if (!response.ok) {
    const text = await response.text();
    logger.error(`France Travail API error (${response.status}): ${text}`);
    if (response.status === 401) cachedToken = null;
    return { jobs: [], listFound: false, elementsCount: 0 };
  }

  const data: FTSearchResponse = await response.json();
  const offres = data.resultats ?? [];

  logger.info(`France Travail: received ${offres.length} offres`);

  const jobs = offres
    .map((offre) => mapOffre(offre, siteId))
    .filter((job): job is ParsedJob => !!job);

  logger.info(`France Travail: mapped ${jobs.length} valid jobs`);

  return {
    jobs,
    listFound: true,
    elementsCount: offres.length,
  };
}

