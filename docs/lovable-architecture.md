# UNKNOWN — Native Lovable-compatible architecture

## Runtime
TanStack Start (React SSR and file-based routing), TanStack Router, React 19, TypeScript, Vite and Tailwind CSS 4. Supabase server-side integration is retained but remains gated until a dedicated project is configured.

## Active entry points
- `src/routes/__root.tsx`: document shell and metadata.
- `src/router.tsx`: router factory.
- `src/routes/$locale.tsx`: localized layout.
- `src/routes/$locale.index.tsx`: home page.
- `src/routes/$locale.$.tsx`: localized content pages.
- `src/routes/api/**`: server routes.
- `src/lib/server-data.ts`: server-only data functions.
- `src/components/**`: active React UI.

Previous `app/`, `components/`, `proxy.ts` and `next.config.ts` files remain as migration reference only and are excluded from the active TypeScript project.

## API routes
The TanStack server endpoint adapters delegate to the existing validated handlers: posts, comments, reactions, reports and deletion. This preserves validation, rate limits, moderation and deletion-token checks.

## Launch gates
- Public browsing is enabled by default.
- `PUBLISHING_ENABLED=false` by default.
- Country blocklists remain empty by default.
- No Supabase project is automatically connected or migrated.
- The service-role key remains server-only.
- Obtain written CMC classification and resolve applicable Iraq pre-service steps before enabling production UGC publishing.

## Commands
```bash
npm install
npm run dev
npm test
npm run build
```


## Updates synchronized from the Next.js source (2026-11-03)
- Added a localized in-page Back control beside headings and story titles. It uses same-origin history when available and falls back to the localized home route.
- Rate-limit keying now accepts only a syntactically valid `CF-Connecting-IP`; caller-controlled `X-Forwarded-For` and `X-Real-IP` are ignored.
- The rate limiter remains process-local in this Lovable port. Do not treat this as distributed protection; implement a shared atomic store and platform edge controls before enabling public submissions at scale.
- Source-only Next.js admin/OAuth/TOTP and Supabase migration changes were not copied into the active TanStack app. They require a separate Lovable-compatible port and explicit database compatibility review.
