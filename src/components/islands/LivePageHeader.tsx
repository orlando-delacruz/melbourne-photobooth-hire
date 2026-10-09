// Live page header (DEC-033).
//
// Mirrors PageHeader.astro (media, glow, eyebrow rule, h1, lede) with live
// title/eyebrow/lede from the page blob. The header image stays the SSR
// prop (CMS has no per-header image field beyond the blob image, which the
// page passes through). Jump-nav children (e.g. LiveServiceJump) nest
// inside and hydrate independently.
import type { ReactNode } from "react";
import type { PageHeaderContent } from "../../lib/cms/types";
import { fetchPageHeader } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import { useLiveDoc } from "./useLiveSync";

export interface LivePageHeaderCrumb {
  href: string;
  label: string;
}

export interface LivePageHeaderProps {
  pageKey: string;
  initial: Pick<PageHeaderContent, "title" | "eyebrow" | "lede">;
  /** Descriptive H1 used when the CMS title is still empty (SEO Track 1:
      booth/legal blobs seed empty so no empty H1 is ever published). */
  fallbackTitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  /** Responsive `srcset` for the header/LCP image; omitted for legacy images. */
  imageSrcSet?: string;
  imageWidth?: number;
  imageHeight?: number;
  rule?: boolean;
  /** Breadcrumb trail rendered inside the header, above the eyebrow. */
  breadcrumbs?: LivePageHeaderCrumb[];
  children?: ReactNode;
}

export default function LivePageHeader({
  pageKey,
  initial,
  fallbackTitle,
  imageSrc,
  imageAlt,
  imageSrcSet,
  imageWidth,
  imageHeight,
  rule = true,
  breadcrumbs,
  children,
}: LivePageHeaderProps) {
  const header = useLiveDoc("page_contents", pageKey, initial, async () => {
    const next = await fetchPageHeader(pageKey);
    return next ?? initial;
  });
  const title = header.title.trim() || fallbackTitle || "";

  return (
    <header className="page-header bleed">
      {imageSrc ? (
        <>
          <img
            className="page-header__media"
            src={imageSrc}
            srcSet={imageSrcSet}
            sizes={imageSrcSet ? "100vw" : undefined}
            alt=""
            width={imageWidth ?? 1600}
            height={imageHeight ?? 900}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            aria-hidden="true"
          />
          {imageAlt ? <span className="sr-only">{imageAlt}</span> : null}
        </>
      ) : null}
      <div className="page-header__glow" aria-hidden="true" />
      <div className="container page-header__inner">
        {breadcrumbs && breadcrumbs.length > 1 ? (
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
              {breadcrumbs.map((item, index) => (
                <li key={item.href}>
                  {index > 0 ? (
                    <span className="breadcrumbs-sep" aria-hidden="true">
                      ›
                    </span>
                  ) : null}
                  {index < breadcrumbs.length - 1 ? (
                    <a href={item.href}>{item.label}</a>
                  ) : (
                    <span aria-current="page">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        {header.eyebrow ? (
          <p className={`eyebrow${rule ? " eyebrow--rule" : ""}`}>{header.eyebrow}</p>
        ) : null}
        <h1>{title}</h1>
        {header.lede ? <p className="lede">{header.lede}</p> : null}
        {children}
      </div>
    </header>
  );
}
