// FAQs module: list -> detail -> edit/delete, list -> Add FAQ -> create.
// Highlighted questions feed the homepage teaser (first four).

import { useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import type { FaqItem } from "../../../lib/cms/types";
import { faqsModuleSchema } from "../../../lib/cms/schemas";
import { createId } from "../../../lib/cms/ids";
import { AdField, Notice, Skeleton, TextArea, TextInput } from "../fields";
import { Panel } from "../groups";
import {
  DetailRow,
  HighlightPill,
  ModuleBulkBar,
  RowSelectCheckbox,
  SelectAllCheckbox,
  toFieldErrors,
  useModuleList,
  useModuleSelection,
} from "../ModuleCrud";
import { notifySuccess } from "../alerts";

type View =
  | { name: "list" }
  | { name: "detail"; id: string }
  | { name: "create" }
  | { name: "edit"; id: string };

function blankFaq(): FaqItem {
  return { id: createId("faq"), question: "", answer: "", highlight: true };
}

export default function FaqsModuleEditor() {
  const store = useModuleList<FaqItem>("mod-faqs");
  const [view, setView] = useState<View>({ name: "list" });
  const [draft, setDraft] = useState<FaqItem | null>(null);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const selection = useModuleSelection(store.items ? store.items.map((item) => item.id) : []);

  // Leaving the list (detail or create/edit) drops any pending selection.
  useEffect(() => {
    if (view.name !== "list") selection.clear();
  }, [view.name, selection.clear]);

  if (!store.loaded || !store.items) return <Skeleton />;
  const items = store.items;

  const selected =
    (view.name === "detail" || view.name === "edit"
      ? (items.find((item) => item.id === view.id) ?? null)
      : null) ?? null;

  const openCreate = () => {
    setDraft(blankFaq());
    setErrors(new Map());
    store.setNotice(null);
    setView({ name: "create" });
  };

  const openEdit = (item: FaqItem) => {
    setDraft({ ...item });
    setErrors(new Map());
    store.setNotice(null);
    setView({ name: "edit", id: item.id });
  };

  const cancelForm = () => {
    if (view.name === "edit" && view.id) setView({ name: "detail", id: view.id });
    else setView({ name: "list" });
    setDraft(null);
    setErrors(new Map());
  };

  const saveDraft = async () => {
    if (!draft) return;
    const parsed = faqsModuleSchema.element.safeParse(draft);
    if (!parsed.success) {
      const { map, lines } = toFieldErrors(parsed.error.issues);
      setErrors(map);
      store.setNotice({
        tone: "error",
        title:
          lines.length === 1
            ? "One field needs attention before saving."
            : `${lines.length} fields need attention before saving.`,
        list: lines,
      });
      return;
    }
    const isEdit = view.name === "edit";
    const saved = parsed.data as FaqItem;
    const next = isEdit
      ? items.map((item) => (item.id === draft.id ? saved : item))
      : [...items, saved];
    const ok = await store.persist(next);
    if (!ok) return;
    setDraft(null);
    setErrors(new Map());
    void notifySuccess(isEdit ? "FAQ updated." : "FAQ added.");
    setView({ name: "list" });
  };

  const deleteSelected = async () => {
    if (!selected) return;
    const ok = await store.removeById(selected.id, selected.question.slice(0, 70) || "this FAQ");
    if (ok) setView({ name: "list" });
  };

  const deleteSelectedMany = async () => {
    const ok = await store.removeMany([...selection.selectedIds], undefined, "FAQs");
    if (ok) selection.clear();
  };

  const moveAndSave = async (id: string, direction: -1 | 1) => {
    const index = items.findIndex((item) => item.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    await store.persist(next);
  };

  if ((view.name === "create" || view.name === "edit") && draft) {
    const isEdit = view.name === "edit";
    const err = (field: string) => errors.get(field);
    return (
      <div className="ad-stack">
        {store.notice ? (
          <Notice tone={store.notice.tone} title={store.notice.title} list={store.notice.list}>
            {store.notice.body ? <p>{store.notice.body}</p> : null}
          </Notice>
        ) : null}
        <p>
          <button type="button" className="ad-button ad-button--secondary" onClick={cancelForm}>
            <ArrowLeft size={16} aria-hidden="true" />
            {isEdit ? "Back to detail" : "Back to FAQs"}
          </button>
        </p>
        <Panel
          title={isEdit ? "Edit FAQ" : "Add FAQ"}
          lede={
            isEdit
              ? "Update the question, answer and highlight, then save."
              : "Write the new question and answer, then save."
          }
        >
          <AdField id="faq-question" label="Question" required error={err("question")}>
            <TextInput
              id="faq-question"
              type="text"
              value={draft.question}
              error={err("question")}
              onChange={(e) => setDraft({ ...draft, question: e.target.value })}
            />
          </AdField>
          <AdField id="faq-answer" label="Answer" required error={err("answer")}>
            <TextArea
              id="faq-answer"
              rows={5}
              value={draft.answer}
              error={err("answer")}
              onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
            />
          </AdField>
          <AdField
            id="faq-highlight"
            label="Highlighted for homepage"
            required
            hint="Turned-on questions are eligible for the homepage teaser (first four)."
            error={err("highlight")}
          >
            <label className="ad-toggle">
              <input
                id="faq-highlight"
                type="checkbox"
                checked={draft.highlight}
                onChange={(e) => setDraft({ ...draft, highlight: e.target.checked })}
              />
              <span>{draft.highlight ? "Eligible for homepage" : "Not on homepage"}</span>
            </label>
          </AdField>
          <p className="ad-inquiry-actions">
            <button
              type="button"
              className="ad-button ad-button--primary"
              disabled={store.busy}
              onClick={() => void saveDraft()}
            >
              {store.busy ? "Saving..." : isEdit ? "Save changes" : "Add FAQ"}
            </button>
            <button type="button" className="ad-button ad-button--secondary" onClick={cancelForm}>
              Cancel
            </button>
          </p>
        </Panel>
      </div>
    );
  }

  if (view.name === "detail" && selected) {
    const position = items.findIndex((item) => item.id === selected.id) + 1;
    return (
      <div className="ad-stack">
        {store.notice ? (
          <Notice tone={store.notice.tone} title={store.notice.title} list={store.notice.list}>
            {store.notice.body ? <p>{store.notice.body}</p> : null}
          </Notice>
        ) : null}
        <p>
          <button
            type="button"
            className="ad-button ad-button--secondary"
            onClick={() => setView({ name: "list" })}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to FAQs
          </button>
        </p>
        <section className="ad-panel" aria-label={selected.question}>
          <div className="ad-panel-head">
            <div>
              <h2>{selected.question}</h2>
              <p className="ad-panel-lede">FAQ detail.</p>
            </div>
            <span className="ad-panel-action">
              <HighlightPill on={selected.highlight} />
            </span>
          </div>
          <dl className="ad-detail-list">
            <DetailRow
              label="List position"
              value={position > 0 ? `${position} of ${items.length}` : "-"}
            />
            <DetailRow label="Question" value={selected.question} />
            <DetailRow label="Answer" value={selected.answer} />
            <DetailRow
              label="Homepage"
              value={selected.highlight ? "Eligible for homepage" : "Not on homepage"}
            />
          </dl>
          <p className="ad-inquiry-actions">
            <button
              type="button"
              className="ad-button ad-button--primary"
              onClick={() => openEdit(selected)}
            >
              <Pencil size={16} aria-hidden="true" />
              Edit
            </button>
            <button
              type="button"
              className="ad-button ad-button--secondary ad-button--danger"
              disabled={store.busy}
              onClick={() => void deleteSelected()}
            >
              <Trash2 size={16} aria-hidden="true" />
              {store.busy ? "Deleting..." : "Delete"}
            </button>
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="ad-stack">
      {store.notice ? (
        <Notice tone={store.notice.tone} title={store.notice.title} list={store.notice.list}>
          {store.notice.body ? <p>{store.notice.body}</p> : null}
        </Notice>
      ) : null}
      <section className="ad-panel" aria-label="All FAQs">
        <div className="ad-panel-head">
          <div>
            <h2>All FAQs</h2>
            <p className="ad-panel-lede">
              {items.length} {items.length === 1 ? "question" : "questions"} in display order.
              Select a row to view the full answer, then edit or delete it, or use the arrows to
              reorder.
            </p>
          </div>
          <span className="ad-panel-action">
            <button type="button" className="ad-button ad-button--primary" onClick={openCreate}>
              <Plus size={16} aria-hidden="true" />
              Add FAQ
            </button>
          </span>
        </div>
        <ModuleBulkBar
          count={selection.count}
          busy={store.busy}
          onDelete={() => void deleteSelectedMany()}
          onClear={selection.clear}
        />
        {items.length === 0 ? (
          <div className="ad-empty">
            <h3>No questions</h3>
            <p>Add the first question with the Add FAQ button above.</p>
          </div>
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th scope="col" className="ad-select-cell">
                    <SelectAllCheckbox
                      checked={selection.allSelected}
                      indeterminate={selection.someSelected}
                      disabled={store.busy}
                      onChange={selection.toggleAll}
                      label="Select all FAQs"
                    />
                  </th>
                  <th scope="col">Position</th>
                  <th scope="col">Question</th>
                  <th scope="col">Highlight</th>
                  <th scope="col">Reorder</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.id}
                    className="ad-table-rowlink"
                    tabIndex={0}
                    onClick={() => setView({ name: "detail", id: item.id })}
                    onKeyDown={(event) => {
                      if (event.target !== event.currentTarget) return;
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setView({ name: "detail", id: item.id });
                      }
                    }}
                    aria-label={`View ${item.question.slice(0, 70) || "FAQ"}`}
                  >
                    <td className="ad-select-cell">
                      <RowSelectCheckbox
                        checked={selection.isSelected(item.id)}
                        disabled={store.busy}
                        label={`Select ${(item.question || "FAQ").slice(0, 50)}`}
                        onChange={() => selection.toggle(item.id)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{(item.question || "Untitled question").slice(0, 90)}</strong>
                      {item.answer ? (
                        <span className="ad-table-muted ad-hide-sm">
                          <br />
                          {item.answer.slice(0, 110)}
                        </span>
                      ) : null}
                    </td>
                    <td>
                      <HighlightPill on={item.highlight} onLabel="On" offLabel="Off" />
                    </td>
                    <td>
                      <span className="ad-string-actions">
                        <button
                          type="button"
                          className="ad-icon-button"
                          disabled={index === 0 || store.busy}
                          aria-label={`Move ${(item.question || "FAQ").slice(0, 50)} up`}
                          title="Move up"
                          onClick={(event) => {
                            event.stopPropagation();
                            void moveAndSave(item.id, -1);
                          }}
                        >
                          <ArrowUp size={16} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="ad-icon-button"
                          disabled={index === items.length - 1 || store.busy}
                          aria-label={`Move ${(item.question || "FAQ").slice(0, 50)} down`}
                          title="Move down"
                          onClick={(event) => {
                            event.stopPropagation();
                            void moveAndSave(item.id, 1);
                          }}
                        >
                          <ArrowDown size={16} aria-hidden="true" />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
