// Gallery module editor: add, edit, remove, highlight and upload images.
// The gallery page and the homepage showcase section render this list.

import { galleryModuleSchema } from "../../../lib/cms/schemas";
import { createId } from "../../../lib/cms/repository";
import SaveBar from "../SaveBar";
import { AdField, ArraySection, ImageField, ItemCard, Notice, Skeleton } from "../fields";
import { Panel } from "../groups";
import { useModuleEditor } from "../useModuleEditor";
import type { GalleryItem } from "../../../lib/cms/types";

function galleryError(
  errors: Map<string, string>,
  index: number,
  field: string,
): string | undefined {
  return errors.get(`${index}.${field}`);
}

export default function GalleryModuleEditor() {
  const editor = useModuleEditor<GalleryItem>("mod-gallery", galleryModuleSchema);

  if (!editor.loaded) return <Skeleton />;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        editor.save();
      }}
      noValidate
      aria-label="Gallery module editor"
    >
      {editor.notice ? (
        <Notice tone={editor.notice.tone} title={editor.notice.title} list={editor.notice.list}>
          {editor.notice.body ? <p>{editor.notice.body}</p> : null}
        </Notice>
      ) : null}

      <Panel
        title="Gallery images"
        lede="Event photos in display order. Highlight determines whether an image appears in the homepage showcase."
      >
        <ArraySection
          title="Image list"
          count={editor.items.length}
          addLabel="Add image"
          onAdd={() =>
            editor.setItems([
              ...editor.items,
              {
                id: createId("gallery"),
                image: { key: null, src: "", alt: "" },
                caption: "",
                highlight: false,
              },
            ])
          }
          emptyTitle="No images"
          emptyBody="An empty-state message shows while the gallery is empty."
        >
          {editor.items.map((item, index) => {
            const caption = item.caption || item.image.alt || `Image ${index + 1}`;
            return (
              <ItemCard
                key={item.id}
                index={index}
                title={caption.slice(0, 60)}
                idText={item.id}
                disableUp={index === 0}
                disableDown={index === editor.items.length - 1}
                onMoveUp={() => editor.moveItem(index, -1)}
                onMoveDown={() => editor.moveItem(index, 1)}
                onDuplicate={() =>
                  editor.duplicateItem(index, (source) => ({
                    ...source,
                    id: createId("gallery"),
                  }))
                }
                onRemove={() => {
                  if (window.confirm(`Remove "${caption.slice(0, 60)}"?`)) editor.removeItem(index);
                }}
              >
                <ImageField
                  legend="Gallery image."
                  value={item.image}
                  onChange={(image) => editor.updateItem(index, { image })}
                  includeCaption
                  error={galleryError(editor.errors, index, "image")}
                  altError={galleryError(editor.errors, index, "image.alt")}
                />
                <AdField
                  id={`g-${index}-highlight`}
                  label="Highlighted for homepage"
                  required
                  hint="Turned-on images appear in the homepage showcase."
                  error={galleryError(editor.errors, index, "highlight")}
                >
                  <label className="ad-toggle">
                    <input
                      id={`g-${index}-highlight`}
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
