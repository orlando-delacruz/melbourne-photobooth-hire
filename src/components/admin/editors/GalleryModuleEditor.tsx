// Gallery module: list -> detail -> edit/delete, list -> Add Gallery -> create.
// Highlight determines homepage showcase membership; images use real uploads.

import { useState } from "react";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import type { GalleryItem } from "../../../lib/cms/types";
import { galleryModuleSchema } from "../../../lib/cms/schemas";
import { createId } from "../../../lib/cms/repository";
import { AdField, ImageField, Notice, Skeleton } from "../fields";
import { Panel } from "../groups";
import {
  DetailRow,
  HighlightPill,
  ModuleImage,
  ModuleThumb,
  toFieldErrors,
  useModuleList,
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

export default function GalleryModuleEditor() {
  const store = useModuleList<GalleryItem>("mod-gallery");
  const [view, setView] = useState<View>({ name: "list" });
  const [draft, setDraft] = useState<GalleryItem | null>(null);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

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
    const next = isEdit
      ? items.map((item) => (item.id === draft.id ? saved : item))
      : [...items, saved];
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
            hint="Turned-on images appear in the homepage showcase."
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
              {items.length} {items.length === 1 ? "image" : "images"}. Select a row to view the
              full detail, then edit or delete it.
            </p>
          </div>
          <span className="ad-panel-action">
            <button type="button" className="ad-button ad-button--primary" onClick={openCreate}>
              <Plus size={16} aria-hidden="true" />
              Add Gallery
            </button>
          </span>
        </div>
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
                  <th scope="col">Preview</th>
                  <th scope="col">Caption</th>
                  <th scope="col">Highlight</th>
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
                    aria-label={`View ${itemTitle(item, index)}`}
                  >
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
