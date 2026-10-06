// Card markup mirror for live islands (DEC-033).
// Class-for-class copy of Card.astro (article.card + card--tone/featured,
// media, head, title, tagline, meta, price split, description, highlights,
// inclusions with check glyphs, CTA button). Styles from styles/live.css.
import LiveButton from "./LiveButton";
import CmsIcon from "./CmsIcon";
import type { PackageCardBadge } from "../../lib/cms/types";
import type { CmsIconName } from "../../lib/cms/icons";

export type LiveCardIcon = CmsIconName;

/** Image badges overlaying the card's top-right corner.
 * Right-sized WebP (rendered 84px desktop, 112px mobile) with 2x for retina.
 * PNG originals kept on disk unreferenced as fallback history. */
const CARD_BADGE_IMAGES: Record<
  Exclude<PackageCardBadge, "none">,
  { src: string; srcSet: string; sizes: string; width: number; height: number; alt: string }
> = {
  "best-seller": {
    src: "/images/best-seller-224.webp",
    srcSet: "/images/best-seller-112.webp 112w, /images/best-seller-224.webp 224w",
    sizes: "(max-width: 639px) 112px, 84px",
    width: 112,
    height: 112,
    alt: "Best seller",
  },
  "top-rated": {
    src: "/images/top-rated-224.webp",
    srcSet: "/images/top-rated-112.webp 112w, /images/top-rated-224.webp 224w",
    sizes: "(max-width: 639px) 112px, 84px",
    width: 112,
    height: 100,
    alt: "Top rated",
  },
};

export interface LiveCardProps {
  title: string;
  description?: string;
  meta?: string;
  price?: string;
  badge?: string;
  tagline?: string;
  icon?: LiveCardIcon;
  items?: string[];
  highlights?: string[];
  href?: string;
  ctaLabel?: string;
  /** Optional secondary text link rendered beside the primary CTA (internal
   * linking: card → related page without weakening the booking action). */
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Accessible name for the secondary link; falls back to its visible label. */
  secondaryAriaLabel?: string;
  imageSrc?: string;
  imageAlt?: string;
  /** Responsive `srcset` from the CMS variants; omitted for legacy images. */
  imageSrcSet?: string;
  imageWidth?: number;
  imageHeight?: number;
  tone?: "light" | "dark";
  featured?: boolean;
  /** Image badge shown in the card's top-right corner. */
  cardBadge?: PackageCardBadge;
  cmsId?: string;
}

const STAR_SVG =
  '<svg class="card-badge-star" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>';

const CHECK_SVG = (
  <svg
    className="card-check"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);

export default function LiveCard({
  title,
  description,
  meta,
  price,
  badge,
  tagline,
  icon,
  items = [],
  highlights = [],
  href,
  ctaLabel,
  secondaryHref,
  secondaryLabel,
  secondaryAriaLabel,
  imageSrc,
  imageAlt,
  imageSrcSet,
  imageWidth,
  imageHeight,
  tone = "light",
  featured = false,
  cardBadge = "none",
  cmsId,
}: LiveCardProps) {
  const priceParts = price ? price.trim().split(/\s+/) : [];
  const priceAmount = priceParts[0] ?? "";
  const priceSuffix = priceParts.slice(1).join(" ");
  return (
    <article
      className={`card card--${tone}${featured ? " card--featured" : ""}`}
      data-cms-id={cmsId}
    >
      {cardBadge !== "none" ? (
        <img
          className="card-ribbon"
          src={CARD_BADGE_IMAGES[cardBadge].src}
          srcSet={CARD_BADGE_IMAGES[cardBadge].srcSet}
          sizes={CARD_BADGE_IMAGES[cardBadge].sizes}
          width={CARD_BADGE_IMAGES[cardBadge].width}
          height={CARD_BADGE_IMAGES[cardBadge].height}
          alt={CARD_BADGE_IMAGES[cardBadge].alt}
          loading="lazy"
          decoding="async"
        />
      ) : null}
      {imageSrc ? (
        <div className="card-media">
          <img
            className="card-image"
            src={imageSrc}
            srcSet={imageSrcSet}
            sizes={imageSrcSet ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" : undefined}
            alt={imageAlt ?? ""}
            width={imageWidth}
            height={imageHeight}
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}
      <div className="card-body">
        {icon || badge ? (
          <div className="card-head">
            {icon ? (
              <span className="card-icon">
                <CmsIcon name={icon} size={20} />
              </span>
            ) : null}
            {badge ? (
              <p className="card-badge">
                {featured ? (
                  <span
                    dangerouslySetInnerHTML={{ __html: STAR_SVG }}
                    style={{ display: "inline-flex" }}
                  />
                ) : null}
                <span>{badge}</span>
              </p>
            ) : null}
          </div>
        ) : null}
        <h3 className="card-title">{title}</h3>
        {tagline ? <p className="card-tagline">{tagline}</p> : null}
        {meta ? <p className="card-meta">{meta}</p> : null}
        {price ? (
          <p className="card-price">
            <span className="card-price-amount">{priceAmount}</span>
            {priceSuffix ? <span className="card-price-suffix">{priceSuffix}</span> : null}
          </p>
        ) : null}
        {description ? <p className="card-description">{description}</p> : null}
        {highlights.length > 0 ? (
          <ul className="card-list card-highlights">
            {highlights.map((item, index) => (
              <li key={`${index}-${item}`}>{item}</li>
            ))}
          </ul>
        ) : null}
        {items.length > 0 ? (
          <ul className="card-list card-inclusions">
            {items.map((item, index) => (
              <li key={`${index}-${item}`}>
                {CHECK_SVG}
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {href && ctaLabel ? (
          <p className="card-cta">
            <LiveButton href={href} variant="primary" tone={featured ? "dark" : tone} arrow>
              {ctaLabel}
            </LiveButton>
            {secondaryHref && secondaryLabel ? (
              <a
                className="card-secondary"
                href={secondaryHref}
                aria-label={secondaryAriaLabel || secondaryLabel}
              >
                {secondaryLabel}
              </a>
            ) : null}
          </p>
        ) : null}
      </div>
    </article>
  );
}
