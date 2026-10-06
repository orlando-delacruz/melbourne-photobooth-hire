// Live dedicated booth page sections (DEC-055, generalized DEC-058).
//
// Renders the CMS-owned booth blob for the given page key: how-it-works
// steps, confirmed pricing panel, best-for occasions and venue notes, plus
// highlighted FAQs from the module. Each section omits itself while its
// content is empty, so an unfilled CMS row never publishes thin copy. Steps
// reuse the .steps/.step classes (same look as the homepage process);
// pricing/occasions/venue use the dedicated .booth-* styles in live.css.
import type { BoothPageContent, CmsPageKey, FaqItem } from "../../lib/cms/types";
import { fetchFaqs, fetchPageContent } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import CmsIcon from "../live/CmsIcon";
import LiveAccordion from "../live/LiveAccordion";
import LiveSectionHeading from "../live/LiveSectionHeading";
import Reveal from "./Reveal";
import { useLiveDoc, useLiveRows } from "./useLiveSync";

function checkSvg(): string {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7" /></svg>`;
}

export interface LiveBoothSectionsProps {
  pageKey: CmsPageKey;
  initialPage: BoothPageContent;
  initialFaqs: FaqItem[];
}

export default function LiveBoothSections({
  pageKey,
  initialPage,
  initialFaqs,
}: LiveBoothSectionsProps) {
  const page = useLiveDoc("page_contents", pageKey, initialPage, async () => {
    const content = (await fetchPageContent(pageKey)) as BoothPageContent | null;
    return content ?? initialPage;
  });
  const faqs = useLiveRows("faqs", initialFaqs, fetchFaqs);

  const steps = page.steps.filter((step) => step.title.trim() && step.summary.trim());
  const pricingPoints = page.pricingPoints.filter((point) => point.trim());
  const bestFor = page.bestFor.filter((item) => item.title.trim() && item.detail.trim());
  const venueNotes = page.venueNotes.filter((note) => note.trim());
  const visibleFaqs = faqs.filter((faq) => faq.highlight !== false).slice(0, 6);

  return (
    <>
      {steps.length > 0 ? (
        <section className="section" aria-labelledby="booth-steps-heading">
          <LiveSectionHeading
            tone="light"
            title={page.stepsHeading.title}
            eyebrow={page.stepsHeading.eyebrow}
            id="booth-steps-heading"
            lede={page.stepsHeading.lede}
            size="lg"
          />
          <ol className="steps">
            {steps.map((step, index) => (
              <li key={step.id} className="step">
                <Reveal delay={index * 0.08} variant="scale">
                  <div className="step-head">
                    <span className="step-icon">
                      <CmsIcon name={step.icon ?? "sparkles"} size={22} />
                    </span>
                    <p className="step-number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.summary}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {page.priceLabel.trim() ? (
        <section className="section" aria-labelledby="booth-pricing-heading">
          <LiveSectionHeading
            tone="light"
            title={page.pricingHeading.title}
            eyebrow={page.pricingHeading.eyebrow}
            id="booth-pricing-heading"
            lede={page.pricingHeading.lede}
            size="lg"
          />
          <div className="booth-price">
            <p className="booth-price-amount">{page.priceLabel}</p>
            {page.priceNote.trim() ? (
              <p className="booth-price-note">{page.priceNote}</p>
            ) : null}
            {pricingPoints.length > 0 ? (
              <ul className="booth-price-list">
                {pricingPoints.map((point, index) => (
                  <li key={`${index}-${point}`}>
                    <span
                      className="booth-check"
                      dangerouslySetInnerHTML={{ __html: checkSvg() }}
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ) : null}

      {bestFor.length > 0 ? (
        <section className="section" aria-labelledby="booth-bestfor-heading">
          <LiveSectionHeading
            tone="light"
            title={page.bestForHeading.title}
            eyebrow={page.bestForHeading.eyebrow}
            id="booth-bestfor-heading"
            lede={page.bestForHeading.lede}
            size="lg"
          />
          <div className="booth-grid">
            {bestFor.map((item) => (
              <article key={item.id} className="booth-card">
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {venueNotes.length > 0 ? (
        <section className="section" aria-labelledby="booth-venue-heading">
          <LiveSectionHeading
            tone="light"
            title={page.venueHeading.title}
            eyebrow={page.venueHeading.eyebrow}
            id="booth-venue-heading"
            lede={page.venueHeading.lede}
            size="lg"
          />
          <ul className="booth-checklist">
            {venueNotes.map((note, index) => (
              <li key={`${index}-${note}`}>
                <span className="booth-check" dangerouslySetInnerHTML={{ __html: checkSvg() }} />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {visibleFaqs.length > 0 ? (
        <section className="section" aria-labelledby="booth-faq-heading">
          <LiveSectionHeading
            tone="light"
            title={page.faqHeading.title}
            eyebrow={page.faqHeading.eyebrow}
            id="booth-faq-heading"
            lede={page.faqHeading.lede}
            size="lg"
          />
          <Reveal>
            <LiveAccordion items={visibleFaqs} />
          </Reveal>
          <p className="booth-faq-cta">
            <a href="/faq">{page.faqCtaLabel || "More questions"}</a>
          </p>
        </section>
      ) : null}
    </>
  );
}
