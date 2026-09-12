# Melbourne Photobooth Hire — Architecture

## 1. Architecture Overview

This document is the authoritative architecture reference for the Melbourne Photobooth Hire project. It answers:

> **How do the selected technologies and system components fit together, how does data flow through the system, and where are the boundaries between the public website, React islands, Astro server endpoints, Supabase, CMS, EmailJS, and external services?**

This is a greenfield project. This document describes the **intended architecture**, not existing implementation. Implementation status must be confirmed from the repository.

Source context:

* `docs/PROJECT.md` — product and business context (authoritative for business/product questions).
* `docs/REQUIREMENTS.md` — functional and business requirements (authoritative for what the system must do).
* `docs/TECH-STACK.md` — technology choices and technical constraints (authoritative for what technologies are selected).
* Root `AGENTS.md` — development rules and scope control.
* Root `README.md` — repository orientation.

Architectural philosophy:

* **Astro-first:** content-heavy marketing pages render as SEO-friendly HTML with minimal client-side JavaScript.
* **Islands only:** React is scoped to genuinely interactive UI, hydrated selectively.
* **Single backend:** Astro Server Endpoints are the only application backend. No separate server framework.
* **Supabase as data foundation:** PostgreSQL, Auth, and Storage back the custom CMS and CMS-managed content.
* **Simple inquiry flow:** an inquiry/request workflow delivering to the client's Gmail via EmailJS, not a reservation, payment, or CRM platform.
* **Scoped CMS:** a custom admin panel for confirmed website content only.
* **Proportional scope:** direct, understandable data flows appropriate to a fixed **₱15,000** project. No microservices, queues, enterprise CMS, or unnecessary abstractions.

Primary flows:

```text
Customer
   │
   ▼
Public Website
(Astro)
   │
   ├── Static/content pages
   │
   └── React Islands
         │
         └── Inquiry Form
                │
                ▼
         Validation (Zod)
                │
                ▼
        Astro Server Endpoint
                 │
                 ▼
     Cloudflare Turnstile
      (server verification)
                 │
                 ▼
              EmailJS
                 │
                 ▼
            Client Gmail
```

CMS-managed content:

```text
Admin User
   │
   ▼
CMS/Admin UI
   │
   ▼
Supabase Auth
   │
   ▼
Supabase
 ├── PostgreSQL
 └── Storage
```

Conditional inquiry persistence only (not default — see Section 10):

```text
Inquiry Form
     │
     ▼
Astro Server Endpoint
     │
     ├── Supabase PostgreSQL
     │
     └── EmailJS → Client Gmail
```

No database schemas, API contracts, component implementations, IDs, URLs, credentials, or environment values are defined in this document.

---

## 2. Architectural Goals

The architecture is designed to satisfy the requirements in `docs/REQUIREMENTS.md` while remaining simple and maintainable:

* **SEO:** crawlable, server-rendered HTML; unique metadata; canonical URLs; XML sitemap; robots.txt; Schema.org JSON-LD; semantic markup; internal linking; optimized images; mobile performance. Technical SEO foundation only — no ranking promises.
* **Performance:** minimal client-side JavaScript, selective hydration, optimized media, efficient rendering. No arbitrary numeric performance guarantees.
* **Maintainability:** small, focused codebase; TypeScript throughout; existing project patterns; reusable abstractions only where they provide clear value; no unnecessary dependencies or services.
* **Simplicity:** direct data flows; one frontend framework (Astro) plus islands; one backend mechanism (Astro Server Endpoints); one data platform (Supabase); one email direction (EmailJS → Gmail).
* **Accessibility:** semantic structure, keyboard-usable controls, labelled fields, text-associated errors, meaningful alt text, readable contrast, reduced-motion respect. No formal conformance certification is claimed.
* **Security:** authenticated admin access, authorization on CMS operations, validation at appropriate boundaries, server-side spam verification where applicable, secrets kept out of source. Detailed rules belong in `SECURITY.md`.
* **CMS usability:** clear content organization, safe editing, predictable save behavior, clear loading/saving/error states, validation with understandable messages.
* **Responsive UX:** fully usable public site and practical CMS across mobile, tablet, and desktop viewports.
* **Reliable inquiry submission:** validated input, spam protection, clear submission-in-progress handling, duplicate-submission prevention, clear success feedback, and clear non-technical error feedback with next-step guidance.

---

## 3. Architecture Principles

### 3.1 Astro-first

* Astro owns content-heavy marketing pages.
* Prefer static/server-rendered HTML.
* Content pages must remain readable, navigable, and crawlable without depending on client-side JavaScript.
* Avoid unnecessary client-side JavaScript on content-heavy pages.

### 3.2 React only where needed

* React is used through Astro islands.
* Use it for genuinely interactive UI only.
* Do not turn the entire website into a client-rendered React application.
* Do not hydrate static content.

### 3.3 Single backend approach

* Astro Server Endpoints are the backend/API layer.
* They cover the project's limited server-side needs (for example inquiry processing, validation, spam-verification handling, and controlled backend access).
* Do not add Express, NestJS, or another backend framework without a future justified requirement recorded in `DECISIONS.md`.

### 3.4 Supabase as the application data foundation

* PostgreSQL for structured application/CMS data.
* Auth for admin authentication.
* Storage for CMS-managed media.
* Detailed schemas, policies, and data relationships belong in `DATA-MODEL.md`. None are defined here.

### 3.5 Custom CMS remains scoped

* The CMS exists to allow the client to manage confirmed website content without editing source code.
* It is not a general-purpose CMS, CRM, booking platform, or marketing automation system.
* Exact CMS modules, editable areas, and fields require confirmation and belong in requirements confirmation, `DATA-MODEL.md`, and implementation. None are invented here.

### 3.6 Inquiry system remains simple

* The primary system is an inquiry/request workflow using the terminology **inquiry/request**, not a complex booking engine.
* Default flow: Customer → Inquiry Form → Validation → EmailJS → Client Gmail.
* It is not a real-time reservation engine.
* No payments, checkout, reservation allocation, availability management, calendar reservation, CRM, or marketing automation.

### 3.7 Security boundaries

* Public users must not gain admin capabilities.
* Supabase authorization must protect CMS data.
* Server-side verification must be used where required (in particular, spam-protection verification must not rely on client-side presence alone).
* Secrets must never be hardcoded, committed, or exposed in client-side source.
* Detailed security rules belong in `SECURITY.md`.

### 3.8 Avoid overengineering

* Prefer direct, understandable data flows.
* Avoid unnecessary abstraction layers, services, queues, microservices, repositories, or state-management systems.
* Do not introduce Redux, Zustand, or another state-management library unless a future requirement justifies it.
* Reuse selected technologies before introducing new ones.

---

## 4. System Context

### 4.1 Actors

* **Customer:** prospective photobooth customer. Browses public content, submits inquiries, follows the Google review CTA. Has no admin capabilities.
* **Admin/Client:** business client managing website content through the CMS. Requires authentication; actions are subject to authorization.

### 4.2 Application-owned components

* **Public Website:** Astro-rendered marketing site with selective React islands. Presents services, packages, gallery, FAQs, business information, inquiry access, and review CTA.
* **CMS/Admin:** custom admin panel backed by Supabase. Allows authorized content and media management for confirmed website content.
* **Astro Server Endpoints:** server-side boundary for inquiry processing, validation, spam-verification handling, and controlled backend functionality.

### 4.3 Data platform

* **Supabase:** managed platform providing PostgreSQL, Auth, and Storage. Backs CMS content, admin authentication, and CMS-managed media. Inquiry-record storage in Supabase is **conditional only** (see Section 10).

### 4.4 External services (not application-owned)

* **EmailJS:** selected email delivery service. Delivers validated inquiries to the client's Gmail.
* **Client Gmail:** destination mailbox for inquiry emails. Business follow-up happens here, outside the application.
* **Cloudflare Turnstile:** selected spam-protection direction for the inquiry form. Client-side presence must be paired with server-side verification where applicable.
* **Vercel:** hosting and deployment platform. Serves production traffic over HTTPS and supports production environment configuration.
* **Namecheap:** domain registrar. Responsibility is registration; DNS/hosting wiring is a deployment concern.
* **GitHub:** source-control platform. Repository hosting and version history.
* **Google Search Console:** external Google service for indexing and search-monitoring readiness.
* **Google Business Profile:** external Google service for local presence. Profile content is managed in Google, not in this repository.
* **Google Business Profile review link:** client-supplied external URL for the review CTA. Requires client confirmation; no placeholder or guessed URL may be published.
* **Google Analytics 4 (optional/conditional):** external analytics service. Only if confirmed and appropriate; not mandatory.

External services are integration boundaries, not application layers. No credentials, IDs, URLs, or configuration values are documented here.

---

## 5. High-Level Architecture

| Layer | Responsibility | Key technology |
| --- | --- | --- |
| Public presentation | SEO-friendly marketing pages, navigation, content display, inquiry entry points, review CTA | Astro, Styled Components |
| Interactive islands | Stateful client-side behavior only where genuinely needed | React, React Hook Form, Zod, Lucide React, Motion |
| Server boundary | Validation, spam-verification handling, email bridging, controlled backend access | Astro Server Endpoints |
| Data and CMS foundation | Structured CMS content, admin authentication, media storage | Supabase PostgreSQL, Auth, Storage |
| Admin application | Authenticated content and media management for confirmed website content | Custom CMS on Supabase |
| Email delivery | Inquiry email delivery to business mailbox | EmailJS → Client Gmail |
| Spam protection | Submission protection against spam and abuse | Cloudflare Turnstile |
| Hosting and delivery | Production serving, HTTPS, environment configuration | Vercel |
| Search and local presence | Sitemap generation, structured data, indexing readiness, local presence, review link | `@astrojs/sitemap`, JSON-LD, Search Console, Business Profile |

Boundaries:

* Customers interact only with the public website. They never interact directly with Supabase CMS data, admin routes, or secrets.
* The CMS is separated from the public site. Unauthenticated users must not reach CMS functionality.
* Astro Server Endpoints are the only server-side application boundary. No second backend exists.
* Detailed endpoint contracts belong in `API.md`. No endpoint URLs, methods, payloads, or response schemas are defined here.

---

## 6. Frontend Architecture

### 6.1 Astro responsibility

Astro is the primary framework and owns:

* Page routing and rendering for content-heavy marketing pages.
* SEO-critical output: titles, meta descriptions, canonical URLs, semantic markup, heading hierarchy, internal links, sitemap and robots support, JSON-LD placement.
* Layouts, navigation, footer, and shared presentational structure.
* Data retrieval for CMS-managed content at render time (see Section 7).
* Hosting React islands only where interactivity is genuinely required.

Representative Astro pages (per `docs/PROJECT.md` and `docs/REQUIREMENTS.md`):

* Home
* Services
* Packages
* Gallery
* About
* FAQ
* Contact (inquiry access)
* Privacy Policy
* Terms & Conditions
* 404

This list describes intended information architecture, not a commitment that every page carries interactive behavior.

### 6.2 React island responsibility

React islands own:

* Local interactive state (for example form field state, menu open/close, lightbox position).
* Submission handling (progress state, duplicate-submission prevention, success/error display).
* Client-side validation feedback integrated with shared validation logic where applicable.

Representative React islands (subject to final implementation):

* Inquiry form
* Mobile navigation
* Gallery/lightbox interaction (if confirmed in implementation)
* Other genuinely interactive components only

Do not assume every listed page must have React. Most pages should be pure Astro output with zero client-side JavaScript.

### 6.3 Page/component boundaries

* **Pages (Astro):** route-level composition, metadata, content retrieval, layout, SEO output.
* **Presentational components (Astro preferred):** headers, sections, cards, FAQ markup, gallery grids, CTAs, footer.
* **Interactive components (React islands):** inquiry form, mobile menu, lightbox/dialog behavior, and similar stateful UI.
* **Styling:** Styled Components across Astro and React UI. No second styling system.
* **Icons:** Lucide React for standard UI icons.
* **Motion:** Motion for transitions where genuinely needed, respecting reduced-motion preferences.

### 6.4 Static vs interactive content

* Static/content output (prose, service descriptions, package displays, FAQ answers, business information, legal pages) renders as plain HTML. It must not require hydration.
* Interactive behavior hydrates only the island that needs it. Hydrating a whole page to support one widget is an architectural violation.
* Content-heavy pages must minimize JavaScript per REQ-PER-004 and avoid unnecessary dependencies per REQ-PER-005.

---

## 7. Content and Rendering Strategy

CMS-managed content must ultimately be rendered into SEO-friendly HTML so search engines and users receive the same crawlable content.

Principle:

```text
Supabase CMS Data
       ↓
Astro data retrieval
       ↓
Astro rendering
       ↓
HTML delivered to search engines/users
```

Rules:

* Astro retrieves confirmed CMS content server-side (at build or request time per the implemented rendering approach) and renders it into semantic HTML.
* Crawlable content (services, packages, FAQs, business information) must be present in delivered HTML, not assembled client-side after load.
* Interactive behavior hydrates only where necessary (for example the inquiry island), without re-rendering static content on the client.
* Empty or missing CMS content must produce a sensible fallback or empty state, never a broken layout (see Section 21).
* No CMS schema is invented here. Content models, fields, and publishing workflow belong in `DATA-MODEL.md` and implementation once confirmed.

---

## 8. React Island Architecture

### 8.1 When React is justified

React is justified when the UI requires client-side state, immediate feedback, or browser interaction that static HTML cannot provide:

* Multi-field form handling with live validation feedback and submission lifecycle.
* Menu/dialog/lightbox open/close and focus behavior.
* Other confirmed stateful interactions.

React is not justified for static prose, content display, navigation links, or SEO-critical markup.

### 8.2 Island boundaries

* Each island is independently hydrated and owns only its own DOM subtree and behavior.
* Islands must not depend on each other's internal state.
* Shared page-level concerns (metadata, routing, content) stay in Astro.
* Form validation logic should use explicit schemas (Zod per `docs/TECH-STACK.md`) so rules can be shared across client and server boundaries as needed. Detailed rules belong in implementation and `API.md`/`SECURITY.md`.

### 8.3 State ownership

* State lives as close to the island as possible (local component/form state).
* Form state uses React Hook Form per the selected stack; it handles field state, validation integration, submission-in-progress handling, and duplicate-submission prevention.
* Avoid global client-side state unless genuinely necessary. No global store is part of this architecture.

### 8.4 What is excluded

* Do not introduce Redux, Zustand, or another state-management library unless a future requirement justifies it and the decision is recorded in `DECISIONS.md`.
* Do not hydrate static content.
* Do not build ad hoc animation or icon infrastructure when Motion and Lucide React already cover the need.

---

## 9. Inquiry / Booking Architecture

Terminology: **inquiry/request**. This is not a booking engine, reservation system, checkout, or CRM.

### 9.1 Default flow

```text
Customer
  ↓
Inquiry Form
  ↓
Client-side validation
  ↓
Server-side validation
  ↓
Spam protection / Turnstile verification
  ↓
EmailJS
  ↓
Client Gmail
```

Step responsibilities:

1. **Inquiry Form (React island):** collects confirmed fields; provides labels, instructions, validation errors near the relevant field, submission-in-progress state, and duplicate-submission prevention. Usable on mobile and keyboard-accessible.
2. **Client-side validation:** immediate feedback using shared validation schemas (Zod). Prevents submission while invalid input remains. This is a usability layer, not a security boundary.
3. **Astro Server Endpoint:** authoritative boundary. Re-validates input server-side, verifies spam-protection evidence where applicable, and triggers email delivery. Must not expose secrets in client-side source.
4. **Spam protection (Cloudflare Turnstile):** submission protection against spam and abuse. Client-side presence alone is not sufficient; server-side verification is required where applicable.
5. **EmailJS:** delivers the validated inquiry to the client's Gmail.
6. **Client Gmail:** business receives the inquiry with sufficient detail to follow up. Final booking is handled through the business's normal process, outside the website.

### 9.2 Success and failure handling

* **Success:** the customer receives clear success feedback; the client receives the inquiry by email. Email delivery to Gmail must have occurred when the form reports success.
* **Validation failure:** the customer sees which fields need correction and how to correct them, without technical jargon.
* **Spam-verification failure:** the submission is rejected with a clear, non-technical message and next-step guidance.
* **Email failure:** the customer receives a clear, non-technical error with guidance on what to do next. Technical details are not exposed.
* **Network failure:** clear, non-technical feedback without data-loss surprises where practical.

Do not invent exact email templates or form fields here. Final required-versus-optional fields, option lists, and email content require confirmation and belong in requirements confirmation, `API.md`, and implementation.

---

## 10. Conditional Inquiry Persistence

The default architecture does **not** persist inquiries to the database. Persistence is **conditional** and must only be implemented if explicitly confirmed as a CMS requirement.

Conditional shape (if confirmed):

```text
Inquiry
  ↓
Astro Server Endpoint
  ├── EmailJS → Gmail
  └── Supabase → CMS record
```

Rules:

* The EmailJS → Gmail branch is the default and required path. It exists with or without persistence.
* The Supabase branch exists only if booking/inquiry record storage is actually required by the confirmed CMS scope.
* Email delivery must not silently depend on database persistence succeeding, and vice versa, unless a confirmed requirement defines the combined behavior. Failure behavior for the combined flow belongs in `API.md` and `SECURITY.md` when the condition is confirmed.
* No database schema is designed here. Tables, fields, retention, and access rules belong in `DATA-MODEL.md` and `SECURITY.md` if the condition is confirmed.

---

## 11. CMS / Admin Architecture

Intended structure:

```text
Admin User
    ↓
Authentication
    ↓
Admin Application
    ↓
CMS Content Operations
    ↓
Supabase
 ├── PostgreSQL
 └── Storage
```

Responsibilities:

* **Authentication:** admin access requires secure authentication via Supabase Auth. Unauthenticated users must not access CMS functionality.
* **Authorization:** authenticated actions respect authorization rules so only permitted users can view or modify content. Exact rules belong in `SECURITY.md`.
* **Content CRUD where applicable:** create, edit, update, and delete behavior for confirmed content areas. Exact areas and fields require confirmation.
* **Validation:** admin input is validated with clear error messages; invalid content is rejected.
* **Media management:** predictable upload, replacement, and removal behavior for confirmed media needs (for example gallery images), backed by Supabase Storage.
* **Save/error states:** clear confirmation when content is saved; clear error when saving fails; loading feedback for fetching and saving; network/API failure feedback; guards against accidental data loss where practical (for example confirmation for destructive actions).
* **Separation from the public site:** admin routes and operations are separated from public routes. Admin routes are excluded from indexing. Public rendering consumes only published, confirmed content.

Do not invent exact CMS modules, tables, fields, or roles here. Those belong in requirements confirmation, `DATA-MODEL.md`, and implementation.

---

## 12. Authentication and Authorization

Architectural boundary:

* **Public visitors:** anonymous. Can read public content and submit inquiries. Have no read or write access to CMS data beyond what is intentionally published as public HTML.
* **Authenticated admin users:** identified via Supabase Auth. Can access the admin application and perform CMS operations subject to authorization.
* **Supabase Auth:** authentication foundation for CMS/admin access. No custom identity system is part of this architecture.
* **Protected CMS operations:** every content read/write and media operation in the CMS is subject to server-side authorization. Client-side route hiding alone is not a security boundary.

Do not invent role hierarchies unless required. No roles are defined here.

Detailed policies — including session handling, authorization rules, data-access control, and admin route protection — belong in `SECURITY.md`.

---

## 13. Supabase Architecture

Supabase is the application data foundation. Its three responsibilities are architecturally distinct:

* **PostgreSQL:** structured application/CMS data foundation. Backs confirmed CMS content and, only if confirmed, inquiry records. Schemas, fields, relationships, and constraints belong in `DATA-MODEL.md`. None are defined here.
* **Auth:** admin authentication foundation. Gates access to the CMS/admin application. Session and authorization detail belongs in `SECURITY.md`.
* **Storage:** CMS-managed media foundation (for example gallery images where required by the confirmed implementation). Buckets, access models, and policies are not invented here; see Sections 17 and 25.

Rules:

* The public website reads only intentionally published content; it never bypasses authorization to reach raw CMS data.
* All CMS writes go through authenticated, authorized operations with validation.
* Supabase access control (including row-level/authorization behavior) must be properly implemented per REQ-SEC-002. Exact rules belong in `SECURITY.md` and `DATA-MODEL.md`.

---

## 14. API / Server Endpoint Architecture

Astro Server Endpoints act as the server-side boundary between the browser and backend functionality.

Possible responsibilities include:

* Inquiry processing (authoritative validation, spam-verification handling, email bridging, and — only if confirmed — conditional persistence).
* Validation at the server boundary, independent of client-side checks.
* Turnstile verification handling where applicable.
* Server-side integrations that must not expose secrets to the browser.
* Controlled access to backend functionality required by confirmed features.

Rules:

* Client-side validation is a usability layer; server-side validation is the enforcement layer.
* Secrets and private keys stay server-side (environment configuration) and never appear in client-side source or the repository.
* Failure responses distinguish user-facing messages (clear, non-technical) from server-side diagnostics (logged, not exposed).

Do not invent endpoint URLs, HTTP methods, payloads, or response schemas here. Those belong in `API.md`.

---

## 15. Email Architecture

```text
Validated Inquiry
      ↓
EmailJS
      ↓
Client Gmail
```

Rules:

* EmailJS is the selected email delivery direction for validated inquiry submissions.
* The client's Gmail is the destination mailbox where the business follows up.
* Email delivery must function in production with production configuration.
* The customer-facing success signal and the business-facing email delivery must stay consistent: success feedback implies the inquiry was accepted for delivery; delivery failure produces a clear error, not a false success.
* No email addresses, service identifiers, keys, templates, or configuration values are documented here.

Do not add Resend, Nodemailer, custom SMTP, or mail-server infrastructure unless a future confirmed requirement changes the technology decision and the change is recorded in `DECISIONS.md`.

---

## 16. Spam Protection Architecture

Cloudflare Turnstile is the selected spam-protection direction for the inquiry form.

Placement in the inquiry flow:

```text
Inquiry Form (Turnstile challenge present)
      ↓
Astro Server Endpoint (Turnstile verification)
      ↓
Accepted → EmailJS → Gmail / Rejected → user-facing error
```

Rules:

* Client-side presence alone is not a sufficient security boundary.
* Server-side verification is required where applicable before the submission is treated as legitimate.
* Verification secrets stay server-side and are never exposed in client-side source.
* Spam-verification failure produces a clear, non-technical message with next-step guidance, without exposing verification internals.

Detailed implementation, verification flow, key handling, and failure behavior belong in `SECURITY.md`.

---

## 17. Media Architecture

Supabase Storage is the intended foundation for CMS-managed media (for example gallery images where required by the confirmed implementation).

High-level lifecycle:

```text
Admin upload → Supabase Storage → Controlled retrieval → Astro rendering → Optimized delivery to users
```

Considerations (architectural, not implementation):

* **Upload:** through authenticated, authorized CMS operations with validation. Predictable replacement and removal behavior.
* **Storage:** Supabase Storage as the system of record for CMS-managed media. No custom file-server infrastructure.
* **Retrieval:** controlled access honoring the confirmed public/private access model. Public gallery imagery must be retrievable for rendering; non-public content must not be exposed.
* **Public/private access:** the exact access model requires confirmation and belongs in `SECURITY.md` and `DATA-MODEL.md`. It is not decided here.
* **Image optimization responsibility:** images must be optimized for web delivery with accurate alt text (REQ-GAL-003, REQ-GAL-004, REQ-SEO-013). Formats, sizing, compression, and loading behavior are implementation concerns shared between the CMS/admin side (upload-time handling) and the public-site side (render-time responsive images and lazy loading where appropriate). No bucket names, policies, filenames, or database relationships are invented here.

---

## 18. SEO Architecture

The architecture supports technical and local SEO through server-rendered output and explicit SEO integration points. Ongoing SEO marketing is separate and out of scope unless explicitly requested.

| Concern | Architectural support |
| --- | --- |
| Crawlable HTML | Astro renders full page content server-side; content is present in delivered HTML |
| Semantic markup | Astro layouts and components use semantic elements; correct H1/H2 hierarchy with one H1 per page |
| Metadata | Unique title and meta description per public page; Open Graph/social metadata where appropriate |
| Canonical URLs | Canonical URL exposed on public pages |
| XML sitemap | Generated via `@astrojs/sitemap` |
| robots.txt | Permits crawling of public content; excludes non-public areas (for example admin routes) where appropriate |
| JSON-LD | Schema.org structured data where technically and semantically valid for the page content; FAQ structured data only for confirmed published Q&A |
| Internal linking | Navigation, CTAs, and content links connect related pages (services ↔ packages ↔ inquiry; homepage ↔ gallery/FAQ) |
| Optimized images | Responsive, compressed imagery with accurate alt text |
| Mobile performance | Responsive layouts; minimal JavaScript; optimized media |
| Core Web Vitals | Considered through rendering, JavaScript minimization, and media strategy; no numeric guarantees made |
| Search monitoring | Readiness for Google Search Console verification and monitoring |
| Local presence | Genuine Melbourne service-area context from confirmed business information; Google Business Profile linkage where confirmed; review CTA via confirmed review link |

Constraints:

* No keyword stuffing; no unnecessary SEO landing pages (event types stay within relevant sections unless explicitly required).
* Structured data must only describe real published content. No invented questions, answers, ratings, or business claims.
* No specific Google ranking is promised or guaranteed.

---

## 19. External Services and Integrations

Architectural boundaries for each external integration. No credentials, IDs, or configuration values are included.

* **Vercel:** hosting and deployment platform. Serves production traffic over HTTPS, supports preview/production environments and production environment configuration. Deployment procedures belong in `DEPLOYMENT.md`.
* **Namecheap:** domain registrar. Responsible for domain registration only; DNS/hosting wiring is a deployment concern.
* **GitHub:** source control. Repository hosting and version history; deployment integration detail (if any) belongs in `DEPLOYMENT.md`.
* **EmailJS:** email delivery service for validated inquiries. Boundary is the Astro Server Endpoint, which invokes delivery without exposing sensitive configuration to the browser.
* **Cloudflare Turnstile:** spam-protection service. Boundary spans the inquiry island (challenge) and the server endpoint (verification). Secrets stay server-side.
* **Google Search Console:** indexing and search-monitoring service. The website must be ready for verification and monitoring; no tracking or verification values are defined here.
* **Google Business Profile:** local presence service. Profile content lives in Google; the website links to the profile where appropriate once confirmed.
* **Google Business Profile review link:** client-supplied external URL. The website links to it via a clear review CTA; no custom review system or review database exists. The actual URL requires client confirmation.
* **Google Analytics 4 (optional/conditional):** analytics service. Only if confirmed and appropriate. Privacy Policy implications must be handled if adopted. No measurement IDs are defined here.

---

## 20. Environment and Configuration Boundaries

* Environment-specific configuration and secrets must remain outside source code.
* Sensitive configuration (including email, spam-protection, Supabase, and deployment settings) must use environment-appropriate configuration without committing secrets to source control.
* Client-side source must never contain secrets, private keys, or credentials.
* No actual environment variable names are listed here unless they are already defined in the repository. None are defined in this document.
* Production configuration (email delivery, CMS access, integrated services) must be set correctly in the hosting environment. Procedures belong in `DEPLOYMENT.md`.

---

## 21. Error, Loading, and Failure Architecture

High-level behavior (architectural; UI copy belongs in implementation and `UI-UX.md`):

* **Page/content loading:** public pages render efficiently; where content loads asynchronously, appropriate loading feedback is shown without layout breakage.
* **CMS loading:** content fetching shows loading feedback; failures show clear errors with retry/next-step guidance.
* **CMS saving:** predictable save behavior — clear confirmation on success, clear error on failure indicating content was not saved and what to do next; guards against accidental data loss where practical.
* **Inquiry submission:** submission-in-progress state with duplicate-submission prevention; clear success feedback on acceptance; clear non-technical error with guidance on email, verification, or network failure.
* **Validation errors:** communicated in text near the relevant field (not by color alone), with a summary where appropriate; submission blocked until corrected.
* **Spam verification failure:** submission rejected with a clear, non-technical message and next steps; internals not exposed.
* **Email failure:** user-facing error with next-step guidance; no false success; technical details not exposed.
* **Database failure:** where Supabase-backed functionality is affected (CMS operations and, only if confirmed, inquiry persistence), clear user/admin-facing errors without exposing internals.
* **Network failure:** network or API failures affecting user-visible functionality produce clear, non-technical feedback.
* **Empty CMS content:** empty gallery shows a clear empty state; other empty content areas show a sensible fallback or are handled per confirmed content rules — never broken layouts.
* **Missing media:** absent images do not break layout; alt-text and fallback behavior follow accessibility and content rules.
* **404:** unknown routes render a user-friendly 404 page with navigation back to valid content.

---

## 22. Security Boundaries

High-level security architecture only. Detailed rules belong in `SECURITY.md`.

* **Authentication:** admin access requires secure authentication via Supabase Auth. Credentials are never hardcoded, committed, or exposed.
* **Authorization:** authenticated admin actions respect authorization rules; unauthorized CMS access and content modification are prevented. Supabase access control must protect CMS data.
* **Server-side validation:** all user input (inquiry form and CMS inputs) is validated at appropriate boundaries. Client-side validation is usability only.
* **Turnstile verification:** enforced server-side where applicable; client-only checks are not sufficient.
* **Supabase access control:** data-access rules ensure public visitors reach only intentionally published content while CMS data stays protected.
* **Secret management:** secrets and sensitive configuration live outside source code in environment-appropriate configuration; nothing sensitive appears in client-side source or the repository.
* **Public/private data boundaries:** public HTML contains only confirmed, publishable business content. Inquiry data is handled securely in transit and at rest to the extent governed by the implemented services. No data-retention periods or legal policies are invented here.
* **Sensitive data exposure:** user-facing errors are clear and non-technical; server diagnostics and verification internals are never exposed to end users.

---

## 23. Performance and Scalability

* **Astro-first rendering:** server-rendered/static HTML by default; content is crawlable and fast without client-side assembly.
* **Minimal JavaScript:** content-heavy pages ship little or no JavaScript; interactivity is limited to hydrated islands.
* **Selective hydration:** only genuinely interactive components hydrate; static content never pays hydration cost.
* **Optimized media:** appropriate formats, sizing, compression, responsive images, and lazy loading for below-the-fold/non-critical images where it helps without harming UX or SEO.
* **Caching/CDN capabilities where appropriate:** leverage hosting-platform delivery behavior for static assets and pages per the implemented rendering approach. No custom CDN infrastructure is part of this architecture.
* **Avoiding unnecessary client state:** local island state only; no global store, no unnecessary dependencies that increase page weight.
* **Keeping infrastructure simple:** one hosting platform, one data platform, one backend mechanism, one email direction. No separate servers, queues, or microservices.

No arbitrary numeric performance guarantees are made.

Scalability means reasonable future growth of this website — more pages, gallery items, and FAQs within the current architecture — not enterprise-scale architecture.

---

## 24. Architectural Boundaries / Non-Goals

The architecture explicitly does **not** include:

* Real-time booking availability
* Complex reservation engine or automated reservation allocation
* Payments
* Checkout
* CRM
* Marketing automation
* Custom review platform or custom review database
* Microservices
* Separate backend framework (no Express, NestJS, or equivalent)
* Unnecessary state-management infrastructure (no Redux, Zustand, or equivalent)
* Queues or background-job infrastructure
* Enterprise CMS architecture
* Second styling system (no Tailwind CSS or equivalent without a justified decision)
* Alternative email infrastructure (no Resend, Nodemailer, or custom SMTP without a justified decision)
* React-first client-rendered application shell
* Large-scale SEO landing-page production
* Guaranteed SEO rankings or ongoing SEO/marketing campaigns

Any of the above requires an explicitly rescoped requirement and a decision recorded in `DECISIONS.md`.

---

## 25. Future / Conditional Decisions

The following architecture decisions depend on confirmation. None authorizes scope expansion on its own. Future changes must be justified and recorded in `DECISIONS.md`.

* **Inquiry persistence:** Supabase storage of inquiry records exists only if the CMS is confirmed to require booking/inquiry records. Default remains EmailJS → Gmail without database persistence.
* **Google Analytics 4:** only if confirmed and appropriate. Privacy Policy implications must be handled if adopted.
* **Exact CMS modules/fields:** exact editable content areas, modules, and fields require confirmation. Content models belong in `DATA-MODEL.md` once confirmed.
* **Exact media access model:** public/private access for Supabase Storage requires confirmation and belongs in `SECURITY.md` and `DATA-MODEL.md`.
* **FAQ structured data:** only where technically and semantically valid for confirmed published content.
* **Additional integrations:** any third-party integration beyond the selected stack requires a confirmed requirement and justification.
* **Future backend changes:** a separate backend framework only if a confirmed requirement genuinely cannot be met by Astro Server Endpoints.
* **Additional pages or SEO landing pages:** event types stay within relevant sections unless explicitly required.

---

## 26. Related Documentation

* `AGENTS.md` — AI-agent development rules.
* `README.md` — repository orientation.
* `docs/PROJECT.md` — product and business context.
* `docs/REQUIREMENTS.md` — functional and business requirements.
* `docs/TECH-STACK.md` — technology choices and technical constraints.
* `docs/UI-UX.md` — UX requirements.
* `docs/DESIGN-SYSTEM.md` — visual and component design rules.
* `docs/DATA-MODEL.md` — database structure and relationships.
* `docs/API.md` — API and external service contracts.
* `docs/SECURITY.md` — security requirements and constraints.
* `docs/TESTING.md` — testing and verification strategy.
* `docs/DEVELOPMENT.md` — local development workflow and commands.
* `docs/ROADMAP.md` — development roadmap and phase progression.
* `docs/DEPLOYMENT.md` — deployment and production procedures.
* `docs/DECISIONS.md` — important architectural and technical decisions.

---

## 27. Acceptance Criteria

This architecture document is considered complete when:

1. The overall system and architectural philosophy (Astro-first, islands-only React, single backend, Supabase data foundation, simple inquiry flow, scoped CMS) are clearly explained.
2. Architectural goals covering SEO, performance, maintainability, simplicity, accessibility, security, CMS usability, responsive UX, and reliable inquiry submission are documented.
3. All eight required principles (Astro-first; React only where needed; single backend; Supabase foundation; scoped CMS; simple inquiry system; security boundaries; avoiding overengineering) are documented.
4. Major actors (Customer, Admin/Client) and external systems (Public Website, CMS/Admin, Supabase, EmailJS, Client Gmail, Cloudflare Turnstile, Vercel, Search Console, Business Profile, optional GA4) are identified, with external services clearly separated from application-owned components.
5. Major application layers and their responsibilities are described.
6. Frontend architecture (Astro vs React island responsibilities, page/component boundaries, static vs interactive content, JavaScript minimization) is explained with representative page and island examples, without assuming every page needs React.
7. The CMS-to-HTML content and rendering principle (Supabase CMS Data → Astro retrieval → Astro rendering → HTML) is explained without inventing the CMS schema.
8. React island architecture (justification, boundaries, state ownership, no global state, no static hydration, no state-management library) is explained.
9. The default inquiry/request flow (form → client validation → server validation → Turnstile verification → EmailJS → Gmail) with success/failure handling is documented without inventing form fields or email templates.
10. Conditional inquiry persistence (Supabase branch) is clearly marked as conditional, not default, with schema design deferred.
11. CMS/admin architecture (authentication → admin application → content operations → Supabase) with auth, authorization, CRUD, validation, media, states, and public-site separation is explained without inventing modules, tables, fields, or roles.
12. The public/admin authentication and authorization boundary is explained with detail deferred to `SECURITY.md`.
13. Supabase responsibilities (PostgreSQL, Auth, Storage) are explained without defining schemas.
14. Astro Server Endpoints as the server-side boundary are explained without inventing endpoint URLs, methods, payloads, or response schemas.
15. EmailJS → Client Gmail is documented as the selected email direction with no alternative providers added.
16. Cloudflare Turnstile placement is documented with server-side verification required and detail deferred to `SECURITY.md`.
17. Supabase Storage media architecture (upload, storage, retrieval, access considerations, optimization responsibility) is explained without inventing buckets, policies, filenames, or relationships.
18. SEO architecture (crawlable HTML, semantics, metadata, canonicals, sitemap, robots.txt, JSON-LD, internal linking, images, mobile performance, Core Web Vitals) is explained with technical implementation distinguished from ongoing marketing and no rankings promised.
19. External service boundaries (Vercel, Namecheap, GitHub, EmailJS, Turnstile, Search Console, Business Profile, review link, optional GA4) are documented without credentials, IDs, or configuration values.
20. Environment and configuration boundaries (secrets outside source, no committed credentials) are explained without listing environment variable names not already defined in the repository.
21. Error, loading, and failure behavior (pages, CMS, inquiry, validation, verification, email, database, network, empty content, media, 404) is covered architecturally without writing UI copy.
22. High-level security boundaries are stated with detail deferred to `SECURITY.md`.
23. Performance and scalability guidance (rendering, minimal JS, hydration, media, caching/CDN, simple infrastructure, no numeric guarantees, website-scale growth) is documented.
24. Non-goals (reservation engine, payments, checkout, CRM, automation, review platform, microservices, separate backend, state-management infrastructure, enterprise CMS) are explicitly excluded.
25. Conditional/future decisions (persistence, GA4, CMS modules, media access, integrations, backend changes) are documented as requiring confirmation and `DECISIONS.md` entries.
26. Related documents are referenced with each document's ownership clearly indicated.
27. The document introduces no unsupported technical decisions: no invented schemas, endpoints, CMS modules/roles, environment variables, credentials, or unlisted technologies (including Next.js, Express, NestJS, Tailwind, Resend, Nodemailer, Redux, Zustand, queues, microservices).
