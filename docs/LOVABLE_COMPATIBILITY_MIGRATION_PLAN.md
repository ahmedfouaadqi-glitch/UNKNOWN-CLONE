# UNKNOWN — Lovable Compatibility Migration Plan

Source: ahmedfouaadqi-glitch/UNKNOWN
Target: ahmedfouaadqi-glitch/UNKNOWN-CLONE
Baseline: 848afa1c514e1a6ff462496d699959e039df2a43
Date: 2026-11-03

## Guardrails
- Keep TanStack Start, TanStack Router, React and Vite as the active runtime.
- Translate behavior; do not bulk-copy Next.js routes, server actions, metadata or deployment config.
- Do not apply migrations to live Supabase without schema/RLS/grant review and rollback plan.
- Do not enable public publishing or payment collection during this migration.
- Keep service-role keys and secrets server-only.

## Phase 0 — Inventory
- [x] Record source/target commits and target runtime.
- [ ] File-by-file parity matrix for all upstream changed files.
- [ ] Record routes, API contracts, environment variables, schema assumptions, CI and deployment target.
Exit: every upstream file is classified as port, translate, reference-only, defer or reject.

## Phase 1 — Shared UX
- [x] Localized Back control in target.
- [ ] Port the six-step Arabic/English introduction tour.
- [ ] Wire tour into site header and add navigation/write/categories/latest anchors.
- [ ] Test keyboard, mobile, reduced motion, first visit and replay.

## Phase 2 — APIs and data
- [x] Compare source API routes with target adapters; preserve target schema names (posts/comments/reactions/reports) because the checked-in target init migration defines them.
- [x] Make post, comment, reaction, report and delete handlers await rate-limit decisions and distinguish 429 from limiter-unavailable 503.
- [x] Add a shared atomic Supabase rate-limit table/function migration; not applied to any database.
- [x] Add API contract tests for awaited limiter decisions, fail-closed behavior and migration privilege boundaries.
- [ ] Verify RPC behavior/concurrency in disposable staging.
- [ ] Configure and verify the trusted edge client-IP header before enabling public writes; without it, the limiter intentionally fails closed with 503.

## Phase 3 — Rate limits and security
- [x] Ignore caller-controlled forwarded IP headers.
- [ ] Verify host proxy headers and fallback behavior.
- [x] Implement atomic shared limiter in code and add a staging migration (20261103020000_public_rate_limits.sql).
- [ ] Apply and verify the limiter migration in disposable staging; production remains untouched.
- [ ] Review CSRF/origin protections and security headers.
- [ ] Test concurrency, expiry and bypass attempts.

## Phase 4 — Supabase
- [x] Compare the target init migration with the upstream init migration; they are byte-identical and define the legacy table names (posts/comments/reactions/reports).
- [ ] Compare upstream isolated-admin migration with the actual target schema.
- [ ] Verify tables, indexes, constraints, triggers, functions, RLS and grants.
- [ ] Review migration idempotency and rollback.
- [ ] Test in disposable staging; do not assume Git means migration is applied.

## Phase 5 — Admin and moderation (high risk)
- [ ] Port OAuth start/callback, nonce, origin/identity allowlists, session lifecycle and TOTP to TanStack server routes.
- [ ] Keep secrets server-side; review cookie attributes and encryption key handling.
- [ ] Port queue operations with authorization in every handler and audit logs.
- [ ] Test CSRF, replay, brute force, expired sessions and privilege escalation.
- [ ] Keep admin inaccessible until server authorization passes staging tests.

## Phase 6 — Routes, legal and SEO
- [ ] Port story/category/search/latest/report/appeals/moderation/safety/contact/legal page changes.
- [ ] Translate Next metadata, robots and sitemap to TanStack equivalents.
- [ ] Verify canonical origin, locale metadata, indexing exclusions, status codes and 404 behavior.

## Phase 7 — Deployment and validation
- [ ] Keep Vite/TanStack deployment config; do not activate Next.js Docker/config files.
- [ ] Run tests, typecheck, build, Arabic/English route checks and API/security tests.
- [ ] Verify no secrets in repository/client bundle and validate Supabase RLS in staging.
- [ ] Verify production alias/SHA and rollback path.
- [ ] Publish a parity report and list unverified items.

## Order
1. Commit this plan and port low-risk UX changes.
2. Complete parity matrix.
3. Port APIs/data with tests.
4. Review schema and shared rate limits in staging.
5. Port admin authentication only after security/database contracts are confirmed.
6. Validate deployment and publish parity report.

## Not approved here
Production migrations, public publishing, payment collection, Next.js runtime/config replacement, or claims of production readiness without successful tests and staging verification.


## Route parity update — 2026-11-03
- [x] Preserve the localized TanStack catch-all route for source public pages (about, appeals, categories, community, contact, disclaimer, latest, legal, moderation, post detail, privacy, report, safety, search and terms).
- [x] Add search category filtering with an allowlisted category ID, normalized whitespace, invalid-category feedback and category-preserving pagination.
- [x] Add route contract tests for search/category behavior.
- [ ] Complete parity review of page-specific copy and legal jurisdiction details.
- [ ] Add route-level SSR smoke coverage for every public localized route after the deferred server-only runtime issue is resolved.


## SEO route implementation — 2026-11-03
- [x] Add TanStack server route for `/robots.txt` with localized public allow rules and private API/admin disallow rules.
- [x] Add TanStack server route for `/sitemap.xml` covering the source sitemap's 12 public route families in Arabic and English.
- [x] Resolve canonical origin from `SITE_URL` or existing `NEXT_PUBLIC_SITE_URL`, validate HTTP(S), and safely fall back to the source default.
- [x] Add contract tests for robots, sitemap and canonical origin behavior.
- [ ] Verify both endpoints through deployed Lovable hosting and set SITE_URL to the final canonical domain.
- [ ] Add dynamic sitemap entries for individual public posts only if their public indexing policy is approved.


## Admin console migration — implementation checkpoint (2026-11-03)
- [x] Ported admin session primitives to a TanStack-compatible server module (`lib/admin-auth.server.ts`); removed Next.js cookies/runtime dependencies.
- [x] Added server handlers for Manus OAuth start/callback, session inspection, logout/revocation, TOTP enrollment/verification, and moderation queue actions (`lib/admin-api.server.ts`).
- [x] Added explicit API dispatch for the seven admin endpoints in `src/routes/api/$.ts`.
- [x] Ported the Arabic admin moderation UI and styles to `src/components/admin/`; added explicit `/admin` route with noindex metadata.
- [x] Added static contract tests for route coverage, allowlist/origin checks, session revocation, TOTP rate limiting/replay protection, audit logging and no publishing action.
- [ ] Apply and verify the existing UNKNOWN isolated admin schema migration in a dedicated Supabase staging project; not applied by this change.
- [ ] Configure deployment secrets: `MANUS_PROJECT_ID`, `MANUS_JWT_SECRET` (or `JWT_SECRET`), `ADMIN_EMAIL_ALLOWLIST`, `MANUS_OAUTH_PORTAL_URL`, `MANUS_OAUTH_API_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and canonical `SITE_URL` / `ADMIN_ALLOWED_ORIGINS`.
- [ ] Verify OAuth callback against the deployed Lovable domain and run a real TOTP enrollment/login/logout/revocation flow.
- [ ] Verify RLS/grants/function execute privileges in staging before any production rollout.
- [ ] Fix the deferred `server-only` smoke test independently; do not mask the failure.
