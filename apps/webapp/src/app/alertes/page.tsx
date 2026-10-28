import type { Metadata } from 'next';
import Link from 'next/link';

import { SITE_URL } from '../seo';
import { BOARDS } from './boards';
import { PageShell, Section } from './shell';

export const metadata: Metadata = {
  title: 'Alertes emploi par site : France Travail, Indeed, LinkedIn…',
  description:
    "Créez une alerte sur France Travail, Indeed, LinkedIn, l'APEC, HelloWork, Cadremploi ou Welcome to the Jungle, et recevez les nouvelles offres par email.",
  alternates: { canonical: '/alertes' },
  openGraph: {
    title: 'Alertes emploi par site — Alertemploi',
    description: 'Une alerte par recherche, sur les 7 principaux job boards français. Un seul email.',
    url: '/alertes',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Alertes par site', item: `${SITE_URL}/alertes` },
  ],
};

export default function AlertesHub() {
  return (
    <PageShell
      breadcrumb={[{ label: 'Accueil', href: '/' }, { label: 'Alertes par site' }]}
      title="Alertes emploi, site par site"
      intro="Vous cherchez déjà sur un ou plusieurs job boards. Alertemploi reprend exactement vos recherches, les relit toutes les 30 minutes et vous envoie un email dès qu'une nouvelle offre apparaît. Choisissez votre site pour voir la marche à suivre."
      jsonLd={jsonLd}
    >
      <Section title="Choisissez votre site">
        <div style={{ display: 'grid', gap: 12 }}>
          {BOARDS.map((board) => (
            <Link
              key={board.slug}
              href={`/alertes/${board.slug}`}
              style={{
                display: 'block',
                background: 'var(--ae-surface)',
                border: '0.5px solid var(--ae-border)',
                borderRadius: 10,
                padding: '14px 16px',
                textDecoration: 'none',
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ae-text)' }}>
                Alerte emploi {board.name}
              </span>
              <span style={{ display: 'block', fontSize: 13, color: 'var(--ae-text-muted)', marginTop: 4 }}>
                {board.intro}
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Pourquoi passer par Alertemploi ?">
        <p>
          La plupart de ces sites proposent déjà leurs propres alertes. L&apos;intérêt d&apos;Alertemploi apparaît dès
          que vous en surveillez plusieurs : au lieu de quatre comptes et quatre formats d&apos;email, vous recevez un
          seul message, avec les offres de toutes vos recherches, détectées dans l&apos;heure.
        </p>
        <p>
          Le plan Pro ajoute une blacklist d&apos;entreprises : les offres des sociétés que vous ne visez pas
          n&apos;arrivent jamais dans votre boîte. Voir les <Link href="/upgrade">tarifs</Link>.
        </p>
      </Section>
    </PageShell>
  );
}
