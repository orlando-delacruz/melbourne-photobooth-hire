// Live FAQ support aside (DEC-033).
//
// Mirrors the faq.astro support card with live heading/body/label from the
// FAQ page blob. The chat glyph matches SSR.
import type { FaqPageContent } from "../../lib/cms/types";
import { fetchPageContent } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import LiveButton from "../live/LiveButton";
import { useLiveDoc } from "./useLiveSync";

const CHAT_SVG =
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

export default function LiveFaqSupport({ initialPage }: { initialPage: FaqPageContent }) {
  const page = useLiveDoc("page_contents", "faq", initialPage, async () => {
    const content = (await fetchPageContent("faq")) as FaqPageContent | null;
    return content ?? initialPage;
  });

  return (
    <div className="faq-support">
      <span
        className="faq-support-icon"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: CHAT_SVG }}
      />
      <h2>{page.support.heading}</h2>
      <p>{page.support.body}</p>
      <LiveButton href="/contact" variant="primary" tone="dark" size="lg" arrow>
        {page.support.label}
      </LiveButton>
    </div>
  );
}
