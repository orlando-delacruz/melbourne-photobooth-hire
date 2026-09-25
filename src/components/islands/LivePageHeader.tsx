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

export interface LivePageHeaderProps {
  pageKey: string;
  initial: Pick<PageHeaderContent, "title" | "eyebrow" | "lede">;
  imageSrc?: string;
  imageAlt?: string;
  rule?: boolean;
  children?: ReactNode;
}

export default function LivePageHeader({
  pageKey,
  initial,
  imageSrc,
  imageAlt,
  rule = true,
  children,
}: LivePageHeaderProps) {
  const header = useLiveDoc("page_contents", pageKey, initial, async () => {
    const next = await fetchPageHeader(pageKey);
    return next ?? initial;
  });

  return (
    <header className="page-header bleed on-dark">
      {imageSrc ? (
        <>
          <div
            className="page-header__media"
            style={{ backgroundImage: `url('${imageSrc}')` }}
            aria-hidden="true"
          />
          {imageAlt ? <span className="sr-only">{imageAlt}</span> : null}
        </>
      ) : null}
      <div className="page-header__glow" aria-hidden="true" />
      <div className="container page-header__inner">
        {header.eyebrow ? (
          <p className={`eyebrow${rule ? " eyebrow--rule" : ""}`}>{header.eyebrow}</p>
        ) : null}
        <h1>{header.title}</h1>
        {header.lede ? <p className="lede">{header.lede}</p> : null}
        {children}
      </div>
    </header>
  );
}
