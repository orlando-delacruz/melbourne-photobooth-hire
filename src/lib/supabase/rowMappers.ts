// Pure Supabase row → CMS item mappers.
//
// Kept free of any Supabase client import so public islands can map live
// refetch rows without pulling supabase-js onto the critical path (see
// lib/supabase/lazy.ts). modules.ts re-exports these for the admin adapter.

import type { Database } from "./database.types";
import type {
  EventTypeItem,
  FaqItem,
  GalleryItem,
  PackageItem,
  ServiceItem,
  TestimonialItem,
} from "../cms/types";

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
type PackageRow = Database["public"]["Tables"]["packages"]["Row"];
type GalleryRow = Database["public"]["Tables"]["gallery_items"]["Row"];
type FaqRow = Database["public"]["Tables"]["faqs"]["Row"];
type TestimonialRow = Database["public"]["Tables"]["testimonials"]["Row"];
type EventTypeRow = Database["public"]["Tables"]["event_types"]["Row"];

export function serviceFromRow(row: ServiceRow): ServiceItem {
  return {
    id: row.slug,
    name: row.name,
    badgeType: row.badge_type,
    customBadge: row.custom_badge,
    tagline: row.tagline ?? undefined,
    summary: row.summary,
    highlights: row.highlights,
    icon: (row.icon as ServiceItem["icon"]) ?? undefined,
    image: { key: row.image_key, src: row.image_src, alt: row.image_alt },
    highlight: row.highlight,
  };
}

export function packageFromRow(row: PackageRow): PackageItem {
  return {
    id: row.slug,
    name: row.name,
    summary: row.summary,
    durationLabel: row.duration_label,
    priceLabel: row.price_label,
    badgeType: row.badge_type,
    customBadge: row.custom_badge,
    inclusions: row.inclusions,
    highlight: row.highlight,
    // Defensive default so a not-yet-migrated database still renders.
    cardBadge: (row.card_badge ?? "none") as PackageItem["cardBadge"],
  };
}

export function galleryFromRow(row: GalleryRow): GalleryItem {
  return {
    id: row.slug,
    image: { key: row.image_key, src: row.image_src, alt: row.image_alt },
    caption: row.caption,
    highlight: row.highlight,
  };
}

/**
 * faqs rows including the optional related-link columns
 * (migration-faq-links.sql). Kept as an intersection so mapping works both
 * before and after `supabase gen types` is re-run against the migrated
 * database; remove the intersection once the generated types include them.
 */
type FaqRowWithLink = FaqRow & {
  link_label?: string | null;
  link_href?: string | null;
};

export function faqFromRow(row: FaqRowWithLink): FaqItem {
  return {
    id: row.slug,
    question: row.question,
    answer: row.answer,
    highlight: row.highlight,
    linkLabel: row.link_label ?? undefined,
    linkHref: row.link_href ?? undefined,
  };
}

export function eventTypeFromRow(row: EventTypeRow): EventTypeItem {
  return { id: row.slug, label: row.label };
}

export function testimonialFromRow(row: TestimonialRow): TestimonialItem {
  return {
    id: row.slug,
    quote: row.quote,
    name: row.name,
    eventType: row.event_type,
    rating: row.rating ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  };
}
