// Live packages plans grid (DEC-033).
//
// Mirrors the packages.astro #package-plans section: live heading copy,
// empty-state branch and card grid (middle card scales like SSR).
// No highlight filter — the page renders every RLS-visible row, same as SSR.
import type { PackagesPageContent, PackageItem } from "../../lib/cms/types";
import { fetchPackages, fetchPageContent } from "../../lib/realtime/fetchers";
import "../../styles/live.css";
import { packageBadgeText } from "../live/badges";
import LiveCard from "../live/LiveCard";
import LiveSectionHeading from "../live/LiveSectionHeading";
import Reveal from "./Reveal";
import { useLiveDoc, useLiveRows } from "./useLiveSync";

export interface LivePlansSectionProps {
  initial: PackageItem[];
  initialPage: PackagesPageContent;
}

export default function LivePlansSection({ initial, initialPage }: LivePlansSectionProps) {
  const packages = useLiveRows("packages", initial, fetchPackages);
  const page = useLiveDoc("page_contents", "packages", initialPage, async () => {
    const content = await fetchPageContent("packages");
    return (content as PackagesPageContent | null) ?? initialPage;
  });

  return (
    <section className="section" id="package-plans" aria-labelledby="packages-list">
      <LiveSectionHeading
        eyebrow={page.plansHeading.eyebrow}
        id="packages-list"
        title={page.plansHeading.title}
        lede={page.plansHeading.lede}
        size="lg"
      />
      {packages.length === 0 ? (
        <p className="empty">
          {page.emptyState.title} {page.emptyState.body}
        </p>
      ) : (
        <div className="card-grid">
          {packages.map((pkg, index) => (
            <Reveal key={pkg.id} delay={index * 0.08} variant={index === 1 ? "scale" : "rise"}>
              <LiveCard
                title={pkg.name}
                badge={packageBadgeText(pkg)}
                meta={pkg.durationLabel}
                price={pkg.priceLabel}
                description={pkg.summary}
                items={pkg.inclusions}
                featured={pkg.badgeType === "most-popular"}
                bestSeller={pkg.bestSeller}
                href={`/contact?package=${encodeURIComponent(pkg.id)}`}
                ctaLabel="Enquire Now"
                cmsId={pkg.id}
              />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
