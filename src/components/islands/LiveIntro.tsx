// Live homepage intro + promises (DEC-033).
//
// Mirrors the index.astro intro section with live eyebrow/heading/body,
// promises and about label from the home blob. Promise icons stay
// positional (clock/qrcode/users by index) exactly like SSR.
import type { HomePageContent } from "../../lib/cms/types";
import "../../styles/live.css";
import LiveButton from "../live/LiveButton";
import Reveal from "./Reveal";
import { useLiveHome } from "./useLiveHome";

const PROMISE_ICONS = [
  '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h7v7h-7z"/>',
  '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
];
const CLOCK_ICON = PROMISE_ICONS[0];

function promiseIconSvg(index: number): string {
  const inner = PROMISE_ICONS[index] ?? CLOCK_ICON;
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

export default function LiveIntro({ initialHome }: { initialHome: HomePageContent }) {
  const home = useLiveHome(initialHome);
  const intro = home.intro;

  return (
    <section className="section on-dark intro" aria-labelledby="intro-heading">
      <div className="intro-grid">
        <Reveal>
          <div>
            <p className="eyebrow eyebrow--rule">{intro.eyebrow}</p>
            <h2 id="intro-heading">{intro.heading}</h2>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="intro-body">
            <p>{intro.body}</p>
            <dl className="promises">
              {intro.promises.map((promise, index) => (
                <div className="promise" key={`${promise.title}-${index}`}>
                  <dt>
                    <span
                      className="promise-icon"
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{ __html: promiseIconSvg(index) }}
                    />
                    {promise.title}
                  </dt>
                  <dd>{promise.detail}</dd>
                </div>
              ))}
            </dl>
            <LiveButton href="/about" variant="tertiary" tone="dark" arrow>
              {intro.aboutLabel}
            </LiveButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
