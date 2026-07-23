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
  happening on essentially every real request). Fixed to log only `err.message`.

  Confirmed via the log explorer that the real key value had in fact already been logged in
  plaintext multiple times during that window (unrelated to any real signup — purely from this
  session's own test traffic), and that Mezmo was rejecting it with a `403` regardless — i.e. the
  key was already dead, not just exposed. Mezmo now requires a paid plan to issue a new ingestion
  key, so rather than pay for that, **`MEZMO_API_KEY` was removed from Supabase secrets entirely**
  (`supabase secrets unset MEZMO_API_KEY`). `createLoggerWithMeta` already falls back to a plain
  `console.log`/`console.error`-based logger when the key is absent — no code change needed, no
  functionality lost (Supabase's own log explorer, used throughout this investigation, already
  gives full visibility), and it fully removes this entire class of risk going forward. Verified
  live: `scan-urls` still returns `200` normally with the key unset, and no more `Mezmo` log lines
  appear.

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

### 🟢 `cron-scan` found broken in three separate ways 2026-07-23 — all fixed and deployed

Fixing the Mezmo crash above unmasked `cron-scan` (the unattended 30-min auto-scan) failing on
**every single invocation**, confirmed via the log explorer showing the identical error on every
run in the preceding hours:

1. **Crash on every run**: `.select('*, user:user_id(id, email)')` tried to embed `auth.users` via
   PostgREST — `"Could not find a relationship between 'links' and 'user_id' in the schema cache"`.
   `auth` isn't part of the exposed API schema (`config.toml`'s `[api] schemas` only lists `public`,
   `storage`, `graphql_public`), so this embed could never resolve. The embedded `email` was never
   actually used downstream (only `.id` is). Fixed by dropping the embed entirely
   (`.select('*')`) and using `email: ''` directly. **Verified live** on the real next scheduled run:
   went from crashing immediately to `found 2 links to scan` (two genuine pre-existing links,
   LinkedIn + Indeed).
2. **LinkedIn/Indeed/HelloWork/WTTJ/Cadremploi silently unscannable**: unlike `scan-urls`,
   `cron-scan` called `parseJobsListUrl` directly with a hardcoded `html: ''`, never replicating
   `scan-urls`'s JobSpy-worker fetch (LinkedIn/Indeed) or Browserless/direct-fetch (HelloWork/WTTJ/
   Cadremploi) logic — so every link on those providers failed to parse on every cron run, cron-scan
   only ever worked for France Travail/APEC (which fetch their own data server-side). Fixed by
   extracting that fetch logic out of `scan-urls/index.ts` into a new shared
   `_shared/fetchLinkContent.ts`, used by both functions now. **Verified live**: `scan-urls` still
   behaves identically post-refactor (a France Travail link returns normally, an Indeed link returns
   real JobSpy-scraped listings).
3. **No trial/subscription gating at all**: `cron-scan` never called `checkUserSubscription` —
   unlike `scan-urls`, it kept auto-scanning (and inserting new `jobs` rows) for every link
   regardless of whether that user's trial had expired or they had no active subscription,
   completely bypassing the paywall fix from earlier tonight. Fixed by checking
   `checkUserSubscription` once per user per run (cached in-memory across that run's links, since
   several links can belong to the same account) and skipping scanning for expired accounts.
   **Verified live** on the very next scheduled run, on a genuine pre-existing production account
   (not a test one): `cron-scan: skipping link 12/13, subscription expired for user 70fbe96b-...` —
   confirming the paywall now applies to the automated scan too, not just the manual one.

Redeployed `cron-scan` after each fix. All three fixes confirmed live on real scheduled runs (not
synthetic tests) within the same evening: crash gone → real links found → subscription gate
correctly skipping an expired real account. The JobSpy/Browserless fetch path (#2) specifically was
verified through `scan-urls` (identical shared code, confirmed to still return real Indeed listings
post-refactor) rather than through `cron-scan` directly, since by the time that fix shipped the only
two real links in the database belonged to the now-correctly-blocked expired account.

### ⚠️ `MAILERSEND_API_KEY` was also dead — new key set, but MailerSend account needs attention

A final sweep of the other 4 functions' logs (`send-trial-reminder`, `handle-profile-change-webhook`,
`post-scan-hook`, `scan-job-description`) turned up one more real, non-crashing issue:
`send-welcome-email` was failing on every single signup with `401 Unauthenticated` from MailerSend's
API — same category of problem as the Mezmo key (a dead third-party credential), confirmed on 8+
occurrences across the evening. Unlike Mezmo, this doesn't crash anything (the error is caught and
logged), it just means **no welcome emails were going out**, and likely no trial-reminder emails
either (`send-trial-reminder` shares the same `_shared/emails/mailer.ts`).

A new API token was generated in MailerSend and set via `supabase secrets set MAILERSEND_API_KEY=...`.
This fixed the auth error, but surfaced the real underlying issue: the MailerSend account is still on
a **trial plan**, which caps sending to a limited number of unique recipients
(`"You have reached trial account unique recipients limit. #MS42225"`, HTTP 422). **Verify the
sending domain in MailerSend and/or upgrade the plan** — this is an account-level restriction, not
something fixable from code or secrets. Until resolved, welcome/trial-reminder emails will still fail
for most real recipients, just with a different (clearer) error than before.

**Deferred until the SIRET arrives** (same dependency as items 6/9 below) — the MailerSend plan
upgrade needs business billing details tied to the SIRET, same as Stripe live mode.

### 🔴 CRITICAL — `profiles` RLS let any user grant themselves Pro forever, for free (found & fixed 2026-07-23)

Auditing RLS (which nothing tonight had touched — everything so far used `service_role`, which
bypasses RLS entirely) found the most severe issue of the night. `pg_policies` showed the `profiles`
UPDATE policy (`mise à jour profil propre uniquement`) had a correct `USING (auth.uid() = user_id)`
but **`WITH CHECK` was `null`**, and `information_schema.column_privileges` showed `authenticated`
had column-level `UPDATE` grants on *every* column, including `plan`, `subscription_ends_at`,
`trial_ends_at`, `stripe_customer_id`, `stripe_subscription_id`.

**Confirmed exploitable with a single request** using only the public anon key + a normal user's own
session JWT (exactly what any signed-in browser has) — a throwaway test account was created,
signed in normally, and this succeeded with `HTTP 200`:
```
PATCH /rest/v1/profiles?user_id=eq.<own-id>
{"plan":"pro","subscription_ends_at":"2099-12-31","trial_ends_at":"2099-12-31"}
```
Any signed-up user could grant themselves permanent Pro access with one API call from devtools —
no Stripe, no payment, ever. This has presumably been possible since the `profiles` table was
created.

**Fixed** with two statements run directly against the linked project (`supabase db query --linked`
— there's no local migration history for this project, changes are applied straight to the remote
DB):
```sql
REVOKE UPDATE ON public.profiles FROM authenticated, anon;
GRANT UPDATE (email_alerts_enabled, alert_frequency) ON public.profiles TO authenticated;
ALTER POLICY "mise à jour profil propre uniquement" ON public.profiles
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```
`authenticated` can now only update the two genuinely user-editable preference columns; the `WITH
CHECK` is added defense-in-depth against row reassignment (mirrors the pattern `links`/`jobs` already
had correctly — see below). Server-side updates via `service_role` (the Stripe webhook, cron-scan,
etc.) are unaffected, since `service_role` bypasses table grants and RLS entirely.

**Verified live**: the exact same exploit request now returns `403 permission denied for table
profiles`; a legitimate preference update (`alert_frequency`) still returns `200` and applies
correctly.

**`links` and `jobs` were checked too and are fine** — both have an `ALL` policy with matching
`USING`/`WITH CHECK` (`auth.uid() = user_id` on both), so even though `authenticated` can technically
issue an UPDATE naming another `user_id`, Postgres rejects the whole statement
(`new row violates row-level security policy`) since the row wouldn't satisfy `WITH CHECK` afterward
— confirmed live with a real reassignment attempt. `profiles` was the only table missing this.

**The remaining 5 tables were audited too, same evening — all fine, nothing else to fix**:
- `advanced_matching`, `html_dumps`, `notes` — same safe `ALL` policy pattern as `links`/`jobs`
  (matching `USING`/`WITH CHECK` on `auth.uid() = user_id`). `advanced_matching` does expose
  `ai_api_cost`/`ai_input_tokens_used`/`ai_output_tokens_used` to column-level `UPDATE`, but grepping
  the backend confirms these are never read anywhere (only declared in `_shared/types.ts`) — no
  enforcement logic depends on them, so tampering has zero practical effect. Not worth touching.
- `sites` — `SELECT`-only policy with `qual: true` (any authenticated user can read all rows) and no
  write policies at all. Correct and intentional: it's a shared reference table (the list of job
  boards), not per-user data.
- `scan_queue` — RLS enabled but **zero policies of any kind**, for any role. In Postgres that means
  fully deny-by-default for `authenticated`/`anon` (safe), and grepping the whole codebase shows it's
  never referenced anywhere in app code either — looks like a dead/unused table, probably worth
  dropping eventually but not a security issue as-is.

### 🔴 CRITICAL — unauthenticated email → user-id → subscription-status oracle (found & fixed 2026-07-23)

Extending the audit to RPC functions (`pg_proc` joined with `information_schema.routine_privileges`)
found two more `SECURITY DEFINER` functions callable with **zero authentication at all** — not even
a valid user session, just the public anon key that ships in every page load:

- `get_user_id_by_email(email text)` — `SELECT id FROM auth.users WHERE lower(email) = lower($1)`.
  Meant to be called only by `handle-stripe-webhook` via `service_role`, but was also directly
  callable by `anon`.
- `is_pro_user(check_user_id uuid)` — reads `profiles` for any given user id (bypassing that table's
  RLS via `SECURITY DEFINER`) and returns whether they have active Basic/Pro access. Not called
  anywhere in the codebase at all (only present in generated types) — pure leftover surface.

**Confirmed live**, no auth header, just `apikey: <anon key>`:
`POST /rest/v1/rpc/get_user_id_by_email {"email":"..."}` → `200 [{"id":"<real uuid>"}]`. Chained with
`is_pro_user`, this is a complete "does this email have an account, and are they a paying customer"
oracle available to anyone on the internet.

**Root cause worth remembering**: Postgres grants `EXECUTE` to `PUBLIC` on every new function by
default, and `anon`/`authenticated` inherit from `PUBLIC` — so the first fix attempt
(`REVOKE ... FROM anon, authenticated`) silently did nothing, since the underlying `PUBLIC` grant
still applied. Confirmed via `information_schema.routine_privileges` that `PUBLIC` still had
`EXECUTE` after that first revoke, and the exploit still worked. Fixed properly with:
```sql
REVOKE EXECUTE ON FUNCTION public.get_user_id_by_email(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_pro_user(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_id_by_email(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.is_pro_user(uuid) TO service_role;
```
**Verified live**: both now return `401 permission denied for function ...` with the anon key;
`handle-stripe-webhook`'s real usage (via `service_role`, unaffected by these grants) still works.

**Also audited, not exploitable despite showing up in the same grant list**: `handle_new_user()` and
`rls_auto_enable()` are a trigger function and an event-trigger function respectively — Postgres
refuses to invoke either outside their trigger context (`trigger/event trigger functions can only be
called as triggers`), so the broad `PUBLIC` EXECUTE grant on them is inert. Not touched.

**Separately noticed while in here, not fixed (low priority, not security-relevant)**:
`_shared/openAI.ts`'s `logAiUsage()` calls `supabaseAdminClient.rpc('log_ai_usage', ...)`, but no
`log_ai_usage` function exists anywhere in the database — the call fails every time, silently caught
and logged. Since `advanced_matching.ai_api_cost`/token columns are never read anywhere either (see
above), this only means AI usage cost is never actually recorded — no user-facing or security impact,
just a gap in internal cost observability. Would need the actual accumulation logic designed/added
if that visibility is wanted; out of scope for a security pass.

### Auth hardening opportunities (config-level, not touched — need frontend work first)

Checked the project's Auth config via the Management API while auditing. Nothing exploitable found,
but worth knowing about:
- `security_captcha_enabled: false` — no CAPTCHA on signup/login, so nothing stops mass fake-account
  creation (trial abuse) or credential-stuffing attempts. **Enabling this needs frontend work first**:
  `register`/`login` pages have zero CAPTCHA widget integration today, so flipping the backend switch
  alone would immediately break every signup/login (no token would ever be sent). Needs: (1) an
  hCaptcha or Cloudflare Turnstile account + site/secret keys (user has to create this), (2) widget
  integration in `apps/webapp/src/app/auth/{register,login}/page.tsx` passing the token via
  `options.captchaToken` to `signUp`/`signInWithPassword`, (3) then enabling it in Auth config.
- `password_min_length: 6` — on the low side versus modern guidance, easy config bump whenever
  wanted.
- `security_update_password_require_reauthentication: false` — a stolen/leaked access token could be
  used to change the account password without knowing the current one, locking out the real owner.
  Simple config flip, no frontend work needed, but changes the password-change UX slightly (would
  require re-entering credentials).

### Dead code removed 2026-07-23

- **`handle-profile-change-webhook`** — deleted (repo + undeployed from Supabase), along with
  `_shared/mailerLiteApi.ts` and the `mailerLiteApiKey` field in `_shared/env.ts` (both only used by
  it). Confirmed safe to remove: no trigger on `profiles` (or anywhere) calls this function, no
  `MAILERLITE_API_KEY` secret was ever configured (it would have thrown immediately on every
  invocation regardless), and it's not referenced from any other file. Almost certainly a leftover
  from the original `first2apply` fork (MailerLite predates the MailerSend integration that
  `send-welcome-email`/`post-scan-hook` actually use today).
- **`scan_queue` table** — audited (RLS enabled, zero policies for any role, real FK constraints to
  `links`/`auth.users`, not referenced by any pg_cron job, trigger, or app code) but **left in place**
  per explicit choice — not worth the irreversibility of `DROP TABLE` for a table that isn't hurting
  anything by existing (locked down by default, no policies).

**Also discovered while checking for triggers/cron jobs referencing the above**: there's a second
pg_cron job beyond `cron-scan` — `send-trial-reminder` runs daily at 9am (`0 9 * * *`).

### `send-trial-reminder` had 2 bugs too — checked and fixed same evening

- **Never sent a single reminder, ever**: the query filtered `.eq('plan', 'free')`, but `'free'` is a
  leftover enum value from before the pricing model changed to Basic/Pro-with-trial — confirmed zero
  rows in `profiles` have ever had `plan='free'` (all real rows are `'basic'`). Every account gets a
  trial via `trial_ends_at` regardless of which plan they picked, so this filter should never have
  been there. Fixed by removing it entirely (the existing `if (!profile.trial_ends_at) continue`
  already correctly skips anyone without an active trial date).
  - Same stale assumption existed in the `SubscriptionTier` TypeScript type itself
    (`libraries/core/src/types.ts` and its Edge Functions copy `_shared/types.ts`): declared as
    `'free' | 'pro'`, missing `'basic'` entirely, even though `handle-stripe-webhook`'s
    `PRICE_ID_TO_TIER` map has assigned literal `'basic'` values to it all along. This should be a
    hard type error and never should have passed type-checking — strongly suggests `pnpm typecheck`
    isn't actually being run as a gate before deploys. Fixed the type to `'basic' | 'pro'` in both
    copies, rebuilt `libraries/core`, and confirmed `@alertemploi/webapp`'s typecheck still passes.
- **One failed send blocks every subsequent user in the batch**: the per-profile loop had no
  try/catch around the actual `mailer.sendEmail(...)` call, so one throwing (e.g. a bad address, or
  the MailerSend trial-quota error from the section above) would abort the whole function — nobody
  after that user in the loop would get their reminder either. Added a try/catch per iteration,
  matching the pattern `cron-scan`'s per-link loop already uses.

**Verified live** using the plaintext `F2A_WEBHOOK_SECRET` (visible in `cron.job`'s stored command —
see below): created a test profile with `trial_ends_at` set to today, invoked the function directly.
Before the fix it never even found the profile; after the plan-filter fix it correctly found it and
attempted to send (hit the already-known MailerSend trial-quota error, not a new issue); after the
try/catch fix the function returns a clean `200 {"success":true,"sentCount":0}` instead of crashing
with `500` on that same quota error — ready to work correctly for real once MailerSend's account
issue is resolved.

**Incidental discovery, not itself a vulnerability but worth knowing**: `cron.job`'s stored SQL
command has `F2A_WEBHOOK_SECRET`'s plaintext value baked directly into the `Authorization` header
string (`select net.http_post(url := '...', headers := '{"Authorization": "Bearer <secret>"}'::jsonb, ...)`).
This is how Supabase's own `pg_cron` + `pg_net` pattern normally works (no other easy way to pass
headers), and the `cron` schema isn't part of the exposed API schemas in `config.toml`, so this isn't
reachable by `anon`/`authenticated` over the REST API — but it does mean anyone with direct SQL read
access to this project (e.g. via `supabase db query --linked`, as used all evening) can read the
webhook secret in plaintext. Not fixed (this is Supabase's standard pattern for authenticating
`pg_cron`-triggered function calls), just documented so it doesn't come as a surprise later.

### SSRF hardening added to the Pro "custom job site" feature (defense-in-depth, not an active exploit)

While reading `create-link` for the first time tonight: the Pro-only "custom job site" feature lets a
user submit an arbitrary URL (anything not matching the curated list of known job boards falls back
to the `custom` provider). Initially flagged this as an actively-exploitable SSRF, since nothing
stopped that URL from being `http://169.254.169.254/...` (cloud metadata) or `http://localhost/...`,
and reaching "Pro" tier only requires picking the Pro plan at signup — no real payment needed during
the 7-day trial.

**Corrected after digging further**: no current code path actually performs a server-side fetch of a
`custom`-provider URL. `_shared/fetchLinkContent.ts`'s `needsBrowser`/`needsJobSpy` lists explicitly
exclude `custom`; `parseCustomJobs` only ever operates on whatever `html` string it's handed, never
fetching itself; and the webapp always sends `html: ''`/`content: ''` regardless of provider
(`apps/webapp/src/app/actions.ts`'s `createLink`/`scanLinks`). So today, the "custom URL" feature
looks incomplete/non-functional on its own (nothing ever actually renders the target page), and
there's no live SSRF to exploit through it right now.

**Fixed anyway, as defense-in-depth**: added `_shared/urlSafety.ts`'s `assertUrlIsPubliclyReachable()`
— rejects non-http(s) protocols, literal private/loopback/link-local IPs (including obfuscated
decimal/hex forms, normalized by the standard `URL` parser), and hostnames that resolve via DNS to a
private IP. Wired into `create-link/index.ts`, applied only when `site.provider === custom` (known
job boards are matched against a fixed, curated domain list already, no user-controlled host there).
Doesn't defend against DNS rebinding after creation time (a hostname could pass validation now and
be repointed at a private IP before a later fetch) — full protection would need to re-validate right
before every fetch, not just at link-creation time. Worth keeping in mind if the missing fetch step
for `custom` URLs is ever added, since that's exactly when this would become a real, exploitable
issue rather than preventive hardening.

**Verified live** with a disposable Pro-tier test account: URLs targeting the cloud metadata IP and
`localhost` are now rejected (`"points to a local or private network address"`); a real external
domain (`example.com`) still creates the link normally.

### Completed the "custom job site" fetch step — and found AI features are entirely unconfigured

Per the previous section, nothing ever fetched a `custom`-provider URL server-side, so the Pro
"custom job site" feature was inert. Added `custom` to `_shared/fetchLinkContent.ts`'s
`needsBrowser` list (fetched the same way as HelloWork/WTTJ/Cadremploi — via Browserless, or a direct
fetch fallback), and moved the `assertUrlIsPubliclyReachable` SSRF check to run immediately before
this fetch (not just at `create-link` time), which also closes the DNS-rebinding gap noted above —
every scan re-validates the target right before actually reaching out to it. Deployed to `scan-urls`
and `cron-scan` (both consume `fetchLinkContent`).

**Verified live**: a Pro test account's custom link to a real external domain now actually triggers a
fetch (confirmed by reaching the next stage of processing, whereas before nothing happened at all).

**That next stage immediately surfaced a bigger, pre-existing gap**: it failed with `Missing
credentials. Please pass one of apiKey and azureADTokenProvider, or set the AZURE_OPENAI_API_KEY
environment variable`. Neither `AZURE_AI_FOUNDRY_ENDPOINT` nor `AZURE_AI_FOUNDRY_API_KEY` has ever
been configured in Supabase secrets. This means **every AI-dependent Pro feature has been
non-functional from the start**, independent of anything from tonight:
- `parseCustomJobs` (`_shared/customJobsParser.ts`) — extracting a job list from a custom site's HTML
  via AI, the very feature just wired up above.
- `parseCustomJobDescription` (same file) — AI-extracted job descriptions for custom sites.
- `applyAdvancedMatchingFilters` → `promptOpenAI` (`_shared/advancedMatching.ts`) — the Pro "AI
  exclusion filter" (company blacklist alone still works fine, it's plain string matching with no AI
  involved).

**Decision: parked for now, not configured.** Azure OpenAI has no perpetual free tier — usage-based
per-token billing from the first production call, though new Azure accounts get a $200/30-day trial
credit (needs card + phone verification). Given tonight's pattern (Mezmo, MailerSend), left this for
a deliberate future decision rather than provisioning a paid service unprompted. Until configured,
the custom-URL fetch improvement above has no visible effect for real users (it now correctly fetches
the page, but the AI step that turns that HTML into job listings still fails) — this is expected and
not a regression.

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
