# Melbourne Photobooth Hire — Technology Stack

## 1. Technology Stack Overview

This document is the authoritative technical stack reference for the Melbourne Photobooth Hire project. It answers:

> **What technologies are we using, what is each one for, why was it selected, and what technologies are intentionally not being used?**

This is a greenfield project. The stack below is the intended technical direction, not a description of existing implementation. Implementation status must be confirmed from the repository.

Source context:

* `docs/PROJECT.md` — product and business context (authoritative for business/product questions).
* `docs/REQUIREMENTS.md` — functional and business requirements (authoritative for what the system must do).
* Root `AGENTS.md` — development rules and scope control.
* Root `README.md` — repository orientation.

Detailed implementation — including architecture, data models, API contracts, and security policies — belongs in later documents (`ARCHITECTURE.md`, `DATA-MODEL.md`, `API.md`, `SECURITY.md`) and is intentionally not duplicated here.

Status labels used in this document:

* **Selected** — confirmed technical direction for the current scope.
* **Conditional** — used only if a confirmed requirement needs it.
* **Recommended** — preferred approach, subject to implementation detail.
* **Not Selected** — intentionally avoided for the current scope.
* **Requires Confirmation** — depends on client/business information, not technical preference.

No package versions, IDs, URLs, credentials, or environment values are included in this document.

## 2. Technology Selection Principles

1. Prefer SEO-friendly, server-rendered HTML for content-heavy marketing pages.
2. Minimize client-side JavaScript; add interactivity only where genuinely needed.
3. Prefer the simplest solution consistent with the requirements.
4. Reuse selected technologies before introducing new ones.
5. Avoid unnecessary dependencies, services, infrastructure, and abstractions.
6. Keep the CMS scoped to managing confirmed website content — not an enterprise CMS or CRM.
7. Keep the inquiry system scoped to an inquiry/request workflow — not a reservation, payment, or CRM platform.
8. Keep all choices practical and maintainable within the fixed **₱15,000** project scope.

## 3. Stack Summary

| Area | Technology / Service | Status | Role |
| --- | --- | --- | --- |
| Frontend framework | Astro | Selected | Primary framework for content-heavy marketing pages |
| Interactive UI | React (islands) | Selected | Client-side interactivity only where needed |
| Language | TypeScript | Selected | Project programming language |
| Styling | Styled Components | Selected | Preferred styling solution |
| Icons | Lucide React | Selected | Icon library for UI |
| Animation | Motion | Selected | UI animation where genuinely needed |
| Forms | React Hook Form | Selected | Inquiry form state and submission handling |
| Validation | Zod | Selected | Input validation (inquiry form, CMS inputs where applicable) |
| Backend / API | Astro Server Endpoints | Selected | Backend/API functionality where required |
| Database | Supabase PostgreSQL | Selected | CMS content and conditional inquiry-record storage |
| Auth | Supabase Auth | Selected | CMS/admin authentication foundation |
| Storage | Supabase Storage | Selected | Media/file storage foundation (e.g. gallery) |
| CMS | Custom admin panel on Supabase | Selected | Client-editable website content |
| Email delivery | EmailJS | Selected | Inquiry email delivery |
| Email destination | Client Gmail | Selected | Destination for inquiry emails |
| Spam protection | Cloudflare Turnstile | Selected | Inquiry form spam-protection direction |
| Hosting / deployment | Vercel | Selected | Hosting and deployment platform |
| Domain registrar | Namecheap | Selected | Domain registration |
| Source control | GitHub | Selected | Source control |
| Sitemap | `@astrojs/sitemap` | Selected | XML sitemap generation (Astro integration) |
| Structured data | Schema.org JSON-LD | Selected | Structured-data standard for eligible pages |
| Search monitoring | Google Search Console | Selected | Indexing and search monitoring (external service) |
| Local presence | Google Business Profile | Selected | Local SEO presence (external service) |
| Review CTA | Google Business Profile review link | Requires Confirmation | Review link destination supplied by client |
| Analytics | Google Analytics 4 | Conditional / Could | Only if confirmed and appropriate; not mandatory |

## 4. Frontend

### Astro — Selected

* **What:** Primary frontend framework.
* **For:** Content-heavy marketing pages (Home, Services, Packages, Gallery, About, FAQ, Contact, legal pages, 404).
* **Why:** This is a content-heavy marketing website where SEO-friendly HTML, performance, and crawlability matter (REQ-PER-004, REQ-PER-006, REQ-SEO-014, REQ-SEO-016). Astro produces server-rendered/static HTML by default and supports minimal client-side JavaScript, which directly supports the performance and SEO requirements.

### React — Selected (islands only)

* **What:** UI library for interactive components/islands.
* **For:** Genuinely interactive UI only — for example booking/inquiry form, mobile navigation, gallery/lightbox, and other confirmed interactive elements.
* **Why:** React is needed for stateful client-side interaction, but content pages must not pay for unnecessary JavaScript. React is therefore scoped to islands, consistent with REQ-PER-004 and REQ-PER-005.

### TypeScript — Selected

* **What:** Project programming language.
* **For:** Frontend components, validation logic, server endpoints, and CMS-related code.
* **Why:** Provides type safety and maintainability across the small, focused codebase without adding runtime cost or infrastructure.

## 5. Interactive UI

React islands (Section 4) cover the confirmed interactive surface. No separate interactive framework is selected.

Anticipated interactive areas — subject to final implementation — include:

* Booking/inquiry form (state, validation feedback, submission progress, success/error states).
* Mobile navigation (menu open/close behavior).
* Gallery/lightbox interaction (if confirmed in implementation).
* Other genuinely interactive UI only.

Content-heavy pages must remain functional, readable, and crawlable without depending on these islands.

## 6. Styling and UI Utilities

### Styled Components — Selected

* **What:** Preferred styling solution.
* **For:** Component-scoped styles across Astro and React UI.
* **Why:** Established project direction. Provides maintainable component styling without introducing a second styling system.

Do not introduce Tailwind CSS or another styling system without a future justified decision (see Section 21).

### Lucide React — Selected

* **What:** Icon library.
* **For:** UI icons (navigation, calls to action, form feedback, CMS/admin UI where applicable).
* **Why:** Lightweight, consistent icon set compatible with the React islands approach. Avoids custom icon infrastructure for standard UI needs.

### Motion — Selected

* **What:** Animation library.
* **For:** UI animation and transitions where genuinely needed.
* **Why:** Covers confirmed motion needs (e.g. menu, dialog, gallery, and feedback transitions) without building ad hoc animation infrastructure. Must respect reduced-motion preferences per REQ-ACC-011. Do not use animation decoratively where it harms performance, accessibility, or usability.

## 7. Forms and Validation

### React Hook Form — Selected

* **What:** Form state and submission library.
* **For:** Booking/inquiry form (and CMS editing forms where applicable in implementation).
* **Why:** Handles field state, validation integration, submission-in-progress handling, and duplicate-submission prevention required by REQ-STA-003, REQ-INQ-012 through REQ-INQ-014, and REQ-CMS-006, without custom form infrastructure.

### Zod — Selected

* **What:** Schema validation library.
* **For:** Inquiry-form validation (required-field presence, email format, confirmed format rules) and CMS/admin input validation where applicable.
* **Why:** Provides explicit, reusable validation schemas shared across client and server boundaries as needed. Supports REQ-SEC-003 (validate input at appropriate boundaries) and REQ-INQ-012. Detailed validation rules belong in implementation and `API.md`/`SECURITY.md`, not here.

## 8. Backend / API

### Astro Server Endpoints — Selected

* **What:** Backend/API mechanism.
* **For:** Server-side functionality where required — for example spam-verification handling, email/CMS bridging logic, or other confirmed server-side needs.
* **Why:** Astro Server Endpoints cover the project's limited backend needs without adding a separate backend framework, server, or deployment unit. This keeps the architecture within the ₱15,000 scope and avoids unnecessary infrastructure.

Do not introduce Express, NestJS, or another separate backend unless a future confirmed requirement genuinely justifies it (see Section 21).

## 9. Database

### Supabase PostgreSQL — Selected

* **What:** Managed PostgreSQL database.
* **For:** CMS content foundation; conditional storage of inquiry records only if explicitly required.
* **Why:** Provides the database backend for the custom CMS without self-hosted database infrastructure. The default inquiry flow does not require inquiry-record storage (see Section 13); database storage of inquiries is conditional on a confirmed CMS requirement.

No table schemas, fields, or policies are defined here. They belong in `DATA-MODEL.md` and `SECURITY.md`.

## 10. CMS / Admin

### Custom CMS / admin panel built on Supabase — Selected

* **What:** Project-specific admin panel backed by Supabase (PostgreSQL, Auth, Storage).
* **For:** Letting the client manage confirmed website content without editing source code.
* **Why:** Matches REQ-CMS-001 through REQ-CMS-010 and REQ-CON-001: clear content organization, safe editing, validation, predictable save behavior, and media handling where required — scoped to confirmed website content.

Explicit boundary: the CMS must not become a general-purpose enterprise CMS or CRM (REQ-CMS-013). Exact modules, editable areas, and fields require confirmation (REQ-CMS-012) and belong in `DATA-MODEL.md` and `ARCHITECTURE.md`.

## 11. Authentication

### Supabase Auth — Selected

* **What:** Authentication service.
* **For:** CMS/admin access control foundation.
* **Why:** Required by REQ-CMS-002 and REQ-SEC-001/REQ-SEC-002: admin access must require secure authentication and authorization. Using the Supabase-integrated auth avoids a custom identity system.

Detailed auth behavior, roles, session handling, and authorization rules belong in `SECURITY.md` and `ARCHITECTURE.md`.

## 12. File and Media Storage

### Supabase Storage — Selected

* **What:** Managed file/media storage.
* **For:** CMS-managed media foundation — for example gallery images, where required by the confirmed implementation.
* **Why:** Avoids custom file-server infrastructure and integrates with Supabase Auth-backed access control. Supports REQ-CMS-010 and REQ-GAL-001/REQ-GAL-004 at the infrastructure level.

Image optimization, formats, sizing, alt text, and loading behavior are implementation concerns belonging in `ARCHITECTURE.md` (and UI/UX documentation), not here.

## 13. Email

### EmailJS — Selected

* **What:** Email delivery service for inquiry submissions.
* **For:** Sending validated inquiry submissions to the client's Gmail.
* **Why:** Satisfies REQ-EML-001 through REQ-EML-004 and REQ-INQ-002 within the current scope, without operating SMTP infrastructure or a custom mail server.

### Client Gmail — Selected (destination)

* **What:** Destination mailbox for inquiry emails.
* **For:** Business follow-up on customer inquiries.
* **Why:** Matches the confirmed inquiry model in `docs/PROJECT.md` (Section 10) and `docs/REQUIREMENTS.md` (REQ-INQ-002).

Preferred flow (current direction):

`Customer → Inquiry Form → Validation → EmailJS → Client Gmail`

Conditional flow (only if inquiry records in the CMS are explicitly required):

`Customer → Inquiry Form → Supabase + EmailJS → CMS Record + Client Gmail`

The second flow must only be implemented if booking record storage is actually required.

Do not add Resend, Nodemailer, custom SMTP infrastructure, or other email providers unless a confirmed requirement later requires a change (see Section 21).

No email addresses, service IDs, keys, or configuration values are included in this document.

## 14. Spam Protection

### Cloudflare Turnstile — Selected

* **What:** Spam-protection direction for the inquiry form.
* **For:** Submission protection against spam and abuse (REQ-INQ-017, REQ-SEC-007).
* **Why:** Selected project direction for form protection without dependendo on intrusive CAPTCHA UX. Covers the product-level requirement; server-side verification, key handling, and failure behavior are implementation concerns.

Detailed implementation, verification flow, and secret handling belong in `SECURITY.md` and `ARCHITECTURE.md`. No keys or configuration values are included here.

## 15. Hosting and Deployment

### Vercel — Selected (hosting / deployment platform)

* **What:** Hosting and deployment platform.
* **For:** Production (and preview) deployment of the Astro website, including server endpoints, HTTPS, and environment configuration.
* **Why:** Covers REQ-DEP-001 through REQ-DEP-006 at the platform level without managing servers. Responsible for serving production traffic over HTTPS and supporting production environment configuration.

Deployment procedures, environment setup, and verification steps belong in `DEPLOYMENT.md`.

## 16. Domain

### Namecheap — Selected (domain registrar)

* **What:** Domain registrar.
* **For:** Domain registration.
* **Why:** Established project direction. Namecheap's responsibility is registration; DNS/hosting wiring is a deployment concern documented in `DEPLOYMENT.md`.

No domain names or DNS values are included in this document.

## 17. Source Control

### GitHub — Selected (source control)

* **What:** Source-control platform.
* **For:** Repository hosting, version history, and collaboration.
* **Why:** Established project direction. Deployment integration details (if any) belong in `DEPLOYMENT.md`.

## 18. SEO and Google Services

These items are intentionally distinguished by kind: Astro integration, open standard, or external Google service. None includes IDs, URLs, or credentials.

### `@astrojs/sitemap` — Selected (Astro integration)

* **What:** Astro sitemap integration.
* **For:** XML sitemap generation (REQ-SEO-009, REQ-DEP-006).
* **Why:** Standard Astro mechanism for sitemap output; avoids custom sitemap infrastructure.

### Schema.org JSON-LD — Selected (structured-data standard)

* **What:** Structured-data vocabulary and JSON-LD format — a standard, not a package.
* **For:** Schema.org structured data where technically and semantically valid for the page content (REQ-SEO-011, REQ-FAQ-005).
* **Why:** Search-engine-readable structured data supporting technical SEO. Must only describe real published content; FAQ structured data must not use invented questions/answers.

### Google Search Console — Selected (external Google service)

* **What:** Google indexing and search-monitoring service.
* **For:** Verification and indexing monitoring readiness (REQ-SEO-018, REQ-ANA-001).
* **Why:** Required readiness for a local-SEO-focused site. No tracking IDs or verification values are defined here.

### Google Business Profile — Selected (external Google service)

* **What:** Google local business presence.
* **For:** Local SEO presence and profile linking where appropriate and confirmed (REQ-SEO-019, REQ-ANA-002).
* **Why:** Supports local search intent alongside on-site local context. Profile content itself is managed in Google, not in this repository.

### Google Business Profile review link — Requires Confirmation (external link)

* **What:** Client-supplied review URL for the Google review CTA.
* **For:** `Website → Google Business Profile review link` CTA (REQ-REV-001 through REQ-REV-004).
* **Why:** The website must not implement a custom review system (REQ-REV-005/006) or display unverified reviews (REQ-REV-007). The actual URL requires client confirmation; no placeholder or guessed URL may be published.

## 19. Analytics

### Google Analytics 4 — Conditional / Could

* **What:** Web analytics service (external Google service).
* **Status:** Conditional — **not mandatory**. Per REQ-ANA-004, GA4 MAY be included where confirmed and appropriate for the project scope.
* **Why conditional:** The requirements treat analytics as optional (`Could`), unlike Search Console readiness (`Must`). Including GA4 adds consent/privacy considerations (reflected in Privacy Policy requirements) and implementation cost, so it must only be added on confirmation.

No measurement IDs, tracking IDs, or account information are defined here (REQ-ANA-005).

## 20. Environment and Configuration

Security-related technology boundaries (detail belongs in `SECURITY.md`):

* Secrets must not be hardcoded, committed, or exposed in client-side source.
* Sensitive configuration (EmailJS configuration, Turnstile keys, Supabase keys, deployment settings) must use environment variables/configuration appropriate to each environment, without committing secrets to source control.
* EmailJS configuration must not be treated as a reason to expose sensitive credentials in client-side code (per REQ-INQ-019 and REQ-SEC-005).
* Turnstile verification must be enforced server-side where applicable; client-only checks are not sufficient. Exact verification flow belongs in `SECURITY.md` and `ARCHITECTURE.md`.
* Supabase authorization and data-access rules require proper implementation (row-level/authorization behavior per REQ-SEC-002). Exact rules belong in `SECURITY.md` and `DATA-MODEL.md`.
* No actual credentials, keys, IDs, or environment values appear in this document.

## 21. Technologies Not Selected

The following are intentionally **Not Selected** for the current scope. Each is excluded because the current requirements do not justify its additional complexity, or because a selected technology already fulfills the need.

| Technology | Why not selected |
| --- | --- |
| Next.js | Astro is selected as the primary framework because this is a content-heavy marketing site prioritizing SEO-friendly HTML and minimal JavaScript. A React-first SSR framework adds complexity without a confirmed requirement. |
| Express | Astro Server Endpoints cover the limited backend needs. A separate Node server adds hosting and maintenance cost with no confirmed requirement. |
| NestJS | Same as Express, with greater abstraction overhead. Unjustified for an inquiry form plus CMS-backed content within a ₱15,000 scope. |
| Tailwind CSS | Styled Components is the preferred styling solution. A second styling system adds inconsistency and migration cost with no confirmed requirement. |
| Resend | EmailJS is the selected email direction. Adding a second provider adds configuration and scope without a confirmed requirement. |
| Nodemailer / custom SMTP infrastructure | Operating mail infrastructure contradicts the low-maintenance EmailJS direction and adds security/operational burden with no confirmed requirement. |
| Complex booking / reservation platforms | The confirmed model is an inquiry/request workflow (REQ-INQ-001/002, REQ-OOS-001/004). Real-time availability, payments, checkout, and reservation allocation are explicitly out of scope. |
| General-purpose enterprise CMS / CRM | The confirmed CMS is a scoped custom admin panel for website content (REQ-CMS-013). Enterprise CMS/CRM scope contradicts the fixed-price constraint and agreed deliverables. |

This list covers the important exclusions for this project. It is not a comparison of every available technology.

## 22. Technical Constraints

1. Fixed project price of **₱15,000**: prioritize agreed deliverables; avoid scope creep, over-engineering, and unnecessary dependencies, services, infrastructure, and abstractions.
2. Inquiry system remains an inquiry/request workflow. Do not add real-time availability, payments, checkout, reservation allocation, CRM, or marketing-automation behavior without an explicitly rescoped requirement.
3. CMS remains scoped to confirmed website content. Do not expand into enterprise CMS or CRM behavior.
4. No package versions are pinned in this document; versions (if any) come from the repository when dependencies are installed.
5. No implementation details are invented here: no schemas, API contracts, component implementations, IDs, URLs, or credentials.
6. No ranking, performance, or security guarantees are made beyond what `docs/REQUIREMENTS.md` states. SEO scope is a technical/local foundation, not promised rankings or ongoing campaigns.

## 23. Conditional / Future Technology Decisions

These decisions are recorded so future changes stay explicit. None authorizes scope expansion on its own.

1. **Inquiry-record storage (Supabase):** only if the CMS is confirmed to require booking records. Default remains EmailJS → Gmail without database persistence of inquiries.
2. **Google Analytics 4:** only if confirmed and appropriate (Could). Privacy Policy implications must be handled if adopted.
3. **FAQ structured data:** only where technically and semantically valid for confirmed published content (REQ-FAQ-005).
4. **Separate backend framework (Express/NestJS/other):** only if a future confirmed requirement genuinely cannot be met by Astro Server Endpoints.
5. **Alternative styling system:** only with a justified decision recorded in `docs/DECISIONS.md`.
6. **Alternative email provider or SMTP infrastructure:** only if a confirmed requirement forces a change from EmailJS.
7. **Additional pages or SEO landing pages:** event types stay within relevant sections unless explicitly required (REQ-NAV-007, REQ-SEO-021).
8. Any decision above that affects architecture, technology choice, or conventions must be recorded in `docs/DECISIONS.md` when made.

## 24. Related Documentation

* `docs/PROJECT.md` — product and business context.
* `docs/REQUIREMENTS.md` — functional and business requirements.
* `docs/ARCHITECTURE.md` — application architecture and code organization (to be created; not part of this task).
* `docs/UI-UX.md` — UX requirements.
* `docs/DESIGN-SYSTEM.md` — visual and component design rules.
* `docs/DATA-MODEL.md` — database structure and relationships.
* `docs/API.md` — API and external service contracts.
* `docs/SECURITY.md` — security requirements and constraints.
* `docs/TESTING.md` — testing and verification strategy.
* `docs/DEVELOPMENT.md` — local development workflow and commands.
* `docs/DEPLOYMENT.md` — deployment and production procedures.
* `docs/DECISIONS.md` — important architectural and technical decisions.

## 25. Acceptance Criteria

This document is considered complete when:

1. The selected technology stack is clearly identified with purpose and rationale per technology.
2. Selected vs. conditional/recommended/not-selected vs. requires-confirmation decisions are explicit.
3. Astro as primary framework with React islands is clearly established.
4. Supabase (PostgreSQL, Auth, Storage) is clearly established as the backend data/CMS foundation.
5. EmailJS → client Gmail is clearly established as the current email direction, with the conditional Supabase-backed variant noted.
6. Vercel (hosting/deployment), Namecheap (registrar), and GitHub (source control) responsibilities are clearly separated.
7. SEO/Google items are correctly categorized (Astro integration, standard, external service, requires-confirmation link).
8. GA4 is presented as conditional, not mandatory.
9. Next.js, Express, NestJS, Tailwind CSS, Resend, Nodemailer/SMTP infrastructure, complex booking platforms, and enterprise CMS/CRM are documented as not selected.
10. No unnecessary technologies or dependencies were introduced.
11. The ₱15,000 constraint is respected throughout.
12. No credentials, IDs, secrets, or invented values were added.
