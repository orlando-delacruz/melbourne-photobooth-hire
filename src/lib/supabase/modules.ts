// Supabase adapter for the five item modules (single-backend model).
//
// Editors keep their list/detail UX untouched: useModuleList loads and
// persists through here. Each item's `id` doubles as its DB slug (stable and
// unique; seeds already use slugs as ids). Array position is `sort_order`.
// Without Supabase env every operation throws and the UI states it plainly.

import { getSupabaseBrowser, isSupabaseConfigured } from "./client";
import type { Database } from "./database.types";
import { collectImageKeys, deleteImage } from "../cms/storage";
import {
  eventTypeFromRow,
  faqFromRow,
  galleryFromRow,
  packageFromRow,
  serviceFromRow,
  testimonialFromRow,
} from "./rowMappers";
import type {
  EventTypeItem,
  FaqItem,
  GalleryItem,
  PackageItem,
  ServiceItem,
  TestimonialItem,
} from "../cms/types";
import type { ModuleSectionKey } from "../../components/admin/ModuleCrud";

// Row → item mappers live in a client-free module so public islands can use
// them without loading supabase-js; re-exported here for existing callers.
export {
  eventTypeFromRow,
  faqFromRow,
  galleryFromRow,
  packageFromRow,
  serviceFromRow,
  testimonialFromRow,
};

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
type PackageRow = Database["public"]["Tables"]["packages"]["Row"];
type GalleryRow = Database["public"]["Tables"]["gallery_items"]["Row"];
type FaqRow = Database["public"]["Tables"]["faqs"]["Row"];
type TestimonialRow = Database["public"]["Tables"]["testimonials"]["Row"];
type EventTypeRow = Database["public"]["Tables"]["event_types"]["Row"];

/** Insert payload: server defaults own id/created_at/updated_at. */
type InsertOf<T> = Omit<T, "id" | "created_at" | "updated_at">;

// ── Row mapping ─────────────────────────────────────────────────────────────

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
    highlight: item.highlight,
    card_badge: item.cardBadge,
    sort_order: sortOrder,
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

function faqToRow(item: FaqItem, sortOrder: number): InsertOf<FaqRow> {
  return {
    slug: item.id,
    question: item.question,
    answer: item.answer,
    highlight: item.highlight,
    sort_order: sortOrder,
  };
}

function eventTypeToRow(item: EventTypeItem, sortOrder: number): InsertOf<EventTypeRow> {
  return { slug: item.id, label: item.label, sort_order: sortOrder };
}

function testimonialToRow(item: TestimonialItem, sortOrder: number): InsertOf<TestimonialRow> {
  return {
    slug: item.id,
    quote: item.quote,
    name: item.name,
    event_type: item.eventType,
    rating: item.rating ?? null,
    status: item.status,
    sort_order: sortOrder,
  };
}

// ── Load / save ─────────────────────────────────────────────────────────────

/** Loads a module list in display order, mapped to CMS items. */
export async function loadModuleItems<T extends { id: string }>(
  sectionKey: ModuleSectionKey,
): Promise<T[]> {
  if (!isSupabaseConfigured()) {
    throw new Error("CMS backend is not connected.");
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
      // Admin listing is highlight-first, then display order. Public fetchers
      // (lib/realtime/fetchers, lib/supabase/public) stay sort_order-only.
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("highlight", { ascending: false })
        .order("sort_order");
      if (error) throw new Error("Module could not be loaded.");
      return data.map(galleryFromRow) as unknown as T[];
    }
    case "mod-faqs": {
      const { data, error } = await supabase.from("faqs").select("*").order("sort_order");
      if (error) throw new Error("Module could not be loaded.");
      return data.map(faqFromRow) as unknown as T[];
    }
    case "mod-testimonials": {
      const { data, error } = await supabase.from("testimonials").select("*").order("sort_order");
      if (error) throw new Error("Module could not be loaded.");
      return data.map(testimonialFromRow) as unknown as T[];
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
  table: "services" | "packages" | "gallery_items" | "faqs" | "testimonials" | "event_types",
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

/** Latest row update per module for the dashboard freshness table. */
export async function getModuleFreshness(): Promise<Record<ModuleSectionKey, string | null>> {
  const supabase = getSupabaseBrowser();
  const [services, packages, gallery, faqs, testimonials, eventTypes] = await Promise.all([
    supabase
      .from("services")
      .select("updated_at")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("packages")
      .select("updated_at")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("gallery_items")
      .select("updated_at")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("faqs")
      .select("updated_at")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("testimonials")
      .select("updated_at")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("event_types")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);
  return {
    "mod-services": services.data?.updated_at ?? null,
    "mod-packages": packages.data?.updated_at ?? null,
    "mod-gallery": gallery.data?.updated_at ?? null,
    "mod-faqs": faqs.data?.updated_at ?? null,
    "mod-testimonials": testimonials.data?.updated_at ?? null,
    "mod-event-types": eventTypes.data?.created_at ?? null,
  };
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
    throw new Error("CMS backend is not connected.");
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
    case "mod-testimonials": {
      const items = next as unknown as TestimonialItem[];
      const { error } = await supabase.from("testimonials").upsert(
        items.map((item, index) => testimonialToRow(item, index)),
        { onConflict: "slug" },
      );
      if (error) throw new Error("Module could not be saved.");
      await deleteMissingSlugs("testimonials", keepSlugs);
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

/**
 * Targeted moderation action for one review (DEC-035): approves or rejects
 * without rewriting the whole list. The admin browser session carries the
 * admin-only RLS grant; anonymous users have no write path to the table.
 */
export async function setTestimonialStatus(
  id: string,
  status: TestimonialItem["status"],
): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("CMS backend is not connected.");
  }
  const { error } = await getSupabaseBrowser()
    .from("testimonials")
    .update({ status })
    .eq("slug", id);
  if (error) throw new Error("The review status could not be updated.");
}
