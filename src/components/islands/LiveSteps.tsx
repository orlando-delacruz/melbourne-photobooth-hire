// Live homepage process steps (DEC-033).
//
// Mirrors the index.astro steps section with live heading and steps from
// the home blob. Icon glyphs match SSR exactly (message/palette/sparkles).
import type { HomePageContent } from "../../lib/cms/types";
import "../../styles/live.css";
import CmsIcon from "../live/CmsIcon";
import LiveSectionHeading from "../live/LiveSectionHeading";
import Reveal from "./Reveal";
import { useLiveHome } from "./useLiveHome";

export default function LiveSteps({ initialHome }: { initialHome: HomePageContent }) {
  const home = useLiveHome(initialHome);

  return (
    <section className="section" aria-labelledby="process-heading">
      <LiveSectionHeading
        tone="light"
        title={home.processHeading.title}
        eyebrow={home.processHeading.eyebrow}
        id="process-heading"
        lede={home.processHeading.lede}
        size="lg"
      />
      <ol className="steps">
        {home.steps.map((step, index) => (
          <Reveal key={`${step.title}-${index}`} delay={index * 0.08} variant="scale">
            <li className="step">
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
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
