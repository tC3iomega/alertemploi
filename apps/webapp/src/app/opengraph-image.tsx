import { ImageResponse } from 'next/og';

export const alt = "Alertemploi — Les offres d'emploi dès leur publication";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
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
        {/* Barre d'accent bleue en haut */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: '#2563EB', display: 'flex' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 80px', textAlign: 'center' }}>
          {/* Nom du service */}
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 36 }}>
            <span style={{ fontSize: 72, fontWeight: 700, color: '#1E293B', letterSpacing: -2 }}>alert</span>
            <span style={{ fontSize: 72, fontWeight: 700, color: '#2563EB', letterSpacing: -2 }}>emploi</span>
          </div>

          {/* Accroche principale */}
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: '#1E293B',
              lineHeight: 1.25,
              marginBottom: 28,
              maxWidth: 900,
            }}
          >
            {'Les offres d’emploi dans votre boîte mail, '}
            <span style={{ color: '#2563EB' }}>dès leur publication</span>
          </div>

          {/* Job boards */}
          <div style={{ fontSize: 20, color: '#64748B', marginBottom: 44 }}>
            France Travail · APEC · LinkedIn · Indeed · HelloWork · Cadremploi · WTTJ
          </div>

          {/* Badge CTA */}
          <div
            style={{
              background: '#2563EB',
              color: 'white',
              fontSize: 18,
              fontWeight: 600,
              padding: '14px 36px',
              borderRadius: 40,
            }}
          >
            Essai gratuit 7 jours — sans carte bancaire
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
