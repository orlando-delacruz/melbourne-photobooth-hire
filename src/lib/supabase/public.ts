// Build-time public content from Supabase (Phase 8, DEC-024).
//
// Prerendered pages call loadPublicContent() in frontmatter: module rows are
// read with the anon key (RLS serves highlighted items only, which is exactly
// the public set), mapped through the same row mappers as the admin, and
// built into SiteContent. Any failure (unconfigured env, offline build,
// query error) falls back to the seed snapshot so the build never breaks.
// Server-only: import from .astro frontmatter, never from islands.

import { buildSiteContent, getEventTypes, getPageSeo } from "../content/cmsSource";
import type { SiteContent } from "../content/types";
import type { CmsContent, CmsModules, PageMeta, SeoPageKey } from "../cms/types";
import { cmsSeed } from "../cms/seed";
import { getSupabaseServerAnon } from "./server";
import {
  eventTypeFromRow,
  faqFromRow,
  galleryFromRow,
  packageFromRow,
  serviceFromRow,
} from "./modules";

function isConfigured(): boolean {
  const url =
    (process.env.PUBLIC_SUPABASE_URL as string | undefined) ??
    (import.meta.env.PUBLIC_SUPABASE_URL as string | undefined);
  const anonKey =
    (process.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined) ??
    (import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined);
  return Boolean(url && anonKey);
}

/** Full public snapshot: live modules when reachable, seed otherwise. */
export async function loadPublicContent(): Promise<SiteContent> {
  if (!isConfigured()) {
    console.warn("[public-content] Supabase env missing: rendering seed fallback.");
    return buildSiteContent();
  }
  try {
    const supabase = getSupabaseServerAnon();
    const [services, packages, gallery, faqs] = await Promise.all([
      supabase.from("services").select("*").order("sort_order"),
      supabase.from("packages").select("*").order("sort_order"),
      supabase.from("gallery_items").select("*").order("sort_order"),
      supabase.from("faqs").select("*").order("sort_order"),
    ]);
    if (services.error || packages.error || gallery.error || faqs.error) {
      console.warn("[public-content] Module query failed: rendering seed fallback.");
      return buildSiteContent();
    }
    console.log("[public-content] Rendering live Supabase module snapshot.");
    const modules: CmsModules = {
      services: (services.data ?? []).map(serviceFromRow),
      packages: (packages.data ?? []).map(packageFromRow),
      gallery: (gallery.data ?? []).map(galleryFromRow),
      faqs: (faqs.data ?? []).map(faqFromRow),
      "event-types": [],
    };
    return buildSiteContent(modules);
  } catch {
    return buildSiteContent();
  }
}

/** Contact-form dropdown options in display order, with seed fallback. */
export async function loadPublicEventTypes(): Promise<string[]> {
  if (!isConfigured()) return getEventTypes();
  try {
    const { data, error } = await getSupabaseServerAnon()
      .from("event_types")
      .select("*")
      .order("sort_order");
    if (error || !data) return getEventTypes();
    return data.map(eventTypeFromRow).map((item) => item.label);
  } catch {
    return getEventTypes();
  }
}

/**
 * Page-level copy plus site settings: DB blobs when saved, seed shapes
 * otherwise. Item lists are NOT included here; modules stay the source.
 */
export async function loadPublicPages(): Promise<{
  pages: CmsContent["pages"];
  settings: CmsContent["settings"];
}> {
  const fallback = { pages: cmsSeed.pages, settings: cmsSeed.settings };
  if (!isConfigured()) {
    console.warn("[public-content] Supabase env missing: rendering seed page copy.");
    return fallback;
  }
  try {
    const { data, error } = await getSupabaseServerAnon()
      .from("page_contents")
      .select("page_key, content");
    if (error || !data) {
      console.warn("[public-content] Page copy query failed: rendering seed page copy.");
      return fallback;
    }
    const pages = { ...cmsSeed.pages } as CmsContent["pages"];
    let settings = cmsSeed.settings;
    for (const row of data) {
      const content = row.content as unknown;
      if (!content || typeof content !== "object" || Object.keys(content).length === 0) continue;
      if (row.page_key === "settings") {
        settings = content as CmsContent["settings"];
      } else if (row.page_key in pages) {
        (pages as Record<string, unknown>)[row.page_key] = content;
      }
    }
    return { pages, settings };
  } catch {
    return fallback;
  }
}

/**
 * Public SEO for one page: DB row when configured, hardcoded fallbacks
 * otherwise. Empty rows fall back per field at render (pages coalesce).
 */
export async function loadPublicSeo(key: SeoPageKey): Promise<PageMeta> {
  const fallback = getPageSeo(key);
  if (!isConfigured()) return fallback;
  try {
    const { data, error } = await getSupabaseServerAnon()
      .from("page_seo")
      .select("*")
      .eq("page_key", key)
      .maybeSingle();
    if (error || !data) {
      console.warn(`[public-content] SEO query failed for ${key}: using fallback metadata.`);
      return fallback;
    }
    if (!data.seo_title.trim() && !data.seo_description.trim()) return fallback;
    return {
      seoTitle: data.seo_title,
      seoDescription: data.seo_description,
      ogImage: {
        key: data.og_image_key,
        src: data.og_image_src,
        alt: data.og_image_alt,
      },
      keywords: data.keywords,
      canonicalUrl: data.canonical_url,
      ogTitle: data.og_title,
      ogDescription: data.og_description,
      noindex: data.noindex,
      nofollow: data.nofollow,
    };
  } catch {
    return fallback;
  }
}
