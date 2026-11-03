import type { Metadata } from 'next';

import { SITE_URL } from '../seo';

// La page /upgrade est un composant client ('use client') et ne peut donc pas exporter
// `metadata` elle-même : ce layout s'en charge.
export const metadata: Metadata = {
  title: 'Tarifs 2026 : alertes emploi à partir de 4,99€/mois',
  description:
    'Basic 4,99€/mois ou Pro 14,99€/mois, sans engagement. Essai gratuit de 7 jours sans carte bancaire, résiliable à tout moment.',
  keywords: [
    'tarif alerte emploi',
    'prix alertemploi',
    'abonnement veille emploi',
    'alerte emploi pas cher',
  ],
  alternates: { canonical: '/upgrade' },
  openGraph: {
    title: 'Tarifs Alertemploi 2026 — à partir de 4,99€/mois',
    description: "Essai gratuit 7 jours, sans carte bancaire. Alertes illimitées sur 7 job boards français.",
    url: '/upgrade',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tarifs', item: `${SITE_URL}/upgrade` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Alertemploi',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    offers: [
      {
        '@type': 'Offer',
        name: 'Basic mensuel',
        price: '4.99',
        priceCurrency: 'EUR',
        billingIncrement: 'P1M',
        description: 'Alertes illimitées, tous les job boards, scan toutes les 30 minutes.',
        url: `${SITE_URL}/upgrade`,
      },
      {
        '@type': 'Offer',
        name: 'Basic annuel',
        price: '41.90',
        priceCurrency: 'EUR',
        billingIncrement: 'P1Y',
        description: 'Alertes illimitées, tous les job boards, scan toutes les 30 minutes.',
        url: `${SITE_URL}/upgrade`,
      },
      {
        '@type': 'Offer',
        name: 'Pro mensuel',
        price: '14.99',
        priceCurrency: 'EUR',
        billingIncrement: 'P1M',
        description: "Tout Basic + blacklist d'entreprises + support prioritaire.",
        url: `${SITE_URL}/upgrade`,
      },
      {
        '@type': 'Offer',
        name: 'Pro annuel',
        price: '125.90',
        priceCurrency: 'EUR',
        billingIncrement: 'P1Y',
        description: "Tout Basic + blacklist d'entreprises + support prioritaire.",
        url: `${SITE_URL}/upgrade`,
      },
    ],
  },
];

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
