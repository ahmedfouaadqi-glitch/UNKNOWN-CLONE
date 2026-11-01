# Lovable migration brief — UNKNOWN

Rebuild this imported UNKNOWN anonymous-expression platform on Lovable's currently supported stack (new projects use TanStack Start, React and TypeScript). This is a controlled migration, not a new product design. The imported Next.js source is the source of truth for behaviour, copy, legal material, styles, SQL schema and business rules. Do not run Next.js files unchanged.

## Preserve the product
- Brand UNKNOWN / غير معروف, supplied pencil-line SVG identity, calm editorial layout and original design tokens.
- White/day theme is the default; dark theme remains user-selectable.
- Arabic and English routes under /ar and /en; Arabic RTL, English LTR, responsive mobile/tablet/desktop.
- Homepage, categories, latest feed, category feed, story detail, search, anonymous publishing UI, comments, reactions, reports, deletion, about, contact, safety, moderation, appeals information, disclaimer, terms, privacy, community, legal center and jurisdiction pages.
- No public profiles or required public accounts. No fabricated stories, counters, comments, testimonials or search results. Empty states must be honest.
- Preserve source legal wording and distinguish enacted law, regulation, official guidance and consultation. Never claim legal compliance or regulatory approval without evidence.

## Architecture migration
- Move Next.js App Router pages to TanStack Start file-based routes and loaders.
- Move Next route handlers to server-only TanStack Start handlers for /api/posts, /api/posts/:id/comments, /api/posts/:id/reactions, /api/reports and /api/delete.
- Replace next/link, next/navigation, next/headers, next/server and Next metadata with supported equivalents.
- Port proxy.ts site restriction policy using trusted hosting country headers only; unknown GeoIP must not itself block access.
- Keep Supabase access server-only. Preserve SQL migrations as references; do not execute or create/connect a database automatically.
- Preserve moderation and publishing gate modules as independently testable code.

## Non-negotiable launch gates
- PUBLISHING_ENABLED=false by default. Public browsing remains globally available while user-generated submissions remain disabled.
- PUBLISHING_BLOCKED_COUNTRIES and SITE_BLOCKED_COUNTRIES stay empty by default. Do not pre-emptively block countries.
- A publishing-only restriction is distinct from a whole-site 451 restriction.
- Do not reuse or modify unrelated Supabase projects. No secret/service-role key may appear in client bundles or Git.
- Do not claim persistence, reports, comments, deletion or reactions work unless their backend is genuinely connected and tested.
- Iraq: written CMC service classification and applicable pre-service steps are required before production UGC publishing is enabled.

## Required checks
1. Produce a complete source-route to migrated-route inventory.
2. Produce an API endpoint migration inventory.
3. Verify Arabic RTL, English LTR, light default, dark toggle and mobile layout.
4. Verify no fabricated data and publishing disabled by default.
5. Verify secrets remain server-side.
6. Port and run moderation, publishing-gate and search tests; add route/API tests.
7. Report every missing feature. Rendering pages alone is not migration completion.
8. Do not publish publicly or connect/change Supabase without explicit authorization.

Work in small groups: design/locale shell; public content routes; story/search; server APIs; safety and launch gates; legal/contact pages; tests. Do not delete source files or simplify policy content merely to make the generated app compile.
