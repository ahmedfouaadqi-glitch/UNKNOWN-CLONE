# UNKNOWN — moderation operations runbook (draft)

This runbook defines the minimum operating procedure to implement before public publishing is enabled. It is a design specification, not evidence that a staffed moderation team or a case-management system currently exists.

## Current capability boundary

The repository includes a deterministic first-pass text filter and a public report submission route. The filter removes selected Unicode formatting characters, normalizes Arabic diacritics/tatweel and checks a limited set of English/Arabic threat, self-harm, personal-data and abuse patterns. Selected spacing and punctuation obfuscation is covered by unit tests.

This remains a heuristic. It is not an AI safety classifier, does not reliably detect every language, dialect or evasion technique, and does not replace human review. No secure moderator dashboard, authenticated moderator roles, case queue, appeal workflow or staffed 24/7 response operation is currently deployed.

The `/[locale]/moderation` route is a preparation-only screen. It intentionally shows no case records and provides no operational decision controls. The `/[locale]/appeals` route explains the intended appeal lifecycle but does not collect or store appeal submissions.

## Case lifecycle to implement

1. **Received:** validate the target and reason, assign a reference, record the minimum information needed to investigate.
2. **Triage:** classify the concern by severity and identify any immediate safety or legal escalation requirement.
3. **In review:** restrict access to the case to authorized reviewers; do not expose reporter details publicly.
4. **Decision:** document the rule or legal basis, action, reviewer, timestamp and rationale.
5. **Notice:** provide the appropriate outcome notice where required by the applicable market's law and policy.
6. **Appeal:** allow an affected contributor to request reconsideration, route it to a reviewer who was not the original decision-maker where operationally feasible, and record the final result.
7. **Closed:** preserve only the records needed for safety, legal accountability and the approved retention policy.

Allowed decision outcomes should be explicit: no action, warning, temporary restriction, removal, or referral to a competent authority when legally required and appropriate. Do not create an outcome that the platform cannot actually enforce.

## Severity model to configure

- **Critical:** credible imminent threats, child sexual exploitation, or other material indicating immediate danger. Apply the approved safety escalation procedure immediately; do not promise a response time until staffing and coverage are real.
- **High:** doxxing, targeted threats, non-consensual intimate material, serious harassment or suspected illegal content. Restrict exposure where justified and route to an authorized reviewer.
- **Standard:** bullying, personal attacks, spam, disputed claims or other community-rule concerns. Review against published rules and applicable law.
- **Low:** non-safety feedback, duplicate reports or general questions. Route to ordinary support.

The operator must set service hours, escalation ownership, response targets and local reporting obligations before launch. This runbook deliberately does not invent an SLA.

## Evidence and privacy controls

- Store a case reference and only the evidence necessary to assess the report.
- Do not store passwords, unrelated identity documents or unnecessary personal details.
- Keep raw IP addresses out of application moderation tables unless a documented legal and security basis requires specific processing.
- Separate reporter information from public content.
- Restrict moderator access by role and record privileged reads and decisions.
- Protect child-safety reports and highly sensitive evidence with stricter access controls.
- Never put raw report details or submitted content into general application logs.

## Appeals requirements

The implementation needs an appeal reference, the challenged decision, a reason for appeal, submission and decision timestamps, reviewer identity, outcome, rationale and a link to the original case. Duplicate or abusive appeals should be handled under a published policy without removing access to legally required complaint channels.

No appeal form should be advertised as operational until the submission endpoint, persistence, reviewer access, notices and retention controls have been tested. The current appeals page is informational only.

## Launch gate

Do not enable public publishing in a market until the operator has:

- designated accountable safety and legal owners;
- established staffing and escalation coverage appropriate to the service and law;
- deployed authenticated, least-privilege case access;
- tested report, removal, notice and appeal flows end to end;
- validated moderation behaviour in Arabic, English and the dialects actually supported;
- published accurate contact channels and response information;
- approved evidence retention and deletion controls.
