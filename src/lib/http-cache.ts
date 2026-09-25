// HTTP cache policy (DEC-028).
//
// Public pages are server-rendered from live Supabase data with edge CDN
// caching: visitors get a fast cached copy (freshness window below) while
// Vercel revalidates in the background. No rebuilds, no deploy hooks.
// Admin pages, login and API routes must never be cached.

const PUBLIC_FRESH_SECONDS = 60;
const PUBLIC_STALE_SECONDS = 300;

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
