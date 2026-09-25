// Legal pages editor: list -> detail form for the privacy policy and terms.
// Bodies are headed sections of paragraph/list blocks; validation runs the
// shared legal schema and saves persist whole blobs like page sections.

import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { LegalBlock, LegalPageContent, LegalPageKey } from "../../../lib/cms/types";
import { legalPageSchema } from "../../../lib/cms/schemas";
import { loadPageSection, savePageSection } from "../../../lib/supabase/pages";
import { AdField, Notice, Skeleton, TextArea, TextInput } from "../fields";
import { Panel, StringList } from "../groups";
import { toFieldErrors } from "../ModuleCrud";
import { confirmDestructive, notifyError, notifySuccess } from "../alerts";

interface LegalPage {
  key: LegalPageKey;
  label: string;
  href: string;
}

const LEGAL_PAGES: LegalPage[] = [
  { key: "privacy", label: "Privacy Policy", href: "/privacy" },
  { key: "terms", label: "Terms & Conditions", href: "/terms" },
];

type View = { name: "list" } | { name: "detail"; key: LegalPageKey };

interface EditorNotice {
  tone: "success" | "error";
  title: string;
  body?: string;
  list?: string[];
}

function blankSection() {
  return { heading: "", blocks: [{ kind: "paragraph", text: "" } as LegalBlock] };
}

export default function LegalEditor() {
  const [records, setRecords] = useState<Record<LegalPageKey, LegalPageContent> | null>(null);
  const [view, setView] = useState<View>({ name: "list" });
  const [draft, setDraft] = useState<LegalPageContent | null>(null);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [notice, setNotice] = useState<EditorNotice | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const entries = await Promise.all(
          LEGAL_PAGES.map(
            async (page) =>
              [page.key, (await loadPageSection(page.key)) as LegalPageContent] as const,
          ),
        );
        if (!live) return;
        setRecords(Object.fromEntries(entries) as Record<LegalPageKey, LegalPageContent>);
      } catch {
        if (!live) return;
        setNotice({
          tone: "error",
          title: "Could not load legal pages.",
          body: "Check your connection and refresh the page.",
        });
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  const openDetail = useCallback(
    (key: LegalPageKey) => {
      if (!records) return;
      setDraft(structuredClone(records[key]));
      setErrors(new Map());
      setNotice(null);
      setView({ name: "detail", key });
    },
    [records],
  );

  const err = (field: string) => errors.get(field);

  const saveDraft = useCallback(async () => {
    if (!draft || !records || view.name !== "detail") return;
    const parsed = legalPageSchema.safeParse(draft);
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
      await savePageSection(view.key, records[view.key], parsed.data);
      const fresh = (await loadPageSection(view.key)) as LegalPageContent;
      setRecords((current) => (current ? { ...current, [view.key]: fresh } : current));
      setDraft(null);
      setErrors(new Map());
      void notifySuccess("Legal page saved.");
      setView({ name: "list" });
    } catch {
      void notifyError("Could not save.", "Please try again.");
    } finally {
      setBusy(false);
    }
  }, [draft, records, view]);

  if (!records) {
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
  }

  if (view.name === "detail" && draft) {
    const page = LEGAL_PAGES.find((entry) => entry.key === view.key) ?? LEGAL_PAGES[0];
    const setHeader = (field: "title" | "eyebrow" | "lede", value: string) =>
      setDraft({ ...draft, header: { ...draft.header, [field]: value } });
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
            Back to legal pages
          </button>
        </p>
        <Panel title={`${page.label} copy`} lede={`Words rendered at ${page.href}.`}>
          <AdField id="legal-title" label="Page title" required error={err("header.title")}>
            <TextInput
              id="legal-title"
              type="text"
              value={draft.header.title}
              error={err("header.title")}
              onChange={(e) => setHeader("title", e.target.value)}
            />
          </AdField>
          <div className="ad-grid-2">
            <AdField id="legal-eyebrow" label="Eyebrow" required error={err("header.eyebrow")}>
              <TextInput
                id="legal-eyebrow"
                type="text"
                value={draft.header.eyebrow}
                error={err("header.eyebrow")}
                onChange={(e) => setHeader("eyebrow", e.target.value)}
              />
            </AdField>
            <AdField id="legal-lede" label="Introduction" required error={err("header.lede")}>
              <TextInput
                id="legal-lede"
                type="text"
                value={draft.header.lede}
                error={err("header.lede")}
                onChange={(e) => setHeader("lede", e.target.value)}
              />
            </AdField>
          </div>

          <h3 className="ad-subhead">Opening paragraphs</h3>
          {draft.intro.map((paragraph, index) => (
            <div key={index} className="ad-block-row">
              <AdField
                id={`legal-intro-${index}`}
                label={`Paragraph ${index + 1}`}
                required
                error={err(`intro.${index}`)}
              >
                <TextArea
                  id={`legal-intro-${index}`}
                  rows={3}
                  value={paragraph}
                  error={err(`intro.${index}`)}
                  onChange={(e) => {
                    const next = [...draft.intro];
                    next[index] = e.target.value;
                    setDraft({ ...draft, intro: next });
                  }}
                />
              </AdField>
              <p className="ad-inquiry-actions">
                <button
                  type="button"
                  className="ad-button ad-button--tertiary"
                  onClick={() => {
                    void confirmDestructive({
                      title: `Remove paragraph ${index + 1}?`,
                      confirmText: "Remove",
                    }).then((confirmed) => {
                      if (confirmed) {
                        setDraft({ ...draft, intro: draft.intro.filter((_, j) => j !== index) });
                      }
                    });
                  }}
                >
                  <Trash2 size={16} aria-hidden="true" />
                  Remove
                </button>
              </p>
            </div>
          ))}
          <p>
            <button
              type="button"
              className="ad-button ad-button--secondary"
              onClick={() => setDraft({ ...draft, intro: [...draft.intro, ""] })}
            >
              <Plus size={16} aria-hidden="true" />
              Add paragraph
            </button>
          </p>

          <h3 className="ad-subhead">Sections</h3>
          {draft.sections.map((section, s) => (
            <section
              key={s}
              className="ad-panel"
              aria-label={section.heading || `Section ${s + 1}`}
            >
              <AdField
                id={`legal-section-${s}`}
                label={`Section ${s + 1} heading`}
                required
                error={err(`sections.${s}.heading`)}
              >
                <TextInput
                  id={`legal-section-${s}`}
                  type="text"
                  value={section.heading}
                  error={err(`sections.${s}.heading`)}
                  onChange={(e) => {
                    const next = [...draft.sections];
                    next[s] = { ...next[s], heading: e.target.value };
                    setDraft({ ...draft, sections: next });
                  }}
                />
              </AdField>
              {section.blocks.map((block, b) => (
                <div key={b} className="ad-block-row">
                  {block.kind === "paragraph" ? (
                    <AdField
                      id={`legal-block-${s}-${b}`}
                      label="Paragraph"
                      required
                      error={err(`sections.${s}.blocks.${b}.text`)}
                    >
                      <TextArea
                        id={`legal-block-${s}-${b}`}
                        rows={4}
                        value={block.text}
                        error={err(`sections.${s}.blocks.${b}.text`)}
                        onChange={(e) => {
                          const next = [...draft.sections];
                          const blocks = [...next[s].blocks];
                          blocks[b] = { kind: "paragraph", text: e.target.value };
                          next[s] = { ...next[s], blocks };
                          setDraft({ ...draft, sections: next });
                        }}
                      />
                    </AdField>
                  ) : (
                    <StringList
                      label="Bullet list"
                      addLabel="Add bullet"
                      emptyText="No bullets yet."
                      items={block.items}
                      itemError={(i) => err(`sections.${s}.blocks.${b}.items.${i}`)}
                      onChange={(i, value) => {
                        const next = [...draft.sections];
                        const blocks = [...next[s].blocks];
                        const current = blocks[b];
                        if (current.kind !== "list") return;
                        const items = [...current.items];
                        items[i] = value;
                        blocks[b] = { kind: "list", items };
                        next[s] = { ...next[s], blocks };
                        setDraft({ ...draft, sections: next });
                      }}
                      onAdd={() => {
                        const next = [...draft.sections];
                        const blocks = [...next[s].blocks];
                        const current = blocks[b];
                        if (current.kind !== "list") return;
                        blocks[b] = { kind: "list", items: [...current.items, ""] };
                        next[s] = { ...next[s], blocks };
                        setDraft({ ...draft, sections: next });
                      }}
                      onRemove={(i) => {
                        const next = [...draft.sections];
                        const blocks = [...next[s].blocks];
                        const current = blocks[b];
                        if (current.kind !== "list") return;
                        blocks[b] = {
                          kind: "list",
                          items: current.items.filter((_, j) => j !== i),
                        };
                        next[s] = { ...next[s], blocks };
                        setDraft({ ...draft, sections: next });
                      }}
                      onMove={(i, direction) => {
                        const next = [...draft.sections];
                        const blocks = [...next[s].blocks];
                        const current = blocks[b];
                        if (current.kind !== "list") return;
                        const target = i + direction;
                        if (target < 0 || target >= current.items.length) return;
                        const items = [...current.items];
                        const [moved] = items.splice(i, 1);
                        items.splice(target, 0, moved);
                        blocks[b] = { kind: "list", items };
                        next[s] = { ...next[s], blocks };
                        setDraft({ ...draft, sections: next });
                      }}
                    />
                  )}
                  <p className="ad-inquiry-actions">
                    <span className="ad-string-actions">
                      <button
                        type="button"
                        className="ad-icon-button"
                        disabled={b === 0 || busy}
                        aria-label="Move block up"
                        title="Move up"
                        onClick={() => {
                          const next = [...draft.sections];
                          const blocks = [...next[s].blocks];
                          const [moved] = blocks.splice(b, 1);
                          blocks.splice(b - 1, 0, moved);
                          next[s] = { ...next[s], blocks };
                          setDraft({ ...draft, sections: next });
                        }}
                      >
                        <ArrowUp size={16} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="ad-icon-button"
                        disabled={b === section.blocks.length - 1 || busy}
                        aria-label="Move block down"
                        title="Move down"
                        onClick={() => {
                          const next = [...draft.sections];
                          const blocks = [...next[s].blocks];
                          const [moved] = blocks.splice(b, 1);
                          blocks.splice(b + 1, 0, moved);
                          next[s] = { ...next[s], blocks };
                          setDraft({ ...draft, sections: next });
                        }}
                      >
                        <ArrowDown size={16} aria-hidden="true" />
                      </button>
                    </span>
                    <button
                      type="button"
                      className="ad-button ad-button--tertiary"
                      onClick={() => {
                        void confirmDestructive({
                          title: "Remove this block?",
                          confirmText: "Remove",
                        }).then((confirmed) => {
                          if (!confirmed) return;
                          const next = [...draft.sections];
                          next[s] = {
                            ...next[s],
                            blocks: next[s].blocks.filter((_, j) => j !== b),
                          };
                          setDraft({ ...draft, sections: next });
                        });
                      }}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      Remove block
                    </button>
                  </p>
                </div>
              ))}
              <p className="ad-inquiry-actions">
                <button
                  type="button"
                  className="ad-button ad-button--secondary"
                  onClick={() => {
                    const next = [...draft.sections];
                    next[s] = {
                      ...next[s],
                      blocks: [...next[s].blocks, { kind: "paragraph", text: "" }],
                    };
                    setDraft({ ...draft, sections: next });
                  }}
                >
                  <Plus size={16} aria-hidden="true" />
                  Add paragraph
                </button>
                <button
                  type="button"
                  className="ad-button ad-button--secondary"
                  onClick={() => {
                    const next = [...draft.sections];
                    next[s] = {
                      ...next[s],
                      blocks: [...next[s].blocks, { kind: "list", items: [""] }],
                    };
                    setDraft({ ...draft, sections: next });
                  }}
                >
                  <Plus size={16} aria-hidden="true" />
                  Add bullet list
                </button>
                <button
                  type="button"
                  className="ad-button ad-button--secondary ad-button--danger"
                  onClick={() => {
                    void confirmDestructive({
                      title: `Remove section "${section.heading || `Section ${s + 1}`}"?`,
                      confirmText: "Remove",
                    }).then((confirmed) => {
                      if (confirmed) {
                        setDraft({ ...draft, sections: draft.sections.filter((_, j) => j !== s) });
                      }
                    });
                  }}
                >
                  <Trash2 size={16} aria-hidden="true" />
                  Remove section
                </button>
              </p>
            </section>
          ))}
          <p>
            <button
              type="button"
              className="ad-button ad-button--primary"
              onClick={() => setDraft({ ...draft, sections: [...draft.sections, blankSection()] })}
            >
              <Plus size={16} aria-hidden="true" />
              Add section
            </button>
          </p>

          <p className="ad-inquiry-actions">
            <button
              type="button"
              className="ad-button ad-button--primary"
              disabled={busy}
              onClick={() => void saveDraft()}
            >
              {busy ? "Saving..." : "Save changes"}
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
      <section className="ad-panel" aria-label="Legal pages">
        <div className="ad-panel-head">
          <div>
            <h2>Legal pages</h2>
            <p className="ad-panel-lede">
              Privacy policy and terms copy. Select a page to edit its words.
            </p>
          </div>
        </div>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th scope="col">Page</th>
                <th scope="col">Public URL</th>
                <th scope="col">Sections</th>
              </tr>
            </thead>
            <tbody>
              {LEGAL_PAGES.map((page) => (
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
                  aria-label={`Edit ${page.label}`}
                >
                  <td>
                    <strong>{page.label}</strong>
                  </td>
                  <td className="ad-table-muted">{page.href}</td>
                  <td>{records[page.key].sections.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
