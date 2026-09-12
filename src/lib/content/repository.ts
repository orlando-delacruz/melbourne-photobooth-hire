import type { SiteContent } from "./types";
import { mockContent } from "./mock";

/**
 * The single seam for website content. Callers depend only on this interface;
 * the mock adapter below is swapped for the Supabase adapter in Phase 3
 * without touching any page or component.
 */
export interface ContentSource {
  load(): SiteContent;
}

const mockSource: ContentSource = {
  load: () => mockContent,
};

/** Returns the full content snapshot. Accepts the source so tests can substitute a stub. */
export function getContent(source: ContentSource = mockSource): SiteContent {
  return source.load();
}
