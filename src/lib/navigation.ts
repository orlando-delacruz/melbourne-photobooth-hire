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
