// CMS image storage: Supabase Storage backend (Phases 5-6, DEC-024).
//
// Same interface as the former IndexedDB store (lib/cms/images.ts), now
// backed by the public `cms-media` bucket. `CmsImage.key` holds the storage
// path; `src` carries the public URL alongside it so previews render without
// a resolution round-trip. RLS allows only allow-listed admins to upload or
// delete; anyone can read served images.

import { getSupabaseBrowser, isSupabaseConfigured } from "../supabase/client";
import { collectImageKeys } from "./images";

export const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp";
export const IMAGE_MAX_BYTES = 2 * 1024 * 1024;
export const IMAGE_TYPES_LABEL = "PNG, JPEG or WebP up to 2 MB";

const BUCKET = "cms-media";

/** Raised by a selected file that fails type or size validation. */
export class ImageFileError extends Error {}

/** Validates a selected image file against the accepted types and size cap. */
export function validateImageFile(file: File): void {
  if (!IMAGE_ACCEPT.split(",").includes(file.type)) {
    throw new ImageFileError("Choose a PNG, JPEG or WebP image.");
  }
  if (file.size > IMAGE_MAX_BYTES) {
    throw new ImageFileError("Image must be 2 MB or smaller.");
  }
}

function extensionFor(file: File): string {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

function randomSuffix(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().slice(0, 8);
  }
  return String(Math.floor(Math.random() * 1e8));
}

/** Saves an uploaded image and returns the storage path it is referenced by. */
export async function putImage(file: File, idFallback = "img"): Promise<string> {
  validateImageFile(file);
  if (!isSupabaseConfigured()) {
    throw new Error("Image uploads are not connected yet.");
  }
  const key = `${idFallback}-${randomSuffix()}.${extensionFor(file)}`;
  const { error } = await getSupabaseBrowser()
    .storage.from(BUCKET)
    .upload(key, file, { contentType: file.type, upsert: false });
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
