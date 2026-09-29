// Live homepage trust ticker (business facts, single row).
//
// Service area, phone links, ABN/insurance badges and event types from Site
// Settings and the Event Types module, looped as one seamless track (same
// clone-track recipe as the reviews marquee). Clones are aria-hidden and
// render phones as plain text so no focusable link hides inside hidden
// content; focusing the viewport pauses the loop. Empty facts stay hidden;
// the whole strip stays hidden when there is nothing to show. Icons are
// presentation; all facts stay CMS-driven and patch live.
import {
  BadgeCheck,
  Briefcase,
  Cake,
  Gem,
  MapPin,
  PartyPopper,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { EventTypeItem, SiteSettingsContent } from "../../lib/cms/types";
import { fetchEventTypes } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import { useLiveRows } from "./useLiveSync";
import { useLiveSettings } from "./useLiveSettings";

export interface LiveTrustStripProps {
  initialSettings: SiteSettingsContent;
  initialEventTypes: EventTypeItem[];
}

/** Best-effort icon for a CMS-editable event label (keyword match). */
function eventIcon(label: string, size = 16) {
  const text = label.toLowerCase();
  if (text.includes("wedding") || text.includes("engagement")) return <Gem size={size} />;
  if (text.includes("corporate") || text.includes("business") || text.includes("formal"))
    return <Briefcase size={size} />;
  if (text.includes("birth") || text.includes("milestone")) return <Cake size={size} />;
  if (text.includes("private") || text.includes("celebration") || text.includes("christmas"))
    return <PartyPopper size={size} />;
  return <Sparkles size={size} />;
}

type TickerItem =
  | { kind: "area"; text: string }
  | { kind: "phone"; text: string }
  | { kind: "badge"; text: string; abn: boolean }
  | { kind: "event"; text: string };

export default function LiveTrustStrip({
  initialSettings,
  initialEventTypes,
}: LiveTrustStripProps) {
  const settings = useLiveSettings(initialSettings);
  const eventTypes = useLiveRows("event_types", initialEventTypes, fetchEventTypes);

  const items: TickerItem[] = [
    ...(settings.serviceAreaStatement.trim()
      ? [{ kind: "area" as const, text: settings.serviceAreaStatement.trim() }]
      : []),
    ...[settings.phonePrimary, settings.phoneSecondary]
      .filter((phone): phone is string => Boolean(phone && phone.trim()))
      .map((phone) => ({ kind: "phone" as const, text: phone.trim() })),
    ...(settings.abn && settings.abn.trim()
      ? [{ kind: "badge" as const, text: `ABN ${settings.abn.trim()}`, abn: true }]
      : []),
    ...(settings.trustItems ?? [])
      .map((item) => item.trim())
      .filter(Boolean)
      .map((text) => ({ kind: "badge" as const, text, abn: false })),
    ...eventTypes
      .map((item) => item.label.trim())
      .filter(Boolean)
      .map((text) => ({ kind: "event" as const, text })),
  ];
  if (items.length === 0) return null;

  const iconFor = (item: TickerItem) => {
    switch (item.kind) {
      case "area":
        return <MapPin size={16} />;
      case "phone":
        return <Phone size={16} />;
      case "badge":
        return item.abn ? <BadgeCheck size={16} /> : <ShieldCheck size={16} />;
      case "event":
        return eventIcon(item.text);
    }
  };

  // Clones mirror the originals exactly but carry no links: the copy is
  // aria-hidden, so its phones render as plain text and keyboard focus
  // travels only through the first copy while the loop is paused.
  const row = (item: TickerItem, clone: boolean) => (
    <li
      key={`${item.kind}-${item.text}${clone ? "-clone" : ""}`}
      className="ts-item"
      aria-hidden={clone || undefined}
    >
      <span className="trust-strip__icon" aria-hidden={clone ? undefined : true}>
        {iconFor(item)}
      </span>
      {item.kind === "phone" && !clone ? (
        <a href={`tel:${item.text.replace(/[\s()]/g, "")}`}>{item.text}</a>
      ) : (
        <span>{item.text}</span>
      )}
    </li>
  );

  return (
    <section className="trust-strip" aria-label="Business details">
      <div
        className="ts-viewport"
        tabIndex={0}
        role="group"
        aria-label="Business details (focus pauses scrolling)"
      >
        <ul className="ts-track">
          {items.map((item) => row(item, false))}
          {items.map((item) => row(item, true))}
        </ul>
      </div>
    </section>
  );
}
