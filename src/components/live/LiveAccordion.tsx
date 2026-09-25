// Accordion markup mirror for live islands (DEC-033).
// Class-for-class copy of Accordion.astro (native <details> items with
// data-cms-id). The height animation from the Astro inline script is
// re-bound here scoped to this container, so items arriving via realtime
// animate exactly like SSR items. Reduced-motion keeps native toggle.
import { useEffect, useRef } from "react";

export interface LiveAccordionItem {
  id: string;
  question: string;
  answer: string;
}

export default function LiveAccordion({
  items,
  tone = "light",
}: {
  items: LiveAccordionItem[];
  tone?: "light" | "dark";
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const DURATION = 340;
    const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
    const cleanups: Array<() => void> = [];
    root.querySelectorAll<HTMLDetailsElement>(".accordion__item").forEach((item) => {
      const summary = item.querySelector(".accordion__summary");
      const answer = item.querySelector<HTMLElement>(".accordion__answer");
      if (!summary || !answer) return;
      let busy = false;
      const onClick = (event: Event) => {
        event.preventDefault();
        if (busy) return;
        busy = true;
        const opening = !item.open;
        if (opening) item.open = true;
        const start = opening ? 0 : answer.scrollHeight;
        const end = opening ? answer.scrollHeight : 0;
        answer.style.overflow = "hidden";
        answer.style.height = `${start}px`;
        requestAnimationFrame(() => {
          answer.style.transition = `height ${DURATION}ms ${EASE}`;
          answer.style.height = `${end}px`;
        });
        const onEnd = () => {
          if (!opening) item.open = false;
          answer.style.removeProperty("height");
          answer.style.removeProperty("overflow");
          answer.style.removeProperty("transition");
          busy = false;
        };
        answer.addEventListener("transitionend", onEnd, { once: true });
      };
      summary.addEventListener("click", onClick);
      cleanups.push(() => summary.removeEventListener("click", onClick));
    });
    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, [items]);

  return (
    <div
      ref={rootRef}
      className={`accordion accordion--${tone}${tone === "dark" ? " on-dark" : ""}`}
    >
      {items.map((item) => (
        <details key={item.id} className="accordion__item" data-cms-id={item.id}>
          <summary className="accordion__summary">
            <span className="accordion__question">{item.question}</span>
            <span className="accordion__marker" aria-hidden="true" />
          </summary>
          <div className="accordion__answer">
            <div className="accordion__answer-inner">
              <p>{item.answer}</p>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
