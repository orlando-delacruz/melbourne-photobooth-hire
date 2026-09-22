// Admin dashboard: overview cards per content section, provisional-content
// flags, and honest notes about the frontend-only limitations.

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, ExternalLink, Flag, Info, PenLine } from "lucide-react";
import type { CmsContent, CmsSectionKey } from "../../lib/cms/types";
import { cmsRepository } from "../../lib/cms/repository";
import type { SectionMeta } from "../../lib/cms/repository";
import { PROVISIONAL_NOTES } from "../../lib/cms/provisional";
import { ADMIN_SECTIONS } from "./sections";
import { Notice, Skeleton } from "./fields";

function formatSavedAt(savedAt: string | null): string {
  if (!savedAt) return "Not saved yet";
  try {
    return (
      "Saved " +
      new Date(savedAt).toLocaleString("en-AU", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      })
    );
  } catch {
    return "Saved";
  }
}

function summarize(key: CmsSectionKey, content: CmsContent): string {
  switch (key) {
    case "home":
      return `${content.home.hero.stats.length} hero stats, ${content.home.intro.promises.length} promises, ${content.home.showcase.images.length} showcase images, ${content.home.processSection.steps.length} steps, ${content.home.reviewsSection.testimonials.length} reviews, ${content.home.eventTypesSection.eventTypes.length} event types`;
    case "services":
      return `${content.services.services.length} booth services`;
    case "packages":
      return `${content.packages.packages.length} packages, ${content.packages.addOns.length} add-ons, ${content.packages.bookingPolicies.length} policies`;
    case "gallery":
      return `${content.gallery.gallery.length} images`;
    case "about":
      return `${content.about.about.story.length} story paragraphs, ${content.about.about.values.length} values, ${content.about.about.stats.length} stats`;
    case "faq":
      return `${content.faq.faqs.length} questions`;
    case "contact":
      return `${content.contact.steps.length} next steps`;
    case "settings": {
      const review = content.settings.reviewUrl ? "review link set" : "review link missing";
      return `Brand, service area, ${review}, ${content.settings.socials.length} social links`;
    }
  }
}

export default function DashboardView() {
  const [content, setContent] = useState<CmsContent | null>(null);
  const [meta, setMeta] = useState<Record<CmsSectionKey, SectionMeta> | null>(null);

  useEffect(() => {
    let live = true;
    cmsRepository.load().then((value) => {
      if (live) setContent(value);
    });
    cmsRepository.getMeta().then((value) => {
      if (live) setMeta(value);
    });
    return () => {
      live = false;
    };
  }, []);

  if (!content || !meta) return <Skeleton />;

  const flagged = (Object.keys(PROVISIONAL_NOTES) as CmsSectionKey[]).filter(
    (key) => PROVISIONAL_NOTES[key].length > 0,
  );

  return (
    <div className="ad-stack">
      <Notice tone="info" title="Frontend preview, no backend yet.">
        <p>
          Edits save in this browser only so you can review the full editing experience. The public
          website is unchanged until the CMS backend is connected. Sign-in arrives with the backend
          as well; these pages stay out of search results.
        </p>
      </Notice>

      <ul className="ad-cards">
        {ADMIN_SECTIONS.map((section) => (
          <li key={section.key}>
            <article className="ad-card">
              <div className="ad-card-head">
                <span
                  className="ad-card-icon"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: section.icon }}
                />
                <h2>{section.label}</h2>
              </div>
              <p>{section.blurb}</p>
              <p className="ad-card-meta">{summarize(section.key, content)}</p>
              <p className="ad-card-meta">
                {meta[section.key].savedAt ? (
                  <span>
                    <CheckCircle2 size={13} aria-hidden="true" />{" "}
                    {formatSavedAt(meta[section.key].savedAt)}
                  </span>
                ) : (
                  <span>
                    <AlertCircle size={13} aria-hidden="true" /> {formatSavedAt(null)}
                  </span>
                )}
              </p>
              <p className="ad-card-links">
                <a className="ad-button ad-button--secondary" href={section.href}>
                  <PenLine size={15} aria-hidden="true" />
                  Edit
                </a>
                {section.publicHref ? (
                  <a
                    className="ad-button ad-button--tertiary"
                    href={section.publicHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View page
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                ) : null}
              </p>
            </article>
          </li>
        ))}
      </ul>

      <section className="ad-panel" aria-label="Awaiting client confirmation">
        <h2>Content awaiting client confirmation</h2>
        <p className="ad-panel-lede">
          These values mirror the provisional website content. Confirm each area with the client
          before it is treated as final.
        </p>
        <ul className="ad-flag-list">
          {flagged.map((key) =>
            PROVISIONAL_NOTES[key].map((note) => (
              <li key={`${key}-${note}`}>
                <Flag size={15} aria-hidden="true" />
                <span>
                  <strong>{ADMIN_SECTIONS.find((section) => section.key === key)?.label}: </strong>
                  {note}
                </span>
              </li>
            )),
          )}
        </ul>
        <p className="ad-hint ad-panel-foot">
          <Info size={14} aria-hidden="true" /> Ratings render only for testimonials that carry one;
          unverified ratings must never be published as fact.
        </p>
      </section>
    </div>
  );
}
