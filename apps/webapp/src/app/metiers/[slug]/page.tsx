import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageShell, Section } from '../../alertes/shell';
import { SITE_URL } from '../../seo';
import { JOBS, getJob } from '../jobs';

export function generateStaticParams() {
  return JOBS.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) return {};
  const title = `Alerte emploi ${job.name} : les offres par email`;
  return {
    title,
    description: job.intro.slice(0, 155),
    alternates: { canonical: `/metiers/${job.slug}` },
    openGraph: { title: `${title} | Alertemploi`, description: job.intro, url: `/metiers/${job.slug}` },
  };
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) notFound();

  const siblings = JOBS.filter((j) => j.slug !== job.slug).slice(0, 3);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Alertes par métier', item: `${SITE_URL}/metiers` },
        { '@type': 'ListItem', position: 3, name: job.name, item: `${SITE_URL}/metiers/${job.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: job.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ];

  return (
    <PageShell
      breadcrumb={[
        { label: 'Accueil', href: '/' },
        { label: 'Alertes par métier', href: '/metiers' },
        { label: job.name },
      ]}
      title={`Alerte emploi ${job.name} : recevez les offres par email`}
      intro={job.intro}
      jsonLd={jsonLd}
    >
      <Section title={`Les sites qui comptent pour un poste de ${job.name}`}>
        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {job.boards.map((board) => (
            <li key={board.slug}>
              <Link href={`/alertes/${board.slug}`}>{board.name}</Link> — {board.why}.
            </li>
          ))}
        </ul>
        <p style={{ marginTop: 12 }}>
          Chacune de ces pages explique comment récupérer l&apos;adresse de votre recherche sur le site concerné.
        </p>
      </Section>

      <Section title="Régler votre recherche avant de créer l'alerte">
        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {job.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </Section>

      <Section title="Ce que fait Alertemploi ensuite">
        <p>
          Vos recherches sont relues <strong>toutes les 30 minutes</strong>, jour et nuit. Dès qu&apos;une offre jamais
          vue apparaît, elle part dans un email avec le titre, l&apos;entreprise, le lieu et un lien direct. Rien à
          surveiller à la main, rien à rafraîchir.
        </p>
      </Section>

      <Section title="Questions fréquentes">
        {job.faq.map((item) => (
          <div key={item.question} style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{item.question}</h3>
            <p style={{ margin: 0 }}>{item.answer}</p>
          </div>
        ))}
      </Section>

      <Section title="Autres métiers">
        <p>
          {siblings.map((sibling, i) => (
            <span key={sibling.slug}>
              {i > 0 && ' · '}
              <Link href={`/metiers/${sibling.slug}`}>Alerte {sibling.name}</Link>
            </span>
          ))}
        </p>
        <p style={{ marginTop: 10 }}>
          <Link href="/metiers">Tous les métiers</Link> · <Link href="/comparatif">Comparatif des alertes emploi</Link>
        </p>
      </Section>
    </PageShell>
  );
}
