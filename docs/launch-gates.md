# UNKNOWN — market availability and legal restriction procedure

## Global default

UNKNOWN adopts global website availability by default. No country is geographically blocked merely because it appears in the legal-source register, because a rule is under research, or because a regulator has published a consultation draft. This does not automatically turn on the separate feature that accepts and stores user-generated posts.

The default configuration is:

- `PUBLISHING_ENABLED=false` by default until the separate UGC launch gate is completed.
- `PUBLISHING_BLOCKED_COUNTRIES=`
- `SITE_BLOCKED_COUNTRIES=`

Blank restriction lists mean no country-specific restriction is configured. An unknown GeoIP result is also allowed by default. The global UGC feature flag is independent from these blocklists; `PUBLISHING_ENABLED=false` means users may visit the website globally, but new submissions are not accepted.

## Important legal distinction

Global availability is a product-access policy, not an exemption from law. Statutory duties may apply automatically when their scope and trigger conditions are met; they do not necessarily wait for a regulator's warning or takedown request. The operator must assess applicable proactive duties, including privacy, child protection, registration, licensing, safety and data-security requirements. In Iraq, the CMC framework states that it can cover local and international providers that provide access to users in Iraq (Article 4), may require notification, registration or licensing before service where applicable (Article 5), and sets UGC review, human oversight and appeal duties for covered providers (Article 6.1.2). Obtain a written CMC classification for UNKNOWN before enabling production UGC publishing.

A country-specific restriction is not inferred merely from a law appearing in the legal center. The scope of the law and the actual service must be assessed. Conversely, the absence of an official notice does not suspend duties that already apply.

## Restriction controls

- `PUBLISHING_BLOCKED_COUNTRIES`: denies new post submissions from the listed territories. Reading public pages remains available.
- `SITE_BLOCKED_COUNTRIES`: returns HTTP 451 for all site paths from the listed territories. Use only where a binding measure requires a full site-level restriction.
- Both lists are empty by default.

Use comma-separated ISO 3166-1 alpha-2 codes, such as `IQ,GB`. The token `EU` applies to the 27 EU member states. The token `*` is reserved for a deliberate global suspension. An unknown GeoIP result remains available unless `*` is explicitly configured.

A request for removal of one post or URL should be handled at content level rather than by imposing a country-wide block.

## Duties before and after a request

The operator must comply with directly applicable legal duties whether or not a regulator has contacted the service. A formal request is relevant to determining whether a targeted restriction is legally required; it is not the only event that can trigger compliance.

## Iraq-specific watch

The CMC's Framework Regulations for Digital Platforms and Services and any applicable registration, notification or licensing requirements must be assessed for UNKNOWN as an operator/service. Do not wait for an individual stop notice if a direct statutory requirement already applies. A public consultation document is not itself a final regulation.

## Supabase dependency

The public website may be geographically accessible while the UGC feature remains disabled. Until the dedicated Supabase project is connected and verified, the post API cannot store submissions. Do not set `PUBLISHING_ENABLED=true` until persistence, CMC classification and applicable pre-service steps are resolved, moderation and appeals are operational, and end-to-end storage tests pass.
