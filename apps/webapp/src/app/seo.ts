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

// Réponses rédigées pour être citables par les AI Overviews : directes, chiffrées, à la première personne.
export const FAQ_ITEMS = [
  {
    question: 'Comment fonctionne Alertemploi ?',
    answer:
      "Alertemploi surveille les résultats de votre recherche sur un job board (France Travail, APEC, LinkedIn, Indeed…) toutes les 30 minutes, 24h/24. Dès qu'une nouvelle offre apparaît, vous recevez un email avec le titre, l'entreprise, le lieu et un lien direct vers l'annonce. Vous n'avez rien à vérifier manuellement.",
  },
  {
    question: "Faut-il une carte bancaire pour l'essai gratuit ?",
    answer:
      "Non. Aucune carte bancaire n'est demandée à l'inscription. L'essai dure 7 jours, sans engagement et sans pré-autorisation bancaire. L'abonnement ne démarre qu'à votre initiative.",
  },
  {
    question: 'Quels job boards sont supportés ?',
    answer: `Alertemploi surveille 7 job boards français en 2026 : ${JOB_BOARDS.join(', ')}. D'autres sources sont en cours d'intégration.`,
  },
  {
    question: 'Puis-je annuler à tout moment ?',
    answer:
      'Oui, sans engagement et sans délai. Vous résiliez depuis votre espace personnel en un clic. L'accès reste actif jusqu'à la fin de la période en cours.',
  },
  {
    question: 'Quelle est la différence entre Basic et Pro ?',
    answer:
      "Les deux plans incluent les alertes illimitées sur les 7 job boards et le scan toutes les 30 minutes. Le plan Pro ajoute un filtre de blacklist d'entreprises (pour écarter les offres des entreprises que vous ne visez pas) et un support prioritaire.",
  },
  {
    question: 'En combien de temps suis-je prévenu après la publication d'une offre ?',
    answer:
      'En pratique, moins d'une heure. Le scan tourne toutes les 30 minutes : une offre publiée à 9h00 vous parvient généralement avant 9h30.',
  },
];

/** Coupe au dernier espace avant `max` caractères pour éviter un mot tronqué. */
export function truncateDescription(text: string, max = 155): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '…';
}

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
      dateModified: '2026-11-01',
      description:
        "Alertemploi surveille vos recherches sur 7 job boards français (France Travail, APEC, Indeed, LinkedIn, HelloWork, Cadremploi, Welcome to the Jungle) et vous envoie un email dès qu'une nouvelle offre correspond à vos critères. Scan toutes les 30 minutes.",
      offers: [
        {
          '@type': 'Offer',
          name: 'Basic',
          price: '4.99',
          priceCurrency: 'EUR',
          description: 'Alertes illimitées, 7 job boards français, scan toutes les 30 minutes. Essai 7 jours gratuit.',
        },
        {
          '@type': 'Offer',
          name: 'Pro',
          price: '14.99',
          priceCurrency: 'EUR',
          description: "Tout le plan Basic, plus la blacklist d'entreprises et le support prioritaire. Essai 7 jours gratuit.",
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
