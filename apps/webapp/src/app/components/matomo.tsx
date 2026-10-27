'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { Suspense, useEffect, useRef } from 'react';

declare global {
  interface Window {
    _paq?: unknown[][];
  }
}

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL;
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;

/**
 * Tracks route changes. The App Router does not reload the page between routes, so Matomo
 * only ever sees the first page without this.
 */
function MatomoRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // The inline script below already tracks the first page view.
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const query = searchParams.toString();
    const url = pathname + (query ? `?${query}` : '');
    window._paq = window._paq ?? [];
    window._paq.push(['setCustomUrl', url]);
    window._paq.push(['setDocumentTitle', document.title]);
    window._paq.push(['trackPageView']);
  }, [pathname, searchParams]);

  return null;
}

/**
 * Matomo, configured without cookies (`disableCookies`): no consent banner is required and
 * the privacy policy stays accurate. Renders nothing until both env vars are set, so a
 * missing configuration can never break the app.
 */
export function MatomoAnalytics() {
  if (!MATOMO_URL || !MATOMO_SITE_ID) return null;

  const baseUrl = MATOMO_URL.endsWith('/') ? MATOMO_URL : `${MATOMO_URL}/`;

  return (
    <>
      <Script id="matomo" strategy="afterInteractive">
        {`
          var _paq = window._paq = window._paq || [];
          _paq.push(['disableCookies']);
          _paq.push(['enableLinkTracking']);
          _paq.push(['trackPageView']);
          (function() {
            var u = ${JSON.stringify(baseUrl)};
            _paq.push(['setTrackerUrl', u + 'matomo.php']);
            _paq.push(['setSiteId', ${JSON.stringify(String(MATOMO_SITE_ID))}]);
            var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
            g.async = true; g.src = u + 'matomo.js'; s.parentNode.insertBefore(g, s);
          })();
        `}
      </Script>
      <Suspense fallback={null}>
        <MatomoRouteTracker />
      </Suspense>
    </>
  );
}
