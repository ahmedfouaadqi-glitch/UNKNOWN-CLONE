# UNKNOWN Upstream-to-Lovable Parity Matrix

**Source commit:** 69b6f8e141419defb74ff8ce7fd0e3274c0977ef  
**Target baseline before migration:** 848afa1c514e1a6ff462496d699959e039df2a43  
**Target current checkpoint:** 3d193f2531546bda003221825933238e80511e28

Legend: **PORTED** = adapted in active TanStack app; **PARTIAL** = only selected behavior or styling is present; **PENDING** = not yet translated/verified; **REFERENCE ONLY** = source framework configuration should not become active target configuration; **REVIEW REQUIRED** = requires security/schema/hosting validation.

| Upstream file or group | Classification | Target action / evidence |
|---|---|---|
| components/page-back-button.tsx | PORTED | Shared back control behavior is present in active content UI. |
| components/page-title.tsx | PARTIAL | Page heading/back affordance adapted to existing PageHeading component; verify every page. |
| components/intro-tour.tsx | PORTED, NOT YET BUILD-VERIFIED | Adapted as src/components/intro-tour.tsx; connected to active site header and home section targets. |
| components/site-header.tsx | PARTIAL | Tour trigger and navigation target adapted in src/components/site-shell.tsx; verify all upstream header changes. |
| app/globals.css | PARTIAL | Back and tour styles selectively adapted in src/styles.css; full style diff still required. |
| app/[locale]/appeals/page.tsx | PENDING | Translate page content and metadata to target route model. |
| app/[locale]/categories/page.tsx | PENDING | Translate updated heading/content behavior. |
| app/[locale]/categories/[category]/page.tsx | PENDING | Translate category detail/list behavior. |
| app/[locale]/contact/page.tsx | PENDING | Compare contact information and page heading. |
| app/[locale]/latest/page.tsx | PENDING | Compare listing/page heading behavior. |
| app/[locale]/legal/[country]/page.tsx | PENDING | Port country-specific legal content and route behavior. |
| app/[locale]/moderation/page.tsx | PENDING | Translate moderation information page; do not confuse with operational moderation tooling. |
| app/[locale]/p/[id]/page.tsx | PARTIAL | Back affordance exists; compare remaining story metadata/content/actions. |
| app/[locale]/report/page.tsx | PENDING | Port report form details and target query parameters. |
| app/[locale]/safety/page.tsx | PENDING | Translate safety content. |
| app/[locale]/search/page.tsx | PENDING | Translate metadata and search UX changes. |
| app/api/delete/route.ts | PARTIAL / REVIEW REQUIRED | Target handler now awaits shared limiter and distinguishes unavailable service; target schema names retained. Verify delete-token behavior and staging RPC. |
| app/api/posts/[id]/comments/route.ts | PARTIAL / REVIEW REQUIRED | Awaited rate-limit decision added; uses target schema table names comments/posts from target init migration. Remaining validation/status parity and staging verification pending. |
| app/api/posts/[id]/reactions/route.ts | PARTIAL / REVIEW REQUIRED | Awaited rate-limit decision added; uses target schema reactions table. Verify target schema and staging RPC. |
| app/api/posts/route.ts | PARTIAL / REVIEW REQUIRED | Awaited rate-limit decision added; target schema posts retained. Remaining contract tests and staging verification pending. |
| app/api/reports/route.ts | PARTIAL / REVIEW REQUIRED | Awaited rate-limit decision added; target schema reports/posts/comments retained. Remaining contract tests and staging verification pending. |
| app/admin/page.tsx | PENDING — HIGH RISK | Rebuild as TanStack route only after server-side auth design is reviewed. |
| app/api/admin/auth/start/route.ts | PENDING — HIGH RISK | Translate OAuth flow and origin/nonce checks. |
| app/api/admin/auth/callback/route.ts | PENDING — HIGH RISK | Translate callback/session handling; verify CSRF, allowlist and cookie properties. |
| app/api/admin/logout/route.ts | PENDING — HIGH RISK | Translate revocation and cookie clearing. |
| app/api/admin/mfa/setup/route.ts | PENDING — HIGH RISK | Translate TOTP enrollment and encrypted secret storage. |
| app/api/admin/mfa/verify/route.ts | PENDING — HIGH RISK | Translate TOTP verification, replay protection and rate limiting. |
| app/api/admin/queue/route.ts | PENDING — HIGH RISK | Translate queue access and mutation with authorization inside handler. |
| app/api/admin/session/route.ts | PENDING — HIGH RISK | Translate session state endpoint with no-store semantics. |
| components/admin/admin-panel.tsx | PENDING — HIGH RISK | Rebuild admin interface in active app after server auth endpoints are ready. |
| components/admin/admin-panel.module.css | PENDING | Adapt styles to target styling conventions. |
| lib/admin-auth.ts | PENDING — HIGH RISK | Translate server-only auth/session logic; do not import Next cookies APIs. |
| lib/totp.mjs and tests/totp.test.mjs | PENDING | Review portability and tests; integrate only with secure server implementation. |
| supabase/migrations/20261103012035_unknown_isolated_admin.sql | REVIEW REQUIRED — NOT APPLIED | Review schema, RLS, grants, triggers, functions and rollback in a disposable staging project. |\n| supabase/migrations/20261103020000_public_rate_limits.sql | ADDED — NOT APPLIED | Adds atomic public rate-limit table/function using the target's existing legacy content tables; staging review and concurrency tests required. |
| lib/rate-limit.ts | PARTIAL / REVIEW REQUIRED | Uses HMAC subject keys and atomic Supabase RPC; fail-closed on missing RPC/config. Migration added but not applied; server-only import issue intentionally deferred per user instruction. |
| lib/rate-limit-key.mjs and tests/rate-limit-key.test.mjs | PARTIAL | Target has related trusted-header logic; tests/build must be run against active app. |
| lib/content.ts | REVIEW REQUIRED | Compare source table names/queries to src/lib/server-data.ts and active Supabase schema. |
| lib/supabase-admin.ts | REVIEW REQUIRED | Source hard-coded Supabase endpoint must not be copied blindly; confirm target connection and secret handling. |
| app/layout.tsx | PARTIAL | Translate metadata base, document head and locale behavior to root/route head config. |
| app/robots.ts | PENDING | Create compatible robots route and validate admin/API exclusions. |
| app/sitemap.ts | PENDING | Create compatible sitemap route; validate locale paths, canonical host and indexability. |
| .env.example | REFERENCE / REVIEW REQUIRED | Translate variable names only after inspecting target runtime; never copy secret values. |
| .gitignore | PENDING | Merge harmless ignore additions if relevant to target tooling. |
| .dockerignore, Dockerfile | REFERENCE ONLY | Do not activate Next.js Docker build; use actual Lovable/TanStack deployment target. |
| app.config.ts, public/manus-routes.json | REVIEW REQUIRED | Determine whether target platform consumes these files; do not assume. |
| package.json, package-lock.json | REFERENCE ONLY | Keep target TanStack/Vite dependency graph and lockfile; do not replace with Next.js dependencies. |
| next.config.ts, next-env.d.ts, tsconfig.json | REFERENCE ONLY | Do not copy Next.js configuration into active TanStack project. |
| docs/PROPOSED_MARJEYA_RLS_HARDENING.sql | REVIEW REQUIRED | Review ownership and applicability; never execute against an unrelated project. |
| docs/ROADMAP_REVIEW.md, docs/UPSTREAM_SYNC_REVIEW.md, docs/legal-source-review.md | PENDING | Review and port useful project facts without importing stale claims. |
| docs/upstream-sync.json, TODO.md, plan.md | PARTIAL / PENDING | Preserve useful provenance and update migration status. |
| package manager metadata | REFERENCE ONLY | Keep target package manager consistent with Lovable's current setup. |

## Current execution checkpoint

Completed in target:
- Migration plan committed.
- Bilingual six-step tour component added.
- Tour trigger connected to site shell.
- Navigation, write, categories, and latest targets added.
- Tour styles added.

Not yet verified:
- Latest CI for commit 3d193f2531546bda003221825933238e80511e28 is still running at time of this update.
- Production build and TypeScript checks.
- Tour behavior in browser and keyboard/mobile accessibility.
- API/data parity, Supabase schema/RLS, admin auth, robots/sitemap, and deployment.
