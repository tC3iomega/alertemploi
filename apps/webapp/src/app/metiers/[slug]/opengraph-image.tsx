import { ImageResponse } from 'next/og';

import { getJob } from '../jobs';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export const alt = "Alerte emploi par métier — Alertemploi";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = getJob(slug);
  const name = job?.name ?? slug;

  return new ImageResponse(
    <div
      style={{
        background: '#F1EFE8',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: '#2563EB', display: 'flex' }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 80px', textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 500, color: '#2563EB', marginBottom: 20, display: 'flex' }}>
          Alerte emploi
        </div>

        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            color: '#1E293B',
            lineHeight: 1.1,
            marginBottom: 28,
            letterSpacing: -1,
            display: 'flex',
          }}
        >
          {name}
        </div>

        <div style={{ fontSize: 24, color: '#64748B', marginBottom: 40, display: 'flex' }}>
          Recevez les nouvelles offres par email · Scan toutes les 30 minutes
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              background: '#2563EB',
              color: 'white',
              fontSize: 18,
              fontWeight: 600,
              padding: '12px 32px',
              borderRadius: 40,
              display: 'flex',
            }}
          >
            Essai gratuit 7 jours
          </div>
          <div style={{ display: 'flex', fontSize: 26, fontWeight: 700 }}>
            <span style={{ color: '#1E293B' }}>alert</span>
            <span style={{ color: '#2563EB' }}>emploi</span>
          </div>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
