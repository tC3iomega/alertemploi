'use client';

import { ArchiveIcon, CheckCircleIcon, HomeIcon, MenuIcon, PlusCircleIcon, SparklesIcon } from 'lucide-react';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SmallNavbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Accueil', path: '/dashboard', Icon: HomeIcon },
    { name: 'Nouvelles', path: '/jobs/list/new', Icon: SparklesIcon },
    { name: 'Postulées', path: '/jobs/list/applied', Icon: CheckCircleIcon },
    { name: 'Archivées', path: '/jobs/list/archived', Icon: ArchiveIcon },
    { name: 'Alertes', path: '/links', Icon: PlusCircleIcon },
    { name: 'Menu', path: '/menu', Icon: MenuIcon },
  ];

  return (
    <nav className="h-16 w-screen">
      <div className="border-border bg-background fixed bottom-0 z-50 flex h-16 w-screen border-t shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
        {navItems.map(({ name, path, Icon }) => {
          const isActive = pathname === path;
          return (
            <Link key={name} href={path} className="flex h-full flex-1 flex-col items-center justify-center gap-1">
              <Icon
                className={clsx('h-[21px] w-[21px] transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')}
                strokeWidth={isActive ? 2.3 : 1.8}
              />
              <span
                className={clsx(
                  'text-[10px] font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

