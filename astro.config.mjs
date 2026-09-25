import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

// The production domain is confirmed for deployment (DEC-016); `site` is the
// single source for canonical URLs, Open Graph URLs and the sitemap.
//
// The sitemap filter keeps admin routes out of the public sitemap: admin
// pages are disallowed in public/robots.txt and carry noindex meta tags,
// so they must never be submitted for indexing (DEC-017).
//
// Public pages are server-rendered (DEC-028), so they are listed explicitly:
// the sitemap integration only discovers prerendered routes on its own.
const PUBLIC_SITEMAP_URLS = [
  "https://melbournephotoboothhire.com.au/",
  "https://melbournephotoboothhire.com.au/services",
  "https://melbournephotoboothhire.com.au/packages",
  "https://melbournephotoboothhire.com.au/gallery",
  "https://melbournephotoboothhire.com.au/about",
  "https://melbournephotoboothhire.com.au/faq",
  "https://melbournephotoboothhire.com.au/contact",
  "https://melbournephotoboothhire.com.au/privacy",
  "https://melbournephotoboothhire.com.au/terms",
];
export default defineConfig({
  site: "https://melbournephotoboothhire.com.au",
  trailingSlash: "never",
  // Server-rendered on Vercel (DEC-028): public pages read live Supabase data
  // per request with edge SWR caching; admin/API routes are also server-side.
  // No page is prerendered; function runs stay minimal via CDN caching.
  adapter: vercel(),
  integrations: [
    react(),
    sitemap({ customPages: PUBLIC_SITEMAP_URLS, filter: (page) => !page.includes("/admin") }),
  ],
});
