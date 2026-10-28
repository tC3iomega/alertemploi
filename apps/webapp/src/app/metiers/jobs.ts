/**
 * Pages « alerte emploi <métier> ».
 *
 * Attention au piège : des pages identiques dont seul le nom du métier change sont des
 * pages satellites, que Google déclasse. Chaque fiche doit donc porter un conseil propre au
 * métier (sites réellement pertinents, filtres qui comptent, rythme de publication), sinon
 * mieux vaut ne pas la créer.
 */
export type Job = {
  slug: string;
  name: string;
  /** Formulation de la requête, utilisée dans les titres. */
  searchTerm: string;
  intro: string;
  /** Les sites qui comptent vraiment pour ce métier, avec la raison. */
  boards: { slug: string; name: string; why: string }[];
  /** Conseils de recherche spécifiques au métier. */
  tips: string[];
  faq: { question: string; answer: string }[];
};

export const JOBS: Job[] = [
  {
    slug: 'developpeur',
    name: 'développeur',
    searchTerm: 'développeur',
    intro:
      "Les offres de développeur partent vite, et les meilleures reçoivent des dizaines de candidatures le premier jour. Alertemploi surveille vos recherches et vous prévient dès la publication.",
    boards: [
      { slug: 'linkedin', name: 'LinkedIn', why: 'la majorité des offres tech y passent, souvent en premier' },
      {
        slug: 'welcome-to-the-jungle',
        name: 'Welcome to the Jungle',
        why: 'incontournable pour les startups et scale-ups',
      },
      { slug: 'indeed', name: 'Indeed', why: 'couvre les ESN et les grands comptes' },
    ],
    tips: [
      "Créez une alerte par technologie plutôt qu'une seule alerte « développeur » : les intitulés varient beaucoup (React, Node, Java, Python) et une recherche trop large noie les offres pertinentes.",
      "Pensez aux variantes d'intitulé : « développeur », « ingénieur logiciel », « software engineer » ne renvoient pas les mêmes résultats.",
      "Si vous visez le télétravail, appliquez le filtre sur le site avant de copier l'URL : Alertemploi surveille exactement la recherche que vous lui confiez.",
    ],
    faq: [
      {
        question: 'Faut-il une alerte par technologie ?',
        answer:
          "C'est généralement plus efficace, et le nombre d'alertes est illimité. Une alerte « React » et une alerte « Node » rapportent des résultats plus exploitables qu'une seule alerte générique.",
      },
      {
        question: 'Comment écarter les ESN si je ne les vise pas ?',
        answer:
          "Le plan Pro permet de blacklister des entreprises : leurs offres sont écartées avant l'envoi de l'email.",
      },
    ],
  },
  {
    slug: 'infirmier',
    name: 'infirmier',
    searchTerm: 'infirmier / infirmière',
    intro:
      "Les postes d'infirmier sont nombreux mais se pourvoient vite, surtout en établissement. Alertemploi surveille vos recherches et vous alerte par email dès qu'une offre paraît.",
    boards: [
      {
        slug: 'france-travail',
        name: 'France Travail',
        why: "la source la plus large pour les postes hospitaliers et en EHPAD",
      },
      { slug: 'hellowork', name: 'HelloWork', why: 'bonne couverture des établissements privés et régionaux' },
      { slug: 'indeed', name: 'Indeed', why: 'reprend une grande partie des annonces des deux précédents' },
    ],
    tips: [
      "Précisez le cadre d'exercice dans votre recherche (hôpital, EHPAD, bloc, libéral) : les intitulés sont très différents et une recherche générique ramène beaucoup de bruit.",
      "Élargissez le rayon géographique plutôt que de multiplier les villes : une seule alerte sur un périmètre large est plus simple à suivre.",
      "Si vous cherchez en intérim, créez une alerte distincte : les offres y sont publiées en continu et peuvent saturer une alerte généraliste.",
    ],
    faq: [
      {
        question: 'Les offres hospitalières publiques sont-elles couvertes ?',
        answer:
          "Celles publiées sur France Travail le sont. Les portails propres à certains hôpitaux ne sont pas encore surveillés.",
      },
      {
        question: 'Puis-je surveiller plusieurs départements ?',
        answer: 'Oui, créez une alerte par recherche. Leur nombre est illimité sur tous les plans.',
      },
    ],
  },
  {
    slug: 'commercial',
    name: 'commercial',
    searchTerm: 'commercial',
    intro:
      "Les postes commerciaux sont parmi les plus publiés en France — et parmi les plus répétitifs. Alertemploi vous prévient dès la publication et vous laisse écarter les entreprises que vous ne visez pas.",
    boards: [
      { slug: 'indeed', name: 'Indeed', why: 'le plus gros volume, tous secteurs confondus' },
      { slug: 'france-travail', name: 'France Travail', why: 'couvre largement les PME et les réseaux' },
      { slug: 'cadremploi', name: 'Cadremploi', why: 'pour les postes cadres et les directions commerciales' },
    ],
    tips: [
      "Le volume est le vrai problème sur ce métier : précisez le secteur (BTP, pharma, logiciel) ou le type de poste (terrain, sédentaire, grands comptes) plutôt que de chercher « commercial » seul.",
      "La blacklist d'entreprises du plan Pro est particulièrement utile ici : quelques réseaux publient en continu les mêmes annonces.",
      "Si vous visez un statut cadre, une alerte Cadremploi en complément d'Indeed évite de passer à côté des postes mieux rémunérés.",
    ],
    faq: [
      {
        question: 'Comment éviter de recevoir dix fois la même annonce ?',
        answer:
          "Chaque alerte est suivie séparément : une offre publiée sur deux sites peut apparaître deux fois. En revanche, une même offre déjà envoyée ne revient jamais.",
      },
      {
        question: 'Les offres en portage ou en franchise sont-elles filtrables ?',
        answer:
          "Pas automatiquement, mais vous pouvez blacklister les entreprises concernées avec le plan Pro, ou affiner les mots-clés de votre recherche.",
      },
    ],
  },
  {
    slug: 'comptable',
    name: 'comptable',
    searchTerm: 'comptable',
    intro:
      "Cabinets d'expertise comptable et services financiers recrutent toute l'année, avec des pics marqués. Alertemploi surveille vos recherches et vous envoie les nouvelles offres par email.",
    boards: [
      { slug: 'apec', name: 'APEC', why: 'référence pour les postes cadres en finance et comptabilité' },
      { slug: 'indeed', name: 'Indeed', why: 'couvre largement les cabinets et les PME' },
      { slug: 'cadremploi', name: 'Cadremploi', why: 'postes de responsable comptable et de DAF' },
    ],
    tips: [
      "Distinguez cabinet et entreprise dès la recherche : « collaborateur comptable » et « comptable général » ne renvoient pas aux mêmes offres ni aux mêmes conditions.",
      "Les périodes fiscales créent des pics de publication : une alerte permanente évite d'avoir à surveiller manuellement ces fenêtres.",
      "Pour un poste cadre, surveillez l'APEC en parallèle d'Indeed : les mêmes postes y sont souvent publiés à quelques jours d'écart.",
    ],
    faq: [
      {
        question: "Les offres de cabinets d'expertise comptable sont-elles couvertes ?",
        answer: 'Oui, dès lors quelles apparaissent dans les résultats de la recherche que vous confiez à Alertemploi.',
      },
      {
        question: 'Puis-je suivre plusieurs niveaux de poste ?',
        answer:
          "Oui : beaucoup de candidats créent une alerte « comptable » et une alerte « responsable comptable » pour couvrir les deux.",
      },
    ],
  },
  {
    slug: 'aide-soignant',
    name: 'aide-soignant',
    searchTerm: 'aide-soignant / aide-soignante',
    intro:
      "Les postes d'aide-soignant sont publiés en continu, en établissement comme à domicile. Alertemploi surveille votre recherche et vous prévient dès qu'une offre paraît près de chez vous.",
    boards: [
      { slug: 'france-travail', name: 'France Travail', why: 'de loin la source la plus complète sur ce métier' },
      { slug: 'hellowork', name: 'HelloWork', why: 'bonne couverture des structures privées et associatives' },
      { slug: 'indeed', name: 'Indeed', why: 'utile pour les groupes nationaux et les agences' },
    ],
    tips: [
      "Le lieu compte plus que l'intitulé sur ce métier : réglez d'abord votre rayon géographique, puis affinez le type de structure.",
      "Si vous acceptez les remplacements et l'intérim, créez une alerte dédiée : ces offres sont publiées très fréquemment.",
      "Pensez à inclure « ASH » ou « agent de service hospitalier » dans une alerte distincte si ces postes vous intéressent aussi.",
    ],
    faq: [
      {
        question: 'Les offres en EHPAD sont-elles incluses ?',
        answer: 'Oui, si elles apparaissent dans votre recherche sur France Travail ou HelloWork.',
      },
      {
        question: 'À quelle fréquence vais-je recevoir des emails ?',
        answer:
          'Un email par passage de scan contenant de nouvelles offres, soit au maximum toutes les 30 minutes. En pratique, quelques emails par jour sur un métier actif.',
      },
    ],
  },
];

export function getJob(slug: string): Job | undefined {
  return JOBS.find((j) => j.slug === slug);
}
