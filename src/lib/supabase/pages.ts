// Supabase adapter for page-level CMS content (single-backend model).
//
// The 7 page sections plus settings live in `page_contents` as validated
// JSONB blobs (one row per page_key); Zod schemas remain the validator and
// item modules stay the single source of truth for lists (no duplication).
// Rows seeded empty fall back to the seed shape until the first save. There
// is no local repository anymore: without Supabase env every operation
// throws and the UI states it plainly.

import { getSupabaseBrowser, isSupabaseConfigured } from "./client";
import type { Json } from "./database.types";
import { cmsSeed } from "../cms/seed";
import { collectImageKeys, deleteImage } from "../cms/storage";

export type PageSectionKey = keyof typeof cmsSeed.pages | keyof { settings: unknown };

/** Freshness stamp for one section. Null means never saved. */
export interface SectionMeta {
  savedAt: string | null;
}

function seedFor(key: PageSectionKey): unknown {
  if (key === "settings") return structuredClone(cmsSeed.settings);
  return structuredClone(cmsSeed.pages[key as keyof typeof cmsSeed.pages]);
}

function isEmptyContent(value: unknown): boolean {
  return !value || typeof value !== "object" || Object.keys(value).length === 0;
}

function requireBackend(): void {
  if (!isSupabaseConfigured()) throw new Error("CMS backend is not connected.");
}

/** Loads page content: DB blob, or the seed shape when empty/unset. */
export async function loadPageSection(key: PageSectionKey): Promise<unknown> {
  const seed = seedFor(key);
  requireBackend();
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
  requireBackend();
  const supabase = getSupabaseBrowser();
  const { error } = await supabase
    .from("page_contents")
    .upsert({ page_key: key, content: values as unknown as Json }, { onConflict: "page_key" });
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
  const seed = seedFor(key);
  requireBackend();
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

/** Freshness per section from DB updated_at; missing rows read null. */
export async function getPageMeta(): Promise<Record<string, SectionMeta>> {
  requireBackend();
  const { data, error } = await getSupabaseBrowser()
    .from("page_contents")
    .select("page_key, updated_at");
  if (error || !data) throw new Error("Section freshness could not be loaded.");
  const meta: Record<string, SectionMeta> = {};
  for (const row of data) meta[row.page_key] = { savedAt: row.updated_at };
  for (const key of [...Object.keys(cmsSeed.pages), "settings"] as PageSectionKey[]) {
    meta[key] ??= { savedAt: null };
  }
  return meta;
}
