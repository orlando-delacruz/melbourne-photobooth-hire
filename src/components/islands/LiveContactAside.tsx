// Live contact aside (DEC-033).
//
// Owns the contact page's information panel: business facts from the contact
// blob and site settings (service area, phones, ABN, transport, reply time)
// plus the settings social list. Rendered as a dark "event noir" panel that
// balances the light form card; human labels stay CMS-driven, only the icon
// scaffolding and panel chrome are presentation.
import { BadgeCheck, Clock, MapPin, Phone, Truck } from "lucide-react";
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
  const phones = [settings.phonePrimary, settings.phoneSecondary].filter((phone): phone is string =>
    Boolean(phone && phone.trim()),
  );

  return (
    <aside className="contact-aside">
      <div className="contact-aside__glow" aria-hidden="true" />
      <dl className="aside-facts">
        <div className="aside-fact">
          <dt className="aside-fact__label">
            <span className="aside-fact__icon" aria-hidden="true">
              <MapPin size={16} />
            </span>
            {contactPage.serviceAreaLabel}
          </dt>
          <dd>{settings.serviceAreaStatement}</dd>
        </div>
        {phones.length > 0 ? (
          <div className="aside-fact">
            <dt className="aside-fact__label">
              <span className="aside-fact__icon" aria-hidden="true">
                <Phone size={16} />
              </span>
              Phone
            </dt>
            <dd>
              {phones.map((phone, index) => (
                <span key={phone}>
                  {index > 0 ? " · " : null}
                  <a href={`tel:${phone.replace(/[\s()]/g, "")}`}>{phone}</a>
                </span>
              ))}
            </dd>
          </div>
        ) : null}
        {settings.abn ? (
          <div className="aside-fact">
            <dt className="aside-fact__label">
              <span className="aside-fact__icon" aria-hidden="true">
                <BadgeCheck size={16} />
              </span>
              ABN
            </dt>
            <dd>{settings.abn}</dd>
          </div>
        ) : null}
        {settings.transportNote ? (
          <div className="aside-fact">
            <dt className="aside-fact__label">
              <span className="aside-fact__icon" aria-hidden="true">
                <Truck size={16} />
              </span>
              Transport
            </dt>
            <dd>{settings.transportNote}</dd>
          </div>
        ) : null}
        <div className="aside-fact">
          <dt className="aside-fact__label">
            <span className="aside-fact__icon" aria-hidden="true">
              <Clock size={16} />
            </span>
            {contactPage.typicalReplyLabel}
          </dt>
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
