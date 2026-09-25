// Live contact aside (DEC-033).
//
// Mirrors the contact.astro aside: next-steps from the contact blob, fact
// rows (blob labels, live service-area statement from settings, blob reply
// value) and the settings social list. SocialIcon rendering matches the
// page exactly (label keyword, generic fallback).
import type { ContactContent, SiteSettingsContent } from "../../lib/cms/types";
import { fetchPageContent } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import LiveSocialIcon from "../live/LiveSocialIcon";
import { useLiveDoc } from "./useLiveSync";

export interface LiveContactAsideProps {
  initialPage: ContactContent;
  initialSettings: SiteSettingsContent;
}

export default function LiveContactAside({ initialPage, initialSettings }: LiveContactAsideProps) {
  const contactPage = useLiveDoc("page_contents", "contact", initialPage, async () => {
    const content = (await fetchPageContent("contact")) as ContactContent | null;
    return content ?? initialPage;
  });
  const settings = useLiveDoc("page_contents", "settings", initialSettings, async () => {
    const content = (await fetchPageContent("settings")) as SiteSettingsContent | null;
    return content ?? initialSettings;
  });
  const socials = settings.socials ?? [];

  return (
    <aside className="contact-aside">
      <h2 id="contact-next">{contactPage.asideHeading}</h2>
      <ol className="next-steps">
        {contactPage.steps.map((step, index) => (
          <li key={`${step.title}-${index}`}>
            <span className="next-num" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="next-body">
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      <dl className="aside-facts">
        <div className="aside-fact">
          <dt>{contactPage.serviceAreaLabel}</dt>
          <dd>{settings.serviceAreaStatement}</dd>
        </div>
        <div className="aside-fact">
          <dt>{contactPage.typicalReplyLabel}</dt>
          <dd>{contactPage.typicalReplyValue}</dd>
        </div>
      </dl>
      {socials.length > 0 ? (
        <div className="aside-social">
          <h2 className="aside-social-heading">Follow</h2>
          <ul className="aside-social-list">
            {socials.map((social) => (
              <li key={social.url}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Melbourne Photobooth Hire on ${social.label} (opens in a new tab)`}
                >
                  <LiveSocialIcon label={social.label} />
                  <span>{social.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
