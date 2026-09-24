// Event Types module: list -> detail -> edit/delete, list -> Add Event Type
// -> create. Array order is the contact-form dropdown order, adjusted with
// the row move buttons. Labels feed the public inquiry form.

import { useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import type { EventTypeItem } from "../../../lib/cms/types";
import { eventTypesModuleSchema } from "../../../lib/cms/schemas";
import { createId } from "../../../lib/cms/repository";
import { AdField, Notice, Skeleton, TextInput } from "../fields";
import { Panel } from "../groups";
import { DetailRow, toFieldErrors, useModuleList } from "../ModuleCrud";
import { notifySuccess } from "../alerts";

type View =
  | { name: "list" }
  | { name: "detail"; id: string }
  | { name: "create" }
  | { name: "edit"; id: string };

function blankEventType(): EventTypeItem {
  return { id: createId("event-type"), label: "" };
}

export default function EventTypesModuleEditor() {
  const store = useModuleList<EventTypeItem>("mod-event-types");
  const [view, setView] = useState<View>({ name: "list" });
  const [draft, setDraft] = useState<EventTypeItem | null>(null);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  if (!store.loaded || !store.items) return <Skeleton />;
  const items = store.items;

  const selected =
    (view.name === "detail" || view.name === "edit"
      ? (items.find((item) => item.id === view.id) ?? null)
      : null) ?? null;

  const openCreate = () => {
    setDraft(blankEventType());
    setErrors(new Map());
    store.setNotice(null);
    setView({ name: "create" });
  };

  const openEdit = (item: EventTypeItem) => {
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
    const parsed = eventTypesModuleSchema.element.safeParse(draft);
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
    const saved = parsed.data as EventTypeItem;
    const next = isEdit
      ? items.map((item) => (item.id === draft.id ? saved : item))
      : [...items, saved];
    const ok = await store.persist(next);
    if (!ok) return;
    setDraft(null);
    setErrors(new Map());
    void notifySuccess(isEdit ? "Event type updated." : "Event type added.");
    setView({ name: "list" });
  };

  const deleteSelected = async () => {
    if (!selected) return;
    const ok = await store.removeById(selected.id, selected.label || "this event type");
    if (ok) setView({ name: "list" });
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
            {isEdit ? "Back to detail" : "Back to event types"}
          </button>
        </p>
        <Panel
          title={isEdit ? "Edit event type" : "Add Event Type"}
          lede={
            isEdit
              ? "Update the label shown in the contact form dropdown, then save."
              : "Add a new option for the contact form dropdown, then save."
          }
        >
          <AdField
            id="et-label"
            label="Label"
            required
            hint="Shown exactly as written in the contact form dropdown."
            error={err("label")}
          >
            <TextInput
              id="et-label"
              type="text"
              value={draft.label}
              error={err("label")}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
            />
          </AdField>
          <p className="ad-inquiry-actions">
            <button
              type="button"
              className="ad-button ad-button--primary"
              disabled={store.busy}
              onClick={() => void saveDraft()}
            >
              {store.busy ? "Saving..." : isEdit ? "Save changes" : "Add event type"}
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
            Back to event types
          </button>
        </p>
        <section className="ad-panel" aria-label={selected.label}>
          <div className="ad-panel-head">
            <div>
              <h2>{selected.label}</h2>
              <p className="ad-panel-lede">Contact form dropdown option.</p>
            </div>
          </div>
          <dl className="ad-detail-list">
            <DetailRow label="Label" value={selected.label} />
            <DetailRow
              label="Dropdown position"
              value={position > 0 ? `${position} of ${items.length}` : "-"}
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
      <section className="ad-panel" aria-label="All event types">
        <div className="ad-panel-head">
          <div>
            <h2>All event types</h2>
            <p className="ad-panel-lede">
              {items.length} {items.length === 1 ? "option" : "options"} in dropdown order. Select a
              row for detail, or use the arrows to reorder.
            </p>
          </div>
          <span className="ad-panel-action">
            <button type="button" className="ad-button ad-button--primary" onClick={openCreate}>
              <Plus size={16} aria-hidden="true" />
              Add Event Type
            </button>
          </span>
        </div>
        {items.length === 0 ? (
          <div className="ad-empty">
            <h3>No event types</h3>
            <p>Add the first dropdown option with the Add Event Type button above.</p>
          </div>
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th scope="col">Position</th>
                  <th scope="col">Label</th>
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
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setView({ name: "detail", id: item.id });
                      }
                    }}
                    aria-label={`View ${item.label || "event type"}`}
                  >
                    <td>{index + 1}</td>
                    <td>
                      <strong>{item.label || "Untitled event type"}</strong>
                    </td>
                    <td>
                      <span className="ad-string-actions">
                        <button
                          type="button"
                          className="ad-icon-button"
                          disabled={index === 0 || store.busy}
                          aria-label={`Move ${item.label || "event type"} up`}
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
                          aria-label={`Move ${item.label || "event type"} down`}
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
