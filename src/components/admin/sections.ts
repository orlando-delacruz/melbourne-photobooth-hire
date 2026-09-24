// Admin section registry: single source for the sidebar, dashboard cards and
// per-section routes. Website CMS (page-level copy) is separated from the
// dedicated Modules (reusable items), per DEC-018.

import type { CmsPageKey } from "../../lib/cms/types";

export type AdminNavKey =
  | "dashboard"
  | "inquiries"
  | "settings"
  | "seo"
  | CmsPageKey
  | "mod-services"
  | "mod-packages"
  | "mod-gallery"
  | "mod-faqs"
  | "mod-event-types";

export interface AdminSection {
  key: AdminNavKey;
  label: string;
  href: string;
  group: "cms" | "modules" | "seo";
  /** Public page this section manages. Null for dashboard-level sections. */
  publicHref: string | null;
  blurb: string;
  icon: string;
}

const svg = (inner: string) =>
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

/** Website CMS: page-level content editors. */
export const CMS_SECTIONS: AdminSection[] = [
  {
    key: "home",
    label: "Homepage",
    href: "/admin/home",
    group: "cms",
    publicHref: "/",
    blurb: "Homepage hero, intro, headings and testimonials.",
    icon: svg(
      '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    ),
  },
  {
    key: "services",
    label: "Services Page",
    href: "/admin/services-page",
    group: "cms",
    publicHref: "/services",
    blurb: "Page header, band and SEO; booth items live in Modules.",
    icon: svg(
      '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    ),
  },
  {
    key: "packages",
    label: "Packages",
    href: "/admin/packages",
    group: "cms",
    publicHref: "/packages",
    blurb: "Page header, add-ons, policies, foot note and SEO.",
    icon: svg(
      '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
    ),
  },
  {
    key: "gallery",
    label: "Gallery",
    href: "/admin/gallery",
    group: "cms",
    publicHref: "/gallery",
    blurb: "Page header and enquiry band; images live in Modules.",
    icon: svg(
      '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    ),
  },
  {
    key: "about",
    label: "About",
    href: "/admin/about",
    group: "cms",
    publicHref: "/about",
    blurb: "Story, values, stats and the next-step panel.",
    icon: svg('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),
  },
  {
    key: "faq",
    label: "FAQ",
    href: "/admin/faq",
    group: "cms",
    publicHref: "/faq",
    blurb: "Page header, aside panel and SEO; questions live in Modules.",
    icon: svg(
      '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    ),
  },
  {
    key: "contact",
    label: "Contact",
    href: "/admin/contact",
    group: "cms",
    publicHref: "/contact",
    blurb: "Page header, next steps and aside facts.",
    icon: svg(
      '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    ),
  },
];

/** Reusable item collections: the source of truth for both admin and public pages. */
export const MODULE_SECTIONS: AdminSection[] = [
  {
    key: "mod-services",
    label: "Services",
    href: "/admin/modules/services",
    group: "modules",
    publicHref: "/services",
    blurb: "Create, edit, remove and highlight the booth services.",
    icon: svg(
      '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    ),
  },
  {
    key: "mod-packages",
    label: "Packages",
    href: "/admin/modules/packages",
    group: "modules",
    publicHref: "/packages",
    blurb: "Create, edit, remove and highlight packages, with badges.",
    icon: svg(
      '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
    ),
  },
  {
    key: "mod-gallery",
    label: "Gallery",
    href: "/admin/modules/gallery",
    group: "modules",
    publicHref: "/gallery",
    blurb: "Add, edit, remove and highlight gallery images.",
    icon: svg(
      '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    ),
  },
  {
    key: "mod-faqs",
    label: "FAQs",
    href: "/admin/modules/faqs",
    group: "modules",
    publicHref: "/faq",
    blurb: "Create, edit, remove and highlight questions.",
    icon: svg(
      '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    ),
  },
  {
    key: "mod-event-types",
    label: "Event Types",
    href: "/admin/modules/event-types",
    group: "modules",
    publicHref: "/contact",
    blurb: "Create, edit, remove and reorder the contact-form event options.",
    icon: svg(
      '<path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.42 0l8.58-8.58a1 1 0 0 0 0-1.42Z"/><circle cx="7" cy="7" r=".5" fill="currentColor"/>',
    ),
  },
];

export const ADMIN_SECTIONS = [...CMS_SECTIONS, ...MODULE_SECTIONS];

/** Site settings live under the "Site" sidebar caption. */
export const SETTINGS_SECTION: AdminSection = {
  key: "settings",
  label: "Site settings",
  href: "/admin/settings",
  group: "cms",
  publicHref: null,
  blurb: "Brand, service area, links and footer call-to-action.",
  icon: svg(
    '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
  ),
};

/** SEO lives under its own sidebar caption, separate from Website CMS. */
export const SEO_SECTION: AdminSection = {
  key: "seo",
  label: "SEO",
  href: "/admin/seo",
  group: "seo",
  publicHref: null,
  blurb: "Per-page titles, descriptions, social metadata and indexing controls.",
  icon: svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'),
};

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

export function sectionFor(key: AdminNavKey): AdminSection {
  const found = ADMIN_SECTIONS.find((section) => section.key === key);
  if (!found) throw new Error(`Unknown admin section: ${key}`);
  return found;
}

/** Inquiries are a managed area but not website content, so they sit outside CMS_SECTIONS. */
export const INQUIRIES_SECTION: AdminSection = {
  key: "inquiries",
  label: "Inquiries",
  href: "/admin/inquiries",
  group: "cms",
  publicHref: null,
  blurb: "Enquiries from the website contact form.",
  icon: svg(
    '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  ),
};
