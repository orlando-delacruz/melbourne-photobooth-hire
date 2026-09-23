// CmsEcho: applies saved CMS module state to the public pages after first
// paint (DEC-018). SSR HTML renders the build-time module snapshot so content
// stays crawlable; the echo then hides non-highlighted items, applies the
// data-driven package badge treatment and swaps in uploaded images. With no
// saved edits the pass is a no-op.

import { useEffect } from "react";
import { cmsRepository } from "../../lib/cms/repository";
import { getImageUrl } from "../../lib/cms/images";
import { BADGE_LABELS } from "../../lib/cms/types";

const STAR_SVG = `<svg class="card-badge-star" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>`;

interface EchoEntry {
  highlight: boolean;
  badge: string;
  featured: boolean;
  imageKey: string | null;
  imageSrc: string;
}

function renderBadge(card: HTMLElement, badge: string, featured: boolean): void {
  const wrap = card.querySelector<HTMLElement>(".card-badge");
  if (!badge) {
    if (wrap) wrap.style.display = "none";
    card.classList.remove("card--featured");
    return;
  }
  if (!wrap) return;
  wrap.style.display = "";
  const label = wrap.querySelector("span");
  if (label) label.textContent = badge;
  const existing = wrap.querySelector(".card-badge-star");
  if (featured && !existing) {
    wrap.insertAdjacentHTML("afterbegin", STAR_SVG);
  } else if (!featured && existing) {
    existing.remove();
  }
  card.classList.toggle("card--featured", featured);
}

export default function CmsEcho({ page }: { page: string }) {
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const content = await cmsRepository.load();
        if (!live) return;

        const byId = new Map<string, EchoEntry>();
        for (const item of content.modules.services) {
          byId.set(item.id, {
            highlight: item.highlight,
            badge: item.badge ?? "",
            featured: false,
            imageKey: item.image.key,
            imageSrc: item.image.src,
          });
        }
        for (const item of content.modules.packages) {
          byId.set(item.id, {
            highlight: item.highlight,
            badge:
              item.badgeType === "custom"
                ? item.customBadge
                : item.badgeType === "none"
                  ? ""
                  : BADGE_LABELS[item.badgeType],
            featured: item.badgeType === "most-popular",
            imageKey: item.image.key,
            imageSrc: item.image.src,
          });
        }
        for (const item of content.modules.gallery) {
          byId.set(item.id, {
            highlight: item.highlight,
            badge: "",
            featured: false,
            imageKey: item.image.key,
            imageSrc: item.image.src,
          });
        }
        for (const item of content.modules.faqs) {
          byId.set(item.id, {
            highlight: item.highlight,
            badge: "",
            featured: false,
            imageKey: null,
            imageSrc: "",
          });
        }

        const nodes = document.querySelectorAll<HTMLElement>("[data-cms-id]");
        nodes.forEach((el) => {
          const entry = byId.get(el.dataset.cmsId ?? "");
          if (!entry || !live) return;
          el.style.display = entry.highlight ? "" : "none";
          if (!entry.highlight) return;
          if (el.classList.contains("card")) {
            renderBadge(el, entry.badge, entry.featured);
          }
          const img = el.querySelector("img");
          if (!img) return;
          if (entry.imageKey) {
            getImageUrl(entry.imageKey)
              .then((url) => {
                if (live && img.getAttribute("src") !== url) img.setAttribute("src", url);
              })
              .catch(() => {
                // Stored image missing: keep the rendered fallback.
              });
          } else if (entry.imageSrc && img.getAttribute("src") !== entry.imageSrc) {
            img.setAttribute("src", entry.imageSrc);
          }
        });
      } catch {
        // Best-effort enhancement: SSR content stays as rendered.
      }
    })();
    return () => {
      live = false;
    };
  }, [page]);

  return null;
}
