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
    router.refresh();
    setScanning(false);
  }

  return (
    <button
      onClick={handleScan}
      disabled={scanning}
      className="fixed bottom-20 right-4 z-50 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow-lg hover:opacity-90 disabled:opacity-50"
    >
      {scanning ? '⏳ Scan...' : '🔄 Scanner'}
    </button>
  );
}
