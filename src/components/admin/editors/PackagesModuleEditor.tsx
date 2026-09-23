// Packages module editor: plans with badges (provided options plus a guarded
// custom badge), highlight and image upload. This list is the single source
// of truth for the packages page and the homepage.

import { packagesModuleSchema } from "../../../lib/cms/schemas";
import { type BadgeType, type PackageItem } from "../../../lib/cms/types";
import { createId, slugId } from "../../../lib/cms/repository";
import SaveBar from "../SaveBar";
import {
  AdField,
  ArraySection,
  ImageField,
  ItemCard,
  Notice,
  Skeleton,
  TextArea,
  TextInput,
} from "../fields";
import { Panel, StringList } from "../groups";
import { useModuleEditor } from "../useModuleEditor";

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

function badgeError(errors: Map<string, string>, index: number, field: string): string | undefined {
  return errors.get(`${index}.${field}`);
}

export default function PackagesModuleEditor() {
  const editor = useModuleEditor<PackageItem>("mod-packages", packagesModuleSchema);

  if (!editor.loaded) return <Skeleton />;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        editor.save();
      }}
      noValidate
      aria-label="Packages module editor"
    >
      {editor.notice ? (
        <Notice tone={editor.notice.tone} title={editor.notice.title} list={editor.notice.list}>
          {editor.notice.body ? <p>{editor.notice.body}</p> : null}
        </Notice>
      ) : null}

      <Panel
        title="Packages"
        lede="Package plans, prices, inclusions and badges. Highlight determines whether a package appears on the homepage."
      >
        <ArraySection
          title="Package list"
          count={editor.items.length}
          addLabel="Add package"
          onAdd={() =>
            editor.setItems([
              ...editor.items,
              {
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
              },
            ])
          }
          emptyTitle="No packages"
          emptyBody="Add at least one package; the homepage and packages page render this list."
        >
          {editor.items.map((item, index) => {
            const title = item.name || `Package ${index + 1}`;
            const inclusions = item.inclusions ?? [];
            const commitInclusions = (next: string[]) =>
              editor.updateItem(index, { inclusions: next });
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
                    id: slugId(source.name || "package", "package"),
                  }))
                }
                onRemove={() => {
                  if (window.confirm(`Remove "${title}"?`)) editor.removeItem(index);
                }}
              >
                <div className="ad-grid-2">
                  <AdField
                    id={`p-${index}-name`}
                    label="Name"
                    required
                    error={badgeError(editor.errors, index, "name")}
                  >
                    <TextInput
                      id={`p-${index}-name`}
                      type="text"
                      value={item.name}
                      error={badgeError(editor.errors, index, "name")}
                      onChange={(event) => editor.updateItem(index, { name: event.target.value })}
                    />
                  </AdField>
                  <AdField
                    id={`p-${index}-duration`}
                    label="Duration"
                    required
                    hint="For example 3 hours."
                    error={badgeError(editor.errors, index, "durationLabel")}
                  >
                    <TextInput
                      id={`p-${index}-duration`}
                      type="text"
                      value={item.durationLabel}
                      error={badgeError(editor.errors, index, "durationLabel")}
                      onChange={(event) =>
                        editor.updateItem(index, { durationLabel: event.target.value })
                      }
                    />
                  </AdField>
                </div>
                <div className="ad-grid-2">
                  <AdField
                    id={`p-${index}-price`}
                    label="Price"
                    required
                    hint="Plain text, e.g. $450 total."
                    error={badgeError(editor.errors, index, "priceLabel")}
                  >
                    <TextInput
                      id={`p-${index}-price`}
                      type="text"
                      value={item.priceLabel}
                      error={badgeError(editor.errors, index, "priceLabel")}
                      onChange={(event) =>
                        editor.updateItem(index, { priceLabel: event.target.value })
                      }
                    />
                  </AdField>
                  <AdField
                    id={`p-${index}-summary`}
                    label="Summary"
                    required
                    error={badgeError(editor.errors, index, "summary")}
                  >
                    <TextArea
                      id={`p-${index}-summary`}
                      rows={3}
                      value={item.summary}
                      error={badgeError(editor.errors, index, "summary")}
                      onChange={(event) =>
                        editor.updateItem(index, { summary: event.target.value })
                      }
                    />
                  </AdField>
                </div>
                <AdField
                  id={`p-${index}-badge`}
                  label="Badge"
                  required
                  hint={BADGE_HINTS[item.badgeType] ?? undefined}
                  error={badgeError(editor.errors, index, "badgeType")}
                >
                  <div className="ad-radio" role="radiogroup" aria-label={`Badge for ${title}`}>
                    {BADGE_OPTIONS.map((option) => (
                      <label key={option.value} className="ad-radio-option">
                        <input
                          type="radio"
                          name={`p-${index}-badge`}
                          value={option.value}
                          checked={item.badgeType === option.value}
                          onChange={(event) =>
                            editor.updateItem(index, {
                              badgeType: (event.target as HTMLInputElement).value as BadgeType,
                            })
                          }
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </AdField>
                {item.badgeType === "custom" ? (
                  <AdField
                    id={`p-${index}-custom`}
                    label="Custom badge text"
                    required
                    error={badgeError(editor.errors, index, "customBadge")}
                  >
                    <TextInput
                      id={`p-${index}-custom`}
                      type="text"
                      value={item.customBadge ?? ""}
                      error={badgeError(editor.errors, index, "customBadge")}
                      onChange={(event) =>
                        editor.updateItem(index, { customBadge: event.target.value })
                      }
                    />
                  </AdField>
                ) : null}
                <StringList
                  label="Inclusion"
                  addLabel="Add inclusion"
                  emptyText="Inclusions appear as a tick list on the package card."
                  items={inclusions}
                  itemError={(itemIndex) =>
                    badgeError(editor.errors, index, `inclusions.${itemIndex}`)
                  }
                  onChange={(itemIndex, value) => {
                    const next = [...inclusions];
                    next[itemIndex] = value;
                    commitInclusions(next);
                  }}
                  onAdd={() => commitInclusions([...inclusions, ""])}
                  onRemove={(itemIndex) => {
                    if (window.confirm(`Remove inclusion ${itemIndex + 1}?`)) {
                      commitInclusions(inclusions.filter((_, i) => i !== itemIndex));
                    }
                  }}
                  onMove={(itemIndex, direction) => {
                    const next = [...inclusions];
                    const target = itemIndex + direction;
                    if (target < 0 || target >= next.length) return;
                    const [moved] = next.splice(itemIndex, 1);
                    next.splice(target, 0, moved);
                    commitInclusions(next);
                  }}
                />
                <ImageField
                  legend="Package image."
                  hint="Optional; shown when the package card includes an image."
                  value={item.image}
                  onChange={(image) => editor.updateItem(index, { image })}
                  error={badgeError(editor.errors, index, "image")}
                  altError={badgeError(editor.errors, index, "image.alt")}
                />
                <AdField
                  id={`p-${index}-highlight`}
                  label="Highlighted for homepage"
                  required
                  hint="Turned-on packages appear in the homepage packages section."
                  error={badgeError(editor.errors, index, "highlight")}
                >
                  <label className="ad-toggle">
                    <input
                      id={`p-${index}-highlight`}
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
