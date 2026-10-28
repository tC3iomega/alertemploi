import type { Metadata } from 'next';
import Link from 'next/link';

import { PageShell, Section } from '../alertes/shell';
import { SITE_URL } from '../seo';

export const metadata: Metadata = {
  title: 'Alertes natives des job boards ou Alertemploi : que choisir ?',
  description:
    "France Travail, Indeed et LinkedIn envoient déjà des alertes. Comparaison honnête : ce qu'elles font bien, leurs limites, et quand un agrégateur devient utile.",
  alternates: { canonical: '/comparatif' },
  openGraph: {
    title: 'Alertes natives ou Alertemploi — comparatif',
    description: "Ce que font déjà les alertes des job boards, et quand un outil tiers apporte vraiment quelque chose.",
    url: '/comparatif',
  },
};

const FAQ = [
  {
    question: 'Les alertes des job boards sont-elles gratuites ?',
    answer:
      "Oui, et elles suffisent si vous ne suivez qu'un seul site. Alertemploi devient pertinent quand vous en surveillez plusieurs.",
  },
  {
    question: 'Alertemploi remplace-t-il les alertes natives ?',
    answer:
      "Il les regroupe. Vous pouvez tout à fait garder vos alertes existantes et utiliser Alertemploi en complément le temps de comparer.",
  },
  {
    question: 'Pourquoi un service payant alors que les alertes natives sont gratuites ?',
    answer:
      "Parce que surveiller cinq sites manuellement coûte du temps et fait manquer des offres. Si vous ne suivez qu'un seul site, les alertes natives restent le bon choix.",
  },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Comparatif', item: `${SITE_URL}/comparatif` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  },
];

const cell: React.CSSProperties = {
  padding: '10px 12px',
  borderBottom: '0.5px solid var(--ae-border)',
  fontSize: 14,
  verticalAlign: 'top',
};

export default function ComparatifPage() {
  return (
    <PageShell
      breadcrumb={[{ label: 'Accueil', href: '/' }, { label: 'Comparatif' }]}
      title="Alertes natives des job boards ou Alertemploi ?"
      intro="France Travail, Indeed, LinkedIn, l'APEC et les autres proposent déjà leurs propres alertes, gratuitement. Autant le dire franchement : si vous ne surveillez qu'un seul site, elles suffisent. Voici où se situe la différence."
      jsonLd={jsonLd}
    >
      <Section title="Ce que font déjà très bien les alertes natives">
        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <li>Elles sont gratuites et intégrées au site que vous utilisez déjà.</li>
          <li>Elles connaissent parfaitement leur propre catalogue d&apos;offres.</li>
          <li>Elles suffisent amplement si une seule source couvre votre marché.</li>
        </ul>
      </Section>

      <Section title="Où elles montrent leurs limites">
        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <li>
            <strong>Une alerte par site, un email par site.</strong> Quatre sites surveillés, c&apos;est quatre comptes,
            quatre formats et des doublons à trier chaque matin.
          </li>
          <li>
            <strong>Des envois souvent groupés.</strong> Un récapitulatif quotidien arrive après que les premiers
            candidats ont postulé.
          </li>
          <li>
            <strong>Peu de filtrage négatif.</strong> Écarter une entreprise précise est rarement possible.
          </li>
        </ul>
      </Section>

      <Section title="Comparaison">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...cell, textAlign: 'left', fontWeight: 600 }}></th>
              <th style={{ ...cell, textAlign: 'left', fontWeight: 600 }}>Alertes natives</th>
              <th style={{ ...cell, textAlign: 'left', fontWeight: 600 }}>Alertemploi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={cell}>Prix</td>
              <td style={cell}>Gratuit</td>
              <td style={cell}>À partir de 4,99 €/mois, essai 7 jours</td>
            </tr>
            <tr>
              <td style={cell}>Sources surveillées</td>
              <td style={cell}>Une par site</td>
              <td style={cell}>7 sites dans un seul flux</td>
            </tr>
            <tr>
              <td style={cell}>Fréquence de vérification</td>
              <td style={cell}>Variable, souvent quotidienne</td>
              <td style={cell}>Toutes les 30 minutes</td>
            </tr>
            <tr>
              <td style={cell}>Exclure des entreprises</td>
              <td style={cell}>Rarement possible</td>
              <td style={cell}>Oui, avec le plan Pro</td>
            </tr>
            <tr>
              <td style={cell}>Suivi des candidatures</td>
              <td style={cell}>Selon le site</td>
              <td style={cell}>Offres marquables comme postulées ou archivées</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section title="Alors, que choisir ?">
        <p>
          <strong>Un seul site surveillé&nbsp;:</strong> restez sur ses alertes natives, elles font le travail.
        </p>
        <p>
          <strong>Trois sites ou plus, et une recherche active&nbsp;:</strong> c&apos;est là qu&apos;un agrégateur se
          justifie — un seul email, détection dans l&apos;heure, et la possibilité d&apos;écarter ce qui ne vous
          intéresse pas. L&apos;essai de 7 jours sert exactement à vérifier si la différence est réelle pour vous.
        </p>
      </Section>

      <Section title="Questions fréquentes">
        {FAQ.map((item) => (
          <div key={item.question} style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{item.question}</h3>
            <p style={{ margin: 0 }}>{item.answer}</p>
          </div>
        ))}
      </Section>

      <Section title="Pour aller plus loin">
        <p>
          <Link href="/alertes">Créer une alerte site par site</Link> ·{' '}
          <Link href="/metiers">Conseils par métier</Link> · <Link href="/upgrade">Tarifs</Link>
        </p>
      </Section>
    </PageShell>
  );
}
