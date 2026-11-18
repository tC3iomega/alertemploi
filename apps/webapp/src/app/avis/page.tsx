import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ReviewForm } from './ReviewForm';

export const metadata = {
  title: 'Avis clients — Alertemploi',
  description: 'Ce que disent les candidats qui utilisent Alertemploi pour trouver un emploi avant les autres.',
};

type Review = {
  id: number;
  name: string;
  rating: number;
  body: string;
  job_title: string | null;
  created_at: string;
};

function Stars({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} étoiles sur 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= rating ? '#F59E0B' : '#D1D5DB', fontSize: 15 }}>★</span>
      ))}
    </span>
  );
}

export default async function AvisPage() {
  const supabase = await createClient();
  const { data: reviews } = await (supabase as any)
    .from('reviews')
    .select('id, name, rating, body, job_title, created_at')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(50);

  const list: Review[] = reviews ?? [];

  const avgRating = list.length > 0
    ? (list.reduce((sum, r) => sum + r.rating, 0) / list.length).toFixed(1)
    : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ae-bg)', fontFamily: 'inherit' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px', borderBottom: '0.5px solid var(--ae-border)',
        background: 'var(--ae-bg)',
      }}>
        <Link href="/" style={{ textDecoration: 'none', fontSize: 17, fontWeight: 700, color: 'var(--ae-text)' }}>
          alert<span style={{ color: '#2563EB' }}>emploi</span>
        </Link>
        <Link href="/dashboard" style={{ fontSize: 13, color: 'var(--ae-text-muted)', textDecoration: 'none' }}>
          Tableau de bord →
        </Link>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: 'var(--ae-text)', letterSpacing: -0.5, marginBottom: 10 }}>
            Ce que disent nos utilisateurs
          </h1>
          {avgRating && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--ae-text)' }}>{avgRating}</span>
              <Stars rating={Math.round(Number(avgRating))} />
              <span style={{ fontSize: 14, color: 'var(--ae-text-muted)' }}>({list.length} avis)</span>
            </div>
          )}
          {!avgRating && (
            <p style={{ fontSize: 15, color: 'var(--ae-text-muted)' }}>
              Soyez le premier à laisser un avis.
            </p>
          )}
        </div>

        {/* Reviews grid */}
        {list.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 18,
            marginBottom: 56,
          }}>
            {list.map((review) => (
              <div key={review.id} style={{
                background: 'var(--ae-surface)', border: '0.5px solid var(--ae-border)',
                borderRadius: 14, padding: '22px 20px',
              }}>
                <div style={{ marginBottom: 10 }}>
                  <Stars rating={review.rating} />
                </div>
                <p style={{ fontSize: 14, color: 'var(--ae-text)', lineHeight: 1.65, margin: '0 0 16px' }}>
                  &ldquo;{review.body}&rdquo;
                </p>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ae-text)' }}>{review.name}</span>
                  {review.job_title && (
                    <span style={{ fontSize: 12, color: 'var(--ae-text-muted)', marginLeft: 6 }}>
                      · {review.job_title}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form */}
        <div id="formulaire" style={{
          background: 'var(--ae-surface)', border: '1px solid var(--ae-border)',
          borderRadius: 16, padding: '32px 28px',
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ae-text)', margin: '0 0 6px' }}>
            Laisser un avis
          </h2>
          <p style={{ fontSize: 14, color: 'var(--ae-text-muted)', margin: '0 0 24px', lineHeight: 1.6 }}>
            Votre retour aide les autres candidats — et nous aide à améliorer le service.
          </p>
          <ReviewForm />
        </div>

      </div>
    </div>
  );
}
