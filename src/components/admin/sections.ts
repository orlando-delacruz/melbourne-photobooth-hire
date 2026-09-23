// Admin section registry: single source for the sidebar, dashboard cards
// and per-section routes. Icons are inline SVG path markup (lucide-style)
// so the Astro shell renders them without client JavaScript.

import type { CmsSectionKey } from "../../lib/cms/types";

/** Sidebar keys extend the content sections with the inquiries area. */
export type AdminSectionKey = CmsSectionKey | "inquiries" | "dashboard";

export interface AdminSection {
  key: AdminSectionKey;
  label: string;
  href: string;
  /** Public page this section manages. Null for dashboard-level sections. */
  publicHref: string | null;
  blurb: string;
  icon: string;
}

const svg = (inner: string) =>
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    key: "home",
    label: "Home",
    href: "/admin/home",
    publicHref: "/",
    blurb: "Hero, intro, showcase, process steps, reviews and event types.",
    icon: svg(
      '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    ),
  },
  {
    key: "services",
    label: "Services",
    href: "/admin/services",
    publicHref: "/services",
    blurb: "Page header, the three booth services and the enquiry band.",
    icon: svg(
      '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    ),
  },
  {
    key: "packages",
    label: "Packages",
    href: "/admin/packages",
    publicHref: "/packages",
    blurb: "Plans, prices, inclusions, add-ons and booking policies.",
    icon: svg(
      '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
    ),
  },
  {
    key: "gallery",
    label: "Gallery",
    href: "/admin/gallery",
    publicHref: "/gallery",
    blurb: "Page header, gallery images and the enquiry band.",
    icon: svg(
      '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    ),
  },
  {
    key: "about",
    label: "About",
    href: "/admin/about",
    publicHref: "/about",
    blurb: "Story, values, stats and the next-step panel.",
    icon: svg('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),
  },
  {
    key: "faq",
    label: "FAQ",
    href: "/admin/faq",
    publicHref: "/faq",
    blurb: "Questions, answers and the support panel.",
    icon: svg(
      '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    ),
  },
  {
    key: "contact",
    label: "Contact",
    href: "/admin/contact",
    publicHref: "/contact",
    blurb: "Page header, next steps and aside facts.",
    icon: svg(
      '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    ),
  },
  {
    key: "settings",
    label: "Site settings",
    href: "/admin/settings",
    publicHref: null,
    blurb: "Brand, service area, review and Messenger links, shared images.",
    icon: svg(
      '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
    ),
  },
];

export const ADMIN_DASHBOARD = {
  label: "Dashboard",
  href: "/admin",
  icon: svg(
    '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  ),
};

export const ADMIN_EXTERNAL_ICON = svg(
  '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/>',
);

export function sectionByKey(key: CmsSectionKey): AdminSection {
  const found = ADMIN_SECTIONS.find((section) => section.key === key);
  if (!found) throw new Error(`Unknown admin section: ${key}`);
  return found;
}

/** Inquiries are a managed area but not website content, so they sit outside ADMIN_SECTIONS. */
export const INQUIRIES_SECTION: AdminSection = {
  key: "inquiries",
  label: "Inquiries",
  href: "/admin/inquiries",
  publicHref: null,
  blurb: "Enquiries from the website contact form.",
  icon: svg(
    '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  ),
};
