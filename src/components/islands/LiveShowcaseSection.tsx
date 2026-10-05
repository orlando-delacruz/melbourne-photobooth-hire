// Live homepage gallery showcase strip (DEC-033).
// Mirrors the index.astro showcase section including its hide-when-empty
// rule, so an emptied gallery removes the whole section without a refresh.
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem, HomePageContent } from "../../lib/cms/types";
import { fetchGallery } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import LiveButton from "../live/LiveButton";
import LiveGalleryFigure from "../live/LiveGalleryFigure";
import LiveSectionHeading from "../live/LiveSectionHeading";
import Reveal from "./Reveal";
import { useLiveHomeSlice } from "./useLiveHome";
import { useLiveRows } from "./useLiveSync";

export interface LiveShowcaseSectionProps {
  initial: GalleryItem[];
  initialHome: Pick<HomePageContent, "showcaseHeading" | "showcaseLabel">;
}

/** Items per carousel page on mobile. Desktop keeps the full grid. */
const MOBILE_PER_PAGE = 2;

export default function LiveShowcaseSection({ initial, initialHome }: LiveShowcaseSectionProps) {
  const gallery = useLiveRows("gallery_items", initial, fetchGallery);
  const home = useLiveHomeSlice(initialHome);
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Carousel behaviour is mobile-only and CSS-gated at the same breakpoint,
  // so SSR and desktop render the plain grid with no hydration mismatch.
  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const sync = () => {
      setIsMobile(query.matches);
      setPage(0);
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const heading = home.showcaseHeading;
  const showcaseLabel = home.showcaseLabel;
  const visible = gallery.filter((item) => item.highlight !== false);
  const pageCount = Math.max(1, Math.ceil(visible.length / MOBILE_PER_PAGE));

  // A realtime shrink must never leave the carousel past the last page.
  useEffect(() => {
    if (page > pageCount - 1) setPage(pageCount - 1);
  }, [page, pageCount]);

  if (visible.length === 0) return null;
  const showNav = isMobile && pageCount > 1;

  return (
    <section className="section" aria-labelledby="showcase-heading">
      <Reveal variant="mask">
        <LiveSectionHeading
          tone="light"
          title={heading.title}
          eyebrow={heading.eyebrow}
          id="showcase-heading"
          lede={heading.lede}
        />
        <div className="showcase-carousel">
          <ul
            className="showcase-grid showcase-track"
            style={isMobile ? { transform: `translateX(-${page * 100}%)` } : undefined}
            aria-roledescription={isMobile ? "carousel" : undefined}
            aria-label={isMobile ? "Event photo carousel" : undefined}
          >
            {visible.map((item, index) => (
              <li
                key={item.id}
                aria-roledescription={isMobile ? "slide" : undefined}
                aria-label={isMobile ? `${index + 1} of ${visible.length}` : undefined}
              >
                <Reveal delay={index * 0.07} variant="blur">
                  <LiveGalleryFigure
                    id={item.id}
                    src={item.image.src}
                    alt={item.image.alt}
                    caption={item.caption}
                    figureClass="showcase-item"
                    alwaysCaption
                  />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
        {showNav ? (
          <div className="showcase-nav">
            <button
              type="button"
              className="button button--secondary"
              disabled={page === 0}
              aria-label="Previous photos"
              onClick={() => setPage((current) => Math.max(0, current - 1))}
            >
              <ChevronLeft size={16} aria-hidden="true" />
              <span>Previous</span>
            </button>
            <button
              type="button"
              className="button button--secondary"
              disabled={page >= pageCount - 1}
              aria-label="Next photos"
              onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
            >
              <span>Next</span>
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        ) : null}
        <p className="showcase-cta">
          <LiveButton href="/gallery" variant="secondary" tone="light" arrow>
            {showcaseLabel}
          </LiveButton>
        </p>
      </Reveal>
    </section>
  );
}
