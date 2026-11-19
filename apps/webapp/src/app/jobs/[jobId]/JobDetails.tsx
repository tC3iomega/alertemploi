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

      {/* CTA passelefiltre.fr — au bon moment : l'utilisateur a vu l'offre, va décider de postuler */}
      <a
        href="https://www.passelefiltre.fr/analyse"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-start gap-3 rounded-lg border border-dashed border-blue-200 bg-blue-50/60 px-4 py-3 text-sm no-underline transition-colors hover:bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30 dark:hover:bg-blue-950/50"
      >
        <span className="mt-0.5 text-lg leading-none">🎯</span>
        <span>
          <span className="font-medium text-blue-700 dark:text-blue-300">Votre CV passe-t-il le filtre ATS de cette offre ?</span>
          <span className="ml-1 text-blue-600/80 dark:text-blue-400/80">
            Analysez-le sur <span className="underline">passelefiltre.fr</span> — score, mots-clés manquants et corrections en 2 min.
          </span>
        </span>
      </a>

      <div className="mt-6 px-2">
        <JobDescription job={job} />
      </div>
    </div>
  );
}
