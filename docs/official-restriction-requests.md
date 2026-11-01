# UNKNOWN — official restriction request handling

## Purpose

This procedure governs requests from regulators, courts, law-enforcement bodies or other public authorities seeking removal of content, restriction of publishing, or restriction of the entire service in a territory.

Global availability is the default. A message does not create an automatic block. The operator must authenticate the source, determine whether the request is legally binding, and apply only the measure required by its valid scope.

## Intake record

Record the following in a restricted legal register:

- Date/time received and channel.
- Authority name, department, official contact details and jurisdiction.
- Signatory name/title and verifiable authority.
- Official case/reference number.
- Exact legal instrument and provisions relied upon.
- Exact content URLs, accounts/targets, service features, territory and audience covered.
- Requested action, effective date, deadline, duration and appeal/review information.
- Attachments, digital signature or official seal verification evidence.
- Internal decision owner, legal reviewer and final action.

Do not put confidential attachments or personal data into public issue trackers or general application logs.

## Verification

1. Verify the sender through an independently located official domain or telephone directory; do not rely solely on contact details supplied in the request.
2. Validate document signature, seal, case number and the signatory's delegated authority where applicable.
3. Confirm that the authority has legal jurisdiction over the operator, the service, the territory and the subject matter.
4. Determine whether the instrument is binding and enforceable, or merely a voluntary request, consultation document, press release or recommendation.
5. Identify any statutory right to challenge, appeal, clarify or seek a narrower order.
6. Where the legal basis or scope is unclear, seek clarification and local legal advice before making an irreversible or broad restriction, unless an immediately enforceable emergency duty requires action.

## Choose the narrowest required response

| Request scope | Preferred control |
|---|---|
| One post, comment, URL or item | Content-level review/removal; do not block an entire country |
| New submissions only in a territory | Add ISO country codes to `PUBLISHING_BLOCKED_COUNTRIES` |
| Entire site unavailable in a territory | Add ISO country codes to `SITE_BLOCKED_COUNTRIES` |
| Temporary restriction | Record start, expiry/review date and a removal task |
| Worldwide suspension | Use `*` only for an expressly worldwide, enforceable measure |

The `EU` token applies to the 27 EU member states. Other regions must be expanded to the relevant ISO alpha-2 country codes unless a region mapping is explicitly implemented.

A publishing restriction stops new submissions; it does not hide existing public pages. A site restriction returns HTTP 451 for requests routed through the trusted hosting-country header.

## Decision and audit

Before applying a country-level restriction, record:

- The verified request and legal authority.
- The applicable statutory duty or operative section of the order.
- Why the chosen scope is required and why a narrower control is insufficient.
- The country code(s), control name and effective time.
- The approving decision-maker and reviewer.
- The scheduled review/expiry date and any appeal or challenge reference.

After implementation, verify the affected request path from the restricted territory using an authorized test environment. Do not claim a country is blocked based only on a changed environment variable; verify the new deployment and edge behavior.

## Review and removal

Review restrictions when an order expires, is varied, suspended, overturned or withdrawn. Remove the restriction promptly when its legal basis ends. Preserve the audit record according to the applicable retention policy.

## Direct statutory duties

This process does not postpone duties imposed directly by law. Privacy, child-protection, licensing, registration, safety, security, notice-and-action or reporting duties may be triggered by the operator's activities without any authority first sending a stop notice.

## Public transparency

Where legally permitted and safe, publish a periodic aggregate summary of requests received, requests accepted or challenged, and actions taken. Do not expose protected case details, personal data or confidential investigations.
