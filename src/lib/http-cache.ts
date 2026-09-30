// HTTP cache policy (DEC-028, extended by the performance pass).
//
// Public pages are server-rendered from live Supabase data with edge CDN
// caching: visitors get a fast cached copy (freshness window below) while
// Vercel revalidates in the background. No rebuilds, no deploy hooks.
// Admin pages, login and API routes must never be cached.
//
// The freshness window is deliberately short enough that a brand-new visitor
// can only ever be a few minutes behind, while already-open pages are patched
// live via Realtime (DEC-033) regardless of the cache. Widening it from the
// original 60s/300s materially raises the edge hit rate (lower TTFB → lower
// LCP) for a content set that changes only when the client edits the CMS.

const PUBLIC_FRESH_SECONDS = 300;
const PUBLIC_STALE_SECONDS = 3600;

/** Cache public responses at the edge; revalidate in the background. */
export function setPublicCache(headers: Headers): void {
  headers.set(
    "Cache-Control",
    `public, s-maxage=${PUBLIC_FRESH_SECONDS}, stale-while-revalidate=${PUBLIC_STALE_SECONDS}`,
  );
}

/** Never cache privileged or mutating responses. */
export function setNoStore(headers: Headers): void {
  headers.set("Cache-Control", "no-store");
}
