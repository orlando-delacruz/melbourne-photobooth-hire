# Melbourne Photobooth Hire — UI/UX Specification

## 1. Purpose and Scope

This document is the authoritative UI/UX specification for the Melbourne Photobooth Hire project. It answers:

> **How should the website and admin interface behave and feel from a user's perspective, across pages, devices, interactions, forms, navigation, loading/error states, accessibility, and responsive layouts?**

This document defines **behavior and experience**. It does not define visual language or reusable UI styling. See Section 32 for the boundary with `docs/DESIGN-SYSTEM.md`.

This document defines **experience requirements**, not implementation. It does not define:

- Source code or component implementations.
- Database schemas, fields, or policies.
- API endpoint URLs, methods, payloads, or response schemas.
- Environment variables, credentials, IDs, or configuration values.
- Final page copy, business claims, prices, policies, or contact details.

Source context (authoritative for their respective concerns):

- `docs/PROJECT.md` — product and business context.
- `docs/REQUIREMENTS.md` — functional and business requirements.
- `docs/TECH-STACK.md` — technology choices and constraints.
- `docs/ARCHITECTURE.md` — application architecture and code organization.
- Root `AGENTS.md` — development rules and scope control.
- Root `README.md` — repository orientation.

Where this document and `docs/REQUIREMENTS.md` disagree on required behavior, `docs/REQUIREMENTS.md` governs what the system must do and the discrepancy should be resolved explicitly. Where this document and `docs/PROJECT.md` disagree on business context, `docs/PROJECT.md` is authoritative.

---

## 2. General UX Principles

The following principles govern all UX decisions for the public website and CMS/admin interface:

1. **Clear over clever.** Use plain, direct language and predictable patterns. Do not use ambiguous labels, playful navigation names, or unconventional interaction patterns where a standard pattern exists.
2. **Customer-first language.** Describe services, packages, and next steps from the customer's perspective (what they get, what happens next, what they need to provide). Avoid internal or technical terminology in customer-facing UI.
3. **Strong visual hierarchy.** Each page and section has one clear primary message, supported by subordinate detail. Headings, ordering, and grouping communicate what matters most without relying on styling specifics defined elsewhere.
4. **Fast path to inquiry.** A visitor who already knows what they want can reach the inquiry mechanism quickly from principal pages and decision points, without being forced through unrelated content.
5. **Mobile-first practical usability.** Layouts, navigation, forms, and media work comfortably on small screens first, then expand to larger viewports. Mobile is not a reduced version of the site; it carries the full essential journey.
6. **Minimal unnecessary interaction.** Prefer readable content over widgets. Do not add carousels, tabs, filters, wizards, or animations where static content communicates equally well.
7. **Accessible by default.** Accessibility behavior in Section 18 is a baseline for every page and interaction, not an enhancement applied later.
8. **Consistent interaction patterns.** Navigation, buttons, links, forms, dialogs, accordions, and feedback states behave the same way everywhere. A pattern learned on one page applies to all pages.
9. **Clear system feedback.** Every meaningful user action — navigation, form input, form submission, CMS save, media upload — produces timely, understandable feedback.
10. **Trustworthy presentation.** Information is honest, current, and limited to confirmed content. The site never presents placeholder, reference, or invented material as business fact.
11. **Avoid unnecessary animations.** Motion is limited to meaningful feedback or polish per Section 19. Decorative or attention-seeking animation is out of scope.
12. **Do not overwhelm users with information.** Present concise, scannable content. Prefer short paragraphs, lists, and progressive disclosure (for example FAQ accordions) over long walls of text.
13. **Preserve usability when JavaScript is unavailable wherever reasonably possible.** Content-heavy pages render as readable, navigable HTML. Core content, navigation links, headings, and contact information remain available without client-side JavaScript. Genuinely interactive behavior (inquiry submission handling, menu open/close, lightbox/dialog behavior) may require JavaScript, consistent with the Astro-first, islands-only architecture in `docs/ARCHITECTURE.md`.
14. **CMS should be simple enough for a non-technical client to operate.** Content organization, labels, validation messages, and save behavior use non-technical language and predictable flows. See Sections 23–24.

The site is a marketing/inquiry website, not a complex web application. UX complexity must stay proportional to that purpose.

---

## 3. Target Users

### 3.1 Prospective customers

People looking for photobooth services for events such as:

- Weddings.
- Birthdays.
- Corporate events.
- Engagement parties.
- School formals.
- Christmas/end-of-year events.
- Private events.

No demographic profiles, income levels, or personas are defined. Event types above are contexts in which the service may be presented, not separate audience segments requiring separate flows.

Prospective customers primarily need to understand:

- What services are offered.
- Which option suits their event.
- Package information (once confirmed).
- What the experience looks like (real event imagery).
- Whether the business services their location (only as confirmed).
- How to make an inquiry.

Typical customer characteristics assumed for UX purposes only:

- May be browsing on a mobile device.
- May be comparing options quickly.
- May have limited time and limited tolerance for long forms or unclear pricing conditions.
- May need reassurance (real photos, clear descriptions, clear next steps) before contacting the business.

### 3.2 Business client / admin

A non-technical business user who needs to:

- Manage website content.
- Manage relevant media (for example gallery images, where included in the confirmed CMS scope).
- Update confirmed business information.
- Manage FAQs/services/packages where included in the confirmed CMS scope.
- Review/manage inquiry records only if that feature is later confirmed.

The CMS must prioritize simplicity over advanced functionality. The admin is not expected to understand HTML, databases, deployment, or analytics tooling. All CMS behavior is described in Sections 23–24. Exact CMS modules and fields require confirmation and are not defined here.

---

## 4. UX Goals and Customer Journey

### 4.1 Desired customer journey

```text
Discover
   ↓
Understand
   ↓
Build confidence
   ↓
Explore services/packages
   ↓
View real event imagery
   ↓
Choose to inquire
   ↓
Submit inquiry
   ↓
Receive clear confirmation
```

Stage-by-stage UX intent:

- **Discover:** the visitor arrives via search, referral, social media, Google Business Profile, or another channel and immediately understands the site is for Melbourne photobooth hire.
- **Understand:** the homepage and Services page communicate what is offered and for which event contexts, using confirmed content only.
- **Build confidence:** real event imagery, clear service descriptions, genuine business information, and (where approved) genuine testimonials or a Google review path reassure the visitor without fabricated claims.
- **Explore services/packages:** services are comparable at a glance; packages (once confirmed) make duration, price, inclusions, and conditions clear.
- **View real event imagery:** the gallery shows genuine event photos with accurate alt text and efficient loading.
- **Choose to inquire:** inquiry calls to action appear at natural decision points (Services, Packages, Contact) without aggressive repetition.
- **Submit inquiry:** the inquiry form is reachable, understandable, keyboard-accessible, mobile-usable, validated, spam-protected, and guarded against duplicate submission.
- **Receive clear confirmation:** success and failure states are explicit, non-technical, and actionable.

### 4.2 Primary CTA balance

The primary CTA — **making an inquiry** — must be easy to find (persistent navigation CTA, in-content CTAs at decision points, final CTA near the end of key pages) without making every section feel like an aggressive sales prompt.

Rules:

- Each principal content page includes at least one clear path to inquiry, consistent with REQ-NAV-005 and REQ-INQ-004.
- Supporting or informational content (for example About detail, FAQ answers, legal pages) does not require a CTA in every subsection.
- CTA labels describe the destination or outcome (for example inquiry-oriented wording), not generic prompts. See Section 15.
- The Google review CTA is secondary and must not compete with or displace the inquiry CTA. See Section 16.

---

## 5. Information Architecture

The intended site structure follows `docs/PROJECT.md` and `docs/REQUIREMENTS.md`. No additional pages are defined here.

- **Home.** Entry point. Communicates what Melbourne Photobooth Hire offers and for which event contexts; provides entry points to services, packages, gallery, FAQ, and inquiry; includes a clear inquiry CTA. Homepage hierarchy is defined in Section 7.
- **Services.** Presents the confirmed photobooth experiences so customers can understand and compare options. See Section 8.
- **Packages.** Presents confirmed package options (duration, price, inclusions, conditions) without a booking engine. See Section 9.
- **Gallery.** Displays real, client-approved event imagery to build visual trust. See Section 10.
- **About.** Presents genuine, client-approved business information and credibility. See Section 11.
- **FAQ.** Answers genuine, client-confirmed customer questions and reduces uncertainty before inquiry. See Section 12.
- **Contact / Inquiry.** Provides inquiry access and the inquiry form flow. This is a primary conversion surface. See Sections 13–14.
- **Privacy Policy.** Presents client-approved privacy content reflecting actual data handling. No retention periods or legal obligations are invented.
- **Terms & Conditions.** Presents client-approved business policies. No contractual, cancellation, or insurance terms are invented.
- **404.** User-friendly recovery page for unknown routes. See Section 29.

Supporting system pages or states (for example an enquiry confirmation state) may exist where required by the implemented flow, per REQ-PUB-032, but no new content pages are introduced here.

Event types (weddings, birthdays, corporate events, engagement parties, school formals, Christmas/end-of-year events, private events) are represented within relevant content. Separate pages per event type are not created unless explicitly required, per REQ-NAV-007 and REQ-SEO-021. No SEO landing pages are defined in this document.

---

## 6. Global Navigation

### 6.1 Desktop

- **Clear primary navigation.** A persistent header provides consistent links to the principal destinations: Home, Services, Packages, Gallery, About, FAQ, and Contact/inquiry (per REQ-NAV-001 and REQ-NAV-002).
- **Visible inquiry CTA.** The header includes a distinct inquiry-oriented action alongside navigation links so the fast path to inquiry is available on every page.
- **Recognizable active/current page state.** The navigation communicates which section the visitor is currently viewing through a non-color-only indicator (for example a text/structural cue in addition to any visual treatment defined in `docs/DESIGN-SYSTEM.md`), exposed programmatically for assistive technology (for example the current-page state).
- **Logo links to homepage.** The site identifier/logo is a link to the homepage from every page.
- **Predictable navigation order.** Link order is stable across pages and follows the information architecture order. Navigation order does not change between pages or viewports except for layout-driven presentation (for example collapsing into a menu on mobile).
- **Footer provides secondary navigation.** The footer repeats principal destinations plus legal pages (Privacy Policy, Terms & Conditions) and relevant confirmed business information links, per REQ-NAV-008. The footer does not introduce destinations absent from the information architecture.

### 6.2 Mobile

- **Compact header.** The header preserves brand identity, the inquiry CTA (or a clear path to it), and a single menu trigger without crowding the viewport.
- **Accessible menu trigger.** The trigger is a real button with an accessible name that reflects its purpose and state (for example open/close), operable by touch, mouse, and keyboard.
- **Clear open/close behavior.** Opening the menu reveals the same principal destinations as desktop navigation (per REQ-NAV-003). Closing is available via the trigger, a dedicated close control, and the Escape key. State changes are announced or programmatically exposed so screen-reader users understand whether the menu is open.
- **Menu does not obscure or trap the user unnecessarily.** The open menu does not permanently block page content; it can be dismissed without making a selection. Focus is managed so keyboard users can enter, move within, and leave the menu predictably.
- **Inquiry CTA remains easy to access.** The inquiry path is reachable from or alongside the mobile menu without excessive scrolling or nested interaction.
- **Keyboard and screen-reader accessible.** All menu controls and links are reachable and operable by keyboard, with visible focus states and meaningful accessible names.
- **Closing the menu returns focus appropriately.** When the menu closes, focus returns to the element that opened it (or a logical equivalent), so keyboard and screen-reader users do not lose their place.

No exact pixel sizes, breakpoints, or visual styling are prescribed here. Those belong in `docs/DESIGN-SYSTEM.md`.

---

## 7. Homepage UX

### 7.1 Information hierarchy

Recommended conceptual sequence:

1. **Hero / value proposition.** Immediately communicates what Melbourne Photobooth Hire offers and for which event contexts (per REQ-PUB-006).
2. **Primary inquiry CTA.** A clear inquiry path adjacent to or directly below the hero, so ready-to-act visitors do not need to scroll through the full page.
3. **Brief service/experience overview.** Concise introduction to the confirmed service categories with entry points to the Services page.
4. **Package/value overview where appropriate.** Summary or pointer to Packages, reflecting only confirmed package content. If no package content is confirmed, this area is omitted or replaced with a sensible fallback rather than placeholder pricing.
5. **Real event/gallery imagery.** Genuine event photos (not stock presented as client events) with accurate alt text, pointing to the Gallery.
6. **Trust-building/business information.** Genuine, confirmed business information (for example service-area statement, About summary) using approved content only.
7. **FAQ or useful supporting information where appropriate.** Entry point or brief selection pointing to the FAQ page; does not duplicate the full FAQ.
8. **Final inquiry CTA.** A closing conversion opportunity for visitors who scrolled through the full narrative.
9. **Footer.** Secondary navigation, legal links, and confirmed business information.

### 7.2 Rules

- The exact content and section composition must remain consistent with client-approved content. Sections are omitted or given sensible fallbacks when their content is unconfirmed or empty, rather than filled with invented claims.
- Old Shot&Prints sections or content must not be automatically copied. Shot&Prints material is reference only and requires explicit confirmation before publication as Melbourne Photobooth Hire content.
- Internal linking connects the homepage to services, packages, gallery, FAQ, and inquiry (per REQ-NAV-006 and REQ-PUB-007).
- The homepage includes a clear inquiry CTA (per REQ-PUB-008) and may include a Google Review CTA where placement is appropriate without disrupting the inquiry journey (per REQ-PUB-009 and Section 16).
- Content remains readable and crawlable without depending on client-side JavaScript, consistent with the content-rendering strategy in `docs/ARCHITECTURE.md`.

---

## 8. Services UX

The Services page allows customers to quickly understand the available photobooth experiences.

Known service categories (content direction; final descriptions require client confirmation):

- Premium Photobooth.
- Roaming Photobooth.
- 360 Video Booth.

Requirements:

- **Clear service hierarchy.** The primary/open-air experience (Premium Photobooth, where confirmed) is presented as the principal option; Roaming and 360 experiences are presented as distinct alternatives, not buried as footnotes.
- **Easy comparison.** A visitor can distinguish the experiences at a glance (what it is, how it works at an event, which event contexts it suits — only as confirmed). Comparison is achieved through structure and concise copy, not a complex comparison tool.
- **Concise explanations.** Each service has a short, customer-focused description based only on client-confirmed content (per REQ-PUB-011 and REQ-SVC-005). No technical specifications are presented unless confirmed.
- **Relevant imagery.** Services are supported by genuine, relevant imagery with accurate alt text where imagery is available. Stock imagery must not be presented as real client events.
- **Clear path toward packages/inquiry.** Each service presentation includes a path to relevant packages and inquiry submission (per REQ-PUB-012 and REQ-SVC-006).
- **Mobile-friendly presentation.** Service blocks stack naturally on small screens; text remains readable; CTAs remain usable; imagery maintains appropriate proportions with no horizontal scrolling.

Constraints:

- Descriptions and claims must use confirmed client content only.
- Shot&Prints reference characteristics (for example open-air setup, studio-quality lighting claims, social/open experience claims, candid interaction claims, backdrop claims, event suitability claims, 360 pairing claims) must not be presented as confirmed current claims (per REQ-SVC-004).
- Service features, inclusions, suitability statements, setup claims, and technical claims must not be invented.
- Local context (Melbourne events) may be included only where confirmed and natural, without keyword stuffing (per REQ-SVC-007).

---

## 9. Packages UX

Packages help customers understand available options without creating a complex booking flow. There is no availability calendar, checkout, payment, or reservation step.

Where confirmed content exists, package presentation may include:

- Package name.
- Duration.
- Price.
- Inclusions.
- Conditions.
- Relevant add-ons.

UX requirements:

- **Scannable options.** Each package is a self-contained block or card with its name, duration, price, and key inclusions identifiable at a glance. Inclusions use lists, not dense paragraphs.
- **Clear conditions.** Duration, pricing conditions, and any confirmed terms (for example deposit or balance terms, only as confirmed) are presented alongside the package they apply to, not hidden on a separate page the visitor must discover independently.
- **Honest scope.** If add-ons exist and are confirmed, they are presented as optional extras with their own confirmed conditions, not merged ambiguously into base package inclusions.
- **Consistent structure.** All packages use the same information order and terminology so visitors can compare without relearning the layout per package.
- **Direct inquiry path.** Package presentation includes a path to inquiry submission (per REQ-PUB-015). The inquiry entry near packages may carry the visitor toward the Contact/inquiry surface; it must not imply that selecting a package reserves it.
- **Graceful unconfirmed state.** If package content is not yet confirmed, the Packages page explains at a high level that options exist and directs the visitor to inquire, rather than showing invented prices or placeholder tables as fact.

Constraints:

- Old Shot&Prints package pricing and policies are reference material only and must not automatically appear as current content (per REQ-PKG-002 through REQ-PKG-005).
- Prices, deposits, cancellation policies, inclusions, add-ons, durations, and conditions must not be invented (per REQ-PKG-006 and REQ-PKG-008).
- The UX accommodates the final confirmed content whatever its shape (for example fewer or more packages, with or without add-ons) without requiring a redesign.

---

## 10. Gallery UX

The gallery prioritizes visual trust through real event imagery.

- **Responsive image grid.** Images are presented in a grid that reflows across mobile, tablet, and desktop (per REQ-GAL-002). The grid does not require category filters; no categories are defined (per REQ-GAL-007).
- **Clear image presentation.** Each image is fully visible at an appropriate proportion, without cropping that hides essential content or layout that causes horizontal scrolling.
- **Appropriate loading behavior.** Images load efficiently using optimization and loading behavior defined in technical documentation (per REQ-GAL-004). Below-the-fold or non-critical images may lazy-load where it helps performance without harming UX or SEO. Loading does not produce broken layouts or large layout shifts; reserved space or stable grid structure avoids jarring reflow.
- **Meaningful alt text.** Every gallery image has accurate, descriptive alt text reflecting the actual image content (per REQ-GAL-003). Decorative images, if any, are treated as decorative through the implemented mechanism rather than given misleading descriptions.
- **Optional lightbox interaction if implemented.** If a lightbox or enlarged view is provided, it follows accessible dialog behavior: focus moves into the dialog on open, Escape closes it, focus returns to the invoking image on close, and adjacent-image navigation (if offered) is keyboard-operable with an accessible name and position information. Background content is not interactable while the dialog is open. The lightbox never becomes the only way to view the images; the grid itself remains fully usable.
- **Keyboard-accessible image interaction.** Any interactive image element (lightbox trigger, navigation control, close control) is a real control with an accessible name, reachable and operable by keyboard with a visible focus state.
- **Sensible empty state when no images exist.** When no gallery images are available, the gallery displays a clear empty state rather than a broken layout or error (per REQ-GAL-005). See Section 21.
- **Graceful behavior for missing images.** Absent or failed images do not break layout; the grid remains intact and no raw error or broken-image icon is the primary presentation. Missing media is handled per Section 21.

Constraints:

- Gallery content is real event imagery supplied or approved by the client (per REQ-GAL-001). Stock imagery presented as real client events, and fake event claims, are prohibited (per REQ-GAL-008).
- Category filters must not be assumed or required. The client previously indicated that gallery categories should not be assumed.

---

## 11. About UX

The About page establishes business credibility and personality using genuine client-approved information.

- **Credibility first.** The page leads with what the business is and whom it serves (Melbourne photobooth hire for events), then supports that with confirmed detail (for example service-area statement, business information) in a concise, scannable structure.
- **Scannable structure.** Meaningful headings, short paragraphs, and lists where useful. Supporting imagery, where available, is genuine and accurately described.
- **Contextual CTA.** A single clear inquiry path (and, where appropriate, links to services or gallery) follows the credibility narrative; the page does not need repeated CTAs in every subsection.
- **Consistent voice.** Customer-focused, honest language consistent with the rest of the site. No keyword-stuffed or generic filler copy.

Constraints — do not invent:

- Founder history.
- Team members.
- Years in business.
- Awards.
- Credentials.
- Company story.
- Business claims of any kind.

About content is based only on client-confirmed information (per REQ-PUB-019 and REQ-PUB-020). Unconfirmed areas are omitted rather than filled with plausible-sounding narrative.

---

## 12. FAQ UX

FAQs answer genuine customer questions and reduce uncertainty before inquiry.

- **Clear question/answer hierarchy.** Questions are visually and structurally distinguishable from answers (proper heading structure; answers in readable body text). FAQ presentation is usable on mobile with readable layout and tappable controls where expand/collapse interaction is used (per REQ-FAQ-002).
- **Accessible accordion behavior if an accordion is used.** Each question is a real button controlling its answer region; expanded/collapsed state is programmatically exposed; only the intended answer toggles; keyboard users can move through questions and toggle them without a mouse. An accordion is not mandatory — a simple heading-plus-answer list is acceptable — but if used, it meets this behavior.
- **Keyboard support.** All toggles are reachable and operable by keyboard with visible focus states. No hover-only or click-only behavior.
- **Clear expanded/collapsed state.** State is communicated through text or structural cues in addition to any icon, and is not communicated through color alone.
- **Readable answers.** Answers are concise, directly address the question, and link to relevant pages (services, packages, inquiry) where that helps the visitor act. Answers must not contradict confirmed service, package, or policy information (per REQ-FAQ-006).
- **Mobile usability.** Toggles have practical touch targets; expanded answers reflow without horizontal scrolling.
- **No unnecessary animation.** Expand/collapse transitions, if any, are brief and respect reduced-motion preferences per Section 19.

Constraints:

- FAQ content is based only on client-confirmed questions and answers (per REQ-FAQ-003). No FAQ content is defined in this document.
- FAQ structured data is an SEO concern and is included only where technically and semantically valid for the published content (per REQ-FAQ-005). Structured data must not be added with invented or placeholder Q&A.

---

## 13. Contact / Inquiry UX

This is one of the most important UX areas. The inquiry mechanism follows the inquiry-based model, not an online booking, reservation, or checkout flow.

Primary flow:

```text
Customer
   ↓
Inquiry Form
   ↓
Validation
   ↓
Spam Protection
   ↓
Submission
   ↓
Success / Error State
```

### 13.1 Form purpose and guidance

- The form clearly explains its purpose: requesting information or availability for a photobooth at the customer's event, with follow-up handled by the business. It does not promise instant booking, confirmed availability, or checkout.
- Understandable field labels are associated with every field. Labels use customer-friendly wording and are programmatically associated with their inputs.
- Required and optional fields are clearly distinguished (for example a consistent required indicator explained once near the form, plus per-field indication). The visitor can tell before submitting which fields must be completed.
- Useful instructions appear where input format matters (for example date or contact-detail expectations), phrased non-technically.

### 13.2 Validation and errors

- Input is validated before sending (at minimum required-field presence, email format, and any confirmed format rules, per REQ-INQ-012).
- Errors are shown near the relevant fields and summarized where appropriate (per REQ-INQ-013). Error text describes what needs correction in plain language and is programmatically associated with the field.
- Submission is prevented while invalid input remains uncorrected (per REQ-INQ-014).
- Entered information is preserved when practical (for example validation failures and recoverable submission failures do not wipe the form).

### 13.3 Submission handling

- Accidental duplicate submissions are prevented: the form shows a submission-in-progress state and disables repeat submission while processing (per REQ-STA-003).
- Submission progress is communicated (the visitor knows the inquiry is being sent).
- Clear success feedback is provided on acceptance (per REQ-INQ-015); clear failure feedback with next-step guidance is provided on failure (per REQ-INQ-016). Failure never presents as success.
- The form remains usable on mobile (comfortable field sizes, no horizontal scrolling, practical touch targets) and is keyboard accessible with associated labels for each field (per REQ-INQ-005 and REQ-INQ-006).

### 13.4 Terminology and scope

- The mechanism is described as an inquiry, enquiry, request, or contact — never as online booking, reservation, or checkout.
- Real-time availability, calendar reservation, payment processing, checkout, automated reservation allocation, complex CRM, and complex booking management are excluded (per REQ-INQ-020).

Constraints:

- The exact field set remains confirmation-dependent. Potential fields (name, email, mobile, event date, event type, event location/venue, estimated guests, preferred photobooth, additional requirements/message) and option lists (event types, photobooth options) in `docs/PROJECT.md` and `docs/REQUIREMENTS.md` are possibilities, not confirmed requirements. The final list of fields — and which are required versus optional — requires client confirmation (per REQ-INQ-008 through REQ-INQ-010).
- No additional personal-data fields beyond what is confirmed may be introduced without justification (per REQ-INQ-011).

---

## 14. Inquiry Form States

Final user-facing copy is not defined here. State behavior is:

### 14.1 Default

The form is ready for input. All fields are presented with labels, required/optional indication, and any instructions. No errors or progress indicators are shown.

### 14.2 Focus

Inputs have a visible focus state. Focus is perceivable by keyboard users and is not communicated through color alone. Focus order follows the visual and logical order of the form.

### 14.3 Validation error

- The visitor is told what needs correction in plain, non-technical language.
- Each error is shown near or associated with the relevant field, with a summary where appropriate.
- Errors are communicated in text associated with the field, not by color alone.
- Focus is directed to the error summary or the first invalid field so keyboard and screen-reader users encounter the errors without searching.
- Entered values are preserved so the visitor corrects rather than re-enters.

### 14.4 Submitting

- Duplicate submission is disabled while the submission is in flight.
- Clear progress feedback is shown (the visitor knows the inquiry is being sent and should wait).
- The form does not reset or navigate away until the outcome is known.

### 14.5 Success

- The visitor is clearly told the inquiry was successfully submitted and what happens next (business follow-up). Success feedback is consistent with actual delivery: success is reported only when the inquiry has been accepted for delivery to the client's Gmail (per REQ-INQ-018).
- The success state is programmatically exposed so assistive technology announces it, and focus is managed to the confirmation.
- The success state does not depend on animation to be understood.

### 14.6 Email/service failure

- A false success state is never shown.
- The visitor receives a clear, non-technical message with guidance on what to do next (for example retrying or contacting the business through an alternative confirmed channel).
- Technical details (service internals, delivery diagnostics, stack traces) are never exposed.

### 14.7 Spam verification failure

- The visitor is told the submission could not be verified, in non-technical language, with a reasonable next step (for example trying again).
- Technical details of the spam-protection mechanism are not exposed.

### 14.8 Network failure

- The visitor is clearly told the submission could not be completed due to a connection problem, with guidance (for example checking the connection and retrying).
- Entered information is preserved where practical so retry does not require re-entering the full form.

---

## 15. Calls to Action

### 15.1 CTA hierarchy

**Primary CTA — make an inquiry / enquire.** This is the single conversion goal of the site. It appears in persistent navigation and at natural decision points (Services, Packages, Contact/inquiry contexts, homepage hero and close).

**Secondary CTAs** may include:

- Explore services.
- View packages.
- View gallery.
- Learn more.
- Leave a Google review.

Secondary CTAs support the journey toward inquiry or toward the review flow; they never displace or visually outrank the primary inquiry CTA in decision contexts.

### 15.2 CTA rules

- Avoid excessive CTA repetition. One clear inquiry path per decision context is sufficient; supporting content does not need a CTA in every subsection.
- Every CTA has a clear destination and a meaningful label. Labels describe the outcome or destination (what the visitor will see or accomplish), not generic prompts alone.
- Inquiry CTAs lead to the inquiry mechanism (Contact/inquiry surface). Service/package/gallery CTAs lead to the named content. The review CTA leads to the client-confirmed Google Business Profile review link and is labelled so the visitor understands they are leaving a review on Google (see Section 16).
- CTA behavior is consistent: links navigate; form-adjacent actions submit or advance the form. No CTA silently performs a different action than its label implies.

---

## 16. Google Reviews UX

The website uses a simple CTA directing customers to the client's Google Business Profile review page. The flow is `Website → Google Business Profile review link`.

- **Clear labelling.** The CTA communicates that the customer is leaving a review on Google (consistent with the label guidance in Section 15), so there is no surprise when navigation leaves the site.
- **Appropriate placement.** The CTA appears in at least one appropriate location (for example homepage, contact/inquiry context, or footer) without disrupting the primary inquiry journey (per REQ-REV-003). It is secondary to the inquiry CTA.
- **External navigation.** The link opens the Google review flow. The visitor understands they are leaving the website. No custom in-site review experience is implied.

The following are not created:

- Custom review forms.
- Custom rating systems.
- Fake review displays.
- Invented testimonials.

Constraints:

- The review URL requires client confirmation (per REQ-REV-004). No placeholder or guessed URL may be published as the production link.
- The site must not implement a custom review submission system or custom review database (per REQ-REV-005 and REQ-REV-006) and must not display fake, generated, or unverified reviews or ratings (per REQ-REV-007).
- Genuine testimonials or reviews may be shown only where approved with verified current data.

---

## 17. Responsive UX

The entire public website must work across mobile, tablet, and desktop (per REQ-ACC-001 through REQ-ACC-003). Principles rather than arbitrary breakpoints:

- **Content reflows naturally.** Layouts adapt from narrow to wide viewports without loss of essential content or function. No separate mobile-only content decisions that hide important information.
- **Navigation adapts.** Desktop persistent navigation collapses into the accessible mobile menu pattern in Section 6.2; both expose the same principal destinations.
- **Text remains readable.** Line lengths, font presentation (defined in `docs/DESIGN-SYSTEM.md`), and spacing keep body copy comfortable to read on small screens without zooming or horizontal scrolling.
- **Buttons remain usable.** Touch targets are practical on small screens; CTAs and form controls are comfortably tappable.
- **Forms remain comfortable to complete.** Fields stack vertically on narrow viewports; labels stay associated and visible; validation messages reflow alongside their fields.
- **Images maintain appropriate proportions.** Gallery, service, and supporting imagery scale without distortion, cropping of essential content, or horizontal overflow.
- **No horizontal scrolling.** No page requires horizontal scrolling at any supported viewport for essential content or actions.
- **Important content is not hidden on small screens.** Content hidden or collapsed on mobile is limited to genuinely progressive disclosure (for example FAQ answers); primary messages, CTAs, and inquiry access are never hidden.
- **Touch targets are practical.** Interactive elements (menu trigger, CTA buttons, FAQ toggles, lightbox controls, form controls) are sized and spaced for touch as well as mouse and keyboard.
- **Interactions remain accessible.** Responsive changes do not remove keyboard operability, focus visibility, or screen-reader meaning.

The CMS/admin interface should also be practical on smaller screens (per REQ-CMS-011), although desktop may remain the primary editing environment. Admin tables or wide editing surfaces reflow or scroll within their own region without breaking the overall admin layout, and primary admin actions (save, cancel) remain reachable on small screens.

---

## 18. Accessibility UX

Required accessibility behavior (consistent with REQ-ACC-004 through REQ-ACC-011; detailed implementation belongs in code and testing documentation):

- **Semantic HTML.** Landmarks, headings, lists, navigation, forms, and buttons use the correct elements for their purpose.
- **Logical heading hierarchy.** Headings nest meaningfully; page structure is navigable by assistive technology.
- **One clear H1 per page.** Each public page has exactly one H1 reflecting the page topic (per REQ-SEO-005).
- **Keyboard navigation.** All interactive elements — navigation, menu, CTAs, FAQ toggles, gallery/lightbox controls, form fields, admin controls — are reachable and operable by keyboard in a logical order, with no keyboard traps.
- **Visible focus states.** Keyboard focus is always perceivable and is not communicated through color alone.
- **Accessible form labels.** Every form field has a programmatically associated label; instructions and error text are associated with their fields.
- **Descriptive error messages.** Errors explain what is wrong and how to fix it in plain language, associated with the relevant field, with a summary where appropriate.
- **Errors not communicated through color alone.** Error, success, and required-field states always include text or structural cues in addition to any visual treatment.
- **Accessible names for interactive controls.** Menu triggers, dialog/lightbox controls, FAQ toggles, carousel controls (if any), and icon-only buttons expose meaningful names.
- **Appropriate alt text.** Informative images have accurate, descriptive alt text reflecting actual content; decorative images are treated as decorative through the implemented mechanism (per REQ-ACC-010).
- **Sufficient text/background contrast.** Text and essential UI meet appropriate contrast for readability (per REQ-ACC-008). Contrast specifics belong in `docs/DESIGN-SYSTEM.md`; this document requires the outcome, not the values.
- **Accessible navigation.** Navigation landmarks, current-page state, and menu open/close state are programmatically exposed.
- **Accessible dialogs/lightboxes.** Focus management, Escape dismissal, focus return, and background inertness per Sections 10 and 23.
- **Reduced-motion support.** Motion respects reduced-motion preferences per Section 19 (see also REQ-ACC-011).
- **No interaction that requires precise mouse movement.** All actions are achievable with keyboard, touch, and coarse pointing; no hover-only, drag-only, or pixel-precise gestures are required.
- **Screen-reader meaningful states where applicable.** Menu open/close, accordion expanded/collapsed, form progress, submission outcome, and save outcome are programmatically exposed so state changes are announced.

Formal WCAG certification is not claimed (per REQ-ACC-012). Any conformance claim requires actual evaluation, which is not defined here.

---

## 19. Motion and Animation UX

Motion supports usability; it does not distract from content. Animation is used only where it provides meaningful feedback or polish.

Examples of acceptable motion:

- Menu transitions.
- Dialog/lightbox transitions.
- Form feedback (for example progress or state-change indication).
- Subtle entrance transitions.

Requirements:

- Respect `prefers-reduced-motion`: when the user prefers reduced motion, non-essential animation is disabled or reduced to an instant state change. Essential state changes remain communicated through text and structure, never through motion alone.
- Avoid excessive animation: no auto-playing, looping, or attention-seeking effects; no animation on long content sequences.
- Avoid delaying access to content: animation never blocks reading, navigation, or form completion, and never postpones the availability of critical information.
- Avoid animations that negatively affect performance: motion stays lightweight and does not cause jank, layout thrash, or delayed interaction on typical devices.
- Never make critical information dependent on animation: success/error messages, validation errors, menu state, and content availability are fully understandable with motion disabled.

Detailed animation values (durations, easing, properties) belong in `docs/DESIGN-SYSTEM.md`.

The selected animation direction (Motion) is documented in `docs/TECH-STACK.md`. This document does not introduce additional animation technologies.

---

## 20. Loading UX

Appropriate loading behavior by area:

- **CMS content.** Where public content loads asynchronously, a loading indicator or skeleton preserves layout stability and communicates that content is arriving. Content areas do not flash between broken states.
- **Gallery/media.** Image grids reserve stable space so loading does not cause large layout shifts; individual images appear progressively without breaking the grid. Loading feedback does not expose technical details.
- **Inquiry submission.** The form shows a submission-in-progress state with duplicate-submission prevention per Section 14.4.
- **Admin operations.** Content fetching and saving show loading feedback per Section 23; the admin always knows whether an operation is pending, succeeded, or failed.

Loading-state rules:

- Communicate that something is happening (visible, non-technical feedback for any operation that genuinely takes time).
- Avoid unnecessary layout shifts (reserve space; do not reflow surrounding content when loaders appear or resolve).
- Prevent confusing duplicate actions (disable or guard repeat triggers while an operation is pending).
- Do not expose technical details (no endpoint names, status codes, query information, or stack traces).

Public static content must not require artificial loading screens. Content rendered as HTML is simply present; loaders appear only where asynchronous behavior genuinely exists.

---

## 21. Empty States

Empty states are intentional and understandable. They explain what is (not) there and what to do next, in non-technical language.

- **Empty gallery.** When no gallery images are available, the gallery displays a clear empty state rather than a broken layout or error (per REQ-GAL-005 and REQ-STA-007). The empty state does not promise imagery that does not exist.
- **Unavailable CMS content.** When a CMS-managed area has no published content, the public surface shows a sensible fallback or handles the area per confirmed content rules, never a broken layout (per REQ-STA-008). For example, an unconfirmed Packages section directs visitors to inquire rather than rendering an empty table.
- **No optional content.** Optional supporting content (for example testimonials, add-ons, FAQ entries) is simply omitted when absent. Gaps are not filled with placeholder text or filler.
- **Missing media.** Absent images do not break layout; surrounding content remains intact; no raw error is the primary presentation.
- **Empty inquiry records if persistence is eventually implemented.** If inquiry-record storage is later confirmed, an empty records view explains that no inquiries exist yet rather than showing a broken table or raw query state. Persistence itself is conditional and must not be assumed (see Section 30).

Empty states never expose raw database or API errors.

---

## 22. Error UX

Errors are:

- **Understandable.** Plain, non-technical language describing what happened from the user's perspective.
- **Actionable where possible.** Guidance on what to do next (retry, correct input, use an alternative confirmed contact path, return to valid content).
- **Non-technical.** No jargon, codes, or implementation vocabulary.
- **Visually clear.** Noticeable placement near the relevant context (field-level errors near fields; page-level errors in a prominent, consistent location), with text cues in addition to any visual treatment.
- **Accessible.** Errors are programmatically exposed so assistive technology announces them; focus is managed to page-level error summaries or the first invalid field; errors are not communicated through color alone.
- **Consistent.** The same kinds of failures produce the same kind of messaging across public and admin surfaces.

Errors never expose:

- Stack traces.
- Database errors.
- API internals.
- Credentials.
- Service secrets.
- Implementation details.

Detailed security and error-handling implementation belongs in `docs/SECURITY.md` and `docs/API.md`. UI copy for specific errors belongs in implementation, not here.

---

## 23. CMS/Admin UX

The admin experience is defined at the UX level. Exact CMS modules, fields, and database structures are not invented here; they require confirmation (per REQ-CMS-012) and belong in requirements confirmation, `docs/DATA-MODEL.md`, and implementation.

The CMS feels simple, predictable, organized, safe, and understandable for a non-technical client.

Expected interaction principles:

```text
Login
  ↓
Dashboard / Content Area
  ↓
Select Content
  ↓
Edit
  ↓
Validate
  ↓
Save
  ↓
Clear Confirmation
```

Behavior by area:

- **Login.** A single, clearly labelled sign-in surface. Fields are labelled; errors are non-technical and do not reveal whether an account exists beyond what security policy permits (detail in `docs/SECURITY.md`). Session expiration is handled per below.
- **Navigation.** Content areas are clearly organized so the client can find and edit the intended content without confusion (per REQ-CMS-004). Navigation labels use business language (for example Services, Packages, Gallery, FAQs, business information) rather than technical names. The admin's current location is always clear.
- **Content editing.** Editing surfaces present one content area at a time with labelled fields, helpful instructions, and validation. Editable content is clearly distinguished from read-only information (for example published status, system information) so the client knows what their edits affect.
- **Save.** Saving is an explicit action with predictable behavior: the client receives clear confirmation when content is saved, and a clear error when saving fails (per REQ-CMS-008). Save feedback states what happened and, on failure, what to do next.
- **Cancel.** Leaving an editing surface without saving is explicit and safe: unsaved changes are clearly indicated, and discarding them requires the client's intent (see Section 24). Cancel never silently saves.
- **Validation.** Admin input is validated with clear, field-associated error messages; invalid content is rejected with an explanation of how to correct it (per REQ-CMS-006).
- **Loading.** Content fetching and saving show loading feedback; pending operations disable conflicting actions (per REQ-CMS-009 and REQ-STA-002).
- **Save success.** A clear confirmation states that content was saved (and, per the implemented workflow, what that means for the public site — for example that updates are reflected predictably once saved and published, per REQ-CON-004).
- **Save failure.** A clear error states that content was not saved and what the user can do next (per REQ-STA-006), without exposing technical details. Entered edits are preserved during recoverable failures where practical.
- **Destructive actions.** Delete or remove operations require explicit confirmation before execution (per REQ-CMS-007). The confirmation names what will be affected in business terms. Destructive actions are never one accidental click.
- **Media management.** Where required by the confirmed implementation (for example gallery images), upload, replacement, and removal behave predictably (per REQ-CMS-010): progress is shown, success and failure are confirmed, alt text or descriptive information is captured where applicable, and removal requires confirmation.
- **Session expiration.** If the admin session expires, the client is told in plain language and guided back to sign-in. Unsaved work is preserved where practical; the client is never silently left on a non-functional editing surface.

---

## 24. CMS Safety and Usability

The admin interface helps prevent accidental mistakes:

- **Confirm destructive actions.** Delete, remove, and similarly irreversible operations require an explicit confirmation step naming the affected content.
- **Clearly indicate unsaved changes.** Editing surfaces show when edits have not yet been saved, so the client can distinguish draft edits from published content.
- **Provide save feedback.** Every save attempt resolves into a clear success or failure message; there is no silent or ambiguous outcome.
- **Prevent accidental duplicate actions.** Pending save, delete, and upload operations disable their triggers until the outcome is known.
- **Preserve edits during recoverable failures where practical.** Validation failures, save failures, and network interruptions do not discard the client's input without cause.
- **Clearly distinguish editable content from read-only information.** Fields the client can change are visually and structurally separated from status, metadata, or system information they cannot change.

Complex version control, revision history, workflow approval, and enterprise publishing systems are not built unless later required. The CMS remains scoped to managing confirmed website content (per REQ-CMS-013).

---

## 25. Content UX Principles

Content is:

- **Concise.** Short paragraphs and focused sections; each page answers its core question without digression.
- **Customer-focused.** Written for event organizers choosing a photobooth, not for internal or technical readers.
- **Easy to scan.** Meaningful headings, short paragraphs, lists where useful, clear supporting information, and contextual CTAs.
- **Honest.** Limited to approved business information; uncertainty is handled by omission, not invention.
- **Locally relevant.** Genuine Melbourne service-area context based only on confirmed business information, without keyword stuffing.
- **Free of keyword stuffing.** Search-intent coverage is natural and customer-focused.
- **Based on approved business information.** Reference or placeholder content is never published as current information (per REQ-CON-003); business-critical content (pricing, policies, contact details, legal pages) requires explicit client approval before publication (per REQ-CON-005).

Use genuine photography with accurate alt text. Use contextual CTAs that lead to the named destination.

Avoid:

- Invented claims.
- Fake testimonials.
- Generic filler.
- Repetitive SEO phrases.
- Unnecessary walls of text.
- Shot&Prints branding, naming, contact information, or brand language presented as current information.

---

## 26. Trust and Conversion UX

The website builds confidence through legitimate signals only:

- Real event photography.
- Clear service descriptions (confirmed content only).
- Transparent confirmed package information.
- Genuine testimonials/reviews where approved with verified current data.
- Clear service-area information (confirmed content only).
- Professional presentation (consistent layout, readable content, working navigation and forms).
- Accessible contact/inquiry path.
- Google review CTA (client-confirmed review link).

Trust signals are never fabricated. No fake reviews, invented business history, unverified ratings, unsupported claims, or generic AI-generated statements presented as business facts.

No rankings or business outcomes are promised. Conversion UX means making the legitimate path to inquiry clear and low-friction, not guaranteeing enquiries or revenue.

---

## 27. SEO-Related UX Considerations

UI/UX decisions support SEO without allowing SEO to damage usability:

- **Meaningful page hierarchy.** One H1 per page reflecting the page topic; logical H2 structure; semantic markup supporting both readers and crawlers.
- **Readable content.** Genuine, customer-focused copy that addresses search intent without keyword manipulation.
- **Descriptive headings.** Headings describe the section for humans first; search benefit follows from clarity, not stuffing.
- **Crawlable navigation links.** Principal destinations and internal links are plain, server-rendered links, not JavaScript-only controls.
- **Useful internal linking.** Related content is connected where it helps the visitor (services to packages, packages to inquiry, homepage to gallery and FAQ), per REQ-NAV-006 and REQ-SEO-007.
- **Accessible images and alt text.** Accurate alt text and optimized delivery serve users, assistive technology, and search together.
- **Mobile usability.** Fully usable mobile experience per Section 17.
- **Fast content rendering.** Content is present in delivered HTML rather than assembled client-side after load, consistent with the content-rendering strategy in `docs/ARCHITECTURE.md`.
- **No content hidden exclusively behind unnecessary client-side interactions.** Crawlable content (services, packages, FAQs, business information) is present in delivered HTML. Interactive islands (menu, lightbox, form handling) enhance but never gate access to core content.

Pages are not created solely to target keywords unless explicitly required (per REQ-SEO-021). Event types stay within relevant sections unless explicitly required otherwise.

Technical SEO details (sitemap generation, robots.txt, canonical URLs, JSON-LD placement, metadata implementation) belong in `docs/ARCHITECTURE.md` and later implementation documentation, not here.

---

## 28. Performance UX

UX accounts for perceived and actual performance:

- **Prioritize meaningful content.** Above-the-fold content is concise and loads first; secondary content does not delay the primary message or CTA.
- **Minimize unnecessary JavaScript.** Content-heavy pages ship little or no client-side JavaScript; interactivity is limited to hydrated islands, per the architecture direction. UX patterns prefer static HTML over widgets.
- **Optimize images.** Appropriate formats, sizing, and compression; responsive images; lazy loading for below-the-fold or non-critical images where it helps without harming UX or SEO.
- **Avoid oversized media.** Gallery and supporting imagery are sized for web delivery; full-resolution originals are never served directly as page content.
- **Avoid unnecessary animation.** Motion is limited per Section 19 and never blocks content or interaction.
- **Avoid blocking interactions.** Navigation, CTAs, and form inputs remain responsive while secondary content loads.
- **Prevent layout shifts where practical.** Reserve space for images, loaders, and dynamic regions so content does not jump as assets resolve.
- **Provide feedback for operations that genuinely take time.** Inquiry submission, media upload, and CMS save operations show progress; static content does not show artificial loaders.

Arbitrary performance numbers (seconds, scores, percentiles) are not specified here, per REQ-PER-008.

---

## 29. 404 and Navigation Recovery

The 404 page:

- Clearly indicates the requested page was not found, in plain non-technical language.
- Provides a path back to the homepage.
- Provides useful navigation (principal destinations and, where helpful, search-independent pointers to services, packages, gallery, FAQ, and inquiry).
- Maintains the site's overall experience (consistent header, navigation, footer, and behavior — not a bare or technical error dump).
- Avoids technical error information (no status codes as the primary message, no stack traces, no route internals).

Unnecessary custom error flows are not created. One clear recovery page covering unknown routes is sufficient (per REQ-STA-009).

---

## 30. Content States and Client Confirmation

### 30.1 Confirmed UX requirements

Behavior already established by the project requirements, independent of final content:

- Public information architecture (Home, Services, Packages, Gallery, About, FAQ, Contact/inquiry, Privacy Policy, Terms & Conditions, 404).
- Inquiry-based model (inquiry/request flow with validation, spam protection, EmailJS delivery to Gmail, success/error feedback) and exclusion of reservation, payment, checkout, and CRM behavior.
- Google review CTA pattern (simple external link, no custom review system).
- Responsive, accessible, mobile-usable presentation across public and (practically) admin surfaces.
- Loading, empty, success, and error feedback for inquiry, CMS, gallery, and navigation states.
- CMS product-level behavior (authenticated, organized, validated, safe editing, predictable save behavior) without defined modules or fields.
- SEO-supporting UX (hierarchy, internal linking, crawlable content, alt text, mobile usability) without ranking promises.

### 30.2 Content-dependent UX

Behavior whose exact content depends on client confirmation. The UX accommodates the confirmed content whatever its shape; unknown content is never solved by inventing it:

- Package information (names, durations, prices, inclusions, conditions, add-ons).
- Service descriptions (final names, descriptions, suitability and setup claims for Premium Photobooth, Roaming Photobooth, and 360 Video Booth).
- Inquiry fields (final field set; which fields are required versus optional; event-type and photobooth option lists).
- Testimonials (whether any exist and are approved for publication).
- About content (company information, founder/team story, credentials, history).
- FAQ content (final questions and answers).
- Service area details (travel boundaries, travel fees, location-based charges, service-area statement).
- Google review URL (client-supplied Google Business Profile review link).
- CMS modules/fields (exact editable content areas, modules, and field definitions).
- Business contact details, legal page content, gallery imagery, and any other business information carried forward from Shot&Prints reference material.

The full confirmation checklist is maintained in `docs/REQUIREMENTS.md` (Section 23) and `docs/PROJECT.md` (Section 23). This document does not duplicate that checklist beyond the summary above.

---

## 31. UX Non-Goals

Explicitly excluded from the UX scope unless the client explicitly expands the project:

- Complex reservation UI.
- Real-time availability calendar.
- Payment/checkout UI.
- CRM interface.
- Marketing automation dashboard.
- Custom review platform.
- Unnecessary filters (including unconfirmed gallery category filters).
- Unnecessary multi-step booking wizard.
- Enterprise CMS workflows (version control, revision history, approval chains).
- Excessive animation.
- Unnecessary client-side application state (global stores, page-level hydration for static content).

These exclusions are consistent with the out-of-scope lists in `docs/PROJECT.md` (Section 21), `docs/REQUIREMENTS.md` (Section 22), and the architectural non-goals in `docs/ARCHITECTURE.md` (Section 24).

---

## 32. Design-System Boundary

This document does **not** define:

- Exact colors.
- Typography values.
- Font sizes.
- Spacing tokens.
- Border radii.
- Shadows.
- Exact button dimensions.
- Component visual variants.
- Detailed breakpoints.
- Exact animation durations/easing.

Those belong in `docs/DESIGN-SYSTEM.md`.

The UI/UX document defines **behavior and experience**; the design-system document defines **visual language and reusable UI styling**. Where this document mentions visual concepts (hierarchy, focus visibility, active states, contrast, touch targets), it requires the outcome (perceivable, usable, consistent) and leaves exact values and visual variants to the design system and implementation.

No new visual tokens, color choices, or typographic decisions are introduced here.

---

## 33. Related Documentation

Currently existing documents:

- `AGENTS.md` — AI-agent development rules (exists).
- `README.md` — repository orientation (exists).
- `docs/PROJECT.md` — product and business context (exists).
- `docs/REQUIREMENTS.md` — functional and business requirements (exists).
- `docs/TECH-STACK.md` — technology choices and technical constraints (exists).
- `docs/ARCHITECTURE.md` — application architecture and code organization (exists).
- `docs/DESIGN-SYSTEM.md` — visual and component design rules (owns exact colors, typography values, spacing tokens, radii, shadows, dimensions, variants, breakpoints, animation values).
- `docs/DATA-MODEL.md` — database structure and data relationships (owns CMS content models, fields, and gallery/inquiry persistence schemas).
- `docs/API.md` — API and external service contracts (owns endpoint contracts, validation rules detail, and email/verification flows).
- `docs/SECURITY.md` — security requirements and constraints (owns auth, authorization, spam-verification, secret handling, and detailed error-handling policy).
- `docs/TESTING.md` — testing and verification strategy.
- `docs/DEVELOPMENT.md` — local development workflow and commands.
- `docs/ROADMAP.md` — development roadmap and phase progression.
- `docs/DEPLOYMENT.md` — deployment and production procedures.
- `docs/DECISIONS.md` — important architectural and technical decisions.

This document (`docs/UI-UX.md`) is the UX requirements owner. Visual styling detail is deferred to `docs/DESIGN-SYSTEM.md`; data, API, and security implementation detail is deferred to `docs/DATA-MODEL.md`, `docs/API.md`, and `docs/SECURITY.md` respectively.

---

## 34. Acceptance Criteria

This document is complete when:

1. Core UX principles are clearly defined (Section 2).
2. Target customer and admin users are identified (Section 3).
3. Customer journey is documented (Section 4).
4. Site information architecture is documented without inventing pages (Section 5).
5. Desktop and mobile navigation behavior is defined (Section 6).
6. Homepage UX hierarchy is defined (Section 7).
7. Services UX is defined without inventing service claims (Section 8).
8. Packages UX accommodates confirmed information without inventing prices/policies (Section 9).
9. Gallery UX is defined without assuming category filters (Section 10).
10. About UX prevents invented business claims (Section 11).
11. FAQ UX is defined with accessible interaction behavior (Section 12).
12. Inquiry UX and all major form states are documented (Sections 13–14).
13. CTA hierarchy is defined (Section 15).
14. Google Review CTA behavior is documented (Section 16).
15. Responsive behavior is defined (Section 17).
16. Accessibility requirements are clearly documented (Section 18).
17. Motion/reduced-motion behavior is defined (Section 19).
18. Loading, empty, success, and error states are covered (Sections 20–22).
19. CMS/admin UX is documented without inventing database structures or modules (Section 23).
20. CMS safety/usability behavior is documented (Section 24).
21. Content and trust principles prevent fabricated claims (Sections 25–26).
22. SEO-related UX considerations are documented without duplicating technical SEO architecture (Section 27).
23. Performance-related UX behavior is documented without arbitrary numeric guarantees (Section 28).
24. 404/recovery UX is defined (Section 29).
25. Client-confirmation-dependent UX is clearly identified (Section 30).
26. UX non-goals are explicit (Section 31).
27. The boundary between UI/UX and the future design system is explicit (Section 32).
28. No unsupported technologies, requirements, content, or business claims are introduced.
29. Only `docs/UI-UX.md` is created or modified.
