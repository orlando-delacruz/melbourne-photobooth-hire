// Anon read helpers for live islands (DEC-033).
//
// Same queries + row mappers as the SSR loaders (lib/supabase/public.ts,
// lib/supabase/modules.ts), so live refetches return the identical public
// dataset in display order. RLS scopes every read exactly like the server
// render. All helpers throw on failure — the hooks catch and keep the last
// good state, retrying on the next realtime event.
//
// The client is fetched through getLazySupabase() so supabase-js stays off
// the critical path (see lib/supabase/lazy.ts).
import { getLazySupabase } from "../supabase/lazy";
import {
  eventTypeFromRow,
  faqFromRow,
  galleryFromRow,
  packageFromRow,
  serviceFromRow,
  testimonialFromRow,
} from "../supabase/rowMappers";
import type {
  CtaBandContent,
  EventTypeItem,
  FaqItem,
  GalleryItem,
  PackageItem,
  PageHeaderContent,
  PageMeta,
  ServiceItem,
  TestimonialItem,
} from "../cms/types";

export async function fetchServices(): Promise<ServiceItem[]> {
  const supabase = await getLazySupabase();
  const { data, error } = await supabase.from("services").select("*").order("sort_order");
  if (error || !data) throw new Error("Live services could not be loaded.");
  return data.map(serviceFromRow);
}

export async function fetchPackages(): Promise<PackageItem[]> {
  const supabase = await getLazySupabase();
  const { data, error } = await supabase.from("packages").select("*").order("sort_order");
  if (error || !data) throw new Error("Live packages could not be loaded.");
  return data.map(packageFromRow);
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  const supabase = await getLazySupabase();
  const { data, error } = await supabase.from("gallery_items").select("*").order("sort_order");
  if (error || !data) throw new Error("Live gallery could not be loaded.");
  return data.map(galleryFromRow);
}

export async function fetchFaqs(): Promise<FaqItem[]> {
  const supabase = await getLazySupabase();
  const { data, error } = await supabase.from("faqs").select("*").order("sort_order");
  if (error || !data) throw new Error("Live FAQs could not be loaded.");
  return data.map(faqFromRow);
}

export async function fetchTestimonials(): Promise<TestimonialItem[]> {
  const supabase = await getLazySupabase();
  const { data, error } = await supabase.from("testimonials").select("*").order("sort_order");
  if (error || !data) throw new Error("Live testimonials could not be loaded.");
  return data.map(testimonialFromRow);
}

export async function fetchEventTypes(): Promise<EventTypeItem[]> {
  const supabase = await getLazySupabase();
  const { data, error } = await supabase.from("event_types").select("*").order("sort_order");
  if (error || !data) throw new Error("Live event types could not be loaded.");
  return data.map(eventTypeFromRow);
}

/** Single page_contents blob by key; null when absent so callers keep state. */
export async function fetchPageContent(key: string): Promise<unknown | null> {
  const supabase = await getLazySupabase();
  const { data, error } = await supabase
    .from("page_contents")
    .select("content")
    .eq("page_key", key)
    .maybeSingle();
  if (error || !data) throw new Error(`Live page copy for ${key} could not be loaded.`);
  const content = data.content as unknown;
  if (!content || typeof content !== "object" || Object.keys(content).length === 0) return null;
  return content;
}

/** Page header copy for a page key; null when absent so callers keep state. */
export async function fetchPageHeader(key: string): Promise<PageHeaderContent | null> {
  const content = (await fetchPageContent(key)) as { header?: PageHeaderContent } | null;
  return content?.header ?? null;
}

/** CTA band copy for a page key; null when absent so callers keep state. */
export async function fetchCtaBand(key: string): Promise<CtaBandContent | null> {
  const content = (await fetchPageContent(key)) as { ctaBand?: CtaBandContent } | null;
  return content?.ctaBand ?? null;
}

/** SEO row for a page key; null when absent so callers keep state. */
export async function fetchPageSeoRow(key: string): Promise<PageMeta | null> {
  const supabase = await getLazySupabase();
  const { data, error } = await supabase
    .from("page_seo")
    .select("*")
    .eq("page_key", key)
    .maybeSingle();
  if (error || !data) throw new Error(`Live SEO for ${key} could not be loaded.`);
  if (!data.seo_title.trim() && !data.seo_description.trim()) return null;
  return {
    seoTitle: data.seo_title,
    seoDescription: data.seo_description,
    ogImage: { key: data.og_image_key, src: data.og_image_src, alt: data.og_image_alt },
    keywords: data.keywords,
    canonicalUrl: data.canonical_url,
    ogTitle: data.og_title,
    ogDescription: data.og_description,
    noindex: data.noindex,
    nofollow: data.nofollow,
  };
}
