# Melbourne Photobooth Hire — Context

Shared vocabulary for the marketing website and its custom CMS. Terms here are canonical for code, content, and discussion; the owning `docs/` file governs behavior behind each term.

## Customer journey

**Inquiry / request**:
A customer message asking about photobooth hire for an event, with follow-up handled by the business.
_Avoid_: Booking, reservation, order, checkout

**Customer**:
A prospective photobooth customer browsing the public site.
_Avoid_: User, client

**Event**:
The customer's occasion being served (wedding, birthday, corporate event, and similar contexts).
_Avoid_: Function, party (too narrow)

## Content

**Service**:
A confirmed photobooth experience category presented on the site.
_Avoid_: Product

**Package**:
A confirmed hire option with duration, price, inclusions, and conditions.
_Avoid_: Plan, tier, deal

**Gallery item**:
One real, client-approved event image with accurate alt text.
_Avoid_: Stock photo, asset

**FAQ**:
One client-confirmed question with its answer.
_Avoid_: Help article

**Published content**:
Client-confirmed content rendered into public HTML.
_Avoid_: Live content, draft (unpublished edits are not published content)

**Site settings**:
Business-wide content reused across pages (contact details, service-area statement).
_Avoid_: Config, globals

## System

**Admin**:
The authenticated business user managing website content through the CMS.
_Avoid_: User, client

**CMS**:
The custom admin panel for confirmed website content.
_Avoid_: Dashboard, backend, CRM

**Server endpoint**:
An Astro server-side boundary for validation, verification, and delivery bridging.
_Avoid_: API, backend, service

**Turnstile evidence**:
The spam-protection proof submitted with an inquiry and verified server-side.
_Avoid_: Captcha, token

**Review CTA**:
The link taking customers to the Google Business Profile review flow.
_Avoid_: Rating, testimonial

**Testimonial**:
Genuine, approved customer feedback shown on the site (conditional on approval).
_Avoid_: Review
