// Services module: list -> detail -> edit/delete, list -> Add Service -> create.
// Single-item saves through the section repository; homepage highlight and
// uploaded imagery behave as before.

import { useState } from "react";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import type { ServiceBadgeType, ServiceItem } from "../../../lib/cms/types";
import { serviceBadgeText } from "../../../lib/cms/types";
import { servicesModuleSchema } from "../../../lib/cms/schemas";
import { createId } from "../../../lib/cms/ids";
import { AdField, AdSelect, ImageField, Notice, Skeleton, TextArea, TextInput } from "../fields";
import { Panel, StringList, SERVICE_ICON_OPTIONS } from "../groups";
import { DetailRow, HighlightPill, ModuleImage, toFieldErrors, useModuleList } from "../ModuleCrud";
import { confirmDestructive, notifySuccess } from "../alerts";

const SERVICE_BADGE_OPTIONS: { value: ServiceBadgeType; label: string }[] = [
  { value: "basic", label: "Basic" },
  { value: "most-popular", label: "Most Popular" },
  { value: "best-value", label: "Best Value" },
  { value: "custom", label: "Custom badge" },
];

const SERVICE_BADGE_HINTS: Record<ServiceBadgeType, string> = {
  basic: "Shows the Basic badge on the card.",
  "most-popular": "Applies the highlighted card treatment and the Most Popular badge.",
  "best-value": "Shows the Best Value badge, without the featured treatment.",
  custom: "Shows the custom badge text below.",
};

type View =
  | { name: "list" }
  | { name: "detail"; id: string }
  | { name: "create" }
  | { name: "edit"; id: string };

function blankService(): ServiceItem {
  return {
    id: createId("service"),
    name: "",
    badgeType: "basic",
    customBadge: "",
    tagline: "",
    summary: "",
    highlights: [],
    image: { key: null, src: "", alt: "" },
    highlight: false,
  };
}

export default function ServicesModuleEditor() {
  const store = useModuleList<ServiceItem>("mod-services");
  const [view, setView] = useState<View>({ name: "list" });
  const [draft, setDraft] = useState<ServiceItem | null>(null);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  if (!store.loaded || !store.items) return <Skeleton />;
  const items = store.items;

  const selected =
    (view.name === "detail" || view.name === "edit"
      ? (items.find((item) => item.id === view.id) ?? null)
      : null) ?? null;

  const openCreate = () => {
    setDraft(blankService());
    setErrors(new Map());
    store.setNotice(null);
    setView({ name: "create" });
  };

  const openEdit = (item: ServiceItem) => {
    setDraft({ ...item, highlights: [...(item.highlights ?? [])], image: { ...item.image } });
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
    const parsed = servicesModuleSchema.element.safeParse(draft);
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
    const saved = parsed.data as ServiceItem;
    const next = isEdit
      ? items.map((item) => (item.id === draft.id ? saved : item))
      : [...items, saved];
    const ok = await store.persist(next);
    if (!ok) return;
    setDraft(null);
    setErrors(new Map());
    void notifySuccess(isEdit ? "Service updated." : "Service added.");
    setView({ name: "list" });
  };

  const deleteSelected = async () => {
    if (!selected) return;
    const ok = await store.removeById(selected.id, selected.name || "this service", {
      minLength: 1,
      message: "Add at least one service.",
    });
    if (ok) setView({ name: "list" });
  };

  // ── Form view (create / edit) ──────────────────────────────────────────
  if ((view.name === "create" || view.name === "edit") && draft) {
    const isEdit = view.name === "edit";
    const err = (field: string) => errors.get(field);
    const highlights = draft.highlights ?? [];
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
            {isEdit ? "Back to detail" : "Back to services"}
          </button>
        </p>
        <Panel
          title={isEdit ? `Edit ${selected?.name || "service"}` : "Add Service"}
          lede={
            isEdit
              ? "Update the service content and image, then save."
              : "Describe the new booth experience, upload its image, then save."
          }
        >
          <div className="ad-grid-2">
            <AdField id="svc-name" label="Name" required error={err("name")}>
              <TextInput
                id="svc-name"
                type="text"
                value={draft.name}
                error={err("name")}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </AdField>
            <AdField
              id="svc-badge"
              label="Badge"
              required
              hint={SERVICE_BADGE_HINTS[draft.badgeType] ?? undefined}
              error={err("badgeType")}
            >
              <AdSelect
                id="svc-badge"
                value={draft.badgeType}
                error={err("badgeType")}
                onChange={(e) =>
                  setDraft({ ...draft, badgeType: e.target.value as ServiceBadgeType })
                }
              >
                {SERVICE_BADGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </AdSelect>
            </AdField>
          </div>
          {draft.badgeType === "custom" ? (
            <AdField id="svc-custom" label="Custom badge text" required error={err("customBadge")}>
              <TextInput
                id="svc-custom"
                type="text"
                value={draft.customBadge ?? ""}
                error={err("customBadge")}
                onChange={(e) => setDraft({ ...draft, customBadge: e.target.value })}
              />
            </AdField>
          ) : null}
          <div className="ad-grid-2">
            <AdField id="svc-icon" label="Icon" error={err("icon")}>
              <AdSelect
                id="svc-icon"
                value={draft.icon ?? ""}
                error={err("icon")}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    icon:
                      e.target.value === ""
                        ? undefined
                        : (e.target.value as "camera" | "users" | "video"),
                  })
                }
              >
                {SERVICE_ICON_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </AdSelect>
            </AdField>
            <AdField
              id="svc-tagline"
              label="Tagline"
              hint="Short line under the name."
              error={err("tagline")}
            >
              <TextInput
                id="svc-tagline"
                type="text"
                value={draft.tagline ?? ""}
                error={err("tagline")}
                onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
              />
            </AdField>
          </div>
          <AdField id="svc-summary" label="Summary" required error={err("summary")}>
            <TextArea
              id="svc-summary"
              rows={4}
              value={draft.summary}
              error={err("summary")}
              onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
            />
          </AdField>
          <StringList
            label="Highlight"
            addLabel="Add highlight"
            emptyText="Highlights appear as a tick list on the service."
            items={highlights}
            itemError={(i) => err(`highlights.${i}`)}
            onChange={(i, value) => {
              const next = [...highlights];
              next[i] = value;
              setDraft({ ...draft, highlights: next });
            }}
            onAdd={() => setDraft({ ...draft, highlights: [...highlights, ""] })}
            onRemove={(i) => {
              void confirmDestructive({
                title: `Remove highlight ${i + 1}?`,
                confirmText: "Remove",
              }).then((confirmed) => {
                if (confirmed) {
                  setDraft({ ...draft, highlights: highlights.filter((_, j) => j !== i) });
                }
              });
            }}
            onMove={(i, direction) => {
              const next = [...highlights];
              const target = i + direction;
              if (target < 0 || target >= next.length) return;
              const [moved] = next.splice(i, 1);
              next.splice(target, 0, moved);
              setDraft({ ...draft, highlights: next });
            }}
          />
          <ImageField
            legend="Service image."
            hint="Shown on the services page and the homepage card."
            value={draft.image}
            onChange={(image) => setDraft({ ...draft, image })}
            error={err("image")}
            altError={err("image.alt")}
          />
          <AdField
            id="svc-highlight"
            label="Highlighted for homepage"
            required
            hint="Turned-on services appear in the homepage services section."
            error={err("highlight")}
          >
            <label className="ad-toggle">
              <input
                id="svc-highlight"
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
              {store.busy ? "Saving..." : isEdit ? "Save changes" : "Add service"}
            </button>
            <button type="button" className="ad-button ad-button--secondary" onClick={cancelForm}>
              Cancel
            </button>
          </p>
        </Panel>
      </div>
    );
  }

  // ── Detail view ────────────────────────────────────────────────────────
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
            Back to services
          </button>
        </p>
        <section className="ad-panel" aria-label={selected.name}>
          <div className="ad-panel-head">
            <div>
              <h2>{selected.name}</h2>
              <p className="ad-panel-lede">
                {selected.tagline || serviceBadgeText(selected) || "Service detail."}
              </p>
            </div>
            <span className="ad-panel-action">
              <HighlightPill on={selected.highlight} />
            </span>
          </div>
          <ModuleImage image={selected.image} />
          <dl className="ad-detail-list">
            <DetailRow label="Badge" value={serviceBadgeText(selected)} />
            <DetailRow
              label="Featured card"
              value={
                selected.badgeType === "most-popular"
                  ? "Highlighted on the homepage and services page"
                  : "Standard card"
              }
            />
            <DetailRow label="Tagline" value={selected.tagline ?? ""} />
            <DetailRow label="Icon" value={selected.icon ?? "None"} />
            <DetailRow label="Summary" value={selected.summary} />
            <DetailRow
              label="Highlights"
              value={
                (selected.highlights ?? []).length ? (selected.highlights ?? []).join("\n") : ""
              }
            />
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

  // ── List view ──────────────────────────────────────────────────────────
  return (
    <div className="ad-stack">
      {store.notice ? (
        <Notice tone={store.notice.tone} title={store.notice.title} list={store.notice.list}>
          {store.notice.body ? <p>{store.notice.body}</p> : null}
        </Notice>
      ) : null}
      <section className="ad-panel" aria-label="All services">
        <div className="ad-panel-head">
          <div>
            <h2>All services</h2>
            <p className="ad-panel-lede">
              {items.length} {items.length === 1 ? "service" : "services"}. Select a row to view the
              full detail, then edit or delete it.
            </p>
          </div>
          <span className="ad-panel-action">
            <button type="button" className="ad-button ad-button--primary" onClick={openCreate}>
              <Plus size={16} aria-hidden="true" />
              Add Service
            </button>
          </span>
        </div>
        {items.length === 0 ? (
          <div className="ad-empty">
            <h3>No services</h3>
            <p>Add the first booth experience with the Add Service button above.</p>
          </div>
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col" className="ad-hide-sm">
                    Badge
                  </th>
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
                    aria-label={`View ${item.name || "service"}`}
                  >
                    <td>
                      <strong>{item.name || "Untitled service"}</strong>
                      {item.tagline ? (
                        <span className="ad-table-muted">
                          <br />
                          {item.tagline}
                        </span>
                      ) : null}
                    </td>
                    <td className="ad-hide-sm">{serviceBadgeText(item)}</td>
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
