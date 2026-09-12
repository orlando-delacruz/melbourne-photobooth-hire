# Melbourne Photobooth Hire — Data Model

## 1. Purpose and Scope

This document is the authoritative data-model specification for the Melbourne Photobooth Hire project. It answers:

> **What kinds of data does the project deal with, how do those concepts relate at a high level, where are the boundaries between public content and admin-only data, and what remains unconfirmed?**

This is a greenfield project. This document describes the **intended data-model direction** at the conceptual level, not an implemented database schema. Implementation status must be confirmed from the repository.

This document defines **concepts, relationships, boundaries, and confirmation status**. It does not define:

- Final CMS modules, tables, columns, IDs, enums, or constraints.
- SQL migrations or any application code.
- API request/response schemas (those belong in `docs/API.md`).
- Detailed Row Level Security (RLS) policies or auth implementation (those belong in `docs/SECURITY.md`).
- Final business content such as prices, inclusions, policies, contact details, FAQs, testimonials, or imagery.
- Bucket names, storage policies, filenames, or media implementation details.
- Environment values, credentials, IDs, or configuration values.

Source context (authoritative for their respective concerns):

- `docs/PROJECT.md` — product and business context.
- `docs/REQUIREMENTS.md` — functional and business requirements.
- `docs/TECH-STACK.md` — technology choices and constraints.
- `docs/ARCHITECTURE.md` — application architecture and code organization.
- `docs/UI-UX.md` — user experience and interaction requirements.
- `docs/DESIGN-SYSTEM.md` — visual and component design rules.
- Root `AGENTS.md` — development rules and scope control.
- Root `README.md` — repository orientation.

Where this document and `docs/REQUIREMENTS.md` disagree on required behavior, `docs/REQUIREMENTS.md` governs what the system must do and the discrepancy should be resolved explicitly. Where this document and `docs/PROJECT.md` disagree on business context, `docs/PROJECT.md` is authoritative.

---

## 2. Information Status Labels

Every data-model statement in this document carries one of the following statuses:

- **Confirmed** — established by existing project documentation cited in the relevant section. May be relied on for planning.
- **Conditional** — exists only if a separately confirmed requirement activates it. Must not be implemented by default.
- **Confirmation Required** — depends on client/business confirmation. Must not be treated as a final module, field, table, workflow, or policy.
- **Reference-Only** — originates from the previous Shot&Prints website/material. Historical context only; never confirmed production data.

No statement in this document introduces a new Confirmed business fact or technical decision beyond what the source documents already establish.

---

## 3. Data-Model Principles

1. **Concepts before schema.** This document fixes shared language and boundaries. It does not lock the project into tables, columns, or constraints before CMS scope is confirmed.
2. **Reuse confirmed language.** Entity names follow `docs/PROJECT.md` and `docs/REQUIREMENTS.md` (services, packages, gallery, FAQs, inquiry/request, site/business information). No parallel terminology is introduced.
3. **Smallest useful model.** The model covers only what the agreed scope needs: confirmed website content plus authentication and media foundations. It is sized for a fixed **₱15,000** project.
4. **CMS stays scoped.** The model supports a custom admin panel for confirmed website content only. It does not model an enterprise CMS, CRM, booking engine, or marketing platform.
5. **Inquiry stays simple.** The default model has no stored inquiry entity. Persistence is Conditional only (see Section 11).
6. **Public by publication.** Only intentionally published, client-confirmed content reaches the public website. Everything else stays behind authentication and authorization.
7. **Auth is separate from content.** Admin identities belong to Supabase Auth and are not content records. No roles or permission structures are invented here.
8. **Storage is separate from metadata.** File bytes belong to Supabase Storage; descriptive references belong to the content concept. Neither side invents bucket names, policies, or filenames here.
9. **Validation at boundaries.** Content rules are stated as principles here; enforceable rules belong in implementation and `docs/API.md` / `docs/SECURITY.md`.
10. **Unconfirmed means unconfirmed.** Anything not established by existing documentation is explicitly marked **Confirmation Required**, never guessed.

---

## 4. Authority Boundaries

To prevent premature lock-in, responsibility is split as follows:

| Concern | Owner |
| --- | --- |
| What the system must do | `docs/REQUIREMENTS.md` |
| Selected technologies | `docs/TECH-STACK.md` |
| Architecture and data flows | `docs/ARCHITECTURE.md` |
| Behavior and experience | `docs/UI-UX.md` |
| Visual language | `docs/DESIGN-SYSTEM.md` |
| **Concepts, relationships, and data boundaries** | **This document (`docs/DATA-MODEL.md`)** |
| Endpoint contracts, validation rule detail, email/verification flows | `docs/API.md` |
| Auth behavior, authorization rules, RLS policies, secret handling | `docs/SECURITY.md` |
| Important architectural/technical decisions once made | `docs/DECISIONS.md` |

This document introduces no endpoint URLs, methods, payloads, response schemas, table definitions, column definitions, policies, or credentials.

---

## 5. Core Entities and Concepts

The items below are **candidate content areas**, not final CMS modules. Exact modules are **Confirmation Required** per REQ-CMS-012 and REQ-CON-002. No item below authorizes creating a table.

Possible content areas named in REQ-CON-002 (none with defined fields): services, packages, gallery, FAQs, general website content, contact/business information.

### 5.1 Site / Global Settings — Confirmation Required

- **Status:** **Confirmation Required.**
- **Concept:** The small set of business-wide content referenced across pages, such as confirmed business information and contact/service-area statements, where included in the confirmed CMS scope.
- **Source:** REQ-PUB-004, REQ-CON-002 ("general website content", "contact/business information"), `docs/PROJECT.md` Sections 16–18.
- **Boundary:** Exact settings, structure, and editability are unconfirmed. No setting names, fields, or defaults are defined here.
- **Rule:** Only client-confirmed information may be published (REQ-CON-003, REQ-CON-005). Unconfirmed settings are omitted, never filled with placeholders.

### 5.2 Services — Confirmation Required

- **Status:** **Confirmation Required** (concept direction is Confirmed; content and structure are not).
- **Concept:** Presentation of the confirmed photobooth service categories so customers can understand and compare options.
- **Source:** REQ-SVC-001 through REQ-SVC-007; `docs/PROJECT.md` Section 7; `docs/UI-UX.md` Section 8.
- **Content direction (not confirmed content):** Premium Photobooth, Roaming Photobooth, 360 Video Booth. Final names, descriptions, suitability statements, and setup/technical claims require client confirmation (REQ-SVC-005).
- **Boundary:** No service fields, slugs, ordering rules, or technical specifications are defined here. REQ-SVC-004 prohibits presenting Shot&Prints reference characteristics as confirmed claims.

### 5.3 Packages — Confirmation Required

- **Status:** **Confirmation Required** (concept direction is Confirmed; content and structure are not).
- **Concept:** Presentation of confirmed package options (duration, price, inclusions, conditions) without a booking engine.
- **Source:** REQ-PKG-001 through REQ-PKG-008; `docs/PROJECT.md` Section 9; `docs/UI-UX.md` Section 9.
- **Boundary:** No package names, durations, prices, inclusions, add-ons, or policies are confirmed here. All Shot&Prints pricing, inclusions, add-ons, and booking policies are Reference-Only (see Section 15). No package fields are defined here. If package content is part of the confirmed CMS implementation, authorized updates without source-code changes are required (REQ-PKG-007), but the editable representation remains Confirmation Required.

### 5.4 Gallery / Media — Confirmation Required

- **Status:** **Confirmation Required** (concept direction is Confirmed; curation and structure are not).
- **Concept:** Real event imagery supplied or approved by the client, presented responsively with accurate alt text and a graceful empty state.
- **Source:** REQ-GAL-001 through REQ-GAL-008; `docs/PROJECT.md` Sections 3, 16; `docs/UI-UX.md` Section 10.
- **Boundaries:**
  - No gallery categories are defined (REQ-GAL-007). Category filters must not be assumed (`docs/UI-UX.md` Section 10).
  - Stock imagery presented as real client events, and fake event claims, are prohibited (REQ-GAL-008).
  - Whether gallery content is CMS-managed, and by what mechanism, is Confirmation Required (REQ-GAL-006).
  - Media bytes versus metadata is addressed in Section 9. No bucket names, policies, or filenames are defined here.

### 5.5 FAQs — Confirmation Required

- **Status:** **Confirmation Required** (concept direction is Confirmed; content and structure are not).
- **Concept:** Client-confirmed questions with clearly distinguishable answers, usable on mobile, consistent with confirmed service/package/policy information.
- **Source:** REQ-FAQ-001 through REQ-FAQ-006; `docs/UI-UX.md` Section 12.
- **Boundaries:**
  - No FAQ content is defined in this or any existing document (REQ-FAQ-003).
  - Whether FAQs are CMS-editable, and by what mechanism, is Confirmation Required (REQ-FAQ-004).
  - FAQ structured data is Conditional only, where technically and semantically valid for published content (REQ-FAQ-005). It must never use invented Q&A.

### 5.6 Testimonials — Conditional and Confirmation Required

- **Status:** **Conditional** (only where supported by verified, approved content) and **Confirmation Required**.
- **Concept:** Optional supporting content shown only where genuine testimonials or reviews are approved with verified current data.
- **Source:** REQ-REV-007, `docs/REQUIREMENTS.md` Section 23 (testimonials require confirmation), `docs/PROJECT.md` Section 23, `docs/UI-UX.md` Sections 16, 26, `docs/DESIGN-SYSTEM.md` Section 32.
- **Boundaries:**
  - There is no custom review entity. REQ-REV-005 and REQ-REV-006 prohibit a custom review submission system and a custom review database.
  - Fake, generated, or unverified reviews or ratings must never be displayed (REQ-REV-007).
  - The primary review mechanism is the Google Business Profile review link CTA, which is an external link, not stored data (see `docs/REQUIREMENTS.md` Section 12).
  - Whether any testimonial content exists, and whether it is CMS-managed, is Confirmation Required. Absent testimonials are simply omitted.

### 5.7 Inquiry Records — Conditional Only

- **Status:** **Conditional.** Does not exist by default.
- **Concept:** A stored record of an inquiry submission, only if the confirmed CMS scope explicitly requires booking/inquiry record storage.
- **Source:** `docs/PROJECT.md` Section 10, `docs/TECH-STACK.md` Section 13, `docs/ARCHITECTURE.md` Section 10, REQ-INQ-002.
- **Rules:**
  - Default architecture has no inquiry entity: Customer → Inquiry Form → Validation → EmailJS → Client Gmail.
  - The Supabase branch exists only on explicit confirmation (see Section 11).
  - This concept must never grow into a CRM or booking-management system (see Section 16).
  - No inquiry fields, tables, retention rules, or statuses are defined here. Final field set and required-versus-optional designation are Confirmation Required (REQ-INQ-008 through REQ-INQ-010).

### 5.8 Admin / Auth Users — Separate Authentication Concept

- **Status:** **Confirmed** as an authentication concept; structure is not defined here.
- **Concept:** The authenticated business client who manages website content through the CMS. This is an identity managed by Supabase Auth, not a content record and not a public entity.
- **Source:** REQ-CMS-002, REQ-CMS-003, REQ-SEC-001, REQ-SEC-002; `docs/TECH-STACK.md` Section 11; `docs/ARCHITECTURE.md` Section 12.
- **Boundaries:**
  - Supabase Auth is the authentication foundation. No custom identity system is part of the architecture.
  - No roles, permission structures, hierarchies, session shapes, or user fields are defined here. Detail belongs in `docs/SECURITY.md`.
  - Admin identities never appear in public content and are never exposed to customers.

---

## 6. Conceptual Relationships

Relationships are stated as content intentions, not foreign keys or constraints. No referential implementation is defined here.

- **Services to packages:** services include a path to relevant packages and inquiry submission (REQ-PUB-012, REQ-SVC-006). This is a navigational/content association (services ↔ packages ↔ inquiry per REQ-NAV-006), not a confirmed data-level dependency. Whether it is modeled as a stored link or as editorial cross-linking is Confirmation Required.
- **Packages to inquiry:** package presentation includes a path to inquiry submission (REQ-PUB-015). Selecting a package never implies reservation. No stored reservation relationship exists.
- **Gallery to other concepts:** gallery items are standalone visual-trust content. No confirmed relationship to services, packages, or categories exists. No categories or tagging model is defined.
- **FAQs to other concepts:** FAQ answers may link to services, packages, or inquiry where helpful (`docs/UI-UX.md` Section 12) and must not contradict confirmed service/package/policy information (REQ-FAQ-006). This is an editorial linking convention, not a data dependency.
- **Site settings to pages:** confirmed business information may be reused across pages (header, footer, contact contexts). Whether reuse is by reference or by duplication at render time is an implementation concern and is not decided here.
- **Testimonials to pages (if confirmed):** optional supporting content omitted when absent. No required relationship to any other concept.
- **Inquiry records to other concepts (if confirmed):** standalone administrative copies of submitted inquiries. No workflow, status machine, assignment, or follow-up relationship is modeled. The inquiry system has no availability, payment, or reservation relations by design.

Where a future confirmed implementation needs a stored relationship, its cardinality, optionality, and integrity rules require explicit confirmation and belong in implementation detail, not in this conceptual document.

---

## 7. Field and Data-Type Categories and Validation Principles

No per-entity fields are defined. This section defines only the **kinds of values** the model may need once CMS scope is confirmed, and the principles that govern them.

### 7.1 Data-type categories (generic, not field assignments)

If CMS scope is later confirmed, stored values are expected to fall into these ordinary categories. Listing a category does not confirm any field:

- Short plain text (names, titles, labels).
- Long plain text (descriptions, answers, business statements).
- Structured lists (inclusions, steps, option summaries presented as lists).
- Monetary amounts and durations (package prices, hire lengths) — only as confirmed; never invented.
- Calendar dates (event dates) — only as confirmed in the inquiry context.
- Contact details (email, phone, venue/location) — only as confirmed; no additional personal-data kinds without justification (REQ-INQ-011).
- Selections from confirmed option sets (event types, photobooth preferences) — option lists require confirmation (REQ-INQ-009, REQ-INQ-010).
- True/false and visibility indicators (only where a publishing or availability concept is confirmed — see Section 8).
- Media references (pointers to Storage-managed files plus descriptive text such as alt text) — see Section 9.
- External links (for example the client-supplied Google Business Profile review URL) — actual URLs require confirmation (REQ-REV-004); no placeholder URLs.

No IDs, key formats, string lengths, numeric precisions, date formats, enums, defaults, nullability rules, or constraints are defined here.

### 7.2 Validation principles

- **CMS input** is validated with clear, field-associated, non-technical error messages; invalid content is rejected (REQ-CMS-006). Exact rules per content area are Confirmation Required and belong in implementation and `docs/API.md`.
- **Inquiry input** is validated before sending at minimum for required-field presence, email format, and confirmed format rules (REQ-INQ-012); errors are communicated near the relevant field and submission is blocked while invalid input remains (REQ-INQ-013, REQ-INQ-014). Exact rules belong in `docs/API.md` and implementation.
- **Client-side validation is usability only.** Server-side validation is the enforcement layer (`docs/ARCHITECTURE.md` Section 14).
- **Business-critical content** (pricing, policies, contact details, legal pages) requires explicit client approval before publication (REQ-CON-004, REQ-CON-005). Validation never substitutes for that approval.
- **No invented constraints.** Length limits, formats, required-versus-optional designations, and option sets must not be invented. The final inquiry field set is Confirmation Required (REQ-INQ-008).

---

## 8. Ordering, Visibility, and Identity Concepts

These-concepts (ordering, active/inactive, published/unpublished, slugs) are introduced **only where justified** by existing requirements. Anything else is Confirmation Required.

- **Published versus unpublished — justified as a concept, workflow unconfirmed.** The distinction between saved/published content and absent or draft content is supported by REQ-CON-004 ("reflected on the public website predictably once saved and published"), `docs/ARCHITECTURE.md` Sections 7 and 11 ("only published, confirmed content", "published status"), and `docs/UI-UX.md` Section 23 ("published status"). The exact publishing workflow (immediate publish versus draft review, who publishes, what "published" changes) is **Confirmation Required** (see Section 17). No status values, transitions, or fields are defined here.
- **Ordering — Confirmation Required.** No existing requirement establishes a display order for services, packages, gallery items, or FAQs. If ordering is later needed (for example gallery sequence or FAQ sequence), its mechanism requires confirmation. No ordering fields or default sorts are defined here.
- **Active/inactive or enabled/disabled — Confirmation Required.** No existing requirement establishes an active/inactive flag for any content area. Visibility of unconfirmed or empty areas is handled by omission or sensible fallback per `docs/UI-UX.md` Section 21, not by an assumed flag. No such flags are defined here.
- **Slugs and content identifiers — Confirmation Required.** No existing requirement establishes CMS-managed slugs or identifier schemes. Canonical URLs, sitemap entries, and page routes are technical SEO concerns owned by architecture and implementation; they do not imply a CMS slug field. No slug format, uniqueness rule, or identifier scheme is defined here.
- **SEO-facing identity caution.** Structured data and metadata must describe only real published content (REQ-SEO-011, REQ-FAQ-005). Identity or slug mechanisms must never be used to fabricate indexable pages, and unnecessary SEO landing pages must not be created (REQ-SEO-021, REQ-NAV-007).

---

## 9. CMS Media Metadata and Supabase Storage

- **Confirmed direction:** Supabase Storage is the media/file storage foundation, for example for gallery images where required by the confirmed implementation (`docs/TECH-STACK.md` Section 12; `docs/ARCHITECTURE.md` Section 17).
- **Conceptual split:**
  - **Storage** holds file bytes and is the system of record for CMS-managed media. No custom file-server infrastructure exists.
  - **Content metadata** (whatever descriptive information the confirmed implementation captures, such as accurate alt text per REQ-GAL-003) travels with the content concept so Astro can render accessible, optimized HTML.
- **What is not defined here:** bucket names, access models, policies, filenames, folder layouts, file-size limits, format restrictions, image-processing pipelines, and metadata fields. The exact media access model (public versus controlled retrieval) requires confirmation and belongs in `docs/SECURITY.md` and implementation (`docs/ARCHITECTURE.md` Section 17).
- **Rules carried from source documents:**
  - Upload, replacement, and removal go through authenticated, authorized CMS operations with validation and predictable behavior (REQ-CMS-010; `docs/ARCHITECTURE.md` Section 11).
  - Retrieval honors the confirmed access model: public gallery imagery must be retrievable for rendering; non-public content must not be exposed.
  - Optimization responsibility is shared between the CMS side (upload-time handling) and the public-site side (render-time responsive images and lazy loading where appropriate) per `docs/ARCHITECTURE.md` Section 17. Formats, sizing, compression, and loading behavior are implementation concerns, not data-model decisions.
  - Absent or failed images never break layout (`docs/UI-UX.md` Sections 10, 21).

---

## 10. Public-Content Versus Admin-Only Data Boundaries

### 10.1 Public content

- Public HTML contains **only** confirmed, published business content rendered by Astro into crawlable pages (services, packages, gallery, FAQs, business information, legal pages as confirmed).
- Customers interact only with the public website. They never interact directly with CMS data, admin routes, or secrets (`docs/ARCHITECTURE.md` Section 5).
- Empty or missing CMS content produces a sensible fallback or empty state, never a broken layout or raw error (REQ-STA-007, REQ-STA-008).
- Admin routes are separated from public routes and excluded from indexing (`docs/ARCHITECTURE.md` Sections 11, 18).

### 10.2 Admin-only data

The following never appears in public output:

- Draft, unreviewed, or unpublished edits and any CMS-internal state (to the extent a publishing workflow is later confirmed).
- Admin identities, sessions, and authorization internals.
- Inquiry records, if the Conditional persistence is ever confirmed — they are administrative copies for business follow-up context, not public content.
- Secrets, keys, service configuration, verification internals, and diagnostics.

### 10.3 Inquiry data in transit

- Inquiry submissions are validated, spam-checked, and emailed to the client's Gmail; business follow-up happens in Gmail, outside the application (`docs/PROJECT.md` Section 10).
- Inquiry data is handled securely in transit and at rest to the extent governed by the implemented services (REQ-SEC-004). Detail belongs in `docs/SECURITY.md`.
- No additional personal-data kinds beyond what is confirmed may be collected (REQ-INQ-011). The final field set is Confirmation Required.

---

## 11. Inquiry Persistence as Conditional

### 11.1 Default — no stored inquiry entity (Confirmed)

The required flow is (REQ-INQ-002):

```text
Customer → Inquiry Form → Validation → EmailJS → Client Gmail
```

The default architecture does **not** persist inquiries to Supabase (`docs/PROJECT.md` Section 10; `docs/TECH-STACK.md` Section 13; `docs/ARCHITECTURE.md` Section 10). Email delivery to Gmail must occur when the form reports success (REQ-INQ-018).

### 11.2 Conditional — stored inquiry records only on explicit confirmation

If booking/inquiry record storage is explicitly required by the confirmed CMS scope:

```text
Customer → Inquiry Form → Validation → Supabase + EmailJS → CMS record + Client Gmail
```

Rules for the conditional branch:

1. It exists **only** on explicit confirmation. Absence of confirmation means absence of the entity.
2. The EmailJS → Gmail branch remains the required path with or without persistence.
3. Email delivery must not silently depend on database persistence succeeding, and vice versa, unless a confirmed requirement defines the combined failure behavior. Combined failure behavior belongs in `docs/API.md` and `docs/SECURITY.md` when the condition is confirmed (`docs/ARCHITECTURE.md` Section 10).
4. No inquiry table, fields, statuses, retention, or access rules are designed here.
5. An empty records view, if the feature ever exists, explains that no inquiries exist yet rather than showing a broken table (`docs/UI-UX.md` Section 21).

### 11.3 What conditional persistence never becomes

Even if confirmed, inquiry storage does not introduce real-time availability, calendar reservation, payments, checkout, reservation allocation, follow-up workflows, or CRM behavior. Those remain explicitly out of scope (REQ-INQ-020, REQ-OOS-001 through REQ-OOS-005; see Section 16).

---

## 12. Authentication Foundation

- **Selected foundation:** Supabase Auth for CMS/admin access control (`docs/TECH-STACK.md` Section 11).
- **Confirmed requirements:** admin access requires secure authentication; unauthenticated users must not access CMS functionality (REQ-CMS-002); authenticated actions respect authorization rules (REQ-CMS-003); credentials are never hardcoded, committed, or exposed (REQ-SEC-001).
- **Data-model treatment:** authentication identities are a **separate concept** from website content. They are not pages, settings, services, packages, gallery items, FAQs, testimonials, or inquiry records, and they never appear in public rendering.
- **Not defined here:** roles, hierarchies, session shapes, token handling, invite flows, password policies, or any user fields. No role or permission structure is invented. Detail belongs in `docs/SECURITY.md` and `docs/ARCHITECTURE.md`.

---

## 13. Authorization and RLS Data-Model Considerations

High-level considerations only. Detailed security belongs in `docs/SECURITY.md`.

1. **Public visitors are anonymous.** They read only intentionally published content as rendered HTML and may submit inquiries. They have no read or write access to CMS data beyond that published output (`docs/ARCHITECTURE.md` Section 12).
2. **CMS operations are authenticated and authorized.** Every content read/write and media operation in the CMS is subject to server-side authorization. Client-side route hiding alone is not a security boundary.
3. **Supabase access control must protect CMS data.** Row-level/authorization behavior per REQ-SEC-002 must ensure public retrieval cannot bypass authorization to reach raw CMS data (`docs/ARCHITECTURE.md` Section 13).
4. **Conditional inquiry records, if ever stored, are admin-only.** No public read path to stored inquiries is part of this model. Exact rules belong in `docs/SECURITY.md`.
5. **Validation and verification are enforcement layers.** Server-side validation and Turnstile verification handling sit at the Astro Server Endpoint boundary; client-side checks are usability only.
6. **No policies are defined here.** No RLS policies, grants, bucket policies, or role assignments are invented in this document.

---

## 14. Deletion, Archival, Referential-Integrity, and Retention Principles

No retention periods, legal obligations, or contractual terms are invented here (REQ-SEC-009; REQ-PUB-027, REQ-PUB-029).

1. **Safe deletion in the CMS.** Delete and remove operations require explicit confirmation naming the affected content in business terms, with clear success/failure feedback (REQ-CMS-007, REQ-CMS-008; `docs/UI-UX.md` Sections 23–24). Destructive actions are never one accidental click.
2. **Preserve intentional behavior on delete.** Deleting CMS content must not leave the public site in a broken state. Empty areas fall back to sensible omission or empty states per `docs/UI-UX.md` Section 21 (for example, an unconfirmed Packages section directs visitors to inquire rather than rendering a broken table).
3. **Referential caution without overengineering.** Because relationships in Section 6 are editorial rather than enforced, the model assumes no cascade rules, no shared-ownership deletes, and no cross-entity integrity machinery. If stored relationships are later confirmed, their delete behavior requires explicit confirmation at that time.
4. **No archival or versioning system.** Revision history, audit trails, soft-delete infrastructure, and approval chains are enterprise CMS concepts and are not part of this model unless explicitly rescoped (`docs/UI-UX.md` Sections 24, 31). "Archival" where mentioned means deliberate editorial removal handled through the confirmed CMS workflow, not a separate data subsystem.
5. **Media removal.** Replacement and removal of CMS-managed files behave predictably with confirmation and success/failure feedback (REQ-CMS-010). Orphaned-file handling, if needed, is an implementation concern and is not specified here.
6. **Retention is unconfirmed.** Data-retention periods for inquiries (if ever stored), logs, or CMS content are not defined in any existing document. Privacy Policy and Terms & Conditions content must reflect actual implemented handling once confirmed. Nothing here authorizes inventing a retention schedule.

---

## 15. Shot&Prints Reference Boundary

Shot&Prints is the previous/reference website. It is **Reference-Only** and **not** the current brand identity (`docs/PROJECT.md` Section 17; `docs/REQUIREMENTS.md` Sections 5–6; `docs/DESIGN-SYSTEM.md` Section 4).

- Shot&Prints material may inform discussion but must be verified before being presented as current Melbourne Photobooth Hire information (`docs/PROJECT.md` Sections 9, 16).
- The following are Reference-Only and require client confirmation before publication or modeling as production data:
  - Service characteristics (open-air setup, studio-quality lighting/styling claims, social/open experience claims, candid interaction claims, backdrop claims, event suitability claims, 360 pairing claims).
  - Package pricing (reference: Starter 2h $350 / Standard 3h $450 / Premium 4h $600).
  - Package inclusions (reference list in `docs/PROJECT.md` Section 9 and `docs/REQUIREMENTS.md` REQ-PKG-003).
  - Add-ons (reference: Professional Photography, Extended Hire, Custom Backdrop, Digital Guestbook).
  - Booking policies (reference: 20% deposit, balance due on event day, non-refundable deposit description, rescheduling subject to notice).
  - Any carried-forward business information, contact details, service-area statements, imagery, FAQs, testimonials, or policies.
- Reference pricing, inclusions, add-ons, and policies must not be modified, reinterpreted, or invented (`docs/PROJECT.md` Section 9).
- Shot&Prints branding, naming, contact information, logos, colors, typography, and brand language must not be used as current project information unless explicitly confirmed.

---

## 16. Explicit Exclusions (Non-Entities)

The data model explicitly does **not** include the following unless the client explicitly expands the project and the change is recorded as a new decision. This list mirrors `docs/PROJECT.md` Section 21, `docs/REQUIREMENTS.md` Section 22, and `docs/ARCHITECTURE.md` Section 24.

- Real-time availability or reservation entities (calendars, slots, holds, allocations).
- Payment or checkout entities (orders, transactions, balances, refunds).
- Complex booking management (status machines, assignments, scheduling workflows).
- CRM entities (contacts pipeline, follow-ups, notes, tasks, campaigns).
- Marketing automation entities (segments, campaigns, sends, journeys).
- Custom Google review system entities (review submissions, ratings stores, moderation queues). The review mechanism is an external link, not stored data.
- Unnecessary enterprise CMS structures (versions, revisions, audit logs, approval chains, multi-workspace models, theming systems).
- Separate backend data layer entities (no second database, no service-specific stores, no queues or job tables).

Introducing any of the above requires an explicitly rescoped requirement.

---

## 17. Confirmation Required Matrix

Exact CMS modules, fields, workflows, and policies below require explicit client confirmation. Anything originating from Shot&Prints remains Reference-Only until confirmed.

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 1 | Final CMS modules and editable content areas | **Confirmation Required** | Candidate areas in REQ-CON-002 only (services, packages, gallery, FAQs, general content, contact/business information). No module is final (REQ-CMS-012). |
| 2 | Exact fields per content area | **Confirmation Required** | No fields are defined in any existing document. Must not be assumed or invented. |
| 3 | Inquiry persistence (whether Supabase stores inquiry records) | **Conditional / Confirmation Required** | Default is no storage (REQ-INQ-002). Storage only on explicit confirmation (`docs/PROJECT.md` Sec. 10; `docs/ARCHITECTURE.md` Sec. 10). |
| 4 | Service data (final names, descriptions, suitability/setup claims) | **Confirmation Required / Reference-Only inputs** | REQ-SVC-005 requires confirmation. Reference characteristics must not be published as confirmed (REQ-SVC-004). |
| 5 | Package data (names, durations, prices, inclusions, add-ons, conditions, policies) | **Confirmation Required / Reference-Only inputs** | Reference pricing, inclusions, add-ons, and policies in `docs/PROJECT.md` Sec. 9 and REQ-PKG-002–005 are reference only. Nothing may be published without confirmation (REQ-PKG-006). |
| 6 | Gallery metadata and CMS mechanism | **Confirmation Required** | Imagery must be real, client-approved (REQ-GAL-001). No categories defined (REQ-GAL-007). CMS manageability unconfirmed (REQ-GAL-006). No bucket names, policies, or metadata fields defined here. |
| 7 | FAQ data (final questions and answers) | **Confirmation Required** | No FAQ content is defined (REQ-FAQ-003). CMS editability unconfirmed (REQ-FAQ-004). Structured data is Conditional only (REQ-FAQ-005). |
| 8 | Testimonials (existence and approval) | **Conditional / Confirmation Required** | Only genuine, approved, verified content may appear (REQ-REV-007). No custom review database (REQ-REV-006). |
| 9 | Site and contact settings (business details, service-area statement, hours, links) | **Confirmation Required** | Displayed only once confirmed (REQ-PUB-004). Service-area rules, travel fees, and contact details require confirmation (`docs/PROJECT.md` Sec. 18, 23). |
| 10 | Publishing workflow (draft versus published, who publishes, what publish changes) | **Confirmation Required** | Published/unpublished as a concept is justified (REQ-CON-004); the workflow itself is unconfirmed. No statuses or transitions defined here. |
| 11 | Media access model (public versus controlled retrieval) | **Confirmation Required** | Supabase Storage is the confirmed foundation; the access model is undecided (`docs/ARCHITECTURE.md` Sec. 17). Detail belongs in `docs/SECURITY.md`. |
| 12 | Data retention (inquiries if ever stored, logs, CMS content) | **Confirmation Required** | No retention periods are defined (REQ-SEC-009). Legal content must reflect actual behavior (REQ-PUB-027). |
| 13 | Google Business Profile review URL | **Confirmation Required** | Client must supply the link (REQ-REV-004). No placeholder or guessed URL may be published. |
| 14 | Legal content (Privacy Policy, Terms & Conditions) | **Confirmation Required** | Must be client-approved and reflect actual handling/policies (REQ-PUB-027, REQ-PUB-029). No terms invented. |
| 15 | Inquiry field set and required-versus-optional designation | **Confirmation Required** | Potential fields and option lists in REQ-INQ-008–010 are possibilities, not confirmed requirements. No additional personal-data fields without justification (REQ-INQ-011). |

---

## 18. Related Documentation

Currently existing documents:

- `AGENTS.md` — AI-agent development rules.
- `README.md` — repository orientation.
- `docs/PROJECT.md` — product and business context.
- `docs/REQUIREMENTS.md` — functional and business requirements.
- `docs/TECH-STACK.md` — technology choices and technical constraints.
- `docs/ARCHITECTURE.md` — application architecture and code organization.
- `docs/UI-UX.md` — user experience and interaction requirements.
- `docs/DESIGN-SYSTEM.md` — visual and component design rules.

This document:

- `docs/DATA-MODEL.md` — database structure and relationships (this document; conceptual level only, no schema).

Deferred detail owners (not duplicated here):

- `docs/API.md` — API and external service contracts (owns endpoint detail, validation rule detail, email/verification flows).
- `docs/SECURITY.md` — security requirements and constraints (owns auth behavior, authorization rules, RLS policies, secret handling, spam-verification detail).
- `docs/TESTING.md` — testing and verification strategy.
- `docs/DEVELOPMENT.md` — local development workflow and commands.
- `docs/DEPLOYMENT.md` — deployment and production procedures.
- `docs/DECISIONS.md` — important architectural and technical decisions.

---

## 19. Acceptance Criteria

This data-model document is considered complete when:

1. `docs/DATA-MODEL.md` exists and is the only file created or modified for this task.
2. Purpose, principles, and authority boundaries are clearly stated without duplicating implementation detail from other documents.
3. Core concepts are defined — site/global settings, services, packages, gallery/media, FAQs, testimonials (only where supported), inquiry records (conditional only), and admin/auth users as a separate authentication concept — without inventing final CMS modules, tables, columns, IDs, enums, or policies.
4. Conceptual relationships are described without introducing foreign keys, constraints, or stored dependencies beyond what existing documentation supports.
5. Field and data-type categories and validation principles are stated generically without assigning definitive fields to any entity.
6. Ordering, active/inactive, published/unpublished, and slug concepts appear only where justified by existing requirements; everything else in that group is marked **Confirmation Required**.
7. The CMS media-metadata versus Supabase Storage relationship is explained without inventing bucket names, policies, filenames, or implementation details.
8. Public-content versus admin-only data boundaries are clearly drawn, consistent with `docs/ARCHITECTURE.md` and `docs/REQUIREMENTS.md`.
9. Inquiry persistence is presented as **Conditional**: the default EmailJS → Gmail flow is required, Supabase storage exists only on explicit confirmation, and no CRM or booking-management behavior is introduced.
10. Supabase Auth is stated as the authentication foundation without inventing roles or permission structures.
11. Authorization and RLS considerations are stated at a high level only, with detailed security deferred to `docs/SECURITY.md`.
12. Deletion, archival, referential-integrity, and retention principles are stated without inventing retention periods, audit systems, or enterprise workflows.
13. Confirmed, Conditional, Confirmation Required, and Reference-Only information are clearly distinguished throughout, with a Confirmation Required matrix covering CMS modules, exact fields, inquiry persistence, service/package data, gallery metadata, FAQ data, testimonials, site/contact settings, publishing workflow, media access model, and data retention.
14. Shot&Prints pricing, packages, policies, and content are identified as Reference-Only and never as confirmed production data.
15. Real-time availability/reservation, payment/checkout, complex booking management, CRM, marketing automation, custom Google review system, unnecessary enterprise CMS structures, and a separate backend data layer are explicitly excluded.
16. The model is internally consistent with `docs/PROJECT.md`, `docs/REQUIREMENTS.md`, `docs/TECH-STACK.md`, `docs/ARCHITECTURE.md`, `docs/UI-UX.md`, and `docs/DESIGN-SYSTEM.md`.
17. No SQL migrations, application code, API request/response schemas, detailed RLS policies, or unsupported business/technical decisions were introduced.
18. The document is implementation-useful without prematurely locking the project into an unconfirmed database schema.
19. Related-document references and this acceptance-criteria section are included.
