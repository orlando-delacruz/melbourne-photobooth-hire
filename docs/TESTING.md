# Melbourne Photobooth Hire — Testing and Verification Strategy

## 1. Purpose and Scope

This document is the authoritative testing and verification strategy for the Melbourne Photobooth Hire project. It answers:

> **What must be verified, how should it be verified at an appropriate level, and what constitutes acceptable completion?**

This is a documentation/specification task only. This document defines **verification expectations, levels, boundaries, and confirmation status**. It does not define:

- Source code, test files, or component implementations.
- Testing libraries, frameworks, browser-testing tools, or CI providers.
- Test commands, coverage thresholds, or browser/device matrices.
- Database schemas, SQL, migrations, tables, columns, or policies.
- Endpoint URLs, methods, payloads, response schemas, or status codes.
- Credentials, keys, IDs, email addresses, URLs, or configuration values.
- Environment variable names or environment file contents.
- Bucket names, storage policies, file limits, MIME rules, or filenames.
- Final page copy, business claims, prices, policies, or contact details.

This is a greenfield project. This document describes the **intended verification direction**, not implemented tests. Implementation status must be verified from the actual repository.

This document governs verification of:

- Public website (Home, Services, Packages, Gallery, About, FAQ, Contact/inquiry, Privacy Policy, Terms & Conditions, 404).
- Inquiry/request workflow (form through validation, Astro Server Endpoint, Turnstile, EmailJS, client Gmail).
- CMS/admin (authentication, authorization, content management, media).
- Integrations (Supabase, EmailJS, Cloudflare Turnstile, Vercel, Google services where applicable).
- SEO, accessibility, performance, security, deployment, and content behavior where applicable.

The following verification kinds are distinguished throughout:

- **Requirement verification** — checking observable system behavior against `docs/REQUIREMENTS.md` and the other source documents. This is the primary meaning of "testing" in this document.
- **Automated testing** — checks executed by tooling where such tooling is established. No specific automated-testing tooling is established by the source documents; any such tooling is **Implementation Decision Required** (see Section 22).
- **Manual testing** — human inspection and interaction (visual layout, responsive behavior, CMS usability, metadata/source output, external links, third-party configuration, production behavior). Manual verification carries significant weight in this project because much of the scope is content, presentation, and integration behavior.
- **Integration testing** — checking interactions across boundaries (form and server endpoint, server validation and Turnstile, server endpoint and EmailJS, CMS UI and Supabase, authentication and protected operations).
- **Browser/end-to-end verification** — exercising critical real user journeys in a real browser where practical. No specific browser-testing tool is established; tooling is **Implementation Decision Required**.
- **Production verification** — checking the deployed production environment (build, domain, HTTPS, pages, CMS reachability, inquiry delivery, SEO files, configuration without secret exposure). Procedures belong in `docs/DEPLOYMENT.md`.

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
- `docs/SECURITY.md` — security requirements and constraints.

Where this document and `docs/REQUIREMENTS.md` disagree on required behavior, `docs/REQUIREMENTS.md` governs what the system must do and the discrepancy should be resolved explicitly. Where this document and `docs/PROJECT.md` disagree on business context, `docs/PROJECT.md` is authoritative. Where this document and `docs/SECURITY.md` disagree on security expectations, `docs/SECURITY.md` governs and the discrepancy should be resolved explicitly.

---

## 2. Testing Principles

1. **Test requirements, not implementation assumptions.** Every check traces to an observable requirement in the source documents. Passing an implementation detail that no requirement establishes proves nothing.
2. **Verify critical user journeys first.** Inquiry submission, core page rendering and navigation, and CMS save behavior take priority over peripheral polish.
3. **Test security boundaries independently from UI behavior.** Hidden navigation, disabled buttons, and client-side checks are usability layers. Authentication, authorization, server-side validation, and server-side verification are enforced separately and verified separately.
4. **Prefer focused tests over excessive test infrastructure.** A small number of meaningful checks proportionate to the fixed **₱15,000** project scope outweighs a large suite covering trivial content.
5. **Test failure states, not only successful paths.** Validation failures, verification failures, delivery failures, network failures, save failures, empty states, and unauthorized access are verified as explicitly as success paths. Failure must never present as success.
6. **Verify responsive and accessible behavior.** Mobile, tablet, and desktop usability, keyboard operation, focus visibility, semantic structure, labelled fields, and text-associated errors are baseline expectations, not enhancements.
7. **Verify external-service boundaries without pretending to control third-party infrastructure.** Application-side behavior (invoking delivery, verifying evidence server-side, handling provider failure gracefully) is verifiable. Provider-internal guarantees are not claimed.
8. **Re-test affected behavior after changes.** Changes trigger risk-based regression verification of the changed feature, its direct dependencies, and related journeys — not blind trust in an untouched suite.
9. **AI-generated code requires explicit verification.** Per `AGENTS.md`, generated implementation is untrusted until inspected against documentation and validated at an appropriate level. A passing build or plausible appearance is not proof of correctness.
10. **Do not claim a feature works without evidence.** Reports distinguish implemented, verified, not verified, failed, blocked, assumed, and confirmation-required items (see Section 20). "Fully tested" is never claimed on the basis of a build or type check alone.

---

## 3. Status Labels

Every verification statement in this document carries one of the following labels:

- **Confirmed** — required by existing documentation cited in the relevant section. May be relied on for planning and must be verified.
- **Conditional** — only verified if the conditional feature is enabled (for example inquiry persistence in Supabase, GA4). Must not be verified as implemented functionality by default.
- **Confirmation Required** — final test behavior cannot be defined until client/business requirements are confirmed (for example final inquiry fields, CMS modules, review URL). Must not be silently converted into a confirmed check.
- **Reference-Only** — historical Shot&Prints information. Never a production test requirement and never acceptance criteria (see Section 24).
- **Implementation Decision Required** — implementation or testing tooling detail not yet established by any source document (for example test framework, browser tooling, CI, coverage thresholds). Must not be invented here.

No statement in this document introduces a new Confirmed business fact, requirement, or technical decision beyond what the source documents already establish.

---

## 4. Test Levels

### 4.1 Static/code-level verification — Confirmed as an expectation, tooling as Implementation Decision Required

Covers checks that do not execute user journeys:

- TypeScript/type checking where configured.
- Build validation (the production build succeeds).
- Linting if configured.
- Source inspection (branding, secrets, structure, diff review).
- Dependency/configuration review (no unnecessary dependencies, no committed secrets, environment-appropriate configuration).

No specific commands, tools, or configurations are established by the source documents, so none are stated here. Where a check is available in the repository, it is run; where it is not established, it is **Implementation Decision Required**. Static checks alone never constitute proof that a feature works (see Section 18).

### 4.2 Unit/component testing — Conditional on meaningful logic, scope as Implementation Decision Required

Unit or component tests are used only where they provide clear value, such as:

- Validation logic (for example shared inquiry/CMS validation schemas, once fields are confirmed).
- Pure utilities.
- Complex interactive components.
- Important state transitions (for example submission lifecycle handling).

Unit tests are **not** required for every Astro content section or trivial presentational component. Whether any unit-test tooling or scope is adopted is **Implementation Decision Required**; no framework, command, or coverage expectation is invented here.

### 4.3 Integration testing — Confirmed

Covers interactions between boundaries defined in `docs/ARCHITECTURE.md` and `docs/API.md`:

- Inquiry form and Astro Server Endpoint (submission reaches the server; server re-validates independently of client checks).
- Server validation and Turnstile (only validated, spam-verified submissions proceed; verification is enforced server-side).
- Server endpoint and EmailJS (validated, verified submissions are accepted for delivery; delivery failure produces an error, not false success).
- CMS UI and Supabase (authenticated, authorized, validated content operations persist and render predictably).
- Authentication and protected CMS operations (unauthenticated access rejected; authorized actions succeed; unauthorized actions rejected server-side).

### 4.4 Browser/end-to-end verification — Confirmed as an expectation, tooling as Implementation Decision Required

Covers critical real user journeys exercised in a real browser where practical (see Section 17 for journey selection). Tooling, if any, is **Implementation Decision Required**; no browser-testing tool is established by the source documents.

### 4.5 Manual verification — Confirmed

Used for behavior that is most reliably judged by a person:

- Visual layout.
- Responsive behavior.
- Accessibility interaction (keyboard, focus, screen-reader meaning where applicable).
- CMS usability.
- SEO metadata and delivered-HTML/source output.
- External links.
- Third-party configuration.
- Production behavior.

---

## 5. Public Website Testing

Pages in scope (**Confirmed**, per REQ-PUB-001 through REQ-PUB-033, REQ-NAV-001 through REQ-NAV-008, `docs/PROJECT.md` Section 15, `docs/ARCHITECTURE.md` Section 6.1):

Home, Services, Packages, Gallery, About, FAQ, Contact/inquiry, Privacy Policy, Terms & Conditions, 404. Supporting system pages or states (for example an enquiry confirmation state) are verified only where required by the implemented flow (REQ-PUB-032, **Conditional**).

For each applicable page, verify:

- **Correct routes.** Each principal page is reachable at its implemented route; unknown routes render the 404 page (REQ-PUB-030, REQ-STA-009).
- **Correct current branding.** Every public page presents Melbourne Photobooth Hire throughout (REQ-PUB-001). Verification method: source and rendered inspection.
- **Crawlable content.** Core content is present in delivered HTML, not assembled client-side after load (`docs/ARCHITECTURE.md` Sections 3.1, 7).
- **Navigation.** Consistent primary navigation across pages (REQ-NAV-001); Home, Services, Packages, Gallery, About, FAQ, and Contact/inquiry reachable (REQ-NAV-002); functional mobile navigation exposing the same destinations (REQ-NAV-003); logical hierarchy with minimal steps (REQ-NAV-004); footer repeats principal destinations plus legal pages (REQ-NAV-008, **Should**).
- **Primary inquiry CTA.** Present at appropriate decision points including services, packages, and contact contexts (REQ-NAV-005, REQ-PUB-003, REQ-PUB-008, REQ-PUB-015, REQ-PUB-023, REQ-INQ-004).
- **Secondary CTAs.** Explore-services, view-packages, view-gallery, learn-more, and review paths support the journey without displacing the inquiry CTA (`docs/UI-UX.md` Sections 4.2, 15–16).
- **Internal links.** Related content connected (services to packages, packages to inquiry, homepage to gallery and FAQ) (REQ-NAV-006).
- **External links.** Confirmed external destinations labelled and functional; the review CTA communicates it leads to Google (`docs/UI-UX.md` Section 16). No placeholder or guessed URLs published (REQ-REV-004).
- **Loading behavior where applicable.** Asynchronously loaded content shows appropriate feedback without layout breakage (REQ-STA-001).
- **Empty states where applicable.** Empty gallery shows a clear empty state (REQ-GAL-005, REQ-STA-007); other empty content areas show a sensible fallback or are handled per confirmed content rules, never broken layouts (REQ-STA-008).
- **Error behavior.** Network or API failures affecting user-visible functionality produce clear, non-technical feedback (REQ-STA-010); 404 provides navigation back to valid content (REQ-PUB-031).
- **No accidental Shot&Prints branding/content.** No Shot&Prints naming, branding, pricing, policies, contact details, testimonials, imagery claims, or functionality appears as current content (**Confirmed** as a negative check; Shot&Prints material itself is **Reference-Only**, see Section 24).

Page-specific expectations:

- **Home (Confirmed):** communicates what is offered and for which event contexts (REQ-PUB-006); entry points to services, packages, gallery, FAQ, and inquiry (REQ-PUB-007); clear inquiry CTA (REQ-PUB-008); review CTA only where placement is appropriate (REQ-PUB-009, **Should**).
- **Services (Confirmed):** presents confirmed service categories with client-confirmed descriptions only (REQ-PUB-010, REQ-PUB-011, REQ-SVC-001 through REQ-SVC-007); path to packages and inquiry (REQ-PUB-012, REQ-SVC-006); Shot&Prints reference characteristics never presented as confirmed claims (REQ-SVC-004).
- **Packages (Confirmed):** presents duration, price, inclusions, and conditions only as confirmed (REQ-PUB-013, REQ-PUB-014, REQ-PKG-001, REQ-PKG-006 through REQ-PKG-008); path to inquiry (REQ-PUB-015); no invented pricing or policies.
- **Gallery (Confirmed):** real client-supplied or approved imagery only (REQ-GAL-001, REQ-GAL-008); responsive presentation (REQ-GAL-002); accurate descriptive alt text per image (REQ-GAL-003, REQ-PUB-018); efficient loading (REQ-GAL-004); graceful empty state (REQ-GAL-005, REQ-PUB-017).
- **About (Confirmed):** client-confirmed company information only; no invented history, founder/team details, or claims (REQ-PUB-019, REQ-PUB-020).
- **FAQ (Confirmed):** clearly distinguishable questions and answers (REQ-FAQ-001); mobile-usable presentation (REQ-FAQ-002); client-confirmed content only (REQ-FAQ-003); answers consistent with confirmed service/package/policy information (REQ-FAQ-006); structured data only where valid for published content (REQ-FAQ-005, **Could**).
- **Contact/inquiry (Confirmed):** inquiry access from principal pages (REQ-PUB-023); inquiry-based model followed (REQ-PUB-024); clear success and error feedback (REQ-PUB-025); full inquiry checks per Section 6.
- **Privacy Policy and Terms & Conditions (Confirmed pages; content is Confirmation Required):** pages exist (REQ-PUB-026, REQ-PUB-028); final content is client-approved and reflects actual handling/policies; no invented retention, legal, contractual, cancellation, or insurance terms (REQ-PUB-027, REQ-PUB-029, REQ-SEC-009).
- **404 (Confirmed):** user-friendly page for unknown routes with navigation back to valid content (REQ-PUB-030, REQ-PUB-031, REQ-STA-009).

No final page copy is defined in any source document and none is invented here. Content correctness beyond the boundaries above (exact wording, final claims) requires client confirmation before publication.

---

## 6. Inquiry / Booking Request Testing

Terminology is **inquiry/request**, not reservation or booking engine (**Confirmed**, per REQ-INQ-001, REQ-INQ-020, `docs/PROJECT.md` Section 10, `docs/ARCHITECTURE.md` Section 9, `docs/API.md` Sections 4–5).

Documented flow under test (**Confirmed**):

```text
Customer → Inquiry Form → Validation → Astro Server Endpoint → Turnstile → EmailJS → Client Gmail
```

Real-time availability, calendar reservation, payment processing, checkout, automated reservation allocation, complex CRM, and complex booking management are explicitly excluded and must not be tested as expected behavior (REQ-INQ-003, REQ-INQ-020).

### 6.1 Form behavior — Confirmed

Verify against REQ-INQ-004 through REQ-INQ-016, REQ-STA-003 through REQ-STA-005, REQ-STA-010, REQ-ACC-004 through REQ-ACC-006, and `docs/UI-UX.md` Sections 13–14:

- **Initial state.** Form ready for input with labels, required/optional indication, and instructions; no errors or progress shown.
- **Field labels.** Every field has a programmatically associated label using customer-friendly wording (REQ-INQ-006).
- **Required/optional behavior once confirmed.** Required and optional fields clearly distinguished. The final field set and required-versus-optional designation are **Confirmation Required** (REQ-INQ-008 through REQ-INQ-010); only the confirmed set is tested.
- **Client-side validation.** Submissions validated before sending at minimum for required-field presence, email format, and confirmed format rules (REQ-INQ-012).
- **Field-associated errors.** Errors communicated near the relevant field, summarized where appropriate, in text associated with the field and not by color alone (REQ-INQ-013, REQ-ACC-006); focus directed to the summary or first invalid field.
- **Keyboard operation.** All fields and controls reachable and operable by keyboard with visible focus and logical order (REQ-INQ-006, REQ-ACC-004).
- **Submission state.** Submission-in-progress feedback shown; repeat submission disabled while processing (REQ-STA-003).
- **Duplicate-submit prevention.** Double activation while in flight produces a single submission outcome (REQ-STA-003; `docs/API.md` Section 8).
- **Success state.** Clear success feedback with next-step explanation, reported only when the inquiry was accepted for delivery (REQ-INQ-015, REQ-INQ-018); programmatically exposed with managed focus.
- **Email/service failure.** Clear, non-technical error with next-step guidance; no false success; no technical details exposed (REQ-INQ-016, REQ-STA-005).
- **Turnstile failure.** Clear, non-technical "could not be verified" message with a reasonable next step; verification internals never exposed (`docs/UI-UX.md` Section 14.7; `docs/API.md` Section 7).
- **Network/server failure.** Clear connection-problem message with retry guidance (REQ-STA-010).
- **Preservation of entered data where practical.** Validation failures and recoverable submission/network failures do not wipe the form without cause.

### 6.2 Server behavior — Confirmed

Verify against REQ-SEC-003, REQ-INQ-012 through REQ-INQ-019, `docs/ARCHITECTURE.md` Section 14, `docs/API.md` Sections 4–7, and `docs/SECURITY.md` Sections 5–6, 10:

- **Server-side validation.** Every submission re-validated at the server boundary independently of client checks; client checks never substitute for enforcement.
- **Rejection of invalid input.** Invalid submissions rejected before delivery with field-identifying, non-technical feedback.
- **Turnstile verification.** Challenge evidence verified server-side where applicable before the submission is treated as legitimate; client-side presence alone never suffices.
- **Email delivery only after appropriate validation/verification.** Only validated, spam-verified submissions reach delivery (REQ-INQ-018).
- **No false success.** Success is reported only when the inquiry was accepted for delivery; delivery failure produces an error.
- **Safe error responses.** User-facing messages are clear and non-technical with next-step guidance; diagnostics recorded server-side only, never returned to untrusted callers.
- **No sensitive diagnostics exposed.** No stack traces, database errors, service credentials, verification internals, or implementation details in responses.

### 6.3 Conditional persistence — Conditional

Supabase storage of inquiry records exists **only** if explicitly confirmed as a CMS requirement (**Conditional**, per `docs/PROJECT.md` Section 10, `docs/TECH-STACK.md` Section 13, `docs/ARCHITECTURE.md` Section 10, `docs/DATA-MODEL.md` Section 11, `docs/API.md` Section 11, `docs/SECURITY.md` Section 12).

If confirmed, verify:

- Successful record creation for a valid submission.
- Authorization: only permitted authenticated callers can view or modify records.
- Unauthorized users (including all public callers) cannot access records; no public read path exists.
- Stored data matches the confirmed fields.
- Failure behavior: combined email-plus-persistence failure semantics behave per the confirmed requirement (combined semantics themselves are **Confirmation Required**; no behavior is assumed here).

If persistence is not confirmed, it is **not** tested as implemented functionality, and its absence is not a failure.

### 6.4 Email — Confirmed

Verify against REQ-EML-001 through REQ-EML-004 and REQ-INQ-018:

- A valid inquiry is accepted for delivery and reaches the intended client mailbox during real integration verification.
- The received inquiry contains sufficient detail to follow up, based on the confirmed form fields (REQ-EML-002).
- Success feedback to the customer stays consistent with acceptance for delivery; delivery failure produces a clear error, not false success.
- Delivery functions in the production environment with production configuration (REQ-EML-004, REQ-DEP-005).

No email address, EmailJS template, service identifier, parameter set, or configuration value is established by the source documents. None is invented here; all such detail is **Confirmation Required**.

---

## 7. CMS/Admin Testing

Product-level expectations only. Exact CMS modules, editable areas, and fields are **Confirmation Required** (REQ-CMS-012, REQ-CON-002). Nothing in this section authorizes inventing a module or field.

### 7.1 Authentication — Confirmed

Verify against REQ-CMS-002, REQ-SEC-001, `docs/ARCHITECTURE.md` Section 12, `docs/API.md` Section 12, and `docs/SECURITY.md` Sections 2, 15:

- **Unauthenticated users cannot access CMS functionality.** No anonymous, shared, or implicit path into any CMS surface or operation.
- **Authenticated users can access the intended CMS surface** per the implemented Supabase Auth flow.
- **Invalid/failed authentication behaves safely.** Non-technical feedback; no bypass; no disclosure beyond what security policy permits.
- **Session behavior verified according to the implemented Supabase Auth flow.** Session handling, expiry, and recovery (including expired-session guidance and preservation of unsaved work where practical) are checked against what is actually implemented, since final flow detail is **Confirmation Required** (`docs/SECURITY.md` Section 20).

### 7.2 Authorization — Confirmed

Verify against REQ-CMS-003, REQ-SEC-002, `docs/ARCHITECTURE.md` Sections 11–13, `docs/API.md` Section 12, `docs/DATA-MODEL.md` Section 13, and `docs/SECURITY.md` Sections 3–4:

- **Protected operations require authorization.** Every content read/write and media operation is subject to server-side authorization.
- **Client-side route hiding is not treated as sufficient.** Direct access attempts to protected operations without authorization are rejected server-side.
- **Unauthorized content/data access is rejected** without exposing admin data, secrets, or internals.
- **Public users cannot access admin data.** Drafts, unpublished state, admin identities, sessions, authorization internals, and stored inquiry records (if ever confirmed) never appear in public output.

The authorization/role model itself is **Confirmation Required**; no roles or permissions are invented for testing purposes.

### 7.3 Content management — Confirmed behavior, Confirmation Required scope

For each **confirmed** CMS module (candidate areas only where confirmed — services, packages, gallery, FAQs, general website content, contact/business information per REQ-CON-002; no fields defined by any source document), verify where applicable:

- **Create, read, update, and delete** behavior for the confirmed areas (REQ-CMS-005).
- **Validation.** Admin input validated; invalid content rejected with clear, field-associated, non-technical messages (REQ-CMS-006).
- **Save state.** Pending save disables conflicting actions; outcome always resolves into a clear success or failure message (REQ-CMS-008, REQ-CMS-009).
- **Save failure.** Clear error stating content was not saved with next-step guidance; entered edits preserved during recoverable failures where practical (REQ-STA-006).
- **Success confirmation.** Clear confirmation stating content was saved and, per the implemented workflow, what that means for the public site (REQ-CON-004).
- **Cancel behavior.** Leaving without saving is explicit and safe; cancel never silently saves; discarding changes requires client intent; unsaved changes clearly indicated (`docs/UI-UX.md` Sections 23–24).
- **Empty state.** Empty lists or areas explain the state plainly with guidance toward creating content where supported; never broken layouts or raw errors.
- **Loading state.** Content fetching and saving show loading feedback (REQ-CMS-009, REQ-STA-002).
- **Destructive-action confirmation.** Delete and remove operations require explicit confirmation naming the affected content in business terms; never one accidental click (REQ-CMS-007).
- **Published/unpublished behavior where applicable.** Only where a publishing workflow is confirmed (the workflow itself is **Confirmation Required** per `docs/DATA-MODEL.md` Section 8): published content reaches the public site predictably; unpublished edits do not.

### 7.4 Media — Conditional on implemented media management

Where media management is implemented (REQ-CMS-010; `docs/ARCHITECTURE.md` Section 17; `docs/DATA-MODEL.md` Section 9), verify:

- Upload, validation, preview where applicable, replacement, removal (with confirmation), and access control.
- Public/private behavior according to the confirmed model (the access model itself is **Confirmation Required**).
- Failure states: clear, non-technical feedback; surrounding content intact; no broken layout as the primary presentation.

No file limits, bucket names, MIME rules, folder layouts, filenames, or storage policies are established by the source documents. None is invented here; all such detail is **Confirmation Required**.

---

## 8. Authentication and Security Testing

Testing in this section maps directly to `docs/SECURITY.md`. Where `docs/SECURITY.md` marks an item **Confirmation Required**, this document does not define final test behavior for it.

Verify (**Confirmed**):

- **Authentication boundaries.** Supabase Auth gates CMS/admin access; unauthenticated users reach no CMS functionality (`docs/SECURITY.md` Section 2).
- **Authorization boundaries.** Authenticated actions respect authorization rules; every CMS operation enforced server-side (`docs/SECURITY.md` Section 3).
- **Server-side enforcement.** Client assertions about identity, permission, validity, or workflow state carry no authority; server re-validates and re-authorizes (`docs/SECURITY.md` Section 10).
- **RLS behavior once actual policies exist.** Supabase access control prevents public retrieval from bypassing CMS authorization. Exact policies are **Confirmation Required** (`docs/SECURITY.md` Sections 4, 20); only actually implemented policies are tested — no policy is assumed.
- **Public vs admin access.** Public callers receive only intentionally published HTML plus the inquiry boundary; admin data never leaks into public paths (`docs/SECURITY.md` Sections 3–4).
- **No secrets in source.** No secrets, keys, or credentials in code or Git history.
- **No secrets in Git.** History included, not just the working tree.
- **No secrets in browser bundles.** Browser-delivered JavaScript carries no secrets, private keys, or credentials; any client-visible configuration is public by design.
- **No secrets in responses/logs.** User-facing messages, server responses to untrusted callers, and diagnostic output visible outside server-side handling carry no sensitive material.
- **Server-side input validation.** All inquiry and CMS input validated at appropriate boundaries; invalid content rejected (`docs/SECURITY.md` Section 9).
- **Injection/XSS protections appropriate to implemented content handling.** Untrusted or CMS-authored content cannot execute as code beyond explicitly confirmed behavior; stored content rendered into public HTML treated as data unless rich-content behavior is explicitly confirmed (`docs/SECURITY.md` Section 9). No specific library or allowlist is assumed.
- **Safe error responses.** Clear, non-technical, actionable messages; diagnostics server-side only (`docs/SECURITY.md` Section 10).
- **Turnstile server verification.** Evidence verified server-side where applicable before legitimacy; secrets server-side; failure non-technical (`docs/SECURITY.md` Section 6).
- **Inquiry abuse/duplicate-submission protection.** Submission-in-progress state with disabled repeat submission; each attempt resolves into exactly one outcome (`docs/SECURITY.md` Section 14).
- **Storage access control.** Retrieval honors the confirmed public/private model; intentionally published media retrievable for rendering; non-public media has no public path (`docs/SECURITY.md` Section 11). The model itself is **Confirmation Required**.
- **Admin data isolation.** Admin identities, sessions, authorization internals, stored inquiry records if ever confirmed, secrets, and diagnostics never appear in public rendering or user-facing errors.

Formal penetration testing, security certification, and compliance certification are **not** claimed or required unless explicitly commissioned. Advanced controls such as rate limiting, CSP, idempotency, and additional abuse infrastructure are **Conditional** where not confirmed — duplicate-submission prevention behavior is **Confirmed**, but numeric controls, mechanisms, and policy values are **Confirmation Required** (`docs/SECURITY.md` Sections 14, 16, 20).

---

## 9. Accessibility Testing

Verify the requirements in `docs/REQUIREMENTS.md` (REQ-ACC-004 through REQ-ACC-012), `docs/UI-UX.md` (Section 18), and `docs/DESIGN-SYSTEM.md`, using manual verification as the primary method:

- **Keyboard navigation.** All interactive elements reachable and operable by keyboard in logical order with no traps (REQ-ACC-004).
- **Visible focus.** Focus always perceivable; not communicated through color alone (REQ-ACC-004).
- **Semantic HTML.** Landmarks, headings, lists, navigation, forms, and buttons use correct elements (REQ-ACC-007).
- **One H1 per page where applicable.** Each public page exposes exactly one H1 reflecting the page topic (REQ-SEO-005, REQ-ACC-007).
- **Form labels.** Every field has a programmatically associated label; instructions and error text associated with their fields (REQ-ACC-005).
- **Accessible field errors.** Errors explain what is wrong and how to fix it in plain language, associated with the field, with a summary where appropriate (REQ-ACC-006).
- **Error communication not relying only on color.** Error, success, and required-field states always include text or structural cues (REQ-ACC-006).
- **Accessible names for interactive controls.** Menu triggers, dialog/lightbox controls, FAQ toggles, and icon-only buttons expose meaningful names with predictable behavior (REQ-ACC-009).
- **Gallery/lightbox dialog behavior if implemented.** Focus moves into the dialog on open, Escape closes it, focus returns to the invoking element, background content not interactable, adjacent-image navigation keyboard-operable where offered (`docs/UI-UX.md` Section 10).
- **Navigation accessibility.** Landmarks, current-page state, and menu open/close state programmatically exposed; focus returns appropriately on menu close (`docs/UI-UX.md` Sections 6, 18).
- **Touch-target usability.** Menu trigger, CTAs, FAQ toggles, lightbox controls, and form controls comfortably operable by touch as well as mouse and keyboard (`docs/UI-UX.md` Section 17).
- **Reduced-motion behavior where animation exists.** Non-essential animation disabled or reduced under reduced-motion preference; state changes remain understandable without motion (REQ-ACC-011).
- **Reasonable contrast.** Text and essential UI meet appropriate readability contrast (REQ-ACC-008). No specific values are invented here; specifics belong in `docs/DESIGN-SYSTEM.md`.
- **Meaningful alt text for meaningful images.** Accurate, descriptive alt text reflecting actual content (REQ-ACC-010, REQ-GAL-003).
- **Decorative images handled appropriately.** Treated as decorative through the implemented mechanism rather than given misleading descriptions (REQ-ACC-010).

Formal WCAG certification is not claimed (REQ-ACC-012). Any conformance claim requires actual evaluation, which is not defined here.

---

## 10. Responsive Testing

Verify at minimum (**Confirmed**, per REQ-ACC-001 through REQ-ACC-003):

- Mobile.
- Tablet.
- Desktop.

For each tier, test where applicable:

- **Navigation.** Desktop persistent navigation; compact header with accessible menu trigger below the desktop tier; same destinations in both (`docs/UI-UX.md` Sections 6, 17).
- **Hero/content layout.** Single-column stacking on narrow viewports; multi-column splits where comfortable on wider viewports; no loss of essential content or function.
- **Service/package presentation.** Cards stack vertically on narrow viewports with usable CTAs; grids on wider viewports with consistent information order.
- **Gallery.** Grid reflows across tiers without distortion, essential-content cropping, or horizontal overflow (REQ-GAL-002).
- **Forms.** Fields stack vertically on narrow viewports; labels stay associated and visible; validation messages reflow alongside their fields; no horizontal scrolling.
- **CMS/admin where applicable.** Admin surfaces remain practical on smaller screens (REQ-CMS-011, **Should**); wide surfaces reflow or scroll within their own region; primary actions remain reachable.
- **Buttons and touch targets.** Practical sizing and spacing for touch on small screens.
- **Text wrapping.** Readable line lengths without zooming; no text requires horizontal scrolling.
- **Overflow.** No page requires horizontal scrolling for essential content or actions at any supported tier.
- **Images.** Appropriate proportions at every tier; no distortion or layout breakage.
- **Dialog/lightbox where applicable.** Usable and dismissible at every tier.

No exact browser/device matrix is established by the source documents. None is invented here; any final matrix is **Implementation Decision Required**.

---

## 11. SEO Testing

Verify the SEO requirements (REQ-SEO-001 through REQ-SEO-023, REQ-ANA-001 through REQ-ANA-005) without claiming rankings. No ranking is promised or guaranteed (REQ-SEO-022). Manual source-output inspection is the primary method.

- **Crawlable HTML.** Core content present in delivered HTML; content pages readable, navigable, and crawlable without depending on client-side JavaScript (REQ-SEO-014).
- **Page titles.** Each public page has a unique page title (REQ-SEO-003).
- **Meta descriptions.** Each public page has a unique meta description (REQ-SEO-004).
- **One meaningful H1.** Exactly one H1 per page reflecting the page topic (REQ-SEO-005).
- **Heading hierarchy.** Correct H1/H2 nesting with logical structure (REQ-SEO-005, REQ-SEO-006).
- **Canonical URLs.** Public pages expose canonical URLs (REQ-SEO-008); production canonicals use the correct production domain.
- **Internal links.** Related pages connected per REQ-SEO-007 and REQ-NAV-006.
- **XML sitemap.** Exposed and reachable in production (REQ-SEO-009, REQ-DEP-006), generated via the selected integration.
- **robots.txt.** Exposed and reachable in production (REQ-DEP-006); permits crawling of public content while excluding non-public areas where appropriate, including admin routes (REQ-SEO-010).
- **Relevant structured data.** Schema.org JSON-LD included where technically and semantically valid for the page content (REQ-SEO-011); FAQ structured data only for confirmed published Q&A, never invented content (REQ-FAQ-005).
- **Open Graph metadata where implemented.** Included where appropriate (REQ-SEO-012, **Should**).
- **Image alt text.** Accurate alt text on informative images (REQ-SEO-013).
- **Image optimization.** Images optimized for web delivery (REQ-SEO-013, REQ-PER-002, REQ-GAL-004).
- **Mobile usability.** Mobile-friendly pages (REQ-SEO-015); see Section 10.
- **Indexability.** Public pages indexable unless an explicit reason excludes a page (for example admin routes) (REQ-SEO-014).
- **No accidental noindex/blocking.** Production does not carry staging-only exclusions or blocking rules.
- **Correct production URLs.** Sitemap, canonicals, and metadata reference the production domain, not staging or placeholder domains.
- **404 behavior.** Unknown routes render the recovery page; status and navigation handling per the implemented approach (REQ-STA-009).
- **Search Console readiness.** Website ready for verification and monitoring (REQ-SEO-018, REQ-ANA-001). No tracking or verification values are invented.
- **Google Business Profile linkage/readiness.** Profile linked where appropriate once confirmed (REQ-SEO-019, **Should**; REQ-ANA-002, **Should**).
- **Google review CTA points to the client-confirmed review destination.** The CTA links to the client-supplied review URL; no placeholder or guessed URL published (REQ-REV-001 through REQ-REV-004; REQ-ANA-003).

Target search-intent coverage (photobooth Melbourne, photo booth hire Melbourne, photobooth rental Melbourne, wedding photobooth Melbourne, 360 photobooth Melbourne, corporate photobooth Melbourne, event photobooth Melbourne, photobooth hire near me) is verified as natural, customer-focused representation in genuine content (REQ-SEO-001, REQ-SEO-002) — never keyword stuffing (REQ-SEO-020) and never unnecessary landing pages (REQ-SEO-021). Large-scale SEO landing-page production and ongoing SEO campaigns are not tested as expected behavior.

---

## 12. Performance Testing

Practical verification proportionate to the project scope, against REQ-PER-001 through REQ-PER-008, `docs/TECH-STACK.md` Sections 4–5, and `docs/ARCHITECTURE.md` Section 23:

- **Minimal unnecessary client JavaScript.** Content-heavy pages ship little or no JavaScript (REQ-PER-004).
- **Astro-first rendering.** Pages render as efficient server-rendered/static HTML consistent with the SEO-friendly architecture (REQ-PER-006).
- **React islands only where needed.** Interactivity limited to hydrated islands; static content never pays hydration cost.
- **Optimized images.** Appropriate format, sizing, and compression per technical implementation (REQ-PER-002); lazy loading for below-the-fold or non-critical images only where it helps without harming UX or SEO (REQ-PER-003, **Should**).
- **Avoidance of unnecessary dependencies.** No page weight or complexity from unjustified dependencies (REQ-PER-005).
- **Page loading behavior.** Fast loading on typical mobile and desktop connections using practical optimization (REQ-PER-001); no artificial loading screens for server-rendered content.
- **Core Web Vitals readiness.** Considered during implementation (REQ-PER-007); readiness observed, not guaranteed.
- **Mobile performance.** Content usable and timely on small screens and typical mobile connections.
- **Large media handling.** Gallery and supporting imagery load progressively without broken layouts or large destabilizing shifts.

No numeric performance target (seconds, scores, percentiles) is established by any source document (REQ-PER-008). None is invented here. Performance verification is not an enterprise load-testing program (see Section 23).

---

## 13. Error, Loading, Empty, and Recovery Testing

State-based verification against REQ-STA-001 through REQ-STA-010, `docs/UI-UX.md` Sections 20–22, `docs/ARCHITECTURE.md` Section 21, and `docs/API.md` Sections 7, 15. Final user-facing copy is not defined in the source documents and is not asserted here; behavior is.

Cover:

- **Page loading.** Asynchronously loaded public content shows appropriate feedback without layout breakage (REQ-STA-001).
- **Content loading failure.** Clear, non-technical feedback with next-step guidance; no broken layout or exposed internals.
- **CMS loading.** Fetching shows loading feedback; failures show clear errors with retry guidance (REQ-CMS-009, REQ-STA-002).
- **CMS saving.** Pending save indicated with conflicting actions guarded; success confirmed; failure states content was not saved with next steps (REQ-CMS-008, REQ-CMS-009, REQ-STA-006).
- **Form validation.** Errors identify affected fields with corrections in plain language; submission blocked until corrected (REQ-STA-004).
- **Form submission.** In-progress state with duplicate-submission prevention; exactly one outcome per attempt (REQ-STA-003).
- **Turnstile failure.** Non-technical rejection with next-step guidance; internals never exposed.
- **Email failure.** Non-technical error with guidance; no false success; no technical details (REQ-STA-005).
- **Network failure.** Clear feedback for user-visible network/API failures (REQ-STA-010).
- **Database failure where applicable.** Supabase-backed functionality (CMS operations and, only if confirmed, inquiry persistence) fails with clear admin/user-facing errors without exposing internals.
- **Empty gallery.** Clear empty state, not a broken layout or error (REQ-GAL-005, REQ-STA-007).
- **Empty content.** Sensible fallback or omission per confirmed content rules; never broken layouts (REQ-STA-008).
- **Missing media.** Absent or failed images do not break layout; grid and surrounding content intact; no raw error as the primary presentation.
- **404.** User-friendly page with navigation back to valid content (REQ-STA-009).
- **Unauthorized CMS access.** Rejected server-side with safe feedback; no admin data disclosed.

For every state above, verify:

- Clear user-facing messaging in plain, non-technical language.
- No false success under any failure.
- No sensitive diagnostics in user-visible output.
- A useful recovery path (retry, correct input, alternative confirmed contact path, return to valid content).
- Entered data preserved where practical (form input, CMS edits during recoverable failures).

---

## 14. Data Integrity Testing

Verify, without defining schema or SQL (which belong in `docs/DATA-MODEL.md` and implementation once confirmed):

- **CMS edits persist correctly.** Saved content is retrievable as saved through the confirmed workflow.
- **Published content matches intended content.** Public rendering reflects what was saved and published per REQ-CON-004; no stale, mixed, or placeholder content presented as fact (REQ-CON-003).
- **Invalid data cannot be saved.** Validation rejects invalid CMS input with clear messages (REQ-CMS-006).
- **Unauthorized changes are rejected.** Unauthenticated or unauthorized write attempts fail server-side without modifying content (REQ-CMS-002, REQ-CMS-003, REQ-SEC-002).
- **Deletions affect only intended content.** Destructive actions, guarded by explicit confirmation naming the affected content (REQ-CMS-007), remove only that content; the public site degrades to a sensible fallback or empty state, never a broken layout (REQ-STA-007, REQ-STA-008).
- **Media references do not become unexpectedly broken.** Replacement and removal behave predictably (REQ-CMS-010); public pages show intact media or graceful missing-media handling, not broken references as the primary presentation.
- **Conditional inquiry persistence behaves correctly if enabled.** Stored records, if the feature is confirmed, are complete, match the confirmed fields, remain admin-only, and handle failures per the confirmed combined semantics. If not confirmed, persistence is not expected.

---

## 15. Third-Party Integration Testing

Application-side verification only. For each integration, what the application can check is distinguished from what requires the external provider and what cannot be guaranteed. No account IDs, credentials, configuration values, or provider guarantees are invented here.

- **Supabase (Confirmed foundation).** Application can verify: authenticated, authorized, validated CMS operations succeed; published-only public retrieval; unauthorized access rejected server-side; storage upload/replacement/removal behave predictably. Requires provider: operation of the managed data platform within its own boundary. Cannot be guaranteed by application tests: provider-internal availability or performance.
- **EmailJS (Confirmed direction).** Application can verify: server invokes delivery for validated, verified submissions without exposing sensitive configuration; success/delivery consistency holds; failure produces a clear error. Requires provider/configuration: valid production configuration and delivery toward the destination mailbox. Cannot be guaranteed: provider-internal delivery guarantees beyond acceptance for delivery.
- **Cloudflare Turnstile (Confirmed direction).** Application can verify: challenge present client-side; evidence verified server-side where applicable; secrets server-side; failure non-technical. Requires provider: operation of the challenge/verification service. Cannot be guaranteed: provider-internal verdict semantics beyond the documented boundary.
- **Vercel (Confirmed platform).** Application can verify: production build succeeds; deployment serves traffic over HTTPS; production configuration set without committed secrets. Requires provider: operation of the hosting/deployment platform. Cannot be guaranteed: provider-internal infrastructure behavior.
- **Google Search Console where applicable (Confirmed readiness).** Application can verify: readiness for verification and monitoring (reachable sitemap/robots, indexable public pages, no accidental blocking). Requires provider: Google-side verification and indexing behavior. Cannot be guaranteed: indexing outcomes or timing.
- **Google Business Profile/review link where applicable (Confirmed mechanism; URL is Confirmation Required).** Application can verify: review CTA present in an appropriate location, correctly labelled as leading to Google, linking to the client-supplied URL once confirmed. Requires client: supplying the actual review URL. Cannot be guaranteed: Google-side profile or review-flow behavior.
- **Conditional GA4 (Conditional / Could).** Verified only if confirmed and adopted (REQ-ANA-004): application can verify presence functions without breaking rendering, forms, or accessibility, and Privacy Policy implications handled. Requires provider: Google-side analytics behavior. Cannot be guaranteed: analytics data outcomes. If not confirmed, GA4 is not expected.

---

## 16. Deployment / Production Verification

Before production completion, verify (**Confirmed**, per REQ-DEP-001 through REQ-DEP-007). Exact deployment procedures belong in `docs/DEPLOYMENT.md` and are not defined here.

- **Production build succeeds.**
- **Production domain resolves correctly** to the confirmed production domain (REQ-DEP-002).
- **HTTPS works** for production traffic (REQ-DEP-004).
- **Public pages render** with working navigation (REQ-DEP-007).
- **CMS/admin reachable only as intended.** Admin surfaces require authentication; unauthenticated access rejected; admin routes excluded from indexing.
- **Authentication works** through the implemented Supabase Auth flow.
- **Inquiry form works** end to end in production (REQ-DEP-005).
- **Turnstile works** in production (challenge present, verification enforced).
- **Email delivery works** in production with production configuration (REQ-EML-004, REQ-DEP-005).
- **No secrets are exposed** in source, bundles, responses, or logs.
- **Sitemap is reachable** (REQ-DEP-006).
- **robots.txt is reachable** with correct public/admin treatment (REQ-DEP-006).
- **Canonical URLs use the correct production domain.**
- **404 works** with recovery navigation.
- **No test/subdomain branding remains.** No staging, placeholder, or development identity in production output.
- **No Shot&Prints content remains unintentionally.** Current brand and confirmed content only.
- **Google/Search Console readiness is correct** (verifiable pages, no accidental blocking).
- **Client-approved review link is correct.** The published URL is exactly the client-supplied link; no placeholder or guessed URL.
- **Environment configuration is correct without exposing secrets** (REQ-DEP-003): production email, CMS, and integrated-service configuration set in the hosting environment, nothing sensitive committed or client-exposed.

---

## 17. Regression Testing

Practical, risk-based regression — not an exhaustive suite for every trivial change.

After changes, re-test (**Confirmed** as an expectation):

- **The changed feature** against its requirements and failure states.
- **Direct dependencies** (for example shared validation schemas, shared layouts, navigation, CTAs).
- **Relevant shared components** (for example form controls, feedback patterns, cards, dialogs).
- **Related user journey** (for example a Services change re-checks the services-to-packages-to-inquiry path; a CMS change re-checks public rendering of the edited area).
- **Responsive behavior where affected.**
- **Security boundaries where affected** (authentication, authorization, validation, verification, secret handling — re-verified independently of UI).
- **SEO output where affected** (titles, descriptions, headings, canonicals, sitemap, robots, structured data, indexability).

Prioritize regression by risk and blast radius. Authentication, authorization, inquiry workflow, storage, public SEO architecture, shared UI, and production configuration changes warrant deeper verification (see Section 21). Trivial content edits warrant only the directly affected checks plus a smoke pass of the related journey.

---

## 18. AI-Assisted Development Verification

Per `AGENTS.md`, AI-generated implementation is untrusted until reviewed and verified. For AI-generated changes, require:

1. **Understand the intended behavior.** State which requirement the change serves before verifying it.
2. **Inspect the generated code.** Read the diff; do not trust summaries or plausibility.
3. **Compare it against the documentation.** Check `docs/REQUIREMENTS.md`, `docs/SECURITY.md`, `docs/API.md`, `docs/DATA-MODEL.md`, `docs/ARCHITECTURE.md`, `docs/UI-UX.md`, and `docs/DESIGN-SYSTEM.md` as applicable.
4. **Identify assumptions.** Name what the generated code assumed (fields, modules, policies, configurations, copy) and confirm each against a source document or mark it **Confirmation Required**.
5. **Verify security boundaries.** Authentication, authorization, server-side validation, server-side verification, and secret handling checked independently of UI behavior.
6. **Run appropriate automated checks if available.** Type checks, build, and linting where configured — treated as hygiene, not proof.
7. **Manually verify user-visible behavior.** Exercise the actual journey in the running application.
8. **Test failure states.** Validation, verification, delivery, network, save, empty, and unauthorized cases — not only the happy path.
9. **Review the diff for unrelated changes.** Scope control per `AGENTS.md`; unrelated refactoring, renames, or behavior changes are rejected.
10. **Do not accept "build passes" as proof that the feature is correct.** Build success, type-check success, and plausible appearance never substitute for requirement, journey, failure-state, and boundary verification.

Agents must not invent tests merely to make implementation appear compliant. A test that asserts invented behavior, assumes unconfirmed fields, or encodes reference content as expected output is itself a defect.

---

## 19. Test Data and Environment Safety

- **Test data must not expose real customer information unnecessarily.** Use minimal, purpose-specific data for verification; avoid real personal data where sample data suffices.
- **Production customer data must not be copied into development/test environments** without explicit justification.
- **Secrets must never be placed in test fixtures.** No keys, credentials, private material, or sensitive configuration in fixtures, examples, or committed files.
- **Test credentials must not be committed.** Authentication material used for verification lives outside the repository.
- **External integration tests must avoid unintended customer communication where possible.** Inquiry delivery checks that reach real mailboxes are deliberate, minimal, and coordinated — not routine automated sends.
- **Production verification involving real email delivery must be deliberate.** A valid inquiry reaching the client mailbox is verified during real integration and production checks (Sections 6.4, 16) with the client's awareness, not as a side effect of casual testing.

No test-data platform or environment-management system is established by the source documents. None is invented here.

---

## 20. Test Evidence and Reporting

Useful verification evidence includes:

- **Test result** (pass/fail/blocked).
- **Environment/context** (local, preview, production; viewport tier where relevant).
- **What was tested** (requirement reference and behavior).
- **Expected result** (per the source document, not per assumption).
- **Actual result** (observed behavior).
- **Pass/fail** stated plainly.
- **Relevant failure details** (reproduction steps, affected behavior, non-sensitive diagnostics only).
- **Files/components affected where useful.**
- **Any unresolved limitation** (what was not verified and why).

For AI coding-agent reports, require clear separation between:

- **Implemented** — changed but not yet verified.
- **Verified** — checked against a requirement with stated evidence.
- **Not verified** — not yet checked, with reason.
- **Failed** — checked and not meeting the requirement, with details.
- **Blocked** — cannot be checked, with the blocker named.
- **Assumed** — relied on an unconfirmed interpretation, stated explicitly.
- **Confirmation Required** — cannot be finalized until client/business confirmation arrives.

Do not allow claims such as "fully tested" when only a build or type check was performed. `AGENTS.md` completion criteria apply: state what was verified, what was not, and why.

---

## 21. Coverage and Quality Gates

No numeric code-coverage requirement is established by any source document. None is invented here. Coverage thresholds remain **Implementation Decision Required** unless explicitly established later.

### 21.1 Must pass before feature completion — Confirmed

- **Relevant functional behavior** against the traced requirement.
- **Critical user journey** containing the feature (for example inquiry path, navigation path, CMS edit-to-published path).
- **Validation** (client feedback plus independent server enforcement).
- **Security boundaries** (authentication, authorization, secret handling, verification where applicable).
- **Error/failure states** for the feature (validation, delivery/verification/save/network failures, unauthorized access as applicable).
- **Responsive behavior** across mobile, tablet, and desktop where the feature is user-visible.
- **Accessibility checks relevant to the feature** (keyboard, focus, labels, errors, semantics, contrast outcome, alt text as applicable).
- **Build/deployment checks where applicable** (build succeeds; no secrets committed or exposed).

### 21.2 May require deeper verification based on risk — Confirmed as risk areas

- **Authentication changes.**
- **Authorization/RLS changes** (once actual policies exist).
- **Inquiry workflow changes.**
- **Storage changes.**
- **Public SEO architecture changes.**
- **Shared UI changes.**
- **Production configuration changes.**

---

## 22. Confirmation Required Matrix

Confirmation-required items must not be silently implemented as requirements. Anything originating from Shot&Prints remains **Reference-Only** until confirmed (see Section 24).

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 1 | Testing framework/tooling | **Implementation Decision Required** | No unit, component, or runner tooling established by any source document. |
| 2 | Unit-test scope | **Implementation Decision Required** | Meaningful-logic guidance in Section 4.2 only; no mandated scope. |
| 3 | Browser/E2E tooling | **Implementation Decision Required** | Journey expectations Confirmed; no browser-testing tool established. |
| 4 | CI testing | **Implementation Decision Required** | No CI provider or pipeline established by any source document. |
| 5 | Code coverage thresholds | **Implementation Decision Required** | No numeric threshold established; risk-based gates in Section 21 govern instead. |
| 6 | Final inquiry field set | **Confirmation Required** | REQ-INQ-008; potential fields are possibilities, not confirmed requirements. |
| 7 | Inquiry persistence | **Conditional / Confirmation Required** | Default is no storage (REQ-INQ-002); Supabase branch only on explicit confirmation. |
| 8 | Final CMS modules/fields | **Confirmation Required** | REQ-CMS-012, REQ-CON-002; candidate areas have no defined fields. |
| 9 | Storage model | **Confirmation Required** | Supabase Storage foundation Confirmed; public/private model, buckets, and policies undecided. |
| 10 | Authentication/session behavior | **Confirmation Required** | Supabase Auth foundation Confirmed; flow, session, provisioning, and timeout detail not established. |
| 11 | Authorization model | **Confirmation Required** | Authenticated-and-authorized access Confirmed; no roles or permissions defined. |
| 12 | RLS policies | **Confirmation Required** | Principles only in `docs/SECURITY.md`; no SQL or policies defined. |
| 13 | Rate limiting | **Confirmation Required** | Duplicate-submission prevention Confirmed; numeric limits and mechanisms not established. |
| 14 | CSP/browser security headers | **Confirmation Required** | No policy stated as final in `docs/SECURITY.md`; must not break rendering, forms, or accessibility if adopted. |
| 15 | GA4 | **Conditional / Confirmation Required** | REQ-ANA-004 (**Could**); only if confirmed and appropriate. |
| 16 | Final production browser/device matrix | **Implementation Decision Required** | Mobile/tablet/desktop tiers Confirmed; no exact matrix established. |
| 17 | Performance thresholds | **Implementation Decision Required** | REQ-PER-008 prohibits arbitrary numeric guarantees; none invented. |
| 18 | Logging/diagnostics policy | **Confirmation Required** | Server-side-only principle Confirmed; no platform, destination, or retention established. |
| 19 | Test-data strategy | **Implementation Decision Required** | Safety rules in Section 19 only; no platform or management system established. |

---

## 23. Explicit Testing Exclusions

This project does not automatically include (**Confirmed** exclusions, mirroring `docs/PROJECT.md` Section 21, `docs/REQUIREMENTS.md` Section 22, `docs/ARCHITECTURE.md` Section 24, `docs/DATA-MODEL.md` Section 16, `docs/API.md` Section 20, `docs/SECURITY.md` Section 21):

- Enterprise-scale test infrastructure.
- Large automated test suites for trivial UI.
- Formal penetration testing.
- Security certification.
- WCAG certification.
- PCI compliance testing (payments are out of scope).
- Load testing for large-scale traffic.
- Complex booking/reservation testing (availability, allocation, status machines).
- Payment testing.
- CRM testing.
- Marketing automation testing.
- Large-scale SEO landing-page testing.
- Ranking guarantees.
- Unnecessary CI/CD infrastructure.
- Testing infrastructure that exceeds the project's actual risk and scope.

---

## 24. Shot&Prints Boundary

- **Shot&Prints is Reference-Only.** The previous website is historical and reference material; it is not the current brand identity (`docs/PROJECT.md` Section 17).
- **Historical content is not a production test requirement.** Reference pricing, inclusions, add-ons, booking policies, descriptions, imagery, FAQs, testimonials, contact details, and policies never serve as expected test output.
- **Old pricing, branding, policies, contact details, testimonials, imagery, or functionality must not be used as current acceptance criteria** unless explicitly confirmed as current Melbourne Photobooth Hire content. Reference material must not be modified, reinterpreted, or invented (`docs/PROJECT.md` Section 9).
- **No regression test should require reproducing the old site's behavior** unless specifically requested. A dedicated check in Section 5 requires that no Shot&Prints branding or content appears unintentionally — the old site is a negative check, never a target.

---

## 25. Related Documentation

- `AGENTS.md` — AI-agent development rules, including verification and AI-assisted development expectations.
- `README.md` — repository orientation, scope, technology direction, and constraints.
- `docs/PROJECT.md` — product and business context.
- `docs/REQUIREMENTS.md` — functional and business requirements under test.
- `docs/TECH-STACK.md` — technology choices and technical constraints.
- `docs/ARCHITECTURE.md` — application architecture and code organization.
- `docs/UI-UX.md` — user experience and interaction requirements.
- `docs/DESIGN-SYSTEM.md` — visual and component design rules.
- `docs/DATA-MODEL.md` — database structure and data relationships (conceptual level).
- `docs/API.md` — API and external service contracts (conceptual behavior and boundaries).
- `docs/SECURITY.md` — security requirements and constraints mapped by Section 8.

Related documents created separately (not by the testing-strategy task), with their testing-adjacent ownership:

- `docs/DEVELOPMENT.md` — development workflow and verification commands.
- `docs/DEPLOYMENT.md` — production deployment and verification procedures.
- `docs/DECISIONS.md` — important testing/tooling decisions (for example any future adoption of a test framework, browser tooling, CI, coverage expectations, or infrastructure beyond this strategy).

Those documents are not created here.

---

## 26. Acceptance Criteria

The document is complete when:

1. `docs/TESTING.md` exists and is the only file created or modified.
2. It defines a practical testing strategy proportionate to the project (fixed **₱15,000** scope; focused checks over excessive infrastructure).
3. Public website behavior is covered (Section 5).
4. Inquiry/request behavior is covered from form through validation, Turnstile, EmailJS, and client Gmail (Section 6).
5. Conditional inquiry persistence is tested only if confirmed (Section 6.3).
6. CMS authentication, authorization, CRUD, validation, media, and failure states are covered without inventing modules (Section 7).
7. Security testing maps directly to `docs/SECURITY.md` (Section 8).
8. Accessibility and responsive verification are covered (Sections 9–10).
9. SEO and technical SEO verification are covered without ranking guarantees (Section 11).
10. Performance verification is practical and avoids invented numeric targets (Section 12).
11. Loading, error, empty, and recovery states are covered (Section 13).
12. Data integrity is covered without inventing schema (Section 14).
13. Third-party integration boundaries are clearly distinguished (Section 15).
14. Production verification is covered (Section 16).
15. Regression testing is risk-based (Section 17).
16. AI-generated code verification is explicitly required (Section 18).
17. Test evidence/reporting requirements are defined (Sections 19–20).
18. No unsupported testing framework, command, coverage threshold, browser matrix, CI system, or infrastructure is invented (Sections 4, 22).
19. Confirmation-required items remain confirmation-required (Section 22).
20. Shot&Prints remains Reference-Only (Section 24).
21. No existing files are modified and no implementation code is created.

(End of file)
