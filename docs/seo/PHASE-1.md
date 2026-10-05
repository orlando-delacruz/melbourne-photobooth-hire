# PHASE 1 — SEO RESEARCH & STRATEGY AUDIT

**Project:** Melbourne Photobooth Hire
**Type:** Research and strategy only (no code, CMS, database, or configuration changes were made)
**Prepared:** 2026-10-05
**Status of production:** Phase 0 remediation deployed and verified live (`https://www.melbournephotoboothhire.com.au/`)

**Evidence labels used throughout:**

- **[Observed]** — verified in the repository or live production during this audit
- **[Doc]** — stated in vendor/government documentation (source URL given)
- **[Third-party]** — external claim (source given)
- **[Inference]** — reasoning from observed evidence, not confirmed
- **[Unknown]** — could not be reliably verified

No keyword volume, CPC, ranking position, traffic, backlink count, review count, or competitor statistic is invented. Where a metric could not be obtained reliably, it is marked **[Unknown]**.

---

## 1. Executive Summary

### Strong now

- Phase 0 is deployed to production. Live canonical is `https://www.melbournephotoboothhire.com.au/`. **[Observed]**
- GA4 is live with a real Measurement ID (`G-3LBDW7NXQP`), single installation, env-gated path preserved. **[Observed]**
- Live structured data: `Organization`, `ProfessionalService`, `WebSite`, `WebPage`, and three `Service` nodes, plus Melbourne/Victoria `areaServed`. **[Observed]**
- Every public page has a unique title and meta description, self-referencing canonical, and `index, follow, max-image-preview:large`. **[Observed]**
- Public pages are server-rendered (Astro SSR) with edge caching; homepage gzip is ~35.9 KB. Crawl-safe and fast to first byte. **[Observed]**
- Pricing ("Packages start from $350"), contact details, service area, and Public Liability Insured are consistent on the live site. **[Observed]**
- All 21 gallery images now carry unique descriptive alt text and captions. **[Observed]**

### Weak now

1. **No Google Business Profile (GBP).** This is the largest local SEO gap. Without a GBP the business cannot appear in the local pack. **[Doc]** Google states a service-area business can qualify without a storefront and that the profile is the vehicle for local visibility.
2. **No dedicated service or occasion URLs.** Competitors rank dedicated 360 and occasion pages; the site currently represents these only as in-page sections. **[Observed]** competitor research.
3. **No responsive image delivery.** Gallery/service images are single-size JPEGs of roughly 55–552 KB, with no `srcset`/`sizes`. The homepage LCP hero is ~172 KB. **[Observed]**
4. **Pricing depth is thinner than competitors.** Packages show a starting price, but no per-booth or 360 pricing. Several competitors publish package cards or "from $X" per booth. **[Observed]**
5. **No GA4 conversion events.** Only pageviews are measured. **[Observed]**
6. **Island prop payload.** Homepage HTML is ~294 KB uncompressed with 7 `astro-island` blocks that repeat rendered content in serialized props. Gzip mitigates transfer (~36 KB) but parse/hydration cost remains. **[Observed]**

### What matters most

1. GBP creation and a review-generation flow (external, client-led).
2. One dedicated 360 Video Booth page (or a full commercial section) plus occasion content — subject to the documented landing-page constraint.
3. Responsive images.
4. Breadcrumbs and an internal-linking pass.
5. GA4 conversion events.

---

## 2. Current Site Architecture

| URL | Purpose | Current Primary Topic | Search Intent | Current Strength | Main Gap |
|---|---|---|---|---|---|
| `/` | Primary commercial hub | photobooth hire Melbourne | Commercial local | Strong title/H1, schema, pricing lede, showcase, trust strip | H1 is all-caps and lacks "Melbourne"; no links to dedicated booth content; no occasion content |
| `/services` | Booth hub | photobooth services Melbourne | Commercial | Three booth H2s, jump nav, `Service` schema, contextual CTAs | No pricing per booth; no dedicated URLs; no occasion mapping |
| `/packages` | Pricing and inclusions | photobooth packages Melbourne | Commercial/transactional | Package cards, inclusions, add-ons, policies, "from $350" | No 360 pricing; two package summaries duplicate; no per-booth tier detail |
| `/gallery` | Visual proof | photobooth gallery Melbourne | Navigational/commercial | 21 captioned images with unique alt | 8 Pexels placeholders; no responsive variants; no links back to services |
| `/about` | Trust and brand | local Melbourne team | Brand/navigational | Local story, values, service-area statement | No years operating, event counts, or team detail; no region coverage detail |
| `/faq` | Informational answers | photobooth hire questions | Informational | Nine direct Q&As; strong AEO raw material | No contextual links to services/packages; no venue power/space depth |
| `/contact` | Conversion | booking enquiry | Transactional | Form, contextual `?service=`/`?package=`, full NAP | No region/suburb coverage detail; no hours |
| `/privacy`, `/terms` | Legal | legal copy | None | Complete and business-specific | Not a search target |

**Coverage check:** the architecture represents photobooth hire, services, packages/pricing, 360 (as a section), Melbourne service area, trust, and booking intent. It does **not** represent dedicated service intent, occasion intent, or service-area intent beyond a single statement.

---

## 3. Search Intent & Keyword Map

Reliable keyword-volume data was not available in this audit. No volume or difficulty numbers are claimed.

| Keyword Cluster | Primary Intent | Recommended URL | Existing/New | Priority | Reason |
|---|---|---|---|---|---|
| photobooth hire melbourne, photobooth melbourne, photo booth hire melbourne, photobooth rental melbourne | Commercial local | `/` | Existing | High | Core head terms; homepage already targets them |
| photobooth hire packages melbourne, photobooth prices melbourne, photobooth cost melbourne | Commercial/transactional | `/packages` | Existing | High | High conversion intent; strengthen price clarity |
| 360 photobooth melbourne, 360 video booth melbourne, 360 booth hire melbourne | Commercial | `/services#360-video-booth` now; proposed `/360-video-booth-melbourne` | Existing section / New page | High | Competitor 360 pages rank; local operators often hide 360 pricing |
| premium photobooth melbourne, open-air photobooth melbourne | Commercial | `/services#premium-photobooth` | Existing section | Medium | Demand exists; can remain a section unless the 360 page proves the model |
| roaming photobooth melbourne | Commercial | `/services#roaming-photobooth` | Existing section | Medium | Lower observed competitor coverage |
| wedding photobooth melbourne | Commercial | Occasion section or page | New | High | Directories and competitor pages rank; no local operator dedicated URL observed |
| corporate photobooth melbourne | Commercial | Occasion section or page | New | High | A dedicated competitor page ranks |
| birthday photobooth melbourne, party photobooth melbourne | Commercial | Occasion section | New | Medium | Directory/editorial noise; lower operator coverage |
| event photobooth melbourne | Commercial | Occasion hub or section | New | Medium | Overlaps corporate/private |
| photobooth hire Victoria / regional | Local | Service-area content on `/about` and `/contact` | Existing (expand) | Low/Medium | Competitors name regions in copy rather than as URLs |
| Suburb queries (Fitzroy, St Kilda, etc.) | Local | **No new pages** | — | Do Not Build | No suburb URLs observed ranking; thin-content/doorway risk; docs forbid fabricated location pages |

**Keyword-to-page hierarchy recommendation**

- Homepage = head commercial terms ("photobooth hire Melbourne").
- `/services` = hub for booth types, linking to specific booth content.
- Booth-specific pages (only if approved) = service-specific intent.
- `/packages` = price intent.
- Occasion content = occasion intent, kept distinct from the service layer.
- `/faq` = informational support, linking into commercial pages.

**Cannibalization risk:** currently low. Homepage, services, and packages are differentiated by modifier ("hire", "services", "packages"). Risk appears only if dedicated service pages are added without converting `/services` into a hub that links out and stops competing for the same terms.

---

## 4. SERP Findings

**[Observed, provider-level only]** The search provider returned page-level results rather than a rendered Google SERP. No local pack, ads, People Also Ask, or star snippets were exposed. Result order is indicative, not a verified Google rank.

**Repeating domains across queries:** `melbournephotoboothco.com.au` (all queries), `photobooth.melbourne` (occasion pages), `easyweddings.com.au` (directory), `pixelbooth.com.au`, `thephotoboothco.com.au`, `megastarphotobooth.com`, `melbourne360booths.com` / `.com.au`, `melbourne360photobooth.com.au`.

**Dominant intent:** commercial/local. Informational only for generic "photobooth melbourne" and "birthday" (city editorial pages).

**Page types:** homepages first; then provider pricing/FAQ/service pages; occasion pages (photobooth.melbourne); directories (Easy Weddings, ABIA) generally below local operators.

**Dedicated 360 pages rank.** A dedicated corporate page ranks. No local-operator dedicated wedding or birthday URL was observed.

**Suburb/location pages:** no suburb landing URLs observed ranking. Suburbs appear only in footer link lists or in-copy service-area statements.

**Table stakes observed among top local results:**

- Exact-match title (e.g. "Photo Booth Hire Melbourne").
- Price cards or a "from $X" statement.
- Inclusions list (unlimited prints, attendant, backdrop, custom strip, online gallery).
- FAQ content.
- Gallery.
- Review quotes or a self-reported Google rating.
- Service-area coverage statement.
- Multiple CTAs (quote/booking form, phone, sometimes WhatsApp).

**Content gaps shared by top results:** many hide or omit pricing; few have genuine occasion depth; 360 pricing is often hidden.

**[Unknown]** actual Google rank positions, local pack presence, search volumes, backlink profiles.

---

## 5. Competitor Analysis

All ratings/review/event counts below are site-stated claims, not independently verified. No ranking or traffic claims are made.

| Competitor | Main Strength | Main Weakness | Content Advantage | Local Advantage | Technical Advantage |
|---|---|---|---|---|---|
| Pixel Booth (`pixelbooth.com.au`) | Transparent package prices; deep site | Unknown | 15+ homepage sections, blog, FAQ, case studies | Suburb pages and venue access detail | LocalBusiness/FAQ/Breadcrumb schema; WebP |
| Melbourne 360 Booths (`melbourne360booths.com`) | 360 specialisation; large location footprint | No visible prices; no LocalBusiness schema | 360/event pages; 35 `VideoObject` nodes | Suburb and interstate pages | Video schema |
| Rewind Booths (`rewindbooths.com.au`) | Price cards; 191-review widget | No JSON-LD at all; weak location pages | 13 sections, FAQ, blog | Weak (locations link only) | Trustindex review widget |
| Ghost Booth Events (`gbevents.com.au`) | Strong schema; 16 suburb pages; offers | Premium price point; thin homepage | Deep service/corporate pages | 16 suburb URLs plus regions | Offer/Service/AggregateRating/Reservation schema |
| Poppy's Photobooths (`poppysplace.com.au`) | Long-standing; nine booth types | "Prices" page shows no prices | Booth/inclusion detail | Regions named, no suburb URLs | Basic schema; GIF-heavy |
| Shutter Booth (`shutterphotobooth.com.au`) | Corporate logos; 360 pricing; venue guides | Weak location signals on homepage | Venue guides, galleries, FAQ | Inner-west suburbs | Organization schema, caching/WebP |
| 123 Photobooth (`123photobooth.com.au`) | Cheap headline prices; long venue list | Thin schema | Event-type and service pages | Regions plus venue names | Basic WebSite/Breadcrumb schema |

**Match (table stakes):** published prices, booth-type pages, occasion pages, inclusions, insurance statement, review proof, FAQ, service-area names, multiple CTAs, gallery.

**Differentiate (observed opportunities):**

- Publish a complete price matrix across booth types, including 360 pricing (only one competitor shows a package matrix; several hide prices entirely).
- Add booth-page depth using real setup photos.
- Document venue logistics (power, space, load-in, setup time) — only one competitor addresses this.
- Show budget-band guidance ("most packages sit between $X and $Y") — only two competitors do.
- Transparent 360 pricing — several competitors hide it.

**Could not verify:** actual ratings/review counts, event totals, insurance status, rankings, traffic, backlinks, Core Web Vitals, and whether similarly named 360 domains share ownership.

---

## 6. Local SEO Findings

### Website changes

- Service area currently stated as "Melbourne Wide / Victoria Wide" with no region/suburb list. **[Observed]**
- No address published, which is correct for a service-area business. **[Observed]**
- NAP (name, two phones, email) is consistent across footer and contact page. **[Observed]**
- Opportunity: add a factual service-area section naming the regions the business actually serves, plus the travel-fee policy, on `/about` and `/contact`.

### External / local SEO actions

- **GBP is the critical gap.** **[Doc]** A business that travels to customers can use GBP as a service-area business; the address is hidden and service areas are entered as cities/postcodes (maximum 20, roughly within a two-hour drive). GBP is the vehicle for local pack visibility.
  Sources: Google support `answer/3038177`, `answer/9157481`, `answer/13763036`.
- **Reviews.** **[Doc]** Asking customers to leave Google reviews is allowed; offering payment, discounts, or free goods for reviews is prohibited; review gating is non-compliant. Self-serving review rich results (Review/AggregateRating markup about your own business) are ineligible for rich results.
  Sources: Google review snippet documentation; contribution policy.
- **Local citations (each verified live):** Yellow Pages, TrueLocal, Localsearch, Hotfrog, StartLocal, A List Guide, Australian Event Awards Supplier Directory, Wedzaar.
- **Wedding/event directories (verified live):** Easy Weddings (most directly relevant to Melbourne photobooth demand), ABIA, Ivory Tribe, Wedshed, One Fine Day, Polka Dot Wedding, Hello May (invite-only), The Lane, Aussie Wedding Directory. Many are paid or curated. **[Third-party]**
- **Partnerships:** venue preferred-supplier lists, photographer cross-promotion, wedding expos (One Fine Day Melbourne; Wedding Expos Australia at MCEC). **[Third-party]**
- **Australian compliance relevant to on-site copy.** **[Doc]** ACCC price display rules: a "from $X" claim must not be misleading once unavoidable fees are added; total price must be at least as prominent as part prices. Travel fees and any mandatory charges should be disclosed. ABN display on a website footer is not a general requirement, but a company making written offers must show company name and ACN/ABN; entity type should be confirmed.
  Sources: ACCC price displays; business.gov.au display prices; ASIC ACN guidance; ATO.

**Separate tracks:** website service-area content is a code/CMS task; GBP, reviews, citations, directories, and partnerships are client/platform actions.

---

## 7. Topical Authority Gaps

Covered today: hire, packages, the three booths, FAQ basics, policies, gallery.

Missing or thin:

- 360 explained at commercial depth (how it works, clip delivery, pricing, best-use cases).
- Venue logistics: space, power, load-in, setup/pack-down timing, indoor vs outdoor.
- Occasion-specific needs: wedding run-sheet timing, corporate branding/activations, birthday/private pacing.
- Service-area specificity: regions served, travel fee policy.
- Print/share detail: strip sizes, templates, QR gallery, guestbook.
- Comparison content: open-air vs roaming vs 360.
- Real proof: years operating, events delivered, venues worked, team.

Rule applied: every gap maps to a real query or conversion need. No word-count filler is recommended.

---

## 8. Occasion Strategy

Recommendation:

- **Weddings and corporate events:** dedicated content. High commercial value, competitor evidence, distinct intent, and enough unique content (run sheets, branding, venue fit) to avoid thin pages.
- **Birthdays and private celebrations:** sections within a single events page or the existing services page. Lower distinct intent; avoid four thin pages.
- **Do not build:** four templated occasion pages with swapped headings. That is doorway-style thin content.
- **CMS:** keep occasion copy in existing page blobs (CMS-editable). New pages only if scope is approved; then CMS-driven.

---

## 9. Service Architecture

| Service | Standalone search intent | Commercial value | Content depth required | Dedicated URL justified? |
|---|---|---|---|---|
| 360 Video Booth | Strong ("360 photobooth melbourne") | High | High (how it works, pricing, video, FAQ) | **Yes — highest** |
| Premium Photobooth | Moderate ("open air photobooth") | High | Medium | Maybe later |
| Roaming Photobooth | Lower | Medium | Medium | No — keep as a section |

Recommendation: build one dedicated 360 Video Booth page first. Keep premium and roaming as enriched sections until the 360 page proves the model. Convert `/services` into a hub with per-booth summaries and links.

**Constraint:** `docs/ARCHITECTURE.md §18` and `docs/DATA-MODEL.md` forbid unnecessary SEO landing pages unless explicitly required. New pages require explicit approval.

---

## 10. Internal Linking Strategy

**Current state [Observed]:** header and footer navigation link all pages; service and package cards link contextually to `/contact?service=` / `?package=`; homepage links to packages, services, gallery, FAQ, and contact; no orphan pages found.

**Recommended additions:**

- Homepage booth cards to `/services#premium-photobooth`, `#roaming-photobooth`, `#360-video-booth` (or the new 360 page).
- `/services` sections to `/packages` (matching tier) and `/gallery`.
- `/packages` cards to `/services#<booth>`.
- FAQ answers to `/packages` (pricing), `/services#360-video-booth` (360), and `/contact` (booking). Requires FAQ answers to support links (rich text or a per-FAQ link field) — a code/CMS consideration.
- Gallery figures to `/services` for booth-type context.
- Footer: add service sub-links once booth pages exist.
- Breadcrumbs: Home › Page, and Home › Services › Booth if booth pages exist.

**Avoid:** repeated site-wide link blocks, anchor-text spam.

---

## 11. Technical SEO Opportunities

Phase 0 completed: canonical host consistency, www sitemap, robots, test-content removal, pricing consistency, business info, schema baseline, OG fallback removal, GA4 path. **[Observed]**

Remaining:

- **Sitemap `lastmod`:** a reliable source now exists (`page_contents.updated_at`, module `updated_at`). Feasible at build time; medium effort; low-to-medium value. Defer or treat as low priority.
- **Breadcrumbs:** eligible and low risk; modest value. **[Doc]** Add.
- **FAQPage:** **[Doc]** Google's FAQ rich results ended entirely on 7 May 2026; reporting and Rich Results Test support were removed in June 2026. There is no rich-result value now. Keep the visible FAQ content; do not prioritise FAQPage schema.
- **HTML size / island props:** ~294 KB homepage HTML. Reduce the initial props passed to islands.
- **Image dimensions:** only one homepage image carries `width`/`height`; CSS `aspect-ratio` mitigates CLS. Low priority.
- **Query parameters:** `?service=`/`?package=` canonicalise to `/contact`. No issue.
- **JavaScript rendering:** SSR; no dependency risk.
- **Caching:** `s-maxage=300`, `stale-while-revalidate=3600`. Appropriate.

---

## 12. Performance Opportunities

PageSpeed Insights API returned HTTP 429 (rate limit, no API key available). Current Core Web Vitals are **[Unknown]**. The previously reported numbers (LCP ~7.8 s, Speed Index ~6.1 s, ~158 KiB unused JavaScript, ~407 KiB potential image savings) were not re-verified in this audit and must not be treated as current.

Observed evidence:

- Homepage gzip ~35.9 KB. Good. **[Observed]**
- Homepage LCP hero `img-db9c0843.jpg` ~172 KB JPEG, preloaded with `fetchpriority="high"`. **[Observed]**
- Gallery images 55–552 KB each, single size, no `srcset`. First gallery batch: 9 JPG + 2 WebP. **[Observed]**
- Fonts total ~196 KB woff2 across all weights. **[Observed]**
- React renderer bundles ~229 KB and ~211 KB, lazy-loaded on island visibility, not on initial load. **[Observed]**
- 7 islands on the homepage; content duplicated in serialized props. **[Observed]**
- Supabase free tier has no on-the-fly transforms; CMS uploads downscale to 1600 px and re-encode to WebP for new uploads. **[Observed]** (`src/lib/cms/storage.ts`).

Priority:

1. Responsive images — generate 2–3 widths at upload and render `srcset`/`sizes`. High value, medium effort.
2. Island payload reduction. Medium value, medium effort.
3. Trim duplicate/oversized JPEGs (several files appear duplicated by byte size). Low-to-medium.
4. Font subsetting/preload. Low.
5. Re-run PageSpeed after changes; establish a measured baseline. High (measurement).

---

## 13. Schema Strategy

| Type | Justified? | Page | Data exists? | Expected value | Priority |
|---|---|---|---|---|---|
| Organization | Yes — live | Site-wide | Yes | Entity clarity | Done |
| ProfessionalService | Yes — live | Site-wide | Yes (no address) | Local entity | Done |
| Service ×3 | Yes — live | `/services` | Yes | Service entities | Done |
| WebSite / WebPage | Yes — live | Site-wide | Yes | Baseline | Done |
| BreadcrumbList | Yes | All pages | Yes | Navigation hygiene, display eligibility | Medium |
| FAQPage | **No** | — | Yes | **No rich results since May 2026** | Skip |
| Review / AggregateRating | **No** | — | Placeholder testimonials only | Ineligible (self-serving) | Skip |
| OfferCatalog / Offer | Maybe | `/packages` | Prices exist but change often | Only if price stability confirmed | Optional |
| VideoObject | Maybe | 360 page | No videos yet | Video discovery if clips are added | Optional |
| ImageObject | Low | Gallery | Partial | Minimal | Skip |

Do not add a postal address. Do not add review markup.

---

## 14. Analytics & Search Console

GA4 is live with `G-3LBDW7NXQP`. **[Observed]**

Recommended events (small set, real business outcomes):

- `generate_lead` — contact form success (`/api/inquiries` 200).
- `contact_phone` — `tel:` click.
- `contact_email` — `mailto:` click.
- `contact_messenger` — Messenger float click.
- `cta_click` — Book Now / quote clicks, with page and service/package context.
- `package_inquiry` / `service_inquiry` — contextual contact links.

Do not add scroll-depth or other vanity events.

Search Console baseline: verify the www property, submit the sitemap, and monitor queries, pages, indexing, Core Web Vitals, and enhancement reports. GA4 and Search Console access ownership is **[Unknown]** and should be confirmed.

---

## 15. Authority / Backlink Strategy

Authority is likely weak for a new domain. **[Inference]** Realistic, relationship-based opportunities only:

- Easy Weddings vendor profile (most relevant Melbourne photobooth directory).
- ABIA, A List Guide, Australian Event Awards Supplier Directory, Wedzaar.
- Local citations: Yellow Pages, TrueLocal, Localsearch, Hotfrog, StartLocal.
- Venue preferred-supplier listings; photographer cross-promotion.
- Wedding expos (One Fine Day Melbourne; Wedding Expos Australia at MCEC).
- Real-wedding editorial submissions with vendor credit (Hello May, The Lane, Ivory Tribe) — requires real events and photos.

Do not: buy links, use PBNs, mass-submit to directories, or pursue irrelevant guest posts.

---

## 16. Content Roadmap

### Must Have

1. GBP profile (external) — service area, category, phones, website link, hours.
2. 360 Video Booth page or full commercial section with pricing and how-it-works (scope decision).
3. Pricing clarity pass on `/packages`: starting price, per-booth/360 tiers, travel fee disclosure (ACCC-safe).
4. Service-area content: regions/suburbs served on `/about` and `/contact`; travel policy.
5. GA4 conversion events.
6. Breadcrumbs and internal linking pass.

### Should Have

7. Wedding section/page (run sheet, venue fit, packages).
8. Corporate section/page (branding, activations, invoicing).
9. FAQ expansion: venue space, power, setup, travel, 360 vs open-air.
10. Review generation flow (ask every customer, no incentives).

### Optional

11. Birthday/private events section.
12. `VideoObject` once 360 clips exist.
13. Editorial content only with real photo/event input.

### Do Not Build

- Suburb/doorway pages.
- Four templated occasion pages.
- Generic long blog articles for word count.
- FAQPage rich-result chasing.
- Review/AggregateRating markup.
- Fake address, fake GBP, or fake reviews.

---

## 17. Priority Matrix

| Action | Impact | Effort | Confidence |
|---|---|---|---|
| GBP creation + review flow | High | Low (client) | High |
| 360 dedicated page | High | Medium | Medium (needs scope approval) |
| Responsive images | High | Medium | High |
| GA4 conversion events | Medium | Low | High |
| Breadcrumbs + internal links | Medium | Low | High |
| Pricing clarity (ACCC-safe) | High | Low | High |
| Wedding/corporate content | High | Medium | Medium |
| Service-area content | Medium | Low | High |
| Island payload reduction | Medium | Medium | Medium |
| Citations/directories | Medium | Medium (client) | Medium |
| Sitemap lastmod | Low | Medium | Medium |
| Font trim | Low | Low | Medium |

---

## 18. Recommended Phase 1 Implementation Sequence

**1A — Foundation (code, low risk)**
GA4 conversion events, breadcrumbs, internal linking pass, Search Console baseline, PageSpeed baseline.

**1B — Architecture (scope decision required)**
360 Video Booth page (if approved), `/services` hub restructure, finalise the keyword map.

**1C — Core Content (code/CMS)**
Pricing clarity and travel disclosure, service-area content, wedding/corporate sections, FAQ expansion.

**1D — Performance**
Responsive image pipeline, island payload reduction, font trim, re-measure Core Web Vitals.

**1E — Local Authority (external, client-led)**
GBP, review flow, citations, Easy Weddings/directories, venue and photographer partnerships, expos.

Complete 1A before 1B so measurement exists before architecture changes.

---

## 19. Risks / Unknowns

- Search volume, CPC, rankings, and backlinks: **[Unknown]** — no reliable tool access; no numbers claimed.
- Local pack presence per query: **[Unknown]** — the search provider returned page-level results only.
- Current Core Web Vitals: **[Unknown]** — PageSpeed API returned 429; previously reported numbers are unverified.
- Search Console ownership/access: **[Unknown]**.
- GBP eligibility and verification method (may require video, equipment, or invoice proof): **[Third-party]**.
- Directory costs (Easy Weddings and similar) are unknown and may be paid.
- Entity type (sole trader vs company) affects ABN/ACN display duties: **[Unknown]**.
- Scope constraint: `docs/ARCHITECTURE.md §18` forbids unnecessary landing pages without explicit approval; 360/occasion pages need sign-off.
- ACCC: "from $350" plus travel or mandatory fees must not mislead; confirm all unavoidable fees are disclosed.
- Eight Pexels gallery rows remain stock photos; alt/caption work is done, but the images are still placeholders.

---

## 20. Final Recommendation

1. **First: GBP and a review-generation flow.** No code required. Highest local leverage. A service-area business with no storefront can qualify. **[Doc]**
2. **Second: 360 Video Booth page** (or a full commercial section if scope is denied). Strongest service-specific intent; competitors rank it; local operators often hide 360 pricing — a clear differentiation opportunity.
3. **Third: pricing clarity and responsive images.** Both directly affect conversion and Core Web Vitals; the image pipeline gives a measurable byte/LCP win.
4. **Fourth: breadcrumbs, internal links, GA4 conversion events.** Cheap, measurable, improves crawl and conversion insight.
5. **Fifth: wedding/corporate content and service-area content.** High commercial value; needs real copy and photos.
6. **Skip:** suburb pages, FAQ rich-result work, review schema, generic blog filler.

### Decisions required before implementation

1. Approve a dedicated 360 page and, later, wedding/corporate pages? `docs/ARCHITECTURE.md §18` currently forbids unnecessary landing pages without explicit requirement.
2. Who owns GBP creation and verification — client, developer, or prepared content handed to the client?
3. Budget for paid directories (Easy Weddings and similar) or free citations only?

---

*End of Phase 1 research and strategy audit. No application code, CMS data, database, or configuration was modified in the production of this report.*
