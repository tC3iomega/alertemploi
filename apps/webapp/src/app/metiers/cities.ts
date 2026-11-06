/**
 * Pages « alerte emploi <métier> à <ville> ».
 *
 * Chaque ville apporte un contexte local distinct (densité d'offres, concurrence,
 * particularités du bassin d'emploi) pour éviter le contenu dupliqué.
 */
export type City = {
  slug: string;
  name: string;
  region: string;
  /** Court contexte sur le marché local — inséré dans l'intro. */
  context: string;
  /** Conseil spécifique à cette ville. */
  tip: string;
};

export const CITIES: City[] = [
  {
    slug: 'paris',
    name: 'Paris',
    region: 'Île-de-France',
    context:
      "Paris concentre le plus grand bassin d'emploi de France, toutes spécialités confondues. Les offres y sont nombreuses mais la concurrence est à la hauteur : réagir vite fait une vraie différence.",
    tip:
      "À Paris, beaucoup d'offres passent par des cabinets de recrutement qui ne publient que sur LinkedIn ou l'APEC — pensez à créer une alerte sur ces deux plateformes en priorité.",
  },
  {
    slug: 'lyon',
    name: 'Lyon',
    region: 'Auvergne-Rhône-Alpes',
    context:
      "Lyon est la deuxième métropole économique de France, avec un tissu dense de PME, de startups et de grands groupes dans la chimie, la santé et le numérique.",
    tip:
      "Le marché lyonnais est actif mais moins saturé qu'à Paris : une candidature rapide après publication multiplie vos chances d'être dans les premiers dossiers lus.",
  },
  {
    slug: 'marseille',
    name: 'Marseille',
    region: "Provence-Alpes-Côte d'Azur",
    context:
      "Marseille et la métropole Aix-Marseille-Provence offrent un marché de l'emploi en croissance, notamment dans la logistique, le tourisme, le numérique et les services.",
    tip:
      "Les offres dans la région PACA sont souvent publiées sur France Travail ou HelloWork avant de migrer vers les grands agrégateurs — surveiller ces deux sources en priorité vous donne de l'avance.",
  },
  {
    slug: 'toulouse',
    name: 'Toulouse',
    region: 'Occitanie',
    context:
      "Toulouse est la capitale européenne de l'aéronautique et de l'espace, avec Airbus, Thales et un écosystème de sous-traitants très actifs, en plus d'un secteur numérique en fort développement.",
    tip:
      "À Toulouse, LinkedIn est particulièrement actif pour les postes techniques et les ESN. Créez une alerte sur LinkedIn en plus de France Travail pour ne rien manquer.",
  },
  {
    slug: 'bordeaux',
    name: 'Bordeaux',
    region: 'Nouvelle-Aquitaine',
    context:
      "Bordeaux attire de nombreuses entreprises depuis quelques années, avec un marché de l'emploi dynamique dans le numérique, l'agroalimentaire et les services.",
    tip:
      "Le marché bordelais est compétitif sur les profils numériques : une alerte sur Welcome to the Jungle et LinkedIn couvre bien les startups et les entreprises tech en croissance.",
  },
  {
    slug: 'nantes',
    name: 'Nantes',
    region: 'Pays de la Loire',
    context:
      "Nantes est régulièrement classée parmi les villes préférées des actifs. Son marché de l'emploi est diversifié : industrie, numérique, agroalimentaire et services.",
    tip:
      "À Nantes, France Travail et HelloWork couvrent bien les PME industrielles et les entreprises locales, souvent absentes de LinkedIn.",
  },
  {
    slug: 'lille',
    name: 'Lille',
    region: 'Hauts-de-France',
    context:
      "Lille et la métropole lilloise constituent le quatrième pôle économique français, avec un marché de l'emploi solide dans la distribution, la logistique, le numérique et les services.",
    tip:
      "La proximité avec Bruxelles et Londres crée des opportunités bilingues spécifiques à cette région — pensez à inclure une recherche en anglais si vous êtes ouvert à ces profils.",
  },
  {
    slug: 'nice',
    name: 'Nice',
    region: "Provence-Alpes-Côte d'Azur",
    context:
      "Nice et la Côte d'Azur combinent tourisme, tech (la technopole Sophia Antipolis est toute proche) et services aux entreprises, avec un marché de l'emploi plus saisonnier que dans d'autres métropoles.",
    tip:
      "Sophia Antipolis concentre de nombreuses entreprises tech et internationales : une alerte LinkedIn avec un filtre géographique sur Nice/Sophia couvre bien ce bassin.",
  },
  {
    slug: 'strasbourg',
    name: 'Strasbourg',
    region: 'Alsace',
    context:
      "Strasbourg, siège d'institutions européennes, offre un marché de l'emploi bilingue unique en France, avec une forte demande de profils franco-allemands et des opportunités dans le secteur public international.",
    tip:
      "À Strasbourg, les offres bilingues français-allemand sont publiées sur des plateformes spécialisées qui ne sont pas couvertes par Alertemploi — pensez à les surveiller en complément.",
  },
  {
    slug: 'montpellier',
    name: 'Montpellier',
    region: 'Occitanie',
    context:
      "Montpellier est l'une des métropoles françaises à la croissance la plus rapide, avec un marché de l'emploi dynamique dans la santé, le numérique et l'enseignement supérieur.",
    tip:
      "Le secteur de la santé et de la biotech est particulièrement actif à Montpellier : France Travail et Indeed couvrent bien les offres des hôpitaux et des laboratoires de la région.",
  },
];

export function getCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}
