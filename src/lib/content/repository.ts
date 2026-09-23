import type { SiteContent } from "./types";
import { mockContent } from "./mock";
import { buildSiteContent } from "./cmsSource";

/**
 * The single seam for website content. Callers depend only on this interface;
 * the CMS-backed adapter below is swapped for the Supabase adapter in Phase 3
 * without touching any page or component.
 */
export interface ContentSource {
  load(): SiteContent;
}

/** Built from the CMS modules: reusable items are the source of truth. */
const cmsSeedSource: ContentSource = {
  load: () => buildSiteContent(),
};

/** The pre-module snapshot, kept for reference only. */
export const mockSource: ContentSource = {
  load: () => mockContent,
};

/** Returns the full content snapshot. Accepts the source so tests can substitute a stub. */
export function getContent(source: ContentSource = cmsSeedSource): SiteContent {
  return source.load();
}
