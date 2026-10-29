'use client';

import { createLink, listSites } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Site = { id: number; name: string; provider: string; urls: string[]; deprecated?: boolean };

export default function NewLinkPage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedSite, setDetectedSite] = useState<Site | null>(null);

  useEffect(() => {
    // custom = parsing IA non proposé ; deprecated = aucun contenu n'est récupéré pour ce
    // site (Glassdoor), un lien créé dessus ne remonterait jamais d'offre.
    listSites().then((s) =>
      setSites((s as Site[]).filter((site) => site.provider !== 'custom' && !site.deprecated)),
    );
  }, []);

  useEffect(() => {
    if (!url || sites.length === 0) {
      setDetectedSite(null);
      return;
    }
    try {
      const parsed = new URL(url);
      const found = sites.find((s) =>
        s.urls?.some((siteUrl) => {
          try {
            return parsed.hostname.includes(new URL(siteUrl).hostname);
          } catch {
            return false;
          }
        }),
      );
      setDetectedSite(found ?? null);
    } catch {
      setDetectedSite(null);
    }
  }, [url, sites]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set('url', url.trim());
    formData.set('title', title.trim() || (detectedSite ? `${detectedSite.name} — ${url}` : url));

    const result = await createLink(formData);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push('/jobs/list/new');
    }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100vh',
      background: 'var(--ae-bg)', color: 'var(--ae-text)',
      fontFamily: 'Arial, Helvetica, sans-serif', alignItems: 'center',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 16px', borderBottom: '0.5px solid var(--ae-border)',
        maxWidth: 512, width: '100%',
      }}>
        <h1 style={{ fontSize: 17, fontWeight: 600, margin: 0, color: 'var(--ae-text)' }}>
          Nouvelle alerte emploi
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{
        display: 'flex', flexDirection: 'column', gap: 24,
        padding: 16, flex: 1, maxWidth: 512, width: '100%',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ae-text)' }}>
            URL de recherche
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.welcometothejungle.com/fr/jobs?query=..."
            required
            style={{
              width: '100%', borderRadius: 9, border: '1px solid var(--ae-border)',
              background: 'var(--ae-surface)', color: 'var(--ae-text)',
              padding: '11px 14px', fontSize: 13,
              outline: 'none', boxSizing: 'border-box',
            }}
          />
          {detectedSite && (
            <p style={{ fontSize: 12, color: 'var(--ae-green)', margin: 0 }}>
              ✓ Site détecté : <strong>{detectedSite.name}</strong>
            </p>
          )}
          {url && !detectedSite && (
            <p style={{ fontSize: 12, color: 'var(--ae-text-muted)', margin: 0 }}>
              Site non reconnu — seuls les sites listés ci-dessous sont pris en charge.
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ae-text)' }}>
            Nom de l&apos;alerte{' '}
            <span style={{ color: 'var(--ae-text-muted)', fontWeight: 400 }}>(optionnel)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={detectedSite ? `${detectedSite.name} — ma recherche` : 'Ex: Développeur Paris CDI'}
            style={{
              width: '100%', borderRadius: 9, border: '1px solid var(--ae-border)',
              background: 'var(--ae-surface)', color: 'var(--ae-text)',
              padding: '11px 14px', fontSize: 13,
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ae-text)', margin: 0 }}>
            Sites supportés
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {sites.map((s) => (
              <span key={s.id} style={{
                borderRadius: 20, background: 'var(--ae-blue-bg)',
                border: '0.5px solid var(--ae-border)', padding: '3px 10px',
                fontSize: 11, color: 'var(--ae-primary-strong)', fontWeight: 500,
              }}>
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {error && (
          <div style={{
            borderRadius: 9, background: 'var(--ae-red-bg)',
            border: '1px solid var(--ae-red-border)',
            padding: '11px 14px', fontSize: 13, color: 'var(--ae-red)',
          }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: 8 }}>
          <button
            type="submit"
            disabled={loading || !url}
            style={{
              width: '100%', borderRadius: 9,
              background: (loading || !url) ? 'var(--ae-surface-3)' : 'var(--ae-primary-bg)',
              color: (loading || !url) ? 'var(--ae-text-muted)' : 'white',
              padding: '11px 0', fontWeight: 600, fontSize: 14,
              border: 'none', cursor: (loading || !url) ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Création en cours…' : "Créer l'alerte"}
          </button>
        </div>
      </form>
    </div>
  );
}
