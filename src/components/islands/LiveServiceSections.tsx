// Live services page sections (DEC-033).
//
// Mirrors the services.astro .services loop class-for-class: alternating
// media/body cells, positional index numerals, badges, highlights, dual
// CTAs. No highlight filter (the page renders every RLS-visible row, same
// as SSR). Image alts fall back to the service name exactly like the
// serviceImages map in lib/content/cmsSource.ts.
import { serviceBadgeText } from "../../lib/cms/types";
import type { ServiceItem } from "../../lib/cms/types";
import { fetchServices } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import { CHECK_SVG_INNER, cardIconSvg } from "../live/icons";
import LiveButton from "../live/LiveButton";
import Reveal from "./Reveal";
import { useLiveRows } from "./useLiveSync";

function checkSvg(): string {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CHECK_SVG_INNER}</svg>`;
}

export default function LiveServiceSections({ initial }: { initial: ServiceItem[] }) {
  const services = useLiveRows("services", initial, fetchServices);

  return (
    <div className="services">
      {services.map((service, index) => (
        <section
          key={service.id}
          className={`service section${service.badgeType === "most-popular" ? " service--featured" : ""}`}
          id={service.id}
          aria-labelledby={`service-${service.id}`}
          data-cms-id={service.id}
          data-cms-featured={service.badgeType === "most-popular" ? "true" : undefined}
        >
          <Reveal className="service-cell service-cell--media" variant="blur">
            <div className="service-media">
              {service.image.src ? (
                <img
                  src={service.image.src}
                  alt={service.image.alt || service.name}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              ) : null}
              <span
                className="service-media-badge"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: cardIconSvg(service.icon, 24) }}
              />
            </div>
          </Reveal>
          <Reveal className="service-cell service-cell--body" delay={0.08}>
            <div className="service-body">
              <p className="service-kicker">
                <span className="service-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="service-kicker-rule" aria-hidden="true" />
                <span className="service-badge">{serviceBadgeText(service)}</span>
              </p>
              <h2 id={`service-${service.id}`}>{service.name}</h2>
              {service.tagline ? <p className="service-tagline">{service.tagline}</p> : null}
              <p className="service-summary">{service.summary}</p>
              {service.highlights && service.highlights.length > 0 ? (
                <ul className="service-highlights">
                  {service.highlights.map((item) => (
                    <li key={item}>
                      <span
                        className="service-check"
                        dangerouslySetInnerHTML={{ __html: checkSvg() }}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="service-cta">
                <LiveButton href="/contact" variant="primary" size="lg" arrow>
                  Enquire now
                </LiveButton>
                <LiveButton href="/packages" variant="secondary" size="lg">
                  View packages
                </LiveButton>
              </p>
            </div>
          </Reveal>
        </section>
      ))}
    </div>
  );
}
