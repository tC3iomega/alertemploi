import type { Metadata, Viewport } from 'next';

import { ThemeProvider } from './components/themeProvider';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { MatomoAnalytics } from './components/matomo';
import { SITE_NAME, SITE_URL, buildJsonLd } from './seo';

export const metadata: Metadata = {
  // metadataBase rend absolues les URL d'images et de canoniques générées par Next.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Alerte emploi par email 2026 : les offres dès leur publication",
    template: '%s | Alertemploi',
  },
  description:
    "Recevez par email les nouvelles offres d'emploi de France Travail, APEC, Indeed, LinkedIn, HelloWork, Cadremploi et Welcome to the Jungle. Scan toutes les 30 minutes. Essai gratuit 7 jours.",
  keywords: [
    'alerte emploi',
    'alerte offre emploi',
    'offres emploi par email',
    'veille emploi',
    'recherche emploi automatique',
    'France Travail alerte',
    'notification emploi',
    'alertemploi',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Alerte emploi par email 2026 : les offres dès leur publication",
    description:
      "Alertemploi surveille vos recherches sur 7 job boards français et vous prévient dès qu'une offre correspond à vos critères. Essai gratuit 7 jours, sans carte bancaire.",
    // og:image est généré automatiquement par opengraph-image.tsx dans ce dossier.
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alerte emploi par email — Alertemploi',
    description: "Les nouvelles offres d'emploi dans votre boîte mail, dès leur publication.",
    // twitter:image hérite de l'og:image généré par opengraph-image.tsx.
  },
  robots: { index: true, follow: true },
  manifest: '/favicons/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/favicons/apple-touch-icon.png', sizes: '76x76' }],
    shortcut: [{ url: '/favicons/favicon.ico' }],
    other: [{ rel: 'mask-icon', url: '/favicons/safari-pinned-tab.svg' }],
  },
  other: {
    'msapplication-TileColor': '#2563EB',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff' },
    { media: '(prefers-color-scheme: dark)', color: '#000' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen min-w-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
        <script
          type="application/ld+json"
          // Données structurées : éligibilité aux résultats enrichis (FAQ) et description
          // de l'offre pour Google.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
        />
        <Analytics />
        <MatomoAnalytics />
      </body>
    </html>
  );
}
