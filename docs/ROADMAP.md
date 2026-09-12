# Melbourne Photobooth Hire — Development Roadmap

## 1. Purpose and Scope

This document is the authoritative reference for **development phase order and progression** on the Melbourne Photobooth Hire project. It answers:

> **In what order is the project built, what does each phase produce, when is a phase done, and how do phases depend on each other?**

Scope of this document:

- The 7-phase development progression and its transition gates.
- The centralized mock-data-first approach and the mock → database → API/backend transition.
- Continuous verification within phases versus full-system testing in Phase 5.
- Phase dependencies, confirmation boundaries, and scope boundaries.

Out of scope for this document (owned elsewhere):

- How each development step is performed → `docs/DEVELOPMENT.md` + `AGENTS.md`.
- What the system must do → `docs/REQUIREMENTS.md`.
- Product/business context → `docs/PROJECT.md`.
- Technology choices → `docs/TECH-STACK.md`.
- Architecture and code organization → `docs/ARCHITECTURE.md`.
- Behavior and experience → `docs/UI-UX.md`.
- Visual language → `docs/DESIGN-SYSTEM.md`.
- Data concepts and boundaries → `docs/DATA-MODEL.md`.
- Endpoint behavior and integration boundaries → `docs/API.md`.
- Security requirements → `docs/SECURITY.md`.
- Verification strategy → `docs/TESTING.md`.
- Production deployment procedures → `docs/DEPLOYMENT.md`.
- Recorded decisions → `docs/DECISIONS.md`.

This document describes **development progression**, not detailed technical architecture. Where architecture is concerned, `docs/ARCHITECTURE.md` governs. Where required behavior is concerned, `docs/REQUIREMENTS.md` governs. Where security is concerned, `docs/SECURITY.md` governs.

### Status labels used in this document

- **Confirmed** — established by existing project documentation cited in the relevant section. May be relied on for planning.
- **Conditional** — exists only if a separately confirmed requirement activates it. Must not be implemented by default.
- **Confirmation Required** — depends on client/business confirmation. Must not be treated as a final field, module, workflow, value, or configuration.
- **Reference-Only** — originates from the previous Shot&Prints website/material. Historical context only; never current project data or a development requirement.
- **Implementation Decision Required** — tooling, command, convention, or infrastructure detail not established by any source document. Must not be invented here; must be confirmed from the repository or explicitly decided and recorded.

No statement in this document introduces a new Confirmed business fact, requirement, or technical decision beyond what the source documents already establish.

---

## 2. How to Read This Roadmap

Each phase (Sections 7–13) follows the same template:

- **Objective** — what the phase exists to achieve.
- **Main activities** — what is done during the phase, stated at progression level.
- **Expected output** — the usable, verifiable increment the phase produces.
- **Verification / exit criteria** — what must hold before progressing.

Rules that apply to every phase:

1. Each phase produces a **usable, verifiable increment**. A phase is not complete when code is written; it is complete when its exit criteria are evidenced per `docs/TESTING.md` and `docs/DEVELOPMENT.md` (Sections 19–20).
2. Exit criteria are checked with evidence, not claims. Anything not verified is reported as not verified with the reason.
3. A later phase never silently redefines an earlier phase's output. If an earlier increment must change, the change follows the development workflow in `docs/DEVELOPMENT.md` with risk-based regression per `docs/TESTING.md` (Section 17).
4. No phase invents business content, contracts, schemas, or configuration. Items marked **Confirmation Required** stay confirmation-required through every phase (see Section 16).

---

## 3. Working Method: Incremental, Agile-Inspired

**Confirmed.** Development proceeds in small increments, each producing a reviewable, verifiable result. This roadmap is incremental and Agile-inspired in the following limited sense:

- Work is divided into phases with clear outputs and exit gates (Sections 7–13).
- Each increment is inspected, verified, and reported before the next begins, following `docs/DEVELOPMENT.md` (Sections 7–9, 19–20).
- Feedback within or between phases may require revisiting an earlier phase. Re-entry is expected and follows the same verify-and-regress discipline; it is not treated as failure.
- Scope stays controlled per `AGENTS.md` and `docs/DEVELOPMENT.md` (Section 11): one focused change at a time, no unrelated refactoring bundled with feature work.
- Increment sizing and roadmap decisions respect the fixed **₱15,000** project scope: favor the smallest verifiable increment that meets the phase's exit criteria, and avoid over-engineering, unnecessary dependencies, and scope creep.

This project is **not** formal Scrum. This roadmap does not establish sprints, ceremonies, velocity tracking, or Scrum roles, and none of those terms carry any meaning in this project. Do not introduce them.

The roadmap is intentionally **not rigid waterfall**: phases have a required order and gates, but an increment may be revisited, and explicitly permitted overlaps are stated in Section 14. Future features follow the same pattern — a new increment passes through the relevant phases (typically Phases 2–5) rather than requiring a new process.

---

## 4. Mock-Data-First Principle

**Confirmed** as the project's development approach. The frontend is substantially polished before real database/backend wiring replaces mock data.

- A **centralized** mock-data layer supplies representative content shapes for confirmed content areas (services, packages, gallery, FAQs, general website content, contact/business information — candidate areas per REQ-CON-002, exact modules/fields **Confirmation Required**).
- Centralized means one shared source consumed by pages and components, not ad hoc fixtures scattered per page. This keeps the later swap to real data to the data-retrieval boundary rather than a per-page rewrite.
- Mock data supports UI polish: layout, responsive behavior, navigation, calls to action, loading/empty/error/success states, accessibility baselines, and SEO shells (titles, descriptions, headings, canonicals, sitemap/robots behavior, structured-data placement for confirmed content only).
- Mock data is **scaffolding, never business fact**. It must not contain Shot&Prints pricing, inclusions, policies, descriptions, or any invented business claims presented as real (see Section 16). Placeholder values are clearly recognizable as placeholders and never published as production content.
- The concrete mock mechanism (module shape, file organization, tooling) is **Implementation Decision Required** — no source document establishes it, so this roadmap does not prescribe a file location or format. The decision is recorded in `docs/DECISIONS.md` when made, per `docs/DEVELOPMENT.md` (Section 24).

---

## 5. The Core Transition

The project's data progression is:

```text
Frontend → Centralized Mock Data → Database/CMS → API/Backend → Real Data
```

What each transition means:

1. **Frontend → Centralized Mock Data (Phase 2).** Pages and islands render against the centralized mock layer. The UI contract — what each surface needs to display and what states it handles — is established and polished here.
2. **Centralized Mock Data → Database/CMS (Phase 3).** Supabase-backed content and media replace mock sources for confirmed CMS areas. The retrieval boundary changes; polished presentation does not need redesigning.
3. **Database/CMS → API/Backend (Phase 4).** Astro Server Endpoints enforce validation, verify spam-protection evidence server-side, bridge email delivery, and authorize CMS operations. Client-side checks remain usability only.
4. **API/Backend → Real Data (Phases 4–5).** Client-confirmed content flows through the verified chain (CMS → retrieval → Astro rendering → HTML; inquiry → validation → verification → delivery). Unconfirmed areas keep their sensible fallbacks or empty states; they are never filled with invented content to make the flow look complete.

Transitions happen **per surface, incrementally** — one content area or flow at a time, each verified before the next — not as a single flag-day swap. At every point the site remains in a coherent, verifiable state: either on mocks with clearly marked placeholders, or on real confirmed data.

---

## 6. Continuous Verification Versus Phase 5

Both exist and serve different purposes. They must not be confused.

- **Continuous verification (every phase).** The `docs/DEVELOPMENT.md` inspect → implement → verify loop runs *inside* each roadmap phase. Each increment is checked at a level proportionate to its risk: relevant type/build checks where configured, manual verification of the changed behavior, failure-state checks for the feature, and security/responsive/accessibility/SEO implications where affected. Detail belongs in `docs/TESTING.md` (Sections 2, 4) and `docs/DEVELOPMENT.md` (Sections 19–20).
- **Phase 5 full-system integration testing and debugging.** A dedicated phase that exercises complete journeys across boundaries (form → endpoint → verification → delivery; CMS edit → retrieval → public render; auth → protected operation) plus regression over the assembled system. It verifies that individually verified increments work together; it does not replace in-phase verification.

Passing continuous verification in an early phase never exempts the assembled system from Phase 5. Passing Phase 5 never exempts a later change from risk-based regression.

---

## 7. Phase 1 — Project Setup

### Objective

Establish a reproducible project skeleton that later phases build on, without committing to unconfirmed business content or configuration.

### Main activities

- Scaffold the repository per `docs/TECH-STACK.md` (Astro primary, React islands only, TypeScript) and `docs/ARCHITECTURE.md` (Astro-first rendering, single backend mechanism, Supabase as data foundation).
- Establish baseline page shells and routing for the intended information architecture (Home, Services, Packages, Gallery, About, FAQ, Contact/inquiry, legal pages, 404) as structure only — no final copy.
- Establish environment/configuration handling per `docs/SECURITY.md` (Section 8): secrets outside source, separate values per environment, nothing sensitive committed.
- Record tooling decisions with project-wide effect in `docs/DECISIONS.md` per `docs/DEVELOPMENT.md` (Section 24).

### Expected output

A runnable skeleton: pages resolve, navigation structure exists, 404 handles unknown routes, production build succeeds, and the working tree contains only intended files with no secrets.

### Verification / exit criteria

- Production build succeeds using the repository's established commands (**Confirmed** expectation; concrete commands are **Implementation Decision Required**).
- No secrets, credentials, or sensitive configuration in source, history, or client bundles.
- Tooling decisions with project-wide effect are recorded; unconfirmed items remain explicitly marked.
- The skeleton introduces no business claims, invented content, or Shot&Prints branding.

---

## 8. Phase 2 — Frontend Development with Centralized Mock Data

### Objective

Deliver a substantially polished public website and CMS-facing UI contracts against centralized mock data, before any real database/backend wiring.

### Main activities

- Build public pages and presentational components per `docs/UI-UX.md` (page Sections 7–12, navigation, CTAs, states) and `docs/DESIGN-SYSTEM.md` (tokens, components, responsive rules), reusing established patterns.
- Build interactive islands only where genuinely needed (inquiry form behavior, mobile navigation, lightbox/dialog where confirmed) per `docs/ARCHITECTURE.md` (Section 8). Static content is never hydrated.
- Drive all content surfaces through the centralized mock layer (Section 4), including loading, empty, error, and success states.
- Implement client-side validation feedback (React Hook Form + Zod direction per `docs/TECH-STACK.md`) as a usability layer.

### Expected output

A polished, reviewable website running on mock data: complete layouts, responsive behavior, accessible interactions, SEO shells, and clearly marked placeholders where client-confirmed content is pending.

### Verification / exit criteria

- Principal pages render with correct branding, navigation (desktop + mobile exposing the same destinations), inquiry CTAs at decision points, and internal linking, per `docs/TESTING.md` (Section 5).
- Responsive (mobile/tablet/desktop), keyboard-operable with visible focus, labelled fields, text-associated errors, meaningful alt text, and reduced-motion respect, per `docs/TESTING.md` (Sections 9–10).
- SEO shells verified in delivered HTML: unique titles/descriptions, one H1 per page, canonicals, sitemap/robots behavior in the dev environment, valid JSON-LD placement for confirmed content only, no keyword stuffing or unnecessary landing pages, per `docs/TESTING.md` (Section 11).
- Empty states (gallery, unconfirmed packages, absent optional content) show sensible fallbacks, never broken layouts or invented facts.
- Client-side validation prevents invalid submission with field-associated feedback, but no claim is made about server enforcement yet — that belongs to Phase 4.

---

## 9. Phase 3 — Database / CMS Implementation

### Objective

Provide Supabase-backed content, authentication, and media foundations for confirmed CMS areas, ready for backend wiring in Phase 4.

### Main activities

- Model confirmed content areas only (candidate areas per REQ-CON-002; exact modules/fields **Confirmation Required**). No tables, fields, or policies are invented beyond what confirmation supports; concepts follow `docs/DATA-MODEL.md`.
- Implement admin authentication on Supabase Auth and server-side authorization for CMS operations per `docs/SECURITY.md` (Sections 2–4). Client-side route hiding is never treated as a boundary.
- Implement CMS content operations (create/edit/save/delete with validation, save feedback, destructive-action confirmation) and media handling (upload/replacement/removal with confirmation) where required by the confirmed implementation, per `docs/ARCHITECTURE.md` (Section 11) and `docs/API.md` (Section 12).
- Keep inquiry-record storage **Conditional**: it is not built unless explicitly confirmed as a CMS requirement (default remains EmailJS → Gmail with no stored inquiry entity).

### Expected output

A working CMS against Supabase for confirmed areas: authenticated admins can manage content and media with predictable save behavior; public retrieval consumes only intentionally published, confirmed content.

### Verification / exit criteria

- Unauthenticated users cannot reach any CMS surface or operation; authorized actions succeed and unauthorized actions are rejected server-side, per `docs/TESTING.md` (Sections 7–8).
- Saved content persists and renders predictably; invalid input is rejected with clear messages; destructive actions require explicit confirmation; recoverable failures preserve edits where practical.
- Media lifecycle behaves predictably with confirmation for removal; absent media never breaks layout.
- Public paths expose no drafts, admin identities, sessions, secrets, or (if ever confirmed) inquiry records.
- Conditional inquiry persistence remains absent unless its activating confirmation exists.

---

## 10. Phase 4 — API / Backend / Integrations

### Objective

Enforce server-side behavior and connect the polished frontend and CMS to real services through Astro Server Endpoints.

### Main activities

- Implement inquiry processing at the server boundary: independent server-side re-validation, Turnstile evidence verification, and EmailJS delivery invocation without exposing sensitive configuration to the browser, per `docs/ARCHITECTURE.md` (Sections 9, 14, 16) and `docs/API.md` (Sections 5–10).
- Wire CMS data retrieval into Astro rendering so confirmed CMS content replaces mock sources per surface (Section 5), preserving SEO-critical server-rendered HTML.
- Apply server-side authorization to every CMS/media operation and honor the confirmed storage access model, per `docs/SECURITY.md` (Sections 3–4, 11).
- Keep user-facing errors clear and non-technical with next-step guidance; diagnostics stay server-side only.

### Expected output

End-to-end working flows on real services: validated inquiries reach the client's Gmail with consistent success signaling; CMS edits flow to published HTML; spam protection is enforced server-side.

### Verification / exit criteria

- Server re-validates independently of client checks; invalid or spam-verification-failed submissions are rejected before delivery with non-technical feedback and no exposed internals, per `docs/TESTING.md` (Section 6).
- Success is reported only when the inquiry is accepted for delivery; delivery failure produces a clear error, never false success.
- No secrets in client bundles, responses, logs, or the repository; Turnstile secrets stay server-side.
- Per-surface mock-to-real swaps are each verified (rendered output, states, SEO output intact) before the next surface migrates.
- Combined email-plus-persistence semantics, if persistence was confirmed, behave per the confirmed requirement — no combined behavior is assumed.

---

## 11. Phase 5 — Integration Testing & Debugging

### Objective

Verify that the assembled system — frontend, CMS, backend, and integrations together — behaves per requirements, and fix what does not.

### Main activities

- Exercise critical journeys end to end in a real browser where practical: page rendering and navigation, services → packages → inquiry path, inquiry submission including validation/verification/delivery failures, CMS edit → public render, auth → protected operation, media lifecycle, per `docs/TESTING.md` (Sections 5–8, 13–15).
- Run responsive, accessibility, SEO, performance, and security-boundary checks over the assembled system (not just isolated increments), per `docs/TESTING.md` (Sections 8–12).
- Debug per `docs/DEVELOPMENT.md` (Sections 21–22): reproduce, gather evidence, identify root cause (or state uncertainty), apply the smallest fix, verify the original failure plus adjacent cases, and regress affected journeys.
- Verify data integrity: published output matches saved/confirmed content, unauthorized writes are rejected, deletions degrade to sensible fallbacks.

### Expected output

A verified system with evidenced results: passing journeys, fixed root causes (not masked symptoms), and regression coverage proportionate to risk.

### Verification / exit criteria

- `docs/TESTING.md` quality gates for the release scope pass (Section 21): functional behavior, critical journeys, client + server validation, security boundaries, failure states, responsive/accessibility checks, and build hygiene.
- Every failure state resolves to exactly one clear outcome with no false success and no exposed internals.
- Regression over changed features, direct dependencies, shared components, and related journeys shows no new breakage.
- Remaining gaps are reported as not verified/blocked/confirmation-required with reasons — never claimed as passing.

---

## 12. Phase 6 — Deployment

### Objective

Publish and verify the agreed website as an operational production system.

### Main activities

- Deploy through the hosting pipeline (GitHub → Vercel direction per `docs/TECH-STACK.md` and `docs/ARCHITECTURE.md`), configure production environment without committing secrets, and connect the confirmed production domain, per `docs/DEPLOYMENT.md`.
- Verify production: build, domain/HTTPS/canonical behavior, pages and navigation, CMS reachability with authentication enforced, inquiry delivery with production configuration, SEO files (sitemap, robots.txt), structured data, review CTA pointing to the exact client-supplied URL, and Search Console readiness.

### Expected output

A live, verified production website on the confirmed domain, handed over with the client holding required ownership and access.

### Verification / exit criteria

- `docs/DEPLOYMENT.md` acceptance criteria pass (Section 31) and the production smoke test passes (Section 22): domain resolves, HTTPS active, pages/CMS/inquiry/SEO/security checks green, no placeholder or **Reference-Only** content in production.
- Detailed procedure belongs in `docs/DEPLOYMENT.md` — this phase defines its place in the sequence and its gate, not its steps. No deployment commands, DNS values, or credentials are invented here.

---

## 13. Phase 7 — Maintenance & Iteration

### Objective

Keep the live website correct, secure, and maintainable, and evolve it through the same disciplined increments.

### Main activities (iterative cycle)

```text
Monitor → Triage → Small increment → Verify → Regress → Redeploy → Report
```

- Monitor proportionately (broken pages, failed forms/delivery, CMS/auth issues, content errors, indexing or domain issues) per `docs/DEPLOYMENT.md` (Section 23). No dedicated monitoring platform unless a demonstrated need justifies it.
- Triage each issue or request against requirements and scope: confirmed fix, confirmation-required question for the client, or out-of-scope proposal requiring rescope plus a `docs/DECISIONS.md` entry.
- Implement each approved increment by re-entering the relevant earlier phases (typically Phases 2–5) at small scope, then redeploy through Phase 6 discipline.

### Expected output

Each iteration leaves the production site in a verified working state with its change evidenced and its documentation updated where behavior changed.

### Verification / exit criteria (per iteration)

- The increment meets its phase exit criteria and risk-based regression passes; production smoke checks pass after redeploy.
- Documentation affected by the change is updated per `docs/DEVELOPMENT.md` (Section 23); decisions with project-wide effect are recorded per Section 24.
- The iteration introduces no scope creep, no invented business facts, and no unnecessary dependencies or infrastructure.

---

## 14. Phase Dependencies and Transition Gates

Required order with gates:

```text
Phase 1 (Setup)
  │ gate: reproducible skeleton, no secrets, tooling recorded
  ▼
Phase 2 (Frontend + mocks)
  │ gate: polished site on centralized mocks, states/a11y/SEO shells verified
  ▼
Phase 3 (Database / CMS)
  │ gate: authenticated/authorized CMS on Supabase for confirmed areas
  ▼
Phase 4 (API / Backend / Integrations)
  │ gate: server enforcement + per-surface mock→real swaps verified
  ▼
Phase 5 (Integration testing & debugging)
  │ gate: journeys + regression evidenced, TESTING quality gates pass
  ▼
Phase 6 (Deployment)
  │ gate: DEPLOYMENT acceptance + production smoke test pass
  ▼
Phase 7 (Maintenance & iteration — cycles back through Phases 2–6 as needed)
```

Dependency rules:

- Phase 2 needs Phase 1's skeleton and routing; it must not wait for Supabase or EmailJS/Turnstile credentials.
- Phase 3 needs Phase 2's UI contracts (what each surface displays) so the CMS models confirmed needs rather than guessing.
- Phase 4 needs Phases 2–3: polished surfaces to wire and a CMS to retrieve from. Server enforcement is never skipped on the assumption that client validation suffices.
- Phase 5 needs the assembled system from Phase 4; it cannot be replaced by in-phase checks alone (Section 6).
- Phase 6 needs Phase 5's evidence plus production configuration; a passing build alone never authorizes release.
- Phase 7 re-enters earlier phases per increment; database changes get extra care because application rollback does not reverse data changes (per `docs/DEPLOYMENT.md`, Section 24).

Permitted overlaps (explicit, not waterfall violations):

- Phase 3 CMS modeling for one confirmed area may proceed while Phase 2 polishes an unrelated page.
- Phase 4 may wire one surface to real data while another surface remains on mocks, provided each surface is coherent and verified.

Hard gates (never overlapped or skipped):

- No Phase 4 delivery without server-side validation and verification enforcement.
- No Phase 6 without Phase 5 evidence.
- No mock → real swap for a surface without verifying that surface's states and SEO output.

---

## 15. Ownership Between Roadmap, Development, Testing, and Deployment

| Concern | Owner |
| --- | --- |
| Phase order, progression, per-phase outputs and gates | This document (`docs/ROADMAP.md`) |
| How each development step is performed (inspect → plan → implement → review → verify → regress → report) | `docs/DEVELOPMENT.md` + `AGENTS.md` |
| What verification means in detail (levels, journeys, gates, evidence) | `docs/TESTING.md` |
| How release and production verification are executed | `docs/DEPLOYMENT.md` |
| What is actually implemented | The repository |

The DEVELOPMENT workflow operates *inside* each roadmap phase: every phase's activities are executed as small inspect → plan → implement → review → verify increments with risk-based regression. ROADMAP never duplicates DEVELOPMENT's workflow detail, TESTING's verification detail, or DEPLOYMENT's procedural detail; it references them.

---

## 16. Confirmation and Reference Boundaries

The following remain **Confirmation Required** through every phase and must never be finalized, published, or treated as production behavior on assumption:

- Final service list, names, and descriptions; package names, durations, prices, inclusions, add-ons, and conditions.
- Deposit, balance, cancellation, and rescheduling terms; service-area rules and travel fees.
- Business contact details, hours, and service-area statements.
- Google Business Profile review URL (no placeholder or guessed URL is ever published).
- Testimonials/reviews approved for publication, if any; About/company story; gallery imagery; FAQ questions and answers.
- Final inquiry field set, required-versus-optional designation, and option lists.
- Exact CMS modules, fields, publishing workflow, media access model, and data retention.
- Legal content (Privacy Policy, Terms & Conditions) reflecting actual handling and policies.

Shot&Prints material (service characteristics, pricing, inclusions, add-ons, booking policies, descriptions, imagery, FAQs, testimonials, contact details, branding) is **Reference-Only** in every phase. It may inform discussion but must be verified before use, and reference pricing/policies must not be modified, reinterpreted, or invented.

---

## 17. Scope Boundaries

Unless the client explicitly expands the project with a rescoped requirement and a `docs/DECISIONS.md` entry, no phase introduces:

- Real-time availability, calendars, slots, holds, or reservation allocation.
- Reservation/booking engines, status machines, or scheduling workflows.
- Payments, checkout, orders, transactions, or refunds.
- CRM, marketing automation, or follow-up pipelines.
- Custom review platforms, review databases, moderation queues, or unverified review-rating claims.
- Guaranteed SEO rankings; ongoing SEO, content, or backlink campaigns; large-scale SEO landing-page production.
- Enterprise CMS machinery (versions, revisions, audit logs, approval chains, multi-workspace models).
- Second backends, second databases, queues, webhooks, background jobs, microservices, or API gateways.
- Unnecessary state-management libraries, CMS platforms, infrastructure, or alternative providers/frameworks.

This list mirrors `docs/PROJECT.md` (Section 21), `docs/REQUIREMENTS.md` (Section 22), `docs/ARCHITECTURE.md` (Section 24), `docs/DATA-MODEL.md` (Section 16), `docs/API.md` (Section 20), `docs/SECURITY.md` (Section 21), `docs/TESTING.md` (Section 23), and `docs/DEVELOPMENT.md` (Section 35).

---

## 18. Related Documentation

- `AGENTS.md` — AI-agent development rules, implementation principles, scope control.
- `README.md` — repository orientation, technology direction, project constraints.
- `docs/PROJECT.md` — product and business context. Authoritative for business/product questions and known-vs-unconfirmed information.
- `docs/REQUIREMENTS.md` — functional and business requirements. Authoritative for what the system must do.
- `docs/TECH-STACK.md` — technology choices and technical constraints.
- `docs/ARCHITECTURE.md` — application architecture and code organization.
- `docs/UI-UX.md` — user experience and interaction requirements.
- `docs/DESIGN-SYSTEM.md` — visual and component design rules.
- `docs/DATA-MODEL.md` — database structure and data relationships (conceptual level).
- `docs/API.md` — API and external service contracts (conceptual behavior and boundaries).
- `docs/SECURITY.md` — security requirements and constraints.
- `docs/TESTING.md` — testing and verification strategy. Owner of verification expectations.
- `docs/DEVELOPMENT.md` — development workflow. Owner of how each development step is performed; its inspect → implement → verify loop runs inside each roadmap phase.
- `docs/DEPLOYMENT.md` — deployment and production procedures. Owner of release execution.
- `docs/DECISIONS.md` — important architectural and technical decision records.

This document (`docs/ROADMAP.md`) owns development phase order and progression. It duplicates no procedural detail from the documents above; where behavior is concerned, the owning document governs.

---

## 19. Acceptance Criteria

This roadmap document is considered complete when:

1. `docs/ROADMAP.md` exists and defines the complete 7-phase workflow in the required order.
2. Each phase defines Objective, Main activities, Expected output, and Verification / exit criteria.
3. Mock-data-first frontend development is explicitly documented, including centralization, scaffolding-only status, and the per-surface (not flag-day) replacement rule.
4. The transition `Frontend → Mock Data → Database → API/Backend → Real Data` is clearly explained.
5. Continuous verification within phases versus Phase 5 full-system testing is clearly distinguished without contradiction to `docs/TESTING.md` or `docs/DEVELOPMENT.md`.
6. Deployment and maintenance are explicit phases with gates referencing (not duplicating) `docs/DEPLOYMENT.md`.
7. The working method is incremental and Agile-inspired without formal Scrum terminology (no sprints, ceremonies, velocity, or Scrum roles).
8. Phase dependencies, permitted overlaps, hard gates, confirmation boundaries, and scope boundaries are stated.
9. Status terminology (Confirmed / Conditional / Confirmation Required / Reference-Only / Implementation Decision Required) is preserved and no new business facts, technologies, commands, timelines, schemas, endpoints, or credentials are invented.
10. No specific mock-data file location or format is prescribed beyond what implementation decisions establish.
11. Ownership between ROADMAP, DEVELOPMENT, TESTING, and DEPLOYMENT is explicit and non-contradictory.
12. Related documentation and these acceptance criteria are included.

(End of file)
