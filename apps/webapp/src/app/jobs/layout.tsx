import Link from 'next/link';
import { SmallNavbar } from '../components/smallNavbar';

function AppHeader() {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 20px', borderBottom: '0.5px solid #E2E8F0',
      background: '#F1EFE8', position: 'sticky', top: 0, zIndex: 50,
    }}>
      <Link href="/jobs/list/new" style={{ textDecoration: 'none' }}>
        <svg width="130" height="28" viewBox="0 0 130 28" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="14" r="10" fill="none" stroke="#2563EB" strokeWidth="2"/>
          <circle cx="12" cy="14" r="3.5" fill="#2563EB"/>
          <line x1="19" y1="7" x2="23" y2="3" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="24" cy="2.5" r="3" fill="#F59E0B"/>
          <text x="32" y="19" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="700" fill="#1E293B">alert<tspan fill="#2563EB">emploi</tspan></text>
        </svg>
      </Link>
      <Link href="/upgrade" style={{
        fontSize: 12, fontWeight: 500, color: '#2563EB',
        background: '#DBEAFE', padding: '5px 12px', borderRadius: 20,
        textDecoration: 'none',
      }}>Passer Pro</Link>
    </header>
  );
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="min-h-screen w-screen">
      <AppHeader />
      <div className="mx-auto max-w-5xl">{children}</div>
      <SmallNavbar />
    </section>
  );
}
