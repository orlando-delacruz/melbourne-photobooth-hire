// Live packages "included" band (DEC-033).
//
// The inclusion list derives from the Packages module (intersection across
// packages, falling back to the page blob's standard items), so package
// edits recompute it without a refresh. Copy strings stay live through the
// page_contents(packages) subscription.
import type { PackagesPageContent, PackageItem } from "../../lib/cms/types";
import { fetchPackages, fetchPageContent } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import Reveal from "./Reveal";
import { useLiveDoc, useLiveRows } from "./useLiveSync";

const CHECK_SVG =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7"/></svg>';

export interface LiveIncludedBandProps {
  initial: PackageItem[];
  initialPage: PackagesPageContent;
}

export default function LiveIncludedBand({ initial, initialPage }: LiveIncludedBandProps) {
  const packages = useLiveRows("packages", initial, fetchPackages);
  const page = useLiveDoc("page_contents", "packages", initialPage, async () => {
    const content = await fetchPageContent("packages");
    return (content as PackagesPageContent | null) ?? initialPage;
  });

  const sharedInclusions = packages.length
    ? packages
        .map((pkg) => pkg.inclusions)
        .reduce((common, list) => common.filter((item) => list.includes(item)))
    : [];
  const items = sharedInclusions.length >= 4 ? sharedInclusions : page.included.standardItems;

  return (
    <section className="included bleed" id="package-included" aria-labelledby="packages-included">
      <div className="container">
        <div className="included-inner">
          <Reveal variant="mask">
            <div>
              <p className="eyebrow eyebrow--rule">{page.included.eyebrow}</p>
              <h2 id="packages-included">{page.included.heading}</h2>
              <p className="included-lede">{page.included.lede}</p>
            </div>
          </Reveal>
          <Reveal delay={0.08} variant="blur">
            <ul className="included-list">
              {items.map((item) => (
                <li key={item}>
                  <span
                    className="included-check"
                    dangerouslySetInnerHTML={{ __html: CHECK_SVG }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
