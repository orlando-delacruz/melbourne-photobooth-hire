import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// `site` and sitemap integration follow once the production domain is
// client-confirmed (see docs/DEPLOYMENT.md).
export default defineConfig({
  integrations: [react()],
});
