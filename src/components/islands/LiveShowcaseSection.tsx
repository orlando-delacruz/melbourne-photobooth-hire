// Live homepage gallery showcase strip (DEC-033).
// Mirrors the index.astro showcase section including its hide-when-empty
// rule, so an emptied gallery removes the whole section without a refresh.
import type { GalleryItem, HomePageContent } from "../../lib/cms/types";
import { fetchGallery } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import LiveButton from "../live/LiveButton";
import LiveGalleryFigure from "../live/LiveGalleryFigure";
import LiveSectionHeading from "../live/LiveSectionHeading";
import Reveal from "./Reveal";
import { useLiveHome } from "./useLiveHome";
import { useLiveRows } from "./useLiveSync";

export interface LiveShowcaseSectionProps {
  initial: GalleryItem[];
  initialHome: HomePageContent;
}

export default function LiveShowcaseSection({ initial, initialHome }: LiveShowcaseSectionProps) {
  const gallery = useLiveRows("gallery_items", initial, fetchGallery);
  const home = useLiveHome(initialHome);
  const heading = home.showcaseHeading;
  const showcaseLabel = home.showcaseLabel;
  const visible = gallery.filter((item) => item.highlight !== false);
  if (visible.length === 0) return null;

  return (
    <section className="section on-dark" aria-labelledby="showcase-heading">
      <Reveal variant="mask">
        <div className="showcase-head">
          <LiveSectionHeading
            tone="dark"
            title={heading.title}
            eyebrow={heading.eyebrow}
            id="showcase-heading"
            lede={heading.lede}
          />
          <p className="showcase-cta">
            <LiveButton href="/gallery" variant="secondary" tone="dark" arrow>
              {showcaseLabel}
            </LiveButton>
          </p>
        </div>
        <ul className="showcase-grid">
          {visible.map((item, index) => (
            <li key={item.id}>
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
      </Reveal>
    </section>
  );
}
