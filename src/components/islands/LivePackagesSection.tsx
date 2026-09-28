// Live homepage packages grid (DEC-033).
// Mirrors the index.astro packages section; badge derivation matches
// lib/content/cmsSource.ts (custom text, none hidden, built-in labels).
import { fetchPackages } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import { packageBadgeText } from "../live/badges";
import LiveButton from "../live/LiveButton";
import LiveCard from "../live/LiveCard";
import LiveSectionHeading from "../live/LiveSectionHeading";
import Reveal from "./Reveal";
import { useLiveHome } from "./useLiveHome";
import { useLiveRows } from "./useLiveSync";

import type { HomePageContent, PackageItem } from "../../lib/cms/types";

export interface LivePackagesSectionProps {
  initial: PackageItem[];
  initialHome: HomePageContent;
}

export default function LivePackagesSection({ initial, initialHome }: LivePackagesSectionProps) {
  const packages = useLiveRows("packages", initial, fetchPackages);
  const home = useLiveHome(initialHome);
  const heading = home.packagesHeading;
  const compareLabel = home.packagesCompareLabel;
  const visible = packages.filter((pkg) => pkg.highlight !== false);
  // Homepage cards stay scannable: the first four inclusions tease the
  // list; the Packages page renders every inclusion for each package.
  const previewInclusions = (pkg: PackageItem): string[] => pkg.inclusions.slice(0, 4);

  return (
    <section className="section on-dark" aria-labelledby="packages-heading">
      <LiveSectionHeading
        tone="dark"
        title={heading.title}
        eyebrow={heading.eyebrow}
        id="packages-heading"
        lede={heading.lede}
        size="lg"
      />
      <div className="card-grid">
        {visible.map((pkg) => (
          <Reveal key={pkg.id}>
            <LiveCard
              tone="dark"
              title={pkg.name}
              badge={packageBadgeText(pkg)}
              meta={pkg.durationLabel}
              price={pkg.priceLabel}
              description={pkg.summary}
              items={previewInclusions(pkg)}
              featured={pkg.badgeType === "most-popular"}
              href={`/contact?package=${encodeURIComponent(pkg.id)}`}
              ctaLabel="Enquire Now"
              cmsId={pkg.id}
            />
          </Reveal>
        ))}
      </div>
      <p className="packages-note">
        <LiveButton href="/packages" variant="secondary" tone="dark" arrow>
          {compareLabel}
        </LiveButton>
      </p>
    </section>
  );
}
