'use client';

import Link from 'next/link';

export function EmptyState({ hasLinks }: { hasLinks: boolean }) {
  if (!hasLinks) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '64px 24px', maxWidth: 460, margin: '0 auto',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: '#DBEAFE',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
        }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>
        <h2 style={{ fontSize: 19, fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>
          Créez votre première alerte
        </h2>
        <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, marginBottom: 28 }}>
          Collez l'URL de votre recherche sur France Travail, LinkedIn, Indeed ou un autre job board.
          Alertemploi la surveille pour vous et vous notifie dès qu'une nouvelle offre apparaît.
        </p>
        <Link href="/links/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#2563EB', color: 'white', fontSize: 14, fontWeight: 600,
          padding: '11px 24px', borderRadius: 9, textDecoration: 'none',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Créer une alerte
        </Link>

        <div style={{
          display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center',
          marginTop: 28,
        }}>
          {['France Travail', 'APEC', 'LinkedIn', 'Indeed'].map((board) => (
            <span key={board} style={{
              fontSize: 12, color: '#64748B', background: '#F8FAFC',
              border: '0.5px solid #E2E8F0', borderRadius: 20, padding: '5px 14px',
            }}>{board}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center', padding: '64px 24px', maxWidth: 420, margin: '0 auto',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%', background: '#FFFBEB',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <h2 style={{ fontSize: 19, fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>
        Aucune nouvelle offre pour le moment
      </h2>
      <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6 }}>
        Vos alertes sont actives et scannées toutes les heures.
        Vous recevrez un email dès qu'une nouvelle offre correspond à vos critères.
      </p>
    </div>
  );
}

