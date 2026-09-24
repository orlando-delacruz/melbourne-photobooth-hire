// Gallery Page editor (Website CMS): header, empty-state copy, enquiry band
// and SEO. The images themselves live in the Gallery module.

import { galleryPageSchema } from "../../../lib/cms/schemas";
import SaveBar from "../SaveBar";
import { AdField, Notice, Skeleton, TextArea, TextInput } from "../fields";
import { CtaBandGroup, PageHeaderGroup, Panel, errorAt } from "../groups";
import { useSectionEditor } from "../useSectionEditor";

export default function GalleryPageEditor() {
  const { form, loaded, saving, notice, savedAt, onSave, onInvalid, onDiscard, onResetSection } =
    useSectionEditor("gallery", galleryPageSchema);
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  if (!loaded) return <Skeleton />;

  return (
    <form onSubmit={handleSubmit(onSave, onInvalid)} noValidate aria-label="Gallery page editor">
      {notice ? (
        <Notice tone={notice.tone} title={notice.title} list={notice.list}>
          {notice.body ? <p>{notice.body}</p> : null}
        </Notice>
      ) : null}

      <Panel title="Page header" lede="Banner at the top of the gallery page.">
        <PageHeaderGroup
          prefix="header"
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
        />
      </Panel>

      <Panel title="Empty state" lede="Fallback copy shown only while the gallery has no images.">
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
          <TextArea
            id="emptyState.body"
            rows={2}
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
        <CtaBandGroup
          prefix="ctaBand"
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
        />
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
