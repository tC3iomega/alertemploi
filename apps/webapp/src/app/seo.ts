/**
 * Constantes SEO partagées (URL canonique, données structurées).
 *
 * Le site répond sur alertemploi.com et www.alertemploi.com, le premier redirigeant vers le
 * second : toutes les URL canoniques doivent pointer vers www, sinon chaque page est
 * annoncée à Google sous une adresse qui redirige.
 */
export const SITE_URL = 'https://www.alertemploi.com';
export const SITE_NAME = 'Alertemploi';

export const JOB_BOARDS = [
  'France Travail',
  'APEC',
  'Cadremploi',
  'HelloWork',
  'Welcome to the Jungle',
  'LinkedIn',
  'Indeed',
];

/** Questions reprises de la FAQ de la page d'accueil, pour le balisage FAQPage. */
export const FAQ_ITEMS = [
  {
    question: 'Comment fonctionne Alertemploi ?',
    answer:
      "Vous ajoutez l'URL de votre recherche sur un job board. Alertemploi la scanne toutes les 30 minutes et vous envoie un email dès qu'une nouvelle offre apparaît.",
  },
  {
    question: "Faut-il une carte bancaire pour l'essai gratuit ?",
    answer:
      "Aucune carte bancaire n'est demandée à l'inscription. Profitez de 7 jours d'essai gratuit, sans engagement.",
  },
  {
    question: 'Quels job boards sont supportés ?',
    answer: `${JOB_BOARDS.join(', ')}. D'autres sont en cours d'intégration.`,
  },
  {
    question: 'Puis-je annuler à tout moment ?',
    answer:
      'Oui, sans engagement. Vous pouvez annuler votre abonnement depuis votre espace personnel à tout moment.',
  },
  {
    question: 'Quelle est la différence entre Basic et Pro ?',
    answer:
      "Les deux plans incluent les alertes illimitées et tous les job boards. Le plan Pro ajoute un filtre de blacklist d'entreprises et un support prioritaire.",
  },
];

export function buildJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: SITE_NAME,
      url: SITE_URL,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      inLanguage: 'fr-FR',
      description:
        "Alertemploi surveille vos recherches sur les principaux job boards français et vous envoie un email dès qu'une nouvelle offre d'emploi correspond à vos critères.",
      offers: [
        {
          '@type': 'Offer',
          name: 'Basic',
          price: '4.99',
          priceCurrency: 'EUR',
          description: 'Alertes illimitées, tous les job boards, scan toutes les 30 minutes.',
        },
        {
          '@type': 'Offer',
          name: 'Pro',
          price: '14.99',
          priceCurrency: 'EUR',
          description: "Tout Basic, plus la blacklist d'entreprises et le support prioritaire.",
        },
      ],
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        email: 'contact@alertemploi.com',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ];
}
