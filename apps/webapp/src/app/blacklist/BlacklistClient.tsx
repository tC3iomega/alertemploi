'use client';

import { useState } from 'react';
import Link from 'next/link';
import { updateCompanyBlacklist } from '../actions';

export function BlacklistClient({ initialCompanies, isPro }: { initialCompanies: string[]; isPro: boolean }) {
  const [companies, setCompanies] = useState(initialCompanies);
  const [input, setInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(next: string[]) {
    setSaving(true);
    setError(null);
    const result = await updateCompanyBlacklist(next);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return false;
    }
    setCompanies(result.companies ?? next);
    return true;
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const name = input.trim();
    if (!name) return;
    if (companies.some((c) => c.toLowerCase() === name.toLowerCase())) {
      setInput('');
      return;
    }
    if (await save([...companies, name])) setInput('');
  }

  return (
    <div style={{ padding: '20px 16px 96px', maxWidth: 560, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ae-text)', margin: '16px 0 6px' }}>
        Blacklist d&apos;entreprises
      </h1>
      <p style={{ fontSize: 14, color: 'var(--ae-text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
        Les offres de ces entreprises sont automatiquement écartées de vos nouvelles offres. Le nom doit
        correspondre exactement à celui affiché sur l&apos;offre (majuscules ignorées).
      </p>

      {!isPro && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--ae-amber-bg)', border: '1px solid var(--ae-amber-border)',
          borderRadius: 10, padding: '12px 16px', marginBottom: 20,
        }}>
          <span style={{ fontSize: 13, color: 'var(--ae-amber-text-strong)', flex: 1 }}>
            La blacklist d&apos;entreprises est réservée au plan <strong>Pro</strong>.
          </span>
          <Link href="/upgrade" style={{
            fontSize: 12, fontWeight: 600, color: 'var(--ae-primary)', textDecoration: 'none', whiteSpace: 'nowrap',
          }}>
            Passer à Pro
          </Link>
        </div>
      )}

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nom de l'entreprise"
          disabled={!isPro || saving}
          maxLength={120}
          style={{
            flex: 1, minWidth: 0, fontSize: 14, padding: '10px 12px',
            border: '1px solid var(--ae-border)', borderRadius: 9, background: 'var(--ae-surface)', color: 'var(--ae-text)',
          }}
        />
        <button
          type="submit"
          disabled={!isPro || saving || !input.trim()}
          style={{
            fontSize: 13, fontWeight: 600, color: 'white', background: 'var(--ae-primary-bg)',
            border: 'none', borderRadius: 9, padding: '0 16px',
            cursor: !isPro || saving || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: !isPro || saving || !input.trim() ? 0.5 : 1,
          }}
        >
          Ajouter
        </button>
      </form>

      {error && (
        <div style={{
          fontSize: 13, color: 'var(--ae-red-text)', background: 'var(--ae-red-bg)', border: '1px solid var(--ae-red-border)',
          borderRadius: 9, padding: '10px 14px', marginBottom: 16,
        }}>
          {error}
        </div>
      )}

      {companies.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--ae-text-subtle)', textAlign: 'center', padding: '24px 0' }}>
          Aucune entreprise dans votre blacklist.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {companies.map((company) => (
            <div key={company} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              background: 'var(--ae-surface)', border: '0.5px solid var(--ae-border)', borderRadius: 10, padding: '10px 14px',
            }}>
              <span style={{ fontSize: 14, color: 'var(--ae-text)', overflowWrap: 'anywhere' }}>{company}</span>
              <button
                onClick={() => save(companies.filter((c) => c !== company))}
                disabled={saving}
                aria-label={`Retirer ${company}`}
                style={{
                  fontSize: 12, color: 'var(--ae-red)', background: 'none', border: 'none',
                  cursor: saving ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
                }}
              >
                Retirer
              </button>
            </div>
          ))}
        </div>
      )}

      <Link href="/jobs/list/excluded_by_advanced_matching" style={{
        display: 'block', textAlign: 'center', fontSize: 13, color: 'var(--ae-primary)',
        textDecoration: 'none', marginTop: 24,
      }}>
        Voir les offres exclues →
      </Link>
    </div>
  );
}
