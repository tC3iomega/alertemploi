# Alertemploi

**Alertemploi** est un agrégateur d'offres d'emploi français qui surveille vos recherches sur plusieurs job boards et vous prévient par email dès qu'une nouvelle offre est publiée.

> **TROUVEZ EN PREMIER.**

## Fonctionnalités

- Surveillance de 7 job boards : France Travail, APEC, LinkedIn, Indeed, HelloWork, Cadremploi, Welcome to the Jungle
- Scan automatique toutes les 30 minutes
- Alertes email instantanées à chaque nouvelle offre
- Essai gratuit 7 jours, sans carte bancaire
- Liste noire d'entreprises (Pro)

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js (App Router), déployé sur Vercel |
| Backend | Supabase (Edge Functions Deno, PostgreSQL) |
| Scraping JS | Browserless |
| Scraping LinkedIn/Indeed | FastAPI + JobSpy (Fly.io) |
| Email | MailerSend |
| Paiement | Stripe |
| Domaine | alertemploi.com (OVH) |

## Structure du monorepo

```
apps/
  webapp/        # Next.js — interface utilisateur (Vercel)
  backend/       # Supabase — migrations + Edge Functions
  nodeBackend/   # Service Node.js autonome
libraries/
  core/          # Types partagés, SDK, erreurs
  ui/            # Composants React partagés
```

## Démarrage local

```bash
pnpm install

# Webapp uniquement (port 3002)
pnpm nx dev webapp

# Supabase local
cd apps/backend
pnpm start          # supabase start
pnpm dev:local      # supabase functions serve
```

## Déploiement

```bash
# Webapp → push sur master déclenche un déploiement Vercel automatique

# Edge Function individuelle (depuis apps/backend)
supabase functions deploy <nom-de-la-fonction>
```

## Tarifs

| Formule | Mensuel | Annuel |
|---------|---------|--------|
| Basic   | 4,99 €  | 41,90 € |
| Pro     | 14,99 € | 125,90 € |

TVA non applicable, art. 293 B du CGI.

---

Forké depuis [beastx-ro/first2apply](https://github.com/beastx-ro/first2apply), entièrement rebrandé.
