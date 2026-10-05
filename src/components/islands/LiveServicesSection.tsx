// Live homepage services grid (DEC-033).
//
// Owns the services section: SSR initial rows render first paint, then the
// shared services channel patches the grid (create/update/delete,
// highlight toggles, badges, images) with no refresh. Markup mirrors
// index.astro class-for-class; styles come from styles/live.css.
import { serviceBadgeText } from "../../lib/cms/types";
import type { HomePageContent, ServiceItem } from "../../lib/cms/types";
import { imageSrcSet } from "../../lib/images";
import { fetchServices } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import LiveCard from "../live/LiveCard";
import LiveSectionHeading from "../live/LiveSectionHeading";
import Reveal from "./Reveal";
import { useLiveHomeSlice } from "./useLiveHome";
import { useLiveRows } from "./useLiveSync";

export interface LiveServicesSectionProps {
  initial: ServiceItem[];
  initialHome: Pick<HomePageContent, "servicesHeading">;
}

export default function LiveServicesSection({ initial, initialHome }: LiveServicesSectionProps) {
  const services = useLiveRows("services", initial, fetchServices);
  const home = useLiveHomeSlice(initialHome);
  const heading = home.servicesHeading;
  const visible = services.filter((service) => service.highlight !== false);

  // Homepage cards stay scannable: the first four highlights tease the
  // list; the Services page renders every highlight for each booth.
  const previewHighlights = (service: ServiceItem): string[] => service.highlights.slice(0, 4);

  return (
    <section className="section" aria-labelledby="services-heading">
      <LiveSectionHeading
        tone="light"
        title={heading.title}
        eyebrow={heading.eyebrow}
        id="services-heading"
        lede={heading.lede}
        size="lg"
      />
      <div className="booths-grid">
        {visible.map((service, index) => (
          <Reveal key={service.id} delay={index * 0.08}>
            <LiveCard
              tone="light"
              title={service.name}
              badge={serviceBadgeText(service)}
              featured={service.badgeType === "most-popular"}
              icon={service.icon}
              tagline={service.tagline}
              description={service.summary}
              highlights={previewHighlights(service)}
              imageSrc={service.image.src || undefined}
              imageAlt={service.image.alt || service.name}
              imageSrcSet={imageSrcSet(service.image)}
              imageWidth={service.image.width}
              imageHeight={service.image.height}
              href={`/contact?service=${encodeURIComponent(service.id)}`}
              ctaLabel="Book Now"
              cmsId={service.id}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
