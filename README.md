# UNKNOWN — غير معروف

**Native Lovable-compatible application built with TanStack Start.**

**Tagline (AR):** قل ما بداخلك، دون أن تكشف من أنت.  
**Tagline (EN):** Say what you feel. Stay unnamed.

## Framework

- TanStack Start with React SSR and file-based routing.
- TanStack Router for localized routes and server endpoints.
- React 19, TypeScript, Vite and Tailwind CSS 4.
- Supabase server-side client, gated until a dedicated database is configured.

The active application is under `src/`. Previous Next.js files in `app/`, `components/`, `proxy.ts` and `next.config.ts` are retained only as migration reference and excluded from the active TypeScript build.

## Local development

Requires Node.js 22.16 or later.

```bash
npm install
npm run dev
```

Verification:

```bash
npm test
npm run build
```

## Routes

Arabic and English routes:
- `/ar`, `/en`
- `/:locale/latest`
- `/:locale/categories`, `/:locale/categories/:category`
- `/:locale/search`
- `/:locale/p/:id`
- `/:locale/about`, `terms`, `privacy`, `disclaimer`, `community`, `contact`
- `/:locale/legal`, `/:locale/legal/:country`
- `/:locale/safety`, `moderation`, `report`, `appeals`

Light mode is the default; dark mode is optional. Arabic uses RTL and English uses LTR.

## Server API

- `GET|POST /api/posts`
- `GET|POST /api/posts/:id/comments`
- `GET|POST /api/posts/:id/reactions`
- `POST /api/reports`
- `POST /api/delete`

TanStack Start server routes delegate to the existing validated handlers, preserving moderation, rate limiting and deletion-token logic.

## Database and launch gates

The site renders without database credentials. No database project is connected by this repository.

- Create a dedicated Supabase project only when explicitly authorized.
- Configure `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `RATE_LIMIT_SECRET` as server environment variables.
- Apply `supabase/migrations/20261101000100_unknown_init.sql` only after reviewing the target project.
- Never expose the service-role key to browser code.
- `PUBLISHING_ENABLED=false` by default. Public browsing and UGC publishing are separate capabilities.
- Geographic restriction lists remain empty by default.
- Obtain written CMC service classification and resolve any applicable Iraq pre-service requirements before production UGC publishing.

## Documentation

- `docs/lovable-architecture.md`
- `docs/implementation-status.md`
- `docs/launch-gates.md`
- `docs/moderation-operations.md`
- `docs/legal-review-required.md`
- `docs/privacy-architecture.md`
- `docs/official-restriction-requests.md`
- `docs/brand-guidelines.md`
