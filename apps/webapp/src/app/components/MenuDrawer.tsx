'use client';

import { LogOutIcon, MoonIcon, SunIcon, XIcon, FileTextIcon, ShieldIcon, MailIcon, CreditCardIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { signOut, createPortalSession } from '../actions';
import { useError } from '@alertemploi/ui';

export function MenuDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { handleError } = useError();
  const currentTheme = resolvedTheme || theme;
  const [mounted, setMounted] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const onToggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  const onLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
        throw error;
      }
      handleError({ error, title: 'Failed to logout' });
    }
  };

  async function handleManageBilling() {
    setPortalLoading(true);
    try {
      const { url } = await createPortalSession();
      window.location.href = url;
    } catch (e) {
      setPortalLoading(false);
      alert("Impossible d'ouvrir le portail de facturation. Veuillez réessayer.");
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          zIndex: 100, opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: '#F1EFE8', borderRadius: '16px 16px 0 0',
          zIndex: 101, maxHeight: '80vh', overflowY: 'auto',
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.25s ease',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', borderBottom: '0.5px solid #E2E8F0',
        }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: '#1E293B', margin: 0 }}>Menu</h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <XIcon className="h-5 w-5" style={{ color: '#64748B' }} />
          </button>
        </div>

        <div style={{ padding: '8px 0 24px' }}>
          <MenuRow
            icon={currentTheme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            label={`Mode ${currentTheme === 'dark' ? 'clair' : 'sombre'}`}
            onClick={onToggleTheme}
          />

          <Link href="/upgrade" onClick={onClose} style={{ textDecoration: 'none' }}>
            <MenuRow icon={<span style={{ fontSize: 18 }}>⭐</span>} label="Passer à Pro" />
          </Link>

          <MenuRow
            icon={<CreditCardIcon className="h-5 w-5" />}
            label={portalLoading ? 'Chargement...' : 'Gérer mon abonnement'}
            onClick={handleManageBilling}
            disabled={portalLoading}
          />

          <div style={{ height: 8 }} />

          <Link href="/legal" onClick={onClose} style={{ textDecoration: 'none' }}>
            <MenuRow icon={<FileTextIcon className="h-5 w-5" />} label="Mentions légales" />
          </Link>

          <Link href="/privacy" onClick={onClose} style={{ textDecoration: 'none' }}>
            <MenuRow icon={<ShieldIcon className="h-5 w-5" />} label="Confidentialité" />
          </Link>

          <a href="mailto:contact@alertemploi.com" style={{ textDecoration: 'none' }}>
            <MenuRow icon={<MailIcon className="h-5 w-5" />} label="Contactez-nous" />
          </a>

          <div style={{ height: 8 }} />

          <MenuRow
            icon={<LogOutIcon className="h-5 w-5" />}
            label="Déconnexion"
            onClick={onLogout}
            destructive
          />
        </div>
      </div>
    </>
  );
}

function MenuRow({
  icon,
  label,
  onClick,
  destructive = false,
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  destructive?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        width: '100%', padding: '13px 20px',
        background: 'none', border: 'none', textAlign: 'left',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        color: destructive ? '#DC2626' : '#1E293B',
        fontSize: 15,
      }}
    >
      <span style={{ color: destructive ? '#DC2626' : '#64748B', display: 'flex' }}>{icon}</span>
      {label}
    </button>
  );
}

