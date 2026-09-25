// Live document metadata (DEC-033).
//
// Subscribes to the page_seo row for the current page and patches the open
// tab's title, description, OG title/description and canonical without a
// refresh. Renders nothing. Explicit non-claim: this updates the visitor's
// browser only and never affects search-engine crawling or indexing.
import { useEffect } from "react";
import type { PageMeta } from "../../lib/cms/types";
import { fetchPageSeoRow } from "../../lib/realtime/fetchers";
import { subscribeTable } from "../../lib/realtime/channels";

function upsertMetaByName(name: string, content: string): void {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertMetaByProperty(property: string, content: string): void {
  let tag = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function applySeo(seo: PageMeta): void {
  if (seo.seoTitle) {
    document.title = seo.seoTitle;
    upsertMetaByProperty("og:title", seo.ogTitle || seo.seoTitle);
  }
  if (seo.seoDescription) {
    upsertMetaByName("description", seo.seoDescription);
    upsertMetaByProperty("og:description", seo.ogDescription || seo.seoDescription);
  }
  if (seo.canonicalUrl) {
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", seo.canonicalUrl);
  }
}

export default function SeoLive({ pageKey }: { pageKey: string }) {
  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    const unsubscribe = subscribeTable("page_seo", () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        void (async () => {
          try {
            const next = await fetchPageSeoRow(pageKey);
            if (!cancelled && next) applySeo(next);
          } catch {
            // Keep current metadata; the next event retries.
          }
        })();
      }, 350);
    });
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, [pageKey]);

  return null;
}
