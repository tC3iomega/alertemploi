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

  {
    slug: 'rh',
    name: 'ressources humaines',
    searchTerm: 'ressources humaines',
    intro:
      "Les profils RH sont recrutés tout au long de l’année, des postes généralistes aux spécialités paie, formation et talent acquisition. Alertemploi surveille vos recherches et vous prévient dès qu’une offre paraît.",
    boards: [
      { slug: 'linkedin', name: 'LinkedIn', why: 'le principal canal pour les postes HRBP, HRIS et directeur des ressources humaines' },
      { slug: 'apec', name: 'APEC', why: 'référence pour les postes cadres RH et les DRH' },
      { slug: 'indeed', name: 'Indeed', why: 'couvre les PME et les grandes structures sur toutes les spécialités' },
    ],
    tips: [
      "Les intitulés varient beaucoup : « chargé RH », « HRBP », « talent acquisition », « people partner » ne renvoient pas les mêmes offres — créez une alerte par intitulé cible.",
      "Distinguez généraliste et spécialiste dès la recherche : un poste paie ou SIRH n’est pas le même profil qu’un poste recrutement ou formation.",
      "Pour les postes bilingues ou dans des structures internationales, ajoutez une alerte sur LinkedIn en anglais (« HR business partner », « HR manager »).",
    ],
    faq: [
      {
        question: "Quelle différence entre une alerte « RH » et une alerte « recruteur » ?",
        answer:
          "Les résultats ne se recoupent que partiellement. Un poste de chargé de recrutement peut ne pas apparaître dans une recherche « RH généraliste ». Créez les deux si vous visez les deux.",
      },
      {
        question: "Les offres en cabinet de recrutement sont-elles incluses ?",
        answer: "Oui, dès lors qu’elles apparaissent dans les résultats de la recherche que vous confiez à Alertemploi.",
      },
    ],
  },
  {
    slug: 'juriste',
    name: 'juriste',
    searchTerm: 'juriste',
    intro:
      "Les postes juridiques sont concentrés sur quelques plateformes et partent vite en période de recrutement. Alertemploi vous prévient dès la mise en ligne, en cabinet comme en entreprise.",
    boards: [
      { slug: 'apec', name: 'APEC', why: "la source la plus complète pour les juristes cadres, toutes spécialités" },
      { slug: 'cadremploi', name: 'Cadremploi', why: 'fort sur les postes de juriste senior et de directeur juridique' },
      { slug: 'linkedin', name: 'LinkedIn', why: "indispensable pour les cabinets d’avocats et les postes en anglais" },
    ],
    tips: [
      "Précisez la spécialité dès la recherche : droit des affaires, droit social, propriété intellectuelle, droit immobilier — les intitulés sont rarement interchangeables.",
      "Les postes en cabinet et les postes in-house ne se retrouvent pas aux mêmes endroits : créez une alerte sur l’APEC pour le marché entreprise et une sur LinkedIn pour les cabinets.",
      "Pensez à « legal counsel » ou « legal manager » en plus de « juriste » si vous postulez aussi à des structures internationales.",
    ],
    faq: [
      {
        question: "Les postes de paralégal ou d’assistant juridique sont-ils couverts ?",
        answer: "Oui, si vous créez une alerte dédiée : ces intitulés sont distincts de « juriste » et méritent leur propre recherche.",
      },
      {
        question: "Puis-je surveiller plusieurs spécialités en même temps ?",
        answer: "Oui, le nombre d’alertes est illimité. Beaucoup de juristes créent une alerte par spécialité et une alerte généraliste.",
      },
    ],
  },
  {
    slug: 'marketing',
    name: 'marketing',
    searchTerm: 'marketing digital',
    intro:
      "Les offres en marketing sont très fragmentées selon le canal et la spécialité. Alertemploi surveille exactement votre recherche et vous envoie les nouvelles offres par email.",
    boards: [
      { slug: 'welcome-to-the-jungle', name: 'Welcome to the Jungle', why: 'incontournable pour les startups, scale-ups et postes growth' },
      { slug: 'linkedin', name: 'LinkedIn', why: 'fort sur les postes cadres et les responsables marketing grands comptes' },
      { slug: 'indeed', name: 'Indeed', why: 'bon volume pour les profils polyvalents et les PME' },
    ],
    tips: [
      "Les intitulés sont très fragmentés : « growth hacker », « traffic manager », « content manager », « chef de produit marketing » ne renvoient pas les mêmes offres — précisez votre spécialité.",
      "Si vous maîtrisez une stack précise (Google Ads, HubSpot, Salesforce, Meta), ajoutez-la à votre recherche : beaucoup d’offres y font référence dans le titre.",
      "Pour les postes en startup, Welcome to the Jungle donne souvent accès aux offres avant leur publication sur les autres sites.",
    ],
    faq: [
      {
        question: "Les offres de chef de produit (product manager) sont-elles incluses ?",
        answer:
          "Pas systématiquement dans une recherche « marketing » : créez une alerte dédiée « product manager » ou « chef de produit » pour les couvrir.",
      },
      {
        question: "Comment éviter les offres hors budget ?",
        answer:
          "Appliquez un filtre salaire dans votre recherche sur le site concerné avant de copier l’URL : Alertemploi surveille exactement les résultats filtrés.",
      },
    ],
  },
  {
    slug: 'chef-de-projet',
    name: 'chef de projet',
    searchTerm: 'chef de projet',
    intro:
      "Le titre « chef de projet » recouvre des réalités très différentes selon le secteur. Alertemploi surveille vos recherches et vous alerte dès qu’une offre correspond à vos critères.",
    boards: [
      { slug: 'linkedin', name: 'LinkedIn', why: 'le plus complet pour les postes de chef de projet IT, digital et transformation' },
      { slug: 'indeed', name: 'Indeed', why: "fort sur le BTP, l’industrie et les ESN" },
      { slug: 'apec', name: 'APEC', why: 'pour les postes cadres et les directeurs de projets' },
    ],
    tips: [
      "« Chef de projet » est l’un des intitulés les plus polysémiques : précisez le secteur (IT, BTP, événementiel, transformation) pour des résultats exploitables.",
      "« Project manager » et « chef de projet » ne renvoient pas les mêmes offres sur LinkedIn — créez une alerte pour chaque formulation si vous êtes ouvert aux deux.",
      "Si vous visez un poste en méthodologie Agile, ajoutez « Scrum » ou « Agile » à votre recherche pour filtrer les offres qui mentionnent cette pratique.",
    ],
    faq: [
      {
        question: "Quelle différence avec un poste de product owner ou de scrum master ?",
        answer:
          "Ces intitulés correspondent à des rôles distincts et nécessitent leurs propres alertes. Ils n’apparaissent pas dans une recherche « chef de projet » standard.",
      },
      {
        question: "Puis-je surveiller plusieurs secteurs en même temps ?",
        answer: "Oui, créez une alerte par secteur. Leur nombre est illimité sur tous les plans.",
      },
    ],
  },
  {
    slug: 'data',
    name: 'data analyst',
    searchTerm: 'data analyst',
    intro:
      "Les profils data sont très demandés, mais les intitulés varient selon l’entreprise et le niveau de séniorité. Alertemploi surveille vos recherches et vous prévient dès la publication.",
    boards: [
      { slug: 'welcome-to-the-jungle', name: 'Welcome to the Jungle', why: 'incontournable pour les postes data en startup et tech' },
      { slug: 'linkedin', name: 'LinkedIn', why: 'excellent pour les postes data scientist et data engineer senior' },
      { slug: 'indeed', name: 'Indeed', why: 'bon volume sur les profils BI et les postes en grands comptes' },
    ],
    tips: [
      "Data analyst, data scientist et data engineer sont trois métiers distincts avec des marchés différents : créez une alerte par intitulé pour ne pas mélanger les profils.",
      "Précisez les technologies que vous maîtrisez (Python, SQL, Power BI, Tableau, dbt, Spark) : beaucoup d’offres les citent dans le titre ou permettent de filtrer par compétence.",
      "Les postes « business analyst » sont souvent proches du data analyst mais ne ressortent pas dans les mêmes recherches — ajoutez une alerte dédiée si ce périmètre vous convient.",
    ],
    faq: [
      {
        question: "Les offres en alternance ou stage sont-elles incluses ?",
        answer:
          "Oui, si votre recherche sur le site source inclut ces types de contrat : Alertemploi surveille exactement les résultats filtrés que vous lui confiez.",
      },
      {
        question: "Puis-je filtrer par niveau d’expérience ?",
        answer: "Appliquez le filtre sur le site avant de copier l’URL : Alertemploi reprend la recherche telle quelle, filtres inclus.",
      },
    ],
  },
  {
    slug: 'logisticien',
    name: 'logisticien',
    searchTerm: 'logisticien',
    intro:
      "La logistique et la supply chain recrutent en continu, des postes d’entrepôt aux fonctions de planification. Alertemploi surveille votre recherche et vous alerte dès qu’une offre paraît.",
    boards: [
      { slug: 'france-travail', name: 'France Travail', why: "le plus complet pour les postes opérationnels et les PME du transport" },
      { slug: 'indeed', name: 'Indeed', why: 'fort sur les grands groupes logistiques et les postes de responsable supply chain' },
      { slug: 'hellowork', name: 'HelloWork', why: 'bonne couverture des PME régionales et des prestataires logistiques' },
    ],
    tips: [
      "Distinguez les postes opérationnels (préparateur, cariste, réceptionniste) des postes de pilotage (responsable logistique, supply chain manager) : les intitulés et les plateformes ne sont pas les mêmes.",
      "Si vous avez le CACES, précisez-le dans votre recherche sur France Travail : de nombreuses offres filtrent sur cette certification.",
      "Pour les postes de supply chain, une alerte LinkedIn en parallèle d’Indeed capte les postes cadres publiés exclusivement côté recruteurs.",
    ],
    faq: [
      {
        question: "Les postes en intérim sont-ils couverts ?",
        answer: "Oui, dès lors qu’ils apparaissent dans les résultats de votre recherche sur le site concerné.",
      },
      {
        question: "Puis-je surveiller une zone géographique précise ?",
        answer: "Oui, appliquez le filtre de localisation dans votre recherche avant de copier l’URL : Alertemploi surveille exactement ce périmètre.",
      },
    ],
  },
  {
    slug: 'assistant-direction',
    name: 'assistant de direction',
    searchTerm: 'assistant de direction',
    intro:
      "Les postes d’assistant de direction et d’office manager sont présents dans tous les secteurs. Alertemploi surveille votre recherche et vous envoie les nouvelles offres dès leur publication.",
    boards: [
      { slug: 'indeed', name: 'Indeed', why: "le plus grand volume, tous secteurs et toutes tailles d’entreprise" },
      { slug: 'france-travail', name: 'France Travail', why: 'couvre les PME, les associations et le secteur public' },
      { slug: 'linkedin', name: 'LinkedIn', why: 'utile pour les postes en direction générale et les grandes entreprises' },
    ],
    tips: [
      "« Assistant de direction », « office manager » et « assistant de gestion » sont trois intitulés qui ne se recoupent pas totalement — créez une alerte par formulation si vous êtes ouvert aux trois.",
      "Le secteur de l’employeur compte beaucoup sur ce poste : précisez-le dans votre recherche (startup, cabinet, hôpital, administration) pour des offres mieux ciblées.",
      "Si vous visez un poste bilingue, ajoutez « anglais » à votre recherche ou filtrez par langue sur le site : les offres ne le précisent pas toujours dans le titre.",
    ],
    faq: [
      {
        question: "Les postes de secrétaire ou d’hôtesse d’accueil sont-ils couverts ?",
        answer:
          "Pas dans une recherche « assistant de direction » — créez des alertes spécifiques avec les intitulés exacts si vous visez ces postes.",
      },
      {
        question: "Combien d’alertes puis-je créer ?",
        answer: "Autant que vous voulez, sur tous les plans.",
      },
    ],
  },
  {
    slug: 'ingenieur',
    name: 'ingénieur',
    searchTerm: 'ingénieur',
    intro:
      "Les offres d’ingénieur varient fortement selon la spécialité et le secteur. Alertemploi surveille vos recherches et vous prévient dès la publication d’une offre correspondant à vos critères.",
    boards: [
      { slug: 'apec', name: 'APEC', why: 'référence pour tous les profils ingénieurs cadres, toutes spécialités' },
      { slug: 'linkedin', name: 'LinkedIn', why: 'fort sur les postes en grands comptes, ESN et entreprises internationales' },
      { slug: 'indeed', name: 'Indeed', why: "couvre les PME industrielles et les bureaux d’études qui ne publient pas sur l’APEC" },
    ],
    tips: [
      "Une recherche générique « ingénieur » ramène des offres très hétérogènes : précisez la spécialité (génie civil, informatique, mécanique, électronique, chimie) pour des résultats exploitables.",
      "Les ESN et les cabinets de conseil publient massivement sur LinkedIn et Indeed — si vous les évitez, la blacklist du plan Pro vous permet de les écarter avant l’envoi.",
      "Pour les postes industriels en région, France Travail capte des offres de PME qui ne publient pas sur les grands job boards généralistes.",
    ],
    faq: [
      {
        question: "Les offres en bureau d’études sont-elles couvertes ?",
        answer: "Oui, si elles apparaissent dans les résultats de votre recherche sur le site que vous surveillez.",
      },
      {
        question: "Puis-je surveiller plusieurs spécialités ?",
        answer: "Oui, créez une alerte par spécialité. Leur nombre est illimité sur tous les plans.",
      },
    ],
  },
];

export function getJob(slug: string): Job | undefined {
  return JOBS.find((j) => j.slug === slug);
}
