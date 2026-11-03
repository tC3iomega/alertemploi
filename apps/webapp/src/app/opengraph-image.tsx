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
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: '#2563EB', display: 'flex' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 80px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 36 }}>
            <span style={{ fontSize: 72, fontWeight: 700, color: '#1E293B', letterSpacing: -2 }}>alert</span>
            <span style={{ fontSize: 72, fontWeight: 700, color: '#2563EB', letterSpacing: -2 }}>emploi</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', fontSize: 40, fontWeight: 700, color: '#1E293B', lineHeight: 1.25, marginBottom: 28, maxWidth: 900 }}>
            <span>Les offres dans votre boîte mail,</span>
            <span style={{ color: '#2563EB' }}> dès leur publication</span>
          </div>

          <div style={{ display: 'flex', fontSize: 20, color: '#64748B', marginBottom: 44 }}>
            <span>France Travail · APEC · LinkedIn · Indeed · HelloWork · Cadremploi · WTTJ</span>
          </div>

          <div style={{ display: 'flex', background: '#2563EB', color: 'white', fontSize: 18, fontWeight: 600, padding: '14px 36px', borderRadius: 40 }}>
            <span>Essai gratuit 7 jours — sans carte bancaire</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
