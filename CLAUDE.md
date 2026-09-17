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
- `scan-job-description` — parses a single job posting's description (not called by the webapp today)
- `create-link` — creates a new saved search
- `handle-stripe-webhook` — Stripe billing events (see Stripe section below)
- `send-welcome-email` / `send-trial-reminder` — MailerSend-triggered emails
- `post-scan-hook` — runs after a scan completes
- `_shared/` — code shared across functions (must be self-contained per Edge Functions constraint below): `parsers/` (one file per job board), `jobListParser.ts` (dispatches to the right parser per `JobSite`/`SiteProvider`), `emails/`, `subscription.ts` (trial/plan gating), `fetchLinkContent.ts` (JobSpy/Browserless fetch shared by `scan-urls` and `cron-scan`), `advancedMatching.ts` (Pro company blacklist), `urlSafety.ts` (SSRF guard)

### Web app (`apps/webapp/src/app/`)
App Router structure: `dashboard/` (main authenticated view), `jobs/[jobId]/` (job detail), `links/` (saved searches), `auth/` (login/register/reset via Supabase Auth), `menu/` (mobile slide-in modal, see `components/MenuDrawer.tsx`), `upgrade/` (plan selection / Stripe checkout), `blacklist/` (Pro company blacklist), `legal/`, `privacy/`, `cgv/`.

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
- Pro: company blacklist (`/blacklist`), applied when scans insert jobs (`scan-urls`, `cron-scan`)
- No AI features: custom job sites and the AI exclusion filter were removed 2026-09-16 (no LLM provider configured)

---

## Pricing & Subscription Logic

No free plan. Two plans only:

| Plan | Monthly | Annual |
|------|---------|--------|
| Basic | 4,99€ | 41,90€ |
| Pro | 14,99€ | 125,90€ |

**Stripe Price IDs (LIVE, account `acct_1TggbNV05CSUPvQv`, created 2026-09-16):**
- Basic monthly: `price_1UGQGDV05CSUPvQveeN8BJSg`
- Basic annual: `price_1UGQGDV05CSUPvQvf3cJ4zwO`
- Pro monthly: `price_1UGQGDV05CSUPvQv1UbCvLXH`
- Pro annual: `price_1UGQGEV05CSUPvQvXOombR5L`

Old test-mode IDs (`price_1Tk1X4V059EuUi4m…`, `price_1Tk1XSV059EuUi4m…`, `price_1Tk1XjV059EuUi4m…`) are no
longer referenced in code. Live webhook endpoint: `we_1UGQGzV05CSUPvQvX1YlrRML` (API version
`2026-05-27.dahlia`). Live portal config: `bpc_1UGQH4V05CSUPvQvqe9gAdqq` (default, cancel at period end).

**TVA:** franchise en base — "TVA non applicable, art. 293 B du CGI" on CGV, mentions légales, `/upgrade`.
No Stripe Tax.

**Trial:** 7 days from signup, no credit card required (`payment_method_collection: if_required`)
- New accounts: `plan='basic'`, `trial_ends_at = now() + 7 days`
- Trial is granted once per account: `createCheckoutSession` passes the *remaining* signup trial as
  `subscription_data[trial_end]` (only if > 48h left, Stripe's minimum), never a fresh 7 days, and none
  for accounts that already had a Stripe customer
- `scan-urls` / `cron-scan` block access if trial expired without active subscription
- Dashboard: orange banner (trial active) / red banner (trial expired, CTA "S'abonner")

**Checkout / plan changes:** an account with an active subscription never gets a second Checkout —
`createCheckoutSession` opens the Stripe portal's `subscription_update` flow instead (portal allows
Basic ↔ Pro, monthly/annual, `trial_update_behavior=continue_trial`). Existing Stripe customer is reused.

**Stripe webhook:** plan detection via Price ID (not metadata). `customer.subscription.updated/deleted`
only apply to the user's *current* subscription (`profiles.stripe_subscription_id`); events about any
other subscription are ignored — otherwise cancelling a stale duplicate would expire the user's access.

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
- Subscription cancellation by customers: always deferred (end of period, portal config)
- Stripe customer emails (FR): successful payments, upcoming renewals, trial ending, card payment failure; payment updates go through Stripe's hosted page (irreversible choice made 2026-09-17)
- Invoice footer: "TVA non applicable, art. 293 B du CGI"

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

## Launch Status (Stripe LIVE since 2026-09-16)

Live end-to-end verified 2026-09-17 with the founder's own account: Checkout → webhook → `profiles`
updated (Pro, trial), `cron-scan` inserted 50 real jobs (LinkedIn + Indeed), duplicate subscription
cancelled without affecting access.

### Still open
- **MailerSend**: domain verified + paid plan done by founder, but no signup has happened since — the
  welcome email has **not** been observed succeeding yet. Check `send-welcome-email` logs on the next signup.
- **Company blacklist** exclusion not yet observed on a real scan (code path deployed, `cron-scan` works).
- **Auth hardening** (not done): no CAPTCHA on signup/login (needs Turnstile/hCaptcha keys + widget in
  `auth/{register,login}/page.tsx` *before* enabling it in Auth config), `password_min_length: 6`,
  `security_update_password_require_reauthentication: false`.
- **Local checks**: this repo has been deployed without `pnpm typecheck`/lint/Husky actually running
  (no `node_modules` on the machine used) — Vercel's build is the only type check the webapp got.
- Unused Vercel env vars: `NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID`, `NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID`,
  `NEXT_PUBLIC_STRIPE_PORTAL_LINK` (not referenced in code).
- `scan_queue` table: unused, locked down (RLS, no policies), deliberately left in place.

### Operational notes
- **Logs**: Management API log explorer — `GET api.supabase.com/v1/projects/{ref}/analytics/endpoints/logs.all`
  with `sql=select timestamp, event_message from function_logs ...` (the CLI has no `functions logs`).
- **SQL without `supabase link`**: `POST api.supabase.com/v1/projects/{ref}/database/query` with a
  personal access token. No local migration history — schema/grant changes are applied to the remote DB.
- **pg_cron jobs**: `cron-scan` every 30 min, `send-trial-reminder` daily 9:00. `cron.job` stores
  `F2A_WEBHOOK_SECRET` in plaintext in its command (standard pg_cron + pg_net pattern, not API-exposed).
- **Postgres grants gotcha**: new functions get `EXECUTE` for `PUBLIC`; revoking from `anon`/`authenticated`
  alone does nothing — revoke from `PUBLIC`.
- **Service-role inserts**: column defaults like `user_id = auth.uid()` are NULL under `service_role`;
  set `user_id` explicitly (this silently broke every `cron-scan` insert until 2026-09-16).
- Temporary launch credentials (Stripe restricted key, Supabase/Vercel tokens) were revoked 2026-09-17.

### Security history (all fixed)
- 2026-07-23: `profiles` RLS let any user `PATCH` themselves to Pro (UPDATE now limited to
  `email_alerts_enabled`, `alert_frequency`, with `WITH CHECK`); `get_user_id_by_email` / `is_pro_user`
  callable by `anon` (EXECUTE now `service_role` only); webhook trusted buyer-editable checkout email
  (now `client_reference_id` first); Mezmo logger crashed functions and leaked its API key (key removed,
  console logger fallback).
- 2026-09-16/17: SSRF guard kept (`urlSafety.ts`) though custom sites were removed; webhook no longer
  lets a stale subscription's events overwrite/expire the current one; duplicate subscriptions blocked.
