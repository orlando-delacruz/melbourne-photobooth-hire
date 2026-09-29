// Shared list-and-detail primitives for the item modules (Services,
// Packages, Gallery, FAQs, Testimonials). Each module keeps the same interaction shape:
// list -> detail -> edit/delete, and list -> Add -> create form -> list.
// State lives in the island (same approach as InquiriesView), so no new
// Astro routes are needed and the admin nav context is preserved.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { loadModuleItems, saveModuleItems } from "../../lib/supabase/modules";
import { getImageUrl } from "../../lib/cms/storage";
import type { CmsImage } from "../../lib/cms/types";
import { confirmBulkDelete, confirmDelete, notifyError, notifySuccess } from "./alerts";

export interface CrudNotice {
  tone: "success" | "error";
  title: string;
  body?: string;
  list?: string[];
}

export type ModuleSectionKey =
  | "mod-services"
  | "mod-packages"
  | "mod-gallery"
  | "mod-faqs"
  | "mod-testimonials"
  | "mod-event-types";

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

  /** Reload the list from the database (for out-of-band changes such as
   * moderation actions, which bypass the whole-list save). */
  const reload = useCallback(async () => {
    setBusy(true);
    try {
      setItems(await loadModuleItems<T>(sectionKey));
      return true;
    } catch {
      setNotice({
        tone: "error",
        title: "Could not reload items.",
        body: "Check your connection and refresh the page.",
      });
      return false;
    } finally {
      setBusy(false);
    }
  }, [sectionKey]);

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

  /** Deletes several items in one whole-list save, after one confirmation. */
  const removeMany = useCallback(
    async (ids: string[], guard?: { minLength: number; message: string }, noun = "items") => {
      if (!items) return false;
      const targets = ids.filter((id) => items.some((item) => item.id === id));
      if (targets.length === 0) return false;
      if (!(await confirmBulkDelete(targets.length, noun))) {
        return false;
      }
      if (guard && items.length - targets.length < guard.minLength) {
        setNotice({ tone: "error", title: guard.message });
        return false;
      }
      const remove = new Set(targets);
      const ok = await persist(items.filter((item) => !remove.has(item.id)));
      if (ok) void notifySuccess(targets.length === 1 ? "Item deleted." : "Items deleted.");
      return ok;
    },
    [items, persist],
  );

  return {
    items,
    loaded: items !== null,
    notice,
    setNotice,
    busy,
    persist,
    removeById,
    removeMany,
    reload,
  };
}

/**
 * Multi-select state for a module list. `validIds` is the set of rows the
 * admin can currently act on (all rows, or the visible rows when a filter is
 * active); ids that leave the list are dropped automatically, so a save,
 * reload or filter change never leaves a stale selection behind.
 */
export function useModuleSelection(validIds: string[]) {
  const [raw, setRaw] = useState<Set<string>>(() => new Set());
  const validKey = validIds.join("\u0000");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validSet = useMemo(() => new Set(validIds), [validKey]);
  const selectedIds = useMemo(() => {
    const next = new Set<string>();
    for (const id of raw) if (validSet.has(id)) next.add(id);
    return next;
  }, [raw, validSet]);

  const count = selectedIds.size;
  const allSelected = validIds.length > 0 && count === validIds.length;
  const someSelected = count > 0 && !allSelected;

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);

  const toggle = useCallback((id: string) => {
    setRaw((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setRaw((prev) => {
      const pruned = new Set([...prev].filter((id) => validSet.has(id)));
      const all = validSet.size > 0 && pruned.size === validSet.size;
      return all ? new Set() : new Set(validSet);
    });
  }, [validSet]);

  const clear = useCallback(() => setRaw(new Set()), []);

  return { selectedIds, count, allSelected, someSelected, isSelected, toggle, toggleAll, clear };
}

/** Header select-all checkbox, with the native indeterminate (partial) state. */
export function SelectAllCheckbox({
  checked,
  indeterminate,
  disabled,
  onChange,
  label = "Select all",
}: {
  checked: boolean;
  indeterminate: boolean;
  disabled?: boolean;
  onChange: () => void;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      className="ad-checkbox"
      checked={checked}
      disabled={disabled}
      aria-label={label}
      onChange={onChange}
    />
  );
}

/** Row selection checkbox; stops the click so the row link does not fire. */
export function RowSelectCheckbox({
  checked,
  disabled,
  label,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <input
      type="checkbox"
      className="ad-checkbox"
      checked={checked}
      disabled={disabled}
      aria-label={label}
      onChange={onChange}
      onClick={(event) => event.stopPropagation()}
    />
  );
}

/** Bulk action bar shown while one or more rows are selected. */
export function ModuleBulkBar({
  count,
  busy,
  onDelete,
  onClear,
}: {
  count: number;
  busy: boolean;
  onDelete: () => void;
  onClear: () => void;
}) {
  if (count === 0) return null;
  return (
    <div className="ad-bulk" role="region" aria-label={`${count} selected`}>
      <span className="ad-bulk-count">{count} selected</span>
      <span className="ad-bulk-actions">
        <button
          type="button"
          className="ad-button ad-button--secondary ad-button--danger"
          disabled={busy}
          onClick={onDelete}
        >
          <Trash2 size={16} aria-hidden="true" />
          {busy ? "Deleting..." : "Delete selected"}
        </button>
        <button
          type="button"
          className="ad-button ad-button--secondary"
          disabled={busy}
          onClick={onClear}
        >
          Clear
        </button>
      </span>
    </div>
  );
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
