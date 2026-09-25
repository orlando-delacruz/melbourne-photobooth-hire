// Live home-blob hook for homepage islands (DEC-033).
//
// Every homepage island shares one page_contents channel (via the registry)
// and selects its own copy slice, so headings, labels and prose patch
// without a refresh while staying consistent with each other.
import type { HomePageContent } from "../../lib/cms/types";
import { fetchPageContent } from "../../lib/realtime/fetchers";
import { useLiveDoc } from "./useLiveSync";

export function useLiveHome(initial: HomePageContent): HomePageContent {
  return useLiveDoc("page_contents", "home", initial, async () => {
    const content = (await fetchPageContent("home")) as HomePageContent | null;
    return content ?? initial;
  });
}
