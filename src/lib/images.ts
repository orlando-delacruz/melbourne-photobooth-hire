// Responsive image helpers (Phase 1B.6).
//
// Variants are pre-generated at upload (and backfilled for existing media) and
// stored on the image record, with the stored original as the largest entry.
// When a record has no variants (legacy image or failed generation) the
// helpers return nothing and the renderer falls back to the plain `src`.
import type { CmsImage, CmsImageVariant } from "./cms/types";

type ImageLike = Pick<CmsImage, "src"> & { variants?: CmsImageVariant[] };

/** Supabase Storage public path for CMS uploads. */
const MEDIA_MARKER = "/storage/v1/object/public/cms-media/";
/** Variant widths generated at upload when smaller than the original. */
const DERIVED_WIDTHS = [320, 640, 1024, 1280] as const;

/**
 * Intrinsic width recorded on the stored URL as a fragment (`...#w=1200`).
 * The fragment is never sent to the server; it exists only so the renderer
 * can build an accurate `srcset` without database changes.
 */
function storedWidth(src: string): number | undefined {
  const match = /[#?&]w=(\d+)/.exec(src);
  if (!match) return undefined;
  const width = Number(match[1]);
  return Number.isFinite(width) && width > 0 ? width : undefined;
}

function joinSrcSet(entries: { width: number; src: string }[]): string {
  return [...entries]
    .sort((a, b) => a.width - b.width)
    .map((entry) => `${entry.src} ${entry.width}w`)
    .join(", ");
}

/** `img-abc.jpg` → `img-abc-640.webp` (query/hash stripped). */
function derivedVariantSrc(src: string, width: number): string | undefined {
  const clean = src.split(/[?#]/)[0];
  const dot = clean.lastIndexOf(".");
  if (dot <= 0) return undefined;
  return `${clean.slice(0, dot)}-${width}.webp`;
}

/**
 * `srcset` for an image. Explicit variant metadata (page-level CMS images) is
 * used when present; module images store only their original URL, so the
 * deterministic variant naming is used instead. Returns nothing for images
 * without variants (external/Pexels URLs, legacy records), so the renderer
 * falls back to the plain `src`.
 */
export function imageSrcSet(image: ImageLike | null | undefined): string | undefined {
  const src = image?.src;
  if (!src) return undefined;

  const explicit = image?.variants?.filter((variant) => variant.width > 0 && variant.src) ?? [];
  if (explicit.length >= 2) return joinSrcSet(explicit);

  const isVariantFile = /-\d+\.webp$/i.test(src.split(/[?#]/)[0]);
  if (!src.includes(MEDIA_MARKER) || isVariantFile) return undefined;
  const originalWidth = storedWidth(src);
  if (!originalWidth) return undefined;
  const derived: { width: number; src: string }[] = [];
  for (const width of DERIVED_WIDTHS) {
    if (width >= originalWidth) continue;
    const variantSrc = derivedVariantSrc(src, width);
    if (variantSrc) derived.push({ width, src: variantSrc });
  }
  if (derived.length === 0) return undefined;
  return joinSrcSet([...derived, { width: originalWidth, src: src.split(/[?#]/)[0] }]);
}
