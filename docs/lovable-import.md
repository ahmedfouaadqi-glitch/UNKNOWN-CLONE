# UNKNOWN — native Lovable-compatible project

This repository now contains the TanStack Start implementation. It is no longer a Next.js ZIP intended for Lovable to rebuild.

## What is active
- TanStack Start SSR and file-based routing under `src/routes`.
- React UI under `src/components`.
- Vite and Tailwind CSS 4.
- Server data functions under `src/lib`.
- TanStack server route adapters under `src/routes/api`.

## How to open in Lovable
Use Lovable's project import / GitHub connection workflow for an existing TanStack Start project. The source code already contains the application framework and route structure; the task is to open and continue this implementation, not to regenerate the app from the previous Next.js code.

## Technical route map
- `src/routes/__root.tsx`: document shell and metadata.
- `src/routes/$locale.tsx`: locale layout.
- `src/routes/$locale.index.tsx`: localized home page.
- `src/routes/$locale.$.tsx`: localized content routes.
- `src/routes/api/$.ts`: API dispatch to the existing validated service handlers.
- `src/lib/server-data.ts`: server functions for reading content.
- `src/components/site-shell.tsx` and `src/components/pages.tsx`: active UI.

## Legacy source
The former Next.js source under `app/`, `components/`, `proxy.ts` and `next.config.ts` is intentionally retained as a reference for migration fidelity. It is not the active runtime and is excluded from the TypeScript build.

## Verification
Run `npm install`, `npm test`, and `npm run build`. A successful build confirms framework compilation and type checking, but does not verify a live Supabase database or end-to-end persistence.
