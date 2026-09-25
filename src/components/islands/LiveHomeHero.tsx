// Live homepage hero (DEC-033).
//
// Mirrors Hero.astro with live eyebrow/headline/supporting/labels,
// background and stats from the home blob. Entrance choreography (Reveal
// mode="mount" beats) matches SSR. Background swaps are pure CSS, so image
// changes crossfade without cache concerns.
import type { HeroContent } from "../../lib/cms/types";
import { fetchPageContent } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import { cardIconSvg } from "../live/icons";
import LiveButton from "../live/LiveButton";
import Reveal from "./Reveal";
import { useLiveDoc } from "./useLiveSync";

export interface LiveHomeHeroProps {
  initial: HeroContent;
  fallbackBackgroundSrc?: string;
  fallbackBackgroundAlt?: string;
}

function statIcon(name: string | undefined): string {
  if (name === "camera" || name === "clock" || name === "qrcode") return cardIconSvg(name, 18);
  return "";
}

export default function LiveHomeHero({
  initial,
  fallbackBackgroundSrc,
  fallbackBackgroundAlt,
}: LiveHomeHeroProps) {
  const hero = useLiveDoc("page_contents", "home", initial, async () => {
    const content = (await fetchPageContent("home")) as { hero?: HeroContent } | null;
    return content?.hero ?? initial;
  });

  const eyebrow = hero.eyebrow || "Melbourne photobooth hire for every event";
  const backgroundSrc = hero.background.src || fallbackBackgroundSrc;
  const backgroundAlt = hero.background.alt || fallbackBackgroundAlt;

  return (
    <section className="hero on-dark" aria-labelledby="page-title">
      {backgroundSrc ? (
        <div
          className="hero-bg"
          style={{ backgroundImage: `url('${backgroundSrc}')` }}
          aria-hidden="true"
        />
      ) : null}
      <div className="hero-veil" aria-hidden="true" />
      <div className="hero-inner">
        {backgroundAlt ? <span className="sr-only">{backgroundAlt}</span> : null}
        <div className="container">
          <div className="hero-copy">
            <Reveal mode="mount" delay={0.05}>
              <p className="hero-eyebrow eyebrow eyebrow--rule">{eyebrow}</p>
            </Reveal>
            <Reveal mode="mount" delay={0.14}>
              <h1 id="page-title" className="hero-headline">
                {hero.headline}
              </h1>
            </Reveal>
            <Reveal mode="mount" delay={0.24}>
              <p className="hero-lede">{hero.supporting}</p>
            </Reveal>
            <Reveal mode="mount" delay={0.33}>
              <p className="hero-ctas">
                <LiveButton href="/contact" variant="primary" tone="dark" size="lg" arrow>
                  {hero.primaryLabel}
                </LiveButton>
                {hero.secondaryLabel ? (
                  <LiveButton href="/packages" variant="secondary" tone="dark" size="lg">
                    {hero.secondaryLabel}
                  </LiveButton>
                ) : null}
              </p>
            </Reveal>
            {hero.stats.length > 0 ? (
              <Reveal mode="mount" delay={0.42}>
                <dl className="hero-stats">
                  {hero.stats.map((stat) => (
                    <div className="hero-stat" key={`${stat.value}-${stat.label}`}>
                      <dt
                        className="hero-stat-value"
                        dangerouslySetInnerHTML={{
                          __html: `${stat.icon ? statIcon(stat.icon) : ""}${stat.value}`,
                        }}
                      />
                      <dd className="hero-stat-label">{stat.label}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ) : null}
          </div>
        </div>
      </div>
      <a className="hero-scroll" href="#services-heading">
        <span className="sr-only">Scroll to our booths</span>
        <span className="hero-scroll-line" aria-hidden="true" />
      </a>
    </section>
  );
}
