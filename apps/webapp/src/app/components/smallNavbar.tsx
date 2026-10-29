'use client';

import { ArchiveIcon, CheckCircleIcon, HomeIcon, MenuIcon, PlusCircleIcon, SparklesIcon } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuDrawer } from './MenuDrawer';

export function SmallNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Accueil', path: '/dashboard', Icon: HomeIcon },
    { name: 'Nouvelles', path: '/jobs/list/new', Icon: SparklesIcon },
    { name: 'Postulées', path: '/jobs/list/applied', Icon: CheckCircleIcon },
    { name: 'Archivées', path: '/jobs/list/archived', Icon: ArchiveIcon },
    { name: 'Alertes', path: '/links', Icon: PlusCircleIcon },
  ];

  return (
    <nav style={{ height: 64, width: '100vw' }}>
      <div style={{
        background: 'var(--ae-bg)', borderTop: '1px solid var(--ae-border)',
        position: 'fixed', bottom: 0, zIndex: 50,
        display: 'flex', height: 64, width: '100vw',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
      }}>
        {navItems.map(({ name, path, Icon }) => {
          const isActive = pathname === path;
          const color = isActive ? 'var(--ae-primary)' : 'var(--ae-text-muted)';
          return (
            <Link key={name} href={path} style={{
              display: 'flex', flex: 1, flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 4, textDecoration: 'none', color,
            }}>
              <Icon style={{ width: 21, height: 21, color }} strokeWidth={isActive ? 2.3 : 1.8} />
              <span style={{ fontSize: 10, fontWeight: 500, color }}>{name}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setIsMenuOpen(true)}
          style={{
            display: 'flex', flex: 1, flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 4, background: 'none', border: 'none', cursor: 'pointer',
            color: isMenuOpen ? 'var(--ae-primary)' : 'var(--ae-text-muted)',
          }}
        >
          <MenuIcon
            style={{ width: 21, height: 21 }}
            strokeWidth={isMenuOpen ? 2.3 : 1.8}
          />
          <span style={{ fontSize: 10, fontWeight: 500 }}>Menu</span>
        </button>
      </div>

      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </nav>
  );
}
