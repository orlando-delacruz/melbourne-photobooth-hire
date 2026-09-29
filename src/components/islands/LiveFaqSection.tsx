// Live FAQ page list (DEC-033).
//
// Renders every RLS-visible row as a numbered card accordion — no highlight
// filter and no search. Rows arriving via realtime patch the list with no
// refresh. The empty line covers a realtime-emptied list; the initial empty
// state is rendered by faq.astro.
import type { FaqItem } from "../../lib/cms/types";
import { fetchFaqs } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import LiveAccordion from "../live/LiveAccordion";
import Reveal from "./Reveal";
import { useLiveRows } from "./useLiveSync";

export interface LiveFaqSectionProps {
  initial: FaqItem[];
  emptyCopy: string;
}

export default function LiveFaqSection({ initial, emptyCopy }: LiveFaqSectionProps) {
  const faqs = useLiveRows("faqs", initial, fetchFaqs);

  return (
    <div className="faq-main faq-list">
      <Reveal>
        <LiveAccordion items={faqs} />
      </Reveal>
      {faqs.length === 0 ? <p className="faq-empty">{emptyCopy}</p> : null}
    </div>
  );
}
