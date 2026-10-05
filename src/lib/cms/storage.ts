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
 * 1600 covers full-bleed widths while keeping mobile transfers low; the
 * existing media was backfilled to the same cap (DEC-047).
 */
export const IMAGE_MAX_EDGE = 1600;
/** Tighter caps for small chrome assets (logo, favicon) rendered at ~50-250px. */
export const LOGO_MAX_EDGE = 512;
export const FAVICON_MAX_EDGE = 256;

/**
 * Responsive variant widths generated at upload (Phase 1B.6). Only widths
 * smaller than the stored image are produced. Supabase's free plan has no
 * on-the-fly transforms, so variants are pre-generated and referenced by
 * deterministic key: `<base>-<width>.webp` next to the original.
 */
export const IMAGE_VARIANT_WIDTHS = [320, 640, 1024] as const;
const VARIANT_QUALITY = 0.8;

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

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), type, quality));
}

/** A generated smaller rendition of an upload. */
interface ImageVariantFile {
  file: File;
  width: number;
  height: number;
}

/** An optimized upload plus the exact dimensions of the stored bytes. */
interface OptimizedImage {
  file: File;
  width?: number;
  height?: number;
  /** Smaller WebP renditions generated from the same decoded source. */
  variants: ImageVariantFile[];
}

/**
 * Downscales and re-encodes an image for web delivery, and generates the
 * smaller responsive variants. Falls back to the original file when the
 * browser cannot decode it or when re-encoding did not produce a smaller
 * file; variant generation failure simply yields an empty variant list, so
 * the original upload always succeeds. The returned width/height always
 * describe the bytes that will actually be stored.
 */
async function optimizeImageFile(file: File, maxEdge: number): Promise<OptimizedImage> {
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
      if (!ctx) return { file, width, height, variants: [] };
      ctx.drawImage(source, 0, 0, targetW, targetH);
      const blob = await canvasToBlob(canvas, "image/webp", 0.82);
      const main =
        !blob || blob.size >= file.size
          ? { file, width, height }
          : {
              file: new File([blob], `image.webp`, { type: "image/webp" }),
              width: targetW,
              height: targetH,
            };

      // Only widths smaller than the stored image are generated; the renderer
      // derives exactly these from the stored width, so it can never reference
      // a missing file.
      const variants: ImageVariantFile[] = [];
      const storedLongest = Math.min(longest, maxEdge);
      for (const variantWidth of IMAGE_VARIANT_WIDTHS) {
        if (variantWidth >= storedLongest) continue;
        const variantHeight = Math.max(1, Math.round((height / width) * variantWidth));
        const variantCanvas = document.createElement("canvas");
        variantCanvas.width = variantWidth;
        variantCanvas.height = variantHeight;
        const variantCtx = variantCanvas.getContext("2d");
        if (!variantCtx) continue;
        variantCtx.drawImage(source, 0, 0, variantWidth, variantHeight);
        const variantBlob = await canvasToBlob(variantCanvas, "image/webp", VARIANT_QUALITY);
        if (!variantBlob) continue;
        variants.push({
          file: new File([variantBlob], `image-${variantWidth}.webp`, { type: "image/webp" }),
          width: variantWidth,
          height: variantHeight,
        });
      }
      return { ...main, variants };
    });
  } catch {
    return { file, variants: [] };
  }
}

function randomSuffix(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().slice(0, 8);
  }
  return String(Math.floor(Math.random() * 1e8));
}

/** A stored upload: key, intrinsic size, and responsive variants. */
export interface UploadedImage {
  key: string;
  width?: number;
  height?: number;
  /**
   * Responsive variants including the stored original as the largest entry
   * (when dimensions are known). Empty when decoding failed: callers then
   * render from the original `src` alone.
   */
  variants: { width: number; key: string }[];
}

/** Saves an uploaded image; returns its storage key, size and variants. */
export async function putImage(
  file: File,
  idFallback = "img",
  options: { maxEdge?: number } = {},
): Promise<UploadedImage> {
  validateImageFile(file);
  if (!isSupabaseConfigured()) {
    throw new Error("Image uploads are not connected yet.");
  }
  const optimized = await optimizeImageFile(file, options.maxEdge ?? IMAGE_MAX_EDGE);
  const key = `${idFallback}-${randomSuffix()}.${extensionFor(optimized.file)}`;
  const storage = getSupabaseBrowser().storage.from(BUCKET);
  // Cache-busting is inherent: each upload gets a unique key, so a long-lived
  // immutable cache never serves a stale/replaced image.
  const { error } = await storage.upload(key, optimized.file, {
    contentType: optimized.file.type,
    upsert: false,
    cacheControl: "31536000",
  });
  if (error) {
    throw new Error("The image could not be uploaded. Check your connection and try again.");
  }

  // The frontend derives `srcset` from the deterministic variant names, so a
  // partial variant set must never be recorded: any failure rolls the upload
  // back (variants + original) and the admin can retry.
  const variants: { width: number; key: string }[] = [];
  if (optimized.width) variants.push({ width: optimized.width, key });
  const base = key.replace(/\.[^.]+$/, "");
  const uploadedVariantKeys: string[] = [];
  for (const variant of optimized.variants) {
    const variantKey = `${base}-${variant.width}.webp`;
    const { error: variantError } = await storage.upload(variantKey, variant.file, {
      contentType: "image/webp",
      upsert: false,
      cacheControl: "31536000",
    });
    if (variantError) {
      await storage.remove([...uploadedVariantKeys, key]).catch(() => undefined);
      throw new Error("The image could not be uploaded. Check your connection and try again.");
    }
    uploadedVariantKeys.push(variantKey);
    variants.push({ width: variant.width, key: variantKey });
  }
  variants.sort((a, b) => a.width - b.width);
  return { key, width: optimized.width, height: optimized.height, variants };
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
    // Page-level images store their variant list; module images do not, so
    // derive the deterministic variant names to avoid orphaned renditions.
    const variants = record.variants;
    if (Array.isArray(variants)) {
      for (const variant of variants) {
        if (
          variant &&
          typeof variant === "object" &&
          typeof (variant as { key?: unknown }).key === "string"
        ) {
          into.add((variant as { key: string }).key);
        }
      }
    }
    if (!/-\d+\.webp$/i.test(record.key) && /\.(jpe?g|png|webp)$/i.test(record.key)) {
      const base = record.key.replace(/\.[^.]+$/, "");
      for (const width of IMAGE_VARIANT_WIDTHS) into.add(`${base}-${width}.webp`);
    }
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
