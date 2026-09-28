// Testimonials module: list -> detail -> edit/delete, list -> Add review ->
// create, plus review moderation (DEC-035). Array order is the homepage
// marquee order, adjusted with the row move buttons. Only approved reviews
// show publicly (enforced by RLS); pending reviews await approval and
// rejected reviews stay hidden, while all three are managed here. An empty
// approved list hides the homepage reviews section.

import { useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, Check, Pencil, Plus, Trash2, X } from "lucide-react";
import type { ReviewStatus, TestimonialItem } from "../../../lib/cms/types";
import { testimonialsModuleSchema } from "../../../lib/cms/schemas";
import { createId } from "../../../lib/cms/ids";
import { setTestimonialStatus } from "../../../lib/supabase/modules";
import { AdField, AdSelect, Notice, Skeleton, TextArea, TextInput } from "../fields";
import { Panel, RATING_OPTIONS } from "../groups";
import { DetailRow, HighlightPill, toFieldErrors, useModuleList } from "../ModuleCrud";
import { confirmDestructive, notifyError, notifySuccess } from "../alerts";

type View =
  | { name: "list" }
  | { name: "detail"; id: string }
  | { name: "create" }
  | { name: "edit"; id: string };

function blankTestimonial(): TestimonialItem {
  return {
    id: createId("testimonial"),
    quote: "",
    name: "",
    eventType: "",
    rating: undefined,
    status: "approved",
  };
}

function ratingLabel(rating: number | undefined): string {
  if (!rating) return "No rating";
  return rating === 1 ? "1 star" : `${rating} stars`;
}

function statusLabel(status: ReviewStatus): string {
  return status === "approved" ? "Approved" : status === "pending" ? "Pending" : "Rejected";
}

function submittedLabel(item: TestimonialItem): string {
  if (!item.createdAt) return "-";
  try {
    return new Date(item.createdAt).toLocaleString("en-AU", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

function StatusPill({ status }: { status: ReviewStatus }) {
  if (status === "pending") {
    return <span className="ad-badge ad-badge--warning">Pending</span>;
  }
  return <HighlightPill on={status === "approved"} onLabel="Approved" offLabel="Rejected" />;
}

export default function TestimonialsModuleEditor() {
  const store = useModuleList<TestimonialItem>("mod-testimonials");
  const [view, setView] = useState<View>({ name: "list" });
  const [draft, setDraft] = useState<TestimonialItem | null>(null);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  if (!store.loaded || !store.items) return <Skeleton />;
  const items = store.items;

  const selected =
    (view.name === "detail" || view.name === "edit"
      ? (items.find((item) => item.id === view.id) ?? null)
      : null) ?? null;

  const openCreate = () => {
    setDraft(blankTestimonial());
    setErrors(new Map());
    store.setNotice(null);
    setView({ name: "create" });
  };

  const openEdit = (item: TestimonialItem) => {
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
    const parsed = testimonialsModuleSchema.element.safeParse(draft);
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
    const saved = parsed.data as TestimonialItem;
    const next = isEdit
      ? items.map((item) => (item.id === draft.id ? saved : item))
      : [...items, saved];
    const ok = await store.persist(next);
    if (!ok) return;
    setDraft(null);
    setErrors(new Map());
    void notifySuccess(isEdit ? "Testimonial updated." : "Testimonial added.");
    setView({ name: "list" });
  };

  const deleteSelected = async () => {
    if (!selected) return;
    const ok = await store.removeById(selected.id, selected.name || "this testimonial");
    if (ok) setView({ name: "list" });
  };

  const moderateSelected = async (status: ReviewStatus) => {
    if (!selected || store.busy) return;
    const approving = status === "approved";
    const confirmed = await confirmDestructive({
      title: `${approving ? "Approve" : "Reject"} "${selected.name || "this testimonial"}"?`,
      text: approving
        ? "It will appear on the public homepage."
        : "It will stay hidden from the public website.",
      confirmText: approving ? "Approve" : "Reject",
    });
    if (!confirmed) return;
    try {
      await setTestimonialStatus(selected.id, status);
    } catch {
      void notifyError("The review status could not be updated.", "Please try again.");
      return;
    }
    const ok = await store.reload();
    if (ok) {
      void notifySuccess(approving ? "Review approved." : "Review rejected.");
      setView({ name: "list" });
    }
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
            {isEdit ? "Back to detail" : "Back to testimonials"}
          </button>
        </p>
        <Panel
          title={isEdit ? "Edit testimonial" : "Add testimonial"}
          lede={
            isEdit
              ? "Update the quote, name, event type and rating, then save."
              : "Write the new review, then save. Reviews added here are approved and appear on the homepage in list order."
          }
        >
          <AdField id="tm-quote" label="Quote" required error={err("quote")}>
            <TextArea
              id="tm-quote"
              rows={4}
              value={draft.quote}
              error={err("quote")}
              onChange={(e) => setDraft({ ...draft, quote: e.target.value })}
            />
          </AdField>
          <div className="ad-grid-2">
            <AdField id="tm-name" label="Name" required error={err("name")}>
              <TextInput
                id="tm-name"
                type="text"
                value={draft.name}
                error={err("name")}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </AdField>
            <AdField id="tm-event" label="Event type" required error={err("eventType")}>
              <TextInput
                id="tm-event"
                type="text"
                value={draft.eventType}
                error={err("eventType")}
                onChange={(e) => setDraft({ ...draft, eventType: e.target.value })}
              />
            </AdField>
          </div>
          <AdField
            id="tm-rating"
            label="Star rating"
            hint="Leave as no rating unless a rating is confirmed."
            error={err("rating")}
          >
            <AdSelect
              id="tm-rating"
              value={draft.rating == null ? "" : String(draft.rating)}
              error={err("rating")}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  rating: e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
            >
              {RATING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </AdSelect>
          </AdField>
          <p className="ad-inquiry-actions">
            <button
              type="button"
              className="ad-button ad-button--primary"
              disabled={store.busy}
              onClick={() => void saveDraft()}
            >
              {store.busy ? "Saving..." : isEdit ? "Save changes" : "Add testimonial"}
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
            Back to testimonials
          </button>
        </p>
        <section className="ad-panel" aria-label={selected.name || "Testimonial"}>
          <div className="ad-panel-head">
            <div>
              <h2>{selected.name || "Untitled testimonial"}</h2>
              <p className="ad-panel-lede">
                Homepage review · <StatusPill status={selected.status} />
              </p>
            </div>
          </div>
          <dl className="ad-detail-list">
            <DetailRow label="Status" value={statusLabel(selected.status)} />
            <DetailRow label="Submitted" value={submittedLabel(selected)} />
            <DetailRow label="Quote" value={selected.quote} />
            <DetailRow label="Name" value={selected.name} />
            <DetailRow label="Event type" value={selected.eventType} />
            <DetailRow label="Rating" value={ratingLabel(selected.rating)} />
            <DetailRow
              label="Marquee position"
              value={position > 0 ? `${position} of ${items.length}` : "-"}
            />
          </dl>
          <p className="ad-inquiry-actions">
            {selected.status === "pending" ? (
              <>
                <button
                  type="button"
                  className="ad-button ad-button--primary"
                  disabled={store.busy}
                  onClick={() => void moderateSelected("approved")}
                >
                  <Check size={16} aria-hidden="true" />
                  {store.busy ? "Working..." : "Approve"}
                </button>
                <button
                  type="button"
                  className="ad-button ad-button--secondary ad-button--danger"
                  disabled={store.busy}
                  onClick={() => void moderateSelected("rejected")}
                >
                  <X size={16} aria-hidden="true" />
                  {store.busy ? "Working..." : "Reject"}
                </button>
              </>
            ) : selected.status === "approved" ? (
              <button
                type="button"
                className="ad-button ad-button--secondary ad-button--danger"
                disabled={store.busy}
                onClick={() => void moderateSelected("rejected")}
              >
                <X size={16} aria-hidden="true" />
                {store.busy ? "Working..." : "Reject"}
              </button>
            ) : (
              <button
                type="button"
                className="ad-button ad-button--primary"
                disabled={store.busy}
                onClick={() => void moderateSelected("approved")}
              >
                <Check size={16} aria-hidden="true" />
                {store.busy ? "Working..." : "Approve"}
              </button>
            )}
            <button
              type="button"
              className="ad-button ad-button--secondary"
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
      <section className="ad-panel" aria-label="All testimonials">
        <div className="ad-panel-head">
          <div>
            <h2>All testimonials</h2>
            <p className="ad-panel-lede">
              {items.length} {items.length === 1 ? "review" : "reviews"} in homepage order,
              including reviews awaiting moderation. Only approved reviews show on the
              homepage. Select a row for detail, moderation and reorder.
            </p>
          </div>
          <span className="ad-panel-action">
            <button type="button" className="ad-button ad-button--primary" onClick={openCreate}>
              <Plus size={16} aria-hidden="true" />
              Add testimonial
            </button>
          </span>
        </div>
        {items.length === 0 ? (
          <div className="ad-empty">
            <h3>No testimonials</h3>
            <p>
              Add the first review with the Add testimonial button above. The homepage reviews
              section stays hidden while no approved review exists.
            </p>
          </div>
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th scope="col">Position</th>
                  <th scope="col">Review</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="ad-hide-sm">
                    Submitted
                  </th>
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
                    aria-label={`View ${item.name || "testimonial"}`}
                  >
                    <td>{index + 1}</td>
                    <td>
                      <strong>{(item.name || "Untitled testimonial").slice(0, 90)}</strong>
                      {item.quote ? (
                        <span className="ad-table-muted ad-hide-sm">
                          <br />
                          {item.quote.slice(0, 110)}
                        </span>
                      ) : null}
                    </td>
                    <td>
                      <StatusPill status={item.status} />
                    </td>
                    <td className="ad-hide-sm">{submittedLabel(item)}</td>
                    <td>
                      <span className="ad-string-actions">
                        <button
                          type="button"
                          className="ad-icon-button"
                          disabled={index === 0 || store.busy}
                          aria-label={`Move ${item.name || "testimonial"} up`}
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
                          aria-label={`Move ${item.name || "testimonial"} down`}
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
