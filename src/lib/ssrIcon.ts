// Server-only icon rendering for static Astro sections.
//
// The CMS icon set and the trust-strip glyphs are defined as React/Lucide
// components. Static (non-hydrated) Astro sections still need the same
// artwork, so this helper renders those components to static SVG markup on the
// server. It never reaches the client bundle — importing `react-dom/server`
// here only adds to the SSR graph, not to any public page's JavaScript.

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { LucideIcon } from "lucide-react";
import CmsIcon from "../components/live/CmsIcon";

/** Render a CMS icon key to static SVG markup (empty for blank/unknown keys). */
export function cmsIconMarkup(name?: string, size = 18): string {
  if (!name) return "";
  return renderToStaticMarkup(createElement(CmsIcon, { name, size }));
}

/** Render a Lucide icon component to static SVG markup. */
export function lucideMarkup(Icon: LucideIcon, size = 16): string {
  return renderToStaticMarkup(createElement(Icon, { size }));
}
