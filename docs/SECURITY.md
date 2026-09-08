# Melbourne Photobooth Hire — Security Requirements and Constraints

## 1. Purpose and Scope

This document is the authoritative security requirements and constraints specification for the Melbourne Photobooth Hire project. It answers:

> **What security properties must the system uphold, where are the trust boundaries, what is enforced versus deferred, and what remains unconfirmed?**

This is a documentation/specification task only. This document defines **requirements, principles, boundaries, and confirmation status**. It does not define:

- Final authentication flows, session shapes, or user fields.
- Roles, permission hierarchies, or authorization matrices.
- SQL, migrations, tables, columns, policies, grants, or constraints.
- Endpoint URLs, methods, payloads, response schemas, or status codes.
- Credentials, keys, IDs, email addresses, URLs, or configuration values.
- Environment variable names or environment file contents.
- Bucket names, storage policies, file limits, MIME restrictions, or access rules.
- Sanitization libraries, logging platforms, retention periods, or browser-security policy values.
- Final page copy, business claims, prices, policies, or contact details.
- Source code or component implementations.

This is a greenfield project. This document describes the **intended security direction**, not implemented controls. Implementation status must be confirmed from the repository.

Source context (authoritative for their respective concerns):

- `AGENTS.md` — development rules and scope control.
- `README.md` — repository orientation.
- `docs/PROJECT.md` — product and business context.
- `docs/REQUIREMENTS.md` — functional and business requirements.
- `docs/TECH-STACK.md` — technology choices and technical constraints.
- `docs/ARCHITECTURE.md` — application architecture and code organization.
- `docs/UI-UX.md` — user experience and interaction requirements.
- `docs/DESIGN-SYSTEM.md` — visual and component design rules.
- `docs/DATA-MODEL.md` — database structure and data relationships (conceptual level).
- `docs/API.md` — API and external service contracts (conceptual behavior and boundaries).

Where this document and `docs/REQUIREMENTS.md` disagree on required behavior, `docs/REQUIREMENTS.md` governs what the system must do and the discrepancy should be resolved explicitly. Where this document and `docs/PROJECT.md` disagree on business context, `docs/PROJECT.md` is authoritative.

### 1.1 Security principles

1. **Practical and proportionate security.** Controls match the agreed scope: a marketing website, a scoped CMS, and an inquiry/request workflow. Security must not introduce unnecessary infrastructure, services, dependencies, or complexity, consistent with the fixed **₱15,000** project constraint.
2. **Deny by default for privileged operations.** Public visitors are anonymous and have no CMS capability. CMS operations require authenticated and authorized access enforced server-side.
3. **Server-side enforcement.** Client-side checks (validation feedback, route hiding, challenge rendering) are usability layers only. They are never security boundaries.
4. **Least exposure.** Collect only confirmed/necessary data, expose only intentionally published content, return only limited non-technical errors, and log only what is appropriate without secrets or unnecessary personal data.
5. **Secrets stay out of source and out of the browser.** No secrets in code, Git history, client bundles, logs, errors, or public responses.
6. **Fail safely.** Failures never report false success, never expose internals, and preserve admin/content data when integrations fail.
7. **Conditional stays conditional.** Inquiry persistence, analytics, structured-data extensions, and any unconfirmed control exist only on explicit confirmation. Absence of confirmation means absence of the behavior.
8. **AI-generated code is untrusted until reviewed and verified.** Per `AGENTS.md`, generated code must be inspected against this document and the source documents, and validated at an appropriate level before it is treated as correct. Convenience or plausibility never overrides verification.

### 1.2 Status labels

- **Confirmed** — established by existing project documentation cited in the relevant section.
- **Conditional** — exists only if a separately confirmed requirement activates it. Must not be implemented by default.
- **Confirmation Required** — depends on client/business confirmation. Must not be treated as final behavior, configuration, or policy.
- **Reference-Only** — originates from the previous Shot&Prints website/material. Historical context only; never current project data.

No statement in this document introduces a new Confirmed business fact or technical decision beyond what the source documents already establish.

---

## 2. Authentication

- **Foundation is Confirmed:** Supabase Auth is the authentication foundation for CMS/admin access (`docs/TECH-STACK.md` Section 11; `docs/ARCHITECTURE.md` Section 12; `docs/DATA-MODEL.md` Section 12).
- **Public visitors remain anonymous.** Customers browse public content and use the inquiry submission boundary only. They hold no authenticated session and gain no admin capability (`docs/ARCHITECTURE.md` Section 12; `docs/DATA-MODEL.md` Section 13).
- **Admin access requires secure authentication.** Unauthenticated users must not access CMS functionality (REQ-CMS-002; REQ-SEC-001). There is no anonymous, shared, or implicit path into CMS operations.
- **No custom identity system.** No separate authentication service, self-built password store, or parallel session mechanism is part of this project. A change would require a confirmed requirement and a decision recorded in `docs/DECISIONS.md` once it exists.
- **What is not defined here:** final authentication flow, session handling, invite/provisioning behavior, password or recovery behavior, token handling, timeout behavior, or any user fields. No roles, permission hierarchies, or authentication flows are invented. Final flow detail is **Confirmation Required** (see Section 20).

---

## 3. Authorization

- **CMS operations require authenticated and authorized access.** Authenticated actions must respect authorization rules so only permitted users can view or modify content (REQ-CMS-003; REQ-SEC-002).
- **Authorization is enforced server-side.** Every CMS content read/write and media operation is subject to server-side authorization. Client-side route protection, hidden navigation, or obscured paths are not security boundaries (`docs/ARCHITECTURE.md` Sections 11–12; `docs/API.md` Section 12; `docs/DATA-MODEL.md` Section 13).
- **Admin data is never exposed through public content paths.** Draft, unpublished, or CMS-internal state, admin identities and sessions, authorization internals, and stored inquiry records (if the Conditional persistence is ever confirmed) never appear in public output (`docs/DATA-MODEL.md` Section 10.2; `docs/API.md` Section 14).
- **Public rendering consumes only intentionally published, client-confirmed content** retrieved and rendered server-side into crawlable HTML (`docs/ARCHITECTURE.md` Section 7; `docs/API.md` Section 14).
- **What is not defined here:** any role model, permission set, hierarchy, or grant structure. No roles or permissions are invented. The authorization/role model is **Confirmation Required** (see Section 20).

---

## 4. Supabase / RLS Principles

Supabase provides PostgreSQL, Auth, and Storage as the application data foundation. PostgreSQL stores confirmed CMS content and, only if explicitly confirmed, inquiry records (`docs/TECH-STACK.md` Section 9; `docs/ARCHITECTURE.md` Sections 10, 13; `docs/DATA-MODEL.md` Section 11).

Security principles (no implementation defined):

1. **Authorization must prevent unauthorized access or modification.** Supabase access control must ensure public retrieval cannot bypass CMS authorization to reach raw CMS data (REQ-SEC-002; REQ-CMS-003; `docs/ARCHITECTURE.md` Section 13).
2. **Public access is limited to published output.** Public callers never interact directly with CMS data, admin routes, or secrets; they receive only intentionally published HTML plus the inquiry submission boundary (`docs/ARCHITECTURE.md` Section 5; `docs/API.md` Section 13).
3. **All CMS writes go through authenticated, authorized operations with validation** (`docs/ARCHITECTURE.md` Section 13; `docs/API.md` Section 13).
4. **Conditional inquiry records, if ever stored, are admin-only.** No public read path to stored inquiries is part of the model (`docs/DATA-MODEL.md` Sections 10.2, 11, 13).
5. **Principles only — no policies defined.** This document defines security principles, not actual SQL policies. No tables, policies, roles, grants, columns, constraints, or access-rule implementations are invented. Exact RLS policies are **Confirmation Required** (see Section 20).

---

## 5. Inquiry Security

The inquiry system is an inquiry/request workflow, not a reservation, payment, or CRM platform (REQ-INQ-001, REQ-INQ-020; `docs/PROJECT.md` Section 10).

1. **Validate all incoming inquiry data server-side.** Server-side validation at the Astro Server Endpoint boundary is the enforcement layer; client-side validation is usability only (REQ-SEC-003; REQ-INQ-012; `docs/ARCHITECTURE.md` Section 14; `docs/API.md` Sections 4, 16).
2. **Collect only confirmed/necessary personal information.** No additional personal-data fields beyond what is confirmed may be introduced without justification (REQ-INQ-011). The final inquiry field set and required-versus-optional designation are **Confirmation Required** (REQ-INQ-008 through REQ-INQ-010).
3. **Cloudflare Turnstile must be verified server-side** before a submission is treated as legitimate (see Section 6).
4. **Prevent duplicate submissions and abuse where supported by existing requirements.** The form shows a submission-in-progress state and prevents duplicate submissions while processing (REQ-STA-003; `docs/API.md` Section 8). Numeric rate limits, quotas, retry limits, idempotency keys, or deduplication windows are not established by any existing document and are **Confirmation Required**, not invented (see Sections 14 and 20).
5. **Email delivery occurs only after appropriate validation and spam verification.** Only validated, spam-verified submissions reach delivery; success feedback is reported only when the inquiry has been accepted for delivery to the client's Gmail (REQ-INQ-018; `docs/ARCHITECTURE.md` Sections 9, 15; `docs/API.md` Sections 5, 10).
6. **Do not expose customer data unnecessarily.** Inquiry data appears only where required for delivery and business follow-up. It never appears in public output, user-facing errors, logs beyond appropriate server-side diagnostics, or any unconfirmed persistence. Conditional persistence remains conditional (see Section 20 and `docs/DATA-MODEL.md` Section 11).

---

## 6. Turnstile

Cloudflare Turnstile is the Selected spam-protection direction for the inquiry form (REQ-INQ-017, REQ-SEC-007; `docs/TECH-STACK.md` Section 14; `docs/ARCHITECTURE.md` Section 16; `docs/API.md` Section 9).

1. **Client-side challenge is not sufficient.** Rendering or completing the challenge in the browser is a usability/evidence-collection step only.
2. **The server verifies the submitted verification evidence.** The Astro Server Endpoint verifies the evidence server-side where applicable before the submission is treated as legitimate and passed to delivery.
3. **Secrets remain server-side.** Verification secrets stay in server-side environment-appropriate configuration and never appear in client-side source or the repository (REQ-INQ-019, REQ-SEC-005, REQ-SEC-006).
4. **Failure is non-technical.** Spam-verification failure rejects the submission with a clear, non-technical message and reasonable next-step guidance, without exposing verification internals, mechanisms, or diagnostics (`docs/UI-UX.md` Section 14.7; `docs/API.md` Section 7).
5. **Nothing invented.** No keys, endpoints, thresholds, scores, parameters, environment variable names, or credentials are documented or assumed. Turnstile configuration is **Confirmation Required** to the extent not already established — and no such detail is established by any existing document (see Section 20).

---

## 7. EmailJS / Gmail

EmailJS is the Selected delivery service; the client Gmail is the Selected destination (REQ-EML-001 through REQ-EML-004, REQ-INQ-002; `docs/TECH-STACK.md` Section 13; `docs/ARCHITECTURE.md` Section 15; `docs/API.md` Section 10).

1. **Delivery boundary:** the Astro Server Endpoint invokes delivery for validated, spam-verified submissions without exposing sensitive configuration to the browser (REQ-INQ-019; `docs/API.md` Section 10).
2. **Destination boundary:** the client Gmail is the mailbox where the business receives the inquiry with sufficient detail to follow up (REQ-EML-002). Follow-up happens outside the application.
3. **Consistency rule:** the customer-facing success signal and business-facing delivery stay consistent — success feedback implies the inquiry was accepted for delivery; delivery failure produces a clear error, not a false success (REQ-INQ-018).
4. **Sensitive configuration must not be exposed unnecessarily.** Anything sensitive stays server-side and out of client bundles, logs, errors, and the repository (REQ-SEC-005, REQ-SEC-006).
5. **Public client-side configuration versus secrets:** to the extent implementation places any non-sensitive configuration where the browser can see it, that material must be treated as public by design and must never carry secrets, private keys, or credentials. This paragraph states the principle only; it makes no claim about which specific configuration values are public or secret, because no such detail is established by the source documents.
6. **Nothing invented.** No email addresses, service/template identifiers, template content, parameters, sender/recipient configuration, credentials, or configuration values are documented or assumed. EmailJS configuration is **Confirmation Required** (see Section 20). No alternative provider is introduced.

---

## 8. Secrets and Environment Configuration

Per REQ-SEC-001, REQ-SEC-005, REQ-SEC-006, REQ-INQ-019, and the environment boundaries in `docs/TECH-STACK.md` (Section 20) and `docs/ARCHITECTURE.md` (Section 20):

1. **No secrets, private keys, credentials, or sensitive configuration in source code or Git.** This includes history, not just the working tree.
2. **Production secrets use appropriate environment configuration** provided by the hosting/deployment environment. Procedures belong in `docs/DEPLOYMENT.md` (future document), not here.
3. **No real credentials or environment variable names are documented in this specification.** None are established by the source documents, and none are invented here.
4. **No exposure through client bundles, logs, errors, or public responses.** Secrets never appear in browser-delivered JavaScript, user-facing messages, server responses to untrusted callers, or diagnostic output visible outside server-side handling.
5. **Credentials are never hardcoded, committed, or exposed** as a standing rule (`AGENTS.md` development rules; REQ-SEC-001).

---

## 9. Input and Content Security

Per REQ-SEC-003, REQ-CMS-006, REQ-INQ-012 through REQ-INQ-014, and the validation boundaries in `docs/API.md` (Section 16) and `docs/DATA-MODEL.md` (Section 7):

1. **Validate and sanitize untrusted input at appropriate boundaries.** Inquiry input and CMS/admin input are both validated; invalid content is rejected with clear, field-associated, non-technical messages. Server-side validation enforces; client-side validation assists.
2. **Protect against inappropriate HTML/script injection and unsafe content rendering.** Untrusted or CMS-authored content must be handled so it cannot execute as code in visitors' browsers or in the admin surface beyond explicitly confirmed behavior.
3. **CMS-authored content must not automatically become executable code.** Stored content rendered into public HTML is treated as data unless an explicitly confirmed requirement defines rich-content behavior and its handling.
4. **Preserve intended rich-content behavior only where explicitly confirmed.** No rich-text, markup, embed, or scripting capability is assumed. If ever confirmed, its allowed constructs and handling require explicit confirmation and belong in implementation plus `docs/DECISIONS.md` once it exists.
5. **No invented implementation.** No specific sanitization library, allowlist, encoding scheme, length limit, format rule, or per-field constraint is named or assumed unless already established by the source documents. None is established. Exact validation and content-handling rules are **Confirmation Required** (see Section 20).

---

## 10. API and Server Security

Astro Server Endpoints are the backend/API boundary and the only application backend. No second backend exists (`docs/TECH-STACK.md` Section 8; `docs/ARCHITECTURE.md` Sections 3.3, 14; `docs/API.md` Section 4).

1. **Validate server-side.** Every server endpoint re-validates its input independently of client-side checks (REQ-SEC-003; `docs/API.md` Section 4).
2. **Do not trust client-provided authorization, validation, or state.** Authentication and authorization are established server-side; client assertions about identity, permission, validity, or workflow state carry no authority.
3. **Do not expose internals.** Responses never expose stack traces, database errors, service credentials, verification internals, or internal implementation details (REQ-STA-005; `docs/UI-UX.md` Section 22; `docs/ARCHITECTURE.md` Section 14; `docs/API.md` Sections 7, 15).
4. **Keep error responses intentionally limited.** User-facing messages are clear and non-technical with next-step guidance; diagnostics are recorded server-side only and never returned to untrusted callers. Logging detail is addressed in Section 13.
5. **No wire formats defined here.** Endpoint structure, schemas, and message copy belong in implementation and `docs/API.md`. None are invented here.

---

## 11. Supabase Storage and Media Security

Supabase Storage is the media/file storage foundation, for example for gallery images where required by the confirmed implementation (`docs/TECH-STACK.md` Section 12; `docs/ARCHITECTURE.md` Section 17; `docs/DATA-MODEL.md` Section 9).

1. **Storage access follows the confirmed access model.** Retrieval honors the confirmed public/private distinction. The exact access model is **Confirmation Required** and belongs in implementation once confirmed (see Section 20).
2. **Public media may be publicly retrievable only when intentionally published.** Gallery or other imagery intended for the public site is retrievable for rendering because publication was intended — not because access control was absent.
3. **Non-public media must not be exposed.** Anything not intentionally published (including CMS-internal files and any unconfirmed inquiry attachments, which are not part of the scope) has no public retrieval path.
4. **Upload, replacement, and removal require authenticated authorization and validation**, with predictable behavior, progress and success/failure confirmation, and confirmation for removal (REQ-CMS-010; `docs/ARCHITECTURE.md` Sections 11, 17; `docs/DATA-MODEL.md` Section 9).
5. **Nothing invented.** No bucket names, policies, file limits, MIME restrictions, folder layouts, filenames, or access rules are documented or assumed.

---

## 12. Privacy and Personal Data

1. **Inquiry data is personal/business-contact information and must be handled appropriately.** It is handled securely in transit and at rest to the extent governed by the implemented services (REQ-SEC-004), collected only as confirmed, delivered only to the confirmed destination, and never exposed in public output or unconfirmed storage.
2. **Collect only information justified by the confirmed inquiry requirements.** Potential fields and option lists in REQ-INQ-008 through REQ-INQ-010 are possibilities, not confirmed requirements; no additional personal-data fields without justification (REQ-INQ-011). Final inquiry fields are **Confirmation Required** (see Section 20).
3. **Privacy Policy and Terms must reflect actual implementation.** Final Privacy Policy content must be client-approved and reflect actual implemented data handling; final Terms content must be client-approved and reflect actual business policies (REQ-PUB-027, REQ-PUB-029; REQ-SEC-008, REQ-SEC-009). Legal content is owned by confirmation with the client, not by this document.
4. **No invented retention period, legal claim, compliance certification, or policy.** No data-retention schedule, privacy-law conclusion, or contractual term is stated or implied here.
5. **Conditional inquiry persistence remains conditional.** The default flow stores no inquiry entity (Customer → Inquiry Form → Validation → EmailJS → Client Gmail). Supabase storage of inquiry records exists only on explicit confirmation (`docs/PROJECT.md` Section 10; `docs/DATA-MODEL.md` Section 11; `docs/API.md` Section 11).

---

## 13. Logging and Diagnostics

1. **Diagnostics may be recorded server-side where appropriate.** Failure responses distinguish user-facing messages (clear, non-technical) from server-side diagnostics (recorded, not exposed) (`docs/ARCHITECTURE.md` Section 14; `docs/API.md` Section 15).
2. **Never log secrets or unnecessary sensitive customer information.** Credentials, keys, verification secrets, and inquiry personal data beyond what is strictly necessary for the diagnosed operation do not belong in logs.
3. **User-facing errors remain non-technical**, with next-step guidance and without jargon, codes as the primary message, or implementation vocabulary (REQ-STA-005, REQ-STA-010; `docs/UI-UX.md` Section 22).
4. **No invented platform or retention.** No logging platform, destination, format, or retention period is named or assumed, because none is established by the source documents. Logging policy is **Confirmation Required** (see Section 20).

---

## 14. Abuse and Spam Protection

1. **Turnstile is the selected spam-protection mechanism** (REQ-INQ-017, REQ-SEC-007; see Section 6). Client-side presence alone is insufficient; server-side verification applies where applicable.
2. **Duplicate-submission prevention is required at the UI/API boundary.** The form shows a submission-in-progress state and disables repeat submission while processing; each attempt resolves into exactly one outcome and failure never presents as success (REQ-STA-003; `docs/API.md` Section 8).
3. **Advanced controls are Confirmation Required, not invented.** Rate limiting, idempotency keys, deduplication windows, request quotas, retry limits, and any additional abuse infrastructure are not established by any existing document. If later needed, they require explicit confirmation and belong in implementation.
4. **No additional infrastructure without a justified requirement.** No Redis, queues, WAF services, gateways, background jobs, or microservices are introduced here or assumed as future scope (see Sections 20–21).

---

## 15. CMS Security

Per REQ-CMS-002 through REQ-CMS-010, REQ-SEC-001 through REQ-SEC-003, and the CMS boundaries in `docs/ARCHITECTURE.md` (Section 11), `docs/UI-UX.md` (Sections 23–24), and `docs/API.md` (Section 12):

1. **Authentication before CMS access.** No CMS surface or operation is reachable without an authenticated session via the Supabase Auth foundation.
2. **Authorization for read, write, delete, and media operations.** Every content and media operation is subject to server-side authorization; client-side hiding is not a boundary.
3. **Validate content.** Admin input is validated with clear, field-associated messages; invalid content is rejected (REQ-CMS-006). Exact per-area rules are **Confirmation Required**.
4. **Confirm destructive actions.** Delete and remove operations require explicit confirmation naming the affected content in business terms; destructive actions are never one accidental click (REQ-CMS-007; `docs/UI-UX.md` Section 24).
5. **Protect unpublished/draft content.** To the extent a publishing workflow is later confirmed, unpublished edits and CMS-internal state never reach public output. The workflow itself is **Confirmation Required** (`docs/DATA-MODEL.md` Section 8).
6. **Prevent accidental exposure of admin data.** Admin identities, sessions, authorization internals, stored inquiry records (if ever confirmed), secrets, and diagnostics never appear in public rendering or user-facing errors.
7. **Avoid enterprise permission systems unless explicitly required.** No RBAC matrices, approval chains, revision history, or multi-workspace models are assumed. Such machinery requires explicit rescoping (see Section 21).

---

## 16. Frontend and Browser Security

1. **Do not expose secrets in client-side JavaScript.** Browser-delivered code carries no secrets, private keys, or credentials (REQ-SEC-005, REQ-INQ-019). Any client-visible configuration is public by design and carries no sensitive material (see Section 7).
2. **Secure handling of external links and embedded content where relevant.** The Google review CTA and any confirmed external destinations are labelled so visitors understand they are leaving the site (`docs/UI-UX.md` Section 16; `docs/DESIGN-SYSTEM.md` Section 14). No external embed or third-party script capability is assumed beyond the selected stack.
3. **Preserve accessibility/security behavior for forms and error states.** Errors are communicated in text associated with the relevant field, not by color alone (REQ-ACC-006); focus is managed to summaries or the first invalid field; success is reported only on actual success; failure never presents as success (`docs/UI-UX.md` Sections 13–14, 18; `docs/DESIGN-SYSTEM.md` Section 30).
4. **Browser-security policy is implementation/confirmation dependent.** No Content Security Policy or other browser-security header set is stated as a final implementation decision here, because none is justified by the source documents. CSP and browser-security headers are **Confirmation Required** (see Section 20); if adopted, they must be consistent with the Astro-first, islands-only rendering approach and must not break crawlable content, forms, or accessibility behavior.

---

## 17. Deployment and Security Environment

1. **Vercel is the hosting platform.** It serves production traffic and supports production environment configuration (`docs/TECH-STACK.md` Section 15; `docs/ARCHITECTURE.md` Section 19).
2. **Production configuration uses secure environment handling.** Sensitive configuration lives in environment-appropriate configuration, never in source or client bundles (REQ-SEC-006; REQ-DEP-003).
3. **HTTPS is required for production** (REQ-DEP-004).
4. **Namecheap is the domain registrar; domain/DNS security belongs to deployment procedures.** Namecheap's responsibility is registration; DNS/hosting wiring is a deployment concern (`docs/TECH-STACK.md` Section 16; `docs/ARCHITECTURE.md` Section 19).
5. **GitHub must not contain secrets.** Credentials, keys, and sensitive configuration never appear in the repository or its history (REQ-SEC-001, REQ-SEC-005).
6. **Detailed deployment procedures belong in `docs/DEPLOYMENT.md`** (future document), not here. Production verification expectations (principal pages render, inquiry delivery functions, SEO files reachable, HTTPS active, no placeholder branding) are stated in REQ-DEP-007 and owned by deployment verification.

---

## 18. Third-Party Service Boundaries

External services are integration boundaries, not application layers. No credentials, IDs, URLs, or configuration values are documented here. Application responsibility versus provider responsibility is stated only at the level the source documents support; no guarantees about third-party infrastructure are claimed.

| Service | Application responsibility | Provider responsibility (as boundary, not guarantee) |
| --- | --- | --- |
| Supabase (PostgreSQL, Auth, Storage) | Authenticated, authorized, validated CMS operations; published-only public retrieval; secret handling per Sections 4, 8, 11 | Operating the managed data platform within its own service boundary |
| EmailJS | Invoke delivery server-side for validated, spam-verified submissions without exposing sensitive configuration (Section 7) | Delivering accepted submissions toward the destination mailbox |
| Client Gmail (destination) | Deliver sufficient inquiry detail for follow-up; report success only on acceptance for delivery | Mailbox receipt and business follow-up, outside the application |
| Cloudflare Turnstile | Present the challenge client-side; verify evidence server-side; keep secrets server-side (Section 6) | Operating the challenge/verification service within its own boundary |
| Vercel | Correct production configuration without committed secrets; HTTPS-served deployment | Operating the hosting/deployment platform within its own boundary |
| Google services where applicable (Search Console, Business Profile, review link, conditional GA4) | Readiness for verification/monitoring; confirmed profile linking; client-supplied review URL only; conditional analytics only if confirmed with Privacy Policy implications handled | Operating Google services and profile/review/analytics data within Google's own boundary |

Rules carried from source documents:

- No tracking IDs, measurement IDs, verification values, review URLs, or account information are defined here (REQ-ANA-005, REQ-REV-004).
- Google Analytics 4 is Conditional/Could only — not mandatory — and only if confirmed and appropriate (REQ-ANA-004; `docs/TECH-STACK.md` Section 19).
- No custom review system or review database exists (REQ-REV-005, REQ-REV-006); no fake or unverified reviews or ratings are displayed (REQ-REV-007).

---

## 19. Security Incident and Failure Principles

Detailed operational incident procedures are outside this document where not established by the source documents. The principles below govern implementation behavior:

1. **Fail safely.** Reject or degrade rather than bypass authentication, authorization, validation, or spam verification.
2. **Never report false inquiry success.** Email, verification, or network failure produces a clear error with next-step guidance, not a success state (REQ-INQ-016, REQ-INQ-018; `docs/API.md` Section 7).
3. **Do not expose internals.** No failure path reveals stack traces, database errors, service credentials, verification internals, or implementation details (see Section 10).
4. **Preserve useful user input where practical.** Validation failures and recoverable submission/save/network failures do not wipe entered information without cause (`docs/UI-UX.md` Sections 13–14, 23–24).
5. **Protect admin and content data when integrations fail.** Email, verification, storage, or database failures never leak admin data, unpublished content, secrets, or customer data into user-facing output, and never leave the public site in a broken state where a sensible fallback or empty state applies (REQ-STA-007, REQ-STA-008).
6. **Stay consistent across surfaces.** The same kinds of failures produce the same kind of non-technical messaging across public and admin surfaces (`docs/UI-UX.md` Section 22).

---

## 20. Security Confirmation Required Matrix

No row below authorizes inventing the item. Anything originating from Shot&Prints remains Reference-Only until confirmed (see Section 22).

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 1 | Final authentication flow | **Confirmation Required** | Supabase Auth foundation is Confirmed; flow, session, provisioning, and timeout detail is not established. |
| 2 | Authorization / role model | **Confirmation Required** | Authenticated-and-authorized access is Confirmed; no roles or permissions are defined or invented. |
| 3 | Exact RLS policies | **Confirmation Required** | Principles only (Section 4). No SQL, policies, grants, tables, or columns defined here. |
| 4 | Inquiry persistence (whether Supabase stores inquiry records) | **Conditional / Confirmation Required** | Default is no storage (REQ-INQ-002). Storage only on explicit confirmation. |
| 5 | Final inquiry fields and required-versus-optional designation | **Confirmation Required** | REQ-INQ-008 through REQ-INQ-010. No additional personal-data fields without justification. |
| 6 | Data retention (inquiries if ever stored, logs, CMS content) | **Confirmation Required** | No retention periods defined (REQ-SEC-009). Legal content must reflect actual behavior. |
| 7 | Storage access model and storage policies | **Confirmation Required** | Supabase Storage foundation is Confirmed; public/private model, buckets, and policies are undecided. |
| 8 | EmailJS configuration | **Confirmation Required** | Boundary only (Section 7). No addresses, IDs, templates, or credentials invented. |
| 9 | Turnstile configuration | **Confirmation Required** | Boundary only (Section 6). No keys, endpoints, thresholds, or environment names invented. |
| 10 | Rate limiting and abuse controls | **Confirmation Required** | Duplicate-submission prevention behavior is Confirmed; numeric controls and mechanisms are not established. |
| 11 | Logging policy (scope, destination, retention) | **Confirmation Required** | Server-side-only diagnostics principle is Confirmed; no platform or retention invented. |
| 12 | CSP and browser-security headers | **Confirmation Required** | No policy stated as final here; must not break rendering, forms, or accessibility if adopted. |
| 13 | Legal and privacy wording (Privacy Policy, Terms) | **Confirmation Required** | Must be client-approved and reflect actual handling/policies (REQ-PUB-027, REQ-PUB-029). |
| 14 | Any additional third-party integrations | **Confirmation Required** | None introduced. Requires a confirmed requirement and justification. |

---

## 21. Explicit Security Exclusions

Unless the client explicitly expands the project and the change is recorded as a new decision, the security model does **not** include:

- Unnecessary security infrastructure beyond what the selected stack and confirmed requirements need.
- A custom auth system or separate authentication service.
- Enterprise RBAC, approval chains, revision history, or multi-workspace permission machinery.
- A second backend, second database, or service-specific stores.
- A custom review database or review-moderation security model.
- A CRM security model (pipelines, follow-ups, notes, tasks, campaigns).
- Payment security or PCI scope, because payments are out of scope (REQ-OOS-002, REQ-OOS-003).
- A reservation/availability security model (calendars, slots, holds, allocation), because real-time booking is out of scope (REQ-OOS-001, REQ-OOS-004).
- Redis, queues, background jobs, rate-limit infrastructure, WAF services, gateways, or microservices without a confirmed requirement.
- Invented compliance certifications or legal conclusions.

These exclusions mirror `docs/PROJECT.md` (Section 21), `docs/REQUIREMENTS.md` (Section 22), `docs/ARCHITECTURE.md` (Section 24), `docs/DATA-MODEL.md` (Section 16), and `docs/API.md` (Section 20).

---

## 22. Shot&Prints Boundary

Shot&Prints is the previous/reference website. It is **Reference-Only** and **not** the current brand identity (`docs/PROJECT.md` Section 17; `docs/DATA-MODEL.md` Section 15; `docs/API.md` Section 21; `docs/DESIGN-SYSTEM.md` Section 4).

- Historical/reference content only. Reference material may inform discussion but must be verified before being presented as current Melbourne Photobooth Hire information.
- No credentials, policies, contact details, or security assumptions are carried over from the old site.
- Reference pricing, inclusions, add-ons, booking policies, descriptions, imagery, FAQs, testimonials, and business information must not be treated as current security-relevant data (for example as confirmed option sets, field defaults, or published content).
- Shot&Prints branding, naming, contact information, logos, colors, typography, and brand language must not be used as current project information unless explicitly confirmed.

---

## 23. Related Documentation

Currently existing documents:

- `AGENTS.md` — AI-agent development rules.
- `README.md` — repository orientation.
- `docs/PROJECT.md` — product and business context.
- `docs/REQUIREMENTS.md` — functional and business requirements.
- `docs/TECH-STACK.md` — technology choices and technical constraints.
- `docs/ARCHITECTURE.md` — application architecture and code organization.
- `docs/UI-UX.md` — user experience and interaction requirements.
- `docs/DESIGN-SYSTEM.md` — visual and component design rules.
- `docs/DATA-MODEL.md` — database structure and relationships (conceptual level).
- `docs/API.md` — API and external service contracts (conceptual behavior and boundaries).

This document:

- `docs/SECURITY.md` — security requirements and constraints (this document; principles and boundaries only, no implementation).

Future documents (referenced as deferred detail owners, not existing sources) and their security-adjacent ownership:

- `docs/TESTING.md` — testing and verification strategy (owns verification that security behavior holds; no security behavior redefined here).
- `docs/DEVELOPMENT.md` — local development workflow and commands (owns safe local handling of configuration; secrets still never committed).
- `docs/DEPLOYMENT.md` — deployment and production procedures (owns production environment setup, HTTPS/domain wiring, and production verification).
- `docs/DECISIONS.md` — important architectural and technical decisions (records any future decision affecting architecture, technology, or security conventions).

Future ownership is explicit: endpoint wire detail stays in `docs/API.md`; concepts and conceptual relationships stay in `docs/DATA-MODEL.md`; verification strategy stays in `docs/TESTING.md`; local workflow stays in `docs/DEVELOPMENT.md`; production procedures stay in `docs/DEPLOYMENT.md`; decisions stay in `docs/DECISIONS.md`. This document does not duplicate their implementation detail.

---

## 24. Acceptance Criteria

This security document is considered complete when:

1. `docs/SECURITY.md` exists and is the only file created or modified for this task.
2. Purpose, scope, principles, and status labels are clearly stated without duplicating implementation detail from other documents.
3. Authentication (Supabase Auth foundation, anonymous public visitors, no unauthenticated CMS access, no invented flows), authorization (authenticated and authorized CMS operations, server-side enforcement, no admin data in public paths), and Supabase/RLS principles (no SQL or policies invented) are covered.
4. Inquiry protection (server-side validation, minimal collection, server-side Turnstile verification, duplicate-submission prevention, delivery only after validation/verification), Turnstile boundaries (client challenge insufficient, server verification, server-side secrets), and EmailJS/Gmail boundaries (selected service and destination, delivery-after-verification, public-config versus secret distinction without unsupported claims) are covered.
5. Secrets and environment handling (nothing in source or Git, production environment configuration, no documented credentials or variable names, no client/log/error exposure) is covered.
6. Input/content security (boundary validation, injection protection, no automatic code execution, confirmed-only rich behavior, no invented library), API/server security (Astro Server Endpoints boundary, server-side validation, no trusted client state, limited non-technical errors), and Storage/media security (confirmed-model access, intentionally-published-only public retrieval, authenticated validated mutations, nothing invented) are covered.
7. Privacy and personal data (appropriate handling, minimal confirmed collection, implementation-reflecting legal content, no invented retention or compliance claims, conditional persistence kept conditional), logging and diagnostics (server-side-only, no secrets or unnecessary personal data, non-technical user errors, no invented platform or retention), and abuse/spam protection (Turnstile selected, duplicate prevention required, advanced controls confirmation-gated, no invented infrastructure) are covered.
8. CMS security (authentication first, operation-level authorization, validation, destructive-action confirmation, unpublished-content protection, no admin-data exposure, no enterprise permission systems), frontend/browser security (no browser secrets, secure external-link handling, accessible form/error behavior, CSP left confirmation-dependent), and deployment environment (Vercel hosting, secure production configuration, HTTPS, Namecheap registrar boundary, no secrets in GitHub, procedures deferred to `docs/DEPLOYMENT.md`) are covered.
9. Third-party boundaries (Supabase, EmailJS, Turnstile, Vercel, Google services where applicable) identify application versus provider responsibility without claiming provider guarantees.
10. Incident/failure principles (fail safely, no false success, no internals, preserved input where practical, protected admin/content data on integration failure) are stated without inventing operational procedures.
11. The Confirmation Required matrix covers authentication flow, authorization/role model, RLS policies, inquiry persistence, inquiry fields, retention, storage model and policies, EmailJS configuration, Turnstile configuration, rate limiting/abuse controls, logging policy, CSP/headers, legal/privacy wording, and additional integrations.
12. Explicit exclusions (no unnecessary infrastructure, custom auth, enterprise RBAC, second backend, review database, CRM model, payment/PCI scope, reservation model, Redis/queues/WAF/microservices without confirmation, invented compliance) are stated.
13. Shot&Prints is treated as Reference-Only with no carried-over credentials, policies, contact details, or security assumptions.
14. Related documents are referenced with future ownership (DATA-MODEL, API, TESTING, DEVELOPMENT, DEPLOYMENT, DECISIONS) clearly identified.
15. The document does not invent credentials, policies, schema, roles, environment variables, or unsupported infrastructure; remains consistent with all ten source documents; keeps conditional requirements explicitly conditional; and does not expand the project scope.

(End of file)
