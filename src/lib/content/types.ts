// Content shapes for Melbourne Photobooth Hire.
//
// These are scaffolding shapes for the centralized mock layer (ROADMAP Phase 2).
// Field values below are placeholders, never business facts: final fields,
// names, prices, and policies all require client confirmation (see
// docs/REQUIREMENTS.md Section 23). The Supabase adapter in Phase 3 satisfies
// the same ContentSource interface at this seam.

export interface Service {
  id: string;
  name: string;
  summary: string;
}

export interface Package {
  id: string;
  name: string;
  summary: string;
  durationLabel: string;
  priceLabel: string;
  inclusions: string[];
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
  serviceAreaStatement: string;
  /** Null until the client supplies the Google Business Profile review URL. */
  reviewUrl: string | null;
}

export interface SiteContent {
  services: Service[];
  packages: Package[];
  gallery: GalleryItem[];
  faqs: Faq[];
  site: SiteSettings;
}
