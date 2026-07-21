# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

French job alert SaaS that aggregates listings from multiple job boards and notifies users before other candidates. Value prop: **"TROUVEZ EN PREMIER."**

Forked from `beastx-ro/first2apply`, fully rebranded. Solo founder project.

**Repo:** `tC3iomega/alertemploi` (GitHub auth via PAT in remote URL)

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js monorepo (pnpm), deployed on Vercel (Hobby) |
| Backend | Supabase project "Jobwatch" — Frankfurt, ID: `pvhtnwuzrkmnpxnfvwyv` |
| Scraping worker | Fly.io (`alertemploi-jobspy.fly.dev`) — Python FastAPI + JobSpy |
| JS-heavy scraping | Browserless |
| Domain | alertemploi.com (OVH) |
| Email | MailerSend (3 templates max on free plan) |
| Payments | Stripe |

---

## Monorepo Structure

Nx + pnpm workspaces (`apps/*`, `libraries/*`). Only `apps/webapp`, `apps/backend`, and `apps/nodeBackend` are actively used — `desktopProbe`, `landingPage`, `blog`, `invoiceDownloader` mentioned in README.md are from the upstream `first2apply` fork and are not part of this deployment.

- `apps/webapp` — Next.js 16 (App Router) web app, deployed on Vercel. Depends on `@alertemploi/core` and `@alertemploi/ui` (workspace packages).
- `apps/backend` — Supabase project: migrations + Edge Functions (Deno). No local `src`, everything lives under `supabase/`.
- `apps/nodeBackend` — minimal standalone Node service (`src/index.ts`), separate from Supabase Edge Functions.
- `libraries/core` — shared types/SDK/errors (`src/types.ts`, `src/sdk.ts`, `src/error.ts`), consumed by both webapp and backend. Has a Deno-specific entrypoint (`index.deno.ts`) since Edge Functions run on Deno, not Node.
- `libraries/ui` — shared React components/hooks used by the webapp.

### Supabase Edge Functions (`apps/backend/supabase/functions/`)
- `cron-scan` — runs every 30 min, triggers scraping across job boards
- `scan-urls` — scans a user's saved search links for new jobs; also gates access based on trial/subscription status
- `scan-job-description` — AI-assisted parsing of a single job posting
- `create-link` — creates a new saved search
- `handle-stripe-webhook` — Stripe billing events (see Stripe section below)
- `handle-profile-change-webhook` — reacts to Supabase Auth profile changes
- `send-welcome-email` / `send-trial-reminder` — MailerSend-triggered emails
- `post-scan-hook` — runs after a scan completes
- `_shared/` — code shared across functions (must be self-contained per Edge Functions constraint below): `parsers/` (one file per job board), `jobListParser.ts` (dispatches to the right parser per `JobSite`/`SiteProvider`), `emails/`, `subscription.ts` (trial/plan gating), `openAI.ts`, `mailerLiteApi.ts`

### Web app (`apps/webapp/src/app/`)
App Router structure: `dashboard/` (main authenticated view), `jobs/[jobId]/` (job detail), `links/` (saved searches), `auth/` (login/register/reset via Supabase Auth), `menu/` (mobile slide-in modal, see `components/MenuDrawer.tsx`), `upgrade/` (plan selection / Stripe checkout), `legal/`, `privacy/`.

---

## Common Commands

Run from repo root unless noted. Nx caching is disabled (`cacheableOperations: []` in `nx.json`), so every run re-executes.

```bash
pnpm install                        # install all workspace deps

pnpm dev                            # nx run-many -t dev — starts every app's dev server
pnpm nx dev webapp                  # just the webapp (Next.js, port 3002)

pnpm build                          # nx run-many -t build
pnpm nx build webapp                # single project

pnpm typecheck                      # nx run-many -t typecheck (tsc --noEmit / deno check)
pnpm test                           # nx run-many -t test (Jest, ts-jest preset)
pnpm nx test <project>              # test a single project
pnpm lint                           # nx run-many -t lint
pnpm prettier                       # nx run-many -t prettier (--check)
```

Running a single test file (Jest, e.g. inside `apps/backend`):
```bash
cd apps/backend && npx jest supabase/functions/_shared/jobListParser.test.ts
```

Supabase (from `apps/backend`):
```bash
cd apps/backend
pnpm start                          # supabase start (local stack, dashboard at localhost:54323)
pnpm dev:local                      # supabase functions serve
supabase functions deploy <name>    # deploy a single Edge Function — run from Mac
```

Git hooks (Husky, already wired — do not bypass with `--no-verify`):
- `pre-commit` → `lint-staged` (ESLint + Prettier on staged files; backend files use `apps/backend`'s own ESLint config, see `lint-staged.config.js`)
- `commit-msg` → commitlint (Conventional Commits)
- `pre-push` → `pnpm typecheck`

---

## Key Features (Implemented)

- 5 French job board parsers: France Travail, WTTJ, HelloWork, Cadremploi, APEC
- LinkedIn & Indeed via JobSpy worker (Fly.io)
- Cron auto-scan every 30 minutes
- Google OAuth + email auth (Supabase Auth)
- Email templates: welcome, newJobAlert, trialReminder (J-3 / J-0)

---

## Pricing & Subscription Logic

No free plan. Two plans only:

| Plan | Monthly | Annual |
|------|---------|--------|
| Basic | 4,99€ | 41,90€ |
| Pro | 14,99€ | 125,90€ |

**Stripe Price IDs:**
- Basic monthly: `price_1Tk1X4V059EuUi4mpZaDiqwt`
- Basic annual: `price_1Tk1X4V059EuUi4mwAvqhX6z`
- Pro monthly: `price_1Tk1XSV059EuUi4mcBBeAFBU`
- Pro annual: `price_1Tk1XjV059EuUi4mCPRLTUmV`

**Trial:** 7 days, no credit card required (`payment_method_collection: if_required`)
- New accounts: `plan='basic'`, `trial_ends_at = now() + 7 days`
- `scan-urls` blocks access if trial expired without active subscription
- Dashboard: orange banner (trial active) / red banner (trial expired, CTA "S'abonner")

**Stripe webhook:** plan detection via Price ID (not metadata). Cancellation deferred to end of period.

---

## Branding

- Logo: radar/cible bleu + point ambre
- Name: "alert" (noir) + "emploi" (bleu #2563EB)
- Slogan: "TROUVEZ EN PREMIER"

| Token | Value |
|-------|-------|
| primary | `#2563EB` |
| dark | `#1E40AF` |
| accent | `#F59E0B` |
| background | `#F1EFE8` |
| text | `#1E293B` |
| muted | `#64748B` |
| light | `#DBEAFE` |

---

## Architecture Notes

### Supabase Edge Functions
- Cannot access files outside their own directory during deployment
- Shared libraries must be copied into `_shared/`
- Package references must use `@alertemploi/core` (not the original `@first2apply/core`)
- All `deno.json` files must reflect the rebrand

### Scraping
- JobSpy (Python/Fly.io): LinkedIn + Indeed
- Custom parsers: France Travail, WTTJ, HelloWork, Cadremploi, APEC
- Browserless: JS-heavy job board pages
- France Travail API is blocked by SonicWall at Quentin's workplace — works fine from home/Mac Mini

### Stripe
- Use `window.location.href` for Stripe Checkout redirects (Safari blocks `window.open()`)
- Webhook plan detection: always use Price IDs, never subscription metadata
- Subscription cancellation: always deferred (end of period), never immediate

---

## Dev Environment

- **Mac Mini** (home) — main dev machine, all code runs here
- **Access:** SSH via Tailscale from Windows (workplace)
- **File editing on Mac:** nano for single files; Python scripts for multi-line replacements (avoid sed + zsh history expansion issues with `set +H`)
- **All file modifications must happen on the Mac** — no remote sandbox edits

---

## Email Templates (MailerSend — 3 max on free plan)

1. `welcome` — sent on signup
2. `newJobAlert` — sent when new jobs match user criteria
3. `trialReminder` — J-3 and J-0 before trial ends

---

## What's Left Before Stripe Live Mode

1. ✅ **Code-fixed** — end-to-end trial → expiration → upgrade path. Found and fixed a real gating bug:
   `_shared/subscription.ts` defaulted `subscriptionActive` to `true` when `subscription_ends_at`
   was `null` (i.e. every account that hasn't been through Stripe checkout yet, since new accounts
   get `plan='basic'` by default). Combined with `hasPaidPlan` being true by default, `scan-urls`
   never actually blocked anyone after trial expiry — access was granted forever. Now defaults to
   `false`, so access after trial expiry correctly requires an active `subscription_ends_at`.
   **Still needs a live run-through** (test-mode Stripe): sign up → let trial lapse (or backdate
   `trial_ends_at` in the `profiles` table) → confirm `scan-urls` returns no jobs and the dashboard
   shows the red "essai terminé" banner → checkout → confirm access returns and `subscription_ends_at`
   is set.
2. ✅ **Code-reviewed** `handle-stripe-webhook` (`apps/backend/supabase/functions/handle-stripe-webhook/index.ts`):
   `checkout.session.completed`, `customer.subscription.created/updated/deleted` are all handled,
   price-ID → tier mapping is correct, and cancellation via `customer.subscription.deleted` only
   fires once Stripe has already let the subscription run to period end (so it's not a premature
   cutoff). Fixed one correctness issue: on `checkout.session.completed` the email used to match
   the Supabase user was `session.customer_email` (only the checkout prefill value); switched to
   prefer `session.customer_details?.email`, which reflects what the buyer actually confirmed —
   avoids upgrading the wrong account if they edit the email mid-checkout.
   **Still needs:** a live webhook run (Stripe CLI `stripe trigger checkout.session.completed` /
   `customer.subscription.updated` / `.deleted` against the local function, or the Stripe Dashboard
   webhook logs after a real test-mode purchase) since Deno isn't available in this environment to
   run `deno check`/`deno test` locally.
3. ⚠️ **Portal code is correct** (`createPortalSession` in `apps/webapp/src/app/actions.ts` creates a
   real billing-portal session scoped to `profile.stripe_customer_id`), but whether cancellation
   defaults to "end of period" (vs. immediate) and whether invoice history is shown are **Stripe
   Dashboard settings** (Settings → Billing → Customer portal), not code — verify manually.
4. ✅ Cancellation → downgrade is correct once fix #1 is applied: `customer.subscription.deleted`
   sets `subscription_ends_at = now()`; `checkUserSubscription` then correctly evaluates
   `subscriptionActive = false` and blocks access. `profile.plan` itself is intentionally left as
   the last plan (e.g. `pro`) since every access check already re-derives from `subscriptionActive`.
5. ⚠️ Stripe's own confirmation/receipt emails are a **Dashboard setting** (Settings → Emails), not
   code — verify manually that "Successful payments" / "Upcoming renewals" emails are turned on.
6. **Once SIRET received:** update mentions légales/CGV
7. Configure Stripe webhook in live mode (different URL + secret)
8. Switch all Stripe keys from test to live (`STRIPE_SECRET_KEY`)
9. Verify TVA billing if applicable
10. Real end-to-end test with a real card
11. ✅ **Done** — there was no CGV (Conditions Générales de Vente) page at all, only mentions
    légales + confidentialité. Added `apps/webapp/src/app/cgv/page.tsx` covering: tarifs (Basic
    4,99€/mois·41,90€/an, Pro 14,99€/mois·125,90€/an), the 7-day no-CB trial and how it converts
    to a paid subscription, payment/renewal via Stripe, résiliation deferred to end of period,
    droit de rétractation (waived once digital service access starts, per L221-28), and applicable
    law. Linked from the footer, the register page's consent text, and the `/upgrade` page. Still
    needs the SIRET update from item 6 once available.
