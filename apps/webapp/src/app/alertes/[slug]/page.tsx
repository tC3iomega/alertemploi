import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { JOBS } from '../../metiers/jobs';
import { SITE_URL } from '../../seo';
import { BOARDS, getBoard } from '../boards';
import { PageShell, Section } from '../shell';

export function generateStaticParams() {
  return BOARDS.map((board) => ({ slug: board.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const board = getBoard(slug);
  if (!board) return {};
  const title = `Alerte emploi ${board.name} : les offres par email`;
  return {
    title,
    description: board.intro.slice(0, 155),
    alternates: { canonical: `/alertes/${board.slug}` },
    openGraph: { title: `${title} | Alertemploi`, description: board.intro, url: `/alertes/${board.slug}` },
  };
}

export default async function BoardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const board = getBoard(slug);
  if (!board) notFound();

  const siblings = BOARDS.filter((b) => b.slug !== board.slug).slice(0, 3);
  const relatedJobs = JOBS.filter((j) => j.boards.some((b) => b.slug === board.slug));

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Alertes par site', item: `${SITE_URL}/alertes` },
        { '@type': 'ListItem', position: 3, name: board.name, item: `${SITE_URL}/alertes/${board.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `Créer une alerte emploi ${board.name}`,
      step: board.steps.map((text, i) => ({ '@type': 'HowToStep', position: i + 1, text })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: board.faq.map((item) => ({
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
        { label: 'Alertes par site', href: '/alertes' },
        { label: board.shortName },
      ]}
      title={`Alerte emploi ${board.name} : recevez les offres par email`}
      intro={board.intro}
      jsonLd={jsonLd}
    >
      <Section title={`Créer votre alerte ${board.name} en 4 étapes`}>
        <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {board.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p style={{ marginTop: 14 }}>
          Le point important est l&apos;adresse de la page de résultats : elle contient tous vos filtres. Alertemploi
          surveille exactement cette recherche, ni plus ni moins.{' '}
          <a href={board.searchUrl} target="_blank" rel="noopener noreferrer nofollow">
            Ouvrir {board.name}
          </a>
          .
        </p>
      </Section>

      <Section title="Ce que fait Alertemploi ensuite">
        <p>
          Votre recherche est relue <strong>toutes les 30 minutes</strong>, jour et nuit. Dès qu&apos;une offre
          n&apos;ayant jamais été vue apparaît, elle part dans un email avec le titre, l&apos;entreprise, le lieu et un
          lien direct. Les offres restent consultables dans votre tableau de bord, où vous pouvez les marquer comme
          postulées ou les archiver.
        </p>
      </Section>

      <Section title={`Et les alertes natives de ${board.name} ?`}>
        <p>{board.native}</p>
      </Section>

      <Section title="Questions fréquentes">
        {board.faq.map((item) => (
          <div key={item.question} style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{item.question}</h3>
            <p style={{ margin: 0 }}>{item.answer}</p>
          </div>
        ))}
      </Section>

      {relatedJobs.length > 0 && (
        <Section title={`Métiers qui recrutent sur ${board.name}`}>
          <p>
            {relatedJobs.map((job, i) => (
              <span key={job.slug}>
                {i > 0 && ' · '}
                <Link href={`/metiers/${job.slug}`}>Alerte {job.name}</Link>
              </span>
            ))}
          </p>
          <p style={{ marginTop: 10 }}>
            <Link href="/metiers">Tous les métiers</Link>
          </p>
        </Section>
      )}

      <Section title="Autres sites surveillés">
        <p>
          {siblings.map((sibling, i) => (
            <span key={sibling.slug}>
              {i > 0 && ' · '}
              <Link href={`/alertes/${sibling.slug}`}>Alerte {sibling.name}</Link>
            </span>
          ))}
        </p>
        <p style={{ marginTop: 10 }}>
          <Link href="/alertes">Voir les 7 sites surveillés</Link>
        </p>
      </Section>
    </PageShell>
  );
}
