// SEO module editor: per-page metadata list -> detail form. Each public
// page keeps its own SEO settings; the Website CMS no longer edits them.
// Keywords are planning data only and are never rendered. Social and robots
// values mirror the public head architecture: OG title/description/image are
// editable, while OG URL/type and the Twitter card stay derived.

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { PageMeta, SeoPageKey } from "../../../lib/cms/types";
import { pageMetaSchema } from "../../../lib/cms/schemas";
import { loadSeo, saveSeo } from "../../../lib/supabase/seo";
import { AdField, ImageField, Notice, Skeleton, TextArea, TextInput } from "../fields";
import { Panel } from "../groups";
import { HighlightPill, toFieldErrors } from "../ModuleCrud";
import { notifyError, notifySuccess } from "../alerts";

interface SeoPage {
  key: SeoPageKey;
  label: string;
  href: string;
}

const SEO_PAGES: SeoPage[] = [
  { key: "home", label: "Homepage", href: "/" },
  { key: "services", label: "Services", href: "/services" },
  { key: "packages", label: "Packages", href: "/packages" },
  { key: "gallery", label: "Gallery", href: "/gallery" },
  { key: "about", label: "About", href: "/about" },
  { key: "faq", label: "FAQ", href: "/faq" },
  { key: "contact", label: "Contact", href: "/contact" },
  { key: "privacy", label: "Privacy Policy", href: "/privacy" },
  { key: "terms", label: "Terms & Conditions", href: "/terms" },
];

type View = { name: "list" } | { name: "detail"; key: SeoPageKey };

interface EditorNotice {
  tone: "success" | "error";
  title: string;
  body?: string;
  list?: string[];
}

function robotsFor(seo: PageMeta): string {
  const index = seo.noindex ? "noindex" : "index";
  const follow = seo.nofollow ? "nofollow" : "follow";
  return seo.noindex ? `${index}, ${follow}` : `${index}, ${follow}, max-image-preview:large`;
}

function CharCount({
  value,
  min,
  max,
  id,
}: {
  value: string;
  min: number;
  max: number;
  id: string;
}) {
  const length = value.trim().length;
  const state = length < min ? "short" : length > max ? "long" : "within range";
  return (
    <p className="ad-hint" id={id}>
      {length} characters. Recommended {min} to {max}; currently {state}. Longer or shorter text
      still saves.
    </p>
  );
}

export default function SeoEditor() {
  const [records, setRecords] = useState<Record<SeoPageKey, PageMeta> | null>(null);
  const [view, setView] = useState<View>({ name: "list" });
  const [draft, setDraft] = useState<PageMeta | null>(null);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [notice, setNotice] = useState<EditorNotice | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const entries = await Promise.all(
          SEO_PAGES.map(async (page) => [page.key, await loadSeo(page.key)] as const),
        );
        if (!live) return;
        setRecords(Object.fromEntries(entries) as Record<SeoPageKey, PageMeta>);
      } catch {
        if (!live) return;
        setNotice({
          tone: "error",
          title: "Could not load SEO settings.",
          body: "Check your connection and refresh the page.",
        });
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  const openDetail = useCallback(
    (key: SeoPageKey) => {
      if (!records) return;
      setDraft({ ...records[key], ogImage: { ...records[key].ogImage } });
      setErrors(new Map());
      setNotice(null);
      setView({ name: "detail", key });
    },
    [records],
  );

  const saveDraft = useCallback(async () => {
    if (!draft || view.name !== "detail") return;
    const parsed = pageMetaSchema.safeParse(draft);
    if (!parsed.success) {
      const { map, lines } = toFieldErrors(parsed.error.issues);
      setErrors(map);
      setNotice({
        tone: "error",
        title:
          lines.length === 1
            ? "One field needs attention before saving."
            : `${lines.length} fields need attention before saving.`,
        list: lines,
      });
      return;
    }
    setBusy(true);
    try {
      await saveSeo(view.key, parsed.data);
      setRecords((current) => (current ? { ...current, [view.key]: parsed.data } : current));
      setDraft(null);
      setErrors(new Map());
      void notifySuccess("SEO settings saved.");
      setView({ name: "list" });
    } catch {
      void notifyError("Could not save.", "Please try again.");
    } finally {
      setBusy(false);
    }
  }, [draft, view]);

  if (!records)
    return (
      <div className="ad-stack">
        {notice ? (
          <Notice tone={notice.tone} title={notice.title} list={notice.list}>
            {notice.body ? <p>{notice.body}</p> : null}
          </Notice>
        ) : null}
        <Skeleton />
      </div>
    );

  if (view.name === "detail" && draft) {
    const page = SEO_PAGES.find((entry) => entry.key === view.key) ?? SEO_PAGES[0];
    const err = (field: string) => errors.get(field);
    const effectiveCanonical = (draft.canonicalUrl ?? "").trim() || `${page.href} (page URL)`;
    return (
      <div className="ad-stack">
        {notice ? (
          <Notice tone={notice.tone} title={notice.title} list={notice.list}>
            {notice.body ? <p>{notice.body}</p> : null}
          </Notice>
        ) : null}
        <p>
          <button
            type="button"
            className="ad-button ad-button--secondary"
            onClick={() => {
              setDraft(null);
              setErrors(new Map());
              setView({ name: "list" });
            }}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to SEO pages
          </button>
        </p>
        <Panel
          title={`${page.label} SEO`}
          lede={`Metadata for ${page.href}. Values fall back to the page defaults when left blank where allowed.`}
        >
          <section aria-label="Basic SEO">
            <h3 className="ad-subhead">Basic SEO</h3>
            <div className="ad-stack">
              <AdField id="seo-title" label="SEO Title" required error={err("seoTitle")}>
                <TextInput
                  id="seo-title"
                  type="text"
                  value={draft.seoTitle}
                  error={err("seoTitle")}
                  aria-describedby="seo-title-count"
                  onChange={(e) => setDraft({ ...draft, seoTitle: e.target.value })}
                />
              </AdField>
              <CharCount id="seo-title-count" value={draft.seoTitle} min={50} max={60} />
              <AdField
                id="seo-description"
                label="Meta Description"
                required
                error={err("seoDescription")}
              >
                <TextArea
                  id="seo-description"
                  rows={3}
                  value={draft.seoDescription}
                  error={err("seoDescription")}
                  aria-describedby="seo-description-count"
                  onChange={(e) => setDraft({ ...draft, seoDescription: e.target.value })}
                />
              </AdField>
              <CharCount
                id="seo-description-count"
                value={draft.seoDescription}
                min={150}
                max={160}
              />
              <AdField
                id="seo-keywords"
                label="Target Keywords"
                hint="Internal planning aid only. Never rendered on the page."
                error={err("keywords")}
              >
                <TextInput
                  id="seo-keywords"
                  type="text"
                  value={draft.keywords ?? ""}
                  error={err("keywords")}
                  onChange={(e) => setDraft({ ...draft, keywords: e.target.value })}
                />
              </AdField>
              <AdField
                id="seo-canonical"
                label="Canonical URL"
                hint="Absolute URL override. Leave blank to follow the page URL."
                error={err("canonicalUrl")}
              >
                <TextInput
                  id="seo-canonical"
                  type="text"
                  inputMode="url"
                  value={draft.canonicalUrl ?? ""}
                  error={err("canonicalUrl")}
                  onChange={(e) => setDraft({ ...draft, canonicalUrl: e.target.value })}
                />
              </AdField>
              <p className="ad-hint">Effective canonical: {effectiveCanonical}</p>
            </div>
          </section>
          <section aria-label="Open Graph and social sharing">
            <h3 className="ad-subhead">Open Graph / Social Sharing</h3>
            <div className="ad-stack">
              <AdField
                id="seo-og-title"
                label="OG Title"
                hint="Leave blank to use the SEO title."
                error={err("ogTitle")}
              >
                <TextInput
                  id="seo-og-title"
                  type="text"
                  value={draft.ogTitle ?? ""}
                  error={err("ogTitle")}
                  onChange={(e) => setDraft({ ...draft, ogTitle: e.target.value })}
                />
              </AdField>
              <AdField
                id="seo-og-description"
                label="OG Description"
                hint="Leave blank to use the meta description."
                error={err("ogDescription")}
              >
                <TextArea
                  id="seo-og-description"
                  rows={3}
                  value={draft.ogDescription ?? ""}
                  error={err("ogDescription")}
                  onChange={(e) => setDraft({ ...draft, ogDescription: e.target.value })}
                />
              </AdField>
              <ImageField
                legend="OG image."
                hint="Uploaded file. Also used for Twitter/X cards; falls back to the hero image."
                value={draft.ogImage}
                onChange={(ogImage) => setDraft({ ...draft, ogImage })}
                error={err("ogImage")}
                altError={err("ogImage.alt")}
              />
              <p className="ad-hint">
                OG URL follows the canonical URL and OG type is always `website`. Twitter/X cards
                reuse this OG title, description and image.
              </p>
            </div>
          </section>
          <section aria-label="Search engine controls">
            <h3 className="ad-subhead">Search Engine Controls</h3>
            <div className="ad-stack">
              <AdField
                id="seo-index"
                label="Index Page"
                hint="Turn off to keep this page out of search results."
                error={err("noindex")}
              >
                <label className="ad-toggle">
                  <input
                    id="seo-index"
                    type="checkbox"
                    checked={!draft.noindex}
                    onChange={(e) => setDraft({ ...draft, noindex: !e.target.checked })}
                  />
                  <span>{draft.noindex ? "Not indexed" : "Indexed"}</span>
                </label>
              </AdField>
              <AdField
                id="seo-follow"
                label="Follow Links"
                hint="Turn off to tell crawlers not to follow this page's links."
                error={err("nofollow")}
              >
                <label className="ad-toggle">
                  <input
                    id="seo-follow"
                    type="checkbox"
                    checked={!draft.nofollow}
                    onChange={(e) => setDraft({ ...draft, nofollow: !e.target.checked })}
                  />
                  <span>{draft.nofollow ? "Links not followed" : "Links followed"}</span>
                </label>
              </AdField>
              <p className="ad-hint">Robots directive: {robotsFor(draft)}</p>
            </div>
          </section>
          <section aria-label="Search result preview">
            <h3 className="ad-subhead">Search Preview</h3>
            <p className="ad-hint ad-subhint">
              Approximate preview for internal guidance, not an exact search rendering.
            </p>
            <div className="ad-serp">
              <p className="ad-serp-title">{draft.seoTitle || "Untitled page"}</p>
              <p className="ad-serp-url">{effectiveCanonical}</p>
              <p className="ad-serp-description">{draft.seoDescription || "No description set."}</p>
            </div>
          </section>
          <p className="ad-inquiry-actions">
            <button
              type="button"
              className="ad-button ad-button--primary"
              disabled={busy}
              onClick={() => void saveDraft()}
            >
              {busy ? "Saving..." : "Save SEO settings"}
            </button>
            <button
              type="button"
              className="ad-button ad-button--secondary"
              onClick={() => {
                setDraft(null);
                setErrors(new Map());
                setView({ name: "list" });
              }}
            >
              Cancel
            </button>
          </p>
        </Panel>
      </div>
    );
  }

  return (
    <div className="ad-stack">
      {notice ? (
        <Notice tone={notice.tone} title={notice.title} list={notice.list}>
          {notice.body ? <p>{notice.body}</p> : null}
        </Notice>
      ) : null}
      <section className="ad-panel" aria-label="All pages">
        <div className="ad-panel-head">
          <div>
            <h2>All pages</h2>
            <p className="ad-panel-lede">
              {SEO_PAGES.length} indexable pages. Select a row to edit its SEO settings.
            </p>
          </div>
        </div>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th scope="col">Page</th>
                <th scope="col" className="ad-hide-sm">
                  Path
                </th>
                <th scope="col" className="ad-hide-sm">
                  SEO title
                </th>
                <th scope="col">Indexing</th>
              </tr>
            </thead>
            <tbody>
              {SEO_PAGES.map((page) => {
                const seo = records[page.key];
                return (
                  <tr
                    key={page.key}
                    className="ad-table-rowlink"
                    tabIndex={0}
                    onClick={() => openDetail(page.key)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openDetail(page.key);
                      }
                    }}
                    aria-label={`Edit SEO for ${page.label}`}
                  >
                    <td>
                      <strong>{page.label}</strong>
                    </td>
                    <td className="ad-hide-sm">{page.href}</td>
                    <td className="ad-hide-sm">{(seo.seoTitle || "Not set").slice(0, 70)}</td>
                    <td>
                      <HighlightPill on={!seo.noindex} onLabel="Indexed" offLabel="Noindex" />
                    </td>
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
