// CMS content model: restructured (DEC-018).
//
// Page-level CMS content is separated from reusable item collections:
// - `pages` + `settings` hold static, page-scoped copy only.
// - `modules` hold the reusable Services, Packages, Gallery, FAQ and
//   Testimonials items and are the single source of truth. Public pages render these collections and
//   the homepage renders their highlighted subset.
//
// Seed values mirror the content currently rendered by the public pages.
// The public site reads live module data at build time (see
// lib/supabase/public.ts) and falls back to this seed when unreachable.

import type { CmsIconName } from "./icons";

export type CmsPageKey = "home" | "services" | "packages" | "gallery" | "about" | "faq" | "contact";

export type StoreSectionKey =
  | CmsPageKey
  | "settings"
  | "mod-services"
  | "mod-packages"
  | "mod-gallery"
  | "mod-faqs"
  | "mod-testimonials"
  | "mod-event-types"
  | "seo-privacy"
  | "seo-terms";

/** Pages with dedicated SEO settings: the CMS pages plus code-managed legal pages. */
export type SeoPageKey = CmsPageKey | "privacy" | "terms";

/** Editable SEO metadata for one public page. Mirrors BaseLayout props. */
export interface PageMeta {
  seoTitle: string;
  seoDescription: string;
  ogImage: CmsImage;
  /** Internal planning aid only. Never rendered as a meta tag. */
  keywords?: string;
  /** Absolute-URL override for the canonical link. Empty follows the page URL. */
  canonicalUrl?: string;
  /** Optional overrides; empty falls back to the SEO title and description. */
  ogTitle?: string;
  ogDescription?: string;
  /** Search-engine controls, rendered as the robots directive. */
  noindex?: boolean;
  nofollow?: boolean;
}

/** Defaults for PageMeta fields added after the initial CMS shape. */
export const PAGE_META_DEFAULTS = {
  keywords: "",
  canonicalUrl: "",
  ogTitle: "",
  ogDescription: "",
  noindex: false,
  nofollow: false,
} as const;

/**
 * One responsive variant of an uploaded image. The list always includes the
 * stored original as its largest entry (width = intrinsic width), plus any
 * smaller WebP variants generated at upload time (Phase 1B.6).
 */
export type CmsImageVariant = {
  width: number;
  key: string;
  src: string;
};

/**
 * An image managed through file uploads.
 * `key` references the blob in the local image store; `src` is the fallback
 * remote URL from the seeded content (used until the image is replaced).
 */
export interface CmsImage {
  key: string | null;
  src: string;
  alt: string;
  caption?: string;
  /** Intrinsic pixel size of the stored file, captured at upload so renderers
      can set explicit width/height attributes (reserves layout space). */
  width?: number;
  height?: number;
  /** Responsive variants (including the original). Empty or absent means the
      image predates variant generation and renders from `src` alone. */
  variants?: CmsImageVariant[];
}

/** Editable copy for a SectionHeading block (eyebrow, title, lede). */
export interface SectionHeadingContent {
  eyebrow: string;
  title: string;
  lede: string;
}

/** Editable copy and image for a CtaBand block. Hrefs stay in code. */
export interface CtaBandContent {
  eyebrow: string;
  headline: string;
  lede: string;
  primaryLabel: string;
  secondaryLabel: string;
  image: CmsImage;
}

/** Editable fallback copy shown when a list has no items. */
export interface EmptyStateContent {
  title: string;
  body: string;
  actionLabel: string;
}

// ── Page-level: Home ────────────────────────────────────────────────────────

export interface HeroContent {
  eyebrow: string;
  headline: string;
  supporting: string;
  primaryLabel: string;
  secondaryLabel: string;
  background: CmsImage;
  stats: HeroStat[];
}

export interface HomePageContent {
  hero: HeroContent;
  servicesHeading: SectionHeadingContent;
  servicesCardLabel: string;
  showcaseHeading: SectionHeadingContent;
  showcaseLabel: string;
  packagesHeading: SectionHeadingContent;
  packagesCompareLabel: string;
  processHeading: SectionHeadingContent;
  steps: ProcessStep[];
  reviewsHeading: SectionHeadingContent;
  reviewsHighlightHint?: undefined;
  /**
   * Deprecated fallback: testimonials moved to the Testimonials module
   * (DEC-034). Kept so old home blobs still render until the module is
   * saved; new edits happen in the module, not here.
   */
  testimonials: TestimonialContent[];
  faqHeading: SectionHeadingContent;
  faqCtaLabel: string;
  ctaBand: CtaBandContent;
  seo: PageMeta;
}

/** Derived hero stat values (DEC-037); leave unset for a manually typed value. */
export type HeroStatSource = "services" | "longest-hire";

export interface HeroStat {
  value: string;
  label: string;
  icon?: CmsIconName;
  /** When set, the value is computed at render from live module data. */
  source?: HeroStatSource;
}

export interface ProcessStep {
  id: string;
  title: string;
  summary: string;
  icon?: CmsIconName;
}

export interface TestimonialContent {
  id: string;
  quote: string;
  name: string;
  eventType: string;
  rating?: number;
}

// ── Page-level: Services / Packages / Gallery ───────────────────────────────

export interface ServicesPageContent {
  header: PageHeaderContent;
  ctaBand: CtaBandContent;
  seo: PageMeta;
}

export interface PageHeaderContent {
  title: string;
  eyebrow: string;
  lede: string;
  image: CmsImage;
}

export interface PackagesPageContent {
  header: PageHeaderContent;
  plansHeading: SectionHeadingContent;
  emptyState: EmptyStateContent;
  addonsHeading: SectionHeadingContent;
  addOns: AddOnContent[];
  policies: { eyebrow: string; heading: string; lede: string };
  bookingPolicies: string[];
  ctaBand: CtaBandContent;
  seo: PageMeta;
}

export interface AddOnContent {
  id: string;
  name: string;
  detail: string;
}

export interface GalleryPageContent {
  header: PageHeaderContent;
  emptyState: EmptyStateContent;
  ctaBand: CtaBandContent;
  seo: PageMeta;
}

// ── Page-level: About / FAQ / Contact ───────────────────────────────────────

export interface AboutPageContent {
  header: PageHeaderContent;
  storyEyebrow: string;
  storyHeading: string;
  story: string[];
  about: { eyebrow: string; headline: string; lede: string };
  valuesHeading: SectionHeadingContent;
  values: AboutValue[];
  stats: AboutStat[];
  ctaBand: CtaBandContent;
  seo: PageMeta;
}

export interface AboutValue {
  id: string;
  title: string;
  detail: string;
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface FaqPageContent {
  header: PageHeaderContent;
  searchPlaceholder: string;
  emptyCopy: string;
  support: { heading: string; body: string; label: string };
  ctaBand: CtaBandContent;
  seo: PageMeta;
}

export interface ContactContent {
  header: PageHeaderContent;
  serviceAreaLabel: string;
  typicalReplyLabel: string;
  typicalReplyValue: string;
  formTitle: string;
  formLede: string;
  seo: PageMeta;
}

// ── Modules ─────────────────────────────────────────────────────────────────

export type BadgeType = "none" | "basic" | "most-popular" | "best-value" | "custom";

/** Canonical display text for the provided badge options. */
export const BADGE_LABELS: Record<Exclude<BadgeType, "none">, string> = {
  basic: "Basic",
  "most-popular": "Most Popular",
  "best-value": "Best Value",
  custom: "Custom",
};

/** Badge options for services. Every service carries one; there is no bare option. */
export type ServiceBadgeType = "basic" | "most-popular" | "best-value" | "custom";

/** Canonical display text for the service badge options. */
export const SERVICE_BADGE_LABELS: Record<ServiceBadgeType, string> = {
  basic: "Basic",
  "most-popular": "Most Popular",
  "best-value": "Best Value",
  custom: "Custom",
};

export interface ServiceItem {
  id: string;
  name: string;
  badgeType: ServiceBadgeType;
  customBadge: string;
  tagline?: string;
  summary: string;
  highlights: string[];
  icon?: CmsIconName;
  image: CmsImage;
  highlight: boolean;
}

/** Display text for a service badge: the built-in label, or the custom text. */
export function serviceBadgeText(item: Pick<ServiceItem, "badgeType" | "customBadge">): string {
  if (item.badgeType === "custom") return item.customBadge || "Custom";
  return SERVICE_BADGE_LABELS[item.badgeType];
}

/** Image badge overlaid on the card's top-right corner (packages). */
export type PackageCardBadge = "none" | "best-seller" | "top-rated";

/** Canonical display text for the package card badge options. */
export const PACKAGE_CARD_BADGE_LABELS: Record<PackageCardBadge, string> = {
  none: "-",
  "best-seller": "Best Seller",
  "top-rated": "Top Rated",
};

export interface PackageItem {
  id: string;
  name: string;
  summary: string;
  durationLabel: string;
  priceLabel: string;
  badgeType: BadgeType;
  customBadge: string;
  inclusions: string[];
  highlight: boolean;
  cardBadge: PackageCardBadge;
}

export interface GalleryItem {
  id: string;
  image: CmsImage;
  caption: string;
  highlight: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  highlight: boolean;
}

/**
 * One homepage testimonial (DEC-034, moderated DEC-035). Array order is the
 * display order. Only approved items reach the public marquee (enforced by
 * RLS); pending items await moderation and rejected items stay hidden.
 * Visitor submissions always arrive as pending through POST /api/reviews.
 */
export type ReviewStatus = "pending" | "approved" | "rejected";

export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  eventType: string;
  rating?: number;
  status: ReviewStatus;
  /** Submission date/time from the database; the server owns it and the
   * admin save path never writes it. */
  createdAt?: string;
}

/** One contact-form event type option. Array order is the display order. */
export interface EventTypeItem {
  id: string;
  label: string;
}

export interface CmsModules {
  services: ServiceItem[];
  packages: PackageItem[];
  gallery: GalleryItem[];
  faqs: FaqItem[];
  testimonials: TestimonialItem[];
  "event-types": EventTypeItem[];
}

// ── Settings ────────────────────────────────────────────────────────────────

export interface SocialLink {
  label: string;
  url: string;
}

export interface SiteSettingsContent {
  brandName: string;
  serviceAreaStatement: string;
  reviewUrl: string;
  messengerUrl: string;
  socials: SocialLink[];
  /** Global website logo (header and footer). Empty falls back to the built-in mark. */
  logo?: CmsImage;
  /** Browser favicon. Empty falls back to the bundled SVG. */
  favicon?: CmsImage;
  /** Contact phone numbers shown in the footer and on the contact page. */
  phonePrimary?: string;
  phoneSecondary?: string;
  /** Business contact email shown under the homepage hero stats. Blank hides the link. */
  contactEmail?: string;
  /** Australian Business Number shown in the footer and contact aside. */
  abn?: string;
  /** Business credentials (for example registration and insurance statements). */
  trustItems?: string[];
  /** Transport fee note shown in the footer and on the contact page. */
  transportNote?: string;
  footerCta: { title: string; lede: string; label: string };
}

// ── Legal pages ─────────────────────────────────────────────────────────────

/** Legal content pages with CMS-managed copy (privacy, terms). */
export type LegalPageKey = "privacy" | "terms";

export interface LegalBlockParagraph {
  kind: "paragraph";
  text: string;
}

export interface LegalBlockList {
  kind: "list";
  items: string[];
}

export type LegalBlock = LegalBlockParagraph | LegalBlockList;

export interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalPageContent {
  header: { title: string; eyebrow: string; lede: string };
  intro: string[];
  sections: LegalSection[];
}

// ── Root ────────────────────────────────────────────────────────────────────

export interface CmsContent {
  pages: {
    home: HomePageContent;
    services: ServicesPageContent;
    packages: PackagesPageContent;
    gallery: GalleryPageContent;
    about: AboutPageContent;
    faq: FaqPageContent;
    contact: ContactContent;
  };
  settings: SiteSettingsContent;
  modules: CmsModules;
  /** SEO-only settings for the code-managed legal pages. */
  seo: {
    privacy: PageMeta;
    terms: PageMeta;
  };
}
