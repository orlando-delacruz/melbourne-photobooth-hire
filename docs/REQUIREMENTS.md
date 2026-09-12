# Melbourne Photobooth Hire — Requirements

## 1. Requirements Overview

This document defines the **functional and non-functional requirements** for the Melbourne Photobooth Hire project. It describes **what the system must do** from a product and user perspective.

Relationship to other documents:

* `AGENTS.md` — Defines development rules, implementation principles, scope control, and agent behavior. It governs **how** work is performed.
* `README.md` — Provides repository orientation, high-level scope, technology direction, and project constraints. It orients readers to the repository.
* `docs/PROJECT.md` — The primary product and business reference. It describes product purpose, business context, scope, customer journey, known constraints, and reference material. This requirements document converts that context into clear, testable requirements.

This document defines **what the system should do**. Technical implementation details — including database schemas, detailed API contracts, technology architecture, code organization, visual design rules, test plans, development workflows, deployment procedures, and detailed security implementation — belong in later documentation:

* `docs/TECH-STACK.md`
* `docs/ARCHITECTURE.md`
* `docs/UI-UX.md`
* `docs/DESIGN-SYSTEM.md`
* `docs/DATA-MODEL.md`
* `docs/API.md`
* `docs/SECURITY.md`
* `docs/TESTING.md`
* `docs/DEVELOPMENT.md`
* `docs/DEPLOYMENT.md`
* `docs/DECISIONS.md`

Where this document and `docs/PROJECT.md` disagree, `docs/PROJECT.md` is authoritative for product/business context. Where implementation and documentation disagree, the repository implementation governs actual behavior and the discrepancy should be resolved explicitly.

---

## 2. Requirement Priority

Requirements in this document use a simple priority system:

* **Must** — Required for the agreed project scope. The project is incomplete without it.
* **Should** — Important but secondary. Included where practical without jeopardizing Must requirements or the project constraint.
* **Could** — Useful if practical and within scope. Only pursued when it does not add risk, cost, or complexity beyond the agreed scope.
* **Confirmation Required** — Cannot be finalized, published, or treated as production behavior without explicit client confirmation.

No additional prioritization framework is used.

---

## 3. Public Website Requirements

### 3.1 General — Must

* REQ-PUB-001 (**Must**): The website MUST present Melbourne Photobooth Hire as the current brand throughout all public pages.
* REQ-PUB-002 (**Must**): The website MUST provide clear primary navigation to all principal public sections.
* REQ-PUB-003 (**Must**): The website MUST provide clear calls to action directing visitors toward inquiry submission.
* REQ-PUB-004 (**Must**): The website MUST display current business information once confirmed by the client.
* REQ-PUB-005 (**Must**): The website MUST be usable on mobile devices without loss of essential content or function.

### 3.2 Homepage — Must

* REQ-PUB-006 (**Must**): The homepage MUST communicate what Melbourne Photobooth Hire offers and for which event contexts.
* REQ-PUB-007 (**Must**): The homepage MUST provide entry points to services, packages, gallery, FAQ, and inquiry functionality.
* REQ-PUB-008 (**Must**): The homepage MUST include a clear inquiry call to action.
* REQ-PUB-009 (**Should**): The homepage SHOULD include a Google Review call to action where placement is appropriate.

### 3.3 Services — Must

* REQ-PUB-010 (**Must**): The website MUST present the confirmed photobooth service categories (see Section 5).
* REQ-PUB-011 (**Must**): Each presented service MUST have a clear description based only on client-confirmed content.
* REQ-PUB-012 (**Must**): Service presentation MUST include a path to packages and inquiry submission.

### 3.4 Packages — Must

* REQ-PUB-013 (**Must**): The website MUST present package and pricing information only as confirmed by the client (see Section 6).
* REQ-PUB-014 (**Must**): Package presentation MUST make inclusions, duration, and pricing conditions clear to the extent confirmed.
* REQ-PUB-015 (**Must**): Package presentation MUST include a path to inquiry submission.

### 3.5 Gallery — Must

* REQ-PUB-016 (**Must**): The website MUST display real event imagery supplied or approved by the client (see Section 7).
* REQ-PUB-017 (**Must**): The gallery MUST handle the empty state gracefully when no images are available.
* REQ-PUB-018 (**Must**): Gallery images MUST include accurate, meaningful alt text.

### 3.6 About — Must

* REQ-PUB-019 (**Must**): The website MUST present About/company information based only on client-confirmed content.
* REQ-PUB-020 (**Must**): The About presentation MUST NOT invent business history, founder/team details, or claims not confirmed by the client.

### 3.7 FAQ — Must

* REQ-PUB-021 (**Must**): The website MUST display frequently asked questions with clear question-and-answer presentation (see Section 8).
* REQ-PUB-022 (**Must**): FAQ content MUST be based only on client-confirmed content.

### 3.8 Contact / Inquiry — Must

* REQ-PUB-023 (**Must**): The website MUST provide inquiry access from principal pages through navigation, calls to action, or a contact/inquiry section.
* REQ-PUB-024 (**Must**): The inquiry mechanism MUST follow the inquiry-based model defined in Section 9.
* REQ-PUB-025 (**Must**): The inquiry mechanism MUST provide clear success and error feedback.

### 3.9 Privacy Policy — Must

* REQ-PUB-026 (**Must**): The website MUST include a Privacy Policy page.
* REQ-PUB-027 (**Confirmation Required**): Final Privacy Policy content MUST be client-approved and MUST reflect actual implemented data handling. No retention periods or legal obligations may be invented.

### 3.10 Terms & Conditions — Must

* REQ-PUB-028 (**Must**): The website MUST include a Terms & Conditions page.
* REQ-PUB-029 (**Confirmation Required**): Final Terms & Conditions content MUST be client-approved and MUST reflect actual business policies. No contractual, cancellation, or insurance terms may be invented.

### 3.11 404 / Error Handling — Must

* REQ-PUB-030 (**Must**): The website MUST provide a user-friendly 404 page for unknown routes.
* REQ-PUB-031 (**Must**): The 404 page MUST provide navigation back to valid content (for example, homepage link or primary navigation).
* REQ-PUB-032 (**Should**): Supporting system pages such as an enquiry confirmation state SHOULD exist where required by the implemented flow.

### 3.12 Google Review CTA — Must

* REQ-PUB-033 (**Must**): The website MUST include a clear Google Review call to action in at least one appropriate location (see Section 12).

No exact page copy is defined in this document.

---

## 4. Navigation and Information Architecture

* REQ-NAV-001 (**Must**): The website MUST provide consistent primary navigation across all public pages.
* REQ-NAV-002 (**Must**): Primary navigation MUST include access to Home, Services, Packages, Gallery, About, FAQ, and Contact/inquiry.
* REQ-NAV-003 (**Must**): The website MUST provide functional mobile navigation that exposes the same principal destinations as desktop navigation.
* REQ-NAV-004 (**Must**): The page hierarchy MUST be logical: homepage as entry point, with services, packages, gallery, about, FAQ, contact, and legal pages reachable within minimal navigation steps.
* REQ-NAV-005 (**Must**): Calls to action for inquiry submission MUST be present at appropriate decision points (for example, services, packages, and contact contexts).
* REQ-NAV-006 (**Must**): Internal linking MUST connect related content (for example, services to packages, packages to inquiry, homepage to gallery and FAQ).
* REQ-NAV-007 (**Must**): The website MUST NOT create unnecessary pages solely for SEO purposes. Event types are represented within relevant sections unless explicitly required otherwise.
* REQ-NAV-008 (**Should**): Footer navigation SHOULD repeat principal destinations plus legal pages and relevant business information links.

---

## 5. Photobooth Service Requirements

The current content direction includes three service categories. Final descriptions require client confirmation.

* REQ-SVC-001 (**Must**): The website MUST be capable of presenting a **Premium Photobooth** service as the primary/open-air photobooth experience, using only client-confirmed descriptions.
* REQ-SVC-002 (**Must**): The website MUST be capable of presenting a **Roaming Photobooth** service as a roaming experience brought to guests, using only client-confirmed descriptions.
* REQ-SVC-003 (**Must**): The website MUST be capable of presenting a **360 Video Booth** service as a 360-degree video experience, using only client-confirmed descriptions.
* REQ-SVC-004 (**Must**): Service presentation MUST NOT present Shot&Prints reference characteristics (such as open-air setup, studio-quality lighting claims, social/open experience claims, candid interaction claims, backdrop claims, event suitability claims, or 360 pairing claims) as confirmed current Melbourne Photobooth Hire claims.
* REQ-SVC-005 (**Confirmation Required**): Final service names, descriptions, suitability statements, and any technical or setup claims REQUIRE client confirmation before publication.
* REQ-SVC-006 (**Must**): Each service presentation MUST include a path to relevant packages and inquiry submission.
* REQ-SVC-007 (**Should**): Service presentation SHOULD support relevant local context (Melbourne events) where confirmed and natural, without keyword stuffing.

No technical specifications of any booth hardware or software are defined in this document.

---

## 6. Package and Pricing Requirements

* REQ-PKG-001 (**Must**): The website MUST be capable of displaying package options with duration, price, inclusions, and conditions once confirmed.
* REQ-PKG-002 (**Confirmation Required**): The following reference pricing from the previous Shot&Prints website is **reference information only and requires client confirmation**. It MUST NOT be treated as final production content:
  * Starter — 2 hours — $350
  * Standard — 3 hours — $450
  * Premium — 4 hours — $600
* REQ-PKG-003 (**Confirmation Required**): The following reference inclusions are **reference information only and require client confirmation** before publication:
  * Full photobooth service
  * Studio-quality lighting/styling
  * Custom-branded print template
  * HD printing
  * QR-code digital downloads
  * Free props
  * Optional on-site attendant depending on package/content
  * Premium package reference to 360 Video Booth
  * Priority setup/pack-down for Premium
* REQ-PKG-004 (**Confirmation Required**): The following reference add-ons are **reference information only and require client confirmation**:
  * Professional Photography
  * Extended Hire
  * Custom Backdrop
  * Digital Guestbook
* REQ-PKG-005 (**Confirmation Required**): The following reference booking policies are **reference information only and require client confirmation**:
  * Deposit amount and terms (reference: 20% deposit to confirm booking)
  * Balance payment timing (reference: balance due on event day)
  * Cancellation terms (reference: deposit described as non-refundable)
  * Rescheduling terms (reference: rescheduling subject to notice)
* REQ-PKG-006 (**Must**): No package price, inclusion, add-on, deposit, balance, cancellation, or rescheduling term may be published as a Melbourne Photobooth Hire business claim without client confirmation.
* REQ-PKG-007 (**Must**): If package content is part of the confirmed CMS implementation, the CMS MUST allow authorized updates to the confirmed package content without source-code changes (specific editable fields remain Confirmation Required — see Section 18).
* REQ-PKG-008 (**Must**): Package presentation MUST NOT invent pricing, inclusions, or policies.

---

## 7. Gallery Requirements

* REQ-GAL-001 (**Must**): The gallery MUST display real event imagery supplied or approved by the client.
* REQ-GAL-002 (**Must**): Gallery images MUST be presented responsively across mobile, tablet, and desktop viewports.
* REQ-GAL-003 (**Must**): Each gallery image MUST have accurate, descriptive alt text reflecting the actual image content.
* REQ-GAL-004 (**Must**): The gallery MUST load efficiently, using appropriate image optimization and loading behavior as defined in technical documentation.
* REQ-GAL-005 (**Must**): When no gallery images are available, the gallery MUST display a clear empty state rather than a broken layout or error.
* REQ-GAL-006 (**Should**): Gallery content SHOULD be manageable through the CMS where this is part of the confirmed implementation (exact mechanism remains Confirmation Required).
* REQ-GAL-007 (**Must**): The gallery MUST NOT invent gallery categories. No categories are defined in this document.
* REQ-GAL-008 (**Must**): The gallery MUST NOT use stock imagery presented as real client events, or fake event claims.

---

## 8. FAQ Requirements

* REQ-FAQ-001 (**Must**): The website MUST display FAQs with clearly distinguishable questions and answers.
* REQ-FAQ-002 (**Must**): FAQ presentation MUST be usable on mobile devices (readable layout, tappable controls where expand/collapse interaction is used).
* REQ-FAQ-003 (**Must**): FAQ content MUST be based only on client-confirmed questions and answers. No FAQ content is defined in this document.
* REQ-FAQ-004 (**Should**): FAQs SHOULD be editable through the CMS where this is part of the confirmed implementation (exact mechanism remains Confirmation Required).
* REQ-FAQ-005 (**Could**): Structured data for FAQs MAY be included only where technically and semantically valid for the published content. It MUST NOT be added with invented or placeholder questions and answers.
* REQ-FAQ-006 (**Must**): FAQ answers MUST NOT contradict confirmed service, package, or policy information.

---

## 9. Inquiry / Booking Requirements

### 9.1 Model — Must

* REQ-INQ-001 (**Must**): The system MUST implement an **inquiry-based model**, not an online reservation engine.
* REQ-INQ-002 (**Must**): The required flow MUST be: Customer → Inquiry Form → Validation → EmailJS → Client Gmail. The **Validation** step includes server-side re-validation and server-side Turnstile verification executed through the Astro Server Endpoint before EmailJS delivery, consistent with `docs/ARCHITECTURE.md`, `docs/API.md`, and `docs/SECURITY.md`. Client-side validation alone is not sufficient.
* REQ-INQ-003 (**Must**): The system MUST NOT require real-time availability, calendar reservation, payment processing, checkout, automated reservation allocation, complex CRM, or complex booking management to accept an inquiry.

### 9.2 Form Access and Usability — Must

* REQ-INQ-004 (**Must**): The inquiry form MUST be reachable from principal decision points (at minimum via Contact/inquiry and package/service calls to action).
* REQ-INQ-005 (**Must**): The form MUST be fully usable on mobile devices.
* REQ-INQ-006 (**Must**): The form MUST be keyboard-accessible with associated labels for each field.
* REQ-INQ-007 (**Must**): The form MUST provide a user-friendly experience with clear instructions and predictable behavior.

### 9.3 Potential Fields — Confirmation Required

* REQ-INQ-008 (**Confirmation Required**): The final set of required versus optional fields REQUIRES client confirmation. The following potential fields MAY be collected. None is confirmed as required by this document:
  * Name
  * Email
  * Mobile
  * Event date
  * Event type
  * Event location/venue
  * Estimated guests
  * Preferred photobooth
  * Additional requirements/message
* REQ-INQ-009 (**Confirmation Required**): If event type is collected as a selection, the option list (for example: Wedding, Birthday, Corporate Event, Engagement Party, School Formal, Christmas/End-of-Year, Private Event, Other) REQUIRES confirmation.
* REQ-INQ-010 (**Confirmation Required**): If preferred photobooth is collected as a selection, the option list (for example: Premium, Roaming, 360, Not Sure) REQUIRES confirmation.
* REQ-INQ-011 (**Must**): No additional personal-data fields beyond what is confirmed may be introduced without justification.

### 9.4 Validation — Must

* REQ-INQ-012 (**Must**): The form MUST validate submissions before sending (at minimum: required-field presence, email format, and any confirmed format rules).
* REQ-INQ-013 (**Must**): Validation errors MUST be clearly communicated next to or near the relevant field and summarized where appropriate.
* REQ-INQ-014 (**Must**): The form MUST prevent submission while invalid input remains uncorrected.

### 9.5 Submission, Feedback, and Protection — Must

* REQ-INQ-015 (**Must**): On successful submission, the user MUST receive clear success feedback.
* REQ-INQ-016 (**Must**): On submission failure (including email delivery failure), the user MUST receive a clear, non-technical error message with guidance on what to do next.
* REQ-INQ-017 (**Must**): The form MUST include submission protection against spam and abuse as defined in technical/security documentation.
* REQ-INQ-018 (**Must**): Inquiry delivery to the client's Gmail MUST occur when the form reports success, consistent with the email requirements in Section 10.
* REQ-INQ-019 (**Must**): Form submissions MUST be handled without exposing secrets or credentials in client-side source.

### 9.6 Explicit Exclusions — Must

* REQ-INQ-020 (**Must**): The system MUST NOT include real-time availability, a calendar reservation system, payment processing, checkout, automated reservation allocation, a complex CRM, or complex booking management unless explicitly requested later and separately scoped.

---

## 10. Email Requirements

* REQ-EML-001 (**Must**): The system MUST send validated inquiry submissions through the configured email service to the client's Gmail destination.
* REQ-EML-002 (**Must**): The client MUST receive the inquiry in Gmail with sufficient detail to follow up (based on the confirmed form fields).
* REQ-EML-003 (**Must**): The user MUST receive appropriate success feedback when the inquiry is accepted for delivery, and clear error feedback when delivery fails.
* REQ-EML-004 (**Must**): Email delivery MUST function in the production environment with production configuration.
* REQ-EML-005 (**Must**): This document MUST NOT invent email addresses, and MUST NOT document implementation credentials or secrets.

---

## 11. CMS / Admin Requirements

Product-level requirements only. Modules, content models, and database fields are not defined here.

* REQ-CMS-001 (**Must**): The system MUST provide a custom admin panel that allows the client to manage appropriate website content without editing source code.
* REQ-CMS-002 (**Must**): Admin access MUST require secure authentication. Unauthenticated users MUST NOT access CMS functionality.
* REQ-CMS-003 (**Must**): Authenticated admin actions MUST respect authorization rules so only permitted users can view or modify content.
* REQ-CMS-004 (**Must**): Content MUST be clearly organized so the client can find and edit the intended content without confusion.
* REQ-CMS-005 (**Must**): The CMS MUST support create, edit, update, and delete behavior where applicable to the confirmed content areas.
* REQ-CMS-006 (**Must**): The CMS MUST validate admin input and reject invalid content with clear error messages.
* REQ-CMS-007 (**Must**): Editing MUST be safe: the CMS MUST guard against accidental data loss where practical (for example, confirmation for destructive actions).
* REQ-CMS-008 (**Must**): Save behavior MUST be predictable: the client MUST receive clear confirmation when content is saved, and a clear error when saving fails.
* REQ-CMS-009 (**Must**): The CMS MUST handle loading, saving, and network/API failure states with clear feedback.
* REQ-CMS-010 (**Must**): Media management MUST be supported where required by the confirmed implementation (for example, gallery images), with predictable upload, replacement, and removal behavior.
* REQ-CMS-011 (**Should**): The CMS SHOULD be usable on common desktop and mobile viewports where practical.
* REQ-CMS-012 (**Confirmation Required**): Exact CMS modules, editable content areas, and field definitions REQUIRE confirmation and MUST NOT be assumed from this document (see Section 18).
* REQ-CMS-013 (**Must**): The CMS MUST NOT become an enterprise CMS or CRM. It MUST remain scoped to managing confirmed website content.

---

## 12. Google Review Requirements

* REQ-REV-001 (**Must**): The website MUST include a clear Google Review call to action.
* REQ-REV-002 (**Must**): The call to action MUST link to the client's Google Business Profile review flow.
* REQ-REV-003 (**Should**): The call to action SHOULD appear in at least one appropriate placement (for example, homepage, contact/inquiry context, or footer) without disrupting the primary inquiry journey.
* REQ-REV-004 (**Confirmation Required**): The actual review URL REQUIRES client confirmation (client must supply the Google Business Profile review link). No placeholder or guessed URL may be published as the production link.
* REQ-REV-005 (**Must**): The system MUST NOT implement a custom review submission system.
* REQ-REV-006 (**Must**): The system MUST NOT implement a custom review database.
* REQ-REV-007 (**Must**): The website MUST NOT display fake, generated, or unverified reviews or ratings.

---

## 13. SEO Requirements

### 13.1 General — Must

* REQ-SEO-001 (**Must**): The website MUST provide a strong technical and local SEO foundation for relevant Melbourne photobooth search intent, including:
  * photobooth Melbourne
  * photo booth hire Melbourne
  * photobooth rental Melbourne
  * wedding photobooth Melbourne
  * 360 photobooth Melbourne
  * corporate photobooth Melbourne
  * event photobooth Melbourne
  * photobooth hire near me
* REQ-SEO-002 (**Must**): SEO implementation MUST address search intent with genuine, customer-focused content, not keyword manipulation.

### 13.2 On-Page and Technical SEO — Must

* REQ-SEO-003 (**Must**): Each public page MUST have a unique page title.
* REQ-SEO-004 (**Must**): Each public page MUST have a unique meta description.
* REQ-SEO-005 (**Must**): Pages MUST use a correct H1/H2 hierarchy with exactly one H1 per page reflecting the page topic.
* REQ-SEO-006 (**Must**): Markup MUST use semantic HTML appropriate to the content.
* REQ-SEO-007 (**Must**): The website MUST implement internal linking between related pages.
* REQ-SEO-008 (**Must**): Public pages MUST expose canonical URLs.
* REQ-SEO-009 (**Must**): The website MUST expose an XML sitemap.
* REQ-SEO-010 (**Must**): The website MUST expose a robots.txt file that permits crawling of public content while excluding non-public areas where appropriate.
* REQ-SEO-011 (**Must**): The website MUST include Schema.org structured data using JSON-LD where technically and semantically valid for the page content.
* REQ-SEO-012 (**Should**): Public pages SHOULD include Open Graph and social metadata where appropriate.
* REQ-SEO-013 (**Must**): Images MUST be optimized for web delivery with accurate alt text.
* REQ-SEO-014 (**Must**): Public pages MUST be crawlable and indexable unless there is an explicit reason to exclude a page (for example, admin routes).
* REQ-SEO-015 (**Must**): The website MUST be mobile-friendly.
* REQ-SEO-016 (**Must**): The website MUST consider Core Web Vitals and performance in its implementation.

### 13.3 Local SEO and Google Readiness — Must

* REQ-SEO-017 (**Must**): The website MUST support local SEO with genuine Melbourne service-area context based only on confirmed business information.
* REQ-SEO-018 (**Must**): The website MUST be ready for Google Search Console verification and monitoring. No tracking IDs are defined in this document.
* REQ-SEO-019 (**Should**): The website SHOULD link to the Google Business Profile where appropriate, once confirmed.

### 13.4 Explicit Boundaries — Must

* REQ-SEO-020 (**Must**): The website MUST NOT use keyword stuffing.
* REQ-SEO-021 (**Must**): The website MUST NOT create unnecessary SEO landing pages. Separate event-type landing pages MUST NOT be created unless explicitly required.
* REQ-SEO-022 (**Must**): No specific Google ranking MUST be promised or guaranteed.
* REQ-SEO-023 (**Must**): Ongoing SEO marketing, continuous content production, backlink campaigns, and ranking campaigns are separate from website implementation scope unless explicitly requested.

Technical SEO implementation is separate from ongoing SEO marketing.

---

## 14. Responsive and Accessibility Requirements

* REQ-ACC-001 (**Must**): The website MUST be fully usable on mobile viewports.
* REQ-ACC-002 (**Must**): The website MUST be fully usable on tablet viewports.
* REQ-ACC-003 (**Must**): The website MUST be fully usable on desktop viewports.
* REQ-ACC-004 (**Must**): All interactive elements MUST be keyboard-usable with visible focus states.
* REQ-ACC-005 (**Must**): All form fields MUST have associated labels.
* REQ-ACC-006 (**Must**): Form errors MUST be communicated in text associated with the relevant field, not by color alone.
* REQ-ACC-007 (**Must**): Content MUST use semantic structure (headings, landmarks, lists) supporting assistive technology.
* REQ-ACC-008 (**Must**): Text and essential UI MUST meet appropriate contrast for readability.
* REQ-ACC-009 (**Must**): Interactive controls (navigation, menus, dialogs, expand/collapse elements) MUST have accessible names and predictable behavior.
* REQ-ACC-010 (**Must**): Images MUST use meaningful alt text; decorative images MUST be treated as decorative through the implemented mechanism.
* REQ-ACC-011 (**Should**): The website SHOULD respect reduced-motion preferences where animation or motion is used.
* REQ-ACC-012 (**Must**): This document MUST NOT claim formal WCAG certification. Any conformance claim requires actual evaluation, which is not defined here.

---

## 15. Performance Requirements

* REQ-PER-001 (**Must**): Pages MUST load fast on typical mobile and desktop connections using practical optimization.
* REQ-PER-002 (**Must**): Images MUST be optimized for web delivery (appropriate format, sizing, and compression as defined in technical documentation).
* REQ-PER-003 (**Should**): Below-the-fold or non-critical images SHOULD use appropriate lazy loading where it improves performance without harming user experience or SEO.
* REQ-PER-004 (**Must**): The frontend MUST minimize unnecessary JavaScript on content-heavy pages.
* REQ-PER-005 (**Must**): The implementation MUST avoid unnecessary dependencies that increase page weight or complexity.
* REQ-PER-006 (**Must**): Frontend rendering MUST be efficient and consistent with the SEO-friendly architecture defined in technical documentation.
* REQ-PER-007 (**Must**): Core Web Vitals MUST be considered during implementation.
* REQ-PER-008 (**Must**): This document MUST NOT define arbitrary numeric performance guarantees (no specific second, score, or percentile promises).

---

## 16. Security and Privacy Requirements

High-level requirements only. Detailed security requirements belong in `docs/SECURITY.md`.

* REQ-SEC-001 (**Must**): Admin authentication MUST be secure. Credentials MUST NOT be hardcoded, committed, or exposed.
* REQ-SEC-002 (**Must**): Authorization MUST prevent unauthorized CMS access and unauthorized content modification.
* REQ-SEC-003 (**Must**): All user input (inquiry form and CMS inputs) MUST be validated at appropriate boundaries.
* REQ-SEC-004 (**Must**): Inquiry data MUST be handled securely in transit and at rest to the extent governed by the implemented services.
* REQ-SEC-005 (**Must**): No secrets, private keys, or credentials may appear in client-side source or the repository.
* REQ-SEC-006 (**Must**): Sensitive configuration MUST use appropriate environment variables and MUST NOT be committed to source control.
* REQ-SEC-007 (**Must**): The inquiry form MUST include spam protection as defined in technical/security documentation.
* REQ-SEC-008 (**Must**): Data handling MUST be appropriate to the collected information, and legal/privacy content MUST reflect actual behavior.
* REQ-SEC-009 (**Must**): This document MUST NOT invent specific data-retention periods or legal policies.

---

## 17. Error, Loading, and Empty States

* REQ-STA-001 (**Must**): Public pages MUST provide appropriate loading feedback where content loads asynchronously.
* REQ-STA-002 (**Must**): The CMS MUST provide loading feedback for content fetching and saving operations.
* REQ-STA-003 (**Must**): Form submission MUST show a submission-in-progress state and prevent duplicate submissions while processing.
* REQ-STA-004 (**Must**): Form validation errors MUST clearly identify the affected fields and how to correct them.
* REQ-STA-005 (**Must**): Email submission failure MUST produce a clear user-facing error with next-step guidance, without exposing technical details.
* REQ-STA-006 (**Must**): CMS save failure MUST produce a clear error indicating the content was not saved and what the user can do next.
* REQ-STA-007 (**Must**): An empty gallery MUST display a clear empty state.
* REQ-STA-008 (**Must**): Empty content areas MUST NOT render broken layouts; where content is absent, the area MUST display a sensible fallback or be handled per confirmed content rules.
* REQ-STA-009 (**Must**): Unknown routes MUST render a user-friendly 404 page with navigation back to valid content.
* REQ-STA-010 (**Must**): Network or API failures affecting user-visible functionality MUST produce clear, non-technical feedback.

The user must receive clear and useful feedback in every state above.

---

## 18. Content Management Requirements

* REQ-CON-001 (**Must**): Client-editable content MUST be manageable without editing source code, within the confirmed CMS scope.
* REQ-CON-002 (**Confirmation Required**): The exact editable modules and fields REQUIRE confirmation. The following areas are possible content areas where confirmed — no specific fields are defined by this document:
  * Services
  * Packages
  * Gallery
  * FAQs
  * General website content
  * Contact/business information
* REQ-CON-003 (**Must**): Only client-confirmed content may be published as business fact. Reference or placeholder content MUST NOT be published as current information.
* REQ-CON-004 (**Must**): Content updates through the CMS MUST be reflected on the public website predictably once saved and published per the implemented workflow.
* REQ-CON-005 (**Must**): Business-critical content (pricing, policies, contact details, legal pages) MUST require explicit client approval before publication.

---

## 19. Deployment Requirements

* REQ-DEP-001 (**Must**): The website MUST be deployed to a production hosting environment.
* REQ-DEP-002 (**Must**): The production deployment MUST be connected to the confirmed production domain.
* REQ-DEP-003 (**Must**): Production environment configuration (including environment variables for email, CMS, and any integrated services) MUST be set correctly without committing secrets to source control.
* REQ-DEP-004 (**Must**): Production traffic MUST be served over HTTPS.
* REQ-DEP-005 (**Must**): The inquiry form and email delivery MUST function correctly in production.
* REQ-DEP-006 (**Must**): SEO files MUST be accessible in production (including XML sitemap and robots.txt).
* REQ-DEP-007 (**Must**): A final production verification MUST confirm: principal pages render, navigation works, the inquiry flow delivers email, SEO files are reachable, HTTPS is active, and no placeholder or reference branding is published.

Exact infrastructure implementation is not defined in this document unless already confirmed elsewhere.

---

## 20. Analytics and Google Requirements

* REQ-ANA-001 (**Must**): The website MUST be ready for Google Search Console verification and indexing monitoring.
* REQ-ANA-002 (**Should**): The website SHOULD integrate or link with the Google Business Profile where appropriate and confirmed.
* REQ-ANA-003 (**Must**): The Google Review link MUST use the client-supplied Google Business Profile review URL (see Section 12).
* REQ-ANA-004 (**Could**): Google Analytics 4 MAY be included where confirmed and appropriate for the project scope.
* REQ-ANA-005 (**Must**): This document MUST NOT invent tracking IDs, measurement IDs, or account information.

---

## 21. Non-Functional Requirements Summary

Concise summary of cross-cutting requirements. Details belong in the respective technical documents.

* REQ-NFR-001 (**Must — Maintainability**): The system MUST remain practical and maintainable within the agreed scope, avoiding unnecessary dependencies, services, and abstractions.
* REQ-NFR-002 (**Must — Performance**): The system MUST deliver fast, optimized page experiences with efficient rendering and optimized media.
* REQ-NFR-003 (**Must — Security**): The system MUST protect admin access, validate input, handle inquiry data appropriately, and keep secrets out of source.
* REQ-NFR-004 (**Must — Accessibility**): The system MUST provide keyboard-usable, labelled, semantically structured interfaces with readable contrast and meaningful alternatives for imagery.
* REQ-NFR-005 (**Must — Responsiveness**): The system MUST work across mobile, tablet, and desktop viewports.
* REQ-NFR-006 (**Must — SEO readiness**): The system MUST provide a strong technical and local SEO foundation without ranking guarantees.
* REQ-NFR-007 (**Must — Usability**): The system MUST provide clear navigation, calls to action, feedback for all significant states, and a safe, predictable CMS editing experience.
* REQ-NFR-008 (**Should — Reliability**): The system SHOULD handle validation, email, CMS, and network failures gracefully with clear user feedback and without data loss where practical.
* REQ-NFR-009 (**Should — Scalability**): The system SHOULD accommodate reasonable growth in content volume (pages, gallery items, FAQs) within the current architecture, without being engineered as a large-scale or enterprise platform.

These requirements are intentionally scoped to the agreed project size and must not be over-engineered.

---

## 22. Out of Scope

Unless the client explicitly expands the project, the following are out of scope:

* REQ-OOS-001: Real-time booking availability system.
* REQ-OOS-002: Online payments.
* REQ-OOS-003: Checkout.
* REQ-OOS-004: Complex reservation engine or automated reservation allocation.
* REQ-OOS-005: Full CRM.
* REQ-OOS-006: Marketing automation.
* REQ-OOS-007: Custom review platform, custom review database, or review-rating claims without verified data.
* REQ-OOS-008: Guaranteed SEO rankings.
* REQ-OOS-009: Ongoing SEO campaigns.
* REQ-OOS-010: Continuous content marketing.
* REQ-OOS-011: Large-scale SEO landing-page production.
* REQ-OOS-012: Unnecessary third-party integrations.
* REQ-OOS-013: Unnecessary architectural rewrites.

---

## 23. Requirements Requiring Client Confirmation

The following business and product decisions cannot be finalized without explicit client confirmation. Anything originating from Shot&Prints remains reference material until confirmed.

* [ ] Final service list and service names.
* [ ] Final service descriptions for Premium Photobooth, Roaming Photobooth, and 360 Video Booth.
* [ ] Final package names, durations, and pricing (reference: Starter 2h $350 / Standard 3h $450 / Premium 4h $600 — reference only).
* [ ] Final package inclusions (reference list in Section 6 — reference only).
* [ ] Final add-ons and add-on pricing (reference list in Section 6 — reference only).
* [ ] Deposit requirements and deposit terms (reference: 20% — reference only).
* [ ] Balance payment timing and method (reference: balance due on event day — reference only).
* [ ] Cancellation policy, including refund/non-refund terms (reference: deposit described as non-refundable — reference only).
* [ ] Rescheduling policy, including notice requirements (reference: rescheduling subject to notice — reference only).
* [ ] Exact service area, including travel boundaries.
* [ ] Travel fees and any location-based charges.
* [ ] Business contact details (phone, email, address, hours, service-area statement).
* [ ] Google Business Profile review URL.
* [ ] Testimonials and reviews approved for publication, if any.
* [ ] Final About and company information, including any founder/team/company story.
* [ ] Final Privacy Policy and Terms & Conditions content.
* [ ] Final inquiry form field set and which fields are required versus optional.
* [ ] Exact CMS-editable content areas, modules, and fields.
* [ ] Final gallery imagery approved for publication.
* [ ] Final FAQ questions and answers.
* [ ] Any other business information carried forward from Shot&Prints.

---

## 24. Traceability to Project Context

Major requirement groups mapped back to `docs/PROJECT.md`:

| Requirement group (this document) | Source section(s) in `docs/PROJECT.md` |
| --------------------------------- | -------------------------------------- |
| Public website (Sec. 3) | Sec. 4 Project Scope — Public Website; Sec. 15 Website Information Architecture; Sec. 3 Project Goals |
| Navigation and information architecture (Sec. 4) | Sec. 15 Website Information Architecture; Sec. 6 Customer Journey |
| Photobooth services (Sec. 5) | Sec. 7 Photobooth Experiences |
| Packages and pricing (Sec. 6) | Sec. 9 Packages and Pricing |
| Gallery (Sec. 7) | Sec. 3 Project Goals; Sec. 4 Project Scope; Sec. 16 Content Strategy |
| FAQ (Sec. 8) | Sec. 3 Project Goals; Sec. 4 Project Scope; Sec. 16 Content Strategy |
| Inquiry / booking (Sec. 9) | Sec. 4 Project Scope — Inquiry System; Sec. 6 Customer Journey; Sec. 10 Inquiry / Booking Model; Sec. 11 Inquiry Form Information |
| Email (Sec. 10) | Sec. 4 Project Scope — Inquiry System; Sec. 10 Inquiry / Booking Model |
| CMS / admin (Sec. 11) | Sec. 4 Project Scope — CMS / Admin; Sec. 12 CMS Purpose |
| Google Reviews (Sec. 12) | Sec. 3 Project Goals; Sec. 13 Google Reviews |
| SEO (Sec. 13) | Sec. 4 Project Scope — SEO; Sec. 14 SEO Objectives |
| Responsive and accessibility (Sec. 14) | Sec. 3 Project Goals (professional/trustworthy UX); Sec. 4 Project Scope (responsive implication) |
| Performance (Sec. 15) | Sec. 14 SEO Objectives (Core Web Vitals, performance) |
| Security and privacy (Sec. 16) | Sec. 19 Legal and Privacy Context; Sec. 4 Project Scope (auth, CMS) |
| Error, loading, and empty states (Sec. 17) | Sec. 4 Project Scope — Inquiry System (feedback); Sec. 12 CMS Purpose (predictable behavior) |
| Content management (Sec. 18) | Sec. 12 CMS Purpose; Sec. 16 Content Strategy |
| Deployment (Sec. 19) | Sec. 4 Project Scope — Deployment |
| Analytics and Google (Sec. 20) | Sec. 13 Google Reviews; Sec. 14 SEO Objectives |
| Non-functional summary (Sec. 21) | Sec. 20 Project Constraints |
| Out of scope (Sec. 22) | Sec. 21 Out of Scope; Sec. 10 Inquiry / Booking Model |
| Confirmation checklist (Sec. 23) | Sec. 23 Known Information vs. Information Requiring Confirmation; Sec. 9 Packages and Pricing; Sec. 17 Brand Context; Sec. 18 Service Area |

---

## 25. Acceptance Criteria for the Requirements Document

This requirements document is considered complete when:

1. Requirements are understandable by both business and technical readers.
2. Requirements are testable where appropriate (stated as observable system behavior with explicit priorities).
3. Confirmed project direction is clearly separated from assumptions and unconfirmed items (via the priority system and Section 23).
4. Shot&Prints reference content (pricing, inclusions, add-ons, policies, descriptions) is explicitly marked as reference material requiring confirmation and is not treated as confirmed production content.
5. The inquiry-based booking model (Customer → Inquiry Form → Validation → EmailJS → Client Gmail) is clearly defined, and real-time booking, payments, checkout, and CRM functionality are explicitly excluded.
6. Out-of-scope functionality is explicitly listed in Section 22.
7. SEO requirements are comprehensive (on-page, technical, local, Google readiness) without keyword-stuffing mandates, unnecessary landing-page production, or ranking guarantees.
8. CMS requirements define product-level behavior without inventing specific modules, content models, or database fields.
9. No unsupported business claims are introduced (no invented pricing, policies, contact details, testimonials, team history, coverage areas, or legal terms).
10. Requirements align with the ₱15,000 project constraint: scope favors agreed deliverables, maintainability, and simplicity, and avoids enterprise CMS, CRM, reservation-engine, and marketing-automation scope.
11. The document does not duplicate technical architecture unnecessarily: no database schemas, no detailed API contracts, no technology-architecture definitions, and detailed security, testing, and deployment implementation is deferred to the respective `docs/` files.
