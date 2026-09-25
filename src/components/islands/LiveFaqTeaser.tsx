// Live homepage FAQ teaser (DEC-033).
// Mirrors the index.astro FAQ section: highlighted FAQs, first four,
// dark accordion, FAQ-page CTA.
import type { FaqItem, HomePageContent } from "../../lib/cms/types";
import { fetchFaqs } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import LiveAccordion from "../live/LiveAccordion";
import LiveButton from "../live/LiveButton";
import LiveSectionHeading from "../live/LiveSectionHeading";
import Reveal from "./Reveal";
import { useLiveHome } from "./useLiveHome";
import { useLiveRows } from "./useLiveSync";

export interface LiveFaqTeaserProps {
  initial: FaqItem[];
  initialHome: HomePageContent;
}

export default function LiveFaqTeaser({ initial, initialHome }: LiveFaqTeaserProps) {
  const faqs = useLiveRows("faqs", initial, fetchFaqs);
  const home = useLiveHome(initialHome);
  const heading = home.faqHeading;
  const ctaLabel = home.faqCtaLabel;
  const visible = faqs.filter((faq) => faq.highlight !== false).slice(0, 4);

  return (
    <section className="section on-dark" aria-labelledby="faq-heading">
      <LiveSectionHeading
        tone="dark"
        title={heading.title}
        eyebrow={heading.eyebrow}
        id="faq-heading"
        lede={heading.lede}
        size="lg"
      />
      <Reveal>
        <LiveAccordion items={visible} tone="dark" />
      </Reveal>
      <p className="faq-cta">
        <LiveButton href="/faq" variant="secondary" tone="dark" arrow>
          {ctaLabel}
        </LiveButton>
      </p>
    </section>
  );
}
