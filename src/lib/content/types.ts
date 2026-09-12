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
}
