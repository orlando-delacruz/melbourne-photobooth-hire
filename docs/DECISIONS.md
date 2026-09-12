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

Three decision records exist (DEC-001 through DEC-003). Existing selections, requirements, and architectural directions stated in `docs/TECH-STACK.md`, `docs/REQUIREMENTS.md`, `docs/ARCHITECTURE.md`, and the other owning documents remain **documented choices**, not decision records, and are not retroactively treated as entries here. The repository remains the source of what is actually implemented.

| ID      | Title                                                    | Status   | Date       |
| ------- | -------------------------------------------------------- | -------- | ---------- |
| DEC-001 | Phase 1 Astro skeleton and tooling baseline              | Accepted | 2026-09-12 |
| DEC-002 | Typecheck, format enforcement, and root CONTEXT glossary | Accepted | 2026-09-12 |
| DEC-003 | Centralized mock-content seam and styling split          | Accepted | 2026-09-12 |

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
- **Status:** Accepted
- **Date:** 2026-09-12
- **Context:** ROADMAP Sections 4–5 require a centralized mock layer swapped per-surface for Supabase content in Phase 3. TECH-STACK selects Styled Components "across Astro and React UI", but styled-components cannot style `.astro` files directly. First build also exposed a styled-components default-import SSR interop failure (`styled.button is not a function`).
- **Decision:** `src/lib/content/` owns one small interface (`ContentSource.load()` / `getContent()` accepting an injectable source) with a mock adapter of clearly-marked placeholder data only (empty gallery/FAQs to exercise empty states; `reviewUrl: null` so the review CTA stays absent until confirmed). Styling splits: CSS custom properties in `src/styles/tokens.css` (+ `global.css`) for Astro components, typed styled-components `theme` for React islands only. Island convention: named `styled` import (SSR-safe), minimal serialized props, `client:media` hydration for the mobile nav island.
- **Alternatives considered:** Per-page fixtures — rejected (flag-day rewrites, violates ROADMAP centralization). styled-components everywhere incl. Astro — impossible; rejected. `client:load` for mobile nav — rejected (ships JS to desktop users who never need it).
- **Rationale:** One seam = one swap point for Phase 3; split styling honors both the selected stack and Astro's rendering model; `client:media` keeps desktop pages at zero island JS.
- **Consequences:** Pages/components consume `getContent()` only; Phase 3 adds a Supabase adapter without touching callers; provisional palette label must be lifted on client brand confirmation.
- **Related documents:** `docs/ROADMAP.md` (Sections 4–5), `docs/ARCHITECTURE.md` (Sections 6–8), `docs/DESIGN-SYSTEM.md` (Sections 5–10), `docs/DATA-MODEL.md` (Section 5).
- **Supersedes / Superseded by:** —
- **Open questions or follow-up:** Client confirmation of brand colors/fonts, CMS modules/fields, and review URL before Phase 3 wiring.

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
13. The register states it is currently empty and does not invent historical decisions.
14. Related documentation, scope exclusions, and the Shot&Prints Reference-Only boundary are explicit.
15. No invented decisions, confirmations, requirements, technologies, tooling, commands, versions, conventions, variables, credentials, addresses, links, or infrastructure details appear.
16. The fixed-price scope discipline (simplicity, maintainability, no overengineering) is preserved.

(End of file)
