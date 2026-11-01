# UNKNOWN privacy architecture

## Product-level design

- No user accounts, public profiles, follower graph or direct messages.
- Approximate country detection is used for welcome text and default locale.
- Detected country is not attached to a post or comment.
- No GPS permission.
- No behavioural advertising or individual sentiment profiling.
- Published content is public and may be copied, captured, indexed elsewhere or redistributed.

## Data processed

- Submitted text, optional title, category, language and timestamps.
- Consent document versions tied to each submission (no account identity).
- Reports and deletion requests, including information voluntarily supplied by the reporter.
- One-way deletion-token hashes.
- Per-post/per-reaction HMAC digest derived from a random session token to reduce duplicates. The digest is scoped to a specific post and reaction, not a global public identity.
- Transient request signals used for rate limiting. The application code does not persist raw IP addresses in PostgreSQL. Hosting/CDN providers may process IPs and maintain their own logs.

## Qualifications

- Reaction session tokens and rate-limit digests are pseudonymous technical signals; do not describe the service as collecting zero identifiers.
- Rate limiting is process-local best effort and must be paired with CDN/WAF controls.
- Supabase service-role access is server-only and bypasses RLS. Strict route validation is required and the key must never be included in browser bundles.
- Public tables enable RLS and grant no direct access to anon/authenticated roles; traffic is server-mediated.
- Vendor log retention, regions, subprocessors and data transfer arrangements are unknown until production providers are configured. Complete the privacy notice with those facts.
