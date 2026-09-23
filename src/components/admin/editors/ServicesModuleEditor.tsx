// Services module editor: create, edit, remove, highlight and upload imagery
// for the booth services. This list is the single source of truth: the
// services page and the homepage render it.

import { servicesModuleSchema } from "../../../lib/cms/schemas";
import { createId, slugId } from "../../../lib/cms/repository";
import SaveBar from "../SaveBar";
import {
  AdField,
  AdSelect,
  ArraySection,
  ImageField,
  ItemCard,
  Notice,
  Skeleton,
  TextArea,
  TextInput,
} from "../fields";
import { Panel, StringList, SERVICE_ICON_OPTIONS } from "../groups";
import { useModuleEditor } from "../useModuleEditor";
import type { ServiceItem } from "../../../lib/cms/types";

export default function ServicesModuleEditor() {
  const editor = useModuleEditor<ServiceItem>("mod-services", servicesModuleSchema);
  const { form } = { form: null };
  void form;

  if (!editor.loaded) return <Skeleton />;

  const fieldName = (index: number, field: string) =>
    errorAtMap(editor.errors, `${index}.${field}`);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        editor.save();
      }}
      noValidate
      aria-label="Services module editor"
    >
      {editor.notice ? (
        <Notice tone={editor.notice.tone} title={editor.notice.title} list={editor.notice.list}>
          {editor.notice.body ? <p>{editor.notice.body}</p> : null}
        </Notice>
      ) : null}

      <Panel
        title="Booth services"
        lede="The booth experiences shown on the services page and as homepage cards. Highlight determines whether a service appears on the homepage."
      >
        <ArraySection
          title="Service list"
          count={editor.items.length}
          addLabel="Add service"
          onAdd={() =>
            editor.setItems([
              ...editor.items,
              {
                id: createId("service"),
                name: "",
                badge: "",
                tagline: "",
                summary: "",
                highlights: [],
                image: { key: null, src: "", alt: "" },
                highlight: false,
              },
            ])
          }
          emptyTitle="No services"
          emptyBody="Add at least one service; the services page and homepage cards need the list."
        >
          {editor.items.map((item, index) => {
            const title = item.name || `Service ${index + 1}`;
            const highlights = item.highlights ?? [];
            const commitHighlights = (next: string[]) =>
              editor.updateItem(index, { highlights: next });
            return (
              <ItemCard
                key={item.id}
                index={index}
                title={title}
                idText={item.id}
                disableUp={index === 0}
                disableDown={index === editor.items.length - 1}
                onMoveUp={() => editor.moveItem(index, -1)}
                onMoveDown={() => editor.moveItem(index, 1)}
                onDuplicate={() =>
                  editor.duplicateItem(index, (source) => ({
                    ...source,
                    id: slugId(source.name || "service", "service"),
                  }))
                }
                onRemove={() => {
                  if (window.confirm(`Remove "${title}"?`)) editor.removeItem(index);
                }}
              >
                <div className="ad-grid-2">
                  <AdField
                    id={`s-${index}-name`}
                    label="Name"
                    required
                    error={fieldName(index, "name")}
                  >
                    <TextInput
                      id={`s-${index}-name`}
                      type="text"
                      value={item.name}
                      error={fieldName(index, "name")}
                      onChange={(event) => editor.updateItem(index, { name: event.target.value })}
                    />
                  </AdField>
                  <AdField
                    id={`s-${index}-badge`}
                    label="Badge"
                    hint="Optional short label, e.g. Most booked."
                    error={fieldName(index, "badge")}
                  >
                    <TextInput
                      id={`s-${index}-badge`}
                      type="text"
                      value={item.badge ?? ""}
                      error={fieldName(index, "badge")}
                      onChange={(event) => editor.updateItem(index, { badge: event.target.value })}
                    />
                  </AdField>
                </div>
                <div className="ad-grid-2">
                  <AdField id={`s-${index}-icon`} label="Icon" error={fieldName(index, "icon")}>
                    <AdSelect
                      id={`s-${index}-icon`}
                      error={fieldName(index, "icon")}
                      value={item.icon ?? ""}
                      onChange={(event) =>
                        editor.updateItem(index, {
                          icon:
                            (event.target as HTMLSelectElement).value === ""
                              ? undefined
                              : ((event.target as HTMLSelectElement).value as
                                  "camera" | "users" | "video"),
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
                    id={`s-${index}-tagline`}
                    label="Tagline"
                    hint="Short line under the name."
                    error={fieldName(index, "tagline")}
                  >
                    <TextInput
                      id={`s-${index}-tagline`}
                      type="text"
                      value={item.tagline ?? ""}
                      error={fieldName(index, "tagline")}
                      onChange={(event) =>
                        editor.updateItem(index, { tagline: event.target.value })
                      }
                    />
                  </AdField>
                </div>
                <AdField
                  id={`s-${index}-summary`}
                  label="Summary"
                  required
                  error={fieldName(index, "summary")}
                >
                  <TextArea
                    id={`s-${index}-summary`}
                    rows={4}
                    value={item.summary}
                    error={fieldName(index, "summary")}
                    onChange={(event) => editor.updateItem(index, { summary: event.target.value })}
                  />
                </AdField>
                <StringList
                  label="Highlight"
                  addLabel="Add highlight"
                  emptyText="Highlights appear as a tick list on the service."
                  items={highlights}
                  itemError={(itemIndex) => fieldName(index, `highlights.${itemIndex}`)}
                  onChange={(itemIndex, value) => {
                    const next = [...highlights];
                    next[itemIndex] = value;
                    commitHighlights(next);
                  }}
                  onAdd={() => commitHighlights([...highlights, ""])}
                  onRemove={(itemIndex) => {
                    if (window.confirm(`Remove highlight ${itemIndex + 1}?`)) {
                      commitHighlights(highlights.filter((_, i) => i !== itemIndex));
                    }
                  }}
                  onMove={(itemIndex, direction) => {
                    const next = [...highlights];
                    const target = itemIndex + direction;
                    if (target < 0 || target >= next.length) return;
                    const [moved] = next.splice(itemIndex, 1);
                    next.splice(target, 0, moved);
                    commitHighlights(next);
                  }}
                />
                <ImageField
                  legend="Service image."
                  hint="Shown on the services page and the homepage card."
                  value={item.image}
                  onChange={(image) => editor.updateItem(index, { image })}
                  error={fieldName(index, "image.alt")}
                  altError={errorAtMap(editor.errors, `${index}.image.alt`)}
                />
                <AdField
                  id={`s-${index}-highlight`}
                  label="Highlighted for homepage"
                  required
                  hint="Turned-on services appear in the homepage services section."
                  error={fieldName(index, "highlight")}
                >
                  <label className="ad-toggle">
                    <input
                      id={`s-${index}-highlight`}
                      type="checkbox"
                      checked={item.highlight}
                      onChange={(event) =>
                        editor.updateItem(index, { highlight: event.target.checked })
                      }
                    />
                    <span>{item.highlight ? "Shown on homepage" : "Hidden from homepage"}</span>
                  </label>
                </AdField>
              </ItemCard>
            );
          })}
        </ArraySection>
      </Panel>

      <SaveBar
        dirty={editor.dirty}
        saving={editor.saving}
        savedAt={editor.savedAt}
        onSave={() => editor.save()}
        onDiscard={editor.discard}
        onResetSection={editor.reset}
      />
    </form>
  );
}

function errorAtMap(errors: Map<string, string>, key: string): string | undefined {
  return errors.get(key);
}
