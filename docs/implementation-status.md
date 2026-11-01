# UNKNOWN — implementation status

**Status date:** 1 November 2026  
**Repository:** `ahmedfouaadqi-glitch/UNKNOWN`  
**Default branch:** `main`

This record separates repository implementation from functions verified against live external services.

## Implemented in the repository

- Next.js App Router application with Arabic and English routes.
- Day/light mode as the default, with a user-selectable dark mode.
- Country-aware locale defaults based on hosting edge headers; no GPS permission is requested.
- Responsive layouts covering narrow phones, phones, tablets, laptops, desktop and wide desktop breakpoints.
- Original vector identity and generated PNG app/Apple touch icons.
- Published bilingual terms, privacy notice, anonymous publishing disclaimer and community rules; the temporary legal banner and obsolete edition labels have been removed.
- Legal center with direct official-source links for Iraq, EU, UK, US, Canada, Australia, Brazil, India and Japan. Country pages distinguish binding laws, regulations, official guidance and consultation materials.
- Declared operator/contact details are published in `lib/operator.ts` and displayed on the Contact page: Ahmed Maaroof, Baghdad, Iraq; email and telephone/WhatsApp as supplied by the operator.
- Global website availability is the default. The publishing API and full-site proxy use separate explicit country blocklists, both empty by default. The separate UGC publishing feature remains disabled until explicitly enabled.
- Country restriction rules support ISO alpha-2 codes, the EU-27 region token and an explicit global suspension token; unit tests cover the policy.
- A documented verification process is provided for official restriction requests. The policy does not defer statutory duties that apply automatically.
- Homepage, 14 story categories, latest feed, category feeds, story details and informational/legal pages.
- Anonymous publishing form with terms/privacy/disclaimer consent and a self-declared age confirmation.
- Server API code for posts, comments, reactions, reports and deletion-token validation.
- Direct report links from stories and comments; target type and identifier are prefilled.
- Comment deletion control using the contributor's one-time deletion token.
- Locale switching preserves the current route; mobile and tablet navigation expose accessible states.
- Keyboard skip link, focus-visible affordances and reduced-motion support.
- Search page with Arabic/English text search and category filtering.
- Paginated latest and category feeds, plus reusable pagination that retains search/category parameters.
- Search normalization and validation shared by UI/data/API paths; Unicode and filter-sensitive input tests are included.
- First-pass moderation checks selected compacted spacing/punctuation variants and removes Unicode format controls before rule checks. It remains a deterministic heuristic, not an AI classifier.
- Preparation-only moderation workspace and appeals information pages are present and excluded from indexing. They show no fabricated cases and expose no operational controls.

## CI verification

CI verifies dependency installation, TypeScript typecheck, Node unit tests and a Next.js production build for the commit under test. The corresponding GitHub Actions run is the source of truth for each commit.

CI does not verify a deployed environment, live database, physical-device rendering, end-to-end data persistence, legal compliance, or operational moderation coverage.

## Remaining work before public launch — independent of Supabase

1. Implement server-side moderator authentication, least-privilege roles, MFA and protected case access.
2. Implement real report triage, case state transitions, evidence handling, decision audit log and moderator notifications.
3. Implement the appeal submission/review/notice lifecycle. The current appeals page explains the intended process but does not accept or store appeals.
4. Extend multilingual and Iraqi dialect moderation, adversarial evasion tests and child-safety procedures; establish a staffed escalation operation.
5. Obtain operator-specific legal determinations and any required regulator classification, notification, registration or licence. For Iraq, written CMC service classification is a gate before enabling production UGC publishing; Articles 4–6 of the published framework address scope, regulatory tools and UGC obligations.
6. Supply the full registered/service address where required, production domain, actual infrastructure-provider list and retention schedule.
7. Configure hosting, staging/production separation, CDN/WAF controls, distributed rate limiting, monitoring, alerting and backup/restore drills.
8. Run manual browser and physical-device QA, accessibility audit, load testing and independent security testing.
9. End-to-end verify publishing, comments, reactions, reports, deletion, search and pagination after persistent storage is connected.

## Supabase — deliberately deferred to the final stage

At the user's direction, Supabase provisioning and connection are postponed until the other feasible work is complete. The repository contains an initial server-only client and migration, but:

- No dedicated UNKNOWN Supabase project has been provisioned.
- The migration has not been applied to a live project.
- RLS, grants and service-role access have not been tested against a live database.
- Posts, comments, reactions, reports, deletion, search and pagination have not been verified against persistent storage.
- Moderator case management and appeals cannot become operational before their storage and authentication boundaries are implemented and verified.

Final Supabase stage: confirm project cost and region; provision a dedicated project; apply and audit the migration; verify RLS, grants and sequences; configure server-only secrets; add the required case and appeal persistence; test each data flow end to end; then test backups and restore. Do not reuse an unrelated project.

## Geographic availability defaults

- `PUBLISHING_ENABLED=true`
- `PUBLISHING_BLOCKED_COUNTRIES=` (empty by default)
- `SITE_BLOCKED_COUNTRIES=` (empty by default)

The first list blocks new submissions only; the second blocks all site paths. Add a jurisdiction only after a documented assessment of a valid legal basis and the exact scope of the measure. A successful CI run is not a public launch approval.
