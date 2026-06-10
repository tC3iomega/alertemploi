'use client';

import { createCheckoutSession } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function UpgradePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
          ←
        </button>
        <h1 className="text-lg font-semibold">Passer à Pro</h1>
      </div>

      <div className="flex flex-col gap-6 p-4 max-w-lg mx-auto w-full mt-4">
        {/* Hero */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Trouvez votre emploi plus vite</h2>
          <p className="text-muted-foreground text-sm">
            Essai gratuit 14 jours — annulez à tout moment
          </p>
        </div>
{/* Plan Free */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-base">Gratuit</h3>
              <p className="text-2xl font-bold mt-1">0€</p>
            </div>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">Actuel</span>
          </div>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li>✓ 3 alertes maximum</li>
            <li>✓ France Travail, WTTJ</li>
            <li>✓ Scan toutes les heures</li>
            <li className="text-muted-foreground/50">✗ Cadremploi, HelloWork, APEC</li>
            <li className="text-muted-foreground/50">✗ Filtrage IA avancé</li>
          </ul>
        </div>

        {/* Plan Pro */}
        <div className="rounded-xl border-2 border-primary bg-card p-5 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
              Recommandé
            </span>
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-base">Pro</h3>
              <p className="text-2xl font-bold mt-1">9,99€<span className="text-sm font-normal text-muted-foreground">/mois</span></p>
              <p className="text-xs text-green-500 mt-1">ou 79€/an — économisez 41%</p>
            </div>
          </div>
          <ul className="flex flex-col gap-2 text-sm mb-5">
            <li>✓ Alertes illimitées</li>
            <li>✓ Tous les sites (France Travail, WTTJ, Cadremploi, HelloWork, APEC)</li>
            <li>✓ Scan toutes les 30 minutes</li>
            <li>✓ Filtrage IA avancé</li>
            <li>✓ Alertes email</li>
          </ul>
{/* Boutons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleCheckout(monthlyPriceId)}
              disabled={!!loading}
              className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-medium text-sm text-center hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading === monthlyPriceId ? 'Chargement...' : "Commencer l'essai gratuit — 9,99€/mois"}
            </button>
            <button
              onClick={() => handleCheckout(yearlyPriceId)}
              disabled={!!loading}
              className="w-full rounded-lg border border-primary text-primary py-3 font-medium text-sm text-center hover:bg-primary/5 transition-colors disabled:opacity-50"
            >
              {loading === yearlyPriceId ? 'Chargement...' : 'Abonnement annuel — 79€/an'}
            </button>
          </div>
        </div>

        {/* Garantie */}
        <p className="text-center text-xs text-muted-foreground">
          🔒 Paiement sécurisé par Stripe · Annulation à tout moment · Pas de frais cachés
        </p>
      </div>
    </div>
  );
}
