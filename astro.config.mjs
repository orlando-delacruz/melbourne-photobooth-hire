import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// The production domain is confirmed for deployment (DEC-016); `site` is the
// single source for canonical URLs, Open Graph URLs and the sitemap.
export default defineConfig({
  site: "https://melbournephotoboothhire.com.au",
  trailingSlash: "never",
  integrations: [react(), sitemap()],
});
