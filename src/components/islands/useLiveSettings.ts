// Live site-settings hook for chrome islands (DEC-033).
//
// Footer panels, brand names and the Messenger button share one
// page_contents(settings) channel (via the registry) and select their own
// fields, so settings edits patch every page's chrome without a refresh.
import type { SiteSettingsContent } from "../../lib/cms/types";
import { fetchPageContent } from "../../lib/realtime/fetchers";
import { useLiveDoc } from "./useLiveSync";

export function useLiveSettings(initial: SiteSettingsContent): SiteSettingsContent {
  return useLiveDoc("page_contents", "settings", initial, async () => {
    const content = (await fetchPageContent("settings")) as SiteSettingsContent | null;
    return content ?? initial;
  });
}
