'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createCheckoutSession } from '@/app/actions';

function Logo() {
  return (
    <svg width="160" height="36" viewBox="0 0 160 36" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="18" r="13" fill="none" stroke="var(--ae-primary)" strokeWidth="2.5" />
      <circle cx="16" cy="18" r="4.5" fill="var(--ae-primary)" />
      <line x1="25" y1="9" x2="31" y2="4" stroke="var(--ae-primary)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32.5" cy="3" r="4" fill="var(--ae-accent)" />
      <text x="44" y="23" fontFamily="Arial, sans-serif" fontSize="19" fontWeight="700" fill="var(--ae-text)" letterSpacing="-0.5">
        alert<tspan fill="var(--ae-primary)">emploi</tspan>
      </text>
      <text x="45" y="33" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="400" fill="var(--ae-text-subtle)" letterSpacing="1.2">
        TROUVEZ EN PREMIER
      </text>
    </svg>
  );
}

const BASIC_FEATURES = [
  { label: 'Alertes illimitées', included: true },
  { label: 'Tous les job boards', included: true },
  { label: 'Scan toutes les 30 minutes', included: true },
  { label: 'Alertes email', included: true },
  { label: 'Essai 7 jours gratuit', included: true },
];

const PRO_FEATURES = [
  { label: 'Tout Basic, plus :', included: true },
  { label: 'Blacklist d\u2019entreprises', included: true },
  { label: 'Support prioritaire', included: true },
  { label: 'Essai 7 jours gratuit', included: true },
];

export default function UpgradePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);

  const basicMonthlyPriceId = 'price_1UGQGDV05CSUPvQveeN8BJSg';
  const basicYearlyPriceId = 'price_1UGQGDV05CSUPvQvf3cJ4zwO';
  const proMonthlyPriceId = 'price_1UGQGDV05CSUPvQv1UbCvLXH';
  const proYearlyPriceId = 'price_1UGQGEV05CSUPvQvXOombR5L';

  async function handleCheckout(priceId: string) {
    setLoading(priceId);
    const formData = new FormData();
    formData.set('priceId', priceId);
    const { url } = await createCheckoutSession(formData);
    window.location.href = url;
    setLoading(null);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ae-bg)', fontFamily: 'Arial, Helvetica, sans-serif' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 48px', borderBottom: '0.5px solid var(--ae-border)',
        background: 'var(--ae-bg)',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo />
        </Link>
        <button
          onClick={() => router.back()}
          style={{
            fontSize: 13, color: 'var(--ae-text-muted)', background: 'none',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          ← Retour
        </button>
      </nav>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '56px 24px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{
            display: 'inline-block', background: 'var(--ae-amber-bg)', color: 'var(--ae-amber-text)',
            fontSize: 12, fontWeight: 500, padding: '5px 16px', borderRadius: 20,
            border: '1px solid var(--ae-amber-border)', marginBottom: 20,
          }}>
            Essai gratuit 7 jours — sans carte bancaire
          </div>
          <h1 style={{
            fontSize: 34, fontWeight: 700, color: 'var(--ae-text)',
            letterSpacing: -0.8, marginBottom: 12,
          }}>
            Trouvez votre emploi plus vite
          </h1>
          <p style={{ fontSize: 15, color: 'var(--ae-text-muted)', lineHeight: 1.6 }}>
            Annulez à tout moment, sans engagement.
          </p>
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 32 }}>
          <span style={{ fontSize: 14, fontWeight: isAnnual ? 400 : 500, color: isAnnual ? 'var(--ae-text-muted)' : 'var(--ae-text)' }}>
            Mensuel
          </span>
          <div
            onClick={() => setIsAnnual(!isAnnual)}
            style={{
              width: 48, height: 26, background: 'var(--ae-primary-bg)',
              borderRadius: 13, position: 'relative', cursor: 'pointer', flexShrink: 0,
            }}
          >
            <div style={{
              width: 20, height: 20, background: 'var(--ae-surface)', borderRadius: '50%',
              position: 'absolute', top: 3,
              left: isAnnual ? 25 : 3, transition: 'left 0.2s',
            }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: isAnnual ? 500 : 400, color: isAnnual ? 'var(--ae-text)' : 'var(--ae-text-muted)' }}>
            Annuel
          </span>
          <span style={{
            background: 'var(--ae-green-bg)', color: 'var(--ae-green-text)',
            fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 10,
          }}>-30%</span>
        </div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18, marginBottom: 28 }}>

          {/* Basic */}
          <div style={{
            background: 'var(--ae-surface)', border: '2px solid var(--ae-primary)',
            borderRadius: 14, padding: 24, position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
              background: 'var(--ae-primary-bg)', color: 'white',
              fontSize: 11, fontWeight: 600, padding: '4px 14px', borderRadius: 20,
              whiteSpace: 'nowrap',
            }}>Recommandé</div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ae-text-muted)', marginBottom: 10 }}>Basic</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--ae-text)' }}>
                {isAnnual ? '41,90€' : '4,99€'}{' '}
                <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--ae-text-muted)' }}>
                  /{isAnnual ? ' an' : ' mois'}
                </span>
              </div>
              {isAnnual && (
                <div style={{ fontSize: 12, color: 'var(--ae-green)', marginTop: 4 }}>
                  Soit 3,49€/mois
                </div>
              )}
            </div>
            {BASIC_FEATURES.map((f) => (
              <div key={f.label} style={{
                fontSize: 12.5, color: 'var(--ae-text-body)',
                padding: '6px 0', borderBottom: '0.5px solid var(--ae-surface-3)',
                display: 'flex', gap: 8, alignItems: 'center',
              }}>
                <span style={{ color: 'var(--ae-primary)', fontWeight: 700 }}>✓</span>
                {f.label}
              </div>
            ))}
            <button
              onClick={() => handleCheckout(isAnnual ? basicYearlyPriceId : basicMonthlyPriceId)}
              disabled={!!loading}
              style={{
                width: '100%', padding: '11px 0', marginTop: 20,
                background: loading ? 'var(--ae-surface-3)' : 'var(--ae-surface)',
                color: 'var(--ae-primary)', fontSize: 13, fontWeight: 600,
                border: '1.5px solid var(--ae-primary)', borderRadius: 9,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading === (isAnnual ? basicYearlyPriceId : basicMonthlyPriceId) ? 'Chargement...' : "Démarrer l'essai"}
            </button>
          </div>

          {/* Pro */}
          <div style={{
            background: 'var(--ae-surface)', border: '0.5px solid var(--ae-border)',
            borderRadius: 14, padding: 24,
          }}>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ae-text-muted)', marginBottom: 10 }}>Pro</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--ae-text)' }}>
                {isAnnual ? '125,90€' : '14,99€'}{' '}
                <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--ae-text-muted)' }}>
                  /{isAnnual ? ' an' : ' mois'}
                </span>
              </div>
              {isAnnual && (
                <div style={{ fontSize: 12, color: 'var(--ae-green)', marginTop: 4 }}>
                  Soit 10,49€/mois
                </div>
              )}
            </div>
            {PRO_FEATURES.map((f) => (
              <div key={f.label} style={{
                fontSize: 12.5, color: 'var(--ae-text-body)',
                padding: '6px 0', borderBottom: '0.5px solid var(--ae-surface-3)',
                display: 'flex', gap: 8, alignItems: 'center',
              }}>
                <span style={{ color: 'var(--ae-primary)', fontWeight: 700 }}>✓</span>
                {f.label}
              </div>
            ))}
            <button
              onClick={() => handleCheckout(isAnnual ? proYearlyPriceId : proMonthlyPriceId)}
              disabled={!!loading}
              style={{
                width: '100%', padding: '11px 0', marginTop: 20,
                background: loading ? 'var(--ae-blue-border-strong)' : 'var(--ae-primary-bg)',
                color: 'white', fontSize: 13, fontWeight: 600,
                border: 'none', borderRadius: 9,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading === (isAnnual ? proYearlyPriceId : proMonthlyPriceId) ? 'Chargement...' : "Démarrer l'essai"}
            </button>
          </div>
        </div>

        {/* Garantie */}
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ae-text-subtle)' }}>
          🔒 Paiement sécurisé par Stripe · Annulation à tout moment · Pas de frais cachés
        </p>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ae-text-subtle)', marginTop: 8 }}>
          TVA non applicable, art. 293 B du CGI.
        </p>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ae-text-subtle)', marginTop: 8 }}>
          En vous abonnant, vous acceptez nos{' '}
          <Link href="/cgv" style={{ color: 'var(--ae-text-muted)' }}>conditions générales de vente</Link>.
        </p>

      </div>
    </div>
  );
}

