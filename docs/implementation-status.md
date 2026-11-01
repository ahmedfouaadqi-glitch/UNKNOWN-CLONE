# UNKNOWN — implementation status

**Status date:** 1 November 2026  
**Repository:** `ahmedfouaadqi-glitch/UNKNOWN-CLONE`  
**Runtime:** TanStack Start + React + TypeScript + Vite  
**Default branch:** `main`

This document distinguishes code present in the repository from behaviour verified against live services.

## Framework migration

The active application has been rebuilt on TanStack Start:
- Vite configuration uses the TanStack Start plugin, React plugin and Tailwind CSS Vite integration.
- Application routes live under `src/routes`; the localized layout supports Arabic and English.
- The root route provides the SSR document shell and metadata.
- Server data reads use TanStack server functions in `src/lib/server-data.ts`.
- API requests are exposed through a TanStack Start server route in `src/routes/api/$.ts`, which delegates to the existing validated service handlers.
- The active React UI is under `src/components`.
- The former Next.js files in `app/`, `components/`, `proxy.ts` and `next.config.ts` are retained as migration references only and excluded from the active TypeScript project.

## Implemented in the active application

- Bilingual Arabic/English route structure, RTL/LTR wrapper, language switch and browser-language landing selection.
- White/day theme by default, with a user-selectable dark theme persisted in browser storage.
- Responsive navigation and the original UNKNOWN pencil-line brand assets.
- Homepage, writing panel, category index, latest feed, category feeds, story details and search page.
- About, terms, privacy, disclaimer, community, contact, legal center and jurisdiction-source pages.
- Safety, moderation, reporting and appeals information pages.
- Server-side data reads call the original Supabase-backed content functions; when the database is not configured, lists are empty rather than filled with fabricated content.
- TanStack API route adapter retains original post, comment, reaction, report and deletion handlers. These retain input validation, rate limits, moderation decisions and deletion-token checks.
- Original moderation and publishing-rule unit tests remain in place; architecture regression tests verify the active TanStack stack and launch defaults.
- Operator details and verified contact channels are sourced from `lib/operator.ts`.
- Public site access remains geographically open by default; the separate UGC publishing gate remains disabled by default.

## Not yet verified / remaining work

- The TanStack implementation has not yet been confirmed by a successful latest GitHub Actions production build. See the current workflow run linked from the repository Actions tab.
- No live Supabase project is connected. Persistent posts, comments, reactions, reports, deletion and database-backed search have therefore not been end-to-end verified.
- The current writing panel is deliberately disabled while `PUBLISHING_ENABLED=false`; it is not presented as an operational publishing service.
- Report intake and appeals review are not a staffed operational workflow.
- Moderator authentication, roles, MFA, protected case management, audit history and notifications are not implemented.
- The active story view includes anonymous comments, three reaction types, deletion-by-private-code and reporting UI. Server handlers are connected; storage-dependent actions are disabled at the UI when no database is configured, and publishing/reactions/comments remain feature-gated.
- Browser-language detection at the root currently selects Arabic or English from `navigator.language`; country-aware server-side locale defaults still need implementation in the TanStack request context.
- Manual testing on physical phones/tablets, browser accessibility audit, load testing and independent security testing remain outstanding.
- Legal pages and official-source links do not certify legal compliance or regulator approval.
- For Iraq, written CMC service classification and any applicable notification, registration or licensing steps remain prerequisites before enabling production UGC publishing.

## Supabase — deliberately deferred

- No dedicated UNKNOWN Supabase project has been provisioned.
- The SQL migration has not been applied to a live project.
- RLS, grants and service-role access have not been tested against a live database.
- The service-role key must stay server-side and must never be exposed via a `VITE_*` variable.
- Do not reuse an unrelated Supabase project.

## Geographic and publishing defaults

- `PUBLISHING_ENABLED=false`
- `PUBLISHING_BLOCKED_COUNTRIES=` (empty by default)
- `SITE_BLOCKED_COUNTRIES=` (empty by default)

Global website availability is distinct from acceptance and persistence of user-generated content. Directly applicable legal duties remain in force regardless of whether an authority has sent a notice.
