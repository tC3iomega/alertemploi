'use client';

import { useState } from 'react';

import { Job, JobLabel, JobStatus } from '@alertemploi/core';
import { JobDescription, JobSummary, toast, useError, useSdk } from '@alertemploi/ui';

export type JobDetailsProps = {
  job: Job;
};
export function JobDetails({ job: initialJob }: JobDetailsProps) {
  const { handleError } = useError();
  const sdk = useSdk();

  const [job, setJob] = useState<Job>(initialJob);

  const onOpenUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const onUpdateJobStatus = async (jobId: number, status: JobStatus) => {
    try {
      await sdk.updateJobStatus({ jobId, status });
      setJob((prevJob) => ({ ...prevJob, status }));
      toast({
        title: 'Statut mis à jour',
        variant: 'success',
      });
    } catch (error) {
      handleError({ error, title: 'Impossible de mettre à jour le statut' });
    }
  };

  const onUpdateLabels = async (jobId: number, labels: JobLabel[]) => {
    try {
      await sdk.updateJobLabels({ jobId, labels });
      setJob((prevJob) => ({ ...prevJob, labels }));
    } catch (error) {
      handleError({ error, title: 'Impossible de mettre à jour le label' });
    }
  };

  return (
    <div className="px-2 py-4">
      <JobSummary
        job={job}
        onOpenUrl={onOpenUrl}
        onUpdateJobStatus={onUpdateJobStatus}
        onUpdateLabels={onUpdateLabels}
        onView={(job: Job) => onOpenUrl(job.externalUrl)}
      />

      <div className="mt-6 px-2">
        <JobDescription job={job} />
      </div>
    </div>
  );
}
