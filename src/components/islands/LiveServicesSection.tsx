// Live homepage services grid (DEC-033).
//
// Owns the services section: SSR initial rows render first paint, then the
// shared services channel patches the grid (create/update/delete,
// highlight toggles, badges, images) with no refresh. Markup mirrors
// index.astro class-for-class; styles come from styles/live.css.
import { serviceBadgeText } from "../../lib/cms/types";
import type { HomePageContent, ServiceItem } from "../../lib/cms/types";
import { fetchServices } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import LiveCard from "../live/LiveCard";
import LiveSectionHeading from "../live/LiveSectionHeading";
import Reveal from "./Reveal";
import { useLiveHome } from "./useLiveHome";
import { useLiveRows } from "./useLiveSync";

export interface LiveServicesSectionProps {
  initial: ServiceItem[];
  initialHome: HomePageContent;
}

export default function LiveServicesSection({ initial, initialHome }: LiveServicesSectionProps) {
  const services = useLiveRows("services", initial, fetchServices);
  const home = useLiveHome(initialHome);
  const heading = home.servicesHeading;
  const cardLabel = home.servicesCardLabel;
  const visible = services.filter((service) => service.highlight !== false);

  return (
    <section className="section on-dark" aria-labelledby="services-heading">
      <LiveSectionHeading
        tone="dark"
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
              tone="dark"
              title={service.name}
              badge={serviceBadgeText(service)}
              featured={service.badgeType === "most-popular"}
              icon={service.icon}
              tagline={service.tagline}
              description={service.summary}
              highlights={service.highlights}
              imageSrc={service.image.src || undefined}
              imageAlt={service.image.alt || service.name}
              href="/services"
              ctaLabel={cardLabel}
              cmsId={service.id}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
