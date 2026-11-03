'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { scanLinks } from '@/app/actions';

export function ScanButton() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);

  async function handleScan() {
    setScanning(true);
    await scanLinks();
    await new Promise(resolve => setTimeout(resolve, 2000));
    window.location.reload();
    setScanning(false);
  }

  return (
    <button
      onClick={handleScan}
      disabled={scanning}
      style={{
        position: 'fixed', bottom: 80, right: 16, zIndex: 50,
        borderRadius: 9999, background: scanning ? 'var(--ae-surface-3)' : 'var(--ae-primary-bg)',
        color: scanning ? 'var(--ae-text-muted)' : 'white',
        padding: '8px 16px', fontSize: 13, fontWeight: 500,
        border: 'none', cursor: scanning ? 'not-allowed' : 'pointer',
        boxShadow: scanning ? '0 2px 6px rgba(0,0,0,0.1)' : '0 4px 16px rgba(29,78,216,0.35)',
        display: 'flex', alignItems: 'center', gap: 6,
        opacity: scanning ? 0.6 : 1, transition: 'box-shadow 0.2s, opacity 0.2s',
      }}
    >
      {scanning ? (
        <>
          <span style={{
            display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
            background: 'var(--ae-text-muted)',
            animation: 'ae-pulse 1.4s ease-in-out infinite',
          }} />
          Scan...
        </>
      ) : 'Scanner'}
    </button>
  );
}
