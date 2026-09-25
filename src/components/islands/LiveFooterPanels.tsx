// Live footer panels (DEC-033).
//
// Brand statement, review link, social Follow block, CTA block and base
// row with live copy from Site Settings. Mounted as separate small islands
// inside the static footer shell so each keeps its layout position.
// Styles come from styles/live.css.
import type { SiteSettingsContent } from "../../lib/cms/types";
import { ENQUIRY_HREF } from "../../lib/navigation";
import "../../styles/live.css";
import LiveButton from "../live/LiveButton";
import LiveSocialIcon from "../live/LiveSocialIcon";
import { useLiveSettings } from "./useLiveSettings";

export interface LiveFooterPanelsProps {
  initialSettings: SiteSettingsContent;
}

export function LiveFooterBrand({ initialSettings }: LiveFooterPanelsProps) {
  const settings = useLiveSettings(initialSettings);
  const socials = settings.socials ?? [];
  return (
    <>
      <p className="brand-statement">{settings.serviceAreaStatement}</p>
      {settings.reviewUrl ? (
        <p className="footer-review">
          <a href={settings.reviewUrl}>Leave a Google review</a>
        </p>
      ) : null}
      {socials.length > 0 ? (
        <div className="footer-social">
          <h2>Follow</h2>
          <ul>
            {socials.map((social) => (
              <li key={social.url}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${settings.brandName} on ${social.label} (opens in a new tab)`}
                >
                  <LiveSocialIcon label={social.label} />
                  <span>{social.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}

export function LiveFooterCta({ initialSettings }: LiveFooterPanelsProps) {
  const settings = useLiveSettings(initialSettings);
  return (
    <>
      <h2>{settings.footerCta.title}</h2>
      <p>{settings.footerCta.lede}</p>
      <LiveButton href={ENQUIRY_HREF} variant="primary" tone="dark" size="lg" arrow>
        {settings.footerCta.label}
      </LiveButton>
    </>
  );
}

export function LiveFooterBase({ initialSettings }: LiveFooterPanelsProps) {
  const settings = useLiveSettings(initialSettings);
  const year = new Date().getFullYear();
  return (
    <>
      <p className="footer-copy">
        &copy; {year} {settings.brandName}. All rights reserved.
      </p>
      <p className="footer-area">{settings.serviceAreaStatement}</p>
    </>
  );
}
