// Supabase adapter for the five item modules (Phase 6, DEC-024).
//
// Editors keep their list/detail UX untouched: useModuleList loads and
// persists through here. Each item's `id` doubles as its DB slug (stable and
// unique; seeds already use slugs as ids). Array position is `sort_order`.
// When Supabase env is absent, everything falls back to the local repository
// so `npm run dev` works pre-provisioning.

import { getSupabaseBrowser, isSupabaseConfigured } from "./client";
import type { Database } from "./database.types";
import { cmsRepository } from "../cms/repository";
import { deleteImage } from "../cms/storage";
import { collectImageKeys } from "../cms/images";
import type {
  EventTypeItem,
  FaqItem,
  GalleryItem,
  PackageItem,
  ServiceItem,
  StoreSectionKey,
} from "../cms/types";
import type { ModuleSectionKey } from "../../components/admin/ModuleCrud";

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
type PackageRow = Database["public"]["Tables"]["packages"]["Row"];
type GalleryRow = Database["public"]["Tables"]["gallery_items"]["Row"];
type FaqRow = Database["public"]["Tables"]["faqs"]["Row"];
type EventTypeRow = Database["public"]["Tables"]["event_types"]["Row"];

/** Insert payload: server defaults own id/created_at/updated_at. */
type InsertOf<T> = Omit<T, "id" | "created_at" | "updated_at">;

// ── Row mapping ─────────────────────────────────────────────────────────────

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

function serviceToRow(item: ServiceItem, sortOrder: number): InsertOf<ServiceRow> {
  return {
    slug: item.id,
    name: item.name,
    badge_type: item.badgeType,
    custom_badge: item.customBadge,
    tagline: item.tagline ?? null,
    summary: item.summary,
    highlights: item.highlights ?? [],
    icon: item.icon ?? null,
    image_key: item.image.key,
    image_src: item.image.src,
    image_alt: item.image.alt,
    highlight: item.highlight,
    sort_order: sortOrder,
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
    image: { key: row.image_key, src: row.image_src, alt: row.image_alt },
    highlight: row.highlight,
  };
}

function packageToRow(item: PackageItem, sortOrder: number): InsertOf<PackageRow> {
  return {
    slug: item.id,
    name: item.name,
    summary: item.summary,
    duration_label: item.durationLabel,
    price_label: item.priceLabel,
    badge_type: item.badgeType,
    custom_badge: item.customBadge,
    inclusions: item.inclusions ?? [],
    image_key: item.image.key,
    image_src: item.image.src,
    image_alt: item.image.alt ?? "",
    highlight: item.highlight,
    sort_order: sortOrder,
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

function galleryToRow(item: GalleryItem, sortOrder: number): InsertOf<GalleryRow> {
  return {
    slug: item.id,
    image_key: item.image.key,
    image_src: item.image.src,
    image_alt: item.image.alt,
    caption: item.caption,
    highlight: item.highlight,
    sort_order: sortOrder,
  };
}

export function faqFromRow(row: FaqRow): FaqItem {
  return {
    id: row.slug,
    question: row.question,
    answer: row.answer,
    highlight: row.highlight,
  };
}

function faqToRow(item: FaqItem, sortOrder: number): InsertOf<FaqRow> {
  return {
    slug: item.id,
    question: item.question,
    answer: item.answer,
    highlight: item.highlight,
    sort_order: sortOrder,
  };
}

export function eventTypeFromRow(row: EventTypeRow): EventTypeItem {
  return { id: row.slug, label: row.label };
}

function eventTypeToRow(item: EventTypeItem, sortOrder: number): InsertOf<EventTypeRow> {
  return { slug: item.id, label: item.label, sort_order: sortOrder };
}

// ── Load / save ─────────────────────────────────────────────────────────────

/** Loads a module list in display order, mapped to CMS items. */
export async function loadModuleItems<T extends { id: string }>(
  sectionKey: ModuleSectionKey,
): Promise<T[]> {
  if (!isSupabaseConfigured()) {
    const local = await cmsRepository.loadSection(sectionKey as StoreSectionKey);
    return (Array.isArray(local) ? local : []) as unknown as T[];
  }
  const supabase = getSupabaseBrowser();
  switch (sectionKey) {
    case "mod-services": {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw new Error("Module could not be loaded.");
      return data.map(serviceFromRow) as unknown as T[];
    }
    case "mod-packages": {
      const { data, error } = await supabase.from("packages").select("*").order("sort_order");
      if (error) throw new Error("Module could not be loaded.");
      return data.map(packageFromRow) as unknown as T[];
    }
    case "mod-gallery": {
      const { data, error } = await supabase.from("gallery_items").select("*").order("sort_order");
      if (error) throw new Error("Module could not be loaded.");
      return data.map(galleryFromRow) as unknown as T[];
    }
    case "mod-faqs": {
      const { data, error } = await supabase.from("faqs").select("*").order("sort_order");
      if (error) throw new Error("Module could not be loaded.");
      return data.map(faqFromRow) as unknown as T[];
    }
    case "mod-event-types": {
      const { data, error } = await supabase.from("event_types").select("*").order("sort_order");
      if (error) throw new Error("Module could not be loaded.");
      return data.map(eventTypeFromRow) as unknown as T[];
    }
  }
}

/** Deletes rows whose slug is not in `keepSlugs` (empty list deletes all rows). */
async function deleteMissingSlugs(
  table: "services" | "packages" | "gallery_items" | "faqs" | "event_types",
  keepSlugs: string[],
): Promise<void> {
  const supabase = getSupabaseBrowser();
  const pending =
    keepSlugs.length > 0
      ? supabase
          .from(table)
          .delete()
          .not(
            "slug",
            "in",
            `(${keepSlugs.map((slug) => `"${slug.replace(/"/g, "")}"`).join(",")})`,
          )
      : supabase.from(table).delete().neq("slug", "");
  const { error } = await pending;
  if (error) throw new Error("Module could not be saved.");
}

/**
 * Persists a whole module list: upserts every item by slug, deletes rows no
 * longer present, garbage-collects orphaned storage images, then reloads from
 * the database so the UI reflects the stored truth. Returns the reloaded list.
 */
export async function saveModuleItems<T extends { id: string }>(
  sectionKey: ModuleSectionKey,
  previous: T[],
  next: T[],
): Promise<T[]> {
  if (!isSupabaseConfigured()) {
    await cmsRepository.saveSection(sectionKey as StoreSectionKey, next);
    return next;
  }
  const supabase = getSupabaseBrowser();
  const keepSlugs = next.map((item) => item.id);

  switch (sectionKey) {
    case "mod-services": {
      const items = next as unknown as ServiceItem[];
      const { error } = await supabase.from("services").upsert(
        items.map((item, index) => serviceToRow(item, index)),
        { onConflict: "slug" },
      );
      if (error) throw new Error("Module could not be saved.");
      await deleteMissingSlugs("services", keepSlugs);
      break;
    }
    case "mod-packages": {
      const items = next as unknown as PackageItem[];
      const { error } = await supabase.from("packages").upsert(
        items.map((item, index) => packageToRow(item, index)),
        { onConflict: "slug" },
      );
      if (error) throw new Error("Module could not be saved.");
      await deleteMissingSlugs("packages", keepSlugs);
      break;
    }
    case "mod-gallery": {
      const items = next as unknown as GalleryItem[];
      const { error } = await supabase.from("gallery_items").upsert(
        items.map((item, index) => galleryToRow(item, index)),
        { onConflict: "slug" },
      );
      if (error) throw new Error("Module could not be saved.");
      await deleteMissingSlugs("gallery_items", keepSlugs);
      break;
    }
    case "mod-faqs": {
      const items = next as unknown as FaqItem[];
      const { error } = await supabase.from("faqs").upsert(
        items.map((item, index) => faqToRow(item, index)),
        { onConflict: "slug" },
      );
      if (error) throw new Error("Module could not be saved.");
      await deleteMissingSlugs("faqs", keepSlugs);
      break;
    }
    case "mod-event-types": {
      const items = next as unknown as EventTypeItem[];
      const { error } = await supabase.from("event_types").upsert(
        items.map((item, index) => eventTypeToRow(item, index)),
        { onConflict: "slug" },
      );
      if (error) throw new Error("Module could not be saved.");
      await deleteMissingSlugs("event_types", keepSlugs);
      break;
    }
  }

  // Orphaned uploads are best-effort: a storage failure never blocks the save.
  const oldKeys = new Set<string>();
  const newKeys = new Set<string>();
  collectImageKeys(previous, oldKeys);
  collectImageKeys(next, newKeys);
  await Promise.allSettled(
    [...oldKeys]
      .filter((key) => key !== "" && !newKeys.has(key))
      .map((key) => deleteImage(key).catch(() => undefined)),
  );

  return loadModuleItems<T>(sectionKey);
}
