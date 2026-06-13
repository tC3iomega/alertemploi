'use client';

import { useState } from 'react';
import Link from 'next/link';
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
      setIsSubmitting(false);
      return;
    }

    setSent(true);
    setIsSubmitting(false);
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
        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1E293B', marginBottom: 10 }}>
              Email envoyé
            </h1>
            <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, marginBottom: 24 }}>
              Si un compte existe pour <strong>{email}</strong>, vous recevrez un lien pour réinitialiser votre mot de passe.
            </p>
            <Link href="/auth/login" style={{
              fontSize: 14, color: '#2563EB', textDecoration: 'none', fontWeight: 500,
            }}>
              ← Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1E293B', marginBottom: 6, letterSpacing: -0.5 }}>
              Mot de passe oublié
            </h1>
            <p style={{ fontSize: 14, color: '#64748B', marginBottom: 28, lineHeight: 1.6 }}>
              Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
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
                {isSubmitting ? 'Envoi...' : 'Envoyer le lien'}
              </button>
            </form>

            <p style={{ fontSize: 13, color: '#64748B', marginTop: 20, textAlign: 'center' }}>
              <Link href="/auth/login" style={{ color: '#2563EB', textDecoration: 'none' }}>
                ← Retour à la connexion
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}

