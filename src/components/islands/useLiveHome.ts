// Live home-blob hook for homepage islands (DEC-033, Phase 1B).
//
// Every homepage island shares one page_contents channel (via the registry)
// and selects its own copy slice, so headings, labels and prose patch
// without a refresh while staying consistent with each other.
//
// Islands receive only the fields they render (`Pick<HomePageContent, ...>`)
// instead of the whole home blob: the serialized astro-island props stay
// small, and a realtime update still replaces the slice with the full,
// freshly fetched home document.
import type { HomePageContent } from "../../lib/cms/types";
import { fetchPageContent } from "../../lib/realtime/fetchers";
import { useLiveDoc } from "./useLiveSync";

/** Live slice of the home document: seed with only the keys the island uses. */
export function useLiveHomeSlice<K extends keyof HomePageContent>(
  initial: Pick<HomePageContent, K>,
): Pick<HomePageContent, K> {
  return useLiveDoc("page_contents", "home", initial, async () => {
    const content = (await fetchPageContent("home")) as HomePageContent | null;
    return content ?? initial;
  });
}
