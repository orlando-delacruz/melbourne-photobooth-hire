import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

// The production domain is confirmed as the www host (Phase 0 remediation,
// DEC-052); `site` is the single source for canonical URLs, Open Graph URLs
// and the sitemap. The non-www host redirects to www at the Vercel/DNS layer.
//
// The sitemap filter keeps admin routes out of the public sitemap: admin
// pages are disallowed in public/robots.txt and carry noindex meta tags,
// so they must never be submitted for indexing (DEC-017).
//
// Public pages are server-rendered (DEC-028), so they are listed explicitly:
// the sitemap integration only discovers prerendered routes on its own.
const PUBLIC_SITEMAP_URLS = [
  "https://www.melbournephotoboothhire.com.au/",
  "https://www.melbournephotoboothhire.com.au/services",
  "https://www.melbournephotoboothhire.com.au/premium-photobooth-melbourne",
  "https://www.melbournephotoboothhire.com.au/roaming-photobooth-melbourne",
  "https://www.melbournephotoboothhire.com.au/360-video-booth-melbourne",
  "https://www.melbournephotoboothhire.com.au/packages",
  "https://www.melbournephotoboothhire.com.au/gallery",
  "https://www.melbournephotoboothhire.com.au/about",
  "https://www.melbournephotoboothhire.com.au/faq",
  "https://www.melbournephotoboothhire.com.au/contact",
  "https://www.melbournephotoboothhire.com.au/privacy",
  "https://www.melbournephotoboothhire.com.au/terms",
];
export default defineConfig({
  site: "https://www.melbournephotoboothhire.com.au",
  trailingSlash: "never",
  // Server-rendered on Vercel (DEC-028): public pages read live Supabase data
  // per request with edge SWR caching; admin/API routes are also server-side.
  // No page is prerendered; function runs stay minimal via CDN caching.
  //
  // Inline the stylesheets (DEC-048): the public CSS is small (~15 KB gzip)
  // and shipping it as two render-blocking <link> requests delayed FCP/LCP on
  // mobile. Inlining removes both from the critical path.
  build: { inlineStylesheets: "always" },
  adapter: vercel(),
  integrations: [
    react(),
    sitemap({ customPages: PUBLIC_SITEMAP_URLS, filter: (page) => !page.includes("/admin") }),
  ],
});
