// Live website logo (Site Wide Settings).
//
// Renders the CMS logo when one is set; renders nothing otherwise so the
// static brand mark and name in the header/footer remain the fallback. The
// consuming brand shells hide the fallback via :has(.brand-logo), and the
// settings subscription keeps the logo live.
import type { SiteSettingsContent } from "../../lib/cms/types";
import { useLiveSettings } from "./useLiveSettings";

export default function LiveBrandLogo({
  initialSettings,
}: {
  initialSettings: SiteSettingsContent;
}) {
  const settings = useLiveSettings(initialSettings);
  const logo = settings.logo;
  if (!logo || !logo.src) return null;
  return <img className="brand-logo" src={logo.src} alt={logo.alt || settings.brandName} />;
}
