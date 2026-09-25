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
export default defineConfig({
  site: "https://melbournephotoboothhire.com.au",
  trailingSlash: "never",
  // Static-first with server capability (DEC-024): Astro 7 treats "static"
  // as hybrid by default, so every page stays prerendered on Vercel Hobby
  // except future src/pages/api/* routes, which run as serverless functions.
  // This keeps function invocations at zero until the inquiry endpoint lands.
  adapter: vercel(),
  integrations: [react(), sitemap({ filter: (page) => !page.includes("/admin") })],
});
