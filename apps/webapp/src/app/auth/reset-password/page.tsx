'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function Logo() {
  return (
    <svg width="160" height="36" viewBox="0 0 160 36" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="18" r="13" fill="none" stroke="var(--ae-primary)" strokeWidth="2.5" />
      <circle cx="16" cy="18" r="4.5" fill="var(--ae-primary)" />
      <line x1="25" y1="9" x2="31" y2="4" stroke="var(--ae-primary)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32.5" cy="3" r="4" fill="var(--ae-accent)" />
      <text x="44" y="23" fontFamily="Arial, sans-serif" fontSize="19" fontWeight="700" fill="var(--ae-text)" letterSpacing="-0.5">
        alert<tspan fill="var(--ae-primary)">emploi</tspan>
      </text>
      <text x="45" y="33" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="400" fill="var(--ae-text-subtle)" letterSpacing="1.2">
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
      minHeight: '100vh', background: 'var(--ae-bg)',
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
        background: 'var(--ae-surface)', borderRadius: 14,
        border: '0.5px solid var(--ae-border)', padding: '36px 40px',
        width: '100%', maxWidth: 400,
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ae-text)', marginBottom: 6, letterSpacing: -0.5 }}>
          Nouveau mot de passe
        </h1>
        <p style={{ fontSize: 14, color: 'var(--ae-text-muted)', marginBottom: 28 }}>
          Choisissez un mot de passe d'au moins 8 caractères.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ae-text-body)', display: 'block', marginBottom: 6 }}>
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
                border: '1px solid var(--ae-border)', borderRadius: 8,
                fontSize: 14, color: 'var(--ae-text)', background: 'var(--ae-surface-2)',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ae-text-body)', display: 'block', marginBottom: 6 }}>
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
                border: '1px solid var(--ae-border)', borderRadius: 8,
                fontSize: 14, color: 'var(--ae-text)', background: 'var(--ae-surface-2)',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{
              background: 'var(--ae-red-bg)', border: '1px solid var(--ae-red-border)',
              borderRadius: 8, padding: '10px 14px',
              fontSize: 13, color: 'var(--ae-red)', marginBottom: 18,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%', padding: '12px 0',
              background: isSubmitting ? 'var(--ae-blue-border-strong)' : 'var(--ae-primary-bg)',
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

