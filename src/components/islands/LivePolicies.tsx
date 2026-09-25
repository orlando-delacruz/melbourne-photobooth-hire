// Live packages booking policies (DEC-033).
//
// Mirrors the packages.astro policies section with live intro copy and
// policy rows from the page blob.
import type { PackagesPageContent } from "../../lib/cms/types";
import { fetchPageContent } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import Reveal from "./Reveal";
import { useLiveDoc } from "./useLiveSync";

const POLICY_ICON =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>';

export default function LivePolicies({ initialPage }: { initialPage: PackagesPageContent }) {
  const page = useLiveDoc("page_contents", "packages", initialPage, async () => {
    const content = (await fetchPageContent("packages")) as PackagesPageContent | null;
    return content ?? initialPage;
  });

  return (
    <section className="section" id="package-policies" aria-labelledby="packages-policies">
      <div className="policies">
        <Reveal>
          <div className="policies-intro">
            <p className="eyebrow eyebrow--rule">{page.policies.eyebrow}</p>
            <h2 id="packages-policies">{page.policies.heading}</h2>
            <p>{page.policies.lede}</p>
          </div>
        </Reveal>
        <Reveal delay={0.08} variant="blur">
          <ul className="policy-list">
            {page.bookingPolicies.map((policy) => (
              <li key={policy}>
                <span className="policy-icon" dangerouslySetInnerHTML={{ __html: POLICY_ICON }} />
                <span>{policy}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
