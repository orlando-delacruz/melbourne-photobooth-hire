// Supabase adapter for per-page SEO (Phase 11, DEC-024).
//
// Each public page keeps one row in `page_seo`. Rows are seeded empty, so an
// empty row falls back to the local seed/hardcoded metadata until the first
// save. Keywords stay planning-only and are never rendered (see BaseLayout).
// Unconfigured env falls back to the local repository with identical shapes.

import { getSupabaseBrowser, isSupabaseConfigured } from "./client";
import { cmsSeed } from "../cms/seed";
import { deleteImage } from "../cms/storage";
import { PAGE_META_DEFAULTS, type PageMeta, type SeoPageKey } from "../cms/types";

/** Seed fallback: the default metadata for one page. */
function seedSeo(key: SeoPageKey): PageMeta {
  if (key === "privacy" || key === "terms") return normalizeSeo(cmsSeed.seo[key]);
  return normalizeSeo(cmsSeed.pages[key].seo);
}

/** Merges saved values over field defaults so older saves stay editable. */
export function normalizeSeo(value: unknown): PageMeta {
  const base = (value && typeof value === "object" ? value : {}) as Partial<PageMeta> & {
    ogImage?: Partial<NonNullable<PageMeta["ogImage"]>>;
  };
  const rawImage = base.ogImage && typeof base.ogImage === "object" ? base.ogImage : null;
  const image: Partial<NonNullable<PageMeta["ogImage"]>> = rawImage ?? {};
  return {
    seoTitle: typeof base.seoTitle === "string" ? base.seoTitle : "",
    seoDescription: typeof base.seoDescription === "string" ? base.seoDescription : "",
    ogImage: {
      key: typeof image.key === "string" ? image.key : null,
      src: typeof image.src === "string" ? image.src : "",
      alt: typeof image.alt === "string" ? image.alt : "",
      caption: typeof image.caption === "string" ? image.caption : undefined,
    },
    keywords: base.keywords ?? PAGE_META_DEFAULTS.keywords,
    canonicalUrl: base.canonicalUrl ?? PAGE_META_DEFAULTS.canonicalUrl,
    ogTitle: base.ogTitle ?? PAGE_META_DEFAULTS.ogTitle,
    ogDescription: base.ogDescription ?? PAGE_META_DEFAULTS.ogDescription,
    noindex: base.noindex ?? PAGE_META_DEFAULTS.noindex,
    nofollow: base.nofollow ?? PAGE_META_DEFAULTS.nofollow,
  };
}

function rowToSeo(row: {
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
}): PageMeta {
  return {
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    ogImage: { key: row.og_image_key, src: row.og_image_src, alt: row.og_image_alt },
    keywords: row.keywords,
    canonicalUrl: row.canonical_url,
    ogTitle: row.og_title,
    ogDescription: row.og_description,
    noindex: row.noindex,
    nofollow: row.nofollow,
  };
}

/** Admin load: DB row, or seed metadata when the row is still empty. */
export async function loadSeo(key: SeoPageKey): Promise<PageMeta> {
  const fallback = seedSeo(key);
  if (!isSupabaseConfigured()) throw new Error("CMS backend is not connected.");
  const { data, error } = await getSupabaseBrowser()
    .from("page_seo")
    .select("*")
    .eq("page_key", key)
    .maybeSingle();
  if (error || !data) throw new Error("SEO settings could not be loaded.");
  if (!data.seo_title.trim() && !data.seo_description.trim()) return fallback;
  return { ...fallback, ...rowToSeo(data) };
}

/** Admin save: upserts the row and GCs a replaced/removed OG upload. */
export async function saveSeo(key: SeoPageKey, seo: PageMeta): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("CMS backend is not connected.");
  const supabase = getSupabaseBrowser();
  const { data: previous } = await supabase
    .from("page_seo")
    .select("og_image_key")
    .eq("page_key", key)
    .maybeSingle();
  const { error } = await supabase.from("page_seo").upsert(
    {
      page_key: key,
      seo_title: seo.seoTitle,
      seo_description: seo.seoDescription,
      keywords: seo.keywords ?? "",
      canonical_url: seo.canonicalUrl ?? "",
      og_title: seo.ogTitle ?? "",
      og_description: seo.ogDescription ?? "",
      og_image_key: seo.ogImage.key,
      og_image_src: seo.ogImage.src,
      og_image_alt: seo.ogImage.alt,
      noindex: seo.noindex ?? false,
      nofollow: seo.nofollow ?? false,
    },
    { onConflict: "page_key" },
  );
  if (error) throw new Error("SEO settings could not be saved.");
  const oldKey = previous?.og_image_key;
  if (oldKey && oldKey !== seo.ogImage.key) {
    await deleteImage(oldKey).catch(() => undefined);
  }
}
