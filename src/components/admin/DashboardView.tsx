// Admin dashboard: live inquiry summary cards, recent inquiries, page
// freshness and module overview. Every number comes from Supabase; a failed
// load shows an error instead of placeholder content.

import { useEffect, useState } from "react";
import type {
  CmsContent,
  CmsPageKey,
  EventTypeItem,
  FaqItem,
  GalleryItem,
  PackageItem,
  ServiceItem,
  TestimonialItem,
} from "../../lib/cms/types";
import { getModuleFreshness, loadModuleItems } from "../../lib/supabase/modules";
import type { ModuleSectionKey } from "./ModuleCrud";
import { getPageMeta, loadPageSection, type SectionMeta } from "../../lib/supabase/pages";
import { liveInquirySource } from "../../lib/supabase/inquiries";
import { byNewest, formatInquiryDate, formatInquiryDateTime } from "../../lib/cms/inquiries";
import type { AdminInquiry } from "../../lib/cms/inquiries";
import { CMS_SECTIONS, MODULE_SECTIONS } from "./sections";
import { Notice, Skeleton } from "./fields";

const RECENT_LIMIT = 5;

const MODULE_KEYS: ModuleSectionKey[] = [
  "mod-services",
  "mod-packages",
  "mod-gallery",
  "mod-faqs",
  "mod-testimonials",
  "mod-event-types",
];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function summarizePage(key: CmsPageKey, content: CmsContent): string {
  switch (key) {
    case "home": {
      const page = content.pages.home;
      return `${page.hero.stats.length} hero stats, ${page.intro.promises.length} promises, ${page.steps.length} process steps, ${content.modules.testimonials.length} reviews, ${content.modules["event-types"].length} event types`;
    }
    case "services":
      return "Page header, enquiry band and SEO; items live in Modules";
    case "packages":
      return `${content.pages.packages.addOns.length} add-ons, ${content.pages.packages.bookingPolicies.length} policies`;
    case "gallery":
      return "Page header, empty state, enquiry band and SEO";
    case "about":
      return `${content.pages.about.story.length} story paragraphs, ${content.pages.about.values.length} values, ${content.pages.about.stats.length} stats`;
    case "faq":
      return "Page header, search and support copy; questions live in Modules";
    case "contact":
      return `${content.pages.contact.steps.length} next steps`;
  }
}

function summarizeModules(content: CmsContent): string {
  const modules = content.modules;
  return `${modules.services.length} services, ${modules.packages.length} packages, ${modules.gallery.length} images, ${modules.faqs.length} questions, ${modules.testimonials.length} reviews`;
}

interface Snapshot {
  content: CmsContent;
  meta: Record<string, SectionMeta>;
  inquiries: AdminInquiry[];
}

async function loadSnapshot(): Promise<Snapshot> {
  const [moduleEntries, pageEntries, settingsBlob, pageMeta, moduleMeta, inquiries] =
    await Promise.all([
      Promise.all(MODULE_KEYS.map(async (key) => [key, await loadModuleItems(key)] as const)),
      Promise.all(
        CMS_SECTIONS.map(
          async (section) =>
            [section.key as CmsPageKey, await loadPageSection(section.key as CmsPageKey)] as const,
        ),
      ),
      loadPageSection("settings"),
      getPageMeta(),
      getModuleFreshness(),
      liveInquirySource.list(),
    ]);
  const modules = new Map(moduleEntries);
  const pages = Object.fromEntries(pageEntries) as CmsContent["pages"];
  const content: CmsContent = {
    pages,
    settings: settingsBlob as CmsContent["settings"],
    modules: {
      services: (modules.get("mod-services") ?? []) as ServiceItem[],
      packages: (modules.get("mod-packages") ?? []) as PackageItem[],
      gallery: (modules.get("mod-gallery") ?? []) as GalleryItem[],
      faqs: (modules.get("mod-faqs") ?? []) as FaqItem[],
      testimonials: (modules.get("mod-testimonials") ?? []) as TestimonialItem[],
      "event-types": (modules.get("mod-event-types") ?? []) as EventTypeItem[],
    },
    seo: { privacy: pages.home.seo, terms: pages.home.seo },
  };
  const meta: Record<string, SectionMeta> = { ...pageMeta };
  for (const [key, savedAt] of Object.entries(moduleMeta)) meta[key] = { savedAt };
  return { content, meta, inquiries };
}

export default function DashboardView() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let live = true;
    loadSnapshot()
      .then((value) => {
        if (live) setSnapshot(value);
      })
      .catch(() => {
        if (live) setLoadError(true);
      });
    return () => {
      live = false;
    };
  }, []);

  if (loadError) {
    return (
      <div className="ad-stack">
        <Notice tone="error" title="Could not load the dashboard.">
          <p>Check your connection and refresh the page.</p>
        </Notice>
      </div>
    );
  }
  if (!snapshot) return <Skeleton />;
  const { content, meta, inquiries } = snapshot;

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const total = inquiries.length;
  const today = inquiries.filter((inquiry) => isSameDay(new Date(inquiry.submittedAt), now)).length;
  const weekly = inquiries.filter((inquiry) => new Date(inquiry.submittedAt) >= weekAgo).length;
  const pageKeys = [...CMS_SECTIONS.map((section) => section.key as CmsPageKey), "settings"];
  const pagesUpdated = pageKeys.filter((key) => meta[key]?.savedAt != null).length;

  const recent = [...inquiries].sort(byNewest).slice(0, RECENT_LIMIT);

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
              {CMS_SECTIONS.map((section) => {
                const savedAt = meta[section.key]?.savedAt ?? null;
                return (
                  <tr key={section.key}>
                    <td>
                      <a href={section.href}>{section.label}</a>
                    </td>
                    <td className="ad-table-muted">
                      {summarizePage(section.key as CmsPageKey, content)}
                    </td>
                    <td>{savedAt ? formatInquiryDateTime(savedAt) : "Not updated yet"}</td>
                  </tr>
                );
              })}
              <tr key="settings">
                <td>
                  <a href="/admin/settings">Site settings</a>
                </td>
                <td className="ad-table-muted">
                  {content.settings.socials.length} social links,{" "}
                  {content.settings.reviewUrl ? "review link set" : "review link not set"}
                </td>
                <td>
                  {meta.settings?.savedAt
                    ? formatInquiryDateTime(meta.settings.savedAt)
                    : "Not updated yet"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="ad-panel" aria-label="Content modules">
        <div className="ad-panel-head">
          <div>
            <h2>Content modules</h2>
            <p className="ad-panel-lede">
              Reusable items rendered on the public site and highlighted sections of the homepage.
            </p>
          </div>
        </div>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th scope="col">Module</th>
                <th scope="col">Content</th>
                <th scope="col">Updated</th>
              </tr>
            </thead>
            <tbody>
              {MODULE_SECTIONS.map((section) => {
                const savedAt = meta[section.key]?.savedAt ?? null;
                return (
                  <tr key={section.key}>
                    <td>
                      <a href={section.href}>{section.label}</a>
                    </td>
                    <td className="ad-table-muted">{summarizeModules(content)}</td>
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
