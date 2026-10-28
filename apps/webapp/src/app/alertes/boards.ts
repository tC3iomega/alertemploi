/**
 * Contenu des pages « alerte emploi <job board> ».
 *
 * Ces pages servent deux objectifs à la fois : capter les recherches du type « recevoir les
 * offres France Travail par email » et expliquer l'étape où les inscrits décrochent —
 * récupérer l'URL de sa recherche. Elles restent volontairement courtes : c'est un outil,
 * pas un blog.
 */
export type Board = {
  slug: string;
  name: string;
  /** Titre court utilisé dans les listes et le fil d'ariane. */
  shortName: string;
  searchUrl: string;
  /** Promesse de la page, reprise en meta description. */
  intro: string;
  /** Étapes pour récupérer l'URL de recherche, propres à ce site. */
  steps: string[];
  /** Ce que le site fait déjà, pour rester honnête sur l'apport d'Alertemploi. */
  native: string;
  faq: { question: string; answer: string }[];
};

export const BOARDS: Board[] = [
  {
    slug: 'france-travail',
    name: 'France Travail',
    shortName: 'France Travail',
    searchUrl: 'https://candidat.francetravail.fr/offres/recherche',
    intro:
      "France Travail publie des milliers d'offres chaque jour. Alertemploi surveille votre recherche et vous envoie un email dès qu'une nouvelle offre correspond à vos critères.",
    steps: [
      'Ouvrez la recherche d’offres sur candidat.francetravail.fr et saisissez votre métier et votre zone géographique.',
      'Affinez avec les filtres qui comptent pour vous : type de contrat, temps de travail, expérience, date de publication.',
      'Copiez l’adresse affichée dans la barre de votre navigateur : elle contient tous vos filtres.',
      'Collez-la dans Alertemploi. C’est tout — la surveillance démarre immédiatement.',
    ],
    native:
      "France Travail propose ses propres alertes. L'intérêt d'Alertemploi est ailleurs : surveiller en même temps France Travail, l'APEC, Indeed, LinkedIn et les autres, et tout recevoir au même endroit, sans multiplier les comptes et les emails.",
    faq: [
      {
        question: 'À quelle fréquence les offres France Travail sont-elles vérifiées ?',
        answer:
          'Toutes les 30 minutes, 24h/24. Une offre publiée le matin vous parvient donc généralement dans l’heure.',
      },
      {
        question: 'Puis-je surveiller plusieurs recherches France Travail ?',
        answer:
          'Oui, le nombre d’alertes est illimité. Beaucoup de candidats créent une alerte par métier ou par ville.',
      },
    ],
  },
  {
    slug: 'indeed',
    name: 'Indeed',
    shortName: 'Indeed',
    searchUrl: 'https://fr.indeed.com/jobs',
    intro:
      "Indeed agrège une grande partie du marché français. Alertemploi relit votre recherche toutes les 30 minutes et vous prévient par email dès qu'une offre apparaît.",
    steps: [
      'Lancez votre recherche sur fr.indeed.com avec votre métier et votre ville.',
      'Appliquez vos filtres, puis triez par date si vous voulez voir les offres les plus récentes.',
      'Copiez l’adresse de la page de résultats.',
      'Collez-la dans Alertemploi.',
    ],
    native:
      "Indeed envoie déjà des emails d'alerte, souvent en lot et avec des offres déjà vues. Alertemploi vous donne un flux unique pour tous vos job boards, et vous pouvez écarter des entreprises précises avec le plan Pro.",
    faq: [
      {
        question: 'Les offres Indeed sponsorisées sont-elles incluses ?',
        answer:
          'Alertemploi reprend les offres telles qu’elles apparaissent dans vos résultats de recherche, sponsorisées comprises.',
      },
      {
        question: 'Puis-je exclure certaines entreprises ?',
        answer:
          'Oui, avec le plan Pro : les offres des entreprises de votre blacklist sont écartées avant l’envoi de l’email.',
      },
    ],
  },
  {
    slug: 'linkedin',
    name: 'LinkedIn',
    shortName: 'LinkedIn',
    searchUrl: 'https://www.linkedin.com/jobs',
    intro:
      "Sur LinkedIn, les offres les plus visibles partent vite. Alertemploi surveille votre recherche et vous alerte par email dès la publication.",
    steps: [
      'Ouvrez la recherche d’emploi LinkedIn et saisissez votre poste et votre localisation.',
      'Appliquez vos filtres, puis choisissez le tri par date de publication pour voir les offres les plus récentes.',
      'Copiez l’adresse de la page de résultats.',
      'Collez-la dans Alertemploi.',
    ],
    native:
      "LinkedIn propose ses propres alertes, mais elles restent dans LinkedIn. Alertemploi regroupe LinkedIn avec vos autres recherches dans un seul email, et garde l'historique des offres détectées.",
    faq: [
      {
        question: 'Faut-il un compte LinkedIn Premium ?',
        answer: 'Non. Alertemploi s’appuie sur les résultats de recherche publics, sans accès à votre compte.',
      },
      {
        question: 'Combien de temps après la publication suis-je prévenu ?',
        answer: 'Le scan tourne toutes les 30 minutes : en pratique, vous êtes prévenu dans l’heure.',
      },
    ],
  },
  {
    slug: 'apec',
    name: 'APEC',
    shortName: 'APEC',
    searchUrl: 'https://www.apec.fr/candidat/recherche-emploi.html/emploi',
    intro:
      "L'APEC est la référence pour les postes cadres. Alertemploi surveille votre recherche et vous envoie les nouvelles offres par email.",
    steps: [
      'Faites votre recherche sur apec.fr avec votre fonction et votre région.',
      'Affinez avec les filtres : type de contrat, niveau d’expérience, salaire.',
      'Copiez l’adresse de la page de résultats.',
      'Collez-la dans Alertemploi.',
    ],
    native:
      "L'APEC propose ses propres alertes pour ses offres. Alertemploi a du sens si vous surveillez aussi d'autres sources — les postes cadres sont souvent publiés en parallèle sur l'APEC, Cadremploi et LinkedIn.",
    faq: [
      {
        question: 'Alertemploi couvre-t-il les offres cadres des autres sites ?',
        answer:
          'Oui. Beaucoup de candidats cadres créent une alerte APEC, une Cadremploi et une LinkedIn, et reçoivent le tout au même endroit.',
      },
      {
        question: 'Faut-il un compte APEC ?',
        answer: 'Non, Alertemploi lit les résultats publics de votre recherche.',
      },
    ],
  },
  {
    slug: 'welcome-to-the-jungle',
    name: 'Welcome to the Jungle',
    shortName: 'Welcome to the Jungle',
    searchUrl: 'https://www.welcometothejungle.com/fr/jobs',
    intro:
      "Les startups et scale-ups publient beaucoup sur Welcome to the Jungle, et les offres attirent vite des dizaines de candidatures. Alertemploi vous prévient dès leur mise en ligne.",
    steps: [
      'Lancez votre recherche sur welcometothejungle.com avec votre métier et votre ville.',
      'Appliquez vos filtres : type de contrat, télétravail, secteur.',
      'Copiez l’adresse de la page de résultats.',
      'Collez-la dans Alertemploi.',
    ],
    native:
      "Welcome to the Jungle envoie des alertes par email. L'apport d'Alertemploi est de les fusionner avec vos autres recherches et de vous laisser filtrer les entreprises que vous ne visez pas.",
    faq: [
      {
        question: 'Les offres en télétravail sont-elles gérées ?',
        answer:
          'Oui, si votre recherche contient ce filtre : Alertemploi surveille exactement la recherche que vous lui donnez.',
      },
      {
        question: 'Puis-je surveiller plusieurs métiers ?',
        answer: 'Oui, créez simplement une alerte par recherche. Leur nombre est illimité.',
      },
    ],
  },
  {
    slug: 'hellowork',
    name: 'HelloWork',
    shortName: 'HelloWork',
    searchUrl: 'https://www.hellowork.com/fr-fr/emploi/recherche.html',
    intro:
      "HelloWork couvre largement les offres régionales et les PME. Alertemploi surveille votre recherche et vous alerte par email.",
    steps: [
      'Faites votre recherche sur hellowork.com avec votre métier et votre ville.',
      'Affinez avec les filtres : contrat, expérience, salaire.',
      'Copiez l’adresse de la page de résultats.',
      'Collez-la dans Alertemploi.',
    ],
    native:
      "HelloWork propose ses alertes. Alertemploi devient utile dès que vous surveillez plusieurs sites : vous n'avez qu'une seule boîte à consulter.",
    faq: [
      {
        question: 'Les offres des PME régionales sont-elles couvertes ?',
        answer: "Oui, Alertemploi reprend l'intégralité des résultats de la recherche que vous lui confiez.",
      },
      {
        question: 'Combien d’alertes puis-je créer ?',
        answer: 'Autant que vous voulez, sur tous les plans.',
      },
    ],
  },
  {
    slug: 'cadremploi',
    name: 'Cadremploi',
    shortName: 'Cadremploi',
    searchUrl: 'https://www.cadremploi.fr/emploi/liste_offres.html',
    intro:
      "Cadremploi concentre les postes cadres et les rémunérations élevées. Alertemploi surveille votre recherche et vous prévient dès qu'une offre apparaît.",
    steps: [
      'Lancez votre recherche sur cadremploi.fr avec votre fonction et votre région.',
      'Affinez avec les filtres : salaire, expérience, type de contrat.',
      'Copiez l’adresse de la page de résultats.',
      'Collez-la dans Alertemploi.',
    ],
    native:
      "Cadremploi envoie ses propres alertes. L'intérêt d'Alertemploi est de les croiser avec l'APEC et LinkedIn, où les mêmes postes sont souvent publiés à quelques heures d'écart.",
    faq: [
      {
        question: 'Puis-je filtrer par salaire ?',
        answer: 'Oui, si le filtre est appliqué dans votre recherche Cadremploi : Alertemploi la reprend telle quelle.',
      },
      {
        question: 'Les offres sont-elles dédoublonnées entre sites ?',
        answer:
          'Chaque alerte est suivie séparément. Une même offre publiée sur deux sites peut donc apparaître deux fois.',
      },
    ],
  },
];

export function getBoard(slug: string): Board | undefined {
  return BOARDS.find((b) => b.slug === slug);
}
