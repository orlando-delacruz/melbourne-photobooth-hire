// Live packages add-ons (DEC-033).
//
// Mirrors the packages.astro add-ons section with live heading and add-on
// rows from the page blob. Icon glyphs match SSR (per-add-on art with a
// check fallback).
import type { PackagesPageContent } from "../../lib/cms/types";
import { fetchPageContent } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import LiveSectionHeading from "../live/LiveSectionHeading";
import Reveal from "./Reveal";
import { useLiveDoc } from "./useLiveSync";

const ADDON_ICONS: Record<string, string> = {
  "professional-photography":
    '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  "extended-hire": '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  "custom-backdrop":
    '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
  "digital-guestbook": '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
};

function addonIconSvg(id: string): string {
  const inner = ADDON_ICONS[id] ?? '<path d="m5 12.5 4.5 4.5L19 7"/>';
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

export default function LiveAddons({ initialPage }: { initialPage: PackagesPageContent }) {
  const page = useLiveDoc("page_contents", "packages", initialPage, async () => {
    const content = (await fetchPageContent("packages")) as PackagesPageContent | null;
    return content ?? initialPage;
  });

  return (
    <section className="section" id="package-addons" aria-labelledby="packages-addons">
      <LiveSectionHeading
        title={page.addonsHeading.title}
        id="packages-addons"
        eyebrow={page.addonsHeading.eyebrow}
        lede={page.addonsHeading.lede}
        size="lg"
      />
      <div className="addons">
        {page.addOns.map((addOn, index) => (
          <Reveal key={addOn.id} delay={index * 0.06} variant="scale">
            <article className="addon">
              <span
                className="addon-icon"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: addonIconSvg(addOn.id) }}
              />
              <h3>{addOn.name}</h3>
              <p>{addOn.detail}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
