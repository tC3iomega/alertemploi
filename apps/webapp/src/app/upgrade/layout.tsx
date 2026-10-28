import type { Metadata } from 'next';

// La page /upgrade est un composant client ('use client') et ne peut donc pas exporter
// `metadata` elle-même : ce layout s'en charge.
export const metadata: Metadata = {
  title: 'Tarifs : alertes emploi à partir de 4,99€/mois',
  description:
    'Basic 4,99€/mois ou Pro 14,99€/mois, sans engagement. Essai gratuit de 7 jours sans carte bancaire, résiliable à tout moment.',
  alternates: { canonical: '/upgrade' },
  openGraph: {
    title: 'Tarifs Alertemploi — à partir de 4,99€/mois',
    description: "Essai gratuit 7 jours, sans carte bancaire. Alertes illimitées sur 7 job boards français.",
    url: '/upgrade',
  },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
