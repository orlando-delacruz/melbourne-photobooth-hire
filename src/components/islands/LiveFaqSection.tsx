// Live FAQ page list (DEC-033).
//
// Mirrors faq.astro: the search toolbar (live count + placeholder), the
// full accordion, and the filter-empty line. No highlight filter — the
// page renders every RLS-visible row, same as SSR. The page's filter
// script re-queries items on every keystroke (see faq.astro), so rows
// arriving via realtime participate immediately.
import { useEffect, useRef, useState } from "react";
import type { FaqItem } from "../../lib/cms/types";
import { fetchFaqs } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import LiveAccordion from "../live/LiveAccordion";
import Reveal from "./Reveal";
import { useLiveRows } from "./useLiveSync";

const SEARCH_ICON = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export interface LiveFaqSectionProps {
  initial: FaqItem[];
  searchPlaceholder: string;
  emptyCopy: string;
}

export default function LiveFaqSection({
  initial,
  searchPlaceholder,
  emptyCopy,
}: LiveFaqSectionProps) {
  const faqs = useLiveRows("faqs", initial, fetchFaqs);
  const [query, setQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const normalized = query.trim().toLowerCase();
  const visibleCount =
    normalized === ""
      ? faqs.length
      : faqs.filter((faq) => `${faq.question} ${faq.answer}`.toLowerCase().includes(normalized))
          .length;

  // Show/hide rendered items directly (mirrors the page filter script).
  useEffect(() => {
    const root = listRef.current;
    if (!root) return;
    for (const item of root.querySelectorAll<HTMLElement>(".accordion__item")) {
      const text = (item.textContent ?? "").toLowerCase();
      item.style.display = normalized === "" || text.includes(normalized) ? "" : "none";
    }
  }, [normalized, faqs]);

  return (
    <>
      <div className="faq-toolbar">
        <div className="faq-search-panel">
          <label className="sr-only" htmlFor="faq-search">
            Search frequently asked questions
          </label>
          <span className="faq-search-icon" aria-hidden="true">
            {SEARCH_ICON}
          </span>
          <input
            id="faq-search"
            className="faq-search-input"
            type="search"
            placeholder={searchPlaceholder}
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <p className="faq-count" data-faq-count aria-live="polite">
          {normalized === ""
            ? `${faqs.length} questions`
            : `${visibleCount} of ${faqs.length} questions`}
        </p>
      </div>

      <div className="faq-main" ref={listRef}>
        <Reveal>
          <LiveAccordion items={faqs} />
        </Reveal>
        <p className="faq-empty" data-faq-empty hidden={visibleCount !== 0}>
          {emptyCopy}
        </p>
      </div>
    </>
  );
}
