// Supabase adapter for page-level CMS content (Phase 7, DEC-024).
//
// The 7 page sections plus settings live in `page_contents` as validated
// JSONB blobs (one row per page_key); Zod schemas remain the validator and
// item modules stay the single source of truth for lists (no duplication).
// Rows are seeded empty, so an empty row falls back to the local seed shape
// until the first save. Unconfigured env falls back to the local repository.

import { getSupabaseBrowser, isSupabaseConfigured } from "./client";
import { cmsRepository, type SectionMeta } from "../cms/repository";
import { deleteImage } from "../cms/storage";
import { collectImageKeys } from "../cms/images";
import type { CmsPageKey } from "../cms/types";

export type PageSectionKey = CmsPageKey | "settings";

function isEmptyContent(value: unknown): boolean {
  return !value || typeof value !== "object" || Object.keys(value).length === 0;
}

/** Loads page content: DB blob, or the local seed shape when empty/unset. */
export async function loadPageSection(key: PageSectionKey): Promise<unknown> {
  const seed = await cmsRepository.loadSection(key);
  if (!isSupabaseConfigured()) return seed;
  const { data, error } = await getSupabaseBrowser()
    .from("page_contents")
    .select("content")
    .eq("page_key", key)
    .maybeSingle();
  if (error) throw new Error("Section could not be loaded.");
  if (!data || isEmptyContent(data.content)) return seed;
  return data.content as unknown;
}

/** Saves whole-section page content, GCs orphaned uploads, returns freshness. */
export async function savePageSection(
  key: PageSectionKey,
  previous: unknown,
  values: unknown,
): Promise<{ savedAt: string }> {
  if (!isSupabaseConfigured()) return cmsRepository.saveSection(key, values);
  const supabase = getSupabaseBrowser();
  const { error } = await supabase
    .from("page_contents")
    .upsert(
      { page_key: key, content: values as Record<string, unknown> },
      { onConflict: "page_key" },
    );
  if (error) throw new Error("Section could not be saved.");

  const oldKeys = new Set<string>();
  const newKeys = new Set<string>();
  collectImageKeys(previous, oldKeys);
  collectImageKeys(values, newKeys);
  await Promise.allSettled(
    [...oldKeys]
      .filter((imageKey) => imageKey !== "" && !newKeys.has(imageKey))
      .map((imageKey) => deleteImage(imageKey).catch(() => undefined)),
  );

  const { data } = await supabase
    .from("page_contents")
    .select("updated_at")
    .eq("page_key", key)
    .maybeSingle();
  return { savedAt: data?.updated_at ?? new Date().toISOString() };
}

/**
 * Resets a page to its seed shape: deletes the DB row (loads fall back to
 * seed) and removes uploads referenced only by the deleted content.
 */
export async function resetPageSection(key: PageSectionKey): Promise<unknown> {
  const seed = await cmsRepository.loadSection(key);
  if (!isSupabaseConfigured()) {
    await cmsRepository.resetSection(key);
    return seed;
  }
  const supabase = getSupabaseBrowser();
  const { data: current } = await supabase
    .from("page_contents")
    .select("content")
    .eq("page_key", key)
    .maybeSingle();
  const { error } = await supabase.from("page_contents").delete().eq("page_key", key);
  if (error) throw new Error("Section could not be reset.");
  if (current && !isEmptyContent(current.content)) {
    const keys = new Set<string>();
    collectImageKeys(current.content as unknown, keys);
    await Promise.allSettled(
      [...keys]
        .filter((imageKey) => imageKey !== "")
        .map((imageKey) => deleteImage(imageKey).catch(() => undefined)),
    );
  }
  return seed;
}

/** Freshness per section: DB updated_at where present, local meta otherwise. */
export async function getPageMeta(): Promise<Record<string, SectionMeta>> {
  const local = await cmsRepository.getMeta();
  if (!isSupabaseConfigured()) return local;
  const { data, error } = await getSupabaseBrowser()
    .from("page_contents")
    .select("page_key, updated_at");
  if (error || !data) return local;
  const meta: Record<string, SectionMeta> = { ...local };
  for (const row of data) meta[row.page_key] = { savedAt: row.updated_at };
  return meta;
}
