// Live brand name text (DEC-033).
//
// Renders only the name string inside the header/footer brand rows, which
// keep their static shells and mark artwork. Inherits surrounding styles.
import type { SiteSettingsContent } from "../../lib/cms/types";
import { useLiveSettings } from "./useLiveSettings";

export default function LiveBrandName({
  initialSettings,
}: {
  initialSettings: SiteSettingsContent;
}) {
  const settings = useLiveSettings(initialSettings);
  return <>{settings.brandName}</>;
}
