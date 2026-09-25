// Live homepage testimonials marquee (DEC-033, DEC-034).
//
// Mirrors ReviewsMarquee.astro (dark tone on the homepage): heading,
// seamless-loop clone track, initials avatars and star ratings. Rows come
// from the Testimonials module and patch live; the heading still comes from
// the home blob. Hides the whole section while the list is empty, same as SSR.
import type { HomePageContent, TestimonialItem } from "../../lib/cms/types";
import { fetchTestimonials } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import LiveSectionHeading from "../live/LiveSectionHeading";
import Reveal from "./Reveal";
import { useLiveHome } from "./useLiveHome";
import { useLiveRows } from "./useLiveSync";

const STAR_PATH =
  "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z";

function starSvg(): string {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${STAR_PATH}"/></svg>`;
}

const QUOTE_SVG =
  '<svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M5.5 6C3.6 7.3 2.5 9.2 2.5 11.6c0 2.2 1.3 3.9 3.2 4.6.2 1.5-.6 2.6-2.2 3.5l1 1.7c3-1.3 4.9-3.9 4.9-7.3V6H5.5Zm11 0c-1.9 1.3-3 3.2-3 5.6 0 2.2 1.3 3.9 3.2 4.6.2 1.5-.6 2.6-2.2 3.5l1 1.7c3-1.3 4.9-3.9 4.9-7.3V6h-4.9Z"/></svg>';

function initials(name: string): string {
  return name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function stars(rating: number | undefined): string {
  if (!rating) return "";
  return Array.from({ length: Math.max(0, Math.min(5, Math.round(rating))) })
    .map(() => starSvg())
    .join("");
}

export default function LiveMarquee({
  initial,
  initialHome,
}: {
  initial: TestimonialItem[];
  initialHome: HomePageContent;
}) {
  const testimonials = useLiveRows("testimonials", initial, fetchTestimonials);
  const home = useLiveHome(initialHome);
  if (testimonials.length === 0) return null;
  const heading = home.reviewsHeading;

  const card = (item: (typeof testimonials)[number], clone: boolean) => (
    <li
      key={`${item.id}${clone ? "-clone" : ""}`}
      className={clone ? "rm-card rm-card--clone" : "rm-card"}
      aria-hidden={clone || undefined}
    >
      <span
        className="rm-quote"
        aria-hidden={clone ? undefined : true}
        dangerouslySetInnerHTML={{ __html: QUOTE_SVG }}
      />
      {item.rating ? (
        <span
          className="rm-stars"
          role={clone ? undefined : "img"}
          aria-label={clone ? undefined : `Rated ${item.rating} out of 5`}
          dangerouslySetInnerHTML={{ __html: stars(item.rating) }}
        />
      ) : null}
      <blockquote className="rm-text">{item.quote}</blockquote>
      <footer className="rm-author">
        <span className="rm-avatar" aria-hidden={clone ? undefined : true}>
          {initials(item.name)}
        </span>
        <span className="rm-author-body">
          <strong className="rm-name">{item.name}</strong>
          <span className="rm-event">{item.eventType}</span>
        </span>
      </footer>
    </li>
  );

  return (
    <section className="section on-dark reviews" aria-labelledby="reviews-heading">
      <Reveal variant="mask">
        <div className="reviews-marquee reviews-marquee--dark">
          <LiveSectionHeading
            tone="dark"
            size="lg"
            title={heading.title}
            eyebrow={heading.eyebrow}
            lede={heading.lede}
            id="reviews-heading"
          />
          <div
            className="rm-viewport"
            tabIndex={0}
            role="group"
            aria-label="Customer reviews (focus pauses scrolling)"
          >
            <ul className="rm-track">
              {testimonials.map((item) => card(item, false))}
              {testimonials.map((item) => card(item, true))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
