// Minimal Supabase row types mirroring supabase/schema.sql.
// Kept hand-written (no codegen dependency) to stay within the fixed scope.
// Field caps mirror src/lib/cms/schemas.ts validation limits.

export type ServiceBadgeType = "basic" | "most-popular" | "best-value" | "custom";
export type PackageBadgeType = "none" | "basic" | "most-popular" | "best-value" | "custom";

export type ServiceRow = {
  id: string;
  slug: string;
  name: string;
  badge_type: ServiceBadgeType;
  custom_badge: string;
  tagline: string | null;
  summary: string;
  highlights: string[];
  icon: string | null;
  image_key: string | null;
  image_src: string;
  image_alt: string;
  highlight: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type PackageRow = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  duration_label: string;
  price_label: string;
  badge_type: PackageBadgeType;
  custom_badge: string;
  inclusions: string[];
  image_key: string | null;
  image_src: string;
  image_alt: string;
  highlight: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type GalleryItemRow = {
  id: string;
  slug: string;
  image_key: string | null;
  image_src: string;
  image_alt: string;
  caption: string;
  highlight: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type FaqRow = {
  id: string;
  slug: string;
  question: string;
  answer: string;
  highlight: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type EventTypeRow = {
  id: string;
  slug: string;
  label: string;
  sort_order: number;
  created_at: string;
};

export type PageContentRow = {
  page_key: string;
  content: Record<string, unknown>;
  updated_at: string;
};

export type PageSeoRow = {
  page_key: string;
  seo_title: string;
  seo_description: string;
  keywords: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image_key: string | null;
  og_image_src: string;
  og_image_alt: string;
  noindex: boolean;
  nofollow: boolean;
  updated_at: string;
};

export type InquiryRow = {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  event_date: string;
  event_type: string | null;
  venue: string | null;
  guests: string | null;
  photobooth: string | null;
  message: string | null;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      services: {
        Row: ServiceRow;
        Insert: ServiceInsert;
        Update: Partial<ServiceInsert>;
        Relationships: [];
      };
      packages: {
        Row: PackageRow;
        Insert: PackageInsert;
        Update: Partial<PackageInsert>;
        Relationships: [];
      };
      gallery_items: {
        Row: GalleryItemRow;
        Insert: GalleryItemInsert;
        Update: Partial<GalleryItemInsert>;
        Relationships: [];
      };
      faqs: {
        Row: FaqRow;
        Insert: FaqInsert;
        Update: Partial<FaqInsert>;
        Relationships: [];
      };
      event_types: {
        Row: EventTypeRow;
        Insert: EventTypeInsert;
        Update: Partial<EventTypeInsert>;
        Relationships: [];
      };
      page_contents: {
        Row: PageContentRow;
        Insert: Omit<PageContentRow, "updated_at">;
        Update: Partial<Omit<PageContentRow, "updated_at">>;
        Relationships: [];
      };
      page_seo: {
        Row: PageSeoRow;
        Insert: Omit<PageSeoRow, "updated_at">;
        Update: Partial<Omit<PageSeoRow, "updated_at">>;
        Relationships: [];
      };
      inquiries: {
        Row: InquiryRow;
        Insert: InquiryInsert;
        Update: Partial<InquiryInsert>;
        Relationships: [];
      };
      admin_users: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string };
        Update: Partial<{ user_id: string }>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
  };
}

/** Insert payloads: the server defaults id/created_at/updated_at. */
export type ServiceInsert = Omit<ServiceRow, "id" | "created_at" | "updated_at">;
export type PackageInsert = Omit<PackageRow, "id" | "created_at" | "updated_at">;
export type GalleryItemInsert = Omit<GalleryItemRow, "id" | "created_at" | "updated_at">;
export type FaqInsert = Omit<FaqRow, "id" | "created_at" | "updated_at">;
export type EventTypeInsert = Omit<EventTypeRow, "id" | "created_at">;
export type InquiryInsert = Omit<InquiryRow, "id" | "created_at">;
