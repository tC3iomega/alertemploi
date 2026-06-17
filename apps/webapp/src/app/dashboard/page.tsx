import Link from 'next/link';

export const dynamic = 'force-dynamic';
import { listLinks, listJobs, getProfile } from '../actions';
import { DashboardClient } from './DashboardClient';

export default async function DashboardPage() {
  const [links, profile] = await Promise.all([
    listLinks(),
    getProfile(),
  ]);

  const formData = new FormData();
  formData.set('status', 'new');
  formData.set('limit', '5');
  const newJobsResult = await listJobs(formData);

  return (
    <DashboardClient
      links={links}
      profile={profile}
      recentJobs={newJobsResult.jobs}
      newJobsCount={newJobsResult.jobs.length}
    />
  );
}

