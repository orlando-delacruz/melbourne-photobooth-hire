// Shared list-and-detail primitives for the item modules (Services,
// Packages, Gallery, FAQs). Each module keeps the same interaction shape:
// list -> detail -> edit/delete, and list -> Add -> create form -> list.
// State lives in the island (same approach as InquiriesView), so no new
// Astro routes are needed and the admin nav context is preserved.

import { useCallback, useEffect, useState } from "react";
import { loadModuleItems, saveModuleItems } from "../../lib/supabase/modules";
import { getImageUrl } from "../../lib/cms/storage";
import type { CmsImage } from "../../lib/cms/types";
import { confirmDelete, notifyError, notifySuccess } from "./alerts";

export interface CrudNotice {
  tone: "success" | "error";
  title: string;
  body?: string;
  list?: string[];
}

export type ModuleSectionKey =
  "mod-services" | "mod-packages" | "mod-gallery" | "mod-faqs" | "mod-event-types";

export function useModuleList<T extends { id: string }>(sectionKey: ModuleSectionKey) {
  const [items, setItems] = useState<T[] | null>(null);
  const [notice, setNotice] = useState<CrudNotice | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    loadModuleItems<T>(sectionKey)
      .then((value) => {
        if (live) setItems(value);
      })
      .catch(() => {
        if (!live) return;
        setItems([]);
        setNotice({
          tone: "error",
          title: "Could not load items.",
          body: "Check your connection and refresh the page.",
        });
      });
    return () => {
      live = false;
    };
  }, [sectionKey]);

  const persist = useCallback(
    async (next: T[]) => {
      setBusy(true);
      try {
        const saved = await saveModuleItems<T>(sectionKey, items ?? [], next);
        setItems(saved);
        return true;
      } catch {
        void notifyError("Could not save.", "Please try again.");
        return false;
      } finally {
        setBusy(false);
      }
    },
    [items, sectionKey],
  );

  const removeById = useCallback(
    async (id: string, displayName: string, guard?: { minLength: number; message: string }) => {
      if (!items) return false;
      if (!(await confirmDelete(displayName || "this item"))) {
        return false;
      }
      if (guard && items.length <= guard.minLength) {
        setNotice({ tone: "error", title: guard.message });
        return false;
      }
      const next = items.filter((item) => item.id !== id);
      const ok = await persist(next);
      if (ok) void notifySuccess("Item deleted.");
      return ok;
    },
    [items, persist],
  );

  return { items, loaded: items !== null, notice, setNotice, busy, persist, removeById };
}

/** Flatten a Zod element-schema failure to per-field messages keyed by dotted path. */
export function toFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const map = new Map<string, string>();
  const lines: string[] = [];
  for (const issue of issues) {
    const key = issue.path.map((part) => String(part)).join(".");
    if (!map.has(key)) map.set(key, issue.message);
    lines.push(`${key}: ${issue.message}`);
  }
  return { map, lines };
}

export function HighlightPill({
  on,
  onLabel = "Highlighted",
  offLabel = "Not highlighted",
}: {
  on: boolean;
  onLabel?: string;
  offLabel?: string;
}) {
  return (
    <span className={on ? "ad-pill ad-pill--on" : "ad-pill ad-pill--off"}>
      <span className="ad-pill-dot" aria-hidden="true" />
      {on ? onLabel : offLabel}
    </span>
  );
}

export function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="ad-detail-row">
      <dt>{label}</dt>
      <dd>{value || "-"}</dd>
    </div>
  );
}

/** Read-only image preview for detail views (decorative img, alt shown as text). */
export function ModuleImage({ image, caption }: { image: CmsImage; caption?: string }) {
  const [url, setUrl] = useState<string>("");
  useEffect(() => {
    let live = true;
    const source = image.key ? getImageUrl(image.key) : Promise.resolve(image.src);
    source
      .then((value) => {
        if (live) setUrl(value ?? "");
      })
      .catch(() => {
        if (live) setUrl("");
      });
    return () => {
      live = false;
    };
  }, [image.key, image.src]);

  if (!url) {
    return (
      <div className="ad-detail-media ad-detail-media--empty" aria-label="No image">
        <span>No image uploaded</span>
      </div>
    );
  }
  return (
    <figure className="ad-detail-media">
      <img src={url} alt="" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/** Small thumbnail for list tables. */
export function ModuleThumb({ image }: { image: CmsImage }) {
  const [url, setUrl] = useState<string>("");
  useEffect(() => {
    let live = true;
    const source = image.key ? getImageUrl(image.key) : Promise.resolve(image.src);
    source
      .then((value) => {
        if (live) setUrl(value ?? "");
      })
      .catch(() => {
        if (live) setUrl("");
      });
    return () => {
      live = false;
    };
  }, [image.key, image.src]);
  if (!url) return <span className="ad-thumb ad-thumb--empty" aria-hidden="true" />;
  return (
    <span className="ad-thumb" aria-hidden="true">
      <img src={url} alt="" aria-hidden="true" />
    </span>
  );
}
