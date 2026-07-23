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

### 🔴 P0 — found during live testing 2026-07-23, needs your attention first

- **`scan-urls` crashes (503, empty body) whenever it actually processes a real matched link**,
  for every provider tried (`francetravail` live API call, `indeed` via the JobSpy branch). It's
  NOT related to the subscription fix below — reproduced identically regardless of trial/subscription
  state, and confirmed via DB side effects: the link's `last_scraped_at` does get bumped (so a scrape
  genuinely starts and succeeds) but the function dies before returning a response, after the DB
  write. Likely a memory or response-size limit on the Edge Function runtime (the module pulls in
  `deno-dom-wasm` + ~15 site parsers + `turndown`), possibly made worse by a broad test keyword
  ("test", "developpeur") returning a large real result set from France Travail's live API. **I
  could not get a stack trace** — this Supabase CLI version (2.98.2) has no `functions logs` command
  and Docker wasn't running locally to reproduce via `supabase functions serve`. Please check
  **Dashboard → Edge Functions → scan-urls → Logs** for the actual error, or upgrade the CLI
  (`npm i -g supabase@latest`) to get `supabase functions logs scan-urls --project-ref pvhtnwuzrkmnpxnfvwyv`.
  This is your core paid feature (scanning saved searches) — it needs fixing before launch
  regardless of the Stripe checklist below.
- **`handle-stripe-webhook` events aren't completing** even after redeploying the fix below: I
  created a real test-mode subscription and nudged it (metadata update) to fire a fresh
  `customer.subscription.updated` event; Stripe's own event log shows `pending_webhooks: 1`
  (undelivered/failing) minutes later, and the `profiles` row was never touched. The function
  itself is healthy (a bad-signature request gets a clean, fast `500` with a proper error message —
  no crash), so the failure is happening deeper in a *real*, correctly-signed event — possibly the
  same resource-limit issue as `scan-urls` (this function also does several chained calls: Stripe
  customer retrieve, a Supabase RPC, a profile update). Notably, one *other*, real historical event
  from before today (`evt_1Tlm6gV059EuUi4mP03ons82`, for `sub_1TghQBV059EuUi4mruW9d2DX`) also shows
  `pending_webhooks: 1` — so this isn't purely an artifact of my test, it may have already affected
  a real subscriber. **Check Dashboard → Developers → Webhooks → `handle-stripe-webhook` endpoint →
  that event's delivery attempts** for the actual response/error, and check whether that specific
  real customer's `profiles` row reflects their current plan correctly.
- Found and fixed **a second, more subtle bug** while investigating the above: Stripe API versions
  from `2025-03-31` onward removed the top-level `current_period_end` from the `Subscription`
  object (moved onto each subscription item). Your webhook endpoint is pinned to `2026-05-27.dahlia`
  (confirmed via the Stripe API), so `customer.subscription.updated`'s handler — which reads
  `event.data.object` directly — was getting `undefined` for `current_period_end`, silently writing
  `subscription_ends_at: null` on every renewal/plan-change event. Combined with today's fix below
  (`subscriptionActive` now correctly defaults to `false` for `null`), this would have **newly
  locked out real paying customers** the next time their subscription updated. Fixed with a
  `getPeriodEnd()` helper that falls back to `subscription.items.data[0].current_period_end`, and
  deployed. This part I could verify is *correct code*, but not verify end-to-end given the
  delivery issue above.

### The original checklist

1. ✅ **Code-fixed and deployed** — end-to-end trial → expiration → upgrade path. Found and fixed a
   real gating bug: `_shared/subscription.ts` defaulted `subscriptionActive` to `true` when
   `subscription_ends_at` was `null` (i.e. every account that hasn't been through Stripe checkout
   yet, since new accounts get `plan='basic'` by default). Combined with `hasPaidPlan` being true by
   default, `scan-urls` never actually blocked anyone after trial expiry — access was granted
   forever. Now defaults to `false`. **Verified live** (2026-07-23, test-mode, cleaned up
   afterwards): created a disposable Supabase account, backdated `trial_ends_at` to the past with
   `subscription_ends_at` still `null`, hit `scan-urls` with a real saved link — got the fast,
   blocked response with the link's `last_scraped_at`/`scrape_failure_count` completely untouched,
   proving it now correctly short-circuits before ever reaching the (separately broken, see above)
   parsing code. The upgrade half (checkout → access restored) is still blocked on the webhook
   delivery issue above.
2. ✅ **Code-fixed and deployed**, config double-checked against Stripe directly: the webhook
   endpoint (`we_1TgguKV059EuUi4mxfmHIYCt`) is registered at the right URL with exactly
   `checkout.session.completed`, `customer.subscription.created/updated/deleted` enabled, price-ID
   → tier mapping is correct, and cancellation via `customer.subscription.deleted` only fires once
   Stripe has already let the subscription run to period end. Fixed two correctness issues: (a) the
   email used to match the Supabase user on `checkout.session.completed` was `session.customer_email`
   (checkout-prefill only); switched to prefer `session.customer_details?.email`. (b) the
   `current_period_end` API-version bug described above. **Blocked on the delivery issue above** for
   full end-to-end verification.
3. ⚠️ **Portal code is correct** (`createPortalSession` in `apps/webapp/src/app/actions.ts` creates a
   real billing-portal session scoped to `profile.stripe_customer_id`), and the Stripe Dashboard
   config was checked directly via the API: portal `cancellation.mode = 'at_period_end'` (deferred,
   as required), `invoice_history.enabled = true`, `payment_method_update.enabled = true`. This item
   is fully done — code and config both verified.
4. ✅ Cancellation → downgrade is correct once fix #1 is applied: `customer.subscription.deleted`
   sets `subscription_ends_at = now()`; `checkUserSubscription` then correctly evaluates
   `subscriptionActive = false` and blocks access. `profile.plan` itself is intentionally left as
   the last plan (e.g. `pro`) since every access check already re-derives from `subscriptionActive`.
   Not yet verified live end-to-end (blocked on the webhook delivery issue above).
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
