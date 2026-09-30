// CMS image storage: Supabase Storage backend (Phases 5-6, DEC-024).
//
// Same interface as the former IndexedDB store (lib/cms/images.ts), now
// backed by the public `cms-media` bucket. `CmsImage.key` holds the storage
// path; `src` carries the public URL alongside it so previews render without
// a resolution round-trip. RLS allows only allow-listed admins to upload or
// delete; anyone can read served images.

import { getSupabaseBrowser, isSupabaseConfigured } from "../supabase/client";

export const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp";
export const IMAGE_MAX_BYTES = 10 * 1024 * 1024;
export const IMAGE_TYPES_LABEL = "PNG, JPEG or WebP up to 10 MB";

/**
 * Longest-edge cap applied to uploads before they reach Storage (free plan has
 * no transform service, so the stored bytes must already be delivery-sized).
 * Hero/CTA images are the largest consumers; 1920 covers full-bleed widths.
 */
export const IMAGE_MAX_EDGE = 1920;
/** Tighter caps for small chrome assets (logo, favicon) rendered at ~50-250px. */
export const LOGO_MAX_EDGE = 512;
export const FAVICON_MAX_EDGE = 256;

const BUCKET = "cms-media";

/** Raised by a selected file that fails type or size validation. */
export class ImageFileError extends Error {}

/** Validates a selected image file against the accepted types and size cap. */
export function validateImageFile(file: File): void {
  if (!IMAGE_ACCEPT.split(",").includes(file.type)) {
    throw new ImageFileError("Choose a PNG, JPEG or WebP image.");
  }
  if (file.size > IMAGE_MAX_BYTES) {
    throw new ImageFileError("Image must be 10 MB or smaller.");
  }
}

function extensionFor(file: { type: string }): string {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

/** Decode a file into a drawable source, revoking any object URL afterwards. */
async function withDecodedImage<T>(
  file: File,
  use: (source: CanvasImageSource, width: number, height: number) => Promise<T>,
): Promise<T> {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file);
    try {
      return await use(bitmap, bitmap.width, bitmap.height);
    } finally {
      bitmap.close();
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const node = new Image();
      node.onload = () => resolve(node);
      node.onerror = () => reject(new Error("decode failed"));
      node.src = url;
    });
    return await use(img, img.naturalWidth, img.naturalHeight);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), type, quality));
}

/**
 * Downscales and re-encodes an image for web delivery. Returns the original
 * file when the browser cannot decode it, when no downscale is needed and it
 * is already efficient, or when re-encoding did not produce a smaller file.
 */
async function optimizeImageFile(file: File, maxEdge: number): Promise<File> {
  try {
    return await withDecodedImage(file, async (source, width, height) => {
      const longest = Math.max(width, height);
      const scale = longest > maxEdge ? maxEdge / longest : 1;
      const targetW = Math.max(1, Math.round(width * scale));
      const targetH = Math.max(1, Math.round(height * scale));
      // Re-encode to WebP when downscaling or when the source is not already
      // a compressed format. A small PNG logo still benefits from WebP.
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return file;
      ctx.drawImage(source, 0, 0, targetW, targetH);
      const blob = await canvasToBlob(canvas, "image/webp", 0.82);
      if (!blob) return file;
      if (blob.size >= file.size) return file;
      return new File([blob], `image.webp`, { type: "image/webp" });
    });
  } catch {
    return file;
  }
}

function randomSuffix(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().slice(0, 8);
  }
  return String(Math.floor(Math.random() * 1e8));
}

/** Saves an uploaded image and returns the storage path it is referenced by. */
export async function putImage(
  file: File,
  idFallback = "img",
  options: { maxEdge?: number } = {},
): Promise<string> {
  validateImageFile(file);
  if (!isSupabaseConfigured()) {
    throw new Error("Image uploads are not connected yet.");
  }
  const optimized = await optimizeImageFile(file, options.maxEdge ?? IMAGE_MAX_EDGE);
  const key = `${idFallback}-${randomSuffix()}.${extensionFor(optimized)}`;
  const { error } = await getSupabaseBrowser()
    .storage.from(BUCKET)
    // Cache-busting is inherent: each upload gets a unique key, so a long-lived
    // immutable cache never serves a stale/replaced image.
    .upload(key, optimized, {
      contentType: optimized.type,
      upsert: false,
      cacheControl: "31536000",
    });
  if (error) {
    throw new Error("The image could not be uploaded. Check your connection and try again.");
  }
  return key;
}

/** Public URL for a stored image. Anyone can read; only admins can write. */
export function getPublicImageUrl(key: string): string {
  const { data } = getSupabaseBrowser().storage.from(BUCKET).getPublicUrl(key);
  return data.publicUrl;
}

/** Async alias kept so callers can swap stores without touching call sites. */
export async function getImageUrl(key: string): Promise<string> {
  return getPublicImageUrl(key);
}

/** Drops a stored image. Best-effort: missing files resolve quietly. */
export async function deleteImage(key: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await getSupabaseBrowser().storage.from(BUCKET).remove([key]);
  if (error) throw new Error("Stored image could not be removed.");
}

/**
 * Collects every CmsImage storage key referenced by a saved value. Keys
 * identify `{ key, src, alt }` image objects at any depth.
 */
export function collectImageKeys(value: unknown, into: Set<string>): void {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const entry of value) collectImageKeys(entry, into);
    return;
  }
  const record = value as Record<string, unknown>;
  if ("key" in record && "src" in record && "alt" in record && typeof record.key === "string") {
    into.add(record.key);
    return;
  }
  for (const child of Object.values(record)) {
    if (child && typeof child === "object") collectImageKeys(child, into);
  }
}

/**
 * Deletes stored uploads that are no longer referenced by a saved module.
 * Keys present in the previous state but absent from the new one are removed;
 * individual failures resolve quietly so a save is never blocked by storage.
 */
export async function gcStorageImages(oldValue: unknown, newValue: unknown): Promise<void> {
  const oldKeys = new Set<string>();
  const newKeys = new Set<string>();
  collectImageKeys(oldValue, oldKeys);
  collectImageKeys(newValue, newKeys);
  await Promise.allSettled(
    [...oldKeys]
      .filter((key) => key !== "" && !newKeys.has(key))
      .map((key) => deleteImage(key).catch(() => undefined)),
  );
}
