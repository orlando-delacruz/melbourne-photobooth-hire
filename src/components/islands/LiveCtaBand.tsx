// Live CTA band (DEC-033).
//
// Mirrors CtaBand.astro with live eyebrow/headline/lede/labels from the
// page blob. Hrefs stay code-owned (unchanged from SSR). The band image
// follows the blob with the SSR fallback preserved.
import type { CtaBandContent } from "../../lib/cms/types";
import { fetchCtaBand } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import LiveButton from "../live/LiveButton";
import { useLiveDoc } from "./useLiveSync";

export interface LiveCtaBandProps {
  pageKey: string;
  initial: CtaBandContent;
  id?: string;
  primaryHref: string;
  secondaryHref?: string;
  fallbackImageSrc?: string;
  fallbackImageAlt?: string;
}

export default function LiveCtaBand({
  pageKey,
  initial,
  id,
  primaryHref,
  secondaryHref,
  fallbackImageSrc,
  fallbackImageAlt,
}: LiveCtaBandProps) {
  const band = useLiveDoc("page_contents", pageKey, initial, async () => {
    const next = await fetchCtaBand(pageKey);
    return next ?? initial;
  });

  const imageSrc = band.image.src || fallbackImageSrc;
  const imageAlt = band.image.alt || fallbackImageAlt;

  return (
    <section className="cta-band bleed on-dark" aria-labelledby={id}>
      {imageSrc ? (
        <div
          className="cta-band__media"
          style={{ backgroundImage: `url('${imageSrc}')` }}
          aria-hidden="true"
        />
      ) : null}
      <div className="cta-band__scrim" aria-hidden="true" />
      {imageSrc && imageAlt ? <span className="sr-only">{imageAlt}</span> : null}
      <div className="container cta-band__inner">
        {band.eyebrow ? <p className="eyebrow eyebrow--rule">{band.eyebrow}</p> : null}
        <h2 id={id}>{band.headline}</h2>
        {band.lede ? <p className="cta-band__lede">{band.lede}</p> : null}
        <p className="cta-band__buttons">
          <LiveButton href={primaryHref} variant="primary" tone="dark" size="lg" arrow>
            {band.primaryLabel}
          </LiveButton>
          {secondaryHref && band.secondaryLabel ? (
            <LiveButton href={secondaryHref} variant="secondary" tone="dark" size="lg">
              {band.secondaryLabel}
            </LiveButton>
          ) : null}
        </p>
      </div>
    </section>
  );
}
