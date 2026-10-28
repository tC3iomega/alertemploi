import Link from 'next/link';

/**
 * Gabarit sobre partagé par les pages de contenu : même palette que le reste du site,
 * sans dépendre des composants applicatifs (qui supposent une session).
 */
export function PageShell({
  breadcrumb,
  title,
  intro,
  jsonLd,
  children,
}: {
  breadcrumb: { label: string; href?: string }[];
  title: string;
  intro: string;
  jsonLd?: object;
  children: React.ReactNode;
}) {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--ae-bg)',
        color: 'var(--ae-text)',
        fontFamily: 'Arial, Helvetica, sans-serif',
        padding: '40px 20px 72px',
      }}
    >
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <nav aria-label="Fil d'ariane" style={{ fontSize: 13, color: 'var(--ae-text-muted)', marginBottom: 20 }}>
          {breadcrumb.map((item, i) => (
            <span key={item.label}>
              {i > 0 && <span style={{ margin: '0 6px' }}>›</span>}
              {item.href ? (
                <Link href={item.href} style={{ color: 'var(--ae-primary)', textDecoration: 'none' }}>
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </span>
          ))}
        </nav>

        <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.6, lineHeight: 1.2, marginBottom: 14 }}>
          {title}
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ae-text-body)', marginBottom: 32 }}>{intro}</p>

        {children}

        <div
          style={{
            background: 'var(--ae-blue-bg-soft)',
            border: '1px solid var(--ae-blue-border)',
            borderRadius: 12,
            padding: 24,
            marginTop: 40,
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 15, color: 'var(--ae-text-body)', marginBottom: 16 }}>
            Essai gratuit de 7 jours, sans carte bancaire.
          </p>
          <Link
            href="/auth/register"
            style={{
              display: 'inline-block',
              background: 'var(--ae-primary-bg)',
              color: 'white',
              fontSize: 15,
              fontWeight: 600,
              padding: '12px 28px',
              borderRadius: 9,
              textDecoration: 'none',
            }}
          >
            Créer ma première alerte
          </Link>
        </div>
      </div>
    </main>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 34 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>{title}</h2>
      <div style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--ae-text-body)' }}>{children}</div>
    </section>
  );
}
