# Melbourne Photobooth Hire — Decision Records

## 1. Purpose and Scope

This document (`docs/DECISIONS.md`) is the authoritative record for **important** architectural, technical, and implementation decisions made during the Melbourne Photobooth Hire project.

It records decisions that materially affect the project. It does not record every implementation detail, routine code choice, or temporary local preference.

A recorded decision here explains:

- what was decided;
- why it was decided (rationale and trade-offs);
- what alternatives were considered;
- what the consequences are;
- which documents it relates to;
- whether it is still active.

This document preserves the fixed **₱15,000** project scope: simplicity, maintainability, scope control, and avoidance of unnecessary infrastructure or overengineering.

## 2. Documented Choice vs Recorded Decision vs Implemented Behavior

These three things are distinct and must not be confused:

- **Documented choice:** a direction stated in an owning document (for example, a technology marked as selected in `docs/TECH-STACK.md`, or a requirement marked as Must in `docs/REQUIREMENTS.md`). A documented choice exists as soon as its owning document states it.
- **Recorded decision:** an entry in this document following the format in Section 7 with an explicit lifecycle status (Section 6). A documented choice only becomes a recorded decision when an entry is created here. Most documented choices never need an entry here.
- **Implemented behavior:** what the repository actually does. The repository governs actual behavior. A decision can be accepted before it is implemented, and implementation can diverge from documentation — in which case the discrepancy must be identified and resolved explicitly per `AGENTS.md` and `docs/DEVELOPMENT.md`.

Consequences:

- A technology can be selected in `docs/TECH-STACK.md` without having an entry in this document.
- An accepted decision here does not prove the behavior is implemented; verification comes from the repository and `docs/TESTING.md`.
- Generated code, suggestions, or implementation sketches are never decisions until they pass through the lifecycle in Section 5.

## 3. Ownership and Authority

Authority by concern:

| Concern | Authoritative source |
| --- | --- |
| How work is performed, agent behavior, scope control | `AGENTS.md` |
| Product and business context | `docs/PROJECT.md` |
| What the system must do | `docs/REQUIREMENTS.md` |
| Selected technologies and exclusions | `docs/TECH-STACK.md` |
| Architecture, layers, data flows, boundaries | `docs/ARCHITECTURE.md` |
| Behavior and experience | `docs/UI-UX.md` |
| Visual language and reusable styling | `docs/DESIGN-SYSTEM.md` |
| Data concepts, relationships, boundaries | `docs/DATA-MODEL.md` |
| Endpoint behavior and integration boundaries | `docs/API.md` |
| Security requirements and constraints | `docs/SECURITY.md` |
| Verification strategy | `docs/TESTING.md` |
| Development workflow | `docs/DEVELOPMENT.md` |
| Development phases/order | `docs/ROADMAP.md` |
| Production procedures | `docs/DEPLOYMENT.md` |
| Important decision records | This document (`docs/DECISIONS.md`) |

Rules:

- This document does **not** override `docs/REQUIREMENTS.md` on required behavior, `docs/PROJECT.md` on business context, or `docs/SECURITY.md` on security expectations. Conflicts are resolved against the hierarchy in `docs/DEVELOPMENT.md`, not by asserting a decision here.
- A recorded decision explains or applies requirements, architecture, and security — it never weakens or bypasses them (see Section 11).
- Business requirements state what is needed; implementation facts state what exists; recorded decisions state what was chosen among meaningful options and why. These roles are not interchangeable.
- Changes to an owning document's content belong in that document; this document records the decision behind the change and links to it.

## 4. When a Decision Must Be Recorded

Record a decision when it materially affects one or more of the following:

- architecture (layers, data flows, rendering strategy, backend boundaries, island usage);
- technology selection or exclusion (adopting, replacing, or rejecting a technology within the scope of `docs/TECH-STACK.md`);
- major data or API boundaries (content concepts, persistence choices, endpoint responsibilities, integration responsibilities);
- security architecture (authentication, authorization, verification, or secret-handling approach);
- important development conventions with project-wide effect (only where the choice is not already governed by an owning document);
- testing or tooling strategy with project-wide effect (only where the choice is not already governed by `docs/TESTING.md`);
- deployment or infrastructure direction (platform responsibilities; procedures themselves belong in `docs/DEPLOYMENT.md`);
- meaningful trade-offs (cost, complexity, maintainability, performance, or scope implications within the fixed-price constraint);
- choices likely to be revisited later (conditional features, deferred commitments, provisional approaches).

When in doubt, record the decision if a future reader or agent would otherwise ask "why is it this way?" and find no answer in the owning documents.

## 5. When a Decision Must NOT Be Recorded

Do **not** record:

- trivial implementation details (local variable naming, minor code organization, single-use styling);
- temporary local choices (debugging approaches, local exploration steps);
- ordinary component implementation that follows an existing pattern in `docs/DESIGN-SYSTEM.md` or the codebase;
- routine content entry (adding a confirmed service description, gallery image, or FAQ through the established CMS workflow);
- decisions already completely governed by an authoritative requirement, unless there is a meaningful technical trade-off that needs explanation.

The test: if the choice introduces no new trade-off, changes no boundary, and would not plausibly be questioned later, it does not belong here.

## 6. Decision Lifecycle

Each record carries exactly one of the following statuses. No additional lifecycle statuses are defined.

- **Proposed:** identified and under evaluation. Not approved. Must not be implemented as if accepted.
- **Accepted:** approved and currently active. Implementation should conform to it.
- **Superseded:** replaced by a newer accepted record. Retained for history; no longer active. The replacing record must reference it.
- **Rejected:** evaluated and explicitly not adopted. Retained so the same option is not re-proposed without new evidence.
- **Revisit Required:** accepted or proposed but flagged for re-evaluation because of a known trigger (for example, pending client confirmation, pending verification, or a conditional requirement that may activate).

Transitions:

- Proposed → Accepted, Proposed → Rejected, Proposed → Revisit Required.
- Accepted → Superseded (only by recording the replacing decision), Accepted → Revisit Required.
- Revisit Required → Accepted, Revisit Required → Superseded, Revisit Required → Rejected.
- Rejected and Superseded records are never edited into different outcomes; a change is a new record (see Section 18).

## 7. Decision Record Format

Use this lightweight, consistent structure. Omit fields that genuinely do not apply, but do not rename fields.

- **ID:** per Section 8.
- **Title:** short, descriptive name of the choice.
- **Status:** one lifecycle status from Section 6.
- **Date:** date the status was last set (project-local date; no time or timezone machinery).
- **Context:** what problem, requirement, or constraint made the decision necessary. Cite requirement IDs and owning-document sections where applicable.
- **Decision:** what was chosen, stated plainly.
- **Alternatives considered:** what else was evaluated and why each was not chosen. Keep this proportional; one or two sentences per alternative is usually enough.
- **Rationale:** why this choice best serves the requirements within the fixed-price constraint.
- **Consequences:** what follows from the choice (scope, maintenance, follow-up work, constraints on future choices).
- **Related documents:** owning documents and sections affected (for example, architecture, security, data-model, or testing sections).
- **Supersedes / Superseded by:** ID links where applicable; empty for first-generation decisions.
- **Open questions or follow-up:** unresolved items, confirmation needs, or revisit triggers. Unresolved items stay open questions — they are never written as if decided (see Section 20).

## 8. Decision IDs and Numbering

ID convention: sequential identifiers of the form `DEC-001`, `DEC-002`, and so on, in the order records are added to the register in Section 21.

This convention itself is an **implementation decision of this document**, not a pre-existing project standard. No IDs existed before this document, and no IDs are assigned by this document beyond defining the convention. The first real decision recorded in the future will be `DEC-001`.

Rules:

- IDs are never reused or renumbered.
- A superseding decision gets a new ID; the old record keeps its ID and is marked Superseded.
- References elsewhere use the ID plus title (for example, the ID followed by its title) so renames remain traceable.

## 9. Proposal and Approval Rules

1. **Identification:** a proposal is created when investigation shows a material choice (Section 4) with no governing requirement or an ambiguous one. The proposal starts as **Proposed** with Context, Alternatives considered, and Open questions filled in.
2. **Evidence:** gather only what the decision needs — the repository implementation where relevant, the owning documentation sections, explicit client confirmation where business facts are involved, and technical verification or test results where behavior is claimed. Do not manufacture evidence.
3. **Conflict resolution:** if the proposal conflicts with `docs/REQUIREMENTS.md`, `docs/SECURITY.md`, `docs/PROJECT.md`, or the documented architecture, name the conflict and resolve it against the source-of-truth hierarchy before approval. A decision here cannot resolve a conflict by overriding the higher authority (see Section 11).
4. **Client confirmation:** required before accepting any decision that fixes business facts (pricing, policies, service descriptions, contact details, legal content, review destination, gallery imagery, FAQs, or any Shot&Prints carryover). Without it, the record stays **Proposed** or **Revisit Required**.
5. **Deferral:** defer (leave **Proposed** or mark **Revisit Required**) when confirmation is missing, evidence is insufficient, or the conditional requirement that would activate the choice is not confirmed. Deferral is an explicit status, not silence.
6. **Approval:** a proposal becomes **Accepted** only when its rationale, consequences, related documents, and open questions are complete enough for a future implementer to act on it without guessing.

## 10. AI-Assisted Decision Making

AI agents (per `AGENTS.md` and `docs/DEVELOPMENT.md`) must:

- inspect existing documentation and the repository implementation before proposing or applying any decision;
- distinguish facts (what documents or code state), proposals (what is suggested), assumptions (what is unconfirmed), and decisions (what is accepted and recorded here);
- never treat generated code, suggestions, or draft text as an approved decision;
- never silently change, weaken, or bypass an **Accepted** decision during implementation;
- identify requirements, security, or architecture conflicts before implementing, and stop or escalate where the ambiguity is material;
- record important decisions here when Section 4 applies, using the format in Section 7;
- report unresolved decisions as unresolved (Proposed or Revisit Required) rather than inventing outcomes.

AI-generated implementation remains untrusted until reviewed and verified regardless of any decision record.

## 11. Decision Hierarchy

A decision recorded here **cannot** authorize any of the following:

- violating a confirmed requirement in `docs/REQUIREMENTS.md`;
- weakening a security requirement or constraint in `docs/SECURITY.md`;
- inventing a business fact that requires client confirmation (see `docs/REQUIREMENTS.md` confirmation checklist);
- overriding a higher-authority document without explicit resolution through the source-of-truth hierarchy.

If a desired outcome appears to require one of the above, the path is: resolve the underlying requirement, security, or confirmation issue in its owning document first, then record the consequent decision here. The decision record references that resolution; it does not substitute for it.

Priority order follows `AGENTS.md`: user requirements first, then security and data integrity, then documented architecture, then existing behavior, then maintainability, simplicity, performance, and convenience.

## 12. Technology Decisions

`docs/TECH-STACK.md` owns what is selected, conditional, or not selected. This document does not re-decide the stack.

- A decision here may explain the reasoning behind adopting, retaining, replacing, or rejecting a technology **within** the authority of `docs/TECH-STACK.md`, and must link to the affected stack sections.
- No new technology choices are created by this document. Any future adoption beyond the selected stack requires a confirmed requirement plus an accepted record here, followed by an update to `docs/TECH-STACK.md`.
- Technologies listed as not selected in `docs/TECH-STACK.md` remain not selected until such a record exists. This document does not enumerate, compare, or introduce alternative providers, frameworks, or infrastructure.
- Conditional items (for example, features marked conditional in `docs/TECH-STACK.md`) stay conditional until their activating requirement is confirmed. A record here can document that activation; it cannot activate them by assertion.

## 13. Architecture Decisions

`docs/ARCHITECTURE.md` owns layers, data flows, and boundaries. This document records the reasoning behind material architectural choices and changes.

- Architectural changes (rendering approach, island usage, server-boundary responsibilities, Supabase usage shape, CMS structure, media handling) are recorded here and linked to the affected `docs/ARCHITECTURE.md` sections.
- This document defines no schemas, endpoints, components, or implementation detail; those belong in the owning documents and the repository.
- If a proposed change needs an architectural ruling not present in `docs/ARCHITECTURE.md`, identify it explicitly, keep the record **Proposed** until resolved, and update the owning architecture section only after acceptance.

## 14. Security Decisions

`docs/SECURITY.md` governs security expectations. Security-related decisions here must remain consistent with it.

- Records may document the chosen approach to authentication, authorization, validation boundaries, verification handling, secret management, or storage access — always linked to the relevant `docs/SECURITY.md` sections.
- No record here weakens, bypasses, or reinterprets a security rule. Detail such as policies, flows, keys, or handling values is not invented here; unconfirmed detail stays **Confirmation Required** in the owning document.
- If a security trade-off is unavoidable, the record states the constraint, the chosen mitigation, and the residual follow-up as an open question — it does not silently accept the risk.

## 15. Data and API Decisions

Meaningful changes to data concepts, persistence, endpoint boundaries, or integration responsibilities are recorded here and reflected in their owning documents.

- Data concepts and boundaries belong in `docs/DATA-MODEL.md`; endpoint behavior and integration responsibility boundaries belong in `docs/API.md`. This document records why a boundary changed, not the wire or schema detail.
- Conditional persistence (storing inquiry records) and any future stored relationships require explicit confirmation first; the record documents the activation and its failure-handling consequences, linked to the owning data and API sections.
- No tables, fields, payloads, methods, or contracts are invented here. Exact modules, fields, and validation rules stay **Confirmation Required** in their owning documents until confirmed.

## 16. Testing and Development Decisions

Tooling and convention choices that are not yet established (for example, test tooling, browser verification tooling, coverage expectations, local commands, or source-control conventions) are **Implementation Decision Required** in `docs/TESTING.md` and `docs/DEVELOPMENT.md`.

- When such a choice is made and has project-wide effect, record it here with rationale and consequences, then reflect it in the owning document.
- Until recorded and reflected, such choices remain undecided: do not invent tooling, commands, thresholds, or conventions in implementation, tests, or reports.
- Unit or component testing scope follows `docs/TESTING.md` (meaningful logic only); adopting broader coverage is itself a decision requiring justification against the fixed-price constraint.

## 17. Deployment Decisions

Deployment and infrastructure direction (platform responsibilities, environment-handling principles, production verification expectations) may be recorded here at the decision level.

Detailed deployment procedures — setup steps, configuration actions, domain wiring, release actions, and verification runs — belong in `docs/DEPLOYMENT.md`, not here. This document is not a deployment manual.

## 18. Superseding and Reversing Decisions

An accepted decision is never silently rewritten to make the old outcome disappear.

1. Keep the original record intact, changing only its Status (to **Superseded**) and its Superseded-by reference.
2. Create a new record with a new ID carrying the revised outcome, its own rationale, and a Supersedes reference to the old ID.
3. Explain why the change occurred: what new requirement, evidence, confirmation, or constraint caused it.
4. Update the owning documents to reflect the current outcome; history lives here, current truth lives there.

Rejection follows the same discipline: a **Rejected** record stays rejected; re-proposing it requires new evidence and a new record referencing the old one.

## 19. Decision Evidence

Prefer evidence over assertion. Useful evidence includes:

- the existing repository implementation (what the code actually does);
- the owning project documentation sections (requirements, architecture, security, data, API, testing, development);
- explicit client confirmation for business facts;
- technical verification (build, type, or behavior checks actually performed);
- testing results with stated context and outcomes;
- documented constraints (fixed price, scope boundaries, confirmation status).

Reports and records distinguish verified outcomes from assumptions. Anything unconfirmed stays labeled **Confirmation Required** or **Implementation Decision Required** as appropriate; Shot&Prints material stays **Reference-Only** (see Section 24).

## 20. Unresolved Decisions

Choices not ready to be made are documented as unresolved — never as accepted by implication.

- Create or keep a record with Status **Proposed** or **Revisit Required**, with Open questions describing exactly what is missing (confirmation, evidence, or a conditional trigger).
- State the revisit trigger: what event or confirmation would allow the decision to proceed.
- Implementation depending on the unresolved choice must either wait or proceed only on the smallest explicitly reported assumption per `AGENTS.md` and `docs/DEVELOPMENT.md` — the assumption does not change the record's status.

## 21. Current Decision Register

Twenty-nine decision records exist (DEC-001 through DEC-029). Existing selections, requirements, and architectural directions stated in `docs/TECH-STACK.md`, `docs/REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, and the other owning documents remain **documented choices**, not decision records, and are not retroactively treated as entries here. The repository remains the source of what is actually implemented.

| ID      | Title                                                    | Status     | Date       |
| ------- | -------------------------------------------------------- | ---------- | ---------- |
| DEC-001 | Phase 1 Astro skeleton and tooling baseline              | Accepted   | 2026-09-12 |
| DEC-002 | Typecheck, format enforcement, and root CONTEXT glossary | Accepted   | 2026-09-12 |
| DEC-003 | Centralized mock-content seam and styling split          | Superseded | 2026-09-12 |
| DEC-004 | Inquiry form island with hand-rolled Zod resolver        | Accepted   | 2026-09-12 |
| DEC-005 | Provisional mock content and pending-state rendering     | Accepted   | 2026-09-12 |
| DEC-006 | Provisional premium visual redesign                      | Accepted   | 2026-09-12 |
| DEC-007 | Provisional "event noir" homepage redesign + sample rule | Accepted   | 2026-09-12 |
| DEC-008 | Hero background-image redesign with overlay             | Accepted   | 2026-09-12 |
| DEC-009 | Hero refinement: overlay fix, icons, typography, motion  | Accepted   | 2026-09-12 |
| DEC-010 | Booths section premium refinement: content, card, grid  | Accepted   | 2026-09-12 |
| DEC-011 | Booth card icons and shortened copy                     | Accepted   | 2026-09-12 |
| DEC-012 | Site-wide frontend enhancement: deepened "event noir"   | Accepted   | 2026-09-16 |
| DEC-013 | SSR-safe island styling via token-backed CSS             | Accepted   | 2026-09-16 |
| DEC-014 | Homepage refinement: lightbox, marquee, icons, CTA       | Accepted   | 2026-09-16 |
| DEC-015 | Homepage pass 2: no light panels, premium cards, motion  | Accepted   | 2026-09-16 |
| DEC-016 | SEO technical foundation: domain, canonicals, sitemap    | Accepted   | 2026-09-16 |
| DEC-017 | CMS frontend: Astro admin routes with local mock store    | Accepted   | 2026-09-22 |
| DEC-018 | CMS split: page CMS vs item modules + highlights + uploads | Accepted   | 2026-09-23 |
| DEC-019 | Modules list-and-detail UX + seed/schema save-blocker fixes | Accepted   | 2026-09-24 |
| DEC-020 | Required service badges with Most Popular highlight | Accepted   | 2026-09-24 |
| DEC-021 | Dedicated SEO module with per-page metadata | Accepted   | 2026-09-24 |
| DEC-022 | SweetAlert2 as the standard admin alert system | Accepted   | 2026-09-24 |
| DEC-023 | Event Types module as the contact-form dropdown source | Accepted   | 2026-09-24 |
| DEC-024 | Supabase backend foundation on free-tier limits + hybrid output | Accepted   | 2026-09-24 |
| DEC-025 | Middleware admin guard with server-rendered admin pages | Accepted   | 2026-09-24 |
| DEC-026 | Inquiry endpoint: store-first receipt, gated integrations | Accepted   | 2026-09-24 |
| DEC-027 | Publish-on-demand via guarded Deploy Hook trigger | Superseded | 2026-09-24 |
| DEC-028 | Server-rendered public pages with edge SWR, no rebuilds | Accepted   | 2026-09-24 |
| DEC-029 | Single-backend simplification: generated types, no local mode | Accepted   | 2026-09-24 |

### DEC-001 — Phase 1 Astro skeleton and tooling baseline

- **ID:** DEC-001
- **Title:** Phase 1 Astro skeleton and tooling baseline
- **Status:** Accepted
- **Date:** 2026-09-12
- **Context:** ROADMAP Phase 1 requires a reproducible skeleton (pages resolve, navigation, 404, production build) with no unconfirmed business content. No package manager, config, or source layout existed (docs-only greenfield). REQ-PUB-001 requires Melbourne Photobooth Hire branding throughout; `site`/sitemap canonicals require a client-confirmed domain per DEPLOYMENT.md.
- **Decision:** Scaffold minimal Astro 7 + strict TypeScript via npm with `dev`/`build`/`preview` scripts; Prettier as formatter; hand-written `BaseLayout` plus structure-only routes (`/`, `/services`, `/packages`, `/gallery`, `/about`, `/faq`, `/contact`, `/privacy`, `/terms`, `/404`) each with unique title/description and one H1; `public/robots.txt` allowing public and disallowing `/admin`; `.gitignore` covering `node_modules/`, `dist/`, `.astro/`, `.env*`. Defer `site`/sitemap integration, React islands, Styled Components, and Supabase wiring to their roadmap phases.
- **Alternatives considered:** `npm create astro` interactive template — rejected to keep the diff minimal and reviewable with zero business content. Adding sitemap/`site` now — rejected because the production domain is provisional/pending confirmation and must not be baked into canonicals.
- **Rationale:** Smallest increment meeting the Phase 1 exit gate within the ₱15,000 scope; keeps SEO shells correct without inventing canonicals, content, or config.
- **Consequences:** `npm install`/`npm run build` reproduce the skeleton; Phase 2 builds UI on these routes; `site`/sitemap/React/CMS work remains explicitly pending.
- **Related documents:** `docs/ROADMAP.md` (Phase 1), `docs/ARCHITECTURE.md` (Astro-first), `docs/TECH-STACK.md` (Astro/TS), `docs/DEPLOYMENT.md` (domain confirmation).
- **Supersedes / Superseded by:** —
- **Open questions or follow-up:** Confirm production domain before adding `site`/sitemap/canonicals; confirm package validation and form/CMS scope in Phase 2/3 planning.

### DEC-002 — Typecheck, format enforcement, and root CONTEXT glossary

- **ID:** DEC-002
- **Title:** Typecheck, format enforcement, and root CONTEXT glossary
- **Status:** Accepted
- **Date:** 2026-09-12
- **Context:** Phase 1 exit needs evidenced hygiene beyond `astro build` (DEVELOPMENT.md Section 19). No check/format commands or shared domain glossary existed.
- **Decision:** Add `@astrojs/check` with `npm run check`; add `.prettierrc` (prettier-plugin-astro) with `format`/`format:write` scripts and `.prettierignore` for `dist/`, `.astro/`, `node_modules/`, `package-lock.json`, `docs/`, root `*.md`, and `.agents/`. Create root `CONTEXT.md` as the canonical glossary (inquiry/request, service, package, gallery item, FAQ, published content, site settings, admin, CMS, server endpoint, Turnstile evidence, review CTA, testimonial). Decision records stay in this file per project convention, not the skill-default `docs/adr/`.
- **Alternatives considered:** ESLint suite — rejected as disproportionate tooling for the current scope; can be revisited with evidence of need. `docs/adr/` directory — rejected to avoid a second decision-record system.
- **Rationale:** Smallest tooling that evidences the Phase 1 gate; glossary prevents terminology drift (e.g. booking vs inquiry) in code and discussion.
- **Consequences:** `npm run check` and `npm run format` are part of every verification pass; CONTEXT.md terms are binding for new code.
- **Related documents:** `docs/DEVELOPMENT.md` (Sections 19–20), `docs/TESTING.md` (Section 4.1), `CONTEXT.md`.
- **Supersedes / Superseded by:** —
- **Open questions or follow-up:** None.

### DEC-003 — Centralized mock-content seam and styling split

- **ID:** DEC-003
- **Title:** Centralized mock-content seam and styling split
- **Status:** Superseded
- **Date:** 2026-09-12
- **Context:** ROADMAP Sections 4–5 require a centralized mock layer swapped per-surface for Supabase content in Phase 3. TECH-STACK selects Styled Components "across Astro and React UI", but styled-components cannot style `.astro` files directly. First build also exposed a styled-components default-import SSR interop failure (`styled.button is not a function`).
- **Decision:** `src/lib/content/` owns one small interface (`ContentSource.load()` / `getContent()` accepting an injectable source) with a mock adapter of clearly-marked placeholder data only (empty gallery/FAQs to exercise empty states; `reviewUrl: null` so the review CTA stays absent until confirmed). Styling splits: CSS custom properties in `src/styles/tokens.css` (+ `global.css`) for Astro components, typed styled-components `theme` for React islands only. Island convention: named `styled` import (SSR-safe), minimal serialized props, `client:media` hydration for the mobile nav island.
- **Alternatives considered:** Per-page fixtures — rejected (flag-day rewrites, violates ROADMAP centralization). styled-components everywhere incl. Astro — impossible; rejected. `client:load` for mobile nav — rejected (ships JS to desktop users who never need it).
- **Rationale:** One seam = one swap point for Phase 3; split styling honors both the selected stack and Astro's rendering model; `client:media` keeps desktop pages at zero island JS.
- **Consequences:** Pages/components consume `getContent()` only; Phase 3 adds a Supabase adapter without touching callers; provisional palette label must be lifted on client brand confirmation.
- **Related documents:** `docs/ROADMAP.md` (Sections 4–5), `docs/ARCHITECTURE.md` (Sections 6–8), `docs/DESIGN-SYSTEM.md` (Sections 5–10), `docs/DATA-MODEL.md` (Section 5).
- **Supersedes / Superseded by:** Superseded by DEC-005
- **Open questions or follow-up:** Client confirmation of brand colors/fonts, CMS modules/fields, and review URL before Phase 3 wiring.

### DEC-004 — Inquiry form island with hand-rolled Zod resolver

- **ID:** DEC-004
- **Title:** Inquiry form island with hand-rolled Zod resolver
- **Status:** Accepted
- **Date:** 2026-09-12
- **Context:** ROADMAP Phase 2 requires client-side validation feedback (RHF + Zod usability layer) with no claim about server enforcement. The field set and required-vs-optional designations are Confirmation Required (REQ-INQ-008 through REQ-INQ-010). `@hookform/resolvers` could not be installed: its peer chain demands Zod v3 while Astro 7 pins Zod v4.
- **Decision:** Build `InquiryForm` island on `react-hook-form` + `zod` with a ~15-line in-repo Zod→RHF resolver (`src/lib/validation/inquiry.ts`, the single source of validation truth shared with the Phase 4 endpoint). Provisional field set = documented REQ-INQ-008 candidates (name/email/eventDate required; rest optional); provisional option lists = REQ-INQ-009/010 candidates; all marked provisional in code. Valid data resolves to an honest informational state (no fake send, no fake spinner); submitting-state + duplicate-prevention wiring lands with the real Phase 4 send. Packages/gallery/FAQ/homepage now render through `getContent()`; About stays a pending state (no confirmed model).
- **Alternatives considered:** `@hookform/resolvers` — rejected (unresolvable Zod v3/v4 peer conflict; the mapping is trivial). Minimal name/email/message field set — rejected (full candidate set exercises the real layout/validation surface sooner). Fake submitting delay — rejected (dishonest feedback).
- **Rationale:** Fewest dependencies, no version fight; capability built without publishing unconfirmed business facts; honest states throughout.
- **Consequences:** Phase 4 reuses `inquirySchema` server-side and wires the send; client confirmation of fields/options required before production.
- **Related documents:** `docs/REQUIREMENTS.md` (Sections 9, 23), `docs/ARCHITECTURE.md` (Section 9), `docs/UI-UX.md` (Sections 13–14), `docs/ROADMAP.md` (Phase 2).
- **Supersedes / Superseded by:** —
- **Open questions or follow-up:** Client confirmation of final field set, required-vs-optional, and option lists.

### DEC-005 — Provisional mock content and pending-state rendering

- **ID:** DEC-005
- **Title:** Provisional mock content and pending-state rendering
- **Status:** Accepted
- **Date:** 2026-09-12
- **Context:** DEC-003 described the mock adapter as holding empty gallery/FAQs, but implementation grew provisional reference-based services, packages, add-ons, FAQs, and testimonials through the seam, while `about.astro` bypassed the seam with hardcoded business claims and the homepage rendered mock testimonials as if real (REQ-REV-007 prohibits fake reviews). Grill rounds Q1–Q8 locked project context with all business facts staying provisional and conditionals staying off.
- **Decision:** Retain the DEC-003 seam and styling split unchanged. Revise the mock-content rule: populated provisional services/packages/add-ons/FAQs exercise layout only and must not be treated as confirmed facts; gallery and testimonials stay empty (REQ-GAL-001/005, REQ-REV-007) with the homepage omitting the Reviews section when empty; `reviewUrl: null` keeps the review CTA absent; About renders through `getContent()` with a pending state directing visitors to enquire. No CMS modules, persistence, sitemap/`site`/canonicals, or integrations are activated.
- **Alternatives considered:** Keeping mock testimonials rendered — rejected (fake-review violation). Deleting provisional services/packages/FAQs too — rejected (destroys the Phase 2 layout exercise; testimonials are the special case). Silently editing DEC-003 — rejected (violates the supersession rule).
- **Rationale:** Preserves Phase 2 layout velocity without publishing unconfirmed business facts; honest empty/pending states throughout within the ₱15,000 scope.
- **Consequences:** About, homepage, and mock changes land with this record; Phase 3 adds a Supabase adapter without touching callers; client confirmation still required for all business facts before production.
- **Related documents:** `docs/REQUIREMENTS.md` (Sections 3, 5–8, 12, 23), `docs/ARCHITECTURE.md` (Sections 6–7), `docs/UI-UX.md` (Sections 7, 11, 21), `docs/DATA-MODEL.md` (Section 5), `docs/ROADMAP.md` (Phase 2).
- **Supersedes / Superseded by:** Supersedes DEC-003
- **Open questions or follow-up:** Client confirmation of services, packages, FAQs, testimonials, About story, review URL, and CMS scope before production/Phase 3.

### DEC-006 — Provisional premium visual redesign

- **ID:** DEC-006
- **Title:** Provisional premium visual redesign
- **Status:** Accepted
- **Date:** 2026-09-12
- **Context:** The Phase 2 site used the provisional warm-cream/terracotta palette with system fonts. The client requested a modern, elegant, premium redesign of all UI (tokens, header, footer, buttons, cards, hero, pages, form). DESIGN-SYSTEM Sections 5–6, 38 keep final colors and fonts **Confirmation Required**; the redesign therefore proposes new provisional values, never confirmed brand facts. Motion is a selected technology in `docs/TECH-STACK.md` but was not installed.
- **Decision:** Adopt a provisional **ink + ivory + champagne** "editorial spotlight" direction: warm near-black `#1A1511` bands/CTA, ivory `#F7F2E9` page background, champagne `#9E7B33`/`#E3C98A` accents; **Cormorant Garamond** display serif + **Inter** body/UI, self-hosted via `@fontsource/cormorant-garamond` + `@fontsource/inter`; install `motion` (selected stack) for a single hero entrance and below-the-fold reveals (reduced-motion respected, content readable without JS via a `html.js` guard). Add documented design-system tokens: `elevation-0/1/2`, `motion-quick/settled` + one default easing, `radius-pill`. New presentational components `Hero`, `PageHeader`, `Card`; restyle all existing components and the 10 pages. Existing behavior (semantics, ARIA, inquiry validation, nav breakpoints) is preserved; business copy is unchanged.
- **Alternatives considered:** Keeping the warm-cream/terracotta palette — rejected (reads as the generic AI default per frontend-design review). Dark photography-led site-wide — rejected (hurts readability of text-light pages). Google Fonts `<link>` loading — rejected in favor of self-hosting (no third-party request, no CLS). CSS-only motion — superseded by the client's explicit choice of the Motion package.
- **Rationale:** Gives the marketing site a premium, photography-led identity within the ₱15,000 scope while keeping all brand values explicitly provisional and all business facts unchanged.
- **Consequences:** Tokens, theme, components, and pages now render the new direction; the `motion` and `@fontsource/*` dependencies are added; final colors/fonts still require client confirmation before production; DESIGN-SYSTEM.md is not edited (it intentionally leaves values unconfirmed).
- **Related documents:** `docs/TECH-STACK.md` (Sections 4–6), `docs/DESIGN-SYSTEM.md` (Sections 5–12, 29, 38), `docs/UI-UX.md` (Sections 6–10, 13–14), `docs/ROADMAP.md` (Phase 2).
- **Supersedes / Superseded by:** —
- **Open questions or follow-up:** Client confirmation of the provisional palette/font pairing and any supplied brand guidelines before production; review URL and photography remain outstanding.

### DEC-007 — Provisional "event noir" homepage redesign and sample-content rule

- **ID:** DEC-007
- **Title:** Provisional "event noir" homepage redesign and sample-content rule
- **Status:** Accepted
- **Date:** 2026-09-12
- **Context:** The client asked to make the homepage look modern, premium and elegant, explicitly authorising invented content and photography from online sources for design purposes, with real content to be managed through the CMS later. DEC-006's "editorial spotlight" read as a generic AI default (warm cream + high-contrast serif + clay/champagne accent) per the frontend-design review, which flags that pattern as a templated tell. REQ-GAL-008 (no stock presented as real events), REQ-REV-007 (no fake reviews presented as real), and REQ-SVC-004/REQ-PKG-006 (no unconfirmed claims published) constrain how sample content may be rendered.
- **Decision:** Adopt a provisional **"event noir"** homepage identity that refines DEC-006's provisional values (final brand values remain **Confirmation Required**): the homepage renders on a full-bleed dark espresso canvas (`body.page-home`), with ivory "print" panels for the showcase and review sections; switch the display face to **Fraunces** (self-hosted via `@fontsource/fraunces`, replacing Cormorant Garamond) paired with the existing Inter; keep the champagne-gold accent as the single "thread" (eyebrows, badges, step numerals, hairline borders, dark-tone CTAs). Layout is photography-led and left-aligned: split hero (copy + framed portrait + capability stats), three image service cards, a sample showcase strip, priced package cards with a featured "Most Popular" treatment, numbered how-it-works steps (a genuine sequence), sample reviews, FAQ teaser, event-type chips, and a photo-scrim closing CTA. **Sample-content rule:** all invented material (Pexels stock imagery with "(sample imagery)" alt markers, capability stats derived from provisional product content, invented review quotes) is SAMPLE-only, lives in `src/lib/content/mock.ts` through the existing `getContent()` seam, is rendered with explicit "Sample" markers (never as Google reviews or real client events), and must never be treated as production content. Hotlinked Pexels URLs are centralised in `mock.ts` so a future vendor-local swap is one file.
- **Alternatives considered:** Keeping the DEC-006 ivory-first palette — rejected (read as the generic cream+serif+clay default the client had already rejected). A second serif accent word in the headline — rejected (frontend-design guidance forbids accenting a single word). Persisting sample content to the real `/gallery` — rejected (would pollute the honest empty state); a separate homepage showcase strip keeps the boundary clean. Vendoring images into `public/images/` — offered but declined by the client in favour of hotlinking.
- **Rationale:** Delivers the requested modern/premium/elegant result within the ₱15,000 scope while keeping the compliance boundaries intact: no fake reviews presented as real, no stock presented as real events, no unconfirmed claims published, and a single swap point for confirmed CMS content later.
- **Consequences:** tokens/theme gain `--color-surface-dark`, `--color-scrim`; Header/MobileNav move to dark; Hero, Card (image/price/dark/featured variants), SectionHeading (tone) extended backward-compatibly; homepage rebuilt with sample content. Cormorant Garamond dependency removed. Any preview deployment containing this homepage is internal-only; production remains blocked on real content, confirmed brand values, and the confirmed domain.
- **Related documents:** `docs/UI-UX.md` (Sections 7, 21), `docs/DESIGN-SYSTEM.md` (Sections 5–6, 38), `docs/REQUIREMENTS.md` (REQ-GAL-008, REQ-REV-007, REQ-SVC-004, REQ-PKG-006), `docs/ROADMAP.md` (Phase 2).
- **Supersedes / Superseded by:** —
- **Open questions or follow-up:** Client confirmation of the event-noir palette and Fraunces pairing; client-approved photography replacing sample imagery; approved testimonials replacing sample quotes; CMS confirmation before Phase 3 wiring.

### DEC-008 — Hero background-image redesign with overlay

- **ID:** DEC-008
- **Title:** Hero background-image redesign with overlay
- **Status:** Accepted
- **Date:** 2026-09-12
- **Context:** The client asked to enhance the homepage hero to feel modern, elegant and premium, with the image used as a background under an overlay. The DEC-007 hero used a side portrait panel on a flat ink canvas. A hero background image carries a text-legibility risk, so the overlay treatment and a legibility-safe image choice are the core decisions.
- **Decision:** Convert the hero to a **full-bleed background image** with a two-layer overlay. The section breaks out of the page container via the standard `margin-inline: calc(50% - 50vw)` technique (no layout change); `background-size: cover`, `min-height: min(40rem, 92svh)` reserve space (CLS stability); a base `--color-scrim` wash plus a directional gradient (90deg on desktop, 180deg on mobile) keep the Fraunces headline, lede and CTAs readable anywhere on the photo while letting the photograph show through on the right. New verified SAMPLE hero background image: Pexels `30562607` (outdoor evening event, elegant tables under warm string lights, w=1920). The image is preloaded in the document head via a new homepage-only `preloadImage` prop on `BaseLayout` (LCP). Alt text is exposed via an `.sr-only` span (backgrounds cannot carry alt), preserving the "(sample imagery)" marker. The old portrait `heroImage` field was replaced by `heroBackgroundImage` in the content seam; the stats row and Reveal mount stagger are retained; fallback is plain `--color-ink` when no image is present.
- **Alternatives considered:** Reusing the CTA band's string-lights shot (29851245) — rejected (would duplicate the closing section; a distinct wide shot was sourced instead). Reusing the first-dance portrait as background — rejected (portrait crop and busy centre would fight the copy). A contained rounded panel instead of full-bleed — offered, client chose full-bleed.
- **Rationale:** The background + overlay delivers the requested immersive, premium treatment while keeping text legibility, accessibility (sr-only alt), and performance (preload, reserved space) intact, all within the provisional event-noir system and the sample-content rule.
- **Consequences:** Hero component props changed from `imageSrc/imageAlt` to `backgroundSrc/backgroundAlt`; `BaseLayout` gained an optional `preloadImage` prop (default unchanged); `--color-scrim-strong` token added; portrait field removed from the seam. Any preview containing the sample hero is internal-only; production remains blocked on real content and confirmed brand values.
- **Related documents:** `docs/DECISIONS.md` (DEC-007), `docs/UI-UX.md` (Section 7), `docs/DESIGN-SYSTEM.md` (Sections 5, 9–10), `docs/REQUIREMENTS.md` (REQ-GAL-008, REQ-ACC-010).
- **Supersedes / Superseded by:** —
- **Open questions or follow-up:** Client-approved photography replacing the sample hero image; confirmed brand values before production.

### DEC-009 — Hero refinement: overlay fix, icons, typography, motion

- **ID:** DEC-009
- **Title:** Hero refinement: overlay fix, icons, typography, motion
- **Status:** Accepted
- **Date:** 2026-09-12
- **Context:** DEC-008's hero overlay was a purely horizontal gradient, leaving the bottom-right of the photo (bright string-lights area) at only ~0.68 effective darkness — the bottom of the image was clearly visible without adequate overlay. Typography at `--text-display` (3.25rem, weight 400) was thin for Fraunces at display size. The hero entrance used 5 separate `client:load` Reveal islands — functional but scattered (a generic default per the frontend-design skill, which recommends a single orchestrated moment). Icons in the hero were absent; the stat row communicated purely through text.
- **Decision:** Four coordinated refinements to the existing DEC-008 hero:
  1. **Overlay fix:** restructure as `.hero-bg` image layer + two-axis gradient on `::after` (horizontal `90deg` copy scrim + vertical `180deg` bottom fade at 0.9). Mobile single `180deg` to 0.98 at bottom. Base scrim `--color-scrim` unchanged.
  2. **Icons:** extend `HeroStat` with optional `icon` field (`"camera" | "clock" | "qrcode"`); render Lucide-style inline SVGs inside each `<dt>` (24×24, stroke 1.8, round caps, gold `--color-accent-on-dark`, `aria-hidden`); `Hero.astro` defines a frontmatter `heroIconSvg()` helper — no new dependency.
  3. **Typography:** `--text-display` scaled to `clamp(2.75rem, 6vw, 4.25rem)` desktop / `clamp(2.25rem, 11vw, 2.75rem)` mobile; headline weight `400 → 500`, `line-height 1.05`, `letter-spacing -0.015em`; lede `clamp(1.1875rem, 1.6vw, 1.375rem)` with `--color-on-ink-secondary` for clear hierarchy under the H1.
  4. **Animation:** `.hero-bg` slow settle (`scale(1.06 → 1)` over 2.2s, compositor-only transform); copy entrance consolidated to 3 beats (eyebrow+h1 delay .05, lede+CTAs .18, stats .38) — fewer hydrate roots, one orchestrated load moment.
  5. **Scroll indicator:** optional `<a class="hero-scroll">` with gold `ChevronDown` SVG, sr-only label, 44px target, bottom-center; homepage passes `scrollHref="#services-heading"`.
- **Alternatives considered:** 5-line per-element stagger — retained from DEC-008 but rejected here as scattered; 3-beat grouping is more deliberate. Single React `HeroEntrance` island with internal stagger — offered but rejected as disproportionate refactor for the ₱15,000 scope. Adding a leading icon to the primary CTA — rejected (the frontend-design skill flags trailing `→` and arrow chrome as template tells; keeping CTAs clean). Ken-burns parallax on scroll — rejected (adds JS complexity for marginal visual gain).
- **Rationale:** Each refinement addresses a specific, reported issue (overlay bleed, thin typography, scattered motion, missing iconography) within the smallest maintainable change — no new dependencies, no new files, no architectural shift. The overlay fix is a direct correction of DEC-008's gradient; the other three are proportional refinements within the established event-noir system.
- **Consequences:** Hero.astro restructured (`.hero-bg` div, multi-background `::after`, scroll anchor, icon helper); `HeroStat` type extended (backward-compatible `icon?`); tokens.css `--text-display` scaled (hero-only usage confirmed); mock.ts stats carry icon keys; index.astro passes scroll props. All provisional; browser pass still needed to verify the actual photo/contrast.
- **Related documents:** `docs/DECISIONS.md` (DEC-008), `docs/UI-UX.md` (Section 7), `docs/DESIGN-SYSTEM.md` (Sections 5, 10, 29).
- **Supersedes / Superseded by:** —
- **Open questions or follow-up:** Client-approved photography replacing the sample hero image; confirmed brand values before production; browser visual verification of the overlay gradient and icon contrast.

### DEC-010 — Booths section premium refinement: content, card, grid

- **ID:** DEC-010
- **Title:** Booths section premium refinement: content, card, grid
- **Status:** Accepted
- **Date:** 2026-09-12
- **Context:** The client asked to make the "THE BOOTHS" homepage section modern, elegant and premium, with organized/aligned layout, appropriate spacing, improved color/typography hierarchy, and production-ready content. The existing booths section used a plain 3-card grid with `auto-fit minmax(16rem,1fr)` (causing 2+1 orphan at tablet widths), flat dark cards (padded image, plain text badge, no scannable structure), and a SectionHeading lede at `--text-h3` (1.25rem) that matched the card title size — creating a flat typography staircase.
- **Decision:** Four coordinated refinements:
  1. **Content** — `Service` type gains optional `tagline?: string` and `highlights?: string[]` (backward-compatible). All three services rewritten with polished, customer-focused copy aligned to the documented reference direction in `PROJECT.md §7` (no new business claims). Each gets a short italic tagline in Fraunces accent, a refined summary, and 2–3 scannable highlights (gold dot markers).
  2. **Card component** — shared `Card.astro` upgraded: edge-to-edge image (negative margins + `overflow:hidden` card) with slow hover zoom `scale(1.04)`; badge → gold pill chip (uppercase caption, hairline border); tagline support (Fraunces italic); highlights list support (`.card-highlights`); dark surface border refined to gold-tinted hairline `rgba(230,206,138,0.16)` → `0.45` on hover. All props optional — backward-compatible.
  3. **Grid** — booths section uses scoped `.booths-grid`: `1fr` mobile → `repeat(3, minmax(0,1fr))` at `≥1024px` — no orphan, always aligned. The shared `.card-grid` (used by packages/services page) is left unchanged.
  4. **Typography** — `SectionHeading` lede reduced from `--text-h3` (1.25rem) to `--text-body` (1rem) site-wide, creating a clean staircase: eyebrow 0.875 → title 1.5 → lede 1.0 → card title 1.25.
- **Alternatives considered:** Adding tagline/highlights fields to the Service type was the cleanest way to deliver structured content without inventing new business facts (all derived from `PROJECT.md §7` reference direction). A shared `.card-grid` refinement (global 3-col) was considered but rejected as disproportionate scope creep for a section-scoped request. Keeping SectionHeading lede at `--text-h3` would have left the hierarchy flat.
- **Rationale:** Each refinement addresses a specific, reported issue within the smallest maintainable change — no new dependencies, no new files, no architectural shift. The Card changes affect packages and the Services page consistently (both inherit the same premium treatment), which is the correct behavior for a shared component.
- **Consequences:** `types.ts` Service extended (backward-compatible); `mock.ts` services rewritten with new fields; `Card.astro` polished (shared across homepage/packages/services); `SectionHeading.astro` lede scaled down (affects all sections consistently); `index.astro` booths section uses scoped grid + staggered reveals. All content remains provisional/SAMPLE.
- **Related documents:** `docs/DECISIONS.md` (DEC-007), `docs/UI-UX.md` (Section 8), `docs/DESIGN-SYSTEM.md` (Sections 8, 17, 34), `docs/REQUIREMENTS.md` (REQ-SVC-001 through REQ-SVC-006), `docs/PROJECT.md` (Section 7).
- **Supersedes / Superseded by:** —
- **Open questions or follow-up:** Client confirmation of the service content before production; browser visual verification of the card image edge-to-edge treatment, badge pill contrast, and grid alignment at 375/768/1024/1440.

### DEC-011 — Booth card icons and shortened copy

- **ID:** DEC-011
- **Title:** Booth card icons and shortened copy
- **Status:** Accepted
- **Date:** 2026-09-12
- **Context:** After DEC-010's booths-section refinement, the client asked to shorten the booth card copy and add appropriate icons. The three service summaries were 2–3 sentences (~40–55 words), which made the cards content-heavy; the cards had no iconography identifying the booth type.
- **Decision:** Two coordinated refinements, applied to the shared card and both the homepage booths section and the Services page:
  1. **Shortened copy** — `Service.summary` values reduced to a single concise line (~17–22 words each), staying within the documented reference direction in `PROJECT.md §7` (no new business claims). Taglines and 3 highlights per card are retained unchanged.
  2. **Card icons** — `Service` gains optional `icon?: "camera" | "users" | "video"` (backward-compatible). `Card.astro` gains an optional `icon` prop and an inline-SVG helper (Lucide-style, stroke 1.8, round caps, `aria-hidden`), rendering a gold icon chip (2.25rem rounded square) at the top-left of the card body with the badge pill aligned right in a `.card-head` row. Mapping: Premium → Camera, Roaming → Users, 360 Video → Video.
- **Alternatives considered:** Per-highlight semantic icons — offered but rejected (adds content-model complexity for marginal value; the header chip is cleaner). Leaving the Services page bare — rejected for consistency; it now receives `icon`/`tagline`/`highlights` too.
- **Rationale:** Shorter, scannable copy plus a per-booth icon chip delivers the requested result within the smallest maintainable change — no new dependencies, no new files, no architectural shift. The icon chip also gives each booth a distinct visual identity consistent with the hero stats icons.
- **Consequences:** `types.ts` Service extended; `mock.ts` summaries shortened and icons added; `Card.astro` gained icon chip + `.card-head` row (backward-compatible); `index.astro` and `services.astro` pass the new fields. All content remains provisional/SAMPLE.
- **Related documents:** `docs/DECISIONS.md` (DEC-007, DEC-010), `docs/UI-UX.md` (Section 8), `docs/DESIGN-SYSTEM.md` (Sections 17, 34), `docs/REQUIREMENTS.md` (REQ-SVC-001 through REQ-SVC-006), `docs/PROJECT.md` (Section 7).
- **Supersedes / Superseded by:** —
- **Open questions or follow-up:** Client confirmation of the service content before production; browser visual verification of the icon chip contrast and the aligned icon/badge row at 375/768/1024/1440.

### DEC-012 — Site-wide frontend enhancement: deepened "event noir"

- **ID:** DEC-012
- **Title:** Site-wide frontend enhancement: deepened "event noir"
- **Status:** Accepted
- **Date:** 2026-09-16
- **Context:** The client asked to enhance the UI, UX and layout of every public page into a modern, premium feel, frontend-only (no backend, API or database), with complete-feeling content until the CMS is wired. The client explicitly chose to **deepen the incumbent "event noir" world** (keep the espresso/champagne/ivory palette and Fraunces/Inter pairing) rather than replace it, and to render the placeholder content at full production fidelity by **removing the "Sample" / "(sample imagery)" markers**. All brand values remain **Confirmation Required** (`docs/DESIGN-SYSTEM.md` Sections 5–6, 38), and the removed markers touch REQ-GAL-008, REQ-REV-007 and REQ-SVC-004/REQ-PKG-006, which the client overrode for this internal design stage.
- **Decision:** A proportional enhancement pass across tokens, primitives, chrome, content and all ten pages, keeping the documented event-noir identity and required behaviors intact:
  1. **Tokens** — deepen the palette (`--color-ink-deep`, raises), separate the text `--color-accent` from `--color-accent-strong` for AA contrast, add on-ink/on-paper roles, hairline/border-strong tokens, a fluid type scale (`--text-title`, `--text-lead`, tracking/leading tokens), two spacing steps, a 68ch measure, `--content-wide`, `--section-padding`, and a third elevation step. Legacy token names retained.
  2. **Global** — darkroom film-grain layer, themed scrollbars/selection/caret, `.on-dark` / `.on-paper` colour contexts, `.prose`, `.bleed`, refined section rhythm and card/chip primitives.
  3. **Primitives** — `Button` gains `size` and an optional trailing arrow with state polish; `Card` gains media/overlay treatment, check-list inclusions and a refined featured state; `SectionHeading` gains size/align and the champagne rule; `PageHeader` becomes a full-bleed dark band with an optional image.
  4. **Chrome** — sticky header with scroll state, monogram, animated nav underline; a richer footer (Explore / Legal / CTA columns, copyright); mobile nav becomes a full-width dropdown panel.
  5. **New components** — `Accordion` (native `<details>`, works without JS) and `CtaBand` (reusable full-bleed closing CTA).
  6. **Content** — `SiteContent` gains `about`; gallery and testimonials are populated; `sampleTestimonials` is removed; homepage/pages rebuilt with editorial layouts. Contact details, ABN, address and socials remain deliberately unset (no invented business facts).
  7. **Forms** — `InquiryForm` restyled to the new tokens with a responsive two-column field grid; the honest Phase-2 "checked" state is retained (no fake send).
- **Alternatives considered:** Replacing the visual world (cinematic-dark or light-editorial directions) — offered, client chose to deepen the incumbent. Keeping "Sample" markers — offered, client chose full-fidelity placeholder rendering. Adding a lightbox island or category filters — rejected (no categories are defined, REQ-GAL-007; lightbox remains optional per `docs/DESIGN-SYSTEM.md` Section 20). Marquee/looping motion — rejected (design-system Section 29 forbids looping effects). New dependencies — none added.
- **Rationale:** Delivers the requested modern/premium result within the ₱15,000 scope by deepening the existing system rather than restarting it; keeps required semantics, accessibility, reduced-motion and empty-state behavior; leaves one `getContent()` swap point for CMS content. The marker removal is an explicit client instruction recorded here so it is not mistaken for a compliance decision.
- **Consequences:** Tokens, theme mirrors, all components, all pages and the content seam change together; `about` and populated `gallery`/`testimonials` are now CMS-editable content areas (candidate area "general website content" per REQ-CON-002, exact fields still Confirmation Required). **Because the markers were removed, any deployment containing this content is internal-only and must not be public until real, client-approved imagery, testimonials and legal copy replace the placeholders.** No backend, persistence, sitemap/`site`/canonicals or integrations are activated.
- **Related documents:** `docs/DECISIONS.md` (DEC-006 through DEC-011), `docs/DESIGN-SYSTEM.md` (Sections 5–12, 20, 29, 38), `docs/UI-UX.md` (Sections 7–14, 19, 21), `docs/REQUIREMENTS.md` (REQ-GAL-001/005/007/008, REQ-REV-007, REQ-SVC-004, REQ-NAV-006), `docs/DATA-MODEL.md` (Sections 5–6).
- **Supersedes / Superseded by:** Refines DEC-006 through DEC-011; does not supersede them.
- **Open questions or follow-up:** Client confirmation of palette/fonts, service/package/about copy, gallery imagery, testimonials and legal content before production; restore or replace the sample markers if this build is ever published publicly; CMS confirmation before Phase 3 wiring; browser verification of the full pass at 375/768/1024/1440 (not performed by tooling in this environment).

### DEC-013 — SSR-safe island styling via token-backed CSS

- **ID:** DEC-013
- **Title:** SSR-safe island styling via token-backed CSS
- **Status:** Accepted
- **Date:** 2026-09-16
- **Context:** The inquiry-form and mobile-navigation islands were styled exclusively with styled-components. The shipped HTML for `/contact` contained the generated class names (`sc-*`) but no matching CSS: there were no `data-styled` style tags and no `.sc-*` selectors in the HTML or in `dist/_astro/*.css`. The rules were injected only when each island hydrated on the client, and because both islands use `client:visible`/`client:media`, the form (and the nav trigger) rendered as **unstyled HTML** until hydration; with `prefers-reduced-motion` the `.reveal` guard exposed the unstyled form immediately. DEC-003 established styled-components for islands and already noted an SSR interop failure; this is the same class of problem surfacing as an unstyled first paint.
- **Decision:** Move island styling from styled-components to plain, token-backed CSS. `src/components/islands/InquiryForm.tsx` and `src/components/islands/MobileNav.tsx` now use stable class names (`iq-*`, `mn-*`) styled by `src/styles/inquiry-form.css` (imported by `contact.astro`) and `src/styles/mobile-nav.css` (imported by `BaseLayout.astro`). All values reference `styles/tokens.css`; two translucent washes use `color-mix()` with solid fallbacks. The form card is no longer wrapped in the `Reveal` island, so the primary form renders and is styled without depending on JavaScript. React Hook Form, Zod, Motion, Lucide React, and all validation/state behavior are unchanged. styled-components remains a selected technology and `src/lib/theme.ts` is retained for future use (for example CMS UI), but no current island depends on it.
- **Alternatives considered:** Configuring styled-components SSR (SWC plugin plus style serialization) — rejected as a new build dependency and added complexity for two small islands when the project already maintains a token-based CSS system; switching to `client:load` to shrink the unstyled window — rejected because it fixes neither server rendering nor the no-JS case. Adding leading field icons or other decorative chrome — rejected per `docs/DESIGN-SYSTEM.md` Section 16 (clarity over decorative styling).
- **Rationale:** Token-backed CSS is server-rendered with no new dependency, removes the flash of unstyled form, keeps one styling source of truth (the design tokens), and fits the Astro-first, minimal-JavaScript architecture.
- **Consequences:** Island CSS now ships in render-blocking head stylesheets (`contact.*.css`, `BaseLayout.*.css`); `docs/TECH-STACK.md` Section 6 wording is clarified; styled-components is currently unused by application code but retained; the form is styled with or without JavaScript (interactive validation still requires it).
- **Related documents:** `docs/DECISIONS.md` (DEC-003), `docs/TECH-STACK.md` (Section 6), `docs/DESIGN-SYSTEM.md` (Sections 15–16, 33, 35), `docs/UI-UX.md` (Sections 13–14), `docs/ARCHITECTURE.md` (Sections 3.2, 6).
- **Supersedes / Superseded by:** Clarifies DEC-003's island-styling convention; does not supersede DEC-003 (already Superseded by DEC-005).
- **Open questions or follow-up:** None. CMS island styling (Phase 3) should follow the same token-backed CSS approach unless a future decision records otherwise.

Future records are appended here in ID order with status and date kept current.

### DEC-014 — Homepage refinement: gallery lightbox, reviews marquee, step icons, floating Messenger CTA

- **ID:** DEC-014
- **Title:** Homepage refinement: gallery lightbox, reviews marquee, step icons, floating Messenger CTA
- **Status:** Accepted
- **Date:** 2026-09-16
- **Context:** The client requested a homepage enhancement pass: (1) every gallery image clickable into a full-size viewer; (2) the popular package highlighted more strongly; (3) icons in the "How it works" steps; (4) the Reviews section rebuilt as a clean, modern, equal-height card row with an infinite horizontal scroll, each card carrying name, event, star rating and a quote mark; (5) a floating bottom-right Messenger button; and (6) elegant, premium animation and transition work across the page (explicitly marked important). Four of these collide with documented positions: `docs/DESIGN-SYSTEM.md` Section 29 and DEC-012 both **rejected** looping motion ("no auto-playing, looping, or attention-seeking effects"), DEC-012 rejected a lightbox island as out of scope (lightbox remains "optional" per DESIGN-SYSTEM Section 20), REQ-REV-007 / `docs/DATA-MODEL.md` Section 5.6 forbid displaying unverified reviews or ratings, and no Messenger integration or URL exists anywhere in the docs. `docs/REQUIREMENTS.md` gallery requirements (REQ-GAL-001/003/005/008) and the empty-state rule are unaffected.
- **Decision:** Implement all six items, with the client confirming the overrides and the missing data:
  1. **Gallery lightbox.** `src/components/islands/GalleryLightbox.tsx` (React + Motion + Lucide) is a progressive-enhancement island: every gallery image is a server-rendered `<a data-lightbox href>` (`src/components/GalleryTrigger.astro`) that opens the full image on its own, and the island upgrades the click into an accessible dialog — focus moves in and returns to the invoking image, Escape closes, ArrowLeft/ArrowRight and Home/End navigate, focus is trapped, body scroll is locked, and a live counter plus caption are exposed. Applied to the homepage showcase and the `/gallery` grid. Styles live in `src/styles/gallery-lightbox.css` (token-backed, DEC-013 convention).
  2. **Featured package.** `src/components/Card.astro` gives `card--featured` a champagne ring, a top hairline, an interior spotlight, a solid champagne badge with a star, and a desktop lift that separates it from the row.
  3. **Step icons.** `ProcessStep` gains an optional presentational `icon` field; the homepage renders authored inline SVGs for MessageSquare / Palette / Sparkles, plus a hover draw of the champagne rule.
  4. **Reviews marquee.** `src/components/ReviewsMarquee.astro` replaces the static review grid with an equal-height, CSS-driven `translate3d` marquee (two copies, edge mask, hover/focus pause, and a CSS-only Pause/Play control so WCAG 2.2.2 has a pause mechanism without JavaScript). Under `prefers-reduced-motion` the row becomes a normal horizontally scrollable, snap-aligned list with the clone removed. This **supersedes DEC-012's rejection of marquee/looping motion for this surface only**; DESIGN-SYSTEM Section 29 still governs elsewhere.
  5. **Ratings.** `Testimonial` gains an optional `rating`, provisioned as placeholder content. Stars render only when `rating` is present; the requirement to never display unverified ratings (REQ-REV-007) is unchanged and still binds production content.
  6. **Messenger CTA.** `src/components/FloatingMessenger.astro` (site-wide via `BaseLayout`) is an external icon-only link labelled for screen readers and `rel="noopener noreferrer"`; `MobileNav` now sets `html[data-menu-open]` so the button yields while the mobile panel is open. The destination is a **placeholder** `https://m.me/` that must be replaced with the client's Facebook Page username before production.
  7. **Motion.** `Reveal` gains a `variant` (`rise` / `blur` / `mask` / `scale`) so sections stop sharing one identical entrance; the no-JS and reduced-motion guards in `global.css` were extended to `filter` and `clip-path` because Motion server-renders initial styles inline.
- **Alternatives considered:** Implementing the marquee without recording the override — rejected (would leave the docs contradicting the code); a decorative fixed five-star row — rejected (implies a rating without data); skipping the star icons entirely — offered and declined by the client; linking the floating button to `/contact` — offered and declined in favour of the Messenger placeholder; a JS pause toggle for the marquee — rejected in favour of a CSS-only checkbox so the section needs no island; a shared icon component — rejected for now (the inline helper matches the existing `Hero.astro` / `Card.astro` convention and the change stays small). No new dependencies.
- **Rationale:** The client owns the visual direction and explicitly authorised the motion and the placeholder content for this internal design stage, in the same way DEC-012 removed the "Sample" markers. Recording the decisions keeps `docs/DECISIONS.md` authoritative and prevents the marquee, lightbox and placeholder Messenger URL from being mistaken for confirmed production behavior. Progressively enhanced links and the server-rendered grid mean the gallery, reviews content and CTA all remain usable without JavaScript, preserving the Astro-first architecture.
- **Consequences:** Homepage and `/gallery` now ship one small React island (`client:idle`) each; `BaseLayout` imports `gallery-lightbox.css` and renders the floating CTA on every page; `Testimonial`/`ProcessStep` gained optional fields; the Reviews section is no longer a static grid. All imagery, quotes, ratings and the Messenger URL remain **Confirmation Required** placeholder content and the build stays internal-only until replaced. `docs/DESIGN-SYSTEM.md` Section 29's looping-motion prohibition is now a documented exception for the reviews marquee rather than an absolute rule.
- **Related documents:** `docs/DECISIONS.md` (DEC-012, DEC-013), `docs/DESIGN-SYSTEM.md` (Sections 12, 17, 20, 28–29, 32), `docs/UI-UX.md` (Section 10, 19), `docs/REQUIREMENTS.md` (REQ-GAL-001/003/005/008, REQ-REV-007, REQ-ACC-009/010/011), `docs/DATA-MODEL.md` (Section 5.6), `docs/ARCHITECTURE.md` (Section 8).
- **Supersedes / Superseded by:** Supersedes DEC-012's rejection of marquee/looping motion for the reviews surface only; does not supersede DEC-012 as a whole. Superseded by: none.
- **Open questions or follow-up:** Client confirmation of the Facebook Page username for the Messenger URL; approved testimonials with verified ratings; replacement of all placeholder imagery and quotes before production; visual browser verification at 375 / 768 / 1024 / 1440 (not performed in this environment).

### DEC-015 — Homepage pass 2: no light panels, premium cards, motion

- **ID:** DEC-015
- **Title:** Homepage pass 2: no light panels, premium cards, motion
- **Status:** Accepted
- **Date:** 2026-09-16
- **Context:** A second homepage enhancement round asked for: an icon in "The Experience" section; removal of the light `.panel-print` containers from the gallery and reviews sections; a more premium, elegant review card; removal of the marquee Pause/Play button; a smooth open/close transition on the accordion; and icons on the "Perfect for" event chips. Two of these override DEC-014: the Pause/Play control (added there to satisfy WCAG 2.2.2) is removed, and the light-print panel treatment is dropped from the homepage.
- **Decision:**
  1. **Experience icons.** The homepage intro's three promise items each gain a champagne icon chip (clock, QR code, team), matching the `step-icon` / `service-icon` treatment. The eyebrow itself carries no icon.
  2. **No light panels.** The `.panel-print` wrapper is removed from the showcase and reviews sections; both are now `on-dark` on the homepage canvas, and the now-unused `.panel-print` rules were deleted from `src/styles/global.css`.
  3. **Premium review cards.** `.rm-card` is restyled with a dark espresso-glass gradient, a champagne top hairline, gold stars and quote mark, a ringed initials avatar, and a larger Fraunces quote with a hover lift. A `light` variant is retained for reuse via the new `tone` prop on `ReviewsMarquee`.
  4. **Pause/Play removed.** The marquee checkbox/label control and its CSS are removed. Auto-scroll still pauses on hover and on keyboard focus, and becomes a static `scroll-snap` list under `prefers-reduced-motion`. To keep a keyboard-reachable pause, the marquee region is now focusable (`tabindex="0"`, `role="group"`, labelled). Residual WCAG 2.2.2 consideration: with the visible control gone the pause mechanism is hover, keyboard focus, and reduced-motion; a visible control can be restored later if required.
  5. **Smooth accordion.** `Accordion.astro` keeps native `<details>` (works without JS) and adds a small progressive-enhancement script that animates the answer height open/closed (340ms, no-bounce easing). Answer content is wrapped in `.accordion__answer-inner` so padding does not leak while collapsed. Reduced-motion users keep the instant native toggle.
  6. **Event-type icons.** The "Perfect for" chips gain presentational icons from an `index.astro` map keyed by label, with a sparkles fallback. The content seam is unchanged: `eventTypes` remains a plain string list.
- **Alternatives considered:** Keeping the light panels — declined by the client. Keeping a visible Pause/Play control — declined by the client (keyboard-focus pause is the mitigation). A CSS-only `::details-content` height transition — rejected for cross-browser variance in favour of the small script plus native fallback. Changing `eventTypes` to objects for icons — rejected to keep the CMS seam a simple string list.
- **Rationale:** Follows the client's direction while preserving the documented accessibility fallbacks (hover/focus pause, reduced-motion, native details) and the single content seam.
- **Consequences:** The homepage renders entirely on the dark "event noir" canvas; `.panel-print` is no longer part of the system; `ReviewsMarquee` gains a `tone` prop; `Accordion` ships a small inline script. Images, quotes, ratings, and the Messenger URL remain **Confirmation Required** placeholder content.
- **Related documents:** `docs/DECISIONS.md` (DEC-007, DEC-012, DEC-013, DEC-014), `docs/DESIGN-SYSTEM.md` (Sections 17, 29, 33), `docs/UI-UX.md` (Sections 7, 12), `docs/REQUIREMENTS.md` (REQ-REV-007, REQ-GAL-008, REQ-ACC-009/010/011).
- **Supersedes / Superseded by:** Supersedes DEC-014's Pause/Play control decision (the control is removed); retains DEC-014's other decisions.
- **Open questions or follow-up:** Client confirmation of testimonials and verified ratings; visual browser verification of the dark review cards, the accordion motion, and the icon chips at 375 / 768 / 1024 / 1440; decide whether a visible marquee pause control is required for WCAG 2.2.2.

### DEC-016 — SEO technical foundation: domain, canonicals, sitemap, structured data

- **ID:** DEC-016
- **Title:** SEO technical foundation: domain, canonicals, sitemap, structured data
- **Status:** Accepted
- **Date:** 2026-09-16
- **Context:** REQ-SEO-008/009/010/011 require canonical URLs, an XML sitemap, robots.txt and Schema.org JSON-LD; REQ-SEO-003/004/018 require unique metadata and Search Console readiness; REQ-SEO-012 (Should) requires Open Graph/social metadata. DEC-001 deliberately deferred `site`, the sitemap integration and canonicals until the production domain was confirmed, so the repository had unique titles/descriptions and a `robots.txt` but no canonicals, no sitemap, no JSON-LD, and no Open Graph URL/locale/image. The client confirmed the production domain `melbournephotoboothhire.com.au` and asked for the SEO foundation to be completed and for deployment via Vercel + Namecheap.
- **Decision:**
  1. **Domain.** `astro.config.mjs` sets `site: "https://melbournephotoboothhire.com.au"` as the single source for canonical, Open Graph and sitemap URLs. `trailingSlash: "never"` keeps canonicals, internal links and the sitemap consistent with Vercel's default no-trailing-slash behaviour (the sitemap integration reads the same setting).
  2. **Sitemap.** Add the selected `@astrojs/sitemap` integration; the build emits `/sitemap-index.xml` + `/sitemap-0.xml` (404 excluded), and `public/robots.txt` points to the index and disallows `/admin/` and `/api/`.
  3. **Metadata.** `BaseLayout` now emits a normalised self-referencing canonical, `robots` (`index, follow, max-image-preview:large`; the 404 page uses `noindex, follow`), `og:url`, `og:locale` (`en_AU`), `og:image`/`twitter:image` (defaulting to the current hero image placeholder, overridable per page), `twitter:card`, `twitter:title`/`twitter:description`, and a `google-site-verification` meta driven by an optional `PUBLIC_GOOGLE_SITE_VERIFICATION` environment value. Page titles/descriptions were rewritten keyword-first while staying factual.
  4. **Structured data.** New `src/components/StructuredData.astro` renders JSON-LD (with `<` escaped). `BaseLayout` emits a site graph of `Organization` + `WebSite` + `WebPage` (brand, production URL, Melbourne `areaServed`, page title/description) and accepts additional per-page nodes for later confirmed content.
  5. **Gated schema.** `LocalBusiness`/NAP enrichment, `FAQPage` (REQ-FAQ-005 forbids placeholder Q&A) and `Review`/`AggregateRating` (REQ-REV-007 forbids unverified ratings) are deliberately **not** emitted; they are added only when the client confirms those facts.
- **Alternatives considered:** Waiting until Phase 6 deployment to add `site`/sitemap/canonicals — rejected; the domain is confirmed and the client asked for the SEO foundation now. HTML meta-tag-only Search Console verification — rejected in favour of a config-only env value plus the domain-property DNS option documented in `docs/DEPLOYMENT.md`. Baking placeholder business data (address, phone, price, socials) into structured data — rejected (invented facts per `AGENTS.md`; `docs/DEPLOYMENT.md` Section 14). Adding `@astrojs/sitemap` is not a new technology decision; it is a selected stack item (`docs/TECH-STACK.md` Section 18).
- **Rationale:** Completes the must-have technical SEO surface (canonical, sitemap, robots, structured data, social metadata, Search Console readiness) inside the existing Astro-first architecture, with no new runtime dependency beyond the already-selected sitemap integration, and keeps unconfirmed business facts out of structured data.
- **Consequences:** Canonical, sitemap and Open Graph URLs now depend on the confirmed domain; `npm run build` emits the sitemap files; social platforms and Search Console read the production domain. All page-level content, imagery and the default social image remain **Confirmation Required** placeholders, so schema enrichment and any public launch still depend on client-approved content (DEC-012).
- **Related documents:** `docs/REQUIREMENTS.md` (Section 13), `docs/ARCHITECTURE.md` (Section 18), `docs/TECH-STACK.md` (Section 18), `docs/DEPLOYMENT.md` (Sections 5, 12–15), `docs/DECISIONS.md` (DEC-001).
- **Supersedes / Superseded by:** Clarifies DEC-001's deferral of `site`/sitemap/canonicals; does not supersede DEC-001.
- **Open questions or follow-up:** Client confirmation of NAP/contact details, social profiles and the Google Business Profile review URL (enables `LocalBusiness`, `sameAs` and the review CTA); confirmed FAQ/testimonial content (enables `FAQPage`/`Review`); client-approved imagery to replace the placeholder social image; Search Console verification performed at deployment.

### DEC-017 — CMS frontend: Astro admin routes with local mock store

- **ID:** DEC-017
- **Title:** CMS frontend: Astro admin routes with local mock store
- **Status:** Accepted
- **Date:** 2026-09-22
- **Context:** The task requires a frontend-only CMS that mirrors the public website content, with no backend, database, auth, or Supabase. Docs leave the admin UI composition, exact modules, and routing open (REQ-CMS-012, REQ-CON-002), while deciding `/admin/` route exclusion, token-backed CSS (DEC-013), RHF + Zod forms, and the `ContentSource` public seam (DEC-003). Per-page SEO fields are task-required but modeled nowhere in the docs.
- **Decision:**
  1. **Routes.** Astro multi-route admin under `/admin/` (dashboard at `/admin`, one route per section). Real URLs suit the documented one-content-area-at-a-time UX and future server-side auth. Admin routes are excluded from the sitemap via a filter in `astro.config.mjs`, disallowed in `public/robots.txt`, and carry `noindex, nofollow`.
  2. **Data layer.** New `src/lib/cms/` module: page-organized `CmsContent` model reusing public entity types, per-section Zod schemas, and a `CmsRepository` interface (`load`/`saveSection`/`resetSection`) with a localStorage-backed mock. Seed values mirror rendered public content verbatim; the public site is untouched and does not read this model yet. Per-page `seoTitle`/`seoDescription`/`ogImage` live in the CMS model only.
  3. **Editing UX.** React Hook Form + the shared `zodResolver` per section, repeatable editors with add/duplicate/remove/up-down reorder, dirty tracking with a leave guard, per-section save/discard/reset, and localStorage persistence. A standalone sign-in page at `/admin/login` is routed and styled for the future auth flow; with no backend it never fakes a signed-in state, explaining that sign-in is not connected and linking to the dashboard. `/admin` remains directly reachable until real auth gates it server-side in Phase 3.
  4. **Scope.** Dashboard (inquiry summary cards, latest inquiries, content-freshness table), Home, Services, Packages, Gallery, About, FAQ, Contact, Site Settings, and a read-only Inquiries list at `/admin/inquiries` backed by a mock `AdminInquirySource` shaped like the future backend API. Testimonials live under Home (their only render surface). Privacy/terms stay code-managed. Nav labels and enquiry-form internals stay code.
- **Alternatives considered:** Single React SPA shell at `/admin` — rejected; contradicts the Astro-first direction and complicates future route-level auth for no proportional gain. Wiring public pages to the CMS store now — rejected; the task forbids changing public-page content and wiring is the documented Phase 4 job. Extending the public `ContentSource` seam with writes — rejected; the seam is the public read boundary and callers must never change.
- **Rationale:** Smallest architecture satisfying the frontend-only CMS scope inside existing conventions, with the repository interface shaped like the future backend API so Phase 3/4 replaces the store without touching editors.
- **Consequences:** `src/pages/admin/*`, `src/components/admin/*`, `src/lib/cms/*` and `src/styles/admin.css` are new; `astro.config.mjs` gains the sitemap filter. Saves persist per-browser only. Provisional content is flagged on the dashboard, not in the model.
- **Related documents:** `docs/REQUIREMENTS.md` (REQ-CMS-001..013, REQ-CON-001..005), `docs/ROADMAP.md` (Phases 2-4), `docs/ARCHITECTURE.md` (Astro-first, ContentSource seam), `docs/UI-UX.md` (admin flows), `docs/DESIGN-SYSTEM.md` (Section 26 admin system), `docs/DATA-MODEL.md` (CMS modules Confirmation Required).
- **Supersedes / Superseded by:** —
- **Open questions or follow-up:** Supabase adapter replacing the mock repository and inquiry source (Phase 3), including server-side auth gating `/admin` behind the existing `/admin/login` flow; wiring confirmed content into public rendering per surface (Phase 4); client confirmation of prices, testimonials, imagery, review/Messenger links and socials.

### DEC-018 — CMS split: page CMS vs item modules, highlights, uploads, echo

- **ID:** DEC-018
- **Title:** CMS split: page-level CMS vs dedicated item modules with highlights, file uploads and a public echo
- **Status:** Accepted
- **Date:** 2026-09-23
- **Context:** The frontend-only CMS stored reusable Services/Packages/Gallery/FAQ items inside page sections, images were remote URL strings, inquiries were read-only, and saved admin state never reached public pages. The task requires dedicated modules with CRUD + Highlight On/Off, real file uploads, package badges (Basic/Most Popular/Best Value/custom), inquiry detail/response/delete, and homepage sections driven by highlighted module items — still with no backend.
- **Decision:**
  1. **Data split.** `CmsContent.pages` holds page-level copy only; `CmsContent.modules` holds the four item collections with `highlight` flags, package `badgeType`/`customBadge`, and file-backed `CmsImage` values. All current content is seeded into modules (every item highlight ON, badge strings mapped) so the seeded render matches the public site. The public seam builds `SiteContent` from the modules (`cmsSource`), so modules are the source of truth at build as well as in the admin.
  2. **Uploads without a backend.** New `src/lib/cms/images.ts`: IndexedDB blob store (PNG/JPEG/WebP, 2 MB cap), preview via object URLs, replace/remove, and garbage collection against the previous saved section. Zero new dependencies.
  3. **Public echo.** A single `CmsEcho` island on the five module-consuming public pages applies saved admin state after first paint (highlight visibility, badge text + Most-Popular featured treatment, uploaded image sources). SSR renders the build-time snapshot, so crawlable content is preserved; the echo is idempotent when nothing was saved. Homepage sections render highlighted module items (services, packages, gallery showcase, first-4 FAQs).
  4. **Inquiries.** Clickable rows open a detail view (full record), Respond to Email uses the Gmail compose deep link with the sender prefilled, Delete runs a confirmation step and updates the list in place; deletions persist per browser.
  5. **Navigation.** Sidebar groups exactly as specified: Website CMS (Homepage, Services Page, Packages, Gallery, About, FAQ, Contact) and Modules (Services, Packages, Gallery, FAQs); module routes live under `/admin/modules/*`.
- **Alternatives considered:** Server-rendered wiring of admin state into public pages — rejected; no backend exists and the site builds statically, so per-browser echo is the truthful minimum. Blob URLs in localStorage instead of IndexedDB — rejected; quota too small for real image files. A second homepage copy of module items — rejected; the requirement forbids it and the echo reads the modules directly.
- **Rationale:** Smallest architecture that satisfies the module/highlight/upload/badge/inquiry requirements inside the established conventions, with every interface (repository, image store, inquiry source) shaped like its future backend API.
- **Consequences:** Admin state (edits, uploads, deletions) persists per browser only; uploaded and edited content appears on public pages in the editing browser until the Phase 3 backend. Seed badge labels normalize to canonical display text ("Most Popular", "Best Value").
- **Related documents:** `docs/REQUIREMENTS.md` (REQ-CMS, REQ-CON), `docs/ROADMAP.md` (Phases 2-4), `docs/ARCHITECTURE.md` (Astro-first), `docs/DATA-MODEL.md`, DEC-017 (superseded in part).
- **Supersedes / Superseded by:** Partially supersedes DEC-017 (standalone-CMS data model, read-only inquiries, URL-based images).
- **Open questions or follow-up:** Supabase adapter (Phase 3) for content, images, inquiries and auth; client confirmation of all provisional content.

### DEC-019 — Modules list-and-detail UX plus seed/schema save-blocker fixes

- **ID:** DEC-019
- **Title:** Consistent list/detail/add/edit UX for the four item modules, with two pre-existing save blockers fixed
- **Status:** Accepted
- **Date:** 2026-09-24
- **Context:** The four item modules (Services, Packages, Gallery, FAQs) used an all-items-expanded bulk editor with one shared save bar. The task requires a consistent list-and-detail pattern per module: list with Add button at top, clickable rows opening a read-only detail with Edit/Delete, per-item create/edit forms with real file uploads, and confirmed deletes, while preserving Highlight flags, package badges (Most Popular featured treatment), homepage echo behavior and the separate inquiries area. Switching to per-item saves exposed two pre-existing defects that made saving seeded items impossible: (1) the services seed built `image.src` from whole image objects instead of their URL strings (a `??`/`?.` precedence mistake hidden by an `as` cast), which also rendered `src="[object Object]"` on public pages; (2) the packages schema required non-empty `customBadge` for every item while the seed stores `""` for non-custom badges and the form only shows the field for custom badges.
- **Decision:**
  1. **UX.** Each module editor is a state machine inside its existing `/admin/modules/*` island (same approach as the inquiries view, no new routes): list table with title plus Highlight state and the specified Add label (Add Service, Add Package, Add Gallery, Add FAQ) at the top; clickable keyboard-accessible rows opening a read-only detail (full fields, image preview, Highlight status, resolved badge text for packages) with Edit and Delete actions; create/edit forms reusing the existing field primitives and file-upload control with single-item Zod validation; delete guarded by `window.confirm` and a last-item guard on Services/Packages (the collections require at least one). Move/duplicate/reorder and whole-module reset were dropped as unrequired by the task. A small shared `ModuleCrud` helper (list hook, highlight pill, detail rows, image preview) keeps the four modules consistent.
  2. **Seed fix.** The services seed now reads `?.src` on each image branch, so `image.src` is always a URL string; the masking `as` cast was removed.
  3. **Schema fix.** Package `customBadge` is a plain capped string, required only when `badgeType` is `custom` via the existing `superRefine` (message and error path unchanged), matching the conditional form field and the seeded `""` values.
- **Alternatives considered:** Nested Astro routes per item (`/modules/services/[id]`, `/new`, `/edit`) — rejected; more files and param plumbing for no user benefit in a frontend-only admin, and it would break the preserved nav context. Normalizing blank `customBadge` values at save time instead of fixing the schema — rejected; it would write invented data to satisfy an over-strict rule whose real intent is already encoded in the `superRefine`.
- **Rationale:** Smallest change meeting the specified interaction pattern inside established conventions (no new dependencies, token CSS only, existing repository/image/validation seams untouched in shape).
- **Consequences:** The bulk `useModuleEditor` hook is removed (page editors keep using their own hook and shared form components). Per-item saves persist whole sections through the existing repository, so blob garbage collection and the public echo keep working. All 23 seeded module items now pass their element schemas, and public service imagery renders real URLs again.
- **Related documents:** `docs/REQUIREMENTS.md` (REQ-CMS, REQ-CON), `docs/ROADMAP.md` (Phase 2), `docs/ARCHITECTURE.md` (Astro-first, admin islands), `docs/DATA-MODEL.md`, DEC-018.
- **Supersedes / Superseded by:** Extends DEC-018 (module editors interaction pattern only; data model unchanged).
- **Open questions or follow-up:** Supabase adapter (Phase 3); client confirmation of all provisional content; real-browser pass of the new CRUD flows at mobile/desktop widths.

### DEC-020 — Required service badges with Most Popular highlight

- **ID:** DEC-020
- **Title:** Service badges become required dropdown badges with a Most Popular featured treatment
- **Status:** Accepted
- **Date:** 2026-09-24
- **Context:** Service badges were optional free text, so a service could render with no badge and there was no way to mark a headliner service. The requirement is a required badge per service (Basic, Most Popular, Best Value, or custom text) with the Most Popular service rendering a distinct highlighted card on public pages. Packages already implement exactly this badge model with a Most Popular featured treatment.
- **Decision:**
  1. **Model.** `ServiceItem.badge?: string` becomes required `badgeType` (`basic` | `most-popular` | `best-value` | `custom`, no bare option) plus `customBadge`, mirroring the packages model, with a `serviceBadgeText()` display resolver. The public `Service` contract gains `featured` (true only for Most Popular), resolved in `cmsSource` alongside the badge text.
  2. **Seed.** Existing mock labels are preserved as custom badges ("Most booked", "Fan favourite"); the one badgeless service (360 Video Booth) seeds as Basic.
  3. **Saved data.** Pre-change per-browser saves are migrated on load in the repository (text becomes a custom badge, missing text becomes Basic); nothing is discarded.
  4. **Admin.** The services form uses a required badge dropdown with a conditional custom-text field (same options and guard messages as packages); new services default to Basic. List and detail show the resolved badge text and the featured-card state.
  5. **Public.** The homepage passes `featured` into the existing service `Card`, reusing the packages Most Popular treatment verbatim (featured dark card, star, champagne hairline; no new CSS). Services-page sections gain a `service--featured` class whose badge pill reuses the featured champagne fill. `CmsEcho` resolves service badge/featured from `badgeType` and applies them to homepage cards and services-page pills client-side.
- **Alternatives considered:** A service-only badge vocabulary distinct from packages — rejected; two parallel badge systems for no user benefit. A bespoke highlight style for services instead of reusing the packages treatment — rejected per the confirmed requirement to reuse it.
- **Rationale:** Smallest change satisfying the requirement by extending the proven packages pattern; no new dependencies, routes, or design tokens.
- **Consequences:** Services always render a badge on public pages. Setting a service to Most Popular highlights its homepage card and its services-page section at build and, after an admin save, via the echo.
- **Related documents:** `docs/REQUIREMENTS.md` (REQ-CMS, REQ-CON), `docs/ARCHITECTURE.md` (Astro-first, admin islands), `docs/DATA-MODEL.md`, DEC-018, DEC-019.
- **Supersedes / Superseded by:** Extends DEC-018/DEC-019 (services badge shape only).
- **Open questions or follow-up:** Supabase adapter (Phase 3); client confirmation of all provisional content including badge assignments.

### DEC-021 — Dedicated SEO module with per-page metadata

- **ID:** DEC-021
- **Title:** SEO leaves Website CMS for a dedicated module editing per-page metadata
- **Status:** Accepted
- **Date:** 2026-09-24
- **Context:** Every Website CMS page form carried an SEO group editing `seoTitle`/`seoDescription`/`ogImage`, but no public page consumed that data (pages render hardcoded head values), so saved SEO edits never reached the site and SEO concerns were mixed into content forms. The requirement is a dedicated top-level SEO module covering all indexable pages with per-page titles, descriptions, keywords, canonicals, OG/Twitter metadata, index/follow controls, upload-backed imagery, a search preview and character guidance, reusing the existing head architecture.
- **Decision:**
  1. **Store.** The existing per-page `PageMeta` is extended with planning-only `keywords` (never rendered, no `meta keywords` tag), optional `canonicalUrl` override, `ogTitle`/`ogDescription` overrides and `noindex`/`nofollow` flags, all defaulted so older saves validate unchanged. Privacy/Terms gain SEO-only `seo-privacy`/`seo-terms` sections seeded from their current head values. The 404 stays code-managed `noindex` and outside the module.
  2. **Admin.** New top-level SEO sidebar group with `/admin/seo`, following the module list/detail pattern: page list (path, title, indexing state) opening a per-page form with SERP preview and non-blocking character counts (title 50-60, description 150-160). OG/Twitter images reuse the upload control; Twitter cards mirror OG values and OG URL/type stay derived, shown as read-only notes. The `SeoGroup` is removed from all Website CMS forms (and deleted) so SEO is edited in exactly one place.
  3. **Public.** `BaseLayout` gains optional `canonicalUrl`, `nofollow`, `ogTitle`, `ogDescription` and `ogImageAlt` props; robots is fully derived from the toggles with existing strings preserved. All nine pages resolve their SEO through a `getPageSeo` helper with the current hardcoded strings as fallbacks, so build output is unchanged until an admin saves.
- **Alternatives considered:** A parallel SEO-only store section per page — rejected; it would duplicate the existing `PageMeta` data and need migration. Separate Twitter title/description fields — rejected; the architecture derives them and duplication invites divergence. Editable OG type/locale — rejected; fixed by the implementation.
- **Rationale:** Smallest change that makes saved SEO edits reach public pages inside the established seams (repository sections, upload store, head layout), with zero migration and byte-identical output until first save.
- **Consequences:** Uploaded OG images resolve at build only via remote `src` until the Phase 3 backend serves stored blobs to SSR. Sitemap, robots.txt, JSON-LD and page content are untouched.
- **Related documents:** `docs/REQUIREMENTS.md` (REQ-SEO), `docs/ARCHITECTURE.md` (Astro-first, admin islands), `docs/DATA-MODEL.md`, DEC-016 (SEO foundation), DEC-018.
- **Supersedes / Superseded by:** — (extends DEC-016/DEC-018 interaction only).
- **Open questions or follow-up:** Supabase adapter (Phase 3), including server-side OG image resolution; client confirmation of all provisional SEO content.

### DEC-022 — SweetAlert2 as the standard admin alert system

- **ID:** DEC-022
- **Title:** Centralized SweetAlert2 modals replace browser-native dialogs across the admin
- **Status:** Accepted
- **Date:** 2026-09-24
- **Context:** Admin destructive actions used `window.confirm` in sixteen places (item deletes, sub-item removes, image removal had none, discard/reset) with inconsistent wording, while operational results used inline notices. The requirement is one consistent modal system with explicit delete confirmations, success feedback, human-readable errors and no native dialogs.
- **Decision:**
  1. **Dependency.** `sweetalert2` added via npm (single allowed addition). A single `src/components/admin/alerts.ts` helper owns all configurations: destructive warning confirms (focus starts on Cancel), discard/reset confirms, auto-dismissing centered success modals and error modals. A shared base guarantees `position: "center"` with the backdrop enabled for every dialog, rendering above all admin layers. SweetAlert2 loads lazily per call, code-split into its own chunk, so islands stay SSR-safe. Buttons reuse the admin `ad-button` classes plus one destructive variant; the popup follows the admin type scale.
  2. **Confirmations** for deletes, sub-item removes, image removal, unsaved-changes discard and section reset. No pre-confirmation before routine create/save (reversible, re-editable content) and none for navigation or harmless interactions.
  3. **Feedback split.** Operational outcomes (save/create/delete success and failure) go through SweetAlert2 toasts and error modals; form-validation summaries stay inline and untouched. Error modals carry human-readable text only, never raw errors. The existing `beforeunload` leave guard is preserved unchanged.
- **Alternatives considered:** Confirm-before-every-save — rejected as blind over-confirmation against the spec's own restraint rule. One global toast container component — rejected; the helper covers it with less new UI.
- **Rationale:** Smallest consistent implementation inside existing seams; zero changes to validation, routing, data contracts or public pages.
- **Consequences:** No `window.confirm`/`alert` remains in admin code. Centered success modals replace the operational success notices; validation notices are unchanged.
- **Related documents:** `docs/ARCHITECTURE.md` (admin islands), `docs/UI-UX.md`, DEC-018/DEC-019 (affected flows).
- **Supersedes / Superseded by:** —.
- **Open questions or follow-up:** Supabase adapter (Phase 3); real-browser pass of the new dialogs.

### DEC-023 — Event Types module as the contact-form dropdown source

- **ID:** DEC-023
- **Title:** Dedicated Event Types module drives the inquiry form dropdown
- **Status:** Accepted
- **Date:** 2026-09-24
- **Context:** Event type options lived in three unconnected places: a hardcoded `EVENT_TYPES` constant feeding the contact dropdown, a `home.eventTypes` list edited in the Homepage CMS form but never rendered anywhere, and a separate plural mock list rendering the homepage occasion chips. The requirement is one managed module as the dropdown source of truth with CRUD, ordering, and no hardcoded frontend list.
- **Decision:**
  1. **Module.** New `mod-event-types` collection of `{id, label}` items with the established list/detail/add/edit pattern, SweetAlert2 confirms and toasts, plus Up/Down row buttons that persist array order immediately (array order is the dropdown order; no drag-and-drop, no numeric order field).
  2. **Seed.** The eight documented dropdown values are preserved verbatim in order; the homepage chips keep their existing plural mock list untouched.
  3. **Dead code removed.** The `EVENT_TYPES` constant and the never-rendered `home.eventTypes` field (type, schema, seed, Homepage editor panel) are deleted; the editor keeps the event-types heading group. The dashboard summary counts the module instead.
  4. **Public.** `getEventTypes()` exposes the build-time labels; the contact page passes them into the inquiry island (server-rendered options), which refreshes live from saved module state in the editing browser. Submission validation (`eventType` optional string) is unchanged.
- **Alternatives considered:** Driving the homepage chips from the same module — rejected; it would visibly rewrite chip labels and exceeds the requirement. A numeric order field instead of move buttons — rejected; buttons match the existing StringList/ItemCard precedent and need no tiebreak rules.
- **Rationale:** Smallest change giving one source of truth inside the established module, repository, echo and dialog patterns.
- **Consequences:** An empty module degrades the dropdown to its "Select…" placeholder only. Homepage chips remain mock-driven until separately addressed.
- **Related documents:** `docs/REQUIREMENTS.md` (REQ-INQ-008..010), `docs/ARCHITECTURE.md`, `docs/DATA-MODEL.md`, DEC-018/DEC-019/DEC-022.
- **Supersedes / Superseded by:** —.
- **Open questions or follow-up:** Supabase adapter (Phase 3); client confirmation of the dropdown values; real-browser pass of the module CRUD and dropdown echo.

### DEC-024 — Supabase backend foundation on free-tier limits + hybrid output

- **ID:** DEC-024
- **Title:** Minimal Supabase + Vercel hybrid foundation sized for free plans
- **Status:** Accepted
- **Date:** 2026-09-24
- **Context:** The admin CMS is per-browser only (localStorage `mph-cms-v2`, IndexedDB blobs, mock inquiries) and the Astro build is fully static, so there is no production persistence, auth, or server endpoint. The operator runs Vercel Hobby and Supabase free, which cap function invocations, database size (500 MB), storage (1 GB) and idle projects. The requirement is a real backend without outgrowing those limits or rewriting working pages.
- **Decision:**
  1. **Dependencies.** `@supabase/supabase-js` + `@supabase/ssr` (session handling) and `@astrojs/vercel` v11 (matches Astro 7) are the only additions. No Express/second backend, no realtime, no codegen tooling.
  2. **Hybrid output.** The Vercel adapter with Astro 7 static-first behavior; every existing page stays prerendered/static and only future `src/pages/api/*` routes run as serverless functions, keeping Hobby invocations at zero until the inquiry endpoint lands.
  3. **Credential split.** `src/lib/supabase/client.ts` (anon key, browser-safe singleton) vs `src/lib/supabase/server.ts` (service-role, server-only). Secrets live in `.env`/Vercel settings, documented in `.env.example`; the service-role key never enters the browser bundle.
  4. **Lean schema.** `supabase/schema.sql` mirrors `cms/types.ts` exactly (services, packages, gallery_items, faqs, event_types, page_contents JSONB, page_seo, inquiries minimal, admin_users allow-list) with one `cms-media` public bucket; pgcrypto only, highlight/order/recency indexes, 2 MB upload cap retained.
  5. **Security.** `supabase/rls.sql` enables RLS everywhere: anon reads highlighted items/page copy/SEO/event types and inserts inquiries only; authenticated admins via `is_admin()` do all CRUD. Storage policies mirror this. RLS is never disabled.
  6. **Seed.** `supabase/seed.sql` upserts the current provisional seed verbatim (slugs as idempotency keys) so the first backed render matches the live site; page copy/SEO shells stay empty until Phase 7/11 so hardcoded fallbacks keep rendering.
- **Alternatives considered:** Full server output — rejected; it would run every page as a function on Hobby for no benefit. Separate Node backend — rejected per architecture; Astro endpoints already cover the one privileged operation (inquiry insert + delivery).
- **Rationale:** Smallest production backend that preserves the ModuleCrud UX, CmsEcho crawlability, SweetAlert2 feedback and validation caps while fitting free-tier quotas.
- **Consequences:** Requires a Supabase project, SQL runs (schema, rls, storage, seed) and one `admin_users` row before auth/CRUD phases proceed. Public pages and admin UI are untouched until wired phase by phase.
- **Related documents:** `docs/ARCHITECTURE.md`, `docs/DATA-MODEL.md`, `docs/API.md`, `docs/SECURITY.md`, `docs/TECH-STACK.md`, DEC-017/DEC-018/DEC-023.
- **Supersedes / Superseded by:** —.
- **Open questions or follow-up:** Supabase project provisioning; first admin allow-list insert; client confirmation of provisional seed copy; real-browser pass after wiring.

### DEC-025 — Middleware admin guard with server-rendered admin pages

- **ID:** DEC-025
- **Title:** Supabase Auth cookie sessions with middleware route guard and sign-out
- **Status:** Accepted
- **Date:** 2026-09-24
- **Context:** `/admin/login` validated input but created no session, and every admin page was static HTML reachable without sign-in. Static pages bypass middleware on Vercel, and browser localStorage sessions are invisible to the server, so a guard needs both cookie sessions and server-rendered admin pages.
- **Decision:**
  1. **Cookie sessions.** The browser client uses `@supabase/ssr` `createBrowserClient` (cookies, not localStorage) so `src/middleware.ts` can read the session server-side. No custom password storage; Supabase Auth only.
  2. **Middleware guard.** All `/admin/*` except `/admin/login` require a session whose user id is in `public.admin_users`; otherwise redirect to `/admin/login` (non-allow-listed sessions are signed out). With env vars absent, the guard passes through to preserve pre-provisioning local behavior.
  3. **Server-rendered admin.** The 16 protected admin pages set `prerender = false` so the guard executes on Vercel; the 9 public pages and `/admin/login` stay prerendered/static. Admin traffic is one operator, negligible on Hobby.
  4. **Login/logout UX.** `LoginForm` signs in via `signInWithPassword` with loading state, plain-language error mapping and redirect-on-existing-session; the unconnected fallback remains when env is absent. A sidebar `SignOutButton` clears cookies and returns to login. Validation summaries stay inline per DEC-022.
- **Alternatives considered:** Client-side guard island only — rejected; static HTML would still serve and route hiding is not authorization. Full-server output — rejected; public pages gain nothing from functions on Hobby.
- **Rationale:** Smallest server-enforced auth inside the existing shell, login UI and RLS model; RLS remains the data backstop even if a page were ever cached.
- **Consequences:** Admin pages cost one function invocation per view (one operator). CMS data wiring (Phases 5+) reuses the same cookie session.
- **Related documents:** `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/TECH-STACK.md`, DEC-017/DEC-022/DEC-024.
- **Supersedes / Superseded by:** —.
- **Open questions or follow-up:** Real-browser login/logout/session-expiry pass; Vercel env vars for preview/production.

### DEC-026 — Inquiry endpoint: store-first receipt with gated integrations

- **ID:** DEC-026
- **Title:** POST /api/inquiries stores durably, verifies when configured, forwards best-effort
- **Status:** Accepted
- **Date:** 2026-09-24
- **Context:** The contact form needs a working submission path before Turnstile and EmailJS credentials exist. The alternatives are a dead form (503 until keys land) or a dishonest success. Meanwhile the inquiries table with an admin-visible list makes a stored record a genuine receipt.
- **Decision:**
  1. **Store-first.** The endpoint server-validates with the shared Zod schema, inserts via the service-role client (anon can never read the table), and answers success on durable storage. The admin list at `/admin/inquiries` shows every receipt with the existing Gmail-compose response action.
  2. **Turnstile verifies when configured.** With `TURNSTILE_SECRET_KEY` set, missing/invalid tokens are rejected (400). Without it, submissions are accepted and this gap is explicit here, not silent: anonymous insert is minimal-field, rate abuse is bounded by table size/free-tier monitoring, and keys should be added promptly.
  3. **EmailJS forwards best-effort.** With `EMAILJS_*` set, the endpoint forwards after storing; delivery failure is server-logged only and never fails the receipt, because nothing is lost (the admin list holds it).
  4. **Fail-safe otherwise.** Unreadable payloads and validation failures answer 400 with plain messages; a missing service-role key or DB failure answers 503 with a contact-directly fallback. No raw errors reach visitors; input is preserved on failure; the submit button disables while sending.
- **Alternatives considered:** Dead-until-configured 503 — rejected; it withholds working functionality (storage + admin visibility) for want of the email nicety. Success-only-on-email-delivery — rejected while keys are absent; adopted automatically once forwarding succeeds consistently.
- **Rationale:** Smallest honest working system: real receipt today, stricter spam posture and automatic Gmail delivery the moment keys land, no code changes needed then.
- **Consequences:** Requires `SUPABASE_SERVICE_ROLE_KEY` at runtime (server only). Until Turnstile/EmailJS keys exist, spam filtering and Gmail auto-delivery are pending — tracked explicitly in the final report, not silently dropped.
- **Related documents:** `docs/ARCHITECTURE.md`, `docs/API.md`, `docs/SECURITY.md`, DEC-024.
- **Supersedes / Superseded by:** —.
- **Open questions or follow-up:** Turnstile + EmailJS key provisioning; live submit/delete round-trip in a browser; Vercel runtime env vars.

### DEC-027 — Publish-on-demand via guarded Deploy Hook trigger

- **ID:** DEC-027
- **Title:** Sidebar Publish button triggers a production rebuild; no auto-rebuilds
- **Status:** Superseded by DEC-028
- **Date:** 2026-09-24
- **Context:** Public pages are prerendered static HTML, so saved CMS edits sit in the database invisible until a rebuild, and nothing triggers one. An earlier incident (edits made in an unconfigured admin with silent local-only saves) showed the UI must also state its backend mode out loud.
- **Decision:**
  1. **Explicit Publish.** A sidebar `PublishButton` posts to `POST /api/publish`, which re-verifies the admin session + `admin_users` allow-list server-side and then fires a Vercel Deploy Hook. No automatic rebuild on save (protects Hobby build minutes from half-finished drafts); one deployment per deliberate click.
  2. **Hook URL stays server-side.** `VERCEL_DEPLOY_HOOK_URL` has no `PUBLIC_` prefix and never enters the browser bundle; exposing it client-side would let anyone burn build minutes. The endpoint answers plain-language 401/403/503 on auth or configuration failures.
  3. **Backend-state banner.** The admin shell renders a warning banner whenever the Supabase env is absent (local-only mode), since islands otherwise degrade to browser storage with success feedback. This closes the exact silent trap from the incident.
  4. **Loud builds.** The public loaders log `live Supabase snapshot` vs `seed fallback (+reason)` so deploy logs always show which source rendered.
- **Alternatives considered:** Per-request SSR for public pages — rejected; burns Hobby invocations on every uncached view for content that changes infrequently. DB-webhook auto-redeploy — rejected; fires on drafts and needs secrets in the database. Browser-side hook call — rejected on security grounds.
- **Rationale:** Smallest change making the existing sidebar copy ("Changes go live after saving and publishing") true while keeping static SEO, performance, and free-tier costs.
- **Consequences:** Requires creating a Vercel Deploy Hook and setting `VERCEL_DEPLOY_HOOK_URL` (server env). Publishing takes one build duration to appear publicly.
- **Related documents:** `docs/ARCHITECTURE.md`, `docs/DEPLOYMENT.md`, `docs/SECURITY.md`, DEC-024/DEC-025.
- **Supersedes / Superseded by:** Superseded by DEC-028 (operator rejected hook/git-based publishing; server rendering removes the need).
- **Open questions or follow-up:** Deploy Hook provisioning; live publish round-trip; the open asset-layout incident (Phase 18) is unrelated to this flow.

### DEC-028 — Server-rendered public pages with edge SWR, no rebuilds

- **ID:** DEC-028
- **Title:** Public pages read live Supabase data per request with 60s edge caching
- **Status:** Accepted
- **Date:** 2026-09-24
- **Context:** The operator works in the localhost admin against the production database and expects saves to reach the live site without redeploys, deploy hooks, or git involvement. Prerendered static pages fundamentally cannot do that.
- **Decision:**
  1. **Server-render the 9 public pages** (`prerender = false`); the existing live-first loaders run per request with seed fallback unchanged. Admin, login and API routes were already server-side.
  2. **Edge SWR caching.** One helper sets `Cache-Control: public, s-maxage=60, stale-while-revalidate=300` on public responses; admin/API stay `no-store`. Visitors get fast cached HTML; edits surface within about a minute. Function runs happen only on cache miss/revalidation, negligible on Hobby.
  3. **Publish flow deleted.** The Deploy Hook endpoint, sidebar button, hook env docs and hook provisioning steps are removed (DEC-027 superseded). The sidebar note now states the minute-scale freshness; the backend-state banner stays as the local-only tripwire.
  4. **Sitemap lists public URLs explicitly** (`customPages`), since the sitemap integration only auto-discovers prerendered routes. Admin/API stay excluded; robots unchanged.
- **Alternatives considered:** Keeping static + hook publishing — rejected by the operator (no hooks/git wanted). Per-request SSR without CDN caching — rejected; wastes Hobby invocations for zero user benefit.
- **Rationale:** One mechanism for freshness with no operator rituals, no extra services, and full SSR HTML for SEO. Localhost saves flow to the live site through the shared database alone.
- **Consequences:** Public pages cost function runs on cache miss/revalidation (one operator-scale site: negligible). First view after deploy is server-rendered, not prebuilt.
- **Related documents:** `docs/ARCHITECTURE.md`, `docs/DEPLOYMENT.md`, DEC-024/DEC-028 notes in prior reports.
- **Supersedes / Superseded by:** Supersedes DEC-027.
- **Open questions or follow-up:** Live save-to-public round-trip timing check; the open asset-layout incident (Phase 18) still needs its evidence.

### DEC-029 — Single-backend simplification: generated types, no local mode

- **ID:** DEC-029
- **Title:** Delete the local fallback layer; generate DB types; add a health endpoint
- **Status:** Accepted
- **Date:** 2026-09-24
- **Context:** The integration carried two backends everywhere (14 configured/unconfigured branches, localStorage + IndexedDB alongside Supabase, hand-written DB types that failed compilation three times). The "edits not showing" incident was caused directly by silent local-only saves. Separately, RLS verification exposed a subtle PostgREST behavior worth recording (see consequences).
- **Decision:**
  1. **One backend.** Deleted `lib/cms/repository.ts`, `lib/cms/images.ts` and the mock inquiry source. Admin paths throw "CMS backend is not connected" without env instead of succeeding into browser storage. Seeds remain solely as the public build-time fallback.
  2. **Generated types.** `lib/supabase/database.types.ts` is produced by `supabase gen types` (command in the file header); hand edits there are forbidden. This deletes the `never[]` upsert saga class permanently.
  3. **Kept seams.** `createId`/`slugId` moved to `lib/cms/ids.ts`; `collectImageKeys` moved into `storage.ts`; `SectionMeta` now lives in `supabase/pages.ts`. Dashboard and inquiries read live data with error states.
  4. **Health endpoint.** Public `GET /api/health` reports `{ ok, source: live|seed, counts, storageReachable }` from anon-readable facts only, so the next "is it live data?" question takes 10 seconds.
- **Alternatives considered:** Keeping local mode as offline backup — rejected by the operator; it was the incident. A custom backend for public reads — rejected; anon RLS already scopes correctly.
- **Rationale:** Every past incident traced to duality (two truths, silent fallback, hand-rolled types). Fewer concepts, louder failures.
- **Consequences:** Local dev hard-requires `.env`; the PAT used for verification and codegen must be revoked after use. Verified live with a temporary project token: anon reads highlighted-only, anon module writes denied (401), anon inquiry insert works with `return=minimal` (201), service paths work, storage anon-upload denied (403) with working service upload/delete, zero orphan files, database left pristine. Recorded PostgREST subtlety: anon INSERT with `return=representation` fails (401) because anon cannot SELECT the new row back — inserts must use `return=minimal`; the inquiry endpoint is unaffected (service client).
- **Related documents:** `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/DATA-MODEL.md`, DEC-024.
- **Supersedes / Superseded by:** —.
- **Open questions or follow-up:** Revoke the verification token; browser round-trips; the VSCode terminal error text and asset-layout evidence are still outstanding.

## 22. Related Documentation

Conceptual links; each concern is owned by its document (see Section 3):

- `AGENTS.md` — development rules, scope control, agent behavior.
- `README.md` — repository orientation and project constraints.
- `docs/PROJECT.md` — product and business context; authoritative on business questions and known-versus-unconfirmed information.
- `docs/REQUIREMENTS.md` — functional and business requirements; governs required behavior and owns the client-confirmation checklist.
- `docs/TECH-STACK.md` — selected, conditional, and not-selected technologies.
- `docs/ARCHITECTURE.md` — system structure, flows, and boundaries.
- `docs/UI-UX.md` — behavior and experience; `docs/DESIGN-SYSTEM.md` — visual language and reusable styling.
- `docs/DATA-MODEL.md` — data concepts and boundaries; `docs/API.md` — endpoint and integration responsibility boundaries.
- `docs/SECURITY.md` — security requirements and constraints; governs security expectations.
- `docs/TESTING.md` — verification strategy; `docs/DEVELOPMENT.md` — development workflow; `docs/ROADMAP.md` — development phase progression.
- `docs/DEPLOYMENT.md` — owner of deployment and production procedures.

## 23. Scope Exclusions

This document does not become:

- a requirements document (requirements belong in `docs/REQUIREMENTS.md`);
- an implementation guide (implementation belongs in the repository and its owning docs);
- a deployment manual (procedures belong in `docs/DEPLOYMENT.md`);
- a testing plan (verification strategy belongs in `docs/TESTING.md`);
- a business-content source (business facts require client confirmation and belong in confirmed content, not here);
- a place for speculative architecture (unconfirmed ideas stay **Proposed** or **Revisit Required** with explicit triggers, never presented as direction).

Consistent with the project-wide exclusions, decisions here do not introduce reservation engines, payments, checkout, CRM, marketing automation, custom review systems, enterprise CMS machinery, unnecessary services or infrastructure, ranking guarantees, or ongoing campaign scope unless the client explicitly expands the project with rescoped requirements.

## 24. Shot&Prints Boundary

Shot&Prints material is **Reference-Only**. It is historical context from the previous website, not the current brand identity and never a decision, requirement, or implementation fact.

- Reference pricing, inclusions, add-ons, policies, descriptions, imagery, FAQs, testimonials, contact details, and brand language must not appear in any record as decided or confirmed content.
- A record may cite Shot&Prints material only as reference background, explicitly labeled **Reference-Only**, with any carryover marked **Confirmation Required**.

## 25. Acceptance Criteria

This document is complete when:

1. Only `docs/DECISIONS.md` was created; no existing file was modified, no deployment document was created, and no implementation code was created.
2. Purpose, scope, ownership, and authority are defined without overriding requirements or security rules.
3. The documented-choice versus recorded-decision versus implemented-behavior distinction is maintained throughout.
4. Record versus do-not-record guidance covers the material areas in Section 4 with clear exclusions.
5. Exactly the lifecycle statuses Proposed, Accepted, Superseded, Rejected, and Revisit Required are defined, with transitions stated and no additional statuses introduced.
6. A practical record format covers ID, title, status, date, context, decision, alternatives, rationale, consequences, related documents, supersession links, and open questions.
7. The ID convention is defined as an implementation decision of this document with no pre-existing IDs claimed.
8. Proposal, evidence, conflict-resolution, confirmation, and deferral rules are stated.
9. AI-assisted decision-making obligations are explicit.
10. The hierarchy section prohibits authorizing requirement violations, security weakening, invented business facts, or silent overrides.
11. Technology, architecture, security, data/API, testing/development, and deployment handling defer detail to their owning documents and create no new technology choices.
12. Superseding, evidence, and unresolved-decision rules prevent silent history edits and silent approvals.
13. The register invents no historical decisions; records DEC-001 and later exist only via the lifecycle in Sections 5–8.
14. Related documentation, scope exclusions, and the Shot&Prints Reference-Only boundary are explicit.
15. No invented decisions, confirmations, requirements, technologies, tooling, commands, versions, conventions, variables, credentials, addresses, links, or infrastructure details appear.
16. The fixed-price scope discipline (simplicity, maintainability, no overengineering) is preserved.

(End of file)
