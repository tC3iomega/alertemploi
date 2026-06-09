import { listJobs, listLinks, listSites, scanLinks } from '@/app/actions';
import { JobStatus, throwError } from '@alertemploi/core';

import { WithClientProviders } from '../../../components/clientProviders';
import { ListJobsFeed } from './ListJobsFeed';

export default async function JobsPage({
  params,
  searchParams,
}: {
  params: Promise<{ status: string }>;
  searchParams: Promise<{
    search?: string;
    site_ids?: string;
    link_ids?: string;
    labels?: string;
  }>;
}) {
  const { status } = await params;

  const validStatuses: JobStatus[] = ['new', 'applied', 'archived', 'excluded_by_advanced_matching'];
  const currentStatus: JobStatus = validStatuses.includes(status as JobStatus)
    ? (status as JobStatus)
    : throwError(`invalid job status: ${status}`);

  const { search, site_ids, link_ids, labels } = await searchParams;

  const formData = new FormData();
  formData.set('status', currentStatus);
  if (search) formData.set('search', search);
  if (site_ids) formData.set('siteIds', site_ids);
  if (link_ids) formData.set('linkIds', link_ids);
  if (labels) formData.set('labels', labels);
  const limit = 30;
  formData.set('limit', String(limit));

  const [sites, links, listJobsResult] = await Promise.all([listSites(), listLinks(), listJobs(formData)]);

  return (
    <WithClientProviders sites={sites} links={links}>
      <ListJobsFeed listJobsResult={listJobsResult} batchSize={limit} status={currentStatus} />
      {currentStatus === 'new' && links.length > 0 && (
        <form action={scanLinks}>
          <button
            type="submit"
            className="fixed bottom-20 right-4 z-50 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow-lg hover:opacity-90"
          >
            🔄 Scanner
          </button>
        </form>
      )}
    </WithClientProviders>
  );
}
