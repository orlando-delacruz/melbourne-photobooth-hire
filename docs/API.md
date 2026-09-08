# Melbourne Photobooth Hire — API and Integration Contracts

## 1. Purpose and Scope

This document is the authoritative API and integration contract specification for the Melbourne Photobooth Hire project. It answers:

> **What server-side and integration boundaries exist, how does the inquiry submission flow behave, what contracts govern requests, responses, validation, errors, CMS operations, and external services, and what remains unconfirmed?**

This is a specification task only. This document defines **contracts, flows, responsibilities, and boundaries at the conceptual level**. It does not define:

- Final endpoint URLs, HTTP methods, request payloads, or response schemas.
- Final inquiry field names, formats, limits, or required-versus-optional designations.
- Database tables, columns, IDs, enums, constraints, or migrations.
- Environment variable names, credentials, IDs, keys, or configuration values.
- Email addresses, EmailJS service/template IDs, template content, or parameters.
- Turnstile credentials, verification endpoints, or implementation details.
- Source code or component implementations.
- Final page copy, business claims, prices, policies, or contact details.
- Frontend visual behavior (deferred to `docs/UI-UX.md` and `docs/DESIGN-SYSTEM.md`).

This is a greenfield project. This document describes the **intended API direction**, not implemented endpoints. Implementation status must be confirmed from the repository.

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

Where this document and `docs/REQUIREMENTS.md` disagree on required behavior, `docs/REQUIREMENTS.md` governs what the system must do and the discrepancy should be resolved explicitly. Where this document and `docs/PROJECT.md` disagree on business context, `docs/PROJECT.md` is authoritative.

---

## 2. Terminology

- **Inquiry / request:** a customer message asking about photobooth services for an event, with follow-up handled by the business through its normal process. This is the only booking-related term used by this project. Terms such as booking engine, reservation, availability, checkout, order, or transaction must not be used to describe API behavior unless the scope is explicitly expanded.
- **Confirmed:** established by existing project documentation cited in the relevant section. May be relied on for planning.
- **Conditional:** exists only if a separately confirmed requirement activates it. Must not be implemented by default.
- **Confirmation Required:** depends on client/business confirmation. Must not be treated as a final field, endpoint, schema, workflow, or configuration.
- **Reference-Only:** originates from the previous Shot&Prints website/material. Historical context only; never confirmed production or API data.
- **Server Endpoint:** an Astro Server Endpoint acting as the application backend/API layer (see Section 5).
- **Public caller:** an unauthenticated website visitor interacting only with the public site and the inquiry submission boundary.
- **Admin caller:** an authenticated business client performing CMS operations through the admin application.

---

## 3. Authority Boundaries

To prevent premature lock-in and duplication, responsibility is split as follows:

| Concern | Owner |
| --- | --- |
| What the system must do | `docs/REQUIREMENTS.md` |
| Selected technologies | `docs/TECH-STACK.md` |
| Architecture and data flows | `docs/ARCHITECTURE.md` |
| Behavior and experience | `docs/UI-UX.md` |
| Visual language | `docs/DESIGN-SYSTEM.md` |
| Concepts, relationships, and data boundaries | `docs/DATA-MODEL.md` |
| **Endpoint behavior, request/response principles, validation principles, email/verification responsibility boundaries** | **This document (`docs/API.md`)** |
| Auth behavior, authorization rules, RLS policies, secret handling, spam-verification detail | `docs/SECURITY.md` (future) |
| Testing and verification strategy | `docs/TESTING.md` (future) |
| Local development workflow | `docs/DEVELOPMENT.md` (future) |
| Deployment and production procedures | `docs/DEPLOYMENT.md` (future) |
| Important architectural/technical decisions once made | `docs/DECISIONS.md` (future) |

This document introduces no endpoint URLs, HTTP methods, payloads, response schemas, status codes, table definitions, column definitions, policies, credentials, or configuration values.

---

## 4. API Principles

1. **Astro Server Endpoints are the backend/API layer.** All server-side application behavior — inquiry processing, server-side validation, spam-verification handling, email bridging, and controlled backend access — passes through Astro Server Endpoints. There is no second backend (see Section 18).
2. **No Express/NestJS or separate backend.** A separate Node server or backend framework must not be introduced unless a future confirmed requirement genuinely cannot be met by Astro Server Endpoints and the decision is recorded in `docs/DECISIONS.md` (`docs/TECH-STACK.md` Section 8, `docs/ARCHITECTURE.md` Section 3.3).
3. **Server-side validation is the enforcement layer.** Every server endpoint re-validates its input independently of any client-side checks. Client-side checks never substitute for server-side enforcement (`docs/ARCHITECTURE.md` Section 14).
4. **Client-side validation is for usability only.** Client checks (for example via shared Zod schemas in the inquiry island) provide immediate feedback, prevent submission while invalid input remains, and reduce unnecessary server round-trips. They are not a security boundary (REQ-INQ-012 through REQ-INQ-014; `docs/ARCHITECTURE.md` Sections 9, 14).
5. **Concepts before contracts.** Because final inquiry fields, CMS modules, and several configurations require confirmation, this document specifies behavior, responsibilities, and failure boundaries — not wire formats. No endpoint structure or schema is final until confirmed (see Section 16).
6. **Smallest useful API surface.** The API covers only what the agreed scope needs: one public inquiry submission boundary plus authenticated CMS operations for confirmed website content. Sized for the fixed **₱15,000** project; no additional layers, gateways, or abstractions.
7. **Inquiry stays an inquiry.** API behavior supports an inquiry/request workflow delivering to the client's Gmail. It never performs availability, reservation, payment, checkout, CRM, or marketing-automation behavior (REQ-INQ-001, REQ-INQ-020).

---

## 5. Public Inquiry Submission Flow

### 5.1 Confirmed default flow

The required flow (REQ-INQ-002; `docs/PROJECT.md` Section 10; `docs/TECH-STACK.md` Section 13; `docs/ARCHITECTURE.md` Section 9.1) is:

```text
Customer
  ↓
Inquiry Form (React island; client-side validation for usability)
  ↓
Astro Server Endpoint (server-side validation — enforcement layer)
  ↓
Turnstile verification (server-side; secret stays server-side)
  ↓
EmailJS delivery
  ↓
Client Gmail (business follow-up happens here, outside the application)
```

Step responsibilities:

1. **Inquiry Form:** collects confirmed fields; provides labels, required/optional indication, instructions, field-associated errors, submission-in-progress state, and duplicate-submission prevention (REQ-INQ-004 through REQ-INQ-014, REQ-STA-003; `docs/UI-UX.md` Sections 13–14). Usability layer only.
2. **Astro Server Endpoint:** authoritative boundary. Re-validates input, verifies spam-protection evidence, and triggers email delivery. Never exposes secrets in client-side source (REQ-INQ-019, REQ-SEC-005).
3. **Turnstile verification:** server-side check that the submission is legitimate before it is treated as deliverable (see Section 8).
4. **EmailJS:** delivers the validated inquiry to the client's Gmail (see Section 9).
5. **Client Gmail:** destination mailbox. Final booking is handled through the business's normal process, outside the website (`docs/PROJECT.md` Sections 6, 10).

### 5.2 Conditional Supabase inquiry-persistence branch

Only if explicitly confirmed as a CMS requirement (`docs/PROJECT.md` Section 10; `docs/TECH-STACK.md` Section 13; `docs/ARCHITECTURE.md` Section 10; `docs/DATA-MODEL.md` Section 11):

```text
Inquiry Form
  ↓
Astro Server Endpoint
  ├── EmailJS → Client Gmail (required branch; always present)
  └── Supabase PostgreSQL → CMS record (conditional branch; only on explicit confirmation)
```

Distinguishing rules:

- The EmailJS → Gmail branch is the **Confirmed default** and required path. It exists with or without persistence.
- The Supabase branch is **Conditional**. Absence of confirmation means absence of the branch. It must not be implemented by default.
- Combined failure behavior for the two-branch flow (for example whether email delivery depends on database persistence succeeding, or vice versa) is **Confirmation Required** and belongs in implementation plus `docs/SECURITY.md` once the condition is confirmed. No combined semantics are decided here.
- No inquiry table, field, status, retention, or access design is included here; that belongs to `docs/DATA-MODEL.md` and `docs/SECURITY.md` if the condition is confirmed.
- Even if confirmed, the branch never grows into a CRM, reservation, payment, follow-up workflow, or availability system (see Section 15).

---

## 6. Inquiry Request Contract (Conceptual Level)

No final field names, payload structures, formats, or limits are defined in this or any existing document. This section states only what existing documentation supports.

### 6.1 Candidate information (Confirmation Required)
e
The following are **potential** inquiry fields named in REQ-INQ-008. None is confirmed as required by any existing document, and the labels below are conceptual descriptions, not final field names or schema keys:

- Name.
- Email.
- Mobile.
- Event date.
- Event type.
- Event location/venue.
- Estimated guests.
- Preferred photobooth.
- Additional requirements/message.

Rules carried from source documents:

- The final set of fields, and which are required versus optional, is **Confirmation Required** (REQ-INQ-008).
- If event type is collected as a selection, its option list (for example Wedding, Birthday, Corporate Event, Engagement Party, School Formal, Christmas/End-of-Year, Private Event, Other) is **Confirmation Required** (REQ-INQ-009).
- If preferred photobooth is collected as a selection, its option list (for example Premium, Roaming, 360, Not Sure) is **Confirmation Required** (REQ-INQ-010).
- No additional personal-data fields beyond what is confirmed may be introduced without justification (REQ-INQ-011).
- Final service names, descriptions, and suitability/setup claims that option lists may reference require client confirmation (REQ-SVC-005) and must not present Shot&Prints reference characteristics as confirmed claims (REQ-SVC-004; see Section 17).

### 6.2 Validation principles supported by REQUIREMENTS

Exact validation rules per field are **Confirmation Required** and belong in implementation once fields are confirmed. The principles below are Confirmed:

- Submissions are validated before sending, at minimum for required-field presence, email format, and any confirmed format rules (REQ-INQ-012).
- Validation errors are communicated near the relevant field and summarized where appropriate (REQ-INQ-013); communicated in text associated with the field, not by color alone (REQ-ACC-006); submission is blocked while invalid input remains uncorrected (REQ-INQ-014).
- All user input is validated at appropriate boundaries (REQ-SEC-003); server-side validation is the enforcement layer and client-side validation is usability only (Section 4).
- Validation schemas should be explicit and reusable across client and server boundaries as needed (Zod per `docs/TECH-STACK.md` Section 7). Detailed rules belong in implementation and `docs/SECURITY.md`, not here.
- No length limits, formats, required-versus-optional designations, or option sets are invented here.

---

## 7. Inquiry Response Behavior

Exact response shapes, status codes, and message copy are **Confirmation Required** and belong in implementation. Behavior principles below are Confirmed and follow REQ-INQ-015, REQ-INQ-016, REQ-INQ-018, REQ-STA-003 through REQ-STA-005, REQ-STA-010, and `docs/UI-UX.md` Sections 13–14, 20–22:

- **Success — only when the required submission flow succeeds.** Success feedback is reported only when the inquiry has been accepted for delivery to the client's Gmail (REQ-INQ-018). A false success state is never shown. The visitor is told the inquiry was submitted and what happens next (business follow-up), in plain non-technical language. The success state is programmatically exposed and focus-managed per `docs/UI-UX.md` Section 14.5; visual treatment follows `docs/DESIGN-SYSTEM.md` and is not defined here.
- **Validation failure.** The submission is rejected before delivery. The visitor is told which fields need correction and how to correct them, near the relevant fields with a summary where appropriate, without technical jargon. Entered values are preserved where practical. Focus is directed to the error summary or first invalid field (`docs/UI-UX.md` Section 14.3).
- **Spam/Turnstile failure.** The submission is rejected with a clear, non-technical message and reasonable next-step guidance (for example trying again). Verification internals, mechanisms, and diagnostics are never exposed (`docs/UI-UX.md` Section 14.7; `docs/ARCHITECTURE.md` Section 16).
- **Email/service failure.** The visitor receives a clear, non-technical error with guidance on what to do next (for example retrying or using an alternative confirmed contact path). Technical details — service internals, delivery diagnostics, stack traces — are never exposed (REQ-INQ-016, REQ-STA-005; `docs/UI-UX.md` Section 14.6).
- **Network/server failure.** Network or API failures affecting user-visible functionality produce clear, non-technical feedback with retry guidance. Entered information is preserved where practical so retry does not require re-entering the full form (REQ-STA-010; `docs/UI-UX.md` Section 14.8).
- **Never expose internals.** No response exposes stack traces, database errors, API internals, credentials, service secrets, verification internals, or implementation details (REQ-STA-005; `docs/UI-UX.md` Section 22; `docs/ARCHITECTURE.md` Section 14). User-facing messages stay clear and non-technical; diagnostics are logged server-side only. Logging detail belongs in `docs/SECURITY.md`.

---

## 8. Duplicate-Submission and Submission-State Behavior

Based on REQ-STA-003, REQ-INQ-015, REQ-INQ-016, and `docs/UI-UX.md` Sections 13–14:

- Form submission shows a **submission-in-progress state** and **prevents duplicate submissions while processing** (REQ-STA-003). The submit trigger is disabled until the outcome is known; the form does not reset or navigate away until the outcome is known.
- Submission progress is communicated so the visitor knows the inquiry is being sent and should wait.
- Each submission attempt resolves into exactly one outcome: success or a defined failure (validation, spam-verification, email/service, network/server). Failure never presents as success.
- Recoverable failures preserve entered information where practical (validation failures and recoverable submission/network failures do not wipe the form).
- CMS-side save/delete/upload operations follow the analogous rule (pending operations disable their triggers until the outcome is known; see Section 11), but inquiry submission and CMS saving are separate boundaries with separate feedback.

No idempotency keys, deduplication windows, rate-limit values, or retry-count policies are defined here. If such controls are later needed, they require explicit confirmation and belong in implementation plus `docs/SECURITY.md`.

---

## 9. Turnstile Integration

Cloudflare Turnstile is the **Selected** spam-protection direction for the inquiry form (REQ-INQ-017, REQ-SEC-007; `docs/TECH-STACK.md` Section 14; `docs/ARCHITECTURE.md` Section 16). This document defines only the responsibility boundary:

- **Client obtains verification.** The inquiry island presents the Turnstile challenge and obtains verification evidence alongside the submission. Client-side presence alone is not a sufficient boundary.
- **Server verifies it.** The Astro Server Endpoint verifies the evidence server-side where applicable before the submission is treated as legitimate and passed to email delivery.
- **Secret remains server-side.** Verification secrets stay in server-side environment-appropriate configuration and never appear in client-side source or the repository (REQ-INQ-019, REQ-SEC-005, REQ-SEC-006).
- **Failure is non-technical.** Spam-verification failure produces the behavior in Section 7 without exposing verification internals.

Exact credentials, verification endpoints, environment variable names, request/response parameters, score/threshold behavior, and implementation details are **Confirmation Required** to the extent not already documented — and no such details are established by any existing document, so none are defined here. Verification flow detail, key handling, and failure policy belong in `docs/SECURITY.md` and implementation.

---

## 10. EmailJS Integration

EmailJS is the **Selected** email delivery direction; the client's Gmail is the **Selected** destination (REQ-EML-001 through REQ-EML-004, REQ-INQ-002, REQ-INQ-018; `docs/TECH-STACK.md` Section 13; `docs/ARCHITECTURE.md` Section 15). This document defines only the responsibility boundary:

- **EmailJS responsibility:** deliver validated inquiry submissions accepted by the server endpoint to the client's Gmail destination, functioning in production with production configuration (REQ-EML-004, REQ-DEP-005).
- **Server endpoint responsibility:** invoke delivery without exposing sensitive configuration to the browser (REQ-INQ-019). Only validated, spam-verified submissions reach delivery.
- **Client Gmail responsibility:** destination mailbox where the business receives the inquiry with sufficient detail to follow up (REQ-EML-002). Follow-up happens outside the application.
- **Consistency rule:** the customer-facing success signal and the business-facing delivery stay consistent — success feedback implies the inquiry was accepted for delivery; delivery failure produces a clear error, not a false success (REQ-INQ-018; `docs/ARCHITECTURE.md` Section 15).

The following are **Confirmation Required** and are not defined here, because no existing document establishes them: the Gmail address, EmailJS service/template/public-key identifiers, template content and parameters, sender/recipient configuration, environment values, and credential handling beyond the boundary rules above. No alternative provider (Resend, Nodemailer, custom SMTP) is introduced (`docs/TECH-STACK.md` Sections 13, 21).

---

## 11. Conditional Inquiry Persistence

- **Status: Conditional.** Supabase PostgreSQL may store inquiry records **only if explicitly confirmed** as a CMS requirement. The default flow has no stored inquiry entity (Section 5.1; `docs/DATA-MODEL.md` Section 11).
- **EmailJS → Gmail remains part of the required flow** with or without persistence. Persistence never replaces email delivery.
- **No schema here.** Tables, fields, statuses, retention, and access rules belong to `docs/DATA-MODEL.md` and `docs/SECURITY.md` if the condition is confirmed.
- **No workflow here.** No CRM, reservation, payment, follow-up workflow, assignment, status machine, or availability behavior is introduced — even if persistence is confirmed (REQ-INQ-020, REQ-OOS-001 through REQ-OOS-005).
- **Combined failure semantics are Confirmation Required** (see Section 5.2).
- **Admin visibility, if the condition is confirmed,** is through authenticated, authorized CMS operations only (see Section 12). Stored inquiries are admin-only data and never appear in public output (`docs/DATA-MODEL.md` Section 10.2). An empty records view, if it ever exists, explains that no inquiries exist yet rather than showing a broken state (`docs/UI-UX.md` Section 21).

---

## 12. CMS/API Operations

Product-level requirements only (REQ-CMS-001 through REQ-CMS-013, REQ-CON-001 through REQ-CON-005). Exact modules, endpoints, methods, payloads, and fields are **Confirmation Required**.

- **Authenticated and authorized admin operations.** Unauthenticated callers must not reach CMS functionality (REQ-CMS-002). Authenticated actions respect authorization rules so only permitted users can view or modify content (REQ-CMS-003). Every content read/write and media operation is subject to server-side authorization; client-side route hiding alone is not a boundary. Detail belongs in `docs/SECURITY.md`.
- **Content operations only where supported by the confirmed CMS scope:** retrieval, edit, save/create, and delete/remove behavior for confirmed content areas (REQ-CMS-005), with clear organization (REQ-CMS-004), predictable save behavior — clear confirmation on save, clear error on failure (REQ-CMS-008) — loading, saving, and network/API failure feedback (REQ-CMS-009), and guards against accidental data loss where practical such as confirmation for destructive actions (REQ-CMS-007).
- **Validation.** Admin input is validated and invalid content is rejected with clear error messages (REQ-CMS-006). Exact rules per content area are Confirmation Required and belong in implementation.
- **Media operations** (upload, replacement, removal) only where required by the confirmed implementation, for example gallery images (REQ-CMS-010), with predictable behavior, progress, success/failure confirmation, and confirmation for removal. Buckets, policies, filenames, and the media access model are Confirmation Required (see Section 16); the access model belongs in `docs/SECURITY.md` and `docs/DATA-MODEL.md`.
- **Exact CMS modules, editable areas, and fields are Confirmation Required** (REQ-CMS-012, REQ-CON-002). Candidate areas named in REQ-CON-002 (services, packages, gallery, FAQs, general website content, contact/business information) are possibilities with no defined fields — not final modules. Nothing here authorizes creating an endpoint per candidate area.
- **The CMS remains scoped** to managing confirmed website content. It must not become an enterprise CMS or CRM (REQ-CMS-013).

---

## 13. Supabase Interaction Boundaries

Supabase is the application data foundation; its three responsibilities are distinct (`docs/TECH-STACK.md` Sections 9–12; `docs/ARCHITECTURE.md` Section 13; `docs/DATA-MODEL.md` Sections 9, 12–13):

- **PostgreSQL for CMS/content data.** Backs confirmed CMS content and — only if confirmed — inquiry records (Section 11). Schemas, fields, relationships, and constraints belong in `docs/DATA-MODEL.md`. None are defined here.
- **Auth for admin authentication.** Foundation gating CMS/admin access (REQ-CMS-002, REQ-SEC-001). Session handling, roles, and authorization rules belong in `docs/SECURITY.md`. No roles or permission structures are invented here.
- **Storage for media.** Foundation for CMS-managed media, for example gallery images where required by the confirmed implementation (REQ-CMS-010). Buckets, access models, and policies are Confirmation Required and belong in `docs/SECURITY.md` and `docs/DATA-MODEL.md`. None are defined here.

Rules:

- Public callers never interact directly with Supabase CMS data, admin routes, or secrets; they receive only intentionally published HTML and the inquiry submission boundary (`docs/ARCHITECTURE.md` Section 5).
- All CMS writes go through authenticated, authorized operations with validation.
- Detailed RLS and authentication rules belong in `docs/SECURITY.md` and are not duplicated here.

---

## 14. Public Content Retrieval

- **Only confirmed/published content reaches the public site.** Astro retrieves confirmed CMS content server-side and renders it into crawlable HTML (`docs/ARCHITECTURE.md` Section 7). Crawlable content (services, packages, FAQs, business information) is present in delivered HTML, not assembled client-side after load.
- **Do not expose drafts, admin data, secrets, or unpublished CMS state.** Draft, unreviewed, or unpublished edits, CMS-internal state, admin identities, sessions, authorization internals, stored inquiry records (if ever confirmed), secrets, keys, service configuration, verification internals, and diagnostics never appear in public output (`docs/DATA-MODEL.md` Section 10.2).
- **Admin routes are separated** from public routes and excluded from indexing (`docs/ARCHITECTURE.md` Sections 11, 18).
- **Empty or missing content** produces a sensible fallback or empty state, never a broken layout or raw error (REQ-STA-007, REQ-STA-008; `docs/UI-UX.md` Section 21). Optional supporting content is omitted when absent.
- Content models, fields, publishing workflow, and ordering/visibility mechanisms are Confirmation Required to the extent stated in `docs/DATA-MODEL.md` Section 8 and Section 16 of this document.

---

## 15. Error Handling and Failure Boundaries

Behavioral principles (visual treatment and copy belong in `docs/UI-UX.md`, `docs/DESIGN-SYSTEM.md`, and implementation; policy detail belongs in `docs/SECURITY.md`):

- Every user-visible failure resolves into clear, non-technical feedback with next-step guidance: validation errors identify affected fields and corrections; email, verification, database, and network failures state what happened from the user's perspective and what to do next (REQ-STA-004 through REQ-STA-006, REQ-STA-010; `docs/UI-UX.md` Section 22).
- Failure responses distinguish user-facing messages (clear, non-technical) from server-side diagnostics (logged, never exposed) (`docs/ARCHITECTURE.md` Section 14).
- Inquiry email failure never reports false success (REQ-INQ-016, REQ-INQ-018).
- CMS save failure states that content was not saved and what to do next, preserving entered edits during recoverable failures where practical (REQ-STA-006; `docs/UI-UX.md` Sections 23–24).
- Database failures affecting Supabase-backed functionality (CMS operations and, only if confirmed, inquiry persistence) produce clear admin/user-facing errors without exposing internals (`docs/ARCHITECTURE.md` Section 21).
- Unknown routes render the user-friendly 404 recovery behavior defined in `docs/UI-UX.md` Section 29 (REQ-STA-009); no additional custom error flows are specified here.
- No error path exposes stack traces, database errors, API internals, status codes as the primary message, credentials, secrets, or implementation details.

---

## 16. Validation Principles

- **Boundaries:** all user input (inquiry form and CMS inputs) is validated at appropriate boundaries (REQ-SEC-003). Server-side validation enforces; client-side validation assists (Section 4).
- **Inquiry:** validated before sending at minimum for required-field presence, email format, and confirmed format rules (REQ-INQ-012); errors communicated near the relevant field with summary where appropriate (REQ-INQ-013); submission blocked while invalid input remains (REQ-INQ-014); entered information preserved where practical.
- **CMS:** admin input validated with clear, field-associated, non-technical messages; invalid content rejected (REQ-CMS-006); business-critical content requires explicit client approval before publication, which validation never substitutes for (REQ-CON-005).
- **Shared schemas:** explicit validation schemas (Zod per `docs/TECH-STACK.md` Section 7) should be reusable across client and server boundaries as needed.
- **No invented constraints.** Length limits, formats, required-versus-optional designations, option sets, and per-area rules must not be invented. Exact rules are Confirmation Required and belong in implementation plus `docs/SECURITY.md` once fields are confirmed.
- **Accessibility:** errors are communicated in text associated with the relevant field, not by color alone (REQ-ACC-006), with focus management per `docs/UI-UX.md`.

---

## 17. Security/API Boundaries

High-level boundaries only. Detailed policy belongs in `docs/SECURITY.md` and is not duplicated here:

- Admin authentication is required and secure; credentials are never hardcoded, committed, or exposed (REQ-SEC-001). Authorization prevents unauthorized CMS access and content modification (REQ-SEC-002, REQ-CMS-003).
- Inquiry data is handled securely in transit and at rest to the extent governed by the implemented services (REQ-SEC-004). No data-retention periods or legal policies are invented (REQ-SEC-009).
- No secrets, private keys, or credentials appear in client-side source or the repository (REQ-SEC-005, REQ-INQ-019). Sensitive configuration uses appropriate environment handling without committing secrets (REQ-SEC-006). No environment variable names are listed here.
- Spam protection is enforced server-side where applicable; client-only checks are insufficient (REQ-INQ-017, REQ-SEC-007).
- Data handling is appropriate to the collected information, and legal/privacy content reflects actual behavior (REQ-SEC-008). No additional personal-data fields without justification (REQ-INQ-011).
- Supabase access control protects CMS data so public retrieval cannot bypass authorization to reach raw CMS data (REQ-SEC-002; `docs/ARCHITECTURE.md` Section 13).

---

## 18. External-Service Dependency Boundaries

External services are integration boundaries, not application layers. No credentials, IDs, URLs, or configuration values are documented here (`docs/ARCHITECTURE.md` Section 19):

- **EmailJS:** email delivery service for validated inquiries (see Section 10). Boundary is the Astro Server Endpoint, which invokes delivery without exposing sensitive configuration.
- **Client Gmail:** destination mailbox (see Section 10). Business follow-up happens outside the application.
- **Cloudflare Turnstile:** spam-protection service (see Section 9). Boundary spans the inquiry island (challenge) and the server endpoint (verification). Secrets stay server-side.
- **Supabase (PostgreSQL, Auth, Storage):** data platform (see Section 13). Boundary is authenticated, authorized server/CMS operations; public callers never reach raw CMS data.
- **Vercel:** hosting and deployment platform. Serves production traffic over HTTPS and supports production environment configuration. Deployment procedures belong in `docs/DEPLOYMENT.md` (future).
- **Namecheap:** domain registrar. Registration only; DNS/hosting wiring is a deployment concern.
- **GitHub:** source control. Repository hosting and version history.
- **Google Search Console / Google Business Profile / Google Business Profile review link:** external Google concerns. The website is ready for Search Console verification/monitoring; profile content lives in Google; the review CTA links to the client-supplied review URL (Confirmation Required, REQ-REV-004). No tracking IDs, URLs, or credentials are defined here.
- **Google Analytics 4 (optional/conditional):** only if confirmed and appropriate (REQ-ANA-004). Privacy Policy implications must be handled if adopted. No measurement IDs are defined here.
- **No additional services or libraries** are introduced. Queues, webhooks, background jobs, microservices, API gateways, and unnecessary abstraction layers are explicitly avoided as overengineering for this scope.

---

## 19. Confirmation Required Matrix

Anything originating from Shot&Prints remains Reference-Only until confirmed (see Section 20). No row below authorizes inventing the item.

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 1 | Final inquiry fields (field set) | **Confirmation Required** | Potential fields in REQ-INQ-008 are possibilities, not confirmed requirements. No field names, payload structures, formats, or limits defined here. |
| 2 | Required/optional designation per inquiry field | **Confirmation Required** | REQ-INQ-008. No designation is confirmed by any existing document. |
| 3 | Event-type option list (if collected as a selection) | **Confirmation Required** | REQ-INQ-009. Example list is illustrative only. |
| 4 | Preferred-photobooth option list (if collected as a selection) | **Confirmation Required** | REQ-INQ-010. Example list is illustrative only. |
| 5 | Inquiry persistence (whether Supabase stores inquiry records) | **Conditional / Confirmation Required** | Default is no storage (REQ-INQ-002). Storage only on explicit confirmation. No schema designed here. |
| 6 | Combined email-plus-persistence failure semantics | **Confirmation Required** | Only relevant if persistence is confirmed. No combined behavior decided here. |
| 7 | CMS modules and editable content areas | **Confirmation Required** | REQ-CMS-012, REQ-CON-002. Candidate areas are possibilities with no defined fields. |
| 8 | CMS fields per content area | **Confirmation Required** | No fields defined in any existing document. Must not be assumed. |
| 9 | Endpoint structure (URLs, methods, versioning) | **Confirmation Required** | No endpoint URLs, methods, or versioning defined here or in any existing document. |
| 10 | Request/response schemas (shapes, codes, message copy) | **Confirmation Required** | Behavior principles only (Sections 6–7). No wire formats invented. |
| 11 | Per-field validation rules, limits, and formats | **Confirmation Required** | Principles only (Section 16). No constraints invented. |
| 12 | EmailJS configuration (IDs, templates, parameters, credentials, environment values) | **Confirmation Required** | Boundary only (Section 10). Nothing invented. |
| 13 | Client Gmail destination (address, mailbox configuration) | **Confirmation Required** | Destination role is Confirmed; the address itself is not established by any existing document. |
| 14 | Turnstile configuration (keys, endpoints, parameters, environment values) | **Confirmation Required** | Boundary only (Section 9). Nothing invented. |
| 15 | Media access model (public versus controlled retrieval; buckets, policies) | **Confirmation Required** | Supabase Storage foundation is Confirmed; the access model is undecided (`docs/ARCHITECTURE.md` Sec. 17; `docs/DATA-MODEL.md` Sec. 9). Detail belongs in `docs/SECURITY.md`. |
| 16 | Deduplication, rate-limit, retry, or idempotency controls | **Confirmation Required** | Duplicate-submission prevention behavior is Confirmed (Section 8); numeric controls or mechanisms are not established. |
| 17 | Any additional integrations beyond the selected stack | **Confirmation Required** | None introduced. Requires a confirmed requirement and justification (`docs/TECH-STACK.md` Sec. 23). |

---

## 20. Explicit Exclusions

Unless the client explicitly expands the project and the change is recorded as a new decision, the API does **not** include (REQ-INQ-020, REQ-OOS-001 through REQ-OOS-013; `docs/PROJECT.md` Section 21; `docs/ARCHITECTURE.md` Section 24; `docs/DATA-MODEL.md` Section 16):

- Real-time availability (calendars, slots, holds, allocation checks).
- Reservation/booking engine (status machines, assignments, scheduling workflows).
- Payments/checkout (orders, transactions, balances, refunds).
- CRM (contact pipelines, follow-ups, notes, tasks, campaigns).
- Marketing automation (segments, campaigns, sends, journeys).
- Custom review system (review submissions, ratings stores, moderation queues, review-rating claims without verified data).
- Separate backend (no Express, NestJS, or equivalent; no second database or service-specific stores).
- Unnecessary API abstractions (no queues, webhooks, background jobs, microservices, API gateways, global stores, or repository/state-management infrastructure).
- Enterprise CMS machinery (versions, revisions, audit logs, approval chains, multi-workspace models).
- Large-scale SEO landing-page production or guaranteed rankings/ongoing campaigns.
- Unnecessary third-party integrations or architectural rewrites.

---

## 21. Shot&Prints Reference Boundary

Shot&Prints is the previous/reference website. It is **Reference-Only** and **not** the current brand identity (`docs/PROJECT.md` Section 17; `docs/DESIGN-SYSTEM.md` Section 4; `docs/DATA-MODEL.md` Section 15).

- Shot&Prints material (service characteristics, package pricing, inclusions, add-ons, booking policies, business information, contact details, imagery, FAQs, testimonials, policies) must be verified before being presented as current Melbourne Photobooth Hire information and must not be treated as current API/business data.
- Reference pricing, inclusions, add-ons, and policies must not be modified, reinterpreted, or invented (`docs/PROJECT.md` Section 9).
- Shot&Prints branding, naming, contact information, logos, colors, typography, and brand language must not be used as current project information unless explicitly confirmed.
- No API contract in this document carries Shot&Prints content as confirmed data.

---

## 22. Related Documentation

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

This document:

- `docs/API.md` — API and external service contracts (this document; conceptual behavior and boundaries only, no wire formats).

Future documents (referenced as deferred detail owners, not existing sources):

- `docs/SECURITY.md` — security requirements and constraints (owns auth behavior, authorization rules, RLS policies, secret handling, spam-verification detail, logging policy).
- `docs/TESTING.md` — testing and verification strategy.
- `docs/DEVELOPMENT.md` — local development workflow and commands.
- `docs/DEPLOYMENT.md` — deployment and production procedures.
- `docs/DECISIONS.md` — important architectural and technical decisions.

---

## 23. Acceptance Criteria

This API document is considered complete when:

1. `docs/API.md` exists and is the only file created or modified for this task.
2. Purpose, scope, terminology, and authority boundaries are clearly stated without duplicating implementation detail from other documents.
3. API principles are explicit: Astro Server Endpoints as the backend/API layer, no Express/NestJS or separate backend, server-side validation as enforcement, client-side validation as usability only.
4. The public inquiry submission flow (Customer → Inquiry Form → validation → Astro Server Endpoint → Turnstile verification → EmailJS → client Gmail) is documented, with the confirmed default clearly distinguished from the conditional Supabase persistence branch.
5. The inquiry request contract is stated at the conceptual level only: candidate fields/option lists are marked Confirmation Required with no invented field names, payload structures, formats, or limits, and validation principles are those supported by REQUIREMENTS.
6. Inquiry response behavior covers success-only-on-required-flow-success, validation failure, spam/Turnstile failure, email/service failure, and network/server failure, without exposing internal errors or secrets.
7. Duplicate-submission and submission-state behavior reflects existing requirements and UI-UX documentation, without inventing numeric controls.
8. Turnstile responsibilities (client obtains, server verifies, secret server-side) are documented with no invented credentials, endpoints, environment names, or implementation details.
9. EmailJS responsibilities (selected service, client Gmail destination, server-invoked delivery, success/delivery consistency) are documented with no invented addresses, IDs, templates, parameters, or credentials.
10. Conditional inquiry persistence is marked conditional-only: Supabase storage only on explicit confirmation, EmailJS → Gmail retained, no CRM/reservation/payment/follow-up/availability behavior.
11. CMS/API operations are limited to authenticated, authorized retrieval/edit/save/delete/media operations within the confirmed CMS scope, with exact modules, endpoints, methods, payloads, and fields marked Confirmation Required.
12. Supabase boundaries (PostgreSQL for CMS/content data, Auth for admin authentication, Storage for media) are stated with detailed RLS/authentication rules deferred to `docs/SECURITY.md`.
13. Public content retrieval is limited to confirmed/published content, with drafts, admin data, secrets, and unpublished state excluded.
14. Error handling, validation principles, security/API boundaries, and external-service dependency boundaries are documented with security and database detail correctly delegated to `docs/SECURITY.md` and `docs/DATA-MODEL.md`.
15. The Confirmation Required matrix covers final inquiry fields, required/optional designation, inquiry persistence, CMS modules, CMS fields, endpoint structure, request/response schemas, EmailJS configuration, client Gmail destination, Turnstile configuration, media access model, and additional integrations.
16. Out-of-scope API behavior (real-time availability, reservation/booking engine, payments/checkout, CRM, marketing automation, custom review system, separate backend, unnecessary abstractions) is explicitly excluded, with queues, webhooks, background jobs, microservices, and gateways avoided.
17. Shot&Prints information is treated as Reference-Only, never as current API/business data, and no additional services or libraries are introduced.
18. The design stays appropriately small for the agreed ₱15,000 project and preserves the inquiry/request versus booking/reservation distinction.
19. The document is consistent with all nine source documents, introduces no unsupported endpoint contracts or implementation details, and defers frontend visual behavior to `docs/UI-UX.md` and `docs/DESIGN-SYSTEM.md`.
20. Related documents and this acceptance-criteria section are included.

(End of file)
