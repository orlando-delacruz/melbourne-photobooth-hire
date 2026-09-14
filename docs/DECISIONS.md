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

Eleven decision records exist (DEC-001 through DEC-011). Existing selections, requirements, and architectural directions stated in `docs/TECH-STACK.md`, `docs/REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, and the other owning documents remain **documented choices**, not decision records, and are not retroactively treated as entries here. The repository remains the source of what is actually implemented.

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

Future records are appended here in ID order with status and date kept current.

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
