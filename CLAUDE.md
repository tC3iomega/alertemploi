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

### 🔒 Security fixes 2026-07-23 — both introduced earlier the same day, both fixed and deployed

A security review of the day's own changes (not a general audit) caught two HIGH-severity issues,
both regressions from fixes made earlier the same session:

- **Broken access control in `handle-stripe-webhook`**: preferring `session.customer_details.email`
  over `session.customer_email` (the earlier fix in this same file) meant the webhook trusted a
  field the buyer can edit on Stripe's own hosted Checkout page. Since `createCheckoutSession`
  (`apps/webapp/src/app/actions.ts`) creates sessions with a bare `customer_email`, not a locked
  `customer`, an authenticated attacker could start their own checkout, edit the email field to a
  victim's account email, and have the webhook overwrite the **victim's** `profiles` row
  (`stripe_customer_id`, `plan`, `subscription_ends_at`, etc.) with the attacker's own
  subscription — and since `createPortalSession` blindly trusts `profile.stripe_customer_id`, the
  victim's own "manage billing" button would then open a portal into the attacker's Stripe
  customer. Fixed by prioritizing `session.client_reference_id` (set to the authenticated
  Supabase `user.id` at session creation, immutable by the buyer) and only falling back to email
  lookup when it's absent (the `customer.subscription.created` path, which has no
  `client_reference_id` available). Verified no regression on the email-fallback path via a fresh
  test-mode subscription.
- **Secret exposure in `_shared/logger.ts`**: the `mezmoLogger.on('error', ...)` handler added
  earlier the same day to stop Mezmo connection failures from crashing functions was logging the
  raw error object. `@logdna/logger` attaches the outgoing request headers to `err.meta`, stripping
  only `Authorization` — but the actual ingestion key travels under a header literally named
  `apiKey`, which survives untouched, so `MEZMO_API_KEY` was printing in plaintext into every
  function's logs on each connectivity hiccup (which, per the crash investigation above, was
  happening on essentially every real request). Fixed to log only `err.message`. **`MEZMO_API_KEY`
  should be rotated** since it may already have leaked into logs before this fix.

Redeployed to all 9 functions using the shared logger.

### 🟢 P0 found and fixed 2026-07-23 — root cause of two separate-looking crashes

While live-testing the items below, `scan-urls` was crashing (503, empty body) on every real link
it processed, and `handle-stripe-webhook` was silently failing on real Stripe events
(`pending_webhooks` stuck at 1, `profiles` never updated) even after the fixes further down. Both
turned out to be **the same bug**: `_shared/logger.ts` wraps `@logdna/logger` (Mezmo), which is an
`EventEmitter` that emits `'error'` on any connection failure (invalid/unreachable `MEZMO_API_KEY`).
With no `.on('error', ...)` listener attached, Node/Deno's default behavior is to rethrow that as an
uncaught exception — killing the *entire function isolate*, not just the logging call. Every
function that logs enough to trigger a flush (i.e. any function doing real work, not just an early
return) was exposed to this.

Confirmed via the Management API's log explorer (`api.supabase.com/v1/projects/{ref}/analytics/endpoints/logs.all`,
using the token at `~/.supabase/access-token` — this CLI version has no `functions logs` command):
the exact crash was `event loop error: Error: A connection-based error occurred that will not be
retried. [...] at .../@logdna/logger/2.6.11/lib/logger.js:867:29`, immediately after real log lines
like `France Travail: fetching ...` — i.e. it only surfaced once a function actually reached
substantive work, which is exactly why trivial requests (empty `htmls`, bad Stripe signatures)
always looked fine.

**Fixed** by attaching `mezmoLogger.on('error', (err) => console.error(...))` in
`_shared/logger.ts` so a Mezmo connectivity issue is logged and ignored instead of crashing the
function. **Deployed to all 9 functions that use the shared logger** (`scan-urls`,
`handle-stripe-webhook`, `create-link`, `cron-scan`, `send-welcome-email`, `send-trial-reminder`,
`scan-job-description`, `handle-profile-change-webhook`, `post-scan-hook`) since all were equally
exposed — `cron-scan` in particular runs unattended every 30 minutes, so this may have been causing
silent scan failures for a while.

**Verified live end-to-end after the fix** (test-mode, disposable accounts, all cleaned up after):
`scan-urls` now returns `200` on the exact real link/site combination that used to 503, with
`last_scraped_at` correctly bumped (real France Travail API call completes normally). A full
Stripe test-mode subscription lifecycle now works: checkout → `profiles` row gets
`stripe_customer_id`/`subscription_ends_at`/`trial_ends_at` set correctly; a `metadata` nudge
(fires `customer.subscription.updated`) delivers successfully (`pending_webhooks: 0`); cancelling
the subscription (`customer.subscription.deleted`) correctly zeroes out `subscription_ends_at`/
`trial_ends_at`, and a subsequent `scan-urls` call for that user is blocked instantly with no side
effects — no crash anywhere in the chain.

Whether `MEZMO_API_KEY`'s underlying connectivity issue is worth investigating further (so logs
actually reach Mezmo/Datadog again) is now just an observability nice-to-have, not a launch
blocker — the app can no longer be taken down by it either way.

### The original checklist

1. ✅ **Fixed, deployed, and verified live end-to-end** (2026-07-23, test-mode, cleaned up after).
   Two bugs fixed: (a) `_shared/subscription.ts` defaulted `subscriptionActive` to `true` when
   `subscription_ends_at` was `null` (every account that hasn't checked out yet, since new accounts
   get `plan='basic'` by default) — `scan-urls` never actually blocked anyone after trial expiry.
   Now defaults to `false`. (b) the Mezmo logger crash above, which was masking this fully working
   once triggered. Verified: an expired-trial account with no subscription now gets blocked
   instantly on a real link with zero side effects; a real Stripe checkout correctly restores
   access with `subscription_ends_at` set to the real period end.
2. ✅ **Fixed, deployed, and verified live.** Webhook endpoint (`we_1TgguKV059EuUi4mxfmHIYCt`) has
   the right URL and exactly `checkout.session.completed` /
   `customer.subscription.created/updated/deleted` enabled. Fixed three issues: (a) email matching
   on `checkout.session.completed` now prefers `session.customer_details?.email` over the
   checkout-prefill-only `session.customer_email`. (b) Stripe API versions ≥ `2025-03-31` removed
   the top-level `current_period_end` from `Subscription` (moved onto each item); this endpoint is
   pinned to `2026-05-27.dahlia`, so `customer.subscription.updated`'s handler — which reads
   `event.data.object` directly — was getting `undefined` and silently writing
   `subscription_ends_at: null` on every renewal. Added a `getPeriodEnd()` helper with a fallback to
   `subscription.items.data[0].current_period_end`. (c) the Mezmo logger crash above. Verified live:
   checkout, a `customer.subscription.updated` nudge, and cancellation all now deliver successfully
   and update `profiles` correctly.
3. ✅ **Portal code correct** (`createPortalSession` in `apps/webapp/src/app/actions.ts`), and
   Stripe Dashboard config checked directly via the API: `cancellation.mode = 'at_period_end'`
   (deferred, as required), `invoice_history.enabled = true`, `payment_method_update.enabled = true`.
4. ✅ **Verified live.** Cancelling a real test subscription correctly sets `subscription_ends_at`
   and `trial_ends_at` to now; a subsequent `scan-urls` call for that user is blocked instantly with
   no side effects on the link row.
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
