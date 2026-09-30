// Live gallery page grid (DEC-033).
//
// Mirrors gallery.astro: the empty-state branch (live copy) versus the
// captioned grid. No highlight filter — the page renders every
// RLS-visible row, same as SSR. The DOM-sourced GalleryLightbox keeps
// working on re-rendered anchors with no extra wiring.
import { useEffect, useRef, useState } from "react";
import type { EmptyStateContent, GalleryItem } from "../../lib/cms/types";
import { fetchGallery } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import LiveButton from "../live/LiveButton";
import LiveGalleryFigure from "../live/LiveGalleryFigure";
import Reveal from "./Reveal";
import { useLiveRows } from "./useLiveSync";

export interface LiveGallerySectionProps {
  initial: GalleryItem[];
  emptyState: EmptyStateContent;
}

/**
 * Initial batch (and each View More step): 8 on desktop, 9 on mobile, so the
 * first screen lands on whole rows of the 3/4-column grids. Rows are cheap;
 * images stay lazy.
 */
const DESKTOP_PAGE_SIZE = 8;
const MOBILE_PAGE_SIZE = 9;

export default function LiveGallerySection({ initial, emptyState }: LiveGallerySectionProps) {
  const gallery = useLiveRows("gallery_items", initial, fetchGallery);
  const [pageSize, setPageSize] = useState(DESKTOP_PAGE_SIZE);
  const [shown, setShown] = useState(DESKTOP_PAGE_SIZE);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const remainingRef = useRef(0);

  // Match the initial batch to the viewport after hydration (SSR renders the
  // desktop size; mobile expands by one image). Later breakpoint changes only
  // affect the size of subsequent View More steps, never the visible count.
  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const applyPageSize = () => {
      const next = query.matches ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;
      setPageSize(next);
      return next;
    };
    setShown(applyPageSize());
    query.addEventListener("change", applyPageSize);
    return () => query.removeEventListener("change", applyPageSize);
  }, []);

  // Realtime updates replace the whole list: keep the visitor's progress and
  // only clamp down if the gallery itself shrank.
  useEffect(() => {
    if (shown > gallery.length) setShown(gallery.length);
  }, [gallery.length, shown]);

  // When the last batch exhausts the list, the button unmounts — move focus
  // to the status line so keyboard users do not lose their place.
  const remaining = gallery.length - shown;
  useEffect(() => {
    if (remainingRef.current > 0 && remaining === 0) statusRef.current?.focus();
    remainingRef.current = remaining;
  });

  const rendered = gallery.slice(0, shown);
  const paged = gallery.length > pageSize;

  if (gallery.length === 0) {
    return (
      <div className="empty-state section">
        <h2>{emptyState.title}</h2>
        <p>{emptyState.body}</p>
        <LiveButton href="/contact" variant="primary" size="lg" arrow>
          {emptyState.actionLabel}
        </LiveButton>
      </div>
    );
  }

  return (
    <section className="section" aria-label="Event gallery">
      <ul className="gallery-grid">
        {rendered.map((item, index) => (
          <li key={item.id}>
            <Reveal delay={Math.min(index, 5) * 0.05} variant="blur">
              <LiveGalleryFigure
                id={item.id}
                src={item.image.src}
                alt={item.image.alt}
                caption={item.caption}
                figureClass="gallery-item"
              />
            </Reveal>
          </li>
        ))}
      </ul>
      {paged ? (
        <>
          <p className="gallery-status" aria-live="polite" ref={statusRef} tabIndex={-1}>
            Showing {rendered.length} of {gallery.length} photos
          </p>
          {remaining > 0 ? (
            <p className="gallery-more">
              <button
                type="button"
                className="button button--secondary button--lg"
                onClick={() => setShown((count) => count + pageSize)}
              >
                View more ({remaining} more)
              </button>
            </p>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
