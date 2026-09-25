// Live gallery page grid (DEC-033).
//
// Mirrors gallery.astro: the empty-state branch (live copy) versus the
// captioned grid. No highlight filter — the page renders every
// RLS-visible row, same as SSR. The DOM-sourced GalleryLightbox keeps
// working on re-rendered anchors with no extra wiring.
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

export default function LiveGallerySection({ initial, emptyState }: LiveGallerySectionProps) {
  const gallery = useLiveRows("gallery_items", initial, fetchGallery);

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
        {gallery.map((item, index) => (
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
    </section>
  );
}
