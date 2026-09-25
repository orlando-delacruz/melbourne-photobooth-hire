// Live homepage process steps (DEC-033).
//
// Mirrors the index.astro steps section with live heading and steps from
// the home blob. Icon glyphs match SSR exactly (message/palette/sparkles).
import type { HomePageContent } from "../../lib/cms/types";
import "../../styles/live.css";
import LiveSectionHeading from "../live/LiveSectionHeading";
import Reveal from "./Reveal";
import { useLiveHome } from "./useLiveHome";

const STEP_ICONS: Record<string, string> = {
  message:
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/>',
  palette:
    '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
  sparkles:
    '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
};

function stepIconSvg(name: string | undefined): string {
  const inner = (name && STEP_ICONS[name]) || STEP_ICONS.sparkles;
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

export default function LiveSteps({ initialHome }: { initialHome: HomePageContent }) {
  const home = useLiveHome(initialHome);

  return (
    <section className="section on-dark" aria-labelledby="process-heading">
      <LiveSectionHeading
        tone="dark"
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
                <span
                  className="step-icon"
                  dangerouslySetInnerHTML={{ __html: stepIconSvg(step.icon) }}
                />
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
