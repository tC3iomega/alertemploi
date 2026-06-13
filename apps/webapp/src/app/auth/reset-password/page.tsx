'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function Logo() {
  return (
    <svg width="160" height="36" viewBox="0 0 160 36" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="18" r="13" fill="none" stroke="#2563EB" strokeWidth="2.5" />
      <circle cx="16" cy="18" r="4.5" fill="#2563EB" />
      <line x1="25" y1="9" x2="31" y2="4" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32.5" cy="3" r="4" fill="#F59E0B" />
      <text x="44" y="23" fontFamily="Arial, sans-serif" fontSize="19" fontWeight="700" fill="#1E293B" letterSpacing="-0.5">
        alert<tspan fill="#2563EB">emploi</tspan>
      </text>
      <text x="45" y="33" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="400" fill="#94A3B8" letterSpacing="1.2">
        TROUVEZ EN PREMIER
      </text>
    </svg>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setIsSubmitting(false);
      return;
    }

    router.push('/jobs/list/new');
  }

  return (
    <main style={{
      minHeight: '100vh', background: '#F1EFE8',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Arial, Helvetica, sans-serif', padding: '24px 16px',
    }}>
      <div style={{ marginBottom: 36 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo />
        </Link>
      </div>

      <div style={{
        background: 'white', borderRadius: 14,
        border: '0.5px solid #E2E8F0', padding: '36px 40px',
        width: '100%', maxWidth: 400,
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1E293B', marginBottom: 6, letterSpacing: -0.5 }}>
          Nouveau mot de passe
        </h1>
        <p style={{ fontSize: 14, color: '#64748B', marginBottom: 28 }}>
          Choisissez un mot de passe d'au moins 8 caractères.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '11px 14px',
                border: '1px solid #E2E8F0', borderRadius: 8,
                fontSize: 14, color: '#1E293B', background: '#F8FAFC',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '11px 14px',
                border: '1px solid #E2E8F0', borderRadius: 8,
                fontSize: 14, color: '#1E293B', background: '#F8FAFC',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA',
              borderRadius: 8, padding: '10px 14px',
              fontSize: 13, color: '#DC2626', marginBottom: 18,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%', padding: '12px 0',
              background: isSubmitting ? '#93C5FD' : '#2563EB',
              color: 'white', fontSize: 15, fontWeight: 600,
              border: 'none', borderRadius: 9,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer le mot de passe'}
          </button>
        </form>
      </div>
    </main>
  );
}

