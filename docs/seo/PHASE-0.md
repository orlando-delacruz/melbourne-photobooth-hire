# SEO BASELINE AUDIT

**Project:** Melbourne Photobooth Hire
**Type:** Read-only baseline audit (no code changes made as part of this audit)
**Audit scope:** Technical SEO, Google Search architecture, local SEO, keyword architecture, content quality, structured data, AEO/GEO, image SEO, internal linking, performance, trust/entity signals.
**Evidence sources:** Repository source (`src/`, `public/`, `astro.config.mjs`, `docs/`), built output (`dist/`, `.vercel/output/`), and live production inspection of `https://melbournephotoboothhire.com.au` on 2026-10-05.
**Important caveat:** Public page copy, service/package/FAQ rows and images are CMS-editable. Findings reflect the codebase plus the live CMS state observed on the audit date; some content findings may change as the client edits the CMS. Severity is judged against the current production state.

---

## Executive Summary

The website has a **solid technical SEO foundation**: it is server-rendered (SSR) with crawlable HTML, unique titles/descriptions, canonical tags, a valid robots.txt and sitemap, no accidental public noindex, lazy-loaded below-the-fold images, preloaded LCP images, and edge caching. Content is rendered in HTML before hydration, so Google does not depend on client-side JavaScript to see the page copy. Internal linking via header/footer/CTAs is complete with no orphan pages.

However, the baseline has **three critical problems** that should be fixed before any ranking work:

1. **Canonical host conflict.** Every canonical URL, `og:url`, sitemap entry and the Astro `site` use the **non-www** host, but the live apex domain `melbournephotoboothhire.com.au` **308-redirects to `www.`**, and `www` serves 200 while declaring the non-www canonical. Every canonical URL therefore redirects, and two hosts send conflicting signals. This can slow or confuse consolidation/indexing and undermines Search Console reporting.
2. **Test content live on a key commercial page.** The live `/services` H1 is literally **"Photobooth testing"** (the repo fallback is "Photobooth experiences"). A primary money page is publishing internal test copy.
3. **Placeholder stock imagery is still live**, including hotlinked Pexels photos rendered in the gallery/about pages and used as the default `og:image`/preloaded LCP image on several pages (FAQ, services, gallery, about, contact). This is a brand-trust, licensing and third-party-fragility risk.

Two high-priority content/trust problems compound these: a **pricing contradiction** ("Price Starts $150" vs the cheapest published package at $350, and "Extended hire is $150 per hour" in the FAQ), and **unverified trust claims** ("5 star-rated", "Public liability ensured/Insured") displayed alongside **placeholder testimonials** (e.g. "Mia & Jordan").

Structured data is minimal and safe: one `Organization` + `WebSite` + `WebPage` graph. There is **no `LocalBusiness`/`Service`, no `BreadcrumbList`, no `FAQPage`** — a significant local/AEO gap. Contact/local completeness is also thin: no rendered email (the CMS holds `melbournephotoboothhire.au@gmail.com`), no address/map/hours, and **no Google review link** (`reviewUrl` is empty).

Measurement is absent: **no GA4/GTM or any analytics** was found in the codebase (GA4 was documented as conditional, so this may be intentional, but it leaves the site blind).

Overall: the engineering platform is good; the launch-blocking issues are **host configuration, leftover test/placeholder content, and content accuracy**, followed by local-entity structured data and real imagery.

---

## Current SEO Architecture

**Rendering and hosting**
- Astro 7 with `@astrojs/vercel` adapter; **all public pages are SSR** (`export const prerender = false` in every page), with live Supabase CMS data fetched per request and edge caching via `Cache-Control: public, s-maxage=300, stale-while-revalidate=3600` (`src/lib/http-cache.ts:14-23`).
- Content is server-rendered into HTML; React islands (`client:visible`) hydrate only for interactivity/live updates. Below-the-fold islands defer with `rootMargin: 0px 0px -20% 0px` (`src/pages/index.astro:63`).
- Live CMS updates use a vanilla runtime + deferred Supabase Realtime connection (`src/lib/live/liveChrome.ts`, `src/lib/realtime/channels.ts`); SEO metadata is also patched client-side for open tabs only (`liveChrome.ts:79-97`).

**URL and metadata architecture**
- `site: "https://melbournephotoboothhire.com.au"` (non-www), `trailingSlash: "never"` (`astro.config.mjs:27-28`).
- Trailing slashes are 308-redirected to the non-slash URL at the Vercel routing layer (`\.vercel\output\config.json:4-10`).
- Canonicals are generated from `Astro.url.pathname` with trailing slashes stripped and query strings ignored (`src/layouts/BaseLayout.astro:91-95`); per-page absolute overrides are supported via the CMS SEO module.
- Unique `<title>`, meta description, OG/Twitter tags, robots meta, and canonical on every page; `lang="en-AU"`; GSC verification meta present (`BaseLayout.astro:164-213`).
- `robots.txt` allows all, disallows `/admin/` and `/api/`, references the sitemap index (`public/robots.txt`).
- Sitemap: `@astrojs/sitemap` with a **manual `customPages` list** of 9 URLs and an `/admin` filter (`astro.config.mjs:15-41`). Because pages are SSR, no routes are auto-discovered.
- Admin routes carry `noindex, nofollow` (`src/layouts/AdminLayout.astro:30`) and are excluded from the sitemap and robots.
- 404 returns a static `404.html` with status 404 and `noindex, follow` (`.vercel/output/config.json:149-153`; `src/pages/404.astro:10`).

**Content architecture**
- 7 public pages: `/`, `/services`, `/packages`, `/gallery`, `/about`, `/faq`, `/contact`, plus `/privacy`, `/terms`.
- CMS modules: services (3), packages (5 live), gallery, FAQs (9 live), testimonials (6 placeholder), event types. Page copy, site settings (phones, ABN, service area, socials, review URL) and SEO rows are CMS-managed.
- Services are in-page sections on `/services` with stable anchors (`#premium-photobooth`, `#roaming-photobooth`, `#360-video-booth`); packages and event types are sections, not separate URLs.
- Structured data: a single JSON-LD `@graph` with `Organization`, `WebSite`, `WebPage` only (`BaseLayout.astro:128-160`).

**Performance architecture**
- Inline stylesheets (`build.inlineStylesheets: "always"`), self-hosted Fraunces/Inter with `font-display: swap`, preloaded LCP images, lazy + async-decoded images, `react-dom` deferred until an island becomes visible or a dialog trigger is clicked, Supabase JS lazy-loaded after first interaction (or 15 s fallback), Turnstile loaded on demand.
- No third-party analytics or tag manager found.

---

## Critical Issues

### C1 — Canonical host conflict: non-www canonical vs www serving
- **Severity:** Critical
- **File/path:** `astro.config.mjs:27`; `src/layouts/BaseLayout.astro:91-95`; `public/robots.txt:6`; `.vercel/output/config.json` (host routing); production DNS/Vercel domain settings.
- **Current implementation:** `site` is `https://melbournephotoboothhire.com.au` (non-www). Live test (2026-10-05): the apex domain `https://melbournephotoboothhire.com.au/...` returns **308 → `https://www.melbournephotoboothhire.com.au/...`**, while `www` serves **200 directly**. All pages served from `www` declare `<link rel="canonical" href="https://melbournephotoboothhire.com.au/...">`, `og:url` on non-www, sitemap URLs on non-www, and robots' sitemap reference on non-www.
- **Why it matters:** Every canonical URL the site points search engines to is a redirect. Canonical tags and redirects are both canonicalisation signals (Google's documented canonical selection uses multiple signals); here they contradict the host actually serving the content. This can delay consolidation, cause Google to pick a different canonical than declared, split reporting between hosts in Search Console, and produce avoidable redirect hops. It also means `DEPLOYMENT.md`'s stated requirement ("the alternate hostname must redirect to the chosen canonical hostname") is currently inverted.
- **Evidence:** Live redirect checks: apex → 308 → www; www → 200; canonical tags on www pages point to non-www. `astro.config.mjs:27`; `robots.txt` sitemap line; `sitemap-0.xml` loc entries.
- **Recommended solution:** Choose one canonical host with the client (www or non-www), then make everything agree: set the Vercel primary domain and redirect the alternate host to it, update `site`, sitemap, robots and any CMS `canonicalUrl` overrides, and verify the matching GSC property. The safer default for this stack is usually to keep the host that Vercel already serves directly (www) and redirect the apex to it — but this is a client/ops decision, not a code-only change.
- **Implementable in code:** Partial (config values; the actual host redirect lives in Vercel/DNS).
- **Requires business/client input:** Yes (host preference, GSC property ownership).
- **Requires external platform:** Yes — Vercel domain configuration (and Google Search Console for the chosen property).

### C2 — Live test content: `/services` H1 is "Photobooth testing"
- **Severity:** Critical (content)
- **File/path:** Live CMS row for the Services page header (admin: `/admin/services-page`); fallback `src/lib/cms/seed.ts:122` ("Photobooth experiences"); rendered via `src/components/islands/LivePageHeader.tsx:59`.
- **Current implementation:** The live production `/services` page renders `<h1>Photobooth testing</h1>` while the title tag correctly targets "Photobooth Hire Services Melbourne | Premium, Roaming & 360". The repo seed value is "Photobooth experiences", so the live CMS row contains the test string.
- **Why it matters:** The H1 is the strongest on-page topic signal and the first heading users see on a primary commercial page. Publishing "Photobooth testing" wastes the main keyword slot, looks unfinished to prospects, and is exactly the kind of thin/test artifact that undermines trust and AI-answer quality. It also suggests CMS content may contain other unreviewed test strings.
- **Evidence:** Live `/services` HTML fetched 2026-10-05: `<h1>Photobooth testing</h1>`; three service H2s render correctly (Premium Photobooth, Roaming Photobooth, 360 Video Booth). Seed fallback at `seed.ts:122` proves the test string came from the live CMS row.
- **Recommended solution:** Replace the Services header title with approved copy (e.g. "Photobooth hire services in Melbourne") via the CMS Services Page editor, and do a full CMS proofread pass for other test strings before launch.
- **Implementable in code:** No (CMS content edit; code fallback is already correct).
- **Requires business/client input:** Yes (approved H1 wording).
- **Requires external platform:** No.

### C3 — Placeholder stock imagery still live (Pexels hotlinks, including OG/social images)
- **Severity:** Critical (brand/trust, third-party dependency)
- **File/path:** `src/lib/content/mock.ts:231-280, 383-426`; `src/lib/content/cmsSource.ts:99-110` (spreads `mockContent` fallbacks); CMS gallery module rows (admin `/admin/modules/gallery`); CMS SEO OG images (admin `/admin/seo`); `src/layouts/BaseLayout.astro:100-112, 200-204`.
- **Current implementation:** Several live pages still render or reference Pexels stock photos:
  - `/gallery` renders 4 Pexels `<img src>` items (`34458014`, `17641795`, `32333372`, `6224736`, all `w=1200`).
  - `/about` renders 1 Pexels `<img src>` (`34458014…w=1200`) as the story image.
  - `/faq` preloads a Pexels image (`29851245…w=1600`) as its LCP/header image.
  - `og:image`/`twitter:image` on `/services`, `/faq`, `/gallery`, `/about` and `/contact` point to `images.pexels.com` (the `heroBackgroundImage` fallback), so social shares show a stock photo rather than the brand's own work.
  - `mock.ts` documents these as provisional placeholder content that is "NOT confirmed production facts".
- **Why it matters:** Stock imagery used as if it were the business's event photography is a trust problem (customers expect real event photos), a licensing/attribution risk depending on Pexels terms, and an external dependency: Pexels URL/format changes or hotlink policy changes can break images and the FAQ LCP. The `preconnect` to `images.pexels.com` also persists whenever any mock image is referenced (`BaseLayout.astro:110-112`).
- **Evidence:** Live page fetches 2026-10-05 (Pexels `<img src>` counts above); `mock.ts` header comment; `cmsSource.ts:99-110` fallback spread; `BaseLayout.astro:100-112`.
- **Recommended solution:** Replace all placeholder gallery/service/header images with client-owned event photos uploaded through the CMS; set per-page OG images via the SEO editor; after replacement, confirm no `images.pexels.com` references remain (the code can be tightened later to drop the Pexels preconnect path once mock imagery is fully retired).
- **Implementable in code:** No (content/assets); a small code cleanup becomes possible after assets are replaced.
- **Requires business/client input:** Yes (real photos, usage permission, OG image choices).
- **Requires external platform:** No (Supabase Storage via CMS).

---

## High Priority Issues

### H1 — Pricing contradiction between "Price Starts $150" and published packages ($350–$650)
- **Severity:** High
- **File/path:** CMS page copy and modules (admin `/admin/home`, `/admin/packages`, `/admin/modules/packages`, `/admin/modules/faqs`); seed fallbacks `src/lib/cms/seed.ts:73, 173, 292`; `src/lib/content/mock.ts:289-293`.
- **Current implementation:** Live pages state:
  - Home packages heading and `/packages` plans lede: **"Price Starts $150. Final pricing is confirmed at enquiry."**
  - Packages: The Two Hour **$350 total**, The Three Hour **$450 total**, The Four Hours **$550 Total**, The Five Hours **$650 Total**, The 360 Video Booth **$600 total**.
  - FAQ "How much does photobooth hire cost?": **"Price Starts $150. Extended hire is $150 per hour…"**
  - Add-on "Extended Hire": **"$150 per hour…"**; Add-on "Magnetic Prints": **"Add magnetic prints for $150."**
- **Why it matters:** The advertised entry price does not match any bookable package. Prospective customers and AI answer engines receive conflicting facts from the same site; this damages conversion trust and factual consistency, which is foundational for AEO. In Australia, advertised pricing must not be misleading (ACCC/ACL), so this is also a compliance-adjacent content risk. (No legal conclusion is drawn here — flagging for client review.)
- **Evidence:** Live `/packages` and `/faq` fetches 2026-10-05; seed strings at `seed.ts:73, 173, 292`; `mock.ts:292`.
- **Recommended solution:** Decide the real entry price with the client, then align home/packages/FAQ copy to it (or explicitly define what "$150" refers to — e.g. a deposit or an add-on — and remove the "starts at" implication). Keep package prices, FAQ and add-ons mutually consistent.
- **Implementable in code:** No (CMS content).
- **Requires business/client input:** Yes (confirmed pricing policy).
- **Requires external platform:** No.

### H2 — Missing local/business structured data (`LocalBusiness`/`ProfessionalService`, `Service`, Organization gaps)
- **Severity:** High
- **File/path:** `src/layouts/BaseLayout.astro:128-160` (only schema source); `src/components/StructuredData.astro`.
- **Current implementation:** One JSON-LD graph: `Organization` (name, url, description, `areaServed` City "Melbourne", `sameAs` socials), `WebSite`, `WebPage`. No `LocalBusiness`/`ProfessionalService`, no `telephone`/`contactPoint`, no `logo`, no `address`/`areaServed` AdministrativeArea, no `priceRange`, no `Service` nodes for the three booths, no `BreadcrumbList`, no `FAQPage`, no `ImageObject`.
- **Why it matters:** `LocalBusiness`/`Service` markup strengthens entity understanding and is a documented way to describe a service-area business; `logo` and `telephone` are supported `Organization` properties. Structured data alone is not a ranking factor, but it helps search/AI systems resolve the entity, services and geography — directly relevant to the "photobooth hire Melbourne" local intent.
- **Evidence:** Live pages emit only Organization/City/WebSite/WebPage (verified across `/`, `/services`, `/packages`, `/contact`, `/about`, `/gallery`, `/faq`, `/privacy`); `BaseLayout.astro:128-160` intentionally omits address/phone "until the client confirms them (DEC-016)".
- **Recommended solution:** After client confirmation of business facts, extend the site graph: `ProfessionalService` (or `LocalBusiness`) with `name`, `url`, `logo` (CMS logo), `telephone`, `areaServed` (City Melbourne + AdministrativeArea Victoria), `sameAs`, `priceRange` (only if confirmed); add `Service` nodes for the three booths (ideally `@id`-linked to the services page); add `BreadcrumbList` per page. Keep the DEC-016 principle: no invented address or unconfirmed facts.
- **Implementable in code:** Yes (once facts are confirmed).
- **Requires business/client input:** Yes (phone/logo/price range/service-area wording; whether they have a public address).
- **Requires external platform:** No.

### H3 — Local contact completeness: no rendered email, address, map, hours
- **Severity:** High
- **File/path:** `src/components/islands/LiveContactAside.tsx:34-96`; `src/components/Footer.astro:15-75`; CMS settings (`contactEmail` exists but is not rendered); `src/lib/cms/seed.ts:390-418`.
- **Current implementation:** Contact/footer show service area ("Melbourne Wide / Victoria Wide"), two phones, ABN, transport note, reply-time, socials. The CMS holds `contactEmail: "melbournephotoboothhire.au@gmail.com"` (observed in live island props) but **no mailto/email is rendered anywhere**; there is no address, map, opening hours, or `contactPoint` schema.
- **Why it matters:** Contact completeness is a trust and local-relevance signal for users and search/AI systems; an enquiry business that hides its email is harder to verify. Google Business Profile and local results rely on consistent business information (NAP/contact) across site and profile.
- **Evidence:** Live `/contact` fetch: no `mailto`, no map iframe, no hours, no address; email present only in serialized island props. `LiveContactAside.tsx` renders only area/phones/ABN/transport/reply/socials.
- **Recommended solution:** Render the confirmed contact email (mailto) on `/contact` and/or footer; if the client operates from a public address, add it; otherwise keep it a service-area business and state coverage clearly. Add hours only if confirmed. Align with Google Business Profile data.
- **Implementable in code:** Yes (email render is a small component change; address/map/hours would be CMS fields + render).
- **Requires business/client input:** Yes (which contact details are public; email preference; address policy).
- **Requires external platform:** Yes for consistency (Google Business Profile).

### H4 — Google review link missing (`reviewUrl` empty)
- **Severity:** High
- **File/path:** `src/components/Footer.astro:71-75` (conditional "Leave a Google review"); CMS settings `reviewUrl: ""` (`src/lib/cms/seed.ts:393`); `src/components/islands/LiveMarquee.tsx:114-122` (on-site review submission only).
- **Current implementation:** The footer renders a "Leave a Google review" link **only when `reviewUrl` is set**; it is currently empty, so no Google review CTA exists. The homepage offers an on-site "Send Us a Review" modal (moderated testimonials), which is not a Google review.
- **Why it matters:** The project requirements explicitly include a Google Review CTA using the client's Google Business Profile review link. Reviews are a core local trust signal (and the GBP ecosystem, not on-site markup, is where Google review eligibility lives). Without the link, the site cannot funnel happy customers to the profile.
- **Evidence:** `Footer.astro:71-75`; `seed.ts:393`; live footer has no review link; live `reviewUrl` serialized as `""`.
- **Recommended solution:** Obtain the client's GBP review URL and set `reviewUrl` in Site Settings; keep the existing conditional link and consider a secondary review CTA near testimonials. Do **not** add `Review`/`AggregateRating` markup for self-hosted testimonials — Google's review snippet guidelines do not allow self-serving reviews, and the current testimonials are placeholders.
- **Implementable in code:** Yes (already wired; only the value is missing).
- **Requires business/client input:** Yes (GBP review URL).
- **Requires external platform:** Yes (Google Business Profile).

### H5 — No `FAQPage` or `BreadcrumbList` structured data
- **Severity:** High
- **File/path:** `src/pages/faq.astro`, `src/components/islands/LiveFaqSection.tsx`, `src/components/live/LiveAccordion.tsx`; `BaseLayout.astro` `structuredData` prop is unused by every page.
- **Current implementation:** The FAQ page renders 9 genuine Q&As in native `<details>` accordions, and the homepage teases 4. No `FAQPage` JSON-LD is emitted; no page emits breadcrumbs (visual or schema). The `BaseLayout` accepts extra `structuredData` nodes but no page passes any (`BaseLayout.astro:49-50, 207-209`).
- **Why it matters:** `BreadcrumbList` is a well-supported way to describe site hierarchy and can influence breadcrumb display in results. `FAQPage` markup is a supported vocabulary, but note Google's August 2023 change limits FAQ rich results to authoritative government/health sites; the remaining value is entity/AI understanding, not guaranteed rich results. The content must be confirmed/visible before markup is added (docs already require this: `ARCHITECTURE.md §18`, `DATA-MODEL.md:132`).
- **Evidence:** All live pages emit only Organization/WebSite/WebPage; `BaseLayout.astro:207-209` shows the unused hook.
- **Recommended solution:** Add `BreadcrumbList` for all pages now (hierarchy is stable). Add `FAQPage` for `/faq` only after the FAQ copy is client-approved, mapping exactly the visible questions/answers. Do not overstate expected rich-result outcomes.
- **Implementable in code:** Yes.
- **Requires business/client input:** Only for FAQ copy confirmation (breadcrumbs: no).
- **Requires external platform:** No.

### H6 — Unverified trust claims and placeholder testimonials
- **Severity:** High
- **File/path:** CMS home blob hero stats (live: "5 / star-rated", "Public / liability ensured"); `src/lib/content/mock.ts:387-391`; testimonials module (admin `/admin/modules/testimonials`); `src/components/islands/LiveMarquee.tsx`.
- **Current implementation:** Live homepage hero displays **"5 star-rated"** and **"Public liability ensured"** (the latter with a typo — the TrustStrip elsewhere says "Public Liability Insured"). The six testimonials are clearly placeholder seed content ("Mia & Jordan", "Priya S.", etc.) with 5-star ratings, presented as real customer reviews with no real names/source.
- **Why it matters:** "5 star-rated" and "Public Liability Insured" are objective trust claims that should be verifiable (real review profile, current insurance). Placeholder reviews presented as real damage credibility if noticed; they also cannot be used in review structured data (self-serving). Trust signals only help when accurate.
- **Evidence:** Live homepage island props contain the exact stats and testimonial names; `mock.ts` documents testimonials as placeholder; live footer states "Public Liability Insured" and "ABN Registered Business".
- **Recommended solution:** Confirm with the client that insurance is current and how the "5 star" claim is supported (e.g. GBP rating). Replace placeholder testimonials with real, permissioned reviews (or hide the section until real ones exist). Fix the "ensured" typo. Keep the ABN claim (it appears to be a real ABN: 77 363 405 585) but verify formatting.
- **Implementable in code:** No (CMS content).
- **Requires business/client input:** Yes (verification of claims, real reviews).
- **Requires external platform:** Yes for review evidence (Google Business Profile).

### H7 — Homepage HTML payload ~300 KB; island props duplicate rendered content
- **Severity:** High (performance)
- **File/path:** `src/pages/index.astro:26-63, 100-129`; `src/components/islands/*` (all receive full `initial` blobs); Astro's `astro-island` prop serialization.
- **Current implementation:** The homepage HTML is ~301 KB uncompressed (services page ~140 KB, packages ~164 KB, gallery ~133 KB). Each island receives complete content blobs (`initialHome`, `initial` module arrays) serialized into `astro-island` attributes in addition to the server-rendered HTML for the same content.
- **Why it matters:** Large HTML inflates transfer and parse time, delays first paint/LCP on mobile, and duplicates content in the payload. The content is already in the DOM, so the serialized props are largely redundant for initial render.
- **Evidence:** Live fetch byte counts (homepage 301,680 bytes; other pages 118–167 KB); `astro-island` attributes containing full `initial` JSON observed in live HTML; `index.astro:100-129` passes full blobs.
- **Recommended solution:** Reduce initial island props (e.g. pass only what is needed for hydration, or hydrate islands with lean props and let Realtime/live fetches patch), or move non-critical islands to server islands/`client:idle` with minimal payloads. Measure after change; do not over-engineer.
- **Implementable in code:** Yes.
- **Requires business/client input:** No.
- **Requires external platform:** No (measure with PageSpeed/Lighthouse).

---

## Medium Priority Issues

### M1 — Content errors inside package cards
- **Severity:** Medium
- **File/path:** CMS packages module (live data); `src/components/live/LiveCard.tsx:127-135` (renders `meta`/`price`).
- **Current implementation (live):** "The Four Hours" has `durationLabel` **"Photo Booth"** (wrong meta text); "The Three Hour" inclusions list "Luxury backdrops & fun props" **twice**; spelling mixes US/AU ("Personalized event branding" vs "Personalised event branding"); "The Four Hours" summary is identical to "The Five Hours" ("More time to capture every moment of the celebration.").
- **Why it matters:** Duplicated/incorrect inclusions and mismatched labels reduce credibility and can mislead buyers; duplicated summaries are thin content.
- **Evidence:** Live homepage `/packages` island props (2026-10-05).
- **Recommended solution:** Proofread and correct the Packages module; ensure each card has a unique summary and accurate duration label.
- **Implementable in code:** No (CMS content).
- **Requires business/client input:** Yes (package facts).
- **Requires external platform:** No.

### M2 — No analytics/measurement implemented
- **Severity:** Medium
- **File/path:** Repository-wide (no `gtag`/GTM/analytics found); `docs/TECH-STACK.md` lists GA4 as conditional.
- **Current implementation:** GSC verification meta is present (`BaseLayout.astro:116-118`), but no GA4/GTM/any analytics script exists.
- **Why it matters:** Without measurement, the client cannot see organic traffic, conversions, or query performance beyond GSC. GA4 was documented as conditional, so this may be deliberate; if the client wants measurement, it must be configured.
- **Evidence:** Grep for `gtag|googletagmanager|dataLayer|analytics` in `src/` returned no matches; GSC meta present live.
- **Recommended solution:** Confirm whether GA4 is in scope; if yes, add a minimal, consent-aware implementation. Do not add it merely because it is available.
- **Implementable in code:** Yes.
- **Requires business/client input:** Yes (whether GA4 is wanted; privacy/consent considerations).
- **Requires external platform:** Yes (GA4 property, if chosen).

### M3 — Sitemap maintenance risk and no `lastmod`
- **Severity:** Medium
- **File/path:** `astro.config.mjs:15-41`.
- **Current implementation:** Sitemap URLs are a **hardcoded `customPages` array** because SSR routes are not auto-discovered. Output contains exactly 9 `<loc>` entries and **no `<lastmod>`**.
- **Why it matters:** Any new public page added later will silently be absent from the sitemap unless the array is updated. `lastmod` is optional but useful for freshness signals (only when accurate).
- **Evidence:** `sitemap-0.xml` (live) lists 9 URLs with no lastmod; `astro.config.mjs:15-25`.
- **Recommended solution:** Derive sitemap entries from a single shared route registry used by navigation/sitemap, and consider accurate `lastmod` from CMS updated timestamps if available.
- **Implementable in code:** Yes.
- **Requires business/client input:** No.
- **Requires external platform:** No.

### M4 — No breadcrumbs (visual or structured)
- **Severity:** Medium
- **File/path:** All pages; `BaseLayout.astro`.
- **Current implementation:** No breadcrumb trail is rendered; no `BreadcrumbList` schema.
- **Why it matters:** Breadcrumbs aid orientation, internal linking and result display (when eligible); they also reinforce hierarchy for AI systems. The site is shallow (one level), so the benefit is modest but cheap.
- **Evidence:** Live pages contain no breadcrumb markup; only nav/footer links.
- **Recommended solution:** Add a simple breadcrumb component (Home › Page) with `BreadcrumbList` JSON-LD; on service anchors consider `Home › Services › Booth` only if URLs exist.
- **Implementable in code:** Yes.
- **Requires business/client input:** No.
- **Requires external platform:** No.

### M5 — Heading semantics: repeated footer H2s; generic H1s
- **Severity:** Medium
- **File/path:** `src/components/Footer.astro:97-124` (Explore/Legal/Ready when you are as H2); `src/components/islands/LiveContactAside.tsx:99` (Follow H2); live H1s: packages "Packages", gallery "Gallery", services "Photobooth testing" (C2).
- **Current implementation:** Every page ends with footer `<h2>`s ("Follow", "Explore", "Legal", "Ready when you are"); `/contact` has two "Follow" H2s (aside + footer). `/packages` H1 is "Packages", `/gallery` H1 is "Gallery" — generic, not keyword-aware.
- **Why it matters:** Repeated H2s on every page dilute the semantic outline; generic H1s miss an easy topical signal. Not a ranking factor per se, but heading hierarchy is documented as part of the SEO architecture (`ARCHITECTURE.md`).
- **Evidence:** Live H2/H1 extractions for all audited pages.
- **Recommended solution:** Demote footer/aside headings to non-heading elements or `<h2>` only where meaningful; make key H1s descriptive (e.g. "Photobooth hire packages in Melbourne", "Photobooth gallery: real Melbourne events").
- **Implementable in code:** Yes (heading level changes) and CMS (H1 copy).
- **Requires business/client input:** Yes for H1 wording.
- **Requires external platform:** No.

### M6 — No responsive image sets (`srcset`/`sizes`) and single 1600 px assets
- **Severity:** Medium
- **File/path:** `src/components/live/LiveGalleryFigure.tsx:54`; `src/components/live/LiveCard.tsx:97-103`; `src/components/islands/LiveServiceSections.tsx:39-44`; `src/lib/cms/storage.ts:21` (`IMAGE_MAX_EDGE = 1600`).
- **Current implementation:** Images are served as a single asset (CMS max edge 1600 px; Pexels URLs at `w=900/1200/1600`); no `srcset`/`sizes`; no `width`/`height` attributes except hero/page headers. CSS `aspect-ratio` reserves layout space (4/3 cards, 4/5 gallery, etc.), which mitigates CLS.
- **Why it matters:** Mobile devices download desktop-sized images, increasing bytes and LCP; responsive images are a documented requirement direction (`ARCHITECTURE.md §17`).
- **Evidence:** `LiveGalleryFigure.tsx:54` (`<img src alt loading decoding>` only); `LiveCard.tsx:97-103`; `storage.ts:21`; live image URLs.
- **Recommended solution:** Generate/derive responsive variants (Supabase transforms are not on the free plan per `storage.ts:15-19`; options: pre-generate variants at upload or accept single-size with tighter max edge). Add explicit width/height where intrinsic dimensions are known (CMS already stores them). Keep it proportionate to scope.
- **Implementable in code:** Yes.
- **Requires business/client input:** No.
- **Requires external platform:** No (unless paid Supabase transforms are chosen).

### M7 — Hashed image filenames
- **Severity:** Medium (image SEO)
- **File/path:** `src/lib/cms/storage.ts:123-141` (`randomSuffix()` → `img-793e01d9.jpg`).
- **Current implementation:** CMS uploads are stored as `img-<random>.jpg/webp`; Pexels placeholders carry vendor filenames.
- **Why it matters:** Filenames are a weak but real relevance signal for image search, and descriptive filenames help image discovery/organisation. Alt text is generally good, which matters more.
- **Evidence:** Live image URLs (`img-793e01d9.jpg`, `img-db9c0843.jpg`, etc.); `storage.ts:141`.
- **Recommended solution:** Derive the storage key from a slug of the image alt/title (with a uniqueness suffix) at upload time.
- **Implementable in code:** Yes.
- **Requires business/client input:** No.
- **Requires external platform:** No.

### M8 — Font payload: 9 files, no preload
- **Severity:** Medium (performance)
- **File/path:** `src/layouts/BaseLayout.astro:10-18`.
- **Current implementation:** Fraunces (400, 400 italic, 500, 600, 600 italic) + Inter (400, 500, 600, 700) are imported as `@fontsource` CSS; built CSS is inlined and `font-display: swap` is present; no `<link rel="preload">` for the fonts.
- **Why it matters:** Multiple weights/italics increase font transfer; swap prevents invisible text but can cause layout shift/FOUT. Only used weights should ship.
- **Evidence:** `BaseLayout.astro:10-18`; built CSS includes all nine `@font-face` rules (observed in `404.html` build output).
- **Recommended solution:** Trim to actually used weights, subset where possible, and preload only the primary body/display weights if they are on the LCP critical path.
- **Implementable in code:** Yes.
- **Requires business/client input:** No.
- **Requires external platform:** No.

### M9 — Residual placeholder/test strings in CMS and serialized payloads
- **Severity:** Medium
- **File/path:** CMS rows (`/admin/*`); evidence in live HTML.
- **Current implementation:** Live `/packages` serialized props still contain "options will be shown here once confirmed." (empty-state copy); C2 is the visible example. Placeholder testimonial names and stock-image captions ("Wedding reception", "Booth sessions") also remain.
- **Why it matters:** Unreviewed placeholder copy can surface in production (as it already has on `/services`), and generic stock captions add little topical value.
- **Evidence:** Live page props 2026-10-05; `seed.ts`/`mock.ts` placeholder comments.
- **Recommended solution:** Run a CMS content QA pass with the client across all page blobs, modules, and SEO rows before launch.
- **Implementable in code:** No.
- **Requires business/client input:** Yes.
- **Requires external platform:** No.

### M10 — Two-hop redirects for trailing-slash URLs on apex host
- **Severity:** Medium (technical)
- **File/path:** `.vercel/output/config.json:4-10` (slash redirect); Vercel host routing (C1).
- **Current implementation:** `https://melbournephotoboothhire.com.au/services/` → 308 to `https://www…/services/` → 308 to `https://www…/services` (2 hops). `www/services/` → 1 hop. Correct final URL and canonical; extra hop is caused by the host mismatch.
- **Why it matters:** Redirect chains waste crawl budget and dilute link equity modestly; fixing C1 removes the chain.
- **Evidence:** Live redirect tests 2026-10-05.
- **Recommended solution:** Resolve as part of C1 (single canonical host), then confirm `/x/` → one 308 to `/x`.
- **Implementable in code:** Partial.
- **Requires business/client input:** Yes (host choice).
- **Requires external platform:** Yes (Vercel).

### M11 — Static `/404.html` is also reachable as a 200 page
- **Severity:** Medium (technical)
- **File/path:** `dist/client/404.html`; `.vercel/output/config.json:19-20, 149-153`.
- **Current implementation:** Unknown routes get `404.html` with status 404 (correct). However `/404.html` itself is served by the filesystem handler with **200**, and its canonical is `…/404` with `noindex, follow`.
- **Why it matters:** A soft-200 duplicate of the 404 template can be crawled and indexed as a URL (noindex prevents indexing but wastes a crawl). Low real-world impact.
- **Evidence:** `config.json` route order; build-time `404.html` canonical/robots observed.
- **Recommended solution:** Optionally redirect `/404.html` to `/404` or the homepage with 404 status, or leave as-is given noindex. Low effort, low priority.
- **Implementable in code:** Yes.
- **Requires business/client input:** No.
- **Requires external platform:** No.

### M12 — Social/OG metadata lacks dimensions, and default OG image is a placeholder
- **Severity:** Medium
- **File/path:** `BaseLayout.astro:100-103, 183-199`.
- **Current implementation:** `og:image` is emitted without `og:image:width`/`height`/`type`; the default is `heroBackgroundImage` (Pexels placeholder on most pages). Homepage has a CMS OG image; other pages default to the Pexels hero.
- **Why it matters:** Declared dimensions help social platforms render cards without an extra fetch; placeholder OG images weaken social sharing (part of C3).
- **Evidence:** Live OG tags on `/services`, `/faq`, `/gallery`, `/about`, `/contact` point to Pexels; no dimension tags.
- **Recommended solution:** Set per-page OG images via the SEO editor; add dimensions when the CMS stores them.
- **Implementable in code:** Yes (dimensions) / No (image choice).
- **Requires business/client input:** Yes (OG image assets).
- **Requires external platform:** No.

---

## Low Priority Issues

### L1 — Social `sameAs` URLs contain tracking parameters
- **Severity:** Low
- **File/path:** CMS Site Settings socials; live schema output.
- **Current implementation:** `sameAs` includes `https://www.instagram.com/melbournephotoboothhire.au?stkn=MXQ4dnJoaWd0eTBtcQ%3D%3D&utm_source=qr` and a Facebook share URL with `mibextid` parameter.
- **Why it matters:** Tracking/share parameters in entity `sameAs` URLs are noise; cleaner canonical profile URLs are preferable for entity reconciliation.
- **Evidence:** Live JSON-LD output; `seed.ts:397-406`.
- **Recommended solution:** Replace with clean profile URLs in Site Settings.
- **Implementable in code:** No (CMS value).
- **Requires business/client input:** Yes (confirm official profiles).
- **Requires external platform:** No.

### L2 — No image sitemap entries
- **Severity:** Low
- **File/path:** `astro.config.mjs:40`.
- **Current implementation:** The sitemap has no `image:image` entries.
- **Why it matters:** Images are present in HTML and are discoverable via crawling; an image sitemap is an optional accelerator, not a requirement. Google deprecated the dedicated image sitemap extension in 2022 (images are now discovered from standard sitemaps/page HTML), so this is informational only.
- **Evidence:** `sitemap-0.xml`.
- **Recommended solution:** No action required unless image indexing is later found lacking.
- **Implementable in code:** N/A.
- **Requires business/client input:** No.
- **Requires external platform:** No.

### L3 — `keywords` CMS field is planning-only (correctly not rendered)
- **Severity:** Low (informational)
- **File/path:** `src/lib/supabase/seo.ts:98`; `BaseLayout` (not rendered).
- **Current implementation:** The SEO module stores `keywords`, but pages never emit `<meta name="keywords">`.
- **Why it matters:** This matches current best practice (meta keywords are ignored by major search engines). No action needed; documented here to avoid a future "fix" being made in error.
- **Evidence:** `seo.ts:98`; no keywords meta in live HTML.
- **Recommended solution:** Keep as planning-only.
- **Implementable in code:** N/A.
- **Requires business/client input:** No.
- **Requires external platform:** No.

### L4 — GSC verification token is hardcoded as a fallback
- **Severity:** Low
- **File/path:** `BaseLayout.astro:116-118`.
- **Current implementation:** A default verification token is hardcoded and can be overridden by `PUBLIC_GOOGLE_SITE_VERIFICATION`. The token is public by design (safe), but the property it verifies must match the canonical host chosen in C1.
- **Why it matters:** If GSC verifies only one host (e.g. non-www) while the other serves content, reporting may be split or confusing.
- **Evidence:** Live pages emit the token; `BaseLayout.astro:116-118`.
- **Recommended solution:** Confirm the GSC property and re-verify after the host decision; keep token via env if preferred.
- **Implementable in code:** Yes.
- **Requires business/client input:** Yes (GSC ownership).
- **Requires external platform:** Yes (Google Search Console).

### L5 — No `og:image:width/height` or content timestamps
- **Severity:** Low
- **File/path:** `BaseLayout.astro:183-199`.
- **Current implementation:** No image dimension tags; no `article:modified_time` (not applicable to a service site) and no visible "last updated" outside legal pages.
- **Why it matters:** Minor social rendering polish and freshness signalling; not required.
- **Evidence:** Live meta tags.
- **Recommended solution:** Optional; add dimensions if OG images are finalised.
- **Implementable in code:** Yes.
- **Requires business/client input:** No.
- **Requires external platform:** No.

### L6 — Page-header images use empty alt plus separate sr-only text
- **Severity:** Low
- **File/path:** `src/components/PageHeader.astro:17-28`; `src/components/islands/LivePageHeader.tsx:40-51`; `Hero.astro:47-61`.
- **Current implementation:** Header/hero background images are `alt=""` with `aria-hidden="true"` and a nearby `sr-only` span carrying the alt text.
- **Why it matters:** This is an acceptable pattern for decorative backgrounds; search engines will not associate the sr-only text with the image. No action needed, but if any header image is meant to be a content image, give the `<img>` a real alt instead.
- **Evidence:** Component source.
- **Recommended solution:** Leave as decorative; revisit only if header imagery becomes content.
- **Implementable in code:** Yes (if needed).
- **Requires business/client input:** No.
- **Requires external platform:** No.

### L7 — Admin/API protections are sound (no action)
- **Severity:** Low (informational)
- **File/path:** `public/robots.txt`; `src/layouts/AdminLayout.astro:30`; `src/middleware.ts`.
- **Current implementation:** Admin disallowed in robots, `noindex, nofollow`, excluded from sitemap, auth-guarded by middleware; API disallowed in robots.
- **Why it matters:** Confirms no accidental admin indexing exposure.
- **Evidence:** Source and live `robots.txt`.
- **Recommended solution:** None.
- **Implementable in code:** N/A.
- **Requires business/client input:** No.
- **Requires external platform:** No.

---

## Technical SEO Findings

**Confirmed working**
- Crawlable, server-rendered HTML for all public content; no JS dependency for visible copy (islands are SSR'd; verified live).
- `robots.txt` valid; allows all public pages, disallows `/admin/` and `/api/`, references `sitemap-index.xml` (`public/robots.txt`).
- Sitemap index + urlset valid; 9 public URLs; admin filtered (`astro.config.mjs:40`; live `sitemap-0.xml`).
- Canonicals present and self-referential on every page, query strings excluded; per-page override supported.
- Trailing slashes normalised with 308 at the edge (`.vercel/output/config.json:4-10`).
- Unknown routes return HTTP 404 via `404.html`; 404 page `noindex, follow` (`src/pages/404.astro:10`).
- No accidental `noindex` on public pages: live robots meta is `index, follow, max-image-preview:large` everywhere audited.
- Unique title/description per page; no duplicate titles found.
- `lang="en-AU"`, viewport meta, `theme-color`, favicon (CMS-overridable) present.
- Internal links: header (desktop + mobile), footer, CTAs, contextual service/package links; no orphan pages found.
- GSC verification meta present.

**Issues**
- **C1 host conflict** (critical): canonical/sitemap/OG/site on non-www, serving on www; every canonical URL redirects.
- **M3 sitemap manual list + no lastmod.**
- **M10 two-hop trailing-slash redirects** on apex host (consequence of C1).
- **M11 `/404.html` reachable with 200.**
- **M5 heading dilution** from repeated footer H2s.
- **C2 test H1** on `/services`.
- No `hreflang` (not needed — single locale).
- No `X-Robots-Tag` headers (not needed).
- Preview/staging URLs: no accidental staging canonical found; Vercel preview URLs are not referenced in canonicals. (Preview protection is a deployment concern; not observed as indexed.)

**Rendering strategy note**
- All public pages are SSR with edge SWR caching (`s-maxage=300`, `stale-while-revalidate=3600`). This is crawl-friendly and fast; CMS edits appear within ~5 minutes at the edge plus realtime patching for open tabs. No indexability concern.

---

## Keyword / Search Intent Findings

**Coverage (confirmed live titles)**
- `melbourne photobooth hire` / `photobooth hire melbourne`: homepage title "Photobooth Hire Melbourne | Melbourne Photobooth Hire"; H1 "PHOTOBOOTH AND 360 BOOTH FOR HIRE."
- `photobooth melbourne`: covered by homepage title/eyebrow/content.
- `photobooth hire services melbourne`: `/services` title; H2s for each booth (H1 currently broken by C2).
- `photobooth hire packages melbourne` / price intent: `/packages` title "Photobooth Hire Packages Melbourne | Prices & Inclusions".
- `photobooth gallery melbourne`: `/gallery` title.
- `photobooth hire faqs melbourne`: `/faq` title.
- `360 photobooth melbourne`: partially covered — "360" appears in the `/services` title ("Premium, Roaming & 360"), the 360 Video Booth H2/section and FAQ. There is **no URL or title specifically targeting "360 photobooth Melbourne"** and no `360-photobooth` page.
- `wedding photobooth melbourne` and `corporate photobooth melbourne`: **not targeted by any title, H1, or URL**. They appear only in meta descriptions, body copy, testimonials and the event-types ticker/dropdown. These are stated primary commercial goals in the audit brief, so this is the largest keyword-architecture gap.
- `roaming photobooth melbourne`: covered inside `/services` (title "Roaming", H2 "Roaming Photobooth", anchor `#roaming-photobooth`).

**Search-intent quality**
- Commercial intent is well served: pricing page, inclusions, add-ons, policies, CTAs and enquiry form with contextual `?service=`/`?package=` prefill.
- Informational intent is partly served by the FAQ page (9 Q&As) and the "How it works" steps.
- Transactional/local intent lacks suburb/venue coverage (see Local SEO).
- No content targets comparisons ("photobooth vs 360 booth") or occasion-specific questions beyond the FAQ.

**Constraint to respect**
- `ARCHITECTURE.md §18` and `DATA-MODEL.md:223` explicitly say event types stay within relevant sections and **unnecessary SEO landing pages must not be created** unless explicitly required (REQ-SEO-021, REQ-NAV-007). Any dedicated wedding/corporate/360 pages therefore require a scope decision by the user/client, not an assumption.

---

## Local SEO Findings

**Strengths (confirmed live)**
- Business identity: brand name in header/footer/schema; ABN 77363405585 displayed in footer and contact aside; two phone numbers with `tel:` links; Instagram/Facebook; Messenger link (`m.me/61594847012593`).
- Geographic context: `areaServed` City "Melbourne" in schema; "Melbourne Wide / Victoria Wide" service-area statement in footer/contact/trust strip; "Melbourne" in titles/H1s/copy; FAQ "Do you travel outside Melbourne?".
- Trust strip on the homepage repeats service area, phones, ABN and "Public Liability Insured"/"ABN Registered Business".
- Event types relevant to Melbourne audiences (Weddings, Corporate Events, Birthdays, Private Celebrations) in the ticker/form.

**Gaps**
- No `LocalBusiness`/`ProfessionalService` schema, no `telephone`/`logo`/`areaServed` Victoria in structured data (H2).
- No public email rendered despite being in the CMS; no address/map/hours (H3). For a service-area business, no address is acceptable — but the site should be explicit that it is mobile/service-area only, and GBP should match.
- No Google review link (H4) — the required GBP review CTA is missing.
- No suburb/region coverage content (e.g. inner suburbs, Bayside, Geelong corridor). Docs prohibit fabricated location pages; legitimate coverage statements should come from the client's actual travel policy (the CMS already has a transport note).
- No Google Business Profile linkage visible on-site (no map embed, no profile link, no review count).
- No opening hours or response-time promise beyond "within one business day" (contact aside) — good as far as it goes.

**External dependency**
- Google Business Profile is not inspectable from the codebase. Whether a GBP exists, is verified, categorised as a photobooth service, and has the correct service area/phone/website is an **assumption requiring confirmation**. This is the single highest-leverage local SEO item outside the website.

---

## Content Findings

**Strengths**
- Service descriptions are specific and benefit-led ("open-air, studio-lit…", "moves through the crowd…", "360° slow-motion platform…") with highlight lists and clear CTAs.
- FAQ answers are direct and practical (booking lead time, inclusions, 360 explanation, travel, setup, space, deposit, add-ons).
- Process steps ("Enquire → Design → Celebrate") explain the customer journey.
- About page tells a coherent local story with values.
- Privacy and Terms are substantive and specific to the business (deposits, rescheduling, venue requirements, photography usage).
- No keyword stuffing observed; copy reads human.

**Problems (confirmed)**
- **C2 test H1** on `/services` ("Photobooth testing").
- **H1 pricing contradiction** ($150 vs $350+; FAQ vs packages).
- **H6 unverified trust claims** ("5 star-rated", "Public liability ensured" typo) with placeholder testimonials.
- **M1 package card errors** (wrong duration label, duplicate inclusion, US/AU spelling mix, duplicated summaries).
- Placeholder gallery captions and Pexels imagery (C3).
- Services page has no introductory paragraph between H1 and the first booth (thin intro); `LivePageHeader` lede may exist but the live services header copy is the test row — verify after C2.

**Likely problems**
- Occasion coverage (weddings/corporate/birthdays/school formals) is shallow: only a ticker and dropdown, no explanatory sections. If the client wants these commercial terms, the content does not currently satisfy that intent.
- Testimonials are all 5-star and generic; without real names/sources they read as invented, which is a trust liability for both users and AI answer engines.

**Opportunities**
- Add an intro/definition block on `/services` ("What is photobooth hire?") and per-booth "best for" guidance.
- Add occasion-specific sections (wedding/corporate/birthday) within existing pages, respecting the no-new-landing-pages constraint, unless the client explicitly approves dedicated pages.
- Add comparison content ("Photobooth vs 360 Video Booth") and venue/setup logistics content grounded in real operational experience.
- Add a short "why choose us" proof block with verifiable facts (years operating, events delivered, insurance) only once confirmed.

---

## Internal Linking Findings

**Current map (confirmed)**
- Global: header desktop nav + mobile nav + footer "Explore" link all 7 pages; footer "Legal" links privacy/terms.
- Homepage → `/packages`, `/services`, `/gallery`, `/faq`, `/contact` (multiple CTAs), plus `#packages-heading` scroll anchor.
- Services → `/contact?service=<id>` per booth (3 contextual links), `/packages` (7 links).
- Packages → `/contact?package=<id>` per card, `/services`.
- Gallery → `/contact`, `/packages`.
- About → `/contact`, `/gallery`.
- FAQ → `/contact`, `/packages`.
- 404 → homepage, contact, popular pages.
- No orphan pages found.

**Gaps**
- No breadcrumbs (M4).
- Services sections do not link to the gallery (visual proof) or to packages with the matching package preselected; gallery items do not link back to services/packages.
- FAQ answers contain no contextual internal links (e.g. pricing answer → `/packages`, 360 answer → `/services#360-video-booth`), missing natural anchor opportunities.
- Event-type mentions (weddings, corporate, school formals) are plain text, not links.
- Anchor text is largely generic ("Book Now", "View packages", "Read all FAQs"); add some descriptive anchors where natural.

**Quality checks**
- Contextual `?service=`/`?package=` links canonicalise to `/contact` (query excluded from canonical), so no duplicate-URL risk from those links.
- Footer/nav links repeat site-wide but are appropriate.

---

## Structured Data Findings

**Current implementation (confirmed live on all audited pages)**
- One `application/ld+json` block per page: `@graph` of `Organization` (`@id …/#organization`, name, url, description, `areaServed` City Melbourne, `sameAs` socials), `WebSite` (`@id …/#website`, name, `inLanguage`, `publisher`), `WebPage` (`@id <canonical>#webpage`, url, name, description, `inLanguage`, `isPartOf`, `about`).
- JSON is safely escaped (`<` → `\u003c`) by `src/components/StructuredData.astro:18`.
- Only confirmed facts are emitted by design (DEC-016); address/phone/price deliberately omitted until confirmed.

**What is missing / flagged**
- `LocalBusiness`/`ProfessionalService` — missing; strongly relevant to local intent (H2).
- `logo` — missing from `Organization` even though a CMS logo exists (live logo asset `img-ef5f540b.webp`); supported property, safe to add.
- `telephone`/`contactPoint` — missing; phones are displayed on-page (H2/H3).
- `address` — absent; correct if the business is a service-area business with no public address, but should be a conscious decision (H3).
- `areaServed` — only City "Melbourne"; could add AdministrativeArea "Victoria" if coverage is confirmed.
- `Service` nodes for Premium/Roaming/360 — missing; the content exists and is visible (H2).
- `BreadcrumbList` — missing (M4/H5).
- `FAQPage` — missing; content exists but should be client-approved before markup; note the rich-result limitation for non-government/health sites (H5).
- `Review`/`AggregateRating` — correctly **not** emitted. On-site testimonials are placeholder and Google's review snippet policies exclude self-serving reviews; do not add.
- `ImageObject`/`primaryImageOfPage` — missing; optional.
- No duplicate or conflicting schema found; no invalid JSON observed.
- The `WebPage.about` → Organization relationship is sound; `WebSite.publisher` → Organization is sound.

---

## AEO / GEO Findings

**Strengths**
- Direct question/answer content on `/faq` (9 Q&As) with concise, self-contained answers — good raw material for AI answer engines.
- Clear service definitions, especially the 360 Video Booth ("films slow-motion video from every angle… delivered by instant QR download").
- Process explanation, inclusions, policies and pricing (albeit inconsistent) provide factual grounding.
- Entity name is consistent ("Melbourne Photobooth Hire") across title, schema, footer and content.
- `lang="en-AU"` and local phrasing ("Melbourne", "Victoria") support geographic grounding.

**Weaknesses**
- **Factual inconsistency** (pricing) is the biggest AEO risk: AI systems may quote either "$150" or "$350", undermining trust.
- **Test H1** ("Photobooth testing") and placeholder reviews/imagery reduce content quality signals.
- No `FAQPage`/`BreadcrumbList`/`Service` markup to reinforce question, hierarchy and service entities.
- No definitional "What is photobooth hire?" block, no "best for" guidance per booth, no comparison content.
- No explicit business facts (email, coverage policy, insurance verification) that AI systems can cite.
- Questions in the FAQ are `<span>` text inside `<summary>`, not headings; content is still parseable, but a `FAQPage` mapping and/or heading semantics would help.
- No visible dates/authorship for freshness; legal pages carry "Last updated: September 2026" but service pages do not.

**Guidance**
- Avoid "AI SEO tricks"; the correct fix is content accuracy, entity clarity, and standard schema. No claims about AI ranking factors are made here.

---

## Image SEO Findings

**Strengths**
- Alt text is present and descriptive on content images (service, card, gallery, story) and falls back to the service name.
- Below-the-fold images are `loading="lazy" decoding="async"`; hero/page-header images are `eager`, `fetchpriority="high"` and preloaded.
- CSS `aspect-ratio` reserves space for card (4/3), service (4/3), gallery (4/5), showcase (3/4) and story (4/5) images, so CLS risk is low even without width/height attributes.
- CMS uploads are downscaled to a 1600 px max edge and re-encoded to WebP where beneficial; legacy media was backfilled (`scripts/optimize-cms-media.mjs`, `src/lib/cms/storage.ts`).
- LCP image preload matches the rendered hero/header source, and the hero preload uses the CMS image when set (`index.astro:44-47`).

**Issues**
- **C3 placeholder Pexels images** remain on gallery/about and as FAQ LCP/OG images.
- **M7 hashed filenames** (`img-793e01d9.jpg`) carry no keyword value.
- **M6 no `srcset`/`sizes`**; single 1600 px asset served to all viewports.
- Missing `width`/`height` attributes on card/service/gallery images (mitigated by CSS aspect-ratio; still best practice).
- `og:image` lacks dimensions (M12).
- No image-specific sitemap entries (L2 — informational, not required).
- Decorative header images use `alt=""` (acceptable; L6).

---

## Performance Findings

**Confirmed strengths**
- Static, server-rendered HTML with inlined critical CSS (`build.inlineStylesheets: "always"`); no render-blocking stylesheet requests.
- `react-dom` is not on the initial load: islands hydrate `client:visible` (rootMargin −20%) and dialogs are dynamically imported on first trigger (`BaseLayout.astro:226-278`).
- Supabase JS is lazy-loaded and the Realtime socket opens on first interaction (15 s fallback), so it does not compete with LCP (`src/lib/realtime/channels.ts:14-17, 44-51`).
- Fonts are self-hosted with `font-display: swap`.
- LCP image preload + `fetchpriority="high"`; hero/header images are `eager`.
- Edge caching: `s-maxage=300, stale-while-revalidate=3600` for public pages; immutable 1-year caching for hashed `/_astro` assets (`.vercel/output/config.json:11-17`).
- No third-party tag managers/analytics, no ad scripts; Turnstile loaded only on demand (`src/lib/turnstile.ts`).
- CMS uploads are size-capped/re-encoded (1600 px, WebP) with immutable cache for new keys.

**Likely/confirmed problems**
- **H7: HTML payload bloat** — homepage ~301 KB uncompressed, other pages 118–167 KB, largely due to serialized `astro-island` props duplicating rendered content. This is the main measurable performance risk.
- **M8: font payload** — 9 font files, no preload; trim weights.
- **M6: no responsive image sets** — mobile downloads desktop-sized images.
- **C3/M13: Pexels third-party images** — FAQ LCP depends on `images.pexels.com`; a third-party preconnect is emitted, adding a connection on affected pages.
- No `srcset` on the LCP hero: one large image for all viewports (preload matches, but mobile still downloads full-size).
- No width/height on most images (CLS mitigated by CSS, but explicit dimensions are safer).

**Not verified**
- No field Core Web Vitals (CrUX) or lab Lighthouse run was performed as part of this audit; findings are code/live-HTML based. Recommend a PageSpeed Insights run post-fix.

---

## Trust / Entity Findings

**Present**
- Brand: "Melbourne Photobooth Hire" consistently used.
- Contact: two phone numbers with `tel:` links; ABN 77363405585 displayed; transport note.
- Claims: "ABN Registered Business", "Public Liability Insured" (footer/trust strip), "5 star-rated" and "Public liability ensured" (hero, with typo).
- Social profiles: Instagram, Facebook; Messenger (`m.me/61594847012593`).
- Customer proof: 6 testimonials (placeholder), star ratings, event types.
- Policies: Privacy Policy and Terms & Conditions, specific and business-relevant.
- About page: local story, values, stats ("3 booth experiences", "4 hrs longest hire", "HD prints", "1 day typical reply").

**Gaps / risks**
- Trust claims are not verifiable on-site (no insurance certificate reference, no linked review profile, no real review count). "5 star-rated" is unsupported by any real review evidence.
- Placeholder testimonials presented as real reviews (H6).
- No Google Business Profile link or review CTA (H4).
- No email rendered (H3); no address/hours/map (H3).
- No team/owner identity, no business history dates, no venue/client logos (none confirmed — do not invent).
- Social `sameAs` URLs contain tracking parameters (L1).
- Entity relationship in schema is minimal (no `logo`, `telephone`, `founder`, `foundingDate`).

**Assumption requiring confirmation:** the ABN, phone numbers, insurance status and social profiles appear to be client-supplied (they are live and also in the CMS seed), but their accuracy and the client's willingness to publish each claim must be confirmed. No fabricated claims should be added.

---

## Missing Opportunities

1. **Canonical host alignment** (C1) — single highest-impact technical fix.
2. **LocalBusiness/Service schema + logo/telephone** (H2) after fact confirmation.
3. **Breadcrumbs** (M4/H5) — cheap hierarchy + eligibility for breadcrumb display.
4. **FAQPage markup** (H5) once FAQ copy is approved — with realistic expectations (no guaranteed rich results).
5. **Google Business Profile review link** (H4) — required deliverable currently absent.
6. **Real event photography + per-page OG images** (C3/M12).
7. **Rendered contact email** (H3) — already in CMS.
8. **Occasion content** (weddings/corporate/birthdays/school formals) within existing pages, subject to the no-unnecessary-landing-pages constraint; dedicated pages only if explicitly approved.
9. **Pricing consistency** (H1) — a single source of truth for prices across home/packages/FAQ.
10. **Image file naming + responsive variants** (M6/M7).
11. **HTML payload reduction** (H7).
12. **Analytics decision** (M2) — GA4 only if confirmed.
13. **CMS content QA pass** to remove all placeholder/test strings (C2/M9).
14. **Descriptive internal anchor text + FAQ internal links** (Internal Linking).
15. **Structured `Service` nodes** for the three booths (H2) and `#360-video-booth` anchor reinforcement.

---

## Potential Keyword Cannibalization

**Assessment: low-to-moderate risk overall.**
- Homepage ("Photobooth Hire Melbourne") vs `/services` ("Photobooth Hire Services Melbourne") vs `/packages` ("Photobooth Hire Packages Melbourne") are differentiated by intent modifiers ("hire", "services", "packages"). Low risk today.
- Homepage H1 "PHOTOBOOTH AND 360 BOOTH FOR HIRE." overlaps thematically with `/services#360-video-booth`; both could compete for "360 booth hire Melbourne" if the services section is expanded. The homepage only previews services, so risk is currently low.
- `/faq` targets "Photobooth Hire FAQs Melbourne" and `/gallery` "Photobooth Gallery Melbourne" — distinct.
- **Future risk:** if dedicated wedding/corporate/360 pages are added without differentiation, they could cannibalize homepage and services terms. Any new page should have a distinct primary intent and unique copy.
- **No duplicate titles/descriptions found**; no thin near-duplicate pages exist.

---

## Recommended Page Architecture

**Constraint:** `docs/ARCHITECTURE.md §18` and `docs/DATA-MODEL.md:223` prohibit unnecessary SEO landing pages; event types must stay within relevant sections unless explicitly required (REQ-SEO-021, REQ-NAV-007). The recommendations below therefore distinguish "in-scope now" from "requires explicit approval".

**In-scope (no new pages)**
- Keep the existing 9 URLs (7 public + privacy + terms).
- Fix H1s to be descriptive and location-aware:
  - `/services` → approved H1 (replacing "Photobooth testing"), e.g. "Photobooth hire services in Melbourne".
  - `/packages` → e.g. "Photobooth hire packages in Melbourne".
  - `/gallery` → e.g. "Photobooth gallery: real Melbourne events".
- Strengthen `/services` sections with intro/definition copy and "best for" guidance per booth, keeping anchors `#premium-photobooth`, `#roaming-photobooth`, `#360-video-booth` stable (these already exist and are linked by the jump nav).
- Add breadcrumbs to all pages.
- Add `BreadcrumbList`, `LocalBusiness`/`ProfessionalService`, `Service` and (after approval) `FAQPage` schema.
- Add occasion sections (weddings, corporate, birthdays, school formals) inside `/services` or the homepage with unique copy, if the client wants those terms.

**Requires explicit scope approval (do not create unprompted)**
- Dedicated landing pages, e.g.:
  - `/wedding-photobooth-melbourne`
  - `/corporate-photobooth-melbourne`
  - `/360-photobooth-melbourne`
  - `/roaming-photobooth-melbourne`
  These are the natural home for the stated primary commercial goals, but they conflict with the documented "no unnecessary SEO landing pages" constraint unless the user/client explicitly expands scope. If approved, each page must have genuinely unique content (venues, packages, FAQs, real photos) — not templated suburb pages — and must be added to the sitemap registry (M3) and navigation where appropriate.
- Suburb/location pages: **not recommended** (thin-content risk, and docs prohibit fabricated location content).

---

## Recommended SEO Roadmap

**Phase 1 — Launch blockers (technical + content accuracy)**
- C1 canonical host decision and alignment (Vercel + config + GSC).
- C2 replace test H1 and run CMS proofread.
- C3 replace placeholder imagery and OG images.
- H1 fix pricing contradiction.
- H6 verify/remove trust claims; replace placeholder testimonials.

**Phase 2 — Local entity and structured data**
- H2 `LocalBusiness`/`ProfessionalService` + `Service` + logo/telephone (confirmed facts only).
- M4/H5 breadcrumbs + `BreadcrumbList`.
- H5 `FAQPage` once FAQ copy approved.
- H4 Google Business Profile review link; H3 render email and finalise contact policy.

**Phase 3 — Content depth (scope-controlled)**
- Strengthen `/services` and homepage occasion content.
- FAQ internal links; descriptive anchors.
- Decide on dedicated event/360 pages (requires explicit approval).

**Phase 4 — Performance and image SEO**
- H7 reduce island prop payload; M6 responsive images; M7 filenames; M8 fonts.
- Validate Core Web Vitals after changes (PageSpeed Insights / field data).

**Phase 5 — Measurement and operations**
- M2 analytics decision (GA4 only if confirmed); verify GSC property and submit sitemap.
- Ongoing CMS content QA; monitor GBP reviews.

---

## Confirmed vs Likely vs Opportunities vs Assumptions

### 1. Confirmed problems (observed in code and/or live production)
- C1 canonical host conflict (live redirect + canonical test).
- C2 `/services` H1 "Photobooth testing" (live HTML).
- C3 placeholder Pexels imagery live on gallery/about/FAQ and OG images (live HTML).
- H1 pricing contradiction ($150 vs $350–$650) (live HTML).
- H6 "5 star-rated" / "Public liability ensured" typo and placeholder testimonials (live HTML).
- M1 package card errors (wrong duration label, duplicate inclusion, spelling mix, duplicated summaries) (live HTML).
- M3 sitemap manual list, no lastmod (live sitemap + config).
- M5 repeated footer H2s; generic H1s (live HTML).
- M6 single-size images, no srcset (source + live).
- M7 hashed filenames (live URLs + `storage.ts`).
- M8 nine font files (source + build output).
- M10 two-hop trailing-slash redirect on apex (live redirect test).
- M11 `/404.html` reachable with 200 (config + build output).
- H5 no FAQPage/BreadcrumbList; H2 no LocalBusiness/Service (live JSON-LD).
- L1 social sameAs tracking parameters (live JSON-LD).
- No analytics found (source grep).

### 2. Likely problems (strong indicators, not fully verified)
- H7 HTML payload bloat affecting mobile LCP (byte counts confirmed; field CWV not measured).
- Occasion-content gap hurting wedding/corporate visibility (no titles/H1s target them — confirmed; impact on rankings not verifiable from the codebase).
- FAQ rich-result limitations mean FAQ schema may not change SERP appearance (Google policy, not a code defect).
- Trust claims may be inaccurate/unverifiable (claims confirmed present; their factual accuracy is unknown).
- Google Business Profile state unknown (external).

### 3. Opportunities (no defect, but upside)
- Breadcrumbs, Service/LocalBusiness schema, email display, Google review CTA, real photography, responsive images, descriptive filenames, font trimming, payload reduction, analytics, occasion content, FAQ internal links, `lastmod`.
- Dedicated wedding/corporate/360 pages **if and only if** scope is explicitly expanded.

### 4. Assumptions requiring confirmation
- Which host is intended as canonical (www vs non-www) and which GSC property is verified.
- Whether the client has a Google Business Profile and its review URL; whether they have a public address or are strictly service-area.
- Accuracy/currency of the insurance claim, the "5 star" claim, ABN, phone numbers and social profiles.
- Whether GA4/measurement is in scope.
- Whether dedicated event/360 landing pages are approved scope (docs currently say no unnecessary landing pages).
- Whether the CMS content observed (test H1, prices, package errors, placeholder reviews) is final client content or still in-progress; who owns final approval.
- Whether Supabase paid image transforms are available (affects responsive-image approach).

---

## Recommended Execution Order

1. **Decide the canonical host with the client** (www vs non-www), then make Vercel redirect the alternate host to it, and update `site`, sitemap, robots and GSC to match. (C1, M10, L4)
2. **Replace the `/services` test H1** with approved keyword-aware copy via the CMS Services Page editor. (C2)
3. **Run a full CMS content QA pass**: remove all test/placeholder strings, fix the package card errors and duplicated summaries, and confirm every page's H1. (C2, M1, M9, M5)
4. **Fix the pricing contradiction**: agree the real entry price and align home, packages, FAQ and add-on copy. (H1)
5. **Replace all placeholder Pexels imagery** with client-owned photos in the gallery/services modules and set per-page OG images. (C3, M12)
6. **Verify or remove trust claims** ("5 star-rated", "Public liability ensured/Insured") and replace placeholder testimonials with real, permissioned reviews. (H6)
7. **Add the Google Business Profile review link** to Site Settings so the footer review CTA activates, and align GBP NAP/website with the chosen host. (H4, H3)
8. **Render the confirmed contact email** (and address/hours only if confirmed) on `/contact` and/or footer. (H3)
9. **Add `LocalBusiness`/`ProfessionalService`, `Service` and `Organization` `logo`/`telephone` structured data** using confirmed facts only. (H2)
10. **Add breadcrumbs and `BreadcrumbList` schema** across public pages. (M4, H5)
11. **Add `FAQPage` schema** to `/faq` once FAQ copy is client-approved. (H5)
12. **Strengthen occasion content** (weddings, corporate, birthdays, school formals) within existing pages; decide explicitly whether dedicated landing pages are in scope before creating any. (Keyword/Content sections)
13. **Improve internal linking**: FAQ answer links to `/packages` and `/services#360-video-booth`, services ↔ gallery cross-links, descriptive anchors. (Internal Linking)
14. **Reduce homepage island prop payload** and measure LCP/TTFB before and after. (H7)
15. **Add responsive image variants, descriptive filenames and explicit width/height**, and trim font weights. (M6, M7, M8, M12)
16. **Automate the sitemap route list** and add accurate `lastmod` if CMS timestamps allow. (M3)
17. **Clean up low-priority items**: social `sameAs` URLs, `/404.html` 200, OG dimensions. (L1, M11, L5)
18. **Decide on GA4** and, if approved, implement a minimal consent-aware setup; verify GSC property and submit the sitemap. (M2, L4)
19. **Re-audit after Phase 1–2**: re-run live redirect/canonical checks, structured-data validation (Schema.org validator/Rich Results test), and PageSpeed Insights; confirm no Pexels references remain.

---

*End of baseline audit. No source files were modified in the production of this report; this document is the deliverable requested for Phase 0.*
