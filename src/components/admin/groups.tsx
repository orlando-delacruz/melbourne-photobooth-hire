// Reusable editor field groups: page headers, section headings, CTA bands
// and SEO metadata. Each group renders the same labeled inputs every page
// editor needs, wired to React Hook Form by name prefix.

import type { FieldErrors } from "react-hook-form";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { AdField, ImageField, TextArea, TextInput } from "./fields";
import { errMsg } from "./useSectionEditor";

export { errMsg };

// Loose function types: editors pass their own typed register/watch, and the
// dotted paths inside groups are validated at runtime by the Zod schemas.
type AnyRegister = (...args: any[]) => any;
type AnyWatch = (...args: any[]) => any;

interface GroupProps {
  prefix: string;
  register: AnyRegister;
  errors: FieldErrors;
  watch?: AnyWatch;
}

export function errorAt(errors: FieldErrors, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = errors;
  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return errMsg(current);
}

export const SERVICE_ICON_OPTIONS = [
  { value: "", label: "None" },
  { value: "camera", label: "Camera (premium booth)" },
  { value: "users", label: "People (roaming booth)" },
  { value: "video", label: "Video (360 booth)" },
];

export const STEP_ICON_OPTIONS = [
  { value: "", label: "None" },
  { value: "message", label: "Message" },
  { value: "palette", label: "Palette" },
  { value: "sparkles", label: "Sparkles" },
];

export const STAT_ICON_OPTIONS = [
  { value: "", label: "None" },
  { value: "camera", label: "Camera" },
  { value: "clock", label: "Clock" },
  { value: "qrcode", label: "QR code" },
];

export const RATING_OPTIONS = [
  { value: "", label: "No rating" },
  { value: "1", label: "1 star" },
  { value: "2", label: "2 stars" },
  { value: "3", label: "3 stars" },
  { value: "4", label: "4 stars" },
  { value: "5", label: "5 stars" },
];

/** Dotted-path registration helper for optional select values ("None" clears). */
export function optionalSelect(register: AnyRegister, name: string) {
  return register(name, {
    setValueAs: (value: unknown) => (value === "" ? undefined : value),
  });
}

export function PageHeaderGroup({ prefix, register, errors, watch }: GroupProps) {
  return (
    <div className="ad-stack">
      <AdField
        id={`${prefix}-title`}
        label="Page title"
        required
        hint="The H1 banner at the top of the page."
        error={errorAt(errors, `${prefix}.title`)}
      >
        <TextInput
          id={`${prefix}-title`}
          type="text"
          error={errorAt(errors, `${prefix}.title`)}
          {...register(`${prefix}.title`)}
        />
      </AdField>
      <AdField
        id={`${prefix}-eyebrow`}
        label="Eyebrow"
        required
        hint="Small label above the title."
        error={errorAt(errors, `${prefix}.eyebrow`)}
      >
        <TextInput
          id={`${prefix}-eyebrow`}
          type="text"
          error={errorAt(errors, `${prefix}.eyebrow`)}
          {...register(`${prefix}.eyebrow`)}
        />
      </AdField>
      <AdField
        id={`${prefix}-lede`}
        label="Introduction"
        required
        error={errorAt(errors, `${prefix}.lede`)}
      >
        <TextArea
          id={`${prefix}-lede`}
          rows={3}
          error={errorAt(errors, `${prefix}.lede`)}
          {...register(`${prefix}.lede`)}
        />
      </AdField>
      <ImageField
        legend="Header image."
        hint="Used as the page banner background."
        srcProps={register(`${prefix}.imageSrc`)}
        srcError={errorAt(errors, `${prefix}.imageSrc`)}
        altProps={register(`${prefix}.imageAlt`)}
        altError={errorAt(errors, `${prefix}.imageAlt`)}
        previewSrc={watch ? String(watch(`${prefix}.imageSrc`) ?? "") : ""}
      />
    </div>
  );
}

export function SectionHeadingGroup({ prefix, register, errors }: GroupProps) {
  return (
    <div className="ad-stack">
      <AdField
        id={`${prefix}-eyebrow`}
        label="Eyebrow"
        required
        error={errorAt(errors, `${prefix}.eyebrow`)}
      >
        <TextInput
          id={`${prefix}-eyebrow`}
          type="text"
          error={errorAt(errors, `${prefix}.eyebrow`)}
          {...register(`${prefix}.eyebrow`)}
        />
      </AdField>
      <AdField
        id={`${prefix}-title`}
        label="Title"
        required
        error={errorAt(errors, `${prefix}.title`)}
      >
        <TextInput
          id={`${prefix}-title`}
          type="text"
          error={errorAt(errors, `${prefix}.title`)}
          {...register(`${prefix}.title`)}
        />
      </AdField>
      <AdField
        id={`${prefix}-lede`}
        label="Introduction"
        required
        error={errorAt(errors, `${prefix}.lede`)}
      >
        <TextArea
          id={`${prefix}-lede`}
          rows={3}
          error={errorAt(errors, `${prefix}.lede`)}
          {...register(`${prefix}.lede`)}
        />
      </AdField>
    </div>
  );
}

export function CtaBandGroup({ prefix, register, errors, watch }: GroupProps) {
  return (
    <div className="ad-stack">
      <div className="ad-grid-2">
        <AdField
          id={`${prefix}-eyebrow`}
          label="Eyebrow"
          required
          error={errorAt(errors, `${prefix}.eyebrow`)}
        >
          <TextInput
            id={`${prefix}-eyebrow`}
            type="text"
            error={errorAt(errors, `${prefix}.eyebrow`)}
            {...register(`${prefix}.eyebrow`)}
          />
        </AdField>
        <AdField
          id={`${prefix}-headline`}
          label="Headline"
          required
          error={errorAt(errors, `${prefix}.headline`)}
        >
          <TextInput
            id={`${prefix}-headline`}
            type="text"
            error={errorAt(errors, `${prefix}.headline`)}
            {...register(`${prefix}.headline`)}
          />
        </AdField>
      </div>
      <AdField
        id={`${prefix}-lede`}
        label="Supporting text"
        required
        error={errorAt(errors, `${prefix}.lede`)}
      >
        <TextArea
          id={`${prefix}-lede`}
          rows={3}
          error={errorAt(errors, `${prefix}.lede`)}
          {...register(`${prefix}.lede`)}
        />
      </AdField>
      <div className="ad-grid-2">
        <AdField
          id={`${prefix}-primary`}
          label="Primary button label"
          required
          error={errorAt(errors, `${prefix}.primaryLabel`)}
        >
          <TextInput
            id={`${prefix}-primary`}
            type="text"
            error={errorAt(errors, `${prefix}.primaryLabel`)}
            {...register(`${prefix}.primaryLabel`)}
          />
        </AdField>
        <AdField
          id={`${prefix}-secondary`}
          label="Secondary button label"
          required
          error={errorAt(errors, `${prefix}.secondaryLabel`)}
        >
          <TextInput
            id={`${prefix}-secondary`}
            type="text"
            error={errorAt(errors, `${prefix}.secondaryLabel`)}
            {...register(`${prefix}.secondaryLabel`)}
          />
        </AdField>
      </div>
      <ImageField
        legend="Band image."
        hint="Background of the call-to-action band."
        srcProps={register(`${prefix}.imageSrc`)}
        srcError={errorAt(errors, `${prefix}.imageSrc`)}
        altProps={register(`${prefix}.imageAlt`)}
        altError={errorAt(errors, `${prefix}.imageAlt`)}
        previewSrc={watch ? String(watch(`${prefix}.imageSrc`) ?? "") : ""}
      />
    </div>
  );
}

export function SeoGroup({ prefix, register, errors }: GroupProps) {
  return (
    <div className="ad-stack">
      <AdField
        id={`${prefix}-seoTitle`}
        label="SEO title"
        required
        hint="Shown in search results and the browser tab."
        error={errorAt(errors, `${prefix}.seoTitle`)}
      >
        <TextInput
          id={`${prefix}-seoTitle`}
          type="text"
          error={errorAt(errors, `${prefix}.seoTitle`)}
          {...register(`${prefix}.seoTitle`)}
        />
      </AdField>
      <AdField
        id={`${prefix}-seoDescription`}
        label="Meta description"
        required
        hint="Summary shown in search results."
        error={errorAt(errors, `${prefix}.seoDescription`)}
      >
        <TextArea
          id={`${prefix}-seoDescription`}
          rows={3}
          error={errorAt(errors, `${prefix}.seoDescription`)}
          {...register(`${prefix}.seoDescription`)}
        />
      </AdField>
      <AdField
        id={`${prefix}-ogImage`}
        label="Social share image"
        required
        hint="Full image URL used when the page is shared."
        error={errorAt(errors, `${prefix}.ogImage`)}
      >
        <TextInput
          id={`${prefix}-ogImage`}
          type="url"
          inputMode="url"
          error={errorAt(errors, `${prefix}.ogImage`)}
          {...register(`${prefix}.ogImage`)}
        />
      </AdField>
    </div>
  );
}

export function Panel({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="ad-panel" aria-label={title}>
      <div className="ad-panel-head">
        <div>
          <h2>{title}</h2>
          {lede ? <p className="ad-panel-lede">{lede}</p> : null}
        </div>
      </div>
      <div className="ad-stack">{children}</div>
    </section>
  );
}

// ── Controlled string list ──────────────────────────────────────────────────
// Simple string arrays (inclusions, policies, event types) are edited through
// controlled inputs wired to setValue, keeping React Hook Form typings simple.

interface StringListProps {
  label: string;
  hint?: string;
  addLabel: string;
  emptyText: string;
  items: string[];
  itemError?: (index: number) => string | undefined;
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: -1 | 1) => void;
}

export function StringList({
  label,
  hint,
  addLabel,
  emptyText,
  items,
  itemError,
  onChange,
  onAdd,
  onRemove,
  onMove,
}: StringListProps) {
  return (
    <section aria-label={label}>
      <h3 className="ad-subhead">
        {label}{" "}
        <span className="ad-card-meta">
          ({items.length} {items.length === 1 ? "item" : "items"})
        </span>
      </h3>
      {hint ? <p className="ad-hint ad-subhint">{hint}</p> : null}
      {items.length === 0 ? (
        <div className="ad-empty">
          <h3>No items yet</h3>
          <p>{emptyText}</p>
        </div>
      ) : (
        <div className="ad-list">
          {items.map((item, index) => {
            const error = itemError ? itemError(index) : undefined;
            const inputId = `${label}-${index}`;
            return (
              <div className="ad-string-row" key={`${index}-${items.length}`}>
                <div className="ad-string-cell">
                  <label className="ad-hint ad-string-label" htmlFor={inputId}>
                    {label} {index + 1}
                  </label>
                  <TextInput
                    id={inputId}
                    type="text"
                    value={item}
                    error={error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    onChange={(event) => onChange(index, event.target.value)}
                  />
                  {error ? (
                    <p className="ad-error" id={`${inputId}-error`}>
                      {error}
                    </p>
                  ) : null}
                </div>
                <span className="ad-string-actions">
                  <button
                    type="button"
                    className="ad-icon-button"
                    onClick={() => onMove(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move ${label} ${index + 1} up`}
                    title="Move up"
                  >
                    <ArrowUp size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="ad-icon-button"
                    onClick={() => onMove(index, 1)}
                    disabled={index === items.length - 1}
                    aria-label={`Move ${label} ${index + 1} down`}
                    title="Move down"
                  >
                    <ArrowDown size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="ad-icon-button ad-icon-button--danger"
                    onClick={() => onRemove(index)}
                    aria-label={`Remove ${label} ${index + 1}`}
                    title="Remove"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </span>
              </div>
            );
          })}
        </div>
      )}
      <p className="ad-add-row">
        <button type="button" className="ad-button ad-button--secondary" onClick={onAdd}>
          <Plus size={16} aria-hidden="true" />
          {addLabel}
        </button>
      </p>
    </section>
  );
}
