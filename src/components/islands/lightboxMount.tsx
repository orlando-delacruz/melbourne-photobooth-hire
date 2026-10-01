// On-demand mount for the gallery lightbox (DEC-050).
//
// Imported dynamically from the page's click loader, so React + react-dom and
// the lightbox only download when a visitor opens an image.
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import GalleryLightbox from "./GalleryLightbox";

export function mountLightbox(anchor?: HTMLAnchorElement | null): void {
  const host = document.createElement("div");
  host.setAttribute("data-lightbox-host", "");
  document.body.appendChild(host);
  createRoot(host).render(createElement(GalleryLightbox, { initialAnchor: anchor ?? undefined }));
}
