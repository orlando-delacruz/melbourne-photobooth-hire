// Shared state machine for one admin section editor: async load with
// skeleton, dirty tracking with a leave guard, save, discard and reset.
// Every section editor composes this hook with its own fields.

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldErrors, FieldValues, UseFormReturn } from "react-hook-form";
import type * as z from "zod";
import { zodResolver } from "../../lib/validation/inquiry";
import type { StoreSectionKey } from "../../lib/cms/types";
import type { SectionMeta } from "../../lib/cms/repository";
import { cmsRepository } from "../../lib/cms/repository";
import { firstErrorPath, flattenErrors } from "./fields";

export interface EditorNotice {
  tone: "success" | "error";
  title: string;
  body?: string;
  list?: string[];
}

export function useSectionEditor<K extends StoreSectionKey>(
  section: K,
  schema: z.ZodType<unknown>,
): {
  form: UseFormReturn<FieldValues>;
  loaded: boolean;
  saving: boolean;
  notice: EditorNotice | null;
  savedAt: string | null;
  setNotice: (notice: EditorNotice | null) => void;
  onSave: () => void;
  onInvalid: (fieldErrors: FieldErrors) => void;
  onDiscard: () => void;
  onResetSection: () => void;
} {
  const [loaded, setLoaded] = useState<unknown>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<EditorNotice | null>(null);

  const form = useForm<FieldValues>({
    resolver: zodResolver(schema as z.ZodType<FieldValues>),
    mode: "onChange",
  });
  const { reset, setFocus } = form;
  const isDirty = form.formState.isDirty;

  useEffect(() => {
    let live = true;
    cmsRepository.loadSection(section).then((value: unknown) => {
      if (!live) return;
      setLoaded(value);
      reset(value as never);
    });
    cmsRepository.getMeta().then((meta: Record<StoreSectionKey, SectionMeta>) => {
      if (live) setSavedAt(meta[section]?.savedAt ?? null);
    });
    return () => {
      live = false;
    };
  }, [section, reset]);

  useEffect(() => {
    if (!isDirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const onSave = useCallback(() => {
    setSaving(true);
    setNotice(null);
    const values = form.getValues();
    cmsRepository
      .saveSection(section, values)
      .then(({ savedAt: at }) => {
        reset(values);
        setSavedAt(at);
        setNotice({
          tone: "success",
          title: "Section saved.",
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
  }, [form, reset, section]);

  const onInvalid = useCallback(
    (fieldErrors: FieldErrors) => {
      const lines = flattenErrors(fieldErrors);
      setNotice({
        tone: "error",
        title:
          lines.length === 1
            ? "One field needs attention before saving."
            : `${lines.length} fields need attention before saving.`,
        list: lines,
      });
      const first = firstErrorPath(fieldErrors);
      if (first) {
        try {
          setFocus(first as never);
        } catch {
          // Non-focusable path; the summary above is the fallback.
        }
      }
    },
    [setFocus],
  );

  const onDiscard = useCallback(() => {
    if (!loaded) return;
    if (window.confirm("Discard unsaved changes and reload the saved values?")) {
      reset(loaded as never);
      setNotice(null);
    }
  }, [loaded, reset]);

  const onResetSection = useCallback(() => {
    if (
      window.confirm(
        "Reset this section to the original website content? Saved edits for this section will be removed.",
      )
    ) {
      cmsRepository.resetSection(section).then((value) => {
        setLoaded(value);
        reset(value as never);
        setSavedAt(null);
        setNotice({
          tone: "success",
          title: "Section reset.",
          body: "This section now matches the original website content.",
        });
      });
    }
  }, [reset, section]);

  return {
    form,
    loaded: loaded !== null,
    saving,
    notice,
    savedAt,
    setNotice,
    onSave,
    onInvalid,
    onDiscard,
    onResetSection,
  };
}

/** Extract a message string from an RHF field error of unknown shape. */
export function errMsg(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;
  const message = (error as { message?: unknown }).message;
  return typeof message === "string" ? message : undefined;
}
