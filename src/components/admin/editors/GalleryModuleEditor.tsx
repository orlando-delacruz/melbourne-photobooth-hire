// Gallery module: list -> detail -> edit/delete, list -> Add Gallery -> create.
// Highlight determines homepage showcase membership; images use real uploads.

import { useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import type { GalleryItem } from "../../../lib/cms/types";
import { galleryModuleSchema } from "../../../lib/cms/schemas";
import { createId } from "../../../lib/cms/ids";
import { AdField, ImageField, Notice, Skeleton } from "../fields";
import { Panel } from "../groups";
import {
  DetailRow,
  HighlightPill,
  ModuleBulkBar,
  ModuleImage,
  ModuleThumb,
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

function blankGallery(): GalleryItem {
  return {
    id: createId("gallery"),
    image: { key: null, src: "", alt: "" },
    caption: "",
    highlight: false,
  };
}

function itemTitle(item: GalleryItem, index: number): string {
  return item.caption || item.image.alt || `Image ${index + 1}`;
}

/**
 * Highlight-first ordering for the admin gallery list. Highlighted images
 * always sit above non-highlighted ones; relative order is preserved inside
 * each group so untouched rows never jump. When `movedId` is given (the item
 * whose highlight state just changed, or a new image) it is re-inserted at
 * the end of its group. The persisted `sort_order` follows this array order,
 * so the grouping survives a refresh.
 */
function orderByHighlight(items: GalleryItem[], movedId?: string): GalleryItem[] {
  const highlighted = items.filter((item) => item.highlight && item.id !== movedId);
  const rest = items.filter((item) => !item.highlight && item.id !== movedId);
  const moved = movedId ? items.find((item) => item.id === movedId) : undefined;
  if (!moved) return [...highlighted, ...rest];
  return moved.highlight ? [...highlighted, moved, ...rest] : [...highlighted, ...rest, moved];
}

export default function GalleryModuleEditor() {
  const store = useModuleList<GalleryItem>("mod-gallery");
  const [view, setView] = useState<View>({ name: "list" });
  const [draft, setDraft] = useState<GalleryItem | null>(null);
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
    setDraft(blankGallery());
    setErrors(new Map());
    store.setNotice(null);
    setView({ name: "create" });
  };

  const openEdit = (item: GalleryItem) => {
    setDraft({ ...item, image: { ...item.image } });
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
    const parsed = galleryModuleSchema.element.safeParse(draft);
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
    const saved = parsed.data as GalleryItem;
    const previous = isEdit ? items.find((item) => item.id === draft.id) : undefined;
    const base = isEdit
      ? items.map((item) => (item.id === draft.id ? saved : item))
      : [...items, saved];
    // Reposition only when the group membership changed (or on create);
    // untouched rows keep their relative order inside their group.
    const regroup = !isEdit || previous?.highlight !== saved.highlight;
    const next = orderByHighlight(base, regroup ? saved.id : undefined);
    const ok = await store.persist(next);
    if (!ok) return;
    setDraft(null);
    setErrors(new Map());
    void notifySuccess(isEdit ? "Gallery image updated." : "Gallery image added.");
    setView({ name: "list" });
  };

  const deleteSelected = async () => {
    if (!selected) return;
    const index = items.findIndex((item) => item.id === selected.id);
    const ok = await store.removeById(selected.id, itemTitle(selected, index < 0 ? 0 : index));
    if (ok) setView({ name: "list" });
  };

  const deleteSelectedMany = async () => {
    const ok = await store.removeMany([...selection.selectedIds], undefined, "images");
    if (ok) selection.clear();
  };

  // Reordering is confined to a highlight group: the arrows never cross the
  // boundary between highlighted and non-highlighted images (that grouping is
  // controlled by the highlight toggle, not by manual reordering).
  const canMove = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    return (
      target >= 0 && target < items.length && items[target].highlight === items[index].highlight
    );
  };

  const moveAndSave = async (id: string, direction: -1 | 1) => {
    const index = items.findIndex((item) => item.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= items.length) return;
    if (items[target].highlight !== items[index].highlight) return;
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
            {isEdit ? "Back to detail" : "Back to gallery"}
          </button>
        </p>
        <Panel
          title={isEdit ? "Edit gallery image" : "Add Gallery"}
          lede={
            isEdit
              ? "Replace the image or update its caption and highlight, then save."
              : "Upload a new event photo, add its caption, then save."
          }
        >
          <ImageField
            legend="Gallery image."
            value={draft.image}
            onChange={(image) => setDraft({ ...draft, image })}
            includeCaption
            error={err("image")}
            altError={err("image.alt")}
          />
          <AdField
            id="gal-highlight"
            label="Highlighted for homepage"
            required
            hint="Turned-on images appear in the homepage showcase and move to the top of this list."
            error={err("highlight")}
          >
            <label className="ad-toggle">
              <input
                id="gal-highlight"
                type="checkbox"
                checked={draft.highlight}
                onChange={(e) => setDraft({ ...draft, highlight: e.target.checked })}
              />
              <span>{draft.highlight ? "Shown on homepage" : "Hidden from homepage"}</span>
            </label>
          </AdField>
          <p className="ad-inquiry-actions">
            <button
              type="button"
              className="ad-button ad-button--primary"
              disabled={store.busy}
              onClick={() => void saveDraft()}
            >
              {store.busy ? "Saving..." : isEdit ? "Save changes" : "Add image"}
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
    const index = items.findIndex((item) => item.id === selected.id);
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
            Back to gallery
          </button>
        </p>
        <section className="ad-panel" aria-label={itemTitle(selected, index < 0 ? 0 : index)}>
          <div className="ad-panel-head">
            <div>
              <h2>{itemTitle(selected, index < 0 ? 0 : index).slice(0, 60)}</h2>
              <p className="ad-panel-lede">Gallery image detail.</p>
            </div>
            <span className="ad-panel-action">
              <HighlightPill on={selected.highlight} />
            </span>
          </div>
          <ModuleImage image={selected.image} caption={selected.caption} />
          <dl className="ad-detail-list">
            <DetailRow
              label="Gallery position"
              value={index >= 0 ? `${index + 1} of ${items.length}` : "-"}
            />
            <DetailRow label="Caption" value={selected.caption ?? ""} />
            <DetailRow label="Image alt text" value={selected.image.alt} />
            <DetailRow
              label="Homepage"
              value={selected.highlight ? "Shown on homepage" : "Hidden from homepage"}
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
      <section className="ad-panel" aria-label="All gallery images">
        <div className="ad-panel-head">
          <div>
            <h2>All gallery images</h2>
            <p className="ad-panel-lede">
              {items.length} {items.length === 1 ? "image" : "images"} — highlighted images always
              sit above non-highlighted ones. Changing an image's highlight moves it into its new
              group automatically; the arrows reorder within a group.
            </p>
          </div>
          <span className="ad-panel-action">
            <button type="button" className="ad-button ad-button--primary" onClick={openCreate}>
              <Plus size={16} aria-hidden="true" />
              Add Gallery
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
            <h3>No images</h3>
            <p>Add the first event photo with the Add Gallery button above.</p>
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
                      label="Select all gallery images"
                    />
                  </th>
                  <th scope="col">Position</th>
                  <th scope="col">Preview</th>
                  <th scope="col">Caption</th>
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
                    aria-label={`View ${itemTitle(item, index)}`}
                  >
                    <td className="ad-select-cell">
                      <RowSelectCheckbox
                        checked={selection.isSelected(item.id)}
                        disabled={store.busy}
                        label={`Select ${itemTitle(item, index)}`}
                        onChange={() => selection.toggle(item.id)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>
                      <ModuleThumb image={item.image} />
                    </td>
                    <td>
                      <strong>{itemTitle(item, index).slice(0, 60)}</strong>
                      {item.image.alt && item.caption !== item.image.alt ? (
                        <span className="ad-table-muted">
                          <br />
                          {item.image.alt.slice(0, 80)}
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
                          disabled={!canMove(index, -1) || store.busy}
                          aria-label={`Move ${itemTitle(item, index)} up`}
                          title={
                            items[index - 1] && items[index - 1].highlight !== item.highlight
                              ? "Move within the highlight group only"
                              : "Move up"
                          }
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
                          disabled={!canMove(index, 1) || store.busy}
                          aria-label={`Move ${itemTitle(item, index)} down`}
                          title={
                            items[index + 1] && items[index + 1].highlight !== item.highlight
                              ? "Move within the highlight group only"
                              : "Move down"
                          }
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
