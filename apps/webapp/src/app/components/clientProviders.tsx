'use client';

import { JobSite, Link } from '@alertemploi/core';
import { LinksProvider, SdkProvider, SitesProvider, Toaster } from '@alertemploi/ui';

import { WebappApiSdk } from '../../lib/sdk';

export function WithClientProviders({
  sites,
  links,
  children,
}: {
  sites: JobSite[];
  links: Link[];
  children: React.ReactNode;
}) {
  return (
    <>
      <SdkProvider sdk={new WebappApiSdk()}>
        <SitesProvider sites={sites}>
          <LinksProvider links={links}>{children}</LinksProvider>
        </SitesProvider>
      </SdkProvider>
      <Toaster />
    </>
  );
}
