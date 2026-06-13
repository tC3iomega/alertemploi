import { listLinks, listSites, deleteLink } from '@/app/actions';
export const dynamic = 'force-dynamic';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

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
    <div style={{ minHeight: '100vh', background: '#F1EFE8', fontFamily: 'Arial, Helvetica, sans-serif', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 20px', borderBottom: '0.5px solid #E2E8F0',
        background: '#F1EFE8', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Link href="/jobs/list/new" style={{ color: '#64748B', textDecoration: 'none', fontSize: 18 }}>←</Link>
        <h1 style={{ fontSize: 17, fontWeight: 600, color: '#1E293B', margin: 0 }}>Mes alertes</h1>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {links.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔔</div>
            <p style={{ fontSize: 15, color: '#64748B', marginBottom: 24 }}>
              Vous n'avez pas encore d'alertes configurées.
            </p>
            <Link href="/links/new" style={{
              background: '#2563EB', color: 'white',
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
                background: 'white', borderRadius: 12,
                border: '0.5px solid #E2E8F0', padding: '16px 18px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1E293B', marginBottom: 4 }}>
                    {link.title || link.url}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {siteMap[link.site_id] && (
                      <span style={{
                        background: '#DBEAFE', color: '#1E40AF',
                        fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 10,
                      }}>
                        {siteMap[link.site_id].name}
                      </span>
                    )}
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 12, color: '#94A3B8', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}
                    >
                      {link.url}
                    </a>
                  </div>
                  {link.scrape_failure_count > 0 && (
                    <div style={{ fontSize: 11, color: '#DC2626', marginTop: 4 }}>
                      ⚠️ {link.scrape_failure_count} erreur(s) de scan
                    </div>
                  )}
                </div>
                <form action={handleDelete}>
                  <input type="hidden" name="linkId" value={link.id} />
                  <button
                    type="submit"
                    style={{
                      background: '#FEF2F2', border: '1px solid #FECACA',
                      color: '#DC2626', fontSize: 12, fontWeight: 500,
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
              background: 'white', border: '1px dashed #CBD5E1',
              borderRadius: 12, padding: '14px 18px',
              fontSize: 14, fontWeight: 500, color: '#2563EB',
              textDecoration: 'none', marginTop: 4,
            }}>
              + Ajouter une alerte
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

