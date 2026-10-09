import { occasionPages, serviceDetailPages } from "./seo";

/** A primary navigation destination. */
export interface NavItem {
  href: string;
  label: string;
}

/** Principal destinations in information-architecture order (REQ-NAV-002). */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/packages", label: "Packages" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export const ENQUIRY_HREF = "/contact";

/**
 * Dedicated service pages featured in the footer Explore column
 * (single source: the DEC-055 registry in lib/seo.ts). Future approved
 * service pages appear here by extending that registry — no footer edit.
 */
export const SERVICE_LINKS: NavItem[] = serviceDetailPages();

/**
 * Occasion pages featured in the footer Explore column
 * (single source: the occasion registry in lib/seo.ts). Future approved
 * occasion pages appear here by extending that registry — no footer edit.
 */
export const OCCASION_LINKS: NavItem[] = occasionPages();
