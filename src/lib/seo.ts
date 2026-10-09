// SEO helpers: BreadcrumbList structured data (Phase 1, PH-1A).
//
// Breadcrumbs describe the stable page hierarchy (Home › Page) for search
// engines and reinforce internal linking. Only real, visible pages are
// listed — no invented URLs. The matching visual trail is rendered inside
// the page header by LivePageHeader (`breadcrumbs` prop); this module
// builds the Schema.org node passed via BaseLayout's `structuredData` prop.

export interface BreadcrumbTrailItem {
  /** Display name, e.g. "Services". */
  name: string;
  /** Absolute path from the site root, e.g. "/services". */
  path: string;
}

/**
 * Build a Schema.org BreadcrumbList node with absolute URLs.
 * `origin` is the site origin (e.g. https://www.…); `trail` starts with
 * Home ("/") followed by the current page.
  */
export function buildBreadcrumbList(
  origin: string,
  trail: BreadcrumbTrailItem[],
): Record<string, unknown> {
  const cleanOrigin = origin.replace(/\/+$/, "");
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${cleanOrigin}${item.path}`,
    })),
  };
}

/**
 * Service rows with a dedicated commercial page (Phase 1, DEC-055).
 * Cards and hub sections link here instead of the in-page anchor, so each
 * URL owns distinct intent and `/services` stays the hub. Extend only when
 * a new dedicated page is approved and published — never speculatively.
 * Labels are stable IA names (like NAV_ITEMS), not CMS service names.
 */
export interface ServiceDetailPage {
  href: string;
  label: string;
}

const SERVICE_DETAIL_PAGES: Record<string, ServiceDetailPage> = {
  "premium-photobooth": { href: "/premium-photobooth-melbourne", label: "Premium Photobooth" },
  "roaming-photobooth": { href: "/roaming-photobooth-melbourne", label: "Roaming Photobooth" },
  "360-video-booth": { href: "/360-video-booth-melbourne", label: "360 Video Booth" },
};

/** Dedicated-page href for a service row, or undefined for anchor-only rows. */
export function serviceDetailHref(serviceId: string): string | undefined {
  return SERVICE_DETAIL_PAGES[serviceId]?.href;
}

/** Dedicated service pages in registry order, for footer/IA listings. */
export function serviceDetailPages(): ServiceDetailPage[] {
  return Object.values(SERVICE_DETAIL_PAGES);
}

/**
 * Occasion pages (Phase 1 occasion strategy, SEO Track 2). High commercial
 * value with distinct intent (wedding run-sheets, corporate branding), each
 * with unique client-confirmed copy — never templated doorway duplicates.
 * Footer and sitemap read this registry; extend only when a new occasion
 * page is approved and published.
 */
export interface OccasionPage {
  href: string;
  label: string;
}

const OCCASION_PAGES: Record<string, OccasionPage> = {
  wedding: { href: "/wedding-photobooth-melbourne", label: "Weddings" },
  corporate: { href: "/corporate-photobooth-melbourne", label: "Corporate Events" },
};

/** Occasion pages in registry order, for footer/IA listings. */
export function occasionPages(): OccasionPage[] {
  return Object.values(OCCASION_PAGES);
}

/**
 * Canonical public route paths (single shared registry for IA + sitemap).
 * Every indexable public page must be listed here exactly once. Admin/API
 * routes are never listed. `astro.config.mjs` builds the sitemap `customPages`
 * from this registry so new pages cannot silently miss the sitemap (SEO plan
 * Track 1). Legal pages are included: they are indexable public content.
 */
export const PUBLIC_ROUTE_PATHS: string[] = [
  "/",
  "/services",
  "/premium-photobooth-melbourne",
  "/roaming-photobooth-melbourne",
  "/360-video-booth-melbourne",
  "/wedding-photobooth-melbourne",
  "/corporate-photobooth-melbourne",
  "/packages",
  "/gallery",
  "/about",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
];
