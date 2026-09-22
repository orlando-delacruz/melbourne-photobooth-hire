// Gallery page editor: header, gallery images, call-to-action band and
// SEO metadata. Images are stock photography awaiting client-approved photos.

import { useFieldArray } from "react-hook-form";
import { gallerySchema } from "../../../lib/cms/schemas";
import { createId } from "../../../lib/cms/repository";
import SaveBar from "../SaveBar";
import {
  AdField,
  ArraySection,
  ImageField,
  ItemCard,
  Notice,
  Skeleton,
  TextInput,
} from "../fields";
import { CtaBandGroup, PageHeaderGroup, Panel, SeoGroup, errorAt } from "../groups";
import { useSectionEditor } from "../useSectionEditor";

export default function GalleryEditor() {
  const { form, loaded, saving, notice, savedAt, onSave, onInvalid, onDiscard, onResetSection } =
    useSectionEditor("gallery", gallerySchema);
  const {
    register,
    control,
    watch,
    getValues,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  const gallery = useFieldArray({ control, name: "gallery" });

  if (!loaded) return <Skeleton />;

  const confirmRemove = (label: string, remove: () => void) => {
    if (window.confirm(`Remove "${label}"?`)) remove();
  };

  return (
    <form onSubmit={handleSubmit(onSave, onInvalid)} noValidate aria-label="Gallery page editor">
      {notice ? (
        <Notice tone={notice.tone} title={notice.title} list={notice.list}>
          {notice.body ? <p>{notice.body}</p> : null}
        </Notice>
      ) : null}

      <Panel title="Page header" lede="Banner at the top of the gallery page.">
        <PageHeaderGroup prefix="header" register={register} errors={errors} watch={watch} />
      </Panel>

      <Panel
        title="Gallery images"
        lede="Event photos in display order. All current images are stock photography."
      >
        <ArraySection
          title="Image list"
          count={gallery.fields.length}
          addLabel="Add image"
          onAdd={() => gallery.append({ id: createId("gallery"), src: "", alt: "", caption: "" })}
          emptyTitle="No images"
          emptyBody="An empty-state message shows while the gallery is empty."
        >
          {gallery.fields.map((field, index) => {
            const base = `gallery.${index}` as const;
            const caption =
              watch(`${base}.caption`) || watch(`${base}.alt`) || `Image ${index + 1}`;
            return (
              <ItemCard
                key={field.id}
                index={index}
                title={String(caption).slice(0, 60)}
                idText={field.id}
                disableUp={index === 0}
                disableDown={index === gallery.fields.length - 1}
                onMoveUp={() => gallery.move(index, index - 1)}
                onMoveDown={() => gallery.move(index, index + 1)}
                onDuplicate={() => {
                  const current = getValues("gallery");
                  gallery.insert(index + 1, { ...current[index], id: createId("gallery") });
                }}
                onRemove={() =>
                  confirmRemove(String(caption).slice(0, 60), () => gallery.remove(index))
                }
              >
                <ImageField
                  legend="Gallery image."
                  srcProps={register(`${base}.src`)}
                  srcError={errorAt(errors, `${base}.src`)}
                  altProps={register(`${base}.alt`)}
                  altError={errorAt(errors, `${base}.alt`)}
                  captionProps={register(`${base}.caption`)}
                  captionError={errorAt(errors, `${base}.caption`)}
                  previewSrc={String(watch(`${base}.src`) ?? "")}
                />
              </ItemCard>
            );
          })}
        </ArraySection>
        <p className="ad-hint">Fallback copy below shows only while the gallery is empty.</p>
        <AdField
          id="emptyState.title"
          label="Empty-state title"
          required
          error={errorAt(errors, "emptyState.title")}
        >
          <TextInput
            id="emptyState.title"
            type="text"
            error={errorAt(errors, "emptyState.title")}
            {...register("emptyState.title")}
          />
        </AdField>
        <AdField
          id="emptyState.body"
          label="Empty-state text"
          required
          error={errorAt(errors, "emptyState.body")}
        >
          <TextInput
            id="emptyState.body"
            type="text"
            error={errorAt(errors, "emptyState.body")}
            {...register("emptyState.body")}
          />
        </AdField>
        <AdField
          id="emptyState.actionLabel"
          label="Empty-state button label"
          required
          error={errorAt(errors, "emptyState.actionLabel")}
        >
          <TextInput
            id="emptyState.actionLabel"
            type="text"
            error={errorAt(errors, "emptyState.actionLabel")}
            {...register("emptyState.actionLabel")}
          />
        </AdField>
      </Panel>

      <Panel title="Call to action" lede="Closing enquiry band on the gallery page.">
        <CtaBandGroup prefix="ctaBand" register={register} errors={errors} watch={watch} />
      </Panel>

      <Panel
        title="SEO"
        lede="Search result title, description and social share image for the gallery page."
      >
        <SeoGroup prefix="seo" register={register} errors={errors} />
      </Panel>

      <SaveBar
        dirty={isDirty}
        saving={saving}
        savedAt={savedAt}
        onSave={() => handleSubmit(onSave, onInvalid)()}
        onDiscard={onDiscard}
        onResetSection={onResetSection}
      />
    </form>
  );
}
