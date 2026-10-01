// On-demand mount for the review modal (DEC-050).
//
// Imported dynamically from the page's click loader, so React + react-dom and
// the review form only download when a visitor actually opens the modal.
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import ReviewModal from "./ReviewModal";

export interface ReviewMountConfig {
  eventTypes?: string[];
  turnstileSiteKey?: string;
}

export function mountReview(config: ReviewMountConfig, trigger?: HTMLElement | null): void {
  const host = document.createElement("div");
  host.setAttribute("data-review-host", "");
  document.body.appendChild(host);
  createRoot(host).render(
    createElement(ReviewModal, {
      eventTypes: config.eventTypes ?? [],
      turnstileSiteKey: config.turnstileSiteKey,
      initialTrigger: trigger ?? undefined,
    }),
  );
}
