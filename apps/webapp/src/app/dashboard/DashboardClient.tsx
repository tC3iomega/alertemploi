'use client';

import Link from 'next/link';
import { Job, Link as LinkType, Profile } from '@alertemploi/core';

function daysUntil(dateStr?: string): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function DashboardClient({
  links,
  profile,
  recentJobs,
  newJobsCount,
}: {
  links: LinkType[];
  profile: Profile | null;
  recentJobs: Job[];
  newJobsCount: number;
}) {
  const activeLinks = links.filter((l) => l.is_active);
  const trialDays = profile ? daysUntil(profile.trial_ends_at) : null;
  const isOnTrial = profile?.plan === 'free' && trialDays !== null && trialDays > 0;
  const isPro = profile?.plan === 'pro';

  return (
    <div style={{ padding: "20px 16px 32px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1E293B', marginBottom: 4, letterSpacing: -0.5 }}>
        Tableau de bord
      </h1>
      <p style={{ fontSize: 14, color: '#64748B', marginBottom: 24 }}>
        Voici un aperçu de votre activité.
      </p>

      {/* Trial / Plan banner */}
      {isOnTrial && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#FFFBEB', border: '1px solid #FCD34D',
          borderRadius: 10, padding: '12px 16px', marginBottom: 20,
        }}>
          <ClockIcon />
          <span style={{ fontSize: 13, color: '#92400E', flex: 1 }}>
            <strong>{trialDays} jour{trialDays !== 1 ? 's' : ''}</strong> restant{trialDays !== 1 ? 's' : ''} dans votre essai gratuit Pro.
          </span>
          <Link href="/upgrade" style={{
            fontSize: 12, fontWeight: 600, color: '#2563EB', textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}>
            Voir les plans
          </Link>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
        <Link href="/jobs/list/new" style={{
          background: 'white', borderRadius: 12, border: '0.5px solid #E2E8F0',
          padding: 18, textDecoration: 'none', display: 'block',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9, background: '#DBEAFE',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
          }}>
            <BellIcon />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1E293B' }}>{newJobsCount}</div>
          <div style={{ fontSize: 12, color: '#64748B' }}>Nouvelles offres</div>
        </Link>

        <Link href="/links" style={{
          background: 'white', borderRadius: 12, border: '0.5px solid #E2E8F0',
          padding: 18, textDecoration: 'none', display: 'block',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9, background: '#DBEAFE',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
          }}>
            <LinkIcon />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1E293B' }}>{activeLinks.length}</div>
          <div style={{ fontSize: 12, color: '#64748B' }}>Alerte{activeLinks.length !== 1 ? 's' : ''} active{activeLinks.length !== 1 ? 's' : ''}</div>
        </Link>
      </div>

      {/* No links yet — call to action */}
      {links.length === 0 && (
        <div style={{
          background: '#F0F7FF', border: '1px solid #DBEAFE',
          borderRadius: 12, padding: 22, marginBottom: 24, textAlign: 'center',
        }}>
          <p style={{ fontSize: 14, color: '#1E40AF', marginBottom: 14, lineHeight: 1.6 }}>
            Vous n'avez pas encore d'alerte. Créez-en une pour commencer à recevoir des offres.
          </p>
          <Link href="/links/new" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#2563EB', color: 'white', fontSize: 13, fontWeight: 600,
            padding: '9px 18px', borderRadius: 8, textDecoration: 'none',
          }}>
            <PlusIcon />
            Créer une alerte
          </Link>
        </div>
      )}

      {/* Recent jobs preview */}
      {recentJobs.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>Dernières offres</h2>
            <Link href="/jobs/list/new" style={{
              fontSize: 12, color: '#2563EB', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 3,
            }}>
              Tout voir <ArrowRightIcon />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentJobs.slice(0, 3).map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} style={{
                background: 'white', border: '0.5px solid #E2E8F0',
                borderRadius: 10, padding: '12px 14px', textDecoration: 'none',
                display: 'block',
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1E293B', marginBottom: 3 }}>
                  {job.title}
                </div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>
                  {job.companyName}{job.location ? ` · ${job.location}` : ''}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick action: new alert (always visible if links exist) */}
      {links.length > 0 && (
        <Link href="/links/new" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          fontSize: 13, fontWeight: 500, color: '#2563EB',
          border: '1px dashed #93C5FD', borderRadius: 10,
          padding: '12px 0', textDecoration: 'none', marginTop: 12,
        }}>
          <PlusIcon />
          Ajouter une autre alerte
        </Link>
      )}
    </div>
  );
}

