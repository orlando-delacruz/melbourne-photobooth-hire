// Admin dashboard: inquiry summary cards, the latest inquiries and a
// content-freshness table for every managed page.

import { useEffect, useState } from "react";
import type { CmsContent, CmsSectionKey } from "../../lib/cms/types";
import { cmsRepository } from "../../lib/cms/repository";
import type { SectionMeta } from "../../lib/cms/repository";
import {
  adminInquirySource,
  byNewest,
  formatInquiryDate,
  formatInquiryDateTime,
} from "../../lib/cms/inquiries";
import type { AdminInquiry } from "../../lib/cms/inquiries";
import { ADMIN_SECTIONS } from "./sections";
import { Skeleton } from "./fields";

const RECENT_LIMIT = 5;

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
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
    case "settings":
      return `${content.settings.socials.length} social links, ${content.settings.reviewUrl ? "review link set" : "review link not set"}`;
  }
}

export default function DashboardView() {
  const [content, setContent] = useState<CmsContent | null>(null);
  const [meta, setMeta] = useState<Record<CmsSectionKey, SectionMeta> | null>(null);
  const [inquiries, setInquiries] = useState<AdminInquiry[] | null>(null);

  useEffect(() => {
    let live = true;
    cmsRepository.load().then((value) => {
      if (live) setContent(value);
    });
    cmsRepository.getMeta().then((value) => {
      if (live) setMeta(value);
    });
    adminInquirySource.list().then((value) => {
      if (live) setInquiries(value);
    });
    return () => {
      live = false;
    };
  }, []);

  if (!content || !meta || !inquiries) return <Skeleton />;

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const total = inquiries.length;
  const today = inquiries.filter((inquiry) => isSameDay(new Date(inquiry.submittedAt), now)).length;
  const weekly = inquiries.filter((inquiry) => new Date(inquiry.submittedAt) >= weekAgo).length;
  const pagesUpdated = (Object.keys(meta) as CmsSectionKey[]).filter(
    (key) => meta[key].savedAt !== null,
  ).length;

  const recent = [...inquiries].sort(byNewest).slice(0, RECENT_LIMIT);
  const contentSections = ADMIN_SECTIONS.filter(
    (section): section is (typeof ADMIN_SECTIONS)[number] & { key: CmsSectionKey } =>
      section.key !== "inquiries",
  );

  return (
    <div className="ad-stack">
      <ul className="ad-summary">
        <li className="ad-summary-card">
          <p className="ad-summary-label">Total Inquiries</p>
          <p className="ad-summary-value">{total}</p>
        </li>
        <li className="ad-summary-card">
          <p className="ad-summary-label">Today&rsquo;s Inquiries</p>
          <p className="ad-summary-value">{today}</p>
        </li>
        <li className="ad-summary-card">
          <p className="ad-summary-label">Weekly Inquiries</p>
          <p className="ad-summary-value">{weekly}</p>
        </li>
        <li className="ad-summary-card">
          <p className="ad-summary-label">Pages Updated</p>
          <p className="ad-summary-value">{pagesUpdated}</p>
        </li>
      </ul>

      <section className="ad-panel" aria-label="Recent inquiries">
        <div className="ad-panel-head">
          <div>
            <h2>Recent inquiries</h2>
            <p className="ad-panel-lede">The latest enquiries from the website contact form.</p>
          </div>
          <a className="ad-button ad-button--secondary ad-panel-action" href="/admin/inquiries">
            View all
          </a>
        </div>
        {recent.length === 0 ? (
          <div className="ad-empty">
            <h3>No inquiries yet</h3>
            <p>Enquiries from the website contact form will appear here.</p>
          </div>
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Event date</th>
                  <th scope="col">Event type</th>
                  <th scope="col">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td>{inquiry.name}</td>
                    <td>{formatInquiryDate(inquiry.eventDate)}</td>
                    <td>{inquiry.eventType || "Not specified"}</td>
                    <td>{formatInquiryDateTime(inquiry.submittedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="ad-panel" aria-label="Website content">
        <div className="ad-panel-head">
          <div>
            <h2>Website content</h2>
            <p className="ad-panel-lede">Content pages and when each was last updated.</p>
          </div>
        </div>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th scope="col">Page</th>
                <th scope="col">Content</th>
                <th scope="col">Updated</th>
              </tr>
            </thead>
            <tbody>
              {contentSections.map((section) => {
                const savedAt = meta[section.key]?.savedAt ?? null;
                return (
                  <tr key={section.key}>
                    <td>
                      <a href={section.href}>{section.label}</a>
                    </td>
                    <td className="ad-table-muted">{summarize(section.key, content)}</td>
                    <td>{savedAt ? formatInquiryDateTime(savedAt) : "Not updated yet"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
