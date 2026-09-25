// Live about page regions (DEC-033).
//
// Story, stats, values and next-step blocks with live copy from the about
// blob (plus live service-area statement from settings for the next-step
// line). The story image derives from the Gallery/Services modules exactly
// like SSR (first highlighted gallery image, else the premium service
// image), so image changes propagate too. Icons match SSR: positional
// stats glyphs, per-id value glyphs with the craft fallback.
import type {
  AboutPageContent,
  GalleryItem,
  ServiceItem,
  SiteSettingsContent,
} from "../../lib/cms/types";
import { fetchGallery, fetchPageContent, fetchServices } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import LiveButton from "../live/LiveButton";
import LiveSectionHeading from "../live/LiveSectionHeading";
import Reveal from "./Reveal";
import { useLiveDoc, useLiveRows } from "./useLiveSync";

function svgWrap(inner: string, size = 20): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

const STAT_ICONS = [
  svgWrap(
    '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  ),
  svgWrap('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),
  svgWrap(
    '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h7v7h-7z"/>',
  ),
  svgWrap('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
];

const VALUE_ICONS: Record<string, string> = {
  craft:
    '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
  reliability:
    '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  hospitality:
    '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
};

function valueIconSvg(id: string): string {
  return svgWrap(VALUE_ICONS[id] ?? VALUE_ICONS.craft, 22);
}

export interface LiveAboutSectionsProps {
  initialPage: AboutPageContent;
  initialSettings: SiteSettingsContent;
  initialGallery: GalleryItem[];
  initialServices: ServiceItem[];
}

export default function LiveAboutSections({
  initialPage,
  initialSettings,
  initialGallery,
  initialServices,
}: LiveAboutSectionsProps) {
  const page = useLiveDoc("page_contents", "about", initialPage, async () => {
    const content = (await fetchPageContent("about")) as AboutPageContent | null;
    return content ?? initialPage;
  });
  const settings = useLiveDoc("page_contents", "settings", initialSettings, async () => {
    const content = (await fetchPageContent("settings")) as SiteSettingsContent | null;
    return content ?? initialSettings;
  });
  const gallery = useLiveRows("gallery_items", initialGallery, fetchGallery);
  const services = useLiveRows("services", initialServices, fetchServices);

  const highlightedGallery = gallery.filter((item) => item.highlight !== false);
  const premium = services.find((service) => service.id === "premium-photobooth");
  const storyImage = highlightedGallery[0]
    ? { src: highlightedGallery[0].image.src, alt: highlightedGallery[0].image.alt }
    : premium
      ? { src: premium.image.src, alt: premium.image.alt || premium.name }
      : null;

  return (
    <>
      <section className="section story" aria-labelledby="story-heading">
        <Reveal className="story-copy-col" variant="rise">
          <div className="story-copy">
            <p className="eyebrow eyebrow--rule">{page.storyEyebrow}</p>
            <h2 id="story-heading">{page.storyHeading}</h2>
            <div className="prose">
              {page.story.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
              ))}
            </div>
          </div>
        </Reveal>
        {storyImage ? (
          <Reveal delay={0.08} className="story-media" variant="blur">
            <figure className="story-figure">
              <img src={storyImage.src} alt={storyImage.alt} loading="lazy" decoding="async" />
            </figure>
          </Reveal>
        ) : null}
      </section>

      <section className="stats bleed on-dark" aria-label="At a glance">
        <div className="container">
          <dl className="stats-grid">
            {page.stats.map((stat, index) => (
              <div className="stat" key={`${stat.value}-${stat.label}`}>
                <dt className="stat-value">
                  <span
                    className="stat-icon"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: STAT_ICONS[index] ?? STAT_ICONS[0] }}
                  />
                  <span>{stat.value}</span>
                </dt>
                <dd className="stat-label">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section" aria-labelledby="values-heading">
        <LiveSectionHeading
          eyebrow={page.valuesHeading.eyebrow}
          id="values-heading"
          title={page.valuesHeading.title}
          lede={page.valuesHeading.lede}
          size="lg"
        />
        <div className="values">
          {page.values.map((value, index) => (
            <Reveal key={value.id} delay={index * 0.06} variant="scale">
              <article className="value">
                <div className="value-head">
                  <span
                    className="value-icon"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: valueIconSvg(value.id) }}
                  />
                  <span className="value-num" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3>{value.title}</h3>
                <p>{value.detail}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="about-next">
        <div className="about-next">
          <div>
            <h2 id="about-next">{page.next.heading}</h2>
            <p>
              {settings.serviceAreaStatement} {page.next.suffix}
            </p>
          </div>
          <p className="about-next-ctas">
            <LiveButton href="/services" variant="secondary" size="lg" arrow>
              {page.next.servicesLabel}
            </LiveButton>
            <LiveButton href="/contact" variant="primary" size="lg" arrow>
              {page.next.enquireLabel}
            </LiveButton>
          </p>
        </div>
      </section>
    </>
  );
}
