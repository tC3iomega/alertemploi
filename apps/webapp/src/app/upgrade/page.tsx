'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createCheckoutSession } from '@/app/actions';

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

const FREE_FEATURES = [
  { label: '2 alertes maximum', included: true },
  { label: 'France Travail, WTTJ', included: true },
  { label: 'Scan toutes les heures', included: true },
  { label: 'Cadremploi, HelloWork, APEC', included: false },
  { label: 'Alertes email', included: false },
];

const PRO_FEATURES = [
  { label: 'Alertes illimitées', included: true },
  { label: 'Tous les job boards', included: true },
  { label: 'Scan toutes les heures', included: true },
  { label: 'Alertes email', included: true },
  { label: 'Essai 14 jours gratuit', included: true },
];

export default function UpgradePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);

  const monthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!;
  const yearlyPriceId = process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!;

  async function handleCheckout(priceId: string) {
    setLoading(priceId);
    const formData = new FormData();
    formData.set('priceId', priceId);
    const { url } = await createCheckoutSession(formData);
    window.location.href = url;
    setLoading(null);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F1EFE8', fontFamily: 'Arial, Helvetica, sans-serif' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 48px', borderBottom: '0.5px solid #E2E8F0',
        background: '#F1EFE8',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo />
        </Link>
        <button
          onClick={() => router.back()}
          style={{
            fontSize: 13, color: '#64748B', background: 'none',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          ← Retour
        </button>
      </nav>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '56px 24px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{
            display: 'inline-block', background: '#FFFBEB', color: '#B45309',
            fontSize: 12, fontWeight: 500, padding: '5px 16px', borderRadius: 20,
            border: '1px solid #FCD34D', marginBottom: 20,
          }}>
            Essai gratuit 14 jours
          </div>
          <h1 style={{
            fontSize: 34, fontWeight: 700, color: '#1E293B',
            letterSpacing: -0.8, marginBottom: 12,
          }}>
            Trouvez votre emploi plus vite
          </h1>
          <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.6 }}>
            Annulez à tout moment, sans engagement.
          </p>
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 32 }}>
          <span style={{ fontSize: 14, fontWeight: isAnnual ? 400 : 500, color: isAnnual ? '#64748B' : '#1E293B' }}>
            Mensuel
          </span>
          <div
            onClick={() => setIsAnnual(!isAnnual)}
            style={{
              width: 48, height: 26, background: '#2563EB',
              borderRadius: 13, position: 'relative', cursor: 'pointer', flexShrink: 0,
            }}
          >
            <div style={{
              width: 20, height: 20, background: 'white', borderRadius: '50%',
              position: 'absolute', top: 3,
              left: isAnnual ? 25 : 3, transition: 'left 0.2s',
            }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: isAnnual ? 500 : 400, color: isAnnual ? '#1E293B' : '#64748B' }}>
            Annuel
          </span>
          <span style={{
            background: '#DCFCE7', color: '#166534',
            fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 10,
          }}>-34%</span>
        </div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

          {/* Free */}
          <div style={{
            background: 'white', border: '0.5px solid #E2E8F0',
            borderRadius: 14, padding: 28,
          }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#64748B' }}>Gratuit</span>
                <span style={{
                  background: '#F1F5F9', color: '#64748B',
                  fontSize: 10, fontWeight: 500, padding: '3px 9px', borderRadius: 10,
                }}>Actuel</span>
              </div>
              <div style={{ fontSize: 34, fontWeight: 700, color: '#1E293B' }}>
                0€ <span style={{ fontSize: 14, fontWeight: 400, color: '#64748B' }}>/&nbsp;mois</span>
              </div>
            </div>
            {FREE_FEATURES.map((f) => (
              <div key={f.label} style={{
                fontSize: 13, color: f.included ? '#374151' : '#CBD5E1',
                padding: '6px 0', borderBottom: '0.5px solid #F1F5F9',
                display: 'flex', gap: 8, alignItems: 'center',
              }}>
                <span style={{ color: f.included ? '#2563EB' : '#CBD5E1', fontWeight: 700 }}>
                  {f.included ? '✓' : '✗'}
                </span>
                {f.label}
              </div>
            ))}
            <div style={{
              display: 'block', textAlign: 'center', marginTop: 22,
              padding: '11px 0', borderRadius: 9, fontSize: 13, fontWeight: 500,
              border: '1px solid #E2E8F0', color: '#94A3B8',
            }}>Plan actuel</div>
          </div>

          {/* Pro */}
          <div style={{
            background: 'white', border: '2px solid #2563EB',
            borderRadius: 14, padding: 28, position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
              background: '#2563EB', color: 'white',
              fontSize: 11, fontWeight: 600, padding: '4px 14px', borderRadius: 20,
              whiteSpace: 'nowrap',
            }}>Recommandé</div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#64748B', marginBottom: 10 }}>Pro</div>
              <div style={{ fontSize: 34, fontWeight: 700, color: '#1E293B' }}>
                {isAnnual ? '79€' : '9,99€'}{' '}
                <span style={{ fontSize: 14, fontWeight: 400, color: '#64748B' }}>
                  /{isAnnual ? ' an' : ' mois'}
                </span>
              </div>
              {isAnnual && (
                <div style={{ fontSize: 12, color: '#16A34A', marginTop: 4 }}>
                  Soit 6,58€/mois — 2 mois offerts
                </div>
              )}
            </div>
            {PRO_FEATURES.map((f) => (
              <div key={f.label} style={{
                fontSize: 13, color: '#374151',
                padding: '6px 0', borderBottom: '0.5px solid #F1F5F9',
                display: 'flex', gap: 8, alignItems: 'center',
              }}>
                <span style={{ color: '#2563EB', fontWeight: 700 }}>✓</span>
                {f.label}
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
              <button
                onClick={() => handleCheckout(isAnnual ? yearlyPriceId : monthlyPriceId)}
                disabled={!!loading}
                style={{
                  width: '100%', padding: '12px 0',
                  background: loading ? '#93C5FD' : '#2563EB',
                  color: 'white', fontSize: 14, fontWeight: 600,
                  border: 'none', borderRadius: 9,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading
                  ? 'Chargement...'
                  : isAnnual
                  ? "Démarrer l'essai — 79€/an"
                  : "Démarrer l'essai — 9,99€/mois"}
              </button>
            </div>
          </div>
        </div>

        {/* Garantie */}
        <p style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8' }}>
          🔒 Paiement sécurisé par Stripe · Annulation à tout moment · Pas de frais cachés
        </p>

      </div>
    </div>
  );
}

