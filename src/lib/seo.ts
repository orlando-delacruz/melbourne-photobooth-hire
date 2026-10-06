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
