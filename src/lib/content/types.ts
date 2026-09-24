// Content shapes for Melbourne Photobooth Hire.
//
// PROVISIONAL CONTENT: structure follows the Shot&Prints reference for
// development velocity (user-waived confirmation for dev). Values are
// CMS-editable placeholders, not confirmed production facts. Do not publish
// as verified business claims. Shot&Prints identity (contacts, ABN, socials,
// ratings, established dates) is never carried over. The Supabase adapter in
// Phase 3 satisfies the same ContentSource interface at this seam.

export interface Service {
  id: string;
  name: string;
  summary: string;
  badge?: string;
  /** Data-driven emphasis: true only for the Most Popular badge type. */
  featured?: boolean;
  tagline?: string;
  highlights?: string[];
  icon?: "camera" | "users" | "video";
  /** False when an admin highlight toggle removes the item from homepage sections. */
  highlight?: boolean;
}

export interface Package {
  id: string;
  name: string;
  summary: string;
  durationLabel: string;
  priceLabel: string;
  inclusions: string[];
  badge?: string;
  /** Data-driven emphasis: true only for the Most Popular badge type. */
  featured?: boolean;
  /** False when an admin highlight toggle removes the item from homepage sections. */
  highlight?: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  detail: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  summary: string;
  /** Presentational icon key for the "How it works" steps. */
  icon?: "message" | "palette" | "sparkles";
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  eventType: string;
  /**
   * Star rating (1-5). PROVISIONAL: must never be rendered for a testimonial
   * whose rating is unverified (REQ-REV-007); omitted when absent.
   */
  rating?: number;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  /** False when an admin highlight toggle removes the item from the homepage showcase. */
  highlight?: boolean;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  /** False when an admin highlight toggle removes the item from the homepage teaser. */
  highlight?: boolean;
}

export interface SiteSettings {
  brandName: string;
  heroHeadline: string;
  heroSupporting: string;
  serviceAreaStatement: string;
  /** Null until the client supplies the Google Business Profile review URL. */
  reviewUrl: string | null;
}

/**
 * A remotely-hosted placeholder image.
 * PLACEHOLDER: external stock photography for layout purposes only, replaced
 * for client-approved imagery via the same seam.
 */
export interface SampleImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface HeroStat {
  value: string;
  label: string;
  icon?: "camera" | "clock" | "qrcode";
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

/** Provisional About-page content (CMS-editable; not a confirmed company history). */
export interface AboutContent {
  eyebrow: string;
  headline: string;
  lede: string;
  story: string[];
  values: AboutValue[];
  stats: AboutStat[];
}

export interface SiteContent {
  services: Service[];
  packages: Package[];
  addOns: AddOn[];
  eventTypes: string[];
  processSteps: ProcessStep[];
  testimonials: Testimonial[];
  bookingPolicies: string[];
  gallery: GalleryItem[];
  faqs: Faq[];
  site: SiteSettings;
  about: AboutContent;
  /** Homepage-only provisional fields. */
  heroBackgroundImage?: SampleImage;
  heroStats?: HeroStat[];
  serviceImages?: Record<string, SampleImage>;
  showcaseImages?: SampleImage[];
  ctaImage?: SampleImage;
}
