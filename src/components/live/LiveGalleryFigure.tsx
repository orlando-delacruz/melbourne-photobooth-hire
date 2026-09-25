// Gallery figure mirror for live islands (DEC-033).
// Matches GalleryTrigger.astro (anchor + eye glyph + sr-only label) inside
// the page figure wrappers. The DOM-sourced GalleryLightbox island keeps
// working: it harvests data-lightbox anchors at click time, so re-rendered
// items lightbox with zero extra wiring. Styles from styles/live.css.
const EYE_SVG = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export interface LiveGalleryFigureProps {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  /** Figure wrapper class: "showcase-item" (home) or "gallery-item" (gallery page). */
  figureClass: "showcase-item" | "gallery-item";
  showCaption?: boolean;
  /** Homepage showcase renders figcaption unconditionally (even when empty). */
  alwaysCaption?: boolean;
}

export default function LiveGalleryFigure({
  id,
  src,
  alt,
  caption,
  figureClass,
  showCaption = true,
  alwaysCaption = false,
}: LiveGalleryFigureProps) {
  const showFigcaption = showCaption && (alwaysCaption || !!caption);
  return (
    <figure className={figureClass} data-cms-id={id}>
      <a
        className="gallery-trigger"
        href={src}
        data-lightbox
        data-full={src}
        data-caption={caption}
      >
        <img src={src} alt={alt} loading="lazy" decoding="async" />
        <span className="gallery-trigger-view" aria-hidden="true">
          {EYE_SVG}
        </span>
        <span className="sr-only">View full size</span>
      </a>
      {showFigcaption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
