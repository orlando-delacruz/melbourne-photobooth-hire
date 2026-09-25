// Live homepage occasion chips (DEC-033).
// Mirrors the index.astro event-types section: verbatim Event-Types module
// labels with resolved glyphs. The contact dropdown shares the same table
// through the channel registry (one subscription, two consumers).
import type { EventTypeItem, HomePageContent } from "../../lib/cms/types";
import { fetchEventTypes } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import LiveChips from "../live/LiveChips";
import LiveSectionHeading from "../live/LiveSectionHeading";
import { useLiveHome } from "./useLiveHome";
import { useLiveRows } from "./useLiveSync";

export interface LiveChipsSectionProps {
  initial: EventTypeItem[];
  initialHome: HomePageContent;
}

export default function LiveChipsSection({ initial, initialHome }: LiveChipsSectionProps) {
  const eventTypes = useLiveRows("event_types", initial, fetchEventTypes);
  const home = useLiveHome(initialHome);
  const heading = home.eventTypesHeading;

  return (
    <section className="section on-dark" aria-labelledby="event-types-heading">
      <LiveSectionHeading
        tone="dark"
        title={heading.title}
        eyebrow={heading.eyebrow}
        id="event-types-heading"
        lede={heading.lede}
        size="lg"
      />
      <LiveChips labels={eventTypes.map((item) => item.label)} />
    </section>
  );
}
