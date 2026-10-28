import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ThemeProvider } from './components/themeProvider';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { MatomoAnalytics } from './components/matomo';
import { SITE_NAME, SITE_URL, buildJsonLd } from './seo';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  // metadataBase rend absolues les URL d'images et de canoniques générées par Next.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Alerte emploi par email : les offres dès leur publication",
    template: '%s | Alertemploi',
  },
  description:
    "Recevez par email les nouvelles offres d'emploi de France Travail, APEC, Indeed, LinkedIn, HelloWork, Cadremploi et Welcome to the Jungle. Scan toutes les 30 minutes.",
  keywords: [
    'alerte emploi',
    'alerte offre emploi',
    'offres emploi par email',
    'veille emploi',
    'recherche emploi automatique',
    'France Travail alerte',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Alerte emploi par email : les offres dès leur publication",
    description:
      "Alertemploi surveille vos recherches sur 7 job boards français et vous prévient dès qu'une offre correspond à vos critères. Essai gratuit 7 jours, sans carte bancaire.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alerte emploi par email — Alertemploi',
    description: "Les nouvelles offres d'emploi dans votre boîte mail, dès leur publication.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/favicons/apple-touch-icon.png', sizes: '76x76' }],
    shortcut: [{ url: '/favicons/favicon.ico' }],
  },
  other: {
    'msapplication-TileColor': '#000000',
    manifest: '/favicons/site.webmanifest',
    maskIcon: '<link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5" />',
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
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen min-w-screen antialiased`}>
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
