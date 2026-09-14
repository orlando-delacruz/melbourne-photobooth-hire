// Content shapes for Melbourne Photobooth Hire.
//
// PROVISIONAL DEV MOCKS — structure follows the Shot&Prints reference for
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
  tagline?: string;
  highlights?: string[];
  icon?: "camera" | "users" | "video";
}

export interface Package {
  id: string;
  name: string;
  summary: string;
  durationLabel: string;
  priceLabel: string;
  inclusions: string[];
  badge?: string;
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
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  eventType: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
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
 * A remotely-hosted sample image used by the homepage.
 * SAMPLE — external stock photography for layout purposes only. Never
 * presented as a real client event; alt text carries a "(sample imagery)"
 * marker. Swapped for client-approved media via the same seam.
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

/**
 * A sample testimonial. SAMPLE — invented quotes to exercise layout only
 * (REQ-REV-007 forbids presenting them as real reviews). Rendered with an
 * explicit "Sample" marker and replaced by approved content later.
 */
export interface SampleTestimonial {
  id: string;
  quote: string;
  name: string;
  eventType: string;
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
  /** Homepage-only provisional fields. */
  heroBackgroundImage?: SampleImage;
  heroStats?: HeroStat[];
  serviceImages?: Record<string, SampleImage>;
  showcaseImages?: SampleImage[];
  ctaImage?: SampleImage;
  sampleTestimonials?: SampleTestimonial[];
}
