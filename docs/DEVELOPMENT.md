# Melbourne Photobooth Hire — Development Workflow

## 1. Purpose and Scope

This document is the authoritative guide for **how development work is performed** on the Melbourne Photobooth Hire project, especially when development is assisted by an AI coding agent.

It answers:

> **What steps must an agent (or human developer) follow before, during, and after making a code change, and which rules keep that work safe, scoped, and verifiable?**

Scope of this document:

- Development principles, context loading, inspection, planning, implementation, review, verification, and reporting.
- AI-assisted development workflow and code-generation review expectations.
- Scope control, preservation of existing behavior, and adherence to the documented stack, architecture, UI/UX, design system, data/API, and security boundaries.
- Dependency, environment, Git, documentation-maintenance, and decision-tracking expectations.
- Definition of done, exclusions, and acceptance criteria for this document.

Out of scope for this document (owned elsewhere):

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
- Production deployment procedures → `docs/DEPLOYMENT.md` (future document, not created here).
- Recorded decisions → `docs/DECISIONS.md` (future document, not created here).

This is a greenfield project at the documentation/specification stage. The stack described in `docs/TECH-STACK.md` and `docs/ARCHITECTURE.md` is the **intended direction**, not a claim that implementation exists. The repository is the authoritative source for what is actually implemented. Nothing in this document authorizes assuming a technology is implemented merely because it is selected.

### Status labels used in this document

- **Confirmed** — established by existing project documentation cited in the relevant section. May be relied on for planning.
- **Conditional** — exists only if a separately confirmed requirement activates it. Must not be implemented by default.
- **Confirmation Required** — depends on client/business confirmation. Must not be treated as a final field, module, workflow, value, or configuration.
- **Reference-Only** — originates from the previous Shot&Prints website/material. Historical context only; never current project data or a development requirement.
- **Implementation Decision Required** — tooling, command, convention, or infrastructure detail not established by any source document. Must not be invented here; must be confirmed from the repository or explicitly decided and recorded.

No statement in this document introduces a new Confirmed business fact, requirement, or technical decision beyond what the source documents already establish.

---

## 2. Development Principles

**Confirmed.** Development follows `AGENTS.md` (Sections 7, 23–25) and `README.md` (Section 8). Priorities, in order:

1. Required functionality (per `docs/REQUIREMENTS.md`).
2. Security and data integrity (per `docs/SECURITY.md`).
3. Documented architecture (per `docs/ARCHITECTURE.md`).
4. Existing behavior (preserve what works).
5. Maintainability.
6. Simplicity.
7. Performance.
8. Convenience.

Working rules:

- Prefer the smallest maintainable change that solves the actual problem.
- Prefer existing project patterns over generated conventions.
- Prefer correctness over speed, evidence over assumptions, verification over confidence.
- Keep the codebase practical and maintainable within the fixed **₱15,000** project scope.
- Avoid over-engineering, premature abstractions, unnecessary dependencies, unrelated refactoring, and large rewrites where a focused change suffices.
- Avoid duplicating existing functionality.
- Do not add complexity solely for future possibilities.
- Treat AI-generated code as untrusted until reviewed and verified (see Section 9).

---

## 3. Source-of-Truth Hierarchy

**Confirmed.** When sources disagree or overlap, authority is:

| Concern | Authoritative source |
| --- | --- |
| How development work is performed | This document (`docs/DEVELOPMENT.md`) + `AGENTS.md` |
| Agent behavior, scope control, implementation principles | `AGENTS.md` |
| Product/business context, scope, customer journey | `docs/PROJECT.md` |
| What the system must do | `docs/REQUIREMENTS.md` (governs over this document and UI/UX on required behavior) |
| Selected technologies and exclusions | `docs/TECH-STACK.md` |
| Architecture, layers, data flows, boundaries | `docs/ARCHITECTURE.md` |
| Behavior and experience | `docs/UI-UX.md` |
| Visual language, tokens, reusable styling | `docs/DESIGN-SYSTEM.md` |
| Data concepts, relationships, boundaries | `docs/DATA-MODEL.md` |
| Endpoint behavior, validation principles, integration boundaries | `docs/API.md` |
| Security requirements and constraints | `docs/SECURITY.md` (governs over this document on security expectations) |
| Verification strategy | `docs/TESTING.md` |
| What is actually implemented | The repository (code wins over docs for actual behavior; the discrepancy must be resolved explicitly) |
| Production procedures | `docs/DEPLOYMENT.md` (future; owns deployment detail) |
| Recorded decisions | `docs/DECISIONS.md` (future; owns decision records) |

Rules:

- Where this document and `docs/REQUIREMENTS.md` disagree on required behavior, `docs/REQUIREMENTS.md` governs and the discrepancy is resolved explicitly.
- Where this document and `docs/PROJECT.md` disagree on business context, `docs/PROJECT.md` is authoritative.
- Where this document and `docs/SECURITY.md` disagree on security expectations, `docs/SECURITY.md` governs.
- Where documentation and implementation disagree, the implementation governs actual behavior and the discrepancy is identified before changing anything (per `AGENTS.md` Sections 4–5).
- Do not silently choose between conflicting sources. Name the conflict and resolve it against the hierarchy above.

---

## 4. Required Context Loading Before Implementation

**Confirmed** (per `AGENTS.md` Section 4). Before any implementation task:

1. Read `AGENTS.md`.
2. Read this document (`docs/DEVELOPMENT.md`) for the workflow.
3. Identify which project documents are relevant to the task — read only those, plus their cited requirement IDs. Do not load or modify unrelated documentation without a reason.
4. Typical relevance guide (not a substitute for judgment):

| Task type | Read |
| --- | --- |
| Public page / content change | `docs/REQUIREMENTS.md` (Sections 3–4, 13–14), `docs/PROJECT.md` (scope, confirmation status), `docs/ARCHITECTURE.md` (Sections 6–7), `docs/UI-UX.md` (relevant page section), `docs/DESIGN-SYSTEM.md` (relevant pattern/token sections) |
| Inquiry form / validation / submission | `docs/REQUIREMENTS.md` (Sections 9–10, 16–17), `docs/ARCHITECTURE.md` (Sections 9–10, 14, 16), `docs/API.md` (Sections 5–10, 16), `docs/UI-UX.md` (Sections 13–14), `docs/SECURITY.md` (Sections 5–6), `docs/TESTING.md` (Section 6) |
| CMS / admin change | `docs/REQUIREMENTS.md` (Sections 11, 18), `docs/ARCHITECTURE.md` (Section 11), `docs/DATA-MODEL.md` (Sections 5, 10, 13–14), `docs/API.md` (Section 12), `docs/UI-UX.md` (Sections 23–24), `docs/SECURITY.md` (Sections 2–4, 15) |
| Data / Supabase / storage change | `docs/DATA-MODEL.md`, `docs/API.md` (Sections 11–13), `docs/SECURITY.md` (Sections 4, 11), `docs/ARCHITECTURE.md` (Section 13) |
| Styling / component change | `docs/DESIGN-SYSTEM.md` (relevant sections), `docs/UI-UX.md` (behavior owner), `docs/TECH-STACK.md` (Sections 4–6) |
| Security-sensitive change | `docs/SECURITY.md` plus the relevant `docs/API.md` / `docs/DATA-MODEL.md` boundary sections |
| Any change needing verification planning | `docs/TESTING.md` (relevant sections) |

5. Inspect the existing implementation before modifying it (see Section 5).
6. Never assume documentation is more accurate than the actual code when investigating implemented behavior.

---

## 5. Repository Inspection Before Changes

**Confirmed** (per `AGENTS.md` Sections 4–5). Before modifying code, the agent must:

1. Confirm implementation status from the repository — do not treat a technology as implemented merely because `docs/TECH-STACK.md` selects it.
2. Read the relevant files in full where the change area is small; use targeted inspection (relevant modules, shared components, validation schemas, server endpoints, configuration) where the area is large.
3. Trace the existing behavior end to end for the affected flow (for example, form → validation → server endpoint → verification → delivery).
4. Identify affected files, shared components, shared validation logic, layouts, navigation, and any cross-cutting concerns (SEO output, accessibility, responsive behavior, security boundaries).
5. Check whether a similar pattern already exists in the codebase and reuse it.
6. Check whether the requested change conflicts with existing requirements or architecture.
7. For bug reports, reproduce or verify the problem where possible before proposing a fix (see Sections 21–22).

Do not make speculative changes simply because they might solve the problem.

---

## 6. Understanding Requirements Before Coding

**Confirmed.** No code is written until the agent can state:

1. Which requirement(s) the task serves, with requirement IDs where applicable (for example REQ-INQ-012, REQ-CMS-006).
2. Whether each relevant item is **Confirmed**, **Conditional**, **Confirmation Required**, **Reference-Only**, or **Implementation Decision Required** (see Section 27).
3. What the smallest appropriate change is (see Section 7).
4. What verification will be run and what evidence will demonstrate it (see Sections 19–20).

If the task serves no documented requirement and is not an explicitly requested fix or chore, stop and clarify — do not invent requirements (see Section 27). Low-risk ambiguities may proceed only with the smallest reasonable assumption explicitly reported (see Section 27).

---

## 7. Task Decomposition and Implementation Workflow

**Confirmed** (per `AGENTS.md` Section 16). Proportional to task size.

For small, well-defined tasks:

1. Inspect.
2. Implement.
3. Verify.

For complex or risky tasks:

1. Understand the requirements (Section 6).
2. Inspect the relevant codebase (Section 5).
3. Identify dependencies and risks (affected files, shared logic, security/SEO/accessibility blast radius).
4. Create a short implementation plan (steps, files, verification per step). Do not create planning documents for trivial tasks.
5. Implement in small logical steps.
6. Verify each important step.
7. Perform regression validation proportionate to risk (see Section 20 and `docs/TESTING.md` Section 17).
8. Summarize the result (see Section 31).

General rules:

- One task, one focused change. Do not bundle unrelated work.
- Keep each step reviewable: small diffs, clear naming, explicit data flow, predictable behavior.
- Reuse selected technologies before introducing anything new (see Sections 12–13, 16).

---

## 8. AI-Assisted Development Workflow

**Confirmed** (per `AGENTS.md` Section 23 and `docs/TESTING.md` Section 18). AI assistance changes speed, not responsibility. The required workflow for every AI-assisted change is:

1. **Understand first.** State the intended behavior and the requirement it serves before generating code.
2. **Read relevant documentation.** Per Section 4 — cite which documents were checked.
3. **Inspect existing code.** Per Section 5 — identify affected files and reuse existing patterns.
4. **Plan the smallest appropriate change.** Per Sections 6–7.
5. **Generate narrowly.** Implement only the requested behavior; do not expand scope, refactor unrelated code, or introduce new patterns.
6. **Review the resulting diff.** Read the full diff; do not trust summaries or plausibility. Check for unrelated changes, invented fields/endpoints/values, scope creep, and security issues.
7. **Identify assumptions.** Name everything the generated code assumed (fields, modules, policies, configurations, copy) and confirm each against a source document or mark it **Confirmation Required**.
8. **Run appropriate verification.** Per Sections 19–20 — never accept "build passes" or plausible appearance as proof of correctness.
9. **Check for regressions.** Risk-based re-verification of the changed feature, its direct dependencies, and related journeys.
10. **Report completely.** What was implemented, what was verified (with evidence), and anything not verified, blocked, assumed, or requiring confirmation (see Section 31).

Agents must not invent tests merely to make implementation appear compliant. A test that asserts invented behavior, assumes unconfirmed fields, or encodes **Reference-Only** content as expected output is itself a defect (per `docs/TESTING.md` Section 18).

---

## 9. Code Generation and Review Expectations

**Confirmed.** All AI-generated code is untrusted until reviewed and verified.

Generation expectations:

- Follow existing project patterns, naming, and file organization; do not introduce generated conventions.
- Keep changes minimal and focused; do not rewrite files unnecessarily.
- Use explicit data flow and predictable behavior; avoid clever or unconventional patterns.
- Never generate business content (prices, inclusions, policies, contact details, testimonials, team history, coverage areas, legal terms), endpoint wire formats, schemas, credentials, or configuration values unless they are **Confirmed** in the source documents or the repository.

Review expectations (every AI-assisted change):

- Read the complete diff before reporting.
- Confirm no unrelated files, refactoring, renames, or behavior changes are included.
- Confirm no invented requirements, APIs, fields, policies, tokens, or values were introduced.
- Confirm security boundaries hold independently of UI behavior (authentication, authorization, server-side validation, server-side verification, secret handling).
- Confirm failure states are handled (validation, verification, delivery, network, save, empty, unauthorized) and failure never presents as success.
- Confirm responsive, accessibility, and SEO implications were considered where relevant.
- If any check above cannot be performed, report it as not verified with the reason — do not claim it.

---

## 10. Existing-Code Preservation

**Confirmed** (per `AGENTS.md` Section 8). When modifying an existing project:

- Preserve working behavior. Avoid unrelated changes.
- Do not rewrite files unnecessarily or replace established patterns without a clear, stated reason.
- Keep the scope of each change aligned with the requested task.
- Consider backward compatibility when modifying shared functionality (shared components, validation schemas, layouts, navigation, feedback patterns).
- If a broader refactor is genuinely necessary, explain why before proceeding and treat it as a separate, explicitly requested task.

---

## 11. Scope Control and Avoiding Unrelated Changes

**Confirmed** (per `AGENTS.md` Section 18). Stay within the requested scope.

Do not:

- Refactor unrelated code.
- Rename unrelated files.
- Change unrelated UI.
- Upgrade dependencies without reason.
- Rewrite working systems unnecessarily.
- Introduce new technologies without justification.

If an unrelated issue is discovered:

- Mention it briefly in the report.
- Do not fix it automatically unless it blocks the current task or the user explicitly asks.

Every diff must contain only the requested change plus its directly required verification updates. Unrelated refactoring mixed into feature work is rejected in review.

---

## 12. Technology-Stack Adherence

**Confirmed.** `docs/TECH-STACK.md` is authoritative for what is selected. The intended direction is:

Astro → primary frontend/rendering; React → genuine interactive islands only; TypeScript → language; Styled Components → styling; Astro Server Endpoints → backend/API; Supabase → PostgreSQL/Auth/Storage; EmailJS → inquiry delivery to client Gmail; Cloudflare Turnstile → spam protection; Vercel → hosting; Namecheap → domain registrar; GitHub → source control; plus `@astrojs/sitemap`, Schema.org JSON-LD, Search Console, Business Profile, Business Profile review link (**Confirmation Required** for the URL), and GA4 (**Conditional / Could** only).

Rules:

- Reuse selected technologies before introducing new ones.
- Do not introduce alternatives such as Next.js, Express, NestJS, Tailwind CSS, Resend, Nodemailer/custom SMTP, unnecessary state-management libraries, unnecessary backend services, unnecessary CMS platforms, or unnecessary infrastructure. Each is **Not Selected** for the current scope (per `docs/TECH-STACK.md` Section 21) and requires an explicitly rescoped requirement plus a `docs/DECISIONS.md` entry before adoption.
- Do not treat a technology as implemented merely because it is selected. Confirm from the repository.
- Respect **Conditional** items: inquiry-record storage in Supabase only if explicitly confirmed; GA4 only if confirmed and appropriate; FAQ structured data only where valid for confirmed content.

---

## 13. Architecture Adherence

**Confirmed.** `docs/ARCHITECTURE.md` is authoritative for how components fit together.

- **Astro-first:** content-heavy pages render as SEO-friendly HTML with minimal client-side JavaScript. Content pages must remain readable, navigable, and crawlable without depending on client-side JavaScript.
- **React islands only:** React is scoped to genuinely interactive UI (inquiry form, mobile navigation, lightbox/dialog where confirmed). Do not turn the site into a client-rendered React application; do not hydrate static content.
- **Single backend:** Astro Server Endpoints are the only application backend. No separate server framework.
- **Supabase as data foundation:** PostgreSQL for CMS content (**Confirmation Required** modules/fields), Auth for admin authentication, Storage for CMS-managed media. Inquiry-record storage is **Conditional** (see Section 15).
- **Simple inquiry flow:** Customer → Inquiry Form → Validation → EmailJS → Client Gmail (default). The Supabase branch exists only on explicit confirmation.
- **Scoped CMS:** custom admin panel for confirmed website content only — not an enterprise CMS, CRM, booking platform, or marketing automation system.
- **Avoid overengineering:** no microservices, queues, gateways, background jobs, global stores, or unnecessary abstractions.

If a proposed change requires an architectural decision not documented in `docs/ARCHITECTURE.md`, identify it explicitly and record it per Section 24 rather than deciding silently.

---

## 14. UI/UX and Design-System Adherence

**Confirmed.** Behavior belongs to `docs/UI-UX.md`; visual language belongs to `docs/DESIGN-SYSTEM.md`. Where they disagree on required behavior, `docs/REQUIREMENTS.md` governs.

For frontend work, the agent must:

- Reuse existing components and patterns (same action = same treatment; same hierarchy = same typography; same state = same feedback — per `docs/DESIGN-SYSTEM.md` Section 34).
- Preserve responsive behavior across mobile, tablet, and desktop; no horizontal scrolling for essential content; practical touch targets.
- Handle loading, empty, error, and success states per `docs/UI-UX.md` (Sections 13–14, 20–24) with plain non-technical language and no exposed internals.
- Meet accessibility baselines: semantic HTML, one H1 per page, keyboard operability with visible focus, associated labels, text-associated errors (not color alone), meaningful alt text, reduced-motion respect. No formal conformance certification is claimed.
- Respect the CTA hierarchy: inquiry is primary; review and secondary CTAs never displace it.
- Use Lucide React for icons and Motion for animation only; no additional UI, styling, icon, animation, form, or validation libraries.
- Never invent final brand values (colors, fonts, logo treatment), imagery, or business content. Anything unconfirmed is **Confirmation Required**; anything from Shot&Prints is **Reference-Only** (see Sections 27–29).

Do not introduce arbitrary styles or new UI patterns when an existing design-system pattern can be reused. Token additions with project-wide effect follow the governance in `docs/DESIGN-SYSTEM.md` (Section 35) and are recorded per Section 24.

---

## 15. Data/API/Security Boundaries

**Confirmed.** `docs/DATA-MODEL.md`, `docs/API.md`, and `docs/SECURITY.md` jointly own these boundaries. Summary for development use:

- **No invented contracts.** No endpoint URLs, methods, payloads, response schemas, table definitions, columns, policies, or constraints are invented. Exact CMS modules/fields, inquiry fields, validation rules, endpoint structure, and storage access models are **Confirmation Required**.
- **Server-side enforcement.** All user input (inquiry and CMS) is validated server-side at the Astro Server Endpoint boundary. Client-side validation (Zod schemas) is usability only. Client assertions about identity, permission, validity, or workflow state carry no authority.
- **Spam verification server-side.** Turnstile evidence is verified at the server endpoint before a submission is treated as legitimate; client-side presence alone is insufficient.
- **Public vs admin separation.** Public callers receive only intentionally published HTML plus the inquiry submission boundary. Drafts, unpublished state, admin identities/sessions, stored inquiry records (if ever confirmed), secrets, and diagnostics never appear in public output. Every CMS operation is subject to server-side authorization; client-side route hiding is not a boundary.
- **Inquiry stays an inquiry.** Default flow has no stored inquiry entity. Supabase persistence of inquiries is **Conditional** — only on explicit confirmation — and never grows into availability, reservation, payment, CRM, or automation behavior.
- **Error discipline.** User-facing messages are clear and non-technical with next-step guidance; diagnostics are server-side only. Failure never presents as success.

---

## 16. Dependency Management

**Confirmed** (per `AGENTS.md` Section 9 and `docs/TECH-STACK.md` Sections 2, 21–23).

Before adding a dependency:

1. Check whether the project already has a solution for the same problem.
2. Check whether an existing (selected) dependency can solve it.
3. Consider maintenance cost, page weight, and project complexity within the ₱15,000 scope.
4. Avoid dependencies for trivial functionality.

Do not add packages merely because they are convenient. Do not add Next.js, Express, NestJS, Tailwind CSS, Resend, Nodemailer/SMTP infrastructure, state-management libraries, CMS platforms, or background/queue infrastructure without an explicitly rescoped requirement and a `docs/DECISIONS.md` entry. No package versions are pinned or invented in documentation; versions (if any) come from the repository when dependencies are installed.

---

## 17. Environment/Configuration Principles

**Confirmed** (per `docs/TECH-STACK.md` Section 20, `docs/ARCHITECTURE.md` Section 20, `docs/SECURITY.md` Section 8).

- Secrets and sensitive configuration live outside source code in environment-appropriate configuration. Procedures belong in `docs/DEPLOYMENT.md` (future), not here.
- Never hardcode, commit, or expose secrets, private keys, or credentials — in source, Git history, client bundles, logs, errors, or public responses.
- Client-side source must never contain secrets. Any client-visible configuration is public by design and carries no sensitive material.
- Do not invent environment variable names, credentials, IDs, keys, URLs, email addresses, or configuration values. None are established by the source documents, and none are defined in this document. Actual names/values are confirmed from the repository and hosting environment only.
- Production configuration (email, CMS, integrated services) must be set correctly in the hosting environment without committing secrets — verified at deployment per `docs/REQUIREMENTS.md` (REQ-DEP-003, REQ-DEP-005).

---

## 18. Local Development Expectations

Development must be reproducible and honest about what is and is not established.

- **Repository state governs.** Because this is a greenfield documentation-stage project, local setup (clone, install, develop, build, preview) depends on implementation that may not yet exist. Confirm actual files (manifest, configuration, source layout) in the repository before following or writing any setup steps.
- **No invented tooling.** No package manager, development command, build command, test command, lint command, formatting command, Git hook, CI provider, or hosting CLI behavior is invented in this document, because none is established by any source document. Concrete commands and conventions are **Implementation Decision Required** (see Section 37) and, once decided, belong in implementation/README detail and `docs/DECISIONS.md` — not assumed here.
- **Expected hygiene once tooling exists:** use the repository's established commands; keep the working tree clean of unrelated files; keep generated artifacts, local environment files, and secrets out of source control; run the relevant checks in Section 19 before reporting completion.
- **External services in local development:** EmailJS delivery, Turnstile verification, Supabase access, and Gmail receipt depend on real configuration. Local checks must avoid unintended customer communication and must never place real secrets or real personal data in fixtures (see Section 33).

---

## 19. Development Verification Workflow

**Confirmed** (per `AGENTS.md` Section 14 and `docs/TESTING.md` Sections 2, 4, 18, 21). Every implementation is verified at a level proportionate to its risk before the task is considered complete:

1. Run relevant checks available in the repository (type checks, build, linting where configured). Treat these as hygiene, not proof.
2. Manually verify the changed functionality in the running application (or state why this was not possible).
3. Check failure states for the feature (validation, verification, delivery, network, save, empty, unauthorized as applicable) — not only the happy path.
4. Check security boundaries independently of UI behavior where affected (authentication, authorization, server-side validation/verification, secret handling).
5. Consider responsive, accessibility, and SEO implications where the change is user-visible (keyboard, focus, labels, errors, semantics, alt text, titles, headings, canonicals, indexability as applicable).
6. Perform risk-based regression on the changed feature, its direct dependencies, and related journeys.
7. Review the final diff for unrelated changes and remove them.

What verification does **not** prove (per `docs/TESTING.md`):

- Build success alone does not prove correctness.
- Type checking alone does not prove correctness.
- Visual plausibility does not prove correctness.
- AI-generated code requires inspection regardless of how reasonable it looks.

Do not claim that something works without performing reasonable verification. Explicitly report anything not verified and why (see Section 31).

---

## 20. Testing Workflow and Relationship to `docs/TESTING.md`

`docs/TESTING.md` is the authoritative testing strategy. This document does not duplicate it; it states how development uses it.

- **Requirement verification is primary.** Every check traces to an observable requirement. Passing an implementation detail no requirement establishes proves nothing.
- **Critical journeys first:** inquiry submission, core page rendering/navigation, CMS save behavior.
- **Failure states are mandatory:** validation, verification, delivery, network, save, empty, and unauthorized cases are verified as explicitly as success paths.
- **Security boundaries are tested independently** from UI behavior (hidden navigation and client-side checks are not boundaries).
- **Responsive/accessibility/SEO checks apply where relevant** (mobile/tablet/desktop; keyboard, focus, labels, errors, semantics; crawlable HTML, metadata, headings, canonicals, sitemap, robots, structured data for confirmed content only — no ranking claims).
- **Regression is risk-based.** Authentication, authorization, inquiry workflow, storage, SEO architecture, shared UI, and production configuration changes warrant deeper verification; trivial content edits warrant the directly affected checks plus a smoke pass of the related journey.
- **No invented testing infrastructure.** No testing framework, browser-testing framework, coverage target, device matrix, or CI workflow is invented here, because none is established by any source document. All such tooling is **Implementation Decision Required** (per `docs/TESTING.md` Section 22). Unit/component tests are used only where they provide clear value (validation logic, utilities, complex interactive components).

Quality gates before feature completion follow `docs/TESTING.md` (Section 21): relevant functional behavior, critical journey, validation (client feedback plus server enforcement), security boundaries, error/failure states, responsive behavior, relevant accessibility checks, and build/deployment hygiene where applicable.

---

## 21. Bug-Fixing Workflow

**Confirmed** (per `AGENTS.md` Section 15 and `docs/TESTING.md` Sections 13, 17).

1. Reproduce or verify the problem where possible; record reproduction steps.
2. Gather evidence from the codebase; trace the affected flow.
3. Identify the root cause — or clearly state the remaining uncertainty. Distinguish confirmed findings, likely causes, assumptions, and unknowns. Never present assumptions as confirmed facts.
4. Propose the smallest appropriate solution; fix the root cause rather than masking the symptom.
5. Implement the targeted fix without changing unrelated behavior.
6. Verify the original failure case plus relevant failure-adjacent cases.
7. Perform regression checks on affected functionality proportionate to risk.
8. Add or update tests only where appropriate within the established (or newly decided) testing approach — do not invent testing infrastructure to justify a fix.

If the root cause cannot be confirmed, state the uncertainty instead of pretending it is known.

---

## 22. Debugging/Investigation Workflow

**Confirmed** (per `AGENTS.md` Section 6). For bugs, unexpected behavior, regressions, or unclear requirements:

1. Reproduce or verify the problem when possible.
2. Gather evidence from the codebase (relevant files, data flow, configuration, recent changes).
3. Identify the root cause or clearly state the remaining uncertainty.
4. Explain the findings briefly, separating confirmed findings, likely causes, assumptions, and unknowns.
5. Propose the smallest appropriate solution.
6. Implement only after the cause and solution are sufficiently understood.

Do not make speculative changes simply because they might solve the problem. Do not hide errors instead of fixing their cause. Do not remove validation merely to make code pass. Do not disable security controls as a shortcut.

---

## 23. Documentation Maintenance

**Confirmed** (per `AGENTS.md` Section 19). Update relevant documentation when implementation changes affect important project behavior. Documentation explains decisions and behavior concisely and reflects the actual implementation; it does not duplicate implementation details unnecessarily. Do not create documentation solely for the sake of creating more files.

Ownership guide:

| Change affects | Update |
| --- | --- |
| Requirement / product behavior | `docs/REQUIREMENTS.md` |
| Architecture, layers, flows, boundaries | `docs/ARCHITECTURE.md` |
| Technology choice or exclusion | `docs/TECH-STACK.md` |
| Data concepts, relationships, boundaries | `docs/DATA-MODEL.md` |
| Endpoint behavior, validation/integration contracts | `docs/API.md` |
| Security behavior or constraints | `docs/SECURITY.md` |
| UI behavior / experience | `docs/UI-UX.md` |
| Visual tokens, components, styling rules | `docs/DESIGN-SYSTEM.md` |
| Testing strategy | `docs/TESTING.md` |
| Development workflow (this document) | `docs/DEVELOPMENT.md` |
| Production procedures | `docs/DEPLOYMENT.md` (future; do not preempt its procedures here) |
| Important technical decision | `docs/DECISIONS.md` (future; see Section 24) |

Do not modify unrelated documentation without a reason. This task creates only `docs/DEVELOPMENT.md` and does not create `docs/DECISIONS.md`.

---

## 24. Decision Tracking and Relationship to `docs/DECISIONS.md`

**Confirmed** (per `AGENTS.md` Section 20). `docs/DECISIONS.md` (future document) will own important architectural and technical decisions. This document does not create it.

Record a decision there (once the document exists) when it:

- Affects architecture.
- Affects technology choices.
- Establishes important conventions (including any adopted package manager, commands, lint/format, test framework, browser tooling, CI, branch/commit conventions — all currently **Implementation Decision Required**).
- Introduces meaningful trade-offs.
- Is likely to be questioned or revisited later.

Do not record trivial implementation choices. Do not invent decisions in development reports — state proposals as proposals and mark unconfirmed items per Section 27.

---

## 25. Git/Source-Control Expectations

**Confirmed direction; conventions Implementation Decision Required.** GitHub is the **Selected** source-control platform (per `docs/TECH-STACK.md` Section 17). Sensible hygiene applies without inventing project-specific rules:

- Keep changes focused and reviewable: one task, one logical change, small diffs.
- Avoid mixing unrelated refactoring with feature work.
- Ensure the working tree contains only intended files before any commit or push.
- Never commit secrets, credentials, environment files with sensitive values, or test fixtures containing sensitive material.
- The repository has not established a branch strategy, commit-message format, PR requirements, release tagging, or CI workflow. Each of these is **Implementation Decision Required** — do not invent or enforce project-specific conventions for them in development work or reports.

Only commit, amend, push, or create PRs when explicitly requested.

---

## 26. Commit/Change Hygiene

Without inventing a commit convention (see Section 25):

- Stage only intended files; inspect status and the full diff before finalizing.
- Write accurate, concise change descriptions in the mechanism the repository or explicit instruction requires — do not invent a required format.
- Never skip verification steps, security checks, or review to make a change land faster.
- If a change is rejected by checks or review, fix the cause and re-verify; do not bypass controls.
- Keep each change small enough that its verification and rollback are understandable.

---

## 27. Handling Incomplete or Ambiguous Requirements

**Confirmed** (per `AGENTS.md` Section 17). When a requirement is ambiguous:

1. Inspect the relevant documentation (Sections 3–4).
2. Inspect the existing implementation if one exists (Section 5).
3. Identify the specific ambiguity.
4. If the ambiguity could materially affect implementation (architecture, data model, fields, contracts, policies, published business content), stop and ask a focused question. Do not invent requirements.
5. If the ambiguity is low-risk, proceed with the smallest reasonable assumption and explicitly report it as an assumption (see Section 31).

Classify every uncertain item with exactly one label:

- **Confirmed** — safe to implement as documented.
- **Conditional** — implement only if its activating requirement is confirmed.
- **Confirmation Required** — cannot be finalized, published, or treated as production behavior without explicit client confirmation (see the confirmation checklist in `docs/REQUIREMENTS.md` Section 23; examples include final pricing, policies, service descriptions, inquiry fields, CMS modules/fields, review URL, legal content, gallery imagery, FAQs).
- **Reference-Only** — Shot&Prints material; never a production requirement (see Section 29).
- **Implementation Decision Required** — tooling/convention detail with no source; confirm from the repository or record an explicit decision (see Section 37).

Do not silently turn assumptions into requirements.

---

## 28. Handling Documentation-vs-Code Discrepancies

**Confirmed** (per `AGENTS.md` Sections 4–5).

1. Do not assume documentation is more accurate than the actual code when investigating implemented behavior.
2. Identify the discrepancy explicitly: what the documentation states, what the code does, and which requirement (if any) each supports.
3. Determine which source is authoritative using the hierarchy in Section 3 (`docs/REQUIREMENTS.md` for required behavior, `docs/SECURITY.md` for security, the repository for actual behavior).
4. Fix toward the authoritative source with the smallest appropriate change, or escalate the conflict if authority is unclear.
5. Update the affected documentation per Section 23 when the resolution changes documented behavior.

Never silently follow whichever source is convenient.

---

## 29. Handling Client-Confirmation Requirements

**Confirmed.** `docs/REQUIREMENTS.md` (Section 23) and `docs/PROJECT.md` (Section 23) own the confirmation checklist. Development handling:

- **Confirmation Required** items (final pricing, inclusions, add-ons, deposit/cancellation/rescheduling terms, service-area rules, travel fees, contact details, review URL, testimonials, About/company story, legal content, inquiry field set, CMS modules/fields, gallery imagery, FAQs, any Shot&Prints carryover) must not be finalized, published, or treated as production behavior without explicit client confirmation.
- Reference or placeholder content must never be published as current business information. Unconfirmed areas are omitted or given sensible fallbacks (for example, directing visitors to inquire) rather than filled with invented content.
- Development may build the *capability* (for example, rendering a confirmed-structure package display) but must not *populate* it with unconfirmed business facts.
- Reports must keep **Confirmation Required** items confirmation-required — mark them as such rather than resolving them by assumption.

---

## 30. Definition of Done

**Confirmed** (per `AGENTS.md` Section 21, extended with project-specific verification). A development task is complete only when, where applicable:

- Requirements are understood and cited.
- Relevant documentation was checked.
- Implementation is complete and contains only the requested behavior.
- Affected behavior is verified with stated evidence.
- Appropriate tests/checks were performed (hygiene plus requirement, journey, failure-state, and boundary verification proportionate to risk).
- Failure states were checked; failure never presents as success.
- Security boundaries were checked independently of UI behavior.
- Responsive, accessibility, and SEO implications were checked where relevant.
- Regression risk was considered and proportionate re-verification performed.
- The diff was reviewed and unrelated changes removed.
- Documentation was updated when required (Section 23); decisions recorded when required (Section 24).
- Assumptions, limitations, and anything not verified, blocked, or requiring confirmation are clearly reported.

Code written without meeting these criteria is **implemented but not done**.

---

## 31. Development Reporting Requirements

**Confirmed** (per `AGENTS.md` Section 22 and `docs/TESTING.md` Section 20). Every development report is concise, factual, and separates:

- **Implemented** — changed but not yet verified.
- **Verified** — checked against a requirement with stated evidence (what check, what environment/context, expected vs actual result, pass/fail).
- **Not verified** — not yet checked, with reason.
- **Failed** — checked and not meeting the requirement, with details.
- **Blocked** — cannot be checked or completed, with the blocker named.
- **Assumed** — relied on an unconfirmed interpretation, stated explicitly.
- **Confirmation Required** — cannot be finalized until client/business confirmation arrives.

Reports include:

1. Summary of what changed.
2. Important files affected.
3. Important implementation decisions and their basis.
4. Validation performed (with evidence, not claims).
5. Known limitations, unresolved issues, assumptions, and confirmation requirements.

Do not claim tests, builds, or verification were performed if they were not actually performed. Never claim "fully tested" on the basis of a build or type check alone.

---

## 32. Security Expectations During Development

**Confirmed.** `docs/SECURITY.md` governs. Development must:

- Never hardcode, commit, or expose secrets, private keys, or credentials.
- Never bypass authentication or authorization; never weaken RLS/security boundaries or data-access rules without understanding their purpose.
- Never disable security controls to make development easier.
- Validate all user input at appropriate boundaries; treat client-side validation as usability, never enforcement.
- Verify Turnstile evidence server-side where applicable; never trust client-side presence alone.
- Return only limited, non-technical user-facing errors; record diagnostics server-side only.
- Keep admin data, unpublished content, inquiry data, secrets, and diagnostics out of public output, responses, logs, and fixtures.
- Treat authentication, authorization, user data, environment variables, and external service credentials as security-sensitive at all times.

Do not invent credentials, environment variable names, policies, or configuration values while developing.

---

## 33. Test-Data and Secret Safety

**Confirmed** (per `docs/TESTING.md` Section 19 and `docs/SECURITY.md` Sections 8, 12–13).

- Test and sample data use minimal, purpose-specific values. Avoid real personal data where sample data suffices.
- Production customer data is never copied into development/test environments without explicit justification.
- Secrets, keys, credentials, private material, and sensitive configuration never appear in test fixtures, examples, or committed files. Test credentials live outside the repository.
- External integration checks that reach real mailboxes (inquiry delivery) are deliberate, minimal, and coordinated — not routine automated sends. Production email verification happens with the client's awareness.
- No test-data platform or environment-management system is assumed; none is established by the source documents.

---

## 34. Production/Deployment Boundary

Development ends at verified, reviewable changes in the repository. Production behavior is owned by `docs/DEPLOYMENT.md` (future document).

- Detailed deployment procedures (hosting setup, environment configuration, domain/DNS wiring, release steps) belong in `docs/DEPLOYMENT.md`, not in development work or this document. Do not preempt them here.
- Production-relevant expectations already established and verifiable from development include: production build succeeds; HTTPS serving; correct production domain in canonicals/sitemap/metadata; reachable sitemap and robots.txt with correct public/admin treatment; functioning inquiry delivery with production configuration; no committed or exposed secrets; no placeholder, staging, or **Reference-Only** branding in production output; client-approved review link exactly as supplied.
- No deployment commands, hosting CLI usage, or environment values are invented in development reports.

---

## 35. Explicit Development Exclusions

**Confirmed.** Unless the client explicitly expands the project (with a rescoped requirement and a `docs/DECISIONS.md` entry), development does **not** include:

- Real-time availability, calendars, slots, holds, or reservation allocation.
- Reservation/booking engines, status machines, or scheduling workflows.
- Payments, checkout, orders, transactions, or refunds.
- CRM (pipelines, follow-ups, notes, tasks, campaigns).
- Marketing automation.
- Custom review platforms, review databases, moderation queues, or review-rating claims without verified data.
- Guaranteed SEO rankings; ongoing SEO, content, or backlink campaigns; large-scale SEO landing-page production.
- Enterprise CMS machinery (versions, revisions, audit logs, approval chains, multi-workspace models).
- Second backends, second databases, service-specific stores, queues, webhooks, background jobs, microservices, or API gateways.
- Unnecessary state-management libraries, CMS platforms, or infrastructure.
- Alternative providers or frameworks (Next.js, Express, NestJS, Tailwind CSS, Resend, Nodemailer/custom SMTP) without justification.
- Formal penetration testing, security certification, WCAG certification, PCI-scope work, or load testing for large-scale traffic.
- Ongoing SEO marketing, backlink campaigns, ranking guarantees, or large-scale landing-page systems.
- Turning the inquiry system into anything beyond an inquiry/request workflow delivering to the client's Gmail (plus **Conditional** Supabase persistence only if explicitly confirmed).

This list mirrors `docs/PROJECT.md` (Section 21), `docs/REQUIREMENTS.md` (Section 22), `docs/ARCHITECTURE.md` (Section 24), `docs/DATA-MODEL.md` (Section 16), `docs/API.md` (Section 20), `docs/SECURITY.md` (Section 21), `docs/UI-UX.md` (Section 31), `docs/DESIGN-SYSTEM.md` (Section 37), and `docs/TESTING.md` (Section 23).

---

## 36. Related Documentation

- `AGENTS.md` — AI-agent development rules, implementation principles, scope control. Governs how work is performed alongside this document.
- `README.md` — repository orientation, technology direction, project constraints.
- `docs/PROJECT.md` — product and business context. Authoritative for business/product questions and known-vs-unconfirmed information.
- `docs/REQUIREMENTS.md` — functional and business requirements. Authoritative for what the system must do.
- `docs/TECH-STACK.md` — technology choices and technical constraints. Authoritative for selected vs not-selected technologies.
- `docs/ARCHITECTURE.md` — application architecture and code organization.
- `docs/UI-UX.md` — user experience and interaction requirements. Owner of behavior and experience.
- `docs/DESIGN-SYSTEM.md` — visual and component design rules. Owner of visual language and reusable styling.
- `docs/DATA-MODEL.md` — database structure and data relationships (conceptual level). Owner of concepts, relationships, and data boundaries.
- `docs/API.md` — API and external service contracts (conceptual behavior and boundaries). Owner of endpoint behavior and integration responsibility boundaries.
- `docs/SECURITY.md` — security requirements and constraints. Owner of security expectations.
- `docs/TESTING.md` — testing and verification strategy. Owner of verification expectations.
- `docs/DEPLOYMENT.md` — future. Owner of deployment and production procedures.
- `docs/DECISIONS.md` — future. Owner of important architectural and technical decision records.

This document (`docs/DEVELOPMENT.md`) owns the development workflow. It duplicates no implementation detail from the documents above; where behavior is concerned, the owning document governs.

---

## 37. Acceptance Criteria

This development-workflow document is considered complete when:

1. `docs/DEVELOPMENT.md` exists.
2. It is the only file created or modified.
3. All major development workflow areas are covered: purpose/scope; principles; source-of-truth hierarchy; context loading; repository inspection; requirements understanding; task decomposition; AI-assisted workflow; code generation/review; existing-code preservation; scope control; stack, architecture, UI/UX/design-system, and data/API/security adherence; dependencies; environment/configuration; local development; verification; testing relationship; bug fixing; debugging/investigation; documentation maintenance; decision tracking; Git/source-control; commit/change hygiene; ambiguity handling; documentation-vs-code discrepancies; client-confirmation handling; definition of done; reporting; security during development; test-data/secret safety; production/deployment boundary; exclusions; related documentation; and these acceptance criteria.
4. It is specifically useful for AI-assisted development (explicit understand → read → inspect → plan → implement → review → verify → regress → report loop; untrusted-code treatment; assumption identification).
5. It aligns with `AGENTS.md` (principles, scope control, verification, AI rules, priority order).
6. It aligns with `docs/REQUIREMENTS.md` (inquiry model, CMS scope, confirmation checklist, out-of-scope list, requirement IDs cited without inventing new requirements).
7. It aligns with `docs/TECH-STACK.md` (selected stack stated without alternatives; not-selected items excluded; conditional items kept conditional; ₱15,000 constraint preserved).
8. It aligns with `docs/ARCHITECTURE.md` (Astro-first, islands-only React, single backend, Supabase foundation, simple inquiry flow, scoped CMS, no overengineering).
9. It aligns with `docs/UI-UX.md` (behavior ownership, form states, responsive/accessibility expectations, no invented copy or flows).
10. It aligns with `docs/DESIGN-SYSTEM.md` (visual ownership, token governance, consistency rules, no invented brand values or extra libraries).
11. It aligns with `docs/DATA-MODEL.md` (conceptual boundaries, conditional persistence, no invented schema or fields).
12. It aligns with `docs/API.md` (boundary behavior, no invented endpoints, payloads, or validation rules).
13. It aligns with `docs/SECURITY.md` (server-side enforcement, secret handling, verification, error discipline, no invented policies or credentials).
14. It aligns with `docs/TESTING.md` (verification levels, failure-state coverage, risk-based regression, evidence/reporting, no invented tooling or targets).
15. No unsupported implementation commands, tools, versions, credentials, environment variables, Git conventions, or infrastructure are invented — each is marked **Implementation Decision Required** or deferred to its owning future document.
16. Confirmation-required items remain confirmation-required; assumptions are never silently converted into requirements.
17. Shot&Prints remains **Reference-Only** throughout.
18. The ₱15,000 project constraint is preserved (simplicity, maintainability, no scope creep, no overengineering).
19. No implementation code is created.
20. No other documentation files are modified.

(End of file)
