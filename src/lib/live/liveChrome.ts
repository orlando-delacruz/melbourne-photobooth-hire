// Vanilla live-chrome runtime (DEC-050).
//
// The public chrome (header brand, footer panels, floating Messenger, homepage
// hero and trust ticker) is server-rendered static markup, so no React loads
// for it. Live updates are delivered without React:
//
//   * a debounced realtime event triggers a fresh server render of the current
//     URL (cache-busted) and the matching `[data-live-section]` nodes are
//     swapped in place. Reusing the SSR markup keeps live output byte-for-byte
//     identical to a normal load and needs no per-field DOM patching.
//   * SEO metadata is patched for the current tab only (never for crawlers).
//
// Everything is an enhancement: if realtime or the fetch fails, the
// server-rendered content simply stays. Realtime is gated on first user
// interaction by the shared channel registry, so this costs nothing on the
// initial load.

import { subscribeTable } from "../realtime/channels";
import { fetchPageSeoRow } from "../realtime/fetchers";
import type { PageMeta } from "../cms/types";

const DEBOUNCE_MS = 350;
const SECTION_SELECTOR = "[data-live-section]";

let refreshTimer: number | undefined;
let refreshing = false;
let pending = false;

function swapSections(fresh: Document): void {
  for (const node of document.querySelectorAll<HTMLElement>(SECTION_SELECTOR)) {
    const key = node.dataset.liveSection;
    if (!key) continue;
    const next = fresh.querySelector<HTMLElement>(`[data-live-section="${key}"]`);
    if (next) node.outerHTML = next.outerHTML;
  }
}

async function refreshSections(): Promise<void> {
  if (refreshing) {
    pending = true;
    return;
  }
  refreshing = true;
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("live", String(Date.now()));
    const response = await fetch(url.toString(), { cache: "no-store" });
    if (!response.ok) return;
    const fresh = new DOMParser().parseFromString(await response.text(), "text/html");
    swapSections(fresh);
  } catch {
    // Keep the current server-rendered content.
  } finally {
    refreshing = false;
    if (pending) {
      pending = false;
      void refreshSections();
    }
  }
}

function scheduleSectionRefresh(): void {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => {
    void refreshSections();
  }, DEBOUNCE_MS);
}

function upsertMeta(attribute: "name" | "property", key: string, content: string): void {
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function applySeo(seo: PageMeta): void {
  if (seo.seoTitle) {
    document.title = seo.seoTitle;
    upsertMeta("property", "og:title", seo.ogTitle || seo.seoTitle);
  }
  if (seo.seoDescription) {
    upsertMeta("name", "description", seo.seoDescription);
    upsertMeta("property", "og:description", seo.ogDescription || seo.seoDescription);
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

let seoTimer: number | undefined;

async function refreshSeo(): Promise<void> {
  const key = document.documentElement.dataset.seoPage;
  if (!key) return;
  try {
    const seo = await fetchPageSeoRow(key);
    if (seo) applySeo(seo);
  } catch {
    // Keep the current metadata.
  }
}

function scheduleSeoRefresh(): void {
  window.clearTimeout(seoTimer);
  seoTimer = window.setTimeout(() => {
    void refreshSeo();
  }, DEBOUNCE_MS);
}

/** Start live section + SEO patching. Subscriptions are visual no-ops on the server. */
export function initLiveChrome(): void {
  subscribeTable("page_contents", scheduleSectionRefresh);
  subscribeTable("event_types", scheduleSectionRefresh);
  subscribeTable("page_seo", scheduleSeoRefresh);
}
