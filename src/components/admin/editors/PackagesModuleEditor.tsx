// Packages module: list -> detail -> edit/delete, list -> Add Package -> create.
// Badge radio (None/Basic/Most Popular/Best Value/Custom) and highlight
// behave as before; Most Popular keeps the featured homepage treatment.

import { useState } from "react";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import type { BadgeType, PackageItem } from "../../../lib/cms/types";
import { BADGE_LABELS } from "../../../lib/cms/types";
import { packagesModuleSchema } from "../../../lib/cms/schemas";
import { createId } from "../../../lib/cms/repository";
import { AdField, ImageField, Notice, Skeleton, TextArea, TextInput } from "../fields";
import { Panel, StringList } from "../groups";
import { DetailRow, HighlightPill, ModuleImage, toFieldErrors, useModuleList } from "../ModuleCrud";
import { confirmDestructive, notifySuccess } from "../alerts";

type View =
  | { name: "list" }
  | { name: "detail"; id: string }
  | { name: "create" }
  | { name: "edit"; id: string };

const BADGE_OPTIONS: { value: BadgeType; label: string }[] = [
  { value: "none", label: "No badge" },
  { value: "basic", label: "Basic" },
  { value: "most-popular", label: "Most Popular" },
  { value: "best-value", label: "Best Value" },
  { value: "custom", label: "Custom badge" },
];

const BADGE_HINTS: Record<BadgeType, string> = {
  none: "The card renders without a badge.",
  basic: "Shows the Basic badge on the card.",
  "most-popular": "Applies the highlighted card treatment and the Most Popular badge.",
  "best-value": "Shows the Best Value badge, without the featured treatment.",
  custom: "Shows the custom badge text below.",
};

export function packageBadgeText(item: PackageItem): string {
  if (item.badgeType === "none") return "No badge";
  if (item.badgeType === "custom") return item.customBadge || "Custom";
  return BADGE_LABELS[item.badgeType];
}

function blankPackage(): PackageItem {
  return {
    id: createId("package"),
    name: "",
    summary: "",
    durationLabel: "",
    priceLabel: "",
    badgeType: "none",
    customBadge: "",
    inclusions: [],
    image: { key: null, src: "", alt: "" },
    highlight: false,
  };
}

export default function PackagesModuleEditor() {
  const store = useModuleList<PackageItem>("mod-packages");
  const [view, setView] = useState<View>({ name: "list" });
  const [draft, setDraft] = useState<PackageItem | null>(null);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  if (!store.loaded || !store.items) return <Skeleton />;
  const items = store.items;

  const selected =
    (view.name === "detail" || view.name === "edit"
      ? (items.find((item) => item.id === view.id) ?? null)
      : null) ?? null;

  const openCreate = () => {
    setDraft(blankPackage());
    setErrors(new Map());
    store.setNotice(null);
    setView({ name: "create" });
  };

  const openEdit = (item: PackageItem) => {
    setDraft({ ...item, inclusions: [...(item.inclusions ?? [])], image: { ...item.image } });
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
    const parsed = packagesModuleSchema.element.safeParse(draft);
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
    const saved = parsed.data as PackageItem;
    const next = isEdit
      ? items.map((item) => (item.id === draft.id ? saved : item))
      : [...items, saved];
    const ok = await store.persist(next);
    if (!ok) return;
    setDraft(null);
    setErrors(new Map());
    void notifySuccess(isEdit ? "Package updated." : "Package added.");
    setView({ name: "list" });
  };

  const deleteSelected = async () => {
    if (!selected) return;
    const ok = await store.removeById(selected.id, selected.name || "this package", {
      minLength: 1,
      message: "Add at least one package.",
    });
    if (ok) setView({ name: "list" });
  };

  if ((view.name === "create" || view.name === "edit") && draft) {
    const isEdit = view.name === "edit";
    const err = (field: string) => errors.get(field);
    const inclusions = draft.inclusions ?? [];
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
            {isEdit ? "Back to detail" : "Back to packages"}
          </button>
        </p>
        <Panel
          title={isEdit ? `Edit ${selected?.name || "package"}` : "Add Package"}
          lede={
            isEdit
              ? "Update the package content, badge and image, then save."
              : "Describe the new package plan, choose its badge, then save."
          }
        >
          <div className="ad-grid-2">
            <AdField id="pkg-name" label="Name" required error={err("name")}>
              <TextInput
                id="pkg-name"
                type="text"
                value={draft.name}
                error={err("name")}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </AdField>
            <AdField
              id="pkg-duration"
              label="Duration"
              required
              hint="For example 3 hours."
              error={err("durationLabel")}
            >
              <TextInput
                id="pkg-duration"
                type="text"
                value={draft.durationLabel}
                error={err("durationLabel")}
                onChange={(e) => setDraft({ ...draft, durationLabel: e.target.value })}
              />
            </AdField>
          </div>
          <div className="ad-grid-2">
            <AdField
              id="pkg-price"
              label="Price"
              required
              hint="Plain text, e.g. $450 total."
              error={err("priceLabel")}
            >
              <TextInput
                id="pkg-price"
                type="text"
                value={draft.priceLabel}
                error={err("priceLabel")}
                onChange={(e) => setDraft({ ...draft, priceLabel: e.target.value })}
              />
            </AdField>
            <AdField id="pkg-summary" label="Summary" required error={err("summary")}>
              <TextArea
                id="pkg-summary"
                rows={3}
                value={draft.summary}
                error={err("summary")}
                onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
              />
            </AdField>
          </div>
          <AdField
            id="pkg-badge"
            label="Badge"
            required
            hint={BADGE_HINTS[draft.badgeType] ?? undefined}
            error={err("badgeType")}
          >
            <div className="ad-radio" role="radiogroup" aria-label="Package badge">
              {BADGE_OPTIONS.map((option) => (
                <label key={option.value} className="ad-radio-option">
                  <input
                    type="radio"
                    name="pkg-badge"
                    value={option.value}
                    checked={draft.badgeType === option.value}
                    onChange={(e) => setDraft({ ...draft, badgeType: e.target.value as BadgeType })}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </AdField>
          {draft.badgeType === "custom" ? (
            <AdField id="pkg-custom" label="Custom badge text" required error={err("customBadge")}>
              <TextInput
                id="pkg-custom"
                type="text"
                value={draft.customBadge ?? ""}
                error={err("customBadge")}
                onChange={(e) => setDraft({ ...draft, customBadge: e.target.value })}
              />
            </AdField>
          ) : null}
          <StringList
            label="Inclusion"
            addLabel="Add inclusion"
            emptyText="Inclusions appear as a tick list on the package card."
            items={inclusions}
            itemError={(i) => err(`inclusions.${i}`)}
            onChange={(i, value) => {
              const next = [...inclusions];
              next[i] = value;
              setDraft({ ...draft, inclusions: next });
            }}
            onAdd={() => setDraft({ ...draft, inclusions: [...inclusions, ""] })}
            onRemove={(i) => {
              void confirmDestructive({
                title: `Remove inclusion ${i + 1}?`,
                confirmText: "Remove",
              }).then((confirmed) => {
                if (confirmed) {
                  setDraft({ ...draft, inclusions: inclusions.filter((_, j) => j !== i) });
                }
              });
            }}
            onMove={(i, direction) => {
              const next = [...inclusions];
              const target = i + direction;
              if (target < 0 || target >= next.length) return;
              const [moved] = next.splice(i, 1);
              next.splice(target, 0, moved);
              setDraft({ ...draft, inclusions: next });
            }}
          />
          <ImageField
            legend="Package image."
            hint="Optional; shown when the package card includes an image."
            value={draft.image}
            onChange={(image) => setDraft({ ...draft, image })}
            error={err("image")}
            altError={err("image.alt")}
          />
          <AdField
            id="pkg-highlight"
            label="Highlighted for homepage"
            required
            hint="Turned-on packages appear in the homepage packages section."
            error={err("highlight")}
          >
            <label className="ad-toggle">
              <input
                id="pkg-highlight"
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
              {store.busy ? "Saving..." : isEdit ? "Save changes" : "Add package"}
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
            Back to packages
          </button>
        </p>
        <section className="ad-panel" aria-label={selected.name}>
          <div className="ad-panel-head">
            <div>
              <h2>{selected.name}</h2>
              <p className="ad-panel-lede">
                {selected.priceLabel} - {selected.durationLabel}
              </p>
            </div>
            <span className="ad-panel-action">
              <HighlightPill on={selected.highlight} />
            </span>
          </div>
          <ModuleImage image={selected.image} />
          <dl className="ad-detail-list">
            <DetailRow label="Badge" value={packageBadgeText(selected)} />
            <DetailRow label="Duration" value={selected.durationLabel} />
            <DetailRow label="Price" value={selected.priceLabel} />
            <DetailRow label="Summary" value={selected.summary} />
            <DetailRow
              label="Inclusions"
              value={
                (selected.inclusions ?? []).length ? (selected.inclusions ?? []).join("\n") : ""
              }
            />
            <DetailRow label="Image alt text" value={selected.image.alt ?? ""} />
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
      <section className="ad-panel" aria-label="All packages">
        <div className="ad-panel-head">
          <div>
            <h2>All packages</h2>
            <p className="ad-panel-lede">
              {items.length} {items.length === 1 ? "package" : "packages"}. Select a row to view the
              full detail, then edit or delete it.
            </p>
          </div>
          <span className="ad-panel-action">
            <button type="button" className="ad-button ad-button--primary" onClick={openCreate}>
              <Plus size={16} aria-hidden="true" />
              Add Package
            </button>
          </span>
        </div>
        {items.length === 0 ? (
          <div className="ad-empty">
            <h3>No packages</h3>
            <p>Add the first package plan with the Add Package button above.</p>
          </div>
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col" className="ad-hide-sm">
                    Price
                  </th>
                  <th scope="col">Badge</th>
                  <th scope="col">Highlight</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
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
                    aria-label={`View ${item.name || "package"}`}
                  >
                    <td>
                      <strong>{item.name || "Untitled package"}</strong>
                    </td>
                    <td className="ad-hide-sm">{item.priceLabel || "-"}</td>
                    <td>{packageBadgeText(item)}</td>
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
