'use client';

import { createLink, listSites } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Site = { id: number; name: string; provider: string; urls: string[] };

export default function NewLinkPage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedSite, setDetectedSite] = useState<Site | null>(null);

  useEffect(() => {
    listSites().then((s) => setSites(s as Site[]));
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
    <div className="flex flex-col h-screen bg-background text-foreground">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
          ←
        </button>
        <h1 className="text-lg font-semibold">Nouvelle alerte emploi</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4 flex-1">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">URL de recherche</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.welcometothejungle.com/fr/jobs?query=..."
            required
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {detectedSite && (
            <p className="text-xs text-green-500">
              ✓ Site détecté : <span className="font-medium">{detectedSite.name}</span>
            </p>
          )}
          {url && !detectedSite && (
            <p className="text-xs text-muted-foreground">
              Site non reconnu — l&apos;alerte sera créée en mode personnalisé.
            </p>
          )}
        </div>
<div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Nom de l&apos;alerte <span className="text-muted-foreground">(optionnel)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={detectedSite ? `${detectedSite.name} — ma recherche` : 'Ex: Développeur Paris CDI'}
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Sites supportés</p>
          <div className="flex flex-wrap gap-2">
            {sites.map((s) => (
              <span
                key={s.id}
                className="rounded-full bg-card border border-border px-3 py-1 text-xs text-muted-foreground"
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mt-auto">
          <button
            type="submit"
            disabled={loading || !url}
            className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {loading ? 'Création en cours…' : "Créer l'alerte"}
          </button>
        </div>
      </form>
    </div>
  );
}
