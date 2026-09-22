// CMS content model: frontend-only phase.
//
// Page-organized mirror of the content currently rendered by the public
// website. Seed values are taken verbatim from the public pages and the
// provisional mock content; the public site does not read this model yet.
// A future backend adapter reshapes these sections per surface
// (see docs/ROADMAP.md Phase 4).
//
// Entity shapes (Service, Package, Testimonial, ...) are shared with the
// public content seam in ../content/types so the models cannot drift apart.

import type {
  AboutContent,
  AddOn,
  Faq,
  GalleryItem,
  HeroStat,
  Package,
  ProcessStep,
  SampleImage,
  Service,
  Testimonial,
} from "../content/types";

export type CmsSectionKey =
  "home" | "services" | "packages" | "gallery" | "about" | "faq" | "contact" | "settings";

/** Editable SEO metadata for one public page. Mirrors BaseLayout props. */
export interface PageMeta {
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
}

/** Editable copy for the PageHeader banner (title, eyebrow, lede, image). */
export interface PageHeaderContent {
  title: string;
  eyebrow: string;
  lede: string;
  imageSrc: string;
  imageAlt: string;
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
  imageSrc: string;
  imageAlt: string;
}

/** Editable fallback copy shown when a list has no items. */
export interface EmptyStateContent {
  title: string;
  body: string;
  actionLabel: string;
}

// ── Home ────────────────────────────────────────────────────────────────────

export interface HeroContent {
  eyebrow: string;
  headline: string;
  supporting: string;
  primaryLabel: string;
  secondaryLabel: string;
  backgroundSrc: string;
  backgroundAlt: string;
  stats: HeroStat[];
}

export interface IntroPromise {
  title: string;
  detail: string;
}

export interface IntroContent {
  eyebrow: string;
  heading: string;
  body: string;
  promises: IntroPromise[];
  aboutLabel: string;
}

export interface HomeContent {
  hero: HeroContent;
  intro: IntroContent;
  /** Heading and card CTA only; the service list is edited under Services. */
  servicesSection: { heading: SectionHeadingContent; cardCtaLabel: string };
  showcase: { heading: SectionHeadingContent; galleryLabel: string; images: SampleImage[] };
  /** Heading and CTA only; packages are edited under Packages. */
  packagesSection: { heading: SectionHeadingContent; compareLabel: string };
  processSection: { heading: SectionHeadingContent; steps: ProcessStep[] };
  reviewsSection: { heading: SectionHeadingContent; testimonials: Testimonial[] };
  /** Heading and CTA only; the FAQ list is edited under FAQ. */
  faqSection: { heading: SectionHeadingContent; readAllLabel: string };
  eventTypesSection: { heading: SectionHeadingContent; eventTypes: string[] };
  ctaBand: CtaBandContent;
  seo: PageMeta;
}

// ── Services ────────────────────────────────────────────────────────────────

export interface ServicesContent {
  header: PageHeaderContent;
  services: Service[];
  ctaBand: CtaBandContent;
  seo: PageMeta;
}

// ── Packages ────────────────────────────────────────────────────────────────

export interface PackagesContent {
  header: PageHeaderContent;
  plansHeading: SectionHeadingContent;
  emptyState: EmptyStateContent;
  footNote: string;
  checkDateLabel: string;
  packages: Package[];
  /** Fallback list shown when no single inclusion is shared by all plans. */
  included: { eyebrow: string; heading: string; lede: string; standardItems: string[] };
  addonsHeading: SectionHeadingContent;
  addOns: AddOn[];
  policies: { eyebrow: string; heading: string; lede: string };
  bookingPolicies: string[];
  ctaBand: CtaBandContent;
  seo: PageMeta;
}

// ── Gallery ─────────────────────────────────────────────────────────────────

export interface GalleryContent {
  header: PageHeaderContent;
  emptyState: EmptyStateContent;
  gallery: GalleryItem[];
  ctaBand: CtaBandContent;
  seo: PageMeta;
}

// ── About ───────────────────────────────────────────────────────────────────

export interface AboutPageContent {
  header: PageHeaderContent;
  storyEyebrow: string;
  storyHeading: string;
  about: AboutContent;
  valuesHeading: SectionHeadingContent;
  /** The first half of the "next step" paragraph comes from Site Settings. */
  next: { heading: string; suffix: string; servicesLabel: string; enquireLabel: string };
  ctaBand: CtaBandContent;
  seo: PageMeta;
}

// ── FAQ ─────────────────────────────────────────────────────────────────────

export interface FaqContent {
  header: PageHeaderContent;
  searchPlaceholder: string;
  emptyCopy: string;
  support: { heading: string; body: string; label: string };
  faqs: Faq[];
  ctaBand: CtaBandContent;
  seo: PageMeta;
}

// ── Contact ─────────────────────────────────────────────────────────────────

export interface ContactStep {
  title: string;
  detail: string;
}

export interface ContactContent {
  header: PageHeaderContent;
  asideHeading: string;
  steps: ContactStep[];
  serviceAreaLabel: string;
  typicalReplyLabel: string;
  typicalReplyValue: string;
  formTitle: string;
  formLede: string;
  formFoot: string;
  seo: PageMeta;
}

// ── Site settings ───────────────────────────────────────────────────────────

export interface SocialLink {
  label: string;
  url: string;
}

export interface SiteSettingsContent {
  brandName: string;
  serviceAreaStatement: string;
  /** Empty until the client provides the Google Business Profile review URL. */
  reviewUrl: string;
  /** Placeholder until the client provides the Messenger page destination. */
  messengerUrl: string;
  /** Empty: no social links are rendered on the public site yet. */
  socials: SocialLink[];
  footerCta: { title: string; lede: string; label: string };
  sharedImages: {
    premium: SampleImage;
    roaming: SampleImage;
    video360: SampleImage;
    cta: SampleImage;
  };
}

// ── Root ────────────────────────────────────────────────────────────────────

export interface CmsContent {
  home: HomeContent;
  services: ServicesContent;
  packages: PackagesContent;
  gallery: GalleryContent;
  about: AboutPageContent;
  faq: FaqContent;
  contact: ContactContent;
  settings: SiteSettingsContent;
}
