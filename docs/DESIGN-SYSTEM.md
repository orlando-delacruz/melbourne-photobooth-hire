# Melbourne Photobooth Hire — Design System

## 1. Design-System Purpose

This document is the authoritative visual design-system specification for the Melbourne Photobooth Hire project. It answers:

> **What visual language, design tokens, reusable UI patterns, responsive rules, component variants, states, and motion standards should the product use?**

It defines **visual language and reusable styling rules**. It does not define behavior or experience, which belong in `docs/UI-UX.md`.

The design system exists to provide:

- **Visual consistency.** The same actions, hierarchy levels, states, and surfaces look the same everywhere.
- **Reusable patterns.** Buttons, links, form controls, cards, navigation, feedback states, dialogs, gallery, and FAQ patterns are defined once and reused.
- **Predictable component behavior.** Visual states (default, hover, focus, active, disabled, loading, error, success) follow one shared model.
- **Responsive consistency.** Layout, typography, spacing, grids, and forms adapt the same way across mobile, tablet, and desktop.
- **Accessibility-conscious visual rules.** Contrast, focus indicators, touch targets, error/success treatment, and reduced-motion behavior are built into the visual language.
- **Maintainable implementation.** A small token system and a limited set of component variants keep the codebase practical within the fixed **₱15,000** project scope.
- **Efficient AI-assisted development.** Clear consistency rules (Section 34) and token governance (Section 35) prevent one-off components and near-duplicate visual values.
- **Consistent public website and CMS/admin UI where appropriate.** The public site and CMS share typography principles, color roles, form controls, feedback patterns, accessibility standards, icons, and motion principles, while differing where density and purpose require it (Section 36).

This system is intentionally small. It favors a limited set of tokens, variants, and patterns over enterprise design-token complexity or decorative effects without UX value.

No source code, component implementations, database schemas, API contracts, credentials, IDs, or environment values are defined in this document.

---

## 2. Design Direction

The visual direction for Melbourne Photobooth Hire is:

- **Premium.** Polished, well-crafted presentation appropriate for paid event services.
- **Elegant.** Restrained detailing; no visual clutter or aggressive sales styling.
- **Modern.** Current, clean presentation; no dated decorative treatments.
- **Clean.** Generous whitespace; clear surfaces; minimal visual noise.
- **Sophisticated.** Confident typography and restrained elevation rather than heavy effects.
- **Event-focused.** Layouts and imagery support celebrations: weddings, birthdays, corporate events, engagements, school formals, Christmas/end-of-year events, and private events.
- **Visually polished.** Consistent alignment, spacing rhythm, and image presentation.
- **Trustworthy.** Honest content presentation; real photography; clear next steps.
- **Conversion-oriented without being aggressive.** The inquiry path is easy to find and visually prominent at decision points, without turning every section into a sales prompt.

The website should feel appropriate for weddings, celebrations, corporate events, and other events requiring a professional photobooth service.

This is not a generic luxury template. The visual language supports real photography and the Melbourne Photobooth Hire brand. It does not depend on invented decorative motifs, and it does not borrow an identity from elsewhere.

Shot&Prints is historical/reference material only and must not become the visual identity of the new brand (see Section 4).

---

## 3. Design Principles

1. **Elegant but restrained.** Polish comes from spacing, hierarchy, and consistency — not from heavy shadows, gradients, or ornament. When in doubt, remove decoration.
2. **Photography-led.** Real event imagery carries visual interest. Surfaces, overlays, and effects stay quiet so photography stands out.
3. **Clear hierarchy.** Each page and section has one primary message. Heading levels, ordering, and grouping communicate importance before any styling detail.
4. **Generous whitespace.** Section rhythm and content gaps give imagery and copy room to breathe. Density increases only where the CMS editing purpose requires it.
5. **Strong readability.** Comfortable line lengths, sufficient contrast, and scannable structure (headings, short paragraphs, lists) come before decorative typography.
6. **Consistent components.** The same action, hierarchy, state, and spacing context always uses the same visual treatment (see Section 34). One-off variants are avoided.
7. **Mobile-first.** Layouts, navigation, forms, tables, and media work comfortably on small screens first, then expand. Mobile carries the full essential journey; it is not a reduced version.
8. **Accessible contrast and states.** Focus, error, success, disabled, and active states are perceivable without relying on color alone, with practical touch targets and visible focus throughout.
9. **Minimal visual noise.** No carousels, badges, competing CTAs, auto-playing effects, or filler decoration where static content communicates equally well.
10. **Purposeful motion.** Motion (via the selected Motion library) is limited to meaningful feedback and polish — menu, dialog, accordion, and state-change transitions — and respects reduced-motion preferences. Motion never gates content.
11. **Conversion without aggressive sales design.** The primary inquiry CTA is visually prominent at decision points (hero, services, packages, contact) but does not dominate supporting content such as About detail, FAQ answers, or legal pages.
12. **Maintainable implementation.** A small token set, limited variants, and the selected Styled Components approach keep the system implementable and reviewable within the agreed scope. New tokens or variants require a real recurring need (see Section 35).

---

## 4. Brand and Visual Identity Boundaries

### 4.1 Confirmed project direction

The brand is:

**Melbourne Photobooth Hire**

The project direction supports a refined, premium, clean visual presentation consistent with Sections 2–3: elegant, modern, photography-led, trustworthy, and conversion-oriented without aggressive sales design.

### 4.2 Not confirmed

Do not assume:

- Final brand colors.
- Exact logo treatment.
- Final typography / font families.
- Final photography style beyond "real event imagery supplied or approved by the client."
- Exact decorative motifs.
- Final iconography treatment beyond the selected Lucide React direction.
- Exact visual assets (logo files, hero images, gallery images, illustrations).

Where exact values are not available from existing documentation, this document marks them as **Requires Confirmation** rather than inventing them.

### 4.3 Shot&Prints boundary

Shot&Prints is the previous/reference website. It may be used as reference material for existing business information where appropriate, but it is **not** the current brand identity.

Do not use Shot&Prints colors, logo, typography, or branding as the current brand system. Do not carry Shot&Prints pricing, inclusions, add-ons, policies, descriptions, or visual language into the new site as confirmed content.

---

## 5. Color System

No final brand palette is confirmed in `docs/PROJECT.md`, `docs/REQUIREMENTS.md`, `docs/TECH-STACK.md`, `docs/ARCHITECTURE.md`, or `docs/UI-UX.md`. This section therefore defines the **semantic token structure** — roles, purpose, and usage rules — without fabricating exact production color values.

There is exactly one color system: the semantic roles below. Do not create a second or competing palette.

| Token | Purpose | Usage guidance | Accessibility considerations | Status |
| --- | --- | --- | --- | --- |
| `primary` | Primary brand action and emphasis (e.g. primary CTA, active indicators). | Reserve for the single most important action per context. Do not use for body text or large backgrounds unless the confirmed palette supports it. | Must meet contrast requirements against its background in button/link use. Never rely on `primary` hue alone to communicate state. | **Requires Confirmation** (exact value) |
| `secondary` | Supporting brand emphasis. | Use sparingly for secondary actions or accents. Must not compete with `primary` in decision contexts. | Same contrast obligations as `primary` wherever text or essential UI depends on it. | **Requires Confirmation** (exact value) |
| `background` | Page background. | One quiet page background across the public site. Sections vary through spacing and surface tokens, not competing page colors. | Must provide sufficient contrast with `text-primary` and `text-secondary`. | **Requires Confirmation** (exact value) |
| `surface` | Card, panel, and raised-content background. | Use for cards, FAQ items (if surfaced), CMS panels, and dialog panels. Keep surfaces quiet so photography leads. | Text placed on `surface` must meet the same contrast rules as text on `background`. | **Requires Confirmation** (exact value) |
| `elevated-surface` | Overlays and floating layers (header where applicable, dropdowns, dialogs, mobile menu). | Use only where layering genuinely exists. Do not elevate static content for decoration. | Overlay text and controls must remain readable; scrim/overlay opacity must not wash out focus indicators. | **Requires Confirmation** (exact value) |
| `text-primary` | Main body and heading text. | Default for headings, paragraphs, list content, and labels. | Highest contrast pairing; primary readability guarantee. | **Requires Confirmation** (exact value) |
| `text-secondary` | Supporting text (e.g. descriptions, metadata, helper text). | Use for de-emphasized but still readable content. Never for required instructions or error text. | Must still meet readability contrast; de-emphasis is achieved through hierarchy and spacing, not by dropping below readable contrast. | **Requires Confirmation** (exact value) |
| `text-muted` | Least-emphasized text (e.g. captions, timestamps, legal footnotes). | Use only for genuinely ancillary information. Never for form labels, required indicators, errors, or CTA text. | Must remain readable; if a muted value cannot meet contrast on its background, the content must use `text-secondary` instead. | **Requires Confirmation** (exact value) |
| `border` | Input borders, card borders, dividers requiring structure. | One restrained border treatment. Borders define structure; they are not decoration. | Border alone never communicates state; pair with text/icon cues for errors, focus, and active states. | **Requires Confirmation** (exact value) |
| `divider` | Horizontal/vertical separation between sections, list items, footer groups. | Prefer spacing over lines; use dividers only where grouping is ambiguous without them. | Dividers are decorative separation and must not be the only cue for required structure (e.g. required form grouping uses labels and text). | **Requires Confirmation** (exact value) |
| `success` | Successful outcomes (inquiry success, CMS save confirmation). | Always paired with explicit success text and, where appropriate, an icon. Never color-only. | Text using `success` must meet contrast; the message must be understandable with color removed. | **Requires Confirmation** (exact value) |
| `warning` | Cautionary states (e.g. unsaved changes, destructive-action confirmation context). | Use sparingly; do not overuse warnings for routine information. Pair with text/icon. | Same color-independence rule as `success`/`error`. | **Requires Confirmation** (exact value) |
| `error` | Errors and validation failures. | Always paired with field-associated error text and, where appropriate, an icon. Never color-only. | Error text must meet contrast and be programmatically associated with the relevant field. | **Requires Confirmation** (exact value) |
| `focus` | Keyboard focus indication. | Visible on every interactive element when focused via keyboard. May be a standard outline treatment; must be perceivable independently of hover styling. | Focus must be perceivable by keyboard users and must not rely on color alone (e.g. outline width/style in addition to hue). | **Requires Confirmation** (exact treatment) |
| `disabled` | Disabled buttons, inputs, and actions. | Reduced emphasis plus non-color cues (e.g. cursor/opacity convention applied consistently, and explicit text where the reason matters). | Disabled text must still be legible; disabled state must not be confused with placeholder or muted content. | **Requires Confirmation** (exact value) |

Rules:

- Use semantic tokens, never hardcoded repeated visual values (see Section 35).
- Feedback roles (`success`, `warning`, `error`, `focus`) are never communicated through color alone (see Sections 22, 30).
- A provisional palette may be discussed with the client only if clearly labelled as a **proposal requiring client confirmation** — it must not be recorded as the production system until confirmed.

---

## 6. Typography System

No final font families are confirmed in the existing project documentation. This section defines the **hierarchy and responsibilities** of each typographic role without inventing final font-family names. All font-family selections are **Requires Confirmation**.

There is exactly one typography hierarchy. Do not create competing systems.

| Role | Purpose | Hierarchy guidance | Readability guidance | Responsive considerations |
| --- | --- | --- | --- | --- |
| Display / hero | Homepage and key page hero statement. | Single most prominent text per page; used sparingly (typically once). Sits above the H1 conceptually or embodies the H1; the page still exposes exactly one H1 per REQ-SEO-005. | Short lines; generous spacing below; never long paragraphs at display size. | Scales down clearly on mobile (see Section 7); never causes horizontal overflow. |
| H1 | Page topic. | Exactly one per public page, reflecting the page topic. | Descriptive for humans first; search benefit follows from clarity. | Mobile size remains clearly the page title without overwhelming the viewport. |
| H2 | Major section headings. | Direct children of the page narrative; logical nesting under H1. | Describe the section for scanners; keep concise. | Spacing above/below adjusts per Section 8; size steps down on mobile. |
| H3 | Subsection headings. | Nested under the relevant H2; used for services, packages, FAQ grouping, CMS section titles. | Consistent treatment across cards and sections at the same level. | Same size or slightly reduced on mobile; hierarchy preserved through spacing as well as size. |
| H4 | Minor headings (e.g. card sub-headers, CMS sub-panels, legal sub-sections). | Lowest heading level in routine use; deeper nesting is avoided. | Only where structure genuinely requires four levels; otherwise use H3 or body emphasis. | No separate mobile treatment beyond the general scale. |
| Body | Paragraphs, lists, FAQ answers, package inclusions, legal prose. | Default reading text; comfortable line length (see Section 9). | Short paragraphs; lists for inclusions and steps; no walls of text. | Base size remains readable on mobile without zooming; line length constrained by the readable text width. |
| Small / body-secondary | Supporting descriptions, helper text, metadata. | Subordinate to body; never for primary messages or required instructions. | Keep brief; must still meet contrast (see `text-secondary` rule). | No smaller than remains comfortably readable on mobile. |
| Caption | Image captions, timestamps, footnotes, CMS metadata. | Ancillary only; never for labels, errors, or CTA text. | Minimal use; if it must be read to act, promote it to small/body-secondary. | Same minimum-readability constraint as small text. |
| Button / label | CTA text, form labels, navigation items, table headers. | Emphasis treatment distinguishing actions and labels from body prose. | Labels are concise and outcome-oriented; buttons describe the destination or outcome. | Touch targets and spacing adapt per Sections 10 and 30; label text itself does not shrink below readability. |
| Navigation | Header, mobile menu, footer, CMS sidebar items. | Consistent weight and treatment across header, menu, footer, and admin navigation. | Active/current state uses text/structural cues in addition to any visual treatment. | Header collapses to the menu pattern on mobile; navigation text remains legible at all viewports. |

Font-family selection, including any display versus body pairing, is **Requires Confirmation**. Do not invent final font-family names merely because they are common on luxury or event websites.

---

## 7. Type Scale and Responsive Typography

The scale below is a **design-system decision** (not an existing project fact). It is intentionally small and maintainable: seven steps covering display through caption, with responsive behavior defined by rule rather than dozens of tokens.

Design-system scale (relative steps, not pixel mandates):

- `display` — hero statement; largest step; homepage and key heroes only.
- `h1` — page title; one step below display.
- `h2` — section heading; clearly subordinate to H1.
- `h3` — supporting heading; clearly subordinate to H2.
- `body` — base reading size; the reference step for the scale.
- `small` — supporting text; one step below body; minimum for required information.
- `caption` — ancillary text; smallest step; never for required information.

Rules:

- Avoid excessive sizes and dozens of tokens. If a design calls for a size outside these seven steps, justify it as a recurring need under Section 35 or use the nearest existing step.
- Typography adapts naturally across mobile/tablet/desktop: display, H1, and H2 step down on narrow viewports; body and small remain readable without zooming; no text requires horizontal scrolling at any supported viewport.
- Hierarchy is communicated through size **plus** spacing and order — not size alone — so structure survives responsive scaling and reduced-motion or high-contrast user settings.
- Line length for body prose is constrained by the readable text width (Section 9), not by viewport width alone.

---

## 8. Spacing System

A single token-based spacing scale. This scale is a **design-system decision**, kept intentionally small.

Token ladder (relative steps):

- `space-3xs` — tight intra-component gaps (e.g. label-to-hint, icon-to-text).
- `space-2xs` — compact gaps (e.g. list-item spacing, chip/metadata gaps).
- `space-xs` — default content gaps (e.g. paragraph-to-list, card-internal secondary gaps).
- `space-sm` — component spacing (e.g. card padding, form field gaps).
- `space-md` — section-internal spacing (e.g. heading-to-content, package card groups).
- `space-lg` — section spacing (between major page sections).
- `space-xl` — page-level rhythm (e.g. hero-to-content, pre-footer separation).

Usage:

- **Page padding:** standard horizontal page padding (Section 9) plus `space-lg`/`space-xl` vertical rhythm between sections.
- **Section spacing:** `space-lg` between sections on desktop; reduced to `space-md` on mobile where the same grouping remains clear.
- **Component spacing:** `space-sm` for card padding and form field gaps; `space-xs` for internal content gaps.
- **Form spacing:** consistent vertical gap between fields (`space-sm`); tighter gap between a label and its control (`space-3xs`); error text sits directly below its field with `space-3xs`.
- **Card spacing:** uniform internal padding per card type; identical card types share identical padding (see Section 34).
- **Navigation spacing:** comfortable header padding and menu item gaps; mobile menu items receive larger touch-friendly spacing than desktop links.
- **Content gaps:** `space-xs` between paragraphs/lists and their headings unless a closer visual association is intended.

Rules:

- Do not create dozens of nearly identical spacing values. Use the nearest token; introduce a new step only under Section 35 governance.
- Reduce spacing on mobile by stepping down one level (e.g. `space-lg` → `space-md`) where grouping stays clear. Never collapse spacing so far that hierarchy is lost.
- Spacing indicates grouping: related elements sit closer than unrelated elements at every viewport.

---

## 9. Layout and Container System

- **Content container.** A single centered container wraps page content. Full-bleed treatments (e.g. hero imagery, gallery bands) break out deliberately; text content stays within the container.
- **Maximum content width.** One design-system maximum content width applies to standard marketing content. Wide media grids (gallery, package grids) may use a wider but still bounded measure. This value is a design-system decision; keep it singular and simple.
- **Readable text width.** Body prose (About, FAQ answers, legal pages, package conditions) uses a narrower readable measure than the full container so line lengths stay comfortable. This is a readability rule, not a second layout framework.
- **Full-width sections.** Reserved for genuine full-bleed needs (hero, wide gallery bands). Content within full-width sections still aligns to the container or the readable measure; full-width never means edge-to-edge text.
- **Standard horizontal page padding.** One consistent horizontal padding applies at each viewport tier (mobile, tablet, desktop). Padding scales with the viewport but the token is singular per tier.
- **Section rhythm.** Consistent vertical rhythm between sections (`space-lg`/`space-xl` desktop, stepped down on mobile). The homepage sequence in `docs/UI-UX.md` (hero → inquiry CTA → services → packages → gallery → trust → FAQ → final CTA → footer) follows this rhythm without exception.
- **Grid behavior.** Grids reflow by column count (see Section 11); they never cause horizontal overflow. Admin tables or wide editing surfaces reflow or scroll within their own region without breaking the overall layout.
- **Alignment principles.** Left-aligned body text as the default; centered alignment reserved for heroes, closing CTAs, empty states, and confirmation messages. Mixed alignment within a single section is avoided.

The system supports marketing pages, image-heavy sections, package cards, FAQ content, inquiry forms, and CMS screens without fixed layouts that overflow.

---

## 10. Responsive Breakpoints

A small, practical breakpoint strategy with semantic names. Breakpoints are driven by layout needs, not specific device models. Exact values are design-system decisions; keep the system to four tiers.

| Breakpoint | Intent |
| --- | --- |
| `mobile` | Base. Single-column layouts; stacked forms; compact header with menu trigger; full-width CTAs where appropriate. |
| `tablet` | Two-column sections and early multi-column grids become comfortable; header may still use the mobile menu pattern if space requires. |
| `desktop` | Full multi-column grids (services, packages, gallery); persistent horizontal navigation; two-column content/media splits. |
| `large-desktop` | Cap content at the maximum content width; increase whitespace rather than stretching line lengths or grids indefinitely. |

Documented transitions:

- **Navigation transition.** Persistent horizontal header navigation on `desktop` and above; compact header with an accessible menu trigger below that. Both expose the same principal destinations.
- **Grid changes.** Single column on `mobile`; two columns on `tablet` for suitable grids; full multi-column (typically three) on `desktop`. Gallery reflows without category filters.
- **Typography adjustments.** Display, H1, and H2 step down below `tablet`; body/small sizes hold steady for readability.
- **Spacing adjustments.** Section spacing steps down one level on `mobile` (Section 8).
- **Form layout.** Single-column stacked fields on `mobile`; multi-column field rows only where genuinely helpful on `tablet`/`desktop`, with labels remaining associated and visible.
- **Card layout.** Cards stack vertically on `mobile` with full-width CTAs where appropriate; multi-column card grids on `tablet`/`desktop` with equal treatment per card type.

Avoid excessive breakpoints. If a layout needs a value between tiers, prefer adjusting content (e.g. column count, gaps) over adding a new breakpoint.

---

## 11. Grid and Composition

Reusable layout patterns (all stack to a single column on `mobile` unless noted):

- **Two-column sections.** Content/media splits (e.g. service description plus imagery, About narrative plus supporting photo). Media and text share the row on `desktop`; stack with text first (or the confirmed reading order) on `mobile`.
- **Three-column cards.** Services overview, package grids, supporting content. Equal-width columns on `desktop`; two columns on `tablet` where comfortable; single column on `mobile`.
- **Gallery grids.** Responsive image grid with stable reserved space per cell (no layout shift on load). Column count follows the breakpoint rules; aspect ratios handled per Section 20.
- **Package grids.** Self-contained package cards with identical information order (name → duration → price → inclusions → conditions → CTA). Grids never imply that selecting a package reserves it.
- **Content/media split layouts.** Asymmetric splits are allowed (e.g. narrower text with wider imagery) but limited to one or two ratios; arbitrary per-section ratios are avoided.
- **Centered content.** Heroes, closing CTAs, empty states, confirmations, and legal-page intros use the readable text width centered in the container.
- **Full-width sections.** Hero and wide media bands only; inner content still aligns to the container grid.

Rules:

- **Alignment.** Grid items align to a shared baseline grid; card headings, CTAs, and metadata align consistently within their card type.
- **Gaps.** One gap token per grid type, shared by all instances of that pattern (see Section 34).
- **Stacking on mobile.** Multi-column patterns stack vertically in logical reading order; no essential content is hidden.
- **Maximum content width.** Grids respect the container/maximum widths in Section 9; they do not stretch indefinitely on `large-desktop`.
- **Avoid overly dense layouts.** Generous gaps and section rhythm take precedence over fitting more items per row.

Do not create a separate layout framework. These patterns compose the container, spacing, and breakpoint systems above.

---

## 12. Surface, Borders, Radius, and Elevation

Applies to cards, panels, inputs, dialogs, dropdowns, navigation surfaces, and CMS panels.

- **Surfaces.** `surface` for cards, panels, and dialog bodies; `elevated-surface` for genuinely layered UI (header where layered, dropdowns, dialogs, mobile menu). Static content is not elevated for decoration.
- **Borders.** One restrained border treatment for cards, inputs, and panels. Borders define structure; focus, error, and active states add text/icon cues rather than relying on border color alone.
- **Radius scale (small, three steps — design-system decision).**
  - `radius-sm` — inputs, small controls, inline feedback chips.
  - `radius-md` — cards, panels, dialogs.
  - `radius-lg` — large media containers and hero treatments where the brand direction supports it; use sparingly.
- **Elevation scale (small, three steps — design-system decision).**
  - `elevation-0` — flat content (default for prose, static sections, CMS read views).
  - `elevation-1` — resting cards, panels, and inputs (subtle separation from the page background).
  - `elevation-2` — floating layers only (dropdowns, dialogs, mobile menu, header where layered).
- **Restraint.** Keep elevation restrained. Avoid excessive glassmorphism, gradients, floating effects, or decorative shadows unless explicitly justified by confirmed brand direction — none is currently confirmed, so none is part of this system.

---

## 13. Buttons

Reusable variants (limited set; do not create additional variants without a recurring need under Section 35):

- **Primary.** The single conversion action per context — making an inquiry. Visually the most prominent button where it appears. Used for the header inquiry CTA, hero CTA, package/service inquiry CTAs, closing CTAs, and form submission.
- **Secondary.** Supporting actions (e.g. view services, view packages, view gallery, learn more). Visually quieter than primary; never outranks primary in a decision context.
- **Tertiary / text.** Low-emphasis actions (e.g. secondary links styled as actions, CMS cancel, dialog secondary actions). Minimal chrome; label carries the meaning.
- **Destructive (CMS only, where needed).** Delete/remove actions. Visually distinct from secondary actions; always paired with explicit confirmation (see Section 27). Never used on the public marketing site.

For each variant, the following states apply where relevant (see also the states matrix, Section 33):

- **Visual hierarchy.** Primary outranks secondary outranks tertiary in the same context. Only one primary action per view.
- **Intended use.** As above; the same action always uses the same variant (Section 34).
- **Hover.** Perceivable change in addition to any color shift (e.g. surface/border treatment), so the state survives color-vision differences.
- **Focus.** Visible focus indicator per the `focus` token; perceivable by keyboard users; not color-only.
- **Active.** Pressed-state feedback distinct from hover and focus.
- **Disabled.** Reduced emphasis plus non-color cues; the control is non-interactive and programmatically marked as disabled. Disabled submit during inquiry submission prevents duplicates.
- **Loading.** Submission/save in progress: progress indication plus disabled repeat trigger. The label communicates waiting without depending on animation alone.
- **Icon placement.** Leading or trailing Lucide icon with consistent gap (`space-3xs`); icon is decorative where the label fully describes the action; icon-only buttons follow the icon-only requirements in Section 28.
- **Mobile behavior.** Comfortable touch targets; full-width primary CTAs where the layout calls for it; no horizontal overflow; labels wrap or truncate predictably without losing meaning.

---

## 14. Links

- **Standard text links.** Inline links within body prose (e.g. service-to-package references, FAQ answer cross-links). Visually distinguishable from ordinary body text at rest (not by color alone — e.g. underline or equivalent structural cue) as well as on hover and focus.
- **Navigation links.** Header, mobile menu, footer, and CMS sidebar items. Consistent treatment per Section 6 roles; current-page state uses text/structural cues in addition to any visual treatment and is programmatically exposed.
- **CTA links.** Links that act as calls to action (e.g. "View packages" leading to the Packages page). Follow the button/CTA hierarchy so secondary CTAs never outrank the primary inquiry CTA in decision contexts.
- **External links.** Google Business Profile links, the Google review CTA, and any confirmed external destinations. Labelled so the visitor understands the destination (in particular, the review CTA communicates that it leads to Google). External indication (text cue and, where appropriate, an icon) is used when leaving the site would otherwise surprise the visitor.
- **Legal links.** Privacy Policy and Terms & Conditions links in the footer and wherever policy context requires. Quiet but discoverable; identical treatment everywhere.

States:

- **Default.** Distinguishable from body text without interaction.
- **Hover.** Perceivable change beyond color alone.
- **Focus.** Visible focus indicator; same obligations as buttons.
- **Visited.** Standard visited treatment for navigational/content links where it aids orientation; never applied to actions (buttons, form submits, menu triggers).
- **Active / current.** Current-page or current-section indication with text/structural cues plus programmatic exposure for assistive technology.
- **External indication.** Applied where useful so visitors anticipate leaving the site.

---

## 15. Form Controls

Visual rules for text inputs, email inputs, telephone inputs, date inputs, select controls, textareas, and checkboxes/radios where required. Exact form fields remain controlled by confirmed requirements (REQ-INQ-008 through REQ-INQ-010); this section defines only visual treatment.

- **Label placement.** Visible label above or adjacent to every control, programmatically associated. Labels use customer-friendly wording. Never rely on placeholder text as the only label.
- **Placeholder usage.** Hints or examples only; never the label, never required instructions, never the error message.
- **Required indicators.** One consistent required indicator explained once near the form, plus per-field indication. Required state is text, not color-only.
- **Default.** Quiet surface with the standard border and `radius-sm`; label, input, helper text, and error-text slots follow identical geometry across control types.
- **Hover.** Subtle perceivable change distinct from focus.
- **Focus.** Visible focus indicator per the `focus` token; perceivable by keyboard users; not color-only. Focus order follows visual/logical order.
- **Disabled.** Reduced emphasis plus non-color cues; programmatically disabled; never confused with placeholder content.
- **Error.** Error text directly below (or adjacent to) the field with `space-3xs` gap, programmatically associated; border/surface change is secondary to the text. Errors are never color-only.
- **Success (where appropriate).** Used sparingly (e.g. confirmed valid state where the implemented flow calls for it); always text/icon plus color, never color alone.
- **Loading / submission.** Submission-in-progress state disables the submit trigger and communicates waiting; the form does not reset or navigate until the outcome is known.
- **Validation messages.** Plain, non-technical language describing what needs correction; shown near the relevant field with a summary where appropriate.

---

## 16. Inquiry Form Design

Applies the design system to the public inquiry form. Behavior and state sequencing follow `docs/UI-UX.md` Sections 13–14:

```text
Input
  ↓
Validation
  ↓
Submission
  ↓
Success / Failure
```

Visual treatment per state:

- **Default.** Ready for input. Labels, required/optional indication, and instructions visible. No errors or progress indicators. Single-column stacked layout on mobile; generous field gaps (`space-sm`).
- **Focus.** Visible focus per Section 15; focus order follows the form order; focus is never color-only.
- **Validation error.** Field-associated error text plus summary where appropriate; focus directed to the summary or first invalid field; entered values preserved. Errors never color-only; success is never implied.
- **Submitting.** Progress feedback plus disabled submit (duplicate-submission prevention). The form does not reset or navigate until the outcome is known. Progress is communicated through text as well as any indicator.
- **Success.** Clear confirmation plus next-step explanation (business follow-up). Reported only when the inquiry has been accepted for delivery to the client's Gmail. Programmatically exposed; focus managed to the confirmation; understandable with motion disabled.
- **Failure.** Clear, non-technical message with next-step guidance (e.g. retry or use an alternative confirmed contact path). Technical details never exposed. Entered information preserved where practical.
- **Spam verification failure.** Non-technical "could not be verified" message with a reasonable next step (e.g. try again). Verification internals never exposed.
- **Network failure.** Clear connection-problem message with retry guidance; entered information preserved where practical.

The design must not falsely communicate success. Failure never presents as success under any visual treatment.

The form prioritizes clarity over decorative styling: quiet surfaces, consistent control geometry, explicit labels, and text-led feedback throughout.

---

## 17. Cards

Reusable card pattern for services, packages, supporting content, and CMS content where appropriate.

Structure (same order for every card of a given type):

1. Optional image (top; aspect-ratio handling per Section 20).
2. Heading (consistent level per card type — typically H3 in grids).
3. Body/description (concise; lists for inclusions).
4. Optional metadata (duration, conditions, supporting labels).
5. Optional CTA (single action; inquiry path for services/packages).

Rules:

- **Clear hierarchy.** Heading outranks body outranks metadata in every card.
- **Predictable padding.** Identical card types share identical internal padding (`space-sm` default). Do not tune padding per instance.
- **Consistent heading treatment.** Same card type uses the same heading level and style.
- **Optional image.** Only genuine, relevant imagery with accurate alt text; never stock presented as client events.
- **Optional metadata.** Brief and factual; confirmed content only.
- **Optional CTA.** One action per card; inquiry CTAs use the primary variant in decision contexts.

Avoid making every section a card. Prose sections (About narrative, FAQ answers, legal pages) remain plain content. Cards must not become visually heavy: flat or `elevation-1` surfaces, one border treatment, and whitespace rather than chrome.

---

## 18. Navigation and Header

### 18.1 Desktop

- **Logo.** Site identifier linking to the homepage from every page. Placement is stable across pages. Exact logo treatment is **Requires Confirmation**.
- **Navigation links.** Principal destinations (Home, Services, Packages, Gallery, About, FAQ, Contact/inquiry) in stable information-architecture order. Consistent typography per the navigation role.
- **Active state.** Current-page indication with text/structural cues in addition to any visual treatment, programmatically exposed for assistive technology.
- **Inquiry CTA.** Distinct primary-variant action alongside navigation links; visually outranks secondary navigation without overwhelming the header.
- **Header spacing.** Comfortable horizontal padding and vertical rhythm shared with the page container; header content aligns to the container grid.
- **Header surface.** Page background or `elevated-surface` where layering over content genuinely exists; single treatment used consistently.

### 18.2 Mobile

- **Compact header.** Preserves brand identity, the inquiry CTA (or a clear path to it), and a single menu trigger without crowding the viewport.
- **Menu trigger.** Real button with an accessible name reflecting purpose and state; operable by touch, mouse, and keyboard; practical touch target.
- **Mobile menu surface.** `elevated-surface` layer with comfortable item spacing; same principal destinations as desktop in the same order; inquiry path reachable without excessive scrolling or nesting.
- **Active state.** Same current-page treatment as desktop.
- **Inquiry CTA.** Easy to access from or alongside the menu; never hidden behind multiple interactions.

Visual states remain accessible and consistent with `docs/UI-UX.md` Section 6. This document does not define interaction behavior beyond visual state treatment; where behavior is concerned, `docs/UI-UX.md` governs.

---

## 19. Footer

- **Hierarchy.** Brand/context line first, then navigation groups, then business information, then legal and review references. One clear reading order; no competing visual weights.
- **Navigation grouping.** Principal destinations grouped per the information architecture, plus legal pages (Privacy Policy, Terms & Conditions). The footer introduces no destinations absent from the architecture.
- **Legal links.** Quiet, consistent treatment identical everywhere legal links appear.
- **Business information.** Confirmed contact/service-area information only; unconfirmed details omitted rather than filled with placeholders.
- **Review CTA where appropriate.** Secondary treatment; labelled as leading to Google; never competes with the inquiry CTA.
- **Visual separation.** Quiet divider or surface shift separating the footer from page content; the footer feels like part of the same design system, not a separate template — same tokens, typography, spacing, and feedback patterns.

---

## 20. Gallery and Media

- **Gallery grid.** Responsive grid per Sections 10–11; no category filters (none are defined). Stable reserved space per cell so loading does not cause large layout shifts.
- **Aspect-ratio handling.** Consistent aspect-ratio treatment per gallery context; images fill their containers without distortion and without cropping essential content. One ratio convention per gallery surface; do not mix arbitrary ratios in the same grid.
- **Image containers.** Quiet containers (`radius-lg` sparingly or `radius-md`); no heavy borders or shadows competing with photography.
- **Image loading.** Progressive appearance with reserved space; below-the-fold images may lazy-load where it helps performance without harming UX or SEO. Loading never produces broken layouts.
- **Hover behavior (where appropriate).** Subtle and non-essential; never the only path to information or interaction. No hover-only controls.
- **Lightbox / dialog presentation (if implemented).** Accessible dialog visuals: dimmed overlay, centered panel, clearly visible close control, and adjacent-image navigation controls (if offered) with accessible names and position information. The grid remains fully usable without the lightbox.
- **Close controls.** Clearly visible, practically sized, keyboard-focusable close control on every dialog/lightbox.
- **Navigation controls (if implemented).** Previous/next controls with accessible names, visible focus, and position information; keyboard-operable.

Prioritize photography. Avoid excessive overlays and decorative effects that compete with images. Accessibility and interaction requirements from `docs/UI-UX.md` Section 10 govern behavior; this section governs visual presentation only.

---

## 21. FAQ

- **FAQ list.** Single-column list within the readable text width; consistent item gaps (`space-sm`); plain list or accordion per the confirmed implementation — both are acceptable.
- **Question.** Real button (if accordion) or proper heading (if static list); visually and structurally distinguishable from answers; tappable with practical touch targets on mobile.
- **Answer.** Readable body text; concise; cross-links to services, packages, or inquiry where helpful; never contradicts confirmed service, package, or policy information.
- **Expanded state.** Answer visible; state communicated through text/structural cues in addition to any icon; programmatically exposed.
- **Collapsed state.** Answer hidden; the question clearly affords expansion without relying on color or icon rotation alone.
- **Focus.** Visible focus indicator on every toggle; same obligations as buttons and links.
- **Hover.** Subtle perceivable change distinct from focus.

If accordion behavior is used, the visual design communicates state without relying only on color or icon rotation.

---

## 22. Alerts and Feedback

Reusable visual patterns for success, error, warning, and informational feedback, plus validation feedback:

- **Success.** Confirmation text plus supporting icon where appropriate; `success` role plus `surface` treatment; used for inquiry success and CMS save confirmation. Reported only when the underlying outcome actually succeeded.
- **Error.** Field-associated or page-level error text plus icon where appropriate; `error` role; never exposes technical details. Page-level errors sit in a prominent, consistent location; field-level errors sit with their fields.
- **Warning.** Cautionary text plus icon; `warning` role; reserved for genuinely cautionary states (e.g. unsaved changes, destructive-action context). Not used for routine information.
- **Informational.** Neutral text plus icon where appropriate; quiet surface; used for helpful context that is neither success, warning, nor error.
- **Validation feedback.** Follows Section 15: field-associated text, summary where appropriate, focus management to the summary or first invalid field, entered values preserved.

Rules:

- Never rely on color alone; every feedback state includes meaningful text and, where appropriate, iconography.
- Maintain sufficient contrast for all feedback text on its background.
- Remain readable on mobile; feedback reflows alongside its context without horizontal scrolling.
- Do not overuse alerts; routine information uses plain content, not alert chrome.

---

## 23. Loading States and Skeletons

- **Page-level loading (where genuinely required).** Only where asynchronous behavior genuinely exists. Static server-rendered content is simply present; artificial loading screens are prohibited.
- **Content loading.** Indicator or lightweight skeleton preserving layout stability; surrounding content does not reflow when loaders appear or resolve.
- **Gallery loading.** Stable reserved grid space; individual images appear progressively without breaking the grid or causing large layout shifts.
- **Form submission.** Submission-in-progress state with disabled repeat trigger (Sections 15–16).
- **CMS loading.** Content fetching shows loading feedback; pending operations disable conflicting actions.
- **CMS save.** Save-in-progress feedback; the outcome always resolves into a clear success or failure message.
- **Media upload.** Progress indication with success/failure confirmation; removal requires confirmation.

Skeletons:

- Preserve layout (same geometry as the content they stand in for).
- Are lightweight (no heavy animation or extra dependencies).
- Avoid excessive animation (subtle or static preferred).
- Respect reduced motion (non-essential animation disabled under `prefers-reduced-motion`).
- Never appear for content that is already server-rendered and immediately available.

Do not introduce loaders simply for visual effect.

---

## 24. Empty States

Consistent visual pattern (centered content within the readable measure; quiet surface; concise heading plus one-line explanation plus a single next-step action where one exists):

- **Empty gallery.** Clear statement that no images are available; no broken layout or error; never promises imagery that does not exist.
- **Missing optional content.** Optional supporting content (testimonials, add-ons, FAQ entries) is simply omitted when absent; where a section would otherwise be empty, a sensible fallback (e.g. directing visitors to inquire) replaces it.
- **Empty CMS lists.** Clear statement that no items exist yet, with guidance toward creating content where the CMS scope supports it.
- **Empty inquiry records (if persistence is implemented).** Clear statement that no inquiries exist yet. Persistence itself is conditional and must not be assumed.

Empty states are clear, concise, helpful, visually intentional, and non-technical. They never expose raw database or API errors, and they never use placeholder business content to fill the gap.

---

## 25. Error States

- **Form errors.** Field-associated text plus summary where appropriate; focus management; entered values preserved (Sections 15–16).
- **Page / content errors.** Prominent, consistent page-level placement; plain non-technical language; actionable next step (retry, correct input, return to valid content).
- **CMS errors.** Clear statement that content was not saved or loaded, plus what to do next; entered edits preserved during recoverable failures where practical.
- **Media errors.** Absent or failed images do not break layout; surrounding content remains intact; no raw error or broken-image icon as the primary presentation.
- **Network failures.** Clear connection-problem message with retry guidance; no data-loss surprises where practical.
- **Authentication / session failures.** Plain-language notice with guidance back to sign-in; unsaved work preserved where practical; the user is never silently left on a non-functional surface.

Errors are visually distinct (feedback roles plus text/icon cues) while remaining consistent with accessibility requirements: never color-only, always programmatically exposed where behavior requires it, with focus managed to page-level summaries or the first invalid field.

Never expose technical implementation details (stack traces, status codes, endpoint names, query information, secrets) through the visual system.

---

## 26. CMS/Admin Design System

The CMS shares the overall brand/design language but prioritizes usability over marketing aesthetics.

- **Admin shell.** Quiet chrome: consistent header, navigation region, and content region using the same color roles, typography, spacing, and focus treatment as the public site. No decorative marketing layouts.
- **Sidebar / navigation.** Business-language labels (e.g. Services, Packages, Gallery, FAQs, business information — only confirmed areas); current location always clear with the same active-state treatment as the public navigation.
- **Page headers.** Consistent title plus context (what is being edited, draft versus published state where the workflow defines it) plus primary actions.
- **Content panels.** `surface` panels with `radius-md` and `elevation-0`/`elevation-1`; one content area per view; editable content visually separated from read-only status/metadata.
- **Forms.** Same control geometry, labels, validation, and feedback patterns as the public inquiry form (Sections 15–16), with non-technical language throughout.
- **Action bars.** Predictable placement for primary actions (save, cancel); primary save action uses the primary variant; cancel uses tertiary/text; destructive actions use the destructive variant and never sit where an accidental click lands on them.
- **Save / cancel actions.** Explicit save with clear success/failure feedback; explicit cancel that never silently saves; unsaved changes clearly indicated; discarding changes requires client intent.
- **Tables / lists (where necessary).** Simple rows with clear headings; reflow or region-contained scroll on small screens without breaking the admin layout; primary actions remain reachable.
- **Confirmation dialogs.** Per Section 27; destructive confirmations name the affected content in business terms.
- **Status indicators.** Text-plus-visual treatment for draft/published/saving/error states; never color-only.
- **Empty states.** Per Section 24; non-technical and actionable.
- **Loading states.** Per Section 23; pending save/delete/upload operations disable their triggers.
- **Error states.** Per Section 25; non-technical with next-step guidance.

The admin interface must not become an overly decorative "luxury dashboard." It feels practical, clean, professional, predictable, and easy for a non-technical client to use.

Do not invent CMS modules or fields. Exact editable areas, modules, and field definitions require confirmation and belong in requirements confirmation, `docs/DATA-MODEL.md`, and implementation.

---

## 27. Dialogs and Confirmations

Visual patterns for lightbox, confirmation dialogs, destructive-action confirmations, and session-expiration notifications where needed:

- **Overlay.** Dimmed scrims that de-emphasize background content; background content is not interactable while the dialog is open.
- **Panel.** `surface` (or `elevated-surface`) panel with `radius-md` and `elevation-2`; centered; readable text width; stable on mobile without horizontal overflow.
- **Heading.** Clear heading stating the purpose (e.g. what will be deleted, what the lightbox shows).
- **Body.** Concise non-technical explanation, naming affected content in business terms for destructive actions.
- **Actions.** Right- or bottom-aligned action row with consistent order: safe/secondary action plus primary or destructive confirmation. Destructive confirmations use the destructive variant; safe dismissal uses tertiary/text or secondary.
- **Close control.** Clearly visible, practically sized, keyboard-focusable close control on every dialog.
- **Focus indication.** Visible focus throughout; focus moves into the dialog on open, stays trapped predictably while open per `docs/UI-UX.md` behavior, and returns to the invoking element on close.
- **Destructive action hierarchy.** Destructive actions are visually distinct from ordinary secondary actions and never look identical to them. Destructive operations always require explicit confirmation.

---

## 28. Icons

The selected icon library is **Lucide React**. No other icon library is introduced.

- **Icon sizing principles.** A small set of icon sizes tied to context (inline-text icons, button icons, navigation icons, dialog/empty-state icons). Icons scale with their context; arbitrary per-instance sizes are avoided.
- **Alignment.** Icons align to text baselines and control centers consistently; icon-text pairs share one gap token (`space-3xs`).
- **Stroke consistency.** Single Lucide stroke convention throughout; do not mix custom-drawn icons or competing stroke weights.
- **Use with text.** Icons support labels; they accompany text on CTAs, navigation (where used), feedback states, and CMS actions. Icon choice is consistent per meaning (e.g. one success icon, one error icon, one close icon everywhere).
- **Icon-only button requirements.** Every icon-only button (menu trigger, close controls, lightbox navigation) exposes a meaningful accessible name, a practical touch target, and a visible focus state. Icon-only buttons are never the sole carrier of required information without an accessible name.
- **Decorative vs semantic icon usage.** Decorative icons are hidden from assistive technology through the implemented mechanism; semantic icons (success, error, warning, state changes) are paired with text and programmatically exposed where behavior requires it.

Icons support comprehension rather than replacing necessary text.

---

## 29. Motion System

The selected animation library is **Motion**. No other animation library or ad hoc animation infrastructure is introduced.

Restrained motion system:

- **Page / section entrance.** Subtle, brief entrance transitions only; content is never gated on animation completing.
- **Hover feedback.** Immediate, lightweight state-change feedback on buttons, links, and cards.
- **Button feedback.** Pressed-state indication distinct from hover and focus.
- **Menu transitions.** Brief open/close transitions that never trap the user or delay navigation.
- **Accordion transitions.** Brief expand/collapse transitions; state remains fully understandable with motion disabled.
- **Dialogs / lightbox.** Brief open/close transitions with focus management per `docs/UI-UX.md`; dismissal (including Escape) is never delayed by animation.
- **Loading indicators.** Minimal progress indication; text communicates waiting independently of animation.

Motion standards (design-system decisions):

- **Motion purpose.** Feedback and polish only. No auto-playing, looping, or attention-seeking effects; no animation on long content sequences.
- **Duration categories.** Three small categories — `instant` (state changes with no meaningful transition), `quick` (hover, button, accordion, menu), and `settled` (dialog/lightbox entrance at most). Keep durations brief; do not create dozens of animation tokens.
- **Easing philosophy.** Calm, simple easing that settles without bounce or overshoot. One default easing; special easings require justification.
- **Reduced-motion behavior.** Under `prefers-reduced-motion`, non-essential animation is disabled or reduced to an instant state change. Essential state changes remain communicated through text and structure, never through motion alone.

Motion must never delay access to content or critical interaction.

---

## 30. Accessibility Visual Standards

Visual requirements supporting the accessibility behavior in `docs/UI-UX.md` Section 18 and `docs/REQUIREMENTS.md` (REQ-ACC-004 through REQ-ACC-011):

- **Contrast.** Text and essential UI meet appropriate contrast for readability on their backgrounds. De-emphasized text (`text-secondary`, `text-muted`) never drops below readability; if a muted value cannot meet contrast, the content uses `text-secondary` instead.
- **Focus indicators.** Always perceivable for keyboard users; present on every interactive element; never communicated through color alone.
- **Error states.** Text plus icon/cue in addition to any color treatment; field-associated and summarized where appropriate; focus managed to the summary or first invalid field.
- **Success states.** Text confirmation in addition to any visual treatment; reported only on actual success.
- **Disabled states.** Legible, non-interactive, programmatically marked; visually distinct from placeholder and muted content.
- **Text hierarchy.** Heading levels, order, and spacing communicate structure independently of color or size alone.
- **Touch targets.** Practical sizes and spacing for menu triggers, CTAs, FAQ toggles, lightbox controls, and form controls on touch as well as mouse and keyboard.
- **Icon-only controls.** Meaningful accessible names, practical targets, visible focus; never the sole carrier of required information without a name.
- **Form controls.** Associated visible labels; required/optional text indication; instructions and error text associated with their fields; placeholders never the only label.
- **Dialogs.** Visible close controls, focus indication, focus management, Escape dismissal, and background inertness per `docs/UI-UX.md`.
- **Navigation states.** Current-page and menu open/close states use text/structural cues plus programmatic exposure, never color alone.

Do not claim WCAG certification. Any conformance claim requires actual evaluation, which is not defined here.

---

## 31. Image and Asset Guidelines

- **Aspect ratios.** One ratio convention per surface (gallery grid, service imagery, hero, cards). Ratios are consistent within a surface; arbitrary per-image ratios in the same grid are avoided.
- **Image cropping.** Cropping preserves essential content; faces, booth setups, and key subjects are never cropped out by container ratios. If an image cannot be presented without hiding essential content, the container treatment changes — not the image content.
- **Image quality.** Web-appropriate formats, sizing, and compression; full-resolution originals are never served directly as page content. Quality balances visual polish with performance and Core Web Vitals considerations.
- **Responsive presentation.** Images scale without distortion or horizontal overflow; responsive sources serve appropriate sizes per viewport; below-the-fold images may lazy-load where it helps without harming UX or SEO.
- **Object positioning.** Consistent focal-point handling so subjects remain visible across viewports; no ad hoc per-image positioning that breaks the grid rhythm.
- **Gallery imagery.** Real event imagery supplied or approved by the client, with accurate descriptive alt text reflecting actual content. Stable grid cells; progressive appearance; clear empty state when no images exist.
- **Hero imagery.** Genuine event photography where available; quiet treatment so the value proposition and CTA remain legible; no heavy overlays or effects competing with the message.
- **Decorative imagery.** Minimal; treated as decorative through the implemented mechanism (no misleading alt text); never carries required information.

Prioritize real event photography. Do not use stock imagery as if it represents the client's actual events. Do not invent image assets.

---

## 32. Content Presentation Rules

- **Headings.** One H1 per page reflecting the page topic; logical H2/H3 nesting; descriptive for humans first. Heading styles follow the typography hierarchy (Section 6) consistently — same level, same treatment.
- **Paragraphs.** Short, focused paragraphs; generous spacing; readable text width for long-form content (About, FAQ answers, legal pages).
- **Lists.** Inclusions, steps, and option summaries use lists, not dense paragraphs. Package inclusions, service points, and FAQ-adjacent details are list-led and scannable.
- **Quotes / testimonials (when approved).** Shown only where approved with verified current data. Quiet presentation (body text with clear attribution); never fabricated, never given visual weight that implies verified ratings without verified data.
- **Pricing information.** Shown only as confirmed by the client. Price, duration, and conditions presented together; no invented prices, deposits, or policies; unconfirmed packages direct visitors to inquire rather than showing placeholder tables as fact.
- **Package inclusions.** List format with consistent order across packages; confirmed content only; optional extras (add-ons) visually separated from base inclusions where confirmed.
- **Metadata.** Duration, conditions, locations, and supporting labels in small/body-secondary treatment; brief and factual; never carries required instructions.
- **Supporting labels.** Required/optional indicators, section eyebrows (where used), and CMS status labels use the button/label role with consistent treatment.
- **CTA placement.** Inquiry CTAs at decision points (hero, services, packages, contact, page close); supporting content does not carry a CTA in every subsection; the review CTA is secondary and never displaces the inquiry CTA.

The system makes content easy to scan. It does not define final copy and does not introduce unconfirmed business information.

---

## 33. States Matrix

Common component state model. Not every component needs every state — applicability is marked per row. Legend: **●** applicable, **○** not typically applicable.

| Component | Default | Hover | Focus | Active | Disabled | Loading | Error | Success |
| --------- | ------- | ----- | ----- | ------ | -------- | ------- | ----- | ------- |
| Primary button | ● | ● | ● | ● | ● | ● (submitting) | ○ (form-level error messaging, not button error state) | ○ (form-level success messaging) |
| Secondary button | ● | ● | ● | ● | ● | ○ (rare; only if the action is async) | ○ | ○ |
| Tertiary / text button | ● | ● | ● | ● | ● | ○ | ○ | ○ |
| Destructive button (CMS) | ● | ● | ● | ● | ● | ● (delete/save in progress) | ○ (dialog-level error messaging) | ○ |
| Standard text link | ● | ● | ● | ● | ○ | ○ | ○ | ○ |
| Navigation link | ● | ● | ● | ● (current) | ○ | ○ | ○ | ○ |
| CTA link | ● | ● | ● | ● | ○ | ○ | ○ | ○ |
| Text / email / tel / date input | ● | ● | ● | ○ | ● | ○ | ● | ○ (only where the flow defines valid-state styling) |
| Select | ● | ● | ● | ○ | ● | ○ | ● | ○ |
| Textarea | ● | ● | ● | ○ | ● | ○ | ● | ○ |
| Checkbox / radio (where required) | ● | ● | ● | ○ | ● | ○ | ● | ○ |
| Inquiry form (composite) | ● | ○ | ● (field focus) | ○ | ○ | ● | ● | ● |
| Cards (service / package) | ● | ● (subtle, non-essential) | ● (when interactive/contains focusable CTA) | ○ | ○ | ○ | ○ | ○ |
| FAQ toggle | ● | ● | ● | ○ | ○ | ○ | ○ | ○ |
| Dialog / lightbox | ● (open) | ○ | ● (focus management) | ○ | ○ | ○ | ○ (dialog-level error where applicable) | ○ |
| CMS save action | ● | ● | ● | ● | ● | ● | ● (save failure messaging) | ● (save confirmation) |
| Media upload control | ● | ● | ● | ○ | ● | ● | ● | ● |

State rules shared across components:

- Focus is always visible and never color-only.
- Error and success always include text (and icons where appropriate), never color alone.
- Disabled is legible, non-interactive, and programmatically marked.
- Loading disables repeat triggers and communicates waiting through text as well as any indicator.
- Hover never carries required information; touch and keyboard users receive the same meaning without hovering.

---

## 34. Component Consistency Rules

- **Same action = same visual treatment.** Inquiry CTAs, secondary navigation actions, save/cancel, close controls, and destructive confirmations look identical wherever they appear.
- **Same hierarchy = same typography.** H1/H2/H3/body/small/caption/label roles never change treatment between pages or between public and CMS surfaces at the same level.
- **Same state = same feedback pattern.** Focus, error, success, loading, disabled, and empty states follow Sections 15, 16, 22–25 identically across public and CMS UI.
- **Same spacing context = same spacing tokens.** Card padding, field gaps, section rhythm, and navigation spacing reuse the Section 8 tokens rather than per-instance values.
- **Same interaction = same behavior.** Navigation, menus, accordions, dialogs, form submission, and save flows behave per `docs/UI-UX.md` and look per this document — identically everywhere.
- **Avoid one-off components where an existing pattern works.** Services, packages, supporting content, and CMS lists reuse the card, table, and panel patterns rather than inventing local variants.
- **Avoid duplicating components with minor visual differences.** Near-duplicate buttons, cards, inputs, or alerts are consolidated into the existing variant; a new variant requires a real recurring need under Section 35.

These rules are particularly important for AI-assisted implementation: prefer the existing pattern, and justify any deviation explicitly.

---

## 35. Design-Token Governance

- **Use semantic tokens rather than arbitrary values.** Colors (Section 5), type steps (Section 7), spacing (Section 8), radii/elevation (Section 12), breakpoints (Section 10), and motion categories (Section 29) are the only sources of those values.
- **Avoid hardcoded repeated visual values.** A value used more than once becomes (or reuses) a token; one-off values stay local and are never copied across components.
- **Introduce a new token only when there is a real recurring need.** Two or more genuine use cases sharing the same value and meaning justify a token; a single use case does not.
- **Avoid near-duplicate tokens.** Values within trivial distance of an existing token reuse that token. Parallel tokens differing only in name are consolidated.
- **Preserve naming consistency.** Token names follow the existing semantic convention (`primary`, `surface`, `text-*`, `space-*`, `radius-*`, `elevation-*`, viewport names, motion categories). New names extend the convention; they do not invent a parallel scheme.
- **Keep the token system small.** The scales in this document are intentionally limited. Growth requires justification proportional to the ₱15,000 scope.
- **Document meaningful additions.** Token additions with project-wide effect are recorded where architectural or technical decisions are tracked (`docs/DECISIONS.md` once it exists).

Do not prescribe a specific token implementation syntax (CSS variables, theme objects, or otherwise) — implementation syntax is not established elsewhere and is left to implementation within the selected Styled Components approach.

---

## 36. Public Site vs CMS Visual Relationship

### 36.1 Shared

- Typography principles and hierarchy (Sections 6–7).
- Brand color roles (Section 5) — same semantic tokens, quieter application in admin chrome.
- Buttons, variants, and states (Section 13; states matrix, Section 33).
- Form controls, labels, validation, and feedback (Sections 15–16, 22).
- Accessibility standards (Section 30).
- Icon system — Lucide React only, same sizing and naming rules (Section 28).
- Motion principles — same restrained system and reduced-motion behavior (Section 29).
- Feedback, loading, empty, and error patterns (Sections 22–25).

### 36.2 May differ

- **Layout density.** CMS screens use denser, task-oriented layouts; the public site favors generous marketing whitespace.
- **Navigation structure.** Public header/menu/footer versus admin shell with sidebar or section navigation and explicit save/cancel action bars.
- **Information density.** Admin lists, tables, and editing surfaces carry more information per view than marketing sections.
- **Dashboard panels.** Task-focused content panels with status and metadata have no public-site equivalent.
- **Editing controls.** Field editors, validation messaging density, upload controls, and destructive confirmations exist only in the CMS.
- **Administrative tables.** Compact row layouts with region-contained scrolling on small screens, distinct from public card grids.

The CMS feels related to the public brand — same tokens, typography, controls, feedback, icons, and motion — without copying the marketing site's layouts.

---

## 37. Design-System Non-Goals

Explicitly excluded:

- Multiple competing design systems, palettes, or typography hierarchies.
- Tailwind-specific design conventions or utility-first styling assumptions.
- A second styling framework. The selected styling approach remains **Styled Components**, consistent with `docs/TECH-STACK.md`.
- Excessive component variants (extra button styles, card styles, alert styles beyond this document).
- Unnecessary animation systems beyond the selected Motion direction.
- Enterprise design-token complexity (dozens of tokens, tiered theming, multi-brand token architecture).
- Decorative effects without UX value (glassmorphism, heavy gradients, floating treatments, attention-seeking animation).
- Invented brand guidelines (final colors, fonts, logo treatment, motifs presented as confirmed).
- Invented business content (pricing, inclusions, policies, testimonials, contact details, coverage areas, legal terms).
- Unsupported third-party UI libraries. The selected UI-relevant technologies remain exactly those in `docs/TECH-STACK.md`: Astro, React (islands), TypeScript, Styled Components, Lucide React, Motion, React Hook Form, and Zod. No additional UI, styling, icon, animation, form, or validation libraries are introduced.

---

## 38. Confirmation-Dependent Design Decisions

The following require explicit client confirmation before they can be treated as production brand or content decisions. They are listed here so assumptions are never silently converted into confirmed decisions:

- **Final brand color palette.** All exact color values (Section 5) — primary, secondary, backgrounds, surfaces, text, borders, feedback roles, focus, disabled.
- **Exact typography / font families.** All font-family selections including any display/body pairing (Section 6).
- **Final logo treatment.** Logo artwork, placement refinements, and any lockup rules (Section 18).
- **Photography direction.** Beyond the established "real event imagery supplied or approved by the client": hero selection, gallery curation, and any art-direction preferences (Sections 20, 31).
- **Exact visual assets.** Logo files, hero images, gallery images, illustrations, favicons, and social images. None is invented.
- **Any existing brand guidelines supplied by the client.** If the client provides guidelines, they supersede provisional direction and are reconciled explicitly rather than merged silently.
- **Final CMS visual content requirements if they affect layouts.** Exact editable areas, modules, and fields (which determine admin density, tables, and media surfaces) per REQ-CMS-012.

Reference or placeholder material — including anything carried forward from Shot&Prints — must not be published or styled as confirmed brand or business fact.

---

## 39. Related Documentation

- `AGENTS.md` — AI-agent development rules, implementation principles, and scope control. Governs how work is performed.
- `README.md` — repository orientation, technology direction, and project constraints.
- `docs/PROJECT.md` — product and business context. Authoritative for business/product questions, scope, customer journey, and known-versus-unconfirmed information.
- `docs/REQUIREMENTS.md` — functional and business requirements. Authoritative for what the system must do; governs over this document on required behavior where they disagree.
- `docs/TECH-STACK.md` — technology choices and constraints. Authoritative for selected technologies; this document introduces no new ones.
- `docs/ARCHITECTURE.md` — application architecture and code organization. Defines Astro-first rendering, React islands, server endpoints, Supabase, CMS, EmailJS, and external-service boundaries.
- `docs/UI-UX.md` — user experience and interaction requirements. Defines behavior and experience; this document defers to it on all behavior.
- `docs/DATA-MODEL.md` — Owns database structure and data relationships, including CMS content models and any conditional persistence schemas.
- `docs/API.md` — Owns API and external service contracts, including endpoint detail, validation rules detail, and email/verification flows.
- `docs/SECURITY.md` — Owns auth, authorization, spam-verification, secret handling, and detailed error-handling policy.
- `docs/TESTING.md` — Owns testing and verification strategy.
- `docs/DEVELOPMENT.md` — Owns local development workflow and commands.
- `docs/ROADMAP.md` — Owns development phase order and progression.
- `docs/DEPLOYMENT.md` — Owns deployment and production procedures.
- `docs/DECISIONS.md` — Records important architectural and technical decisions, including token additions with project-wide effect.

Responsibility split:

- `docs/UI-UX.md` = **behavior and experience** (how the product acts and feels from the user's perspective).
- `docs/DESIGN-SYSTEM.md` (this document) = **visual language and reusable styling rules** (what the product looks like: tokens, variants, states, responsive rules, and motion standards used to implement that experience consistently).

Where this document mentions behavior (focus management, dialog dismissal, form sequencing), it describes only the visual state treatment; `docs/UI-UX.md` governs the behavior itself.

---

## 40. Acceptance Criteria

This document is complete when:

1. Design-system purpose is clearly defined (Section 1).
2. Visual direction is aligned with Melbourne Photobooth Hire (Section 2).
3. Shot&Prints is not treated as the current brand (Sections 2, 4, 38).
4. Design principles are documented (Section 3).
5. Brand-confirmed vs unconfirmed visual information is distinguished (Section 4; confirmation flags throughout).
6. Color-system structure is defined without inventing unconfirmed production colors (Section 5).
7. Typography hierarchy is defined without inventing unconfirmed fonts (Section 6).
8. Type scale is practical and responsive (Section 7).
9. Spacing system is defined and intentionally limited (Section 8).
10. Layout/container rules are defined (Section 9).
11. Responsive breakpoints are practical and limited (Section 10).
12. Grid/composition patterns are defined (Section 11).
13. Surface, border, radius, and elevation rules are defined (Section 12).
14. Button variants and states are defined (Section 13).
15. Link behavior/styling states are defined (Section 14).
16. Form-control visual states are defined (Section 15).
17. Inquiry-form visual states are defined (Section 16).
18. Card patterns are defined (Section 17).
19. Header/navigation visual rules are defined (Section 18).
20. Footer visual rules are defined (Section 19).
21. Gallery/media visual rules are defined (Section 20).
22. FAQ visual rules are defined (Section 21).
23. Feedback/alert states are defined (Section 22).
24. Loading/skeleton guidance is defined (Section 23).
25. Empty-state guidance is defined (Section 24).
26. Error-state guidance is defined (Section 25).
27. CMS/admin visual system is defined without inventing CMS data structures (Section 26).
28. Dialog/confirmation patterns are defined (Section 27).
29. Lucide React is used as the sole icon-system direction (Section 28).
30. Motion direction is defined using the already-selected Motion library (Section 29).
31. Accessibility visual requirements are documented (Section 30).
32. Image/asset presentation rules are documented (Section 31).
33. Content presentation rules are documented (Section 32).
34. A common component state model is defined (Section 33).
35. Component consistency and token governance rules are documented (Sections 34–35).
36. Public/CMS visual relationship is defined (Section 36).
37. Design-system non-goals are explicit (Section 37).
38. Confirmation-dependent design decisions are explicit (Section 38).
39. Related-document responsibilities are clear (Section 39).
40. No unsupported technologies, business claims, or invented brand facts are introduced (verified across Sections 5–8, 10, 12, 26, 28–29, 31–32, 37–38).
41. Only `docs/DESIGN-SYSTEM.md` is created or modified (see implementation report below).
