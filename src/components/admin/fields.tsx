// Shared admin form primitives. Token-backed classes from styles/admin.css
// (prefix `ad-`), lucide icons, and the inquiry-form error conventions.

import { forwardRef, useState } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Copy,
  ImageIcon,
  Info,
  Plus,
  Trash2,
} from "lucide-react";
import type { FieldErrors, UseFormRegisterReturn } from "react-hook-form";

/** Flatten RHF nested errors to "path: message" lines for the summary. */
export function flattenErrors(errors: FieldErrors, prefix = ""): string[] {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(errors ?? {})) {
    if (!value || typeof value !== "object") continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof (value as { message?: unknown }).message === "string") {
      lines.push(`${path}: ${(value as { message: string }).message}`);
    } else {
      lines.push(...flattenErrors(value as FieldErrors, path));
    }
  }
  return lines;
}

/** First error path, used to move focus to the first invalid field. */
export function firstErrorPath(errors: FieldErrors): string | null {
  for (const [key, value] of Object.entries(errors ?? {})) {
    if (!value || typeof value !== "object") continue;
    if (typeof (value as { message?: unknown }).message === "string") return key;
    const nested = firstErrorPath(value as FieldErrors);
    if (nested) return `${key}.${nested}`;
  }
  return null;
}

// ── Field wrapper ───────────────────────────────────────────────────────────

interface AdFieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function AdField({ id, label, required, hint, error, children }: AdFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="ad-field">
      <label htmlFor={id}>
        {label}{" "}
        {required ? (
          <span className="ad-required" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {hint ? (
        <p className="ad-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p className="ad-error" id={errorId}>
          <AlertCircle size={15} aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

// ── Inputs ──────────────────────────────────────────────────────────────────

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & { error?: string };

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { error, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className="ad-input"
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${props.id}-error` : undefined}
      {...props}
    />
  );
});

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string };

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { error, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className="ad-textarea"
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${props.id}-error` : undefined}
      {...props}
    />
  );
});

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { error?: string };

export const AdSelect = forwardRef<HTMLSelectElement, SelectProps>(function AdSelect(
  { error, children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className="ad-select"
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${props.id}-error` : undefined}
      {...props}
    >
      {children}
    </select>
  );
});

// ── Image field (URL + alt + optional caption, with live preview) ───────────

interface ImageFieldProps {
  legend: string;
  srcProps: UseFormRegisterReturn;
  srcError?: string;
  altProps: UseFormRegisterReturn;
  altError?: string;
  captionProps?: UseFormRegisterReturn;
  captionError?: string;
  previewSrc: string;
  hint?: string;
}

export function ImageField({
  legend,
  srcProps,
  srcError,
  altProps,
  altError,
  captionProps,
  captionError,
  previewSrc,
  hint,
}: ImageFieldProps) {
  const [broken, setBroken] = useState(false);
  const showPreview = previewSrc.trim() !== "" && !broken;
  return (
    <fieldset className="ad-image-group">
      <legend className="ad-image-legend">
        {legend}
        {hint ? ` ${hint}` : ""}
      </legend>
      <div className="ad-image">
        <div
          className={showPreview ? "ad-image-preview" : "ad-image-preview ad-image-preview--empty"}
        >
          {showPreview ? (
            <img src={previewSrc} alt="" onError={() => setBroken(true)} />
          ) : (
            <span>
              <ImageIcon size={20} aria-hidden="true" />
            </span>
          )}
        </div>
        <div className="ad-image-fields">
          <AdField
            id={srcProps.name}
            label="Image URL"
            required
            hint="Full URL starting with https://"
            error={srcError}
          >
            <TextInput
              id={srcProps.name}
              type="url"
              inputMode="url"
              error={srcError}
              {...srcProps}
              onChange={(event) => {
                setBroken(false);
                srcProps.onChange(event);
              }}
            />
          </AdField>
          <AdField
            id={altProps.name}
            label="Alt text"
            hint="Describes the image for search and screen readers"
            error={altError}
          >
            <TextInput id={altProps.name} type="text" error={altError} {...altProps} />
          </AdField>
          {captionProps ? (
            <AdField id={captionProps.name} label="Caption" error={captionError}>
              <TextInput
                id={captionProps.name}
                type="text"
                error={captionError}
                {...captionProps}
              />
            </AdField>
          ) : null}
        </div>
      </div>
    </fieldset>
  );
}

// ── Repeatable list wrappers ────────────────────────────────────────────────

interface ArraySectionProps {
  title: string;
  hint?: string;
  count: number;
  addLabel: string;
  onAdd: () => void;
  emptyTitle: string;
  emptyBody: string;
  children: ReactNode;
}

export function ArraySection({
  title,
  hint,
  count,
  addLabel,
  onAdd,
  emptyTitle,
  emptyBody,
  children,
}: ArraySectionProps) {
  return (
    <section aria-label={title}>
      <h3 className="ad-subhead">
        {title}{" "}
        <span className="ad-card-meta">
          ({count} {count === 1 ? "item" : "items"})
        </span>
      </h3>
      {hint ? <p className="ad-hint ad-subhint">{hint}</p> : null}
      {count === 0 ? (
        <div className="ad-empty">
          <h3>{emptyTitle}</h3>
          <p>{emptyBody}</p>
        </div>
      ) : (
        <div className="ad-list">{children}</div>
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

interface ItemCardProps {
  index: number;
  title: string;
  idText?: string;
  disableUp?: boolean;
  disableDown?: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
  children: ReactNode;
}

export function ItemCard({
  index,
  title,
  idText,
  disableUp,
  disableDown,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove,
  children,
}: ItemCardProps) {
  return (
    <article className="ad-item">
      <div className="ad-item-head">
        <span className="ad-item-count" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="ad-item-title">{title || `Item ${index + 1}`}</p>
        {idText ? <span className="ad-id">{idText}</span> : null}
        <button
          type="button"
          className="ad-icon-button"
          onClick={onMoveUp}
          disabled={disableUp}
          aria-label={`Move ${title || `item ${index + 1}`} up`}
          title="Move up"
        >
          <ArrowUp size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="ad-icon-button"
          onClick={onMoveDown}
          disabled={disableDown}
          aria-label={`Move ${title || `item ${index + 1}`} down`}
          title="Move down"
        >
          <ArrowDown size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="ad-icon-button"
          onClick={onDuplicate}
          aria-label={`Duplicate ${title || `item ${index + 1}`}`}
          title="Duplicate"
        >
          <Copy size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="ad-icon-button ad-icon-button--danger"
          onClick={onRemove}
          aria-label={`Remove ${title || `item ${index + 1}`}`}
          title="Remove"
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="ad-item-body">{children}</div>
    </article>
  );
}

// ── Feedback ────────────────────────────────────────────────────────────────

interface NoticeProps {
  tone: "success" | "error" | "info";
  title: string;
  children?: ReactNode;
  list?: string[];
}

export function Notice({ tone, title, children, list }: NoticeProps) {
  const Icon = tone === "success" ? CheckCircle2 : tone === "error" ? AlertCircle : Info;
  return (
    <div className={`ad-notice ad-notice--${tone}`} role={tone === "error" ? "alert" : "status"}>
      <Icon size={20} aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        {children}
        {list && list.length > 0 ? (
          <ul>
            {list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

export function Skeleton() {
  return (
    <div className="ad-skeleton" aria-label="Loading editor" role="status">
      <div className="ad-skeleton-block" />
      <div className="ad-skeleton-block ad-skeleton-block--tall" />
      <div className="ad-skeleton-block" />
      <div className="ad-skeleton-block ad-skeleton-block--tall" />
    </div>
  );
}
