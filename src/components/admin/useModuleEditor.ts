// Module editors state machine: async load with skeleton, dirty tracking,
// validation via the section schema, save, discard and reset. This is the
// controlled-state counterpart of useSectionEditor for array-valued modules
// (Services, Packages, Gallery, FAQs).

import { useCallback, useEffect, useState } from "react";
import type * as z from "zod";
import type { StoreSectionKey } from "../../lib/cms/types";
import type { SectionMeta } from "../../lib/cms/repository";
import { cmsRepository } from "../../lib/cms/repository";
import type { EditorNotice } from "./useSectionEditor";

type AnyZodSchema = z.ZodType<unknown>;

interface ModuleEditor<T> {
  items: T[];
  loaded: boolean;
  dirty: boolean;
  saving: boolean;
  notice: EditorNotice | null;
  savedAt: string | null;
  setNotice: (notice: EditorNotice | null) => void;
  updateItem: (index: number, partial: Partial<T>) => void;
  moveItem: (index: number, direction: -1 | 1) => void;
  duplicateItem: (index: number, makeId: (source: T) => T) => void;
  removeItem: (index: number) => void;
  setItems: (next: T[]) => void;
  save: () => void;
  discard: () => void;
  reset: () => void;
  /** Map of "index.field" validation errors from the last save attempt. */
  errors: Map<string, string>;
}

export function useModuleEditor<T extends { id: string }>(
  sectionKey: "mod-services" | "mod-packages" | "mod-gallery" | "mod-faqs",
  schema: AnyZodSchema,
): ModuleEditor<T> {
  const [items, setItemsState] = useState<T[]>([]);
  const [saved, setSaved] = useState<T[] | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<EditorNotice | null>(null);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    let live = true;
    cmsRepository.loadSection(sectionKey).then((value: unknown) => {
      if (!live) return;
      const list = Array.isArray(value) ? (value as T[]) : [];
      setItemsState(list);
      setSaved(list);
    });
    cmsRepository.getMeta().then((meta: Record<StoreSectionKey, SectionMeta>) => {
      if (live) setSavedAt(meta[sectionKey]?.savedAt ?? null);
    });
    return () => {
      live = false;
    };
  }, [sectionKey]);

  const dirty = saved !== null && JSON.stringify(items) !== JSON.stringify(saved);

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const setItems = useCallback((next: T[]) => {
    setItemsState(next);
  }, []);

  const updateItem = useCallback((index: number, partial: Partial<T>) => {
    setItemsState((current) =>
      current.map((item, i) => (i === index ? { ...item, ...partial } : item)),
    );
  }, []);

  const moveItem = useCallback((index: number, direction: -1 | 1) => {
    setItemsState((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
  }, []);

  const duplicateItem = useCallback((index: number, makeId: (source: T) => T) => {
    setItemsState((current) => {
      if (index < 0 || index >= current.length) return current;
      const copy = makeId(current[index]);
      const next = [...current];
      next.splice(index + 1, 0, copy);
      return next;
    });
  }, []);

  const removeItem = useCallback((index: number) => {
    setItemsState((current) => current.filter((_, i) => i !== index));
  }, []);

  const save = useCallback(() => {
    setSaving(true);
    setNotice(null);
    setErrors(new Map());
    const parsed = schema.safeParse(items);
    if (!parsed.success) {
      const lines: string[] = [];
      const fieldErrors = new Map<string, string>();
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        if (!fieldErrors.has(key)) fieldErrors.set(key, issue.message);
        lines.push(`${issue.path.join(".")}: ${issue.message}`);
      }
      setFieldErrorsFromLines(fieldErrors);
      setSaving(false);
      setNotice({
        tone: "error",
        title:
          lines.length === 1
            ? "One field needs attention before saving."
            : `${lines.length} fields need attention before saving.`,
        list: lines,
      });
      return;
    }

    cmsRepository
      .saveSection(sectionKey, items)
      .then(({ savedAt: at }) => {
        setSaved(items);
        setSavedAt(at);
        setNotice({
          tone: "success",
          title: "Changes saved.",
          body: "Your changes are saved and ready to publish.",
        });
      })
      .catch(() => {
        setNotice({
          tone: "error",
          title: "Could not save this section.",
          body: "Your edits are still in the form. Please try again.",
        });
      })
      .finally(() => setSaving(false));
  }, [items, savedAt, schema, sectionKey]);

  const discard = useCallback(() => {
    if (!saved) return;
    if (window.confirm("Discard unsaved changes and reload the saved values?")) {
      setItemsState(saved);
      setNotice(null);
      setErrors(new Map());
    }
  }, [saved]);

  const reset = useCallback(() => {
    if (
      window.confirm(
        "Reset this module to the original website content? Saved edits will be removed.",
      )
    ) {
      cmsRepository.resetSection(sectionKey).then((value) => {
        const list = Array.isArray(value) ? (value as T[]) : [];
        setItemsState(list);
        setSaved(list);
        setSavedAt(null);
        setErrors(new Map());
        setNotice({
          tone: "success",
          title: "Module reset.",
          body: "This module now matches the original website content.",
        });
      });
    }
  }, [sectionKey]);

  function setFieldErrorsFromLines(fieldErrors: Map<string, string>) {
    setErrors(fieldErrors);
  }

  return {
    items,
    loaded: saved !== null,
    dirty,
    saving,
    notice,
    savedAt,
    setNotice,
    updateItem,
    moveItem,
    duplicateItem,
    removeItem,
    setItems,
    save: () => save(),
    discard,
    reset,
    errors,
  };
}
