import { listLinks, listSites, deleteLink } from '@/app/actions';
export const dynamic = 'force-dynamic';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { SmallNavbar } from '../components/smallNavbar';
import { AppHeader } from '../components/appHeader';

export default async function LinksPage() {
  const [links, sites] = await Promise.all([listLinks(), listSites()]);

  const siteMap = Object.fromEntries(sites.map((s: any) => [s.id, s]));

  async function handleDelete(formData: FormData) {
    'use server';
    const linkId = Number(formData.get('linkId'));
    await deleteLink(linkId);
    revalidatePath('/links');
  }

  return (
    <>
    <div style={{ minHeight: '100vh', background: 'var(--ae-bg)', fontFamily: 'Arial, Helvetica, sans-serif', paddingBottom: 80 }}>



      <div style={{ padding: '20px 16px' }}>
        <h1 className="m-4 text-2xl">Mes alertes</h1>
        {links.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔔</div>
            <p style={{ fontSize: 15, color: 'var(--ae-text-muted)', marginBottom: 24 }}>
              Vous n'avez pas encore d'alertes configurées.
            </p>
            <Link href="/links/new" style={{
              background: 'var(--ae-primary-bg)', color: 'white',
              fontSize: 14, fontWeight: 500, padding: '11px 24px',
              borderRadius: 9, textDecoration: 'none',
            }}>
              Créer une alerte
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {links.map((link: any) => (
              <div key={link.id} style={{
                background: 'var(--ae-surface)', borderRadius: 12,
                border: '0.5px solid var(--ae-border)', padding: '16px 18px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ae-text)', marginBottom: 4 }}>
                    {link.title || link.url}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {siteMap[link.site_id] && (
                      <span style={{
                        background: 'var(--ae-blue-bg)', color: 'var(--ae-primary-strong)',
                        fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 10,
                      }}>
                        {siteMap[link.site_id].name}
                      </span>
                    )}
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 12, color: 'var(--ae-text-subtle)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}
                    >
                      {link.url}
                    </a>
                  </div>
                  {link.scrape_failure_count > 0 && (
                    <div style={{ fontSize: 11, color: 'var(--ae-red)', marginTop: 4 }}>
                      ⚠️ {link.scrape_failure_count} erreur(s) de scan
                    </div>
                  )}
                </div>
                <form action={handleDelete}>
                  <input type="hidden" name="linkId" value={link.id} />
                  <button
                    type="submit"
                    style={{
                      background: 'var(--ae-red-bg)', border: '1px solid var(--ae-red-border)',
                      color: 'var(--ae-red)', fontSize: 12, fontWeight: 500,
                      padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    Supprimer
                  </button>
                </form>
              </div>
            ))}

            <Link href="/links/new" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'var(--ae-surface)', border: '1px dashed var(--ae-border-strong)',
              borderRadius: 12, padding: '14px 18px',
              fontSize: 14, fontWeight: 500, color: 'var(--ae-primary)',
              textDecoration: 'none', marginTop: 4,
            }}>
              + Ajouter une alerte
            </Link>
          </div>
        )}
      </div>
    </div>
    <SmallNavbar />
    </>
  );
}

