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
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)', opacity: scanning ? 0.6 : 1,
      }}
    >
      {scanning ? '⏳ Scan...' : '🔄 Scanner'}
    </button>
  );
}
