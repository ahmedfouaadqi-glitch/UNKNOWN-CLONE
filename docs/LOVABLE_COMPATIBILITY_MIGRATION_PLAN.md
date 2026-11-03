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
- [ ] Compare all source API routes with TanStack adapters.
- [ ] Port post, comment, reaction, report and delete behavior while preserving validation, status codes, rate limits and deletion tokens.
- [ ] Change table names only after target schema is verified.
- [ ] Add API contract tests.

## Phase 3 — Rate limits and security
- [x] Ignore caller-controlled forwarded IP headers.
- [ ] Verify host proxy headers and fallback behavior.
- [ ] Implement an atomic shared limiter before scaling public submissions.
- [ ] Review CSRF/origin protections and security headers.
- [ ] Test concurrency, expiry and bypass attempts.

## Phase 4 — Supabase
- [ ] Compare upstream migration with the actual target schema.
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
