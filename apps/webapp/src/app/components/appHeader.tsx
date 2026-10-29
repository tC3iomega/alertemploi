import Link from 'next/link';
import { getProfile } from '../actions';
import { Logo } from './Logo';

export async function AppHeader() {
  let isPro = false;
  try {
    const profile = await getProfile();
    isPro = profile?.plan === 'pro';
  } catch {}

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 20px', borderBottom: '0.5px solid var(--ae-border)',
      background: 'var(--ae-bg)', position: 'sticky', top: 0, zIndex: 50,
    }}>
      <Link href="/dashboard" style={{ textDecoration: 'none' }}>
        <Logo variant="header" />
      </Link>
      {!isPro && (
        <Link href="/upgrade" style={{
          fontSize: 12, fontWeight: 500, color: 'var(--ae-primary)',
          background: 'var(--ae-blue-bg)', padding: '5px 12px', borderRadius: 20,
          textDecoration: 'none',
        }}>Passer Pro</Link>
      )}
    </header>
  );
}
