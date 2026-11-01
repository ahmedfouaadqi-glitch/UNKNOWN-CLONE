# UNKNOWN — Lovable import guide

## Repository purpose
This repository is a source snapshot of UNKNOWN at commit `ed292cd109d9f04ea555b4d8a61e75fd5b80ed88`. It is not a native Lovable project. It preserves the current Next.js App Router implementation as input for Lovable's code-import/rebuild workflow.

## Current Lovable import model
Lovable's documentation distinguishes ZIP code import from Git Sync. ZIP import rebuilds the app on the stack supported by Lovable; it does not simply host this Next.js repository unchanged. New Lovable apps created after 13 May 2026 use TanStack Start. Git Sync creates a new repository and cannot attach an existing repository such as UNKNOWN-CLONE.

Official references:
- https://docs.lovable.dev/introduction/faq
- https://docs.lovable.dev/integrations/github
- https://docs.lovable.dev/integrations/git-sync-overview
- https://lovable.dev/blog/building-apps-using-tanstack-start

## Procedure
1. GitHub → Code → Download ZIP.
2. In Lovable, use the code/project import or upload-code flow and upload the ZIP.
3. Paste the full `LOVABLE_IMPORT_PROMPT.md` into Lovable project chat.
4. Ask Lovable to prepare a route/API migration inventory before broad implementation.
5. Verify feature parity against `docs/implementation-status.md`, `docs/launch-gates.md`, `docs/privacy-architecture.md` and this guide.
6. Once stable, connect GitHub from inside Lovable. It provisions a new Git Sync repository; it will not bind to UNKNOWN-CLONE.

## Migration map
| Current source | TanStack Start target |
|---|---|
| `app/[locale]/**/page.tsx` | File-based routes and loaders |
| `app/api/**/route.ts` | Server routes / server handlers |
| `app/layout.tsx`, `app/globals.css` | Root document, metadata and global styles |
| `proxy.ts` | Server middleware / request gate |
| `next/headers`, `next/navigation`, `next/server` | Request context, cookies and router/server APIs |
| `lib/i18n.ts`, `lib/legal.ts`, `lib/jurisdictions.ts` | Shared modules; preserve content |
| `lib/moderation.mjs`, `lib/publishing-rules.mjs` | Framework-independent rules and tests |
| `supabase/migrations/**` | Schema reference; do not apply automatically |
| `public/brand/**` | Preserve original SVG assets |

## Baseline
- Source repo: https://github.com/ahmedfouaadqi-glitch/UNKNOWN
- Source commit: `ed292cd109d9f04ea555b4d8a61e75fd5b80ed88`
- Stack: Next.js App Router, React, TypeScript, Tailwind CSS, Supabase server-side access.
- Routes: Arabic `/ar`, English `/en`.
- Core flows: anonymous public posts, comments, reactions, search, categories, reports and deletion requests.
- Public policy content includes terms, privacy, disclaimer, community, safety, moderation, appeals information and jurisdiction legal references.

## Important distinctions
A successful code import is not evidence that all features migrated. Rendering is not proof of API persistence. A database integration is not verified until schema, RLS, server-only secrets and end-to-end tests pass. A published page is not legal certification.
