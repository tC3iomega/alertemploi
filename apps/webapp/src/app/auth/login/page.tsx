'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '../../actions';
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

function EyeIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z" fill="#34A853"/>
      <path d="M3.97 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.17.29-1.71V4.96H.96A8.99 8.99 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3.01-2.33z" fill="#FBBC05"/>
      <path d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData();
    formData.set('email', email);
    formData.set('password', password);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }
    router.refresh();
  }

  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
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
          Connexion
        </h1>
        <p style={{ fontSize: 14, color: '#64748B', marginBottom: 24 }}>
          Bon retour parmi nous.
        </p>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 10,
            padding: '11px 0', marginBottom: 20,
            background: 'white', border: '1px solid #E2E8F0',
            borderRadius: 9, fontSize: 14, fontWeight: 500,
            color: '#374151', cursor: isGoogleLoading ? 'not-allowed' : 'pointer',
            opacity: isGoogleLoading ? 0.6 : 1,
          }}
        >
          <GoogleIcon />
          {isGoogleLoading ? 'Redirection...' : 'Continuer avec Google'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
          <span style={{ fontSize: 12, color: '#94A3B8' }}>ou</span>
          <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
                Mot de passe
              </label>
              <Link href="/auth/forgot-password" style={{ fontSize: 12, color: '#2563EB', textDecoration: 'none' }}>
                Mot de passe oublie ?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '11px 40px 11px 14px',
                  border: '1px solid #E2E8F0', borderRadius: 8,
                  fontSize: 14, color: '#1E293B', background: '#F8FAFC',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: 0, display: 'flex', alignItems: 'center',
                }}
              >
                <EyeIcon visible={showPassword} />
              </button>
            </div>
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
              border: 'none', borderRadius: 9, cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>

      <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 24, textAlign: 'center' }}>
        Pas encore de compte ?{' '}
        <Link href="/auth/register" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>
          Créer un compte gratuit
        </Link>
      </p>
    </main>
  );
}

