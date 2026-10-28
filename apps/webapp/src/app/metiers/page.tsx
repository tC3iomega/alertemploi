import type { Metadata } from 'next';
import Link from 'next/link';

import { PageShell, Section } from '../alertes/shell';
import { SITE_URL } from '../seo';
import { JOBS } from './jobs';

export const metadata: Metadata = {
  title: 'Alertes emploi par métier : développeur, infirmier, commercial…',
  description:
    "Créez une alerte sur votre métier et recevez les nouvelles offres par email, dès leur publication sur les principaux job boards français.",
  alternates: { canonical: '/metiers' },
  openGraph: {
    title: 'Alertes emploi par métier — Alertemploi',
    description: 'Les offres de votre métier par email, dès leur publication.',
    url: '/metiers',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Alertes par métier', item: `${SITE_URL}/metiers` },
  ],
};

export default function MetiersHub() {
  return (
    <PageShell
      breadcrumb={[{ label: 'Accueil', href: '/' }, { label: 'Alertes par métier' }]}
      title="Alertes emploi, métier par métier"
      intro="Selon le métier, les offres ne sortent pas aux mêmes endroits ni au même rythme. Ces pages indiquent les sites qui comptent vraiment pour votre profil et comment régler votre recherche avant de la confier à Alertemploi."
      jsonLd={jsonLd}
    >
      <Section title="Choisissez votre métier">
        <div style={{ display: 'grid', gap: 12 }}>
          {JOBS.map((job) => (
            <Link
              key={job.slug}
              href={`/metiers/${job.slug}`}
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
                Alerte emploi {job.name}
              </span>
              <span style={{ display: 'block', fontSize: 13, color: 'var(--ae-text-muted)', marginTop: 4 }}>
                {job.intro}
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Votre métier n'est pas listé ?">
        <p>
          Ce n&apos;est pas bloquant : Alertemploi surveille <strong>n&apos;importe quelle recherche</strong> sur les
          sites pris en charge. Ces pages ne sont que des guides ; la marche à suivre est la même pour tous les métiers
          et elle est détaillée pour chaque site dans <Link href="/alertes">les alertes par site</Link>.
        </p>
      </Section>
    </PageShell>
  );
}
