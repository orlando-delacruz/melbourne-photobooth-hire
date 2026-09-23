// Services Page editor (Website CMS): page-level copy only. The booth items
// are managed in the Services module.

import { servicesPageSchema } from "../../../lib/cms/schemas";
import SaveBar from "../SaveBar";
import { Notice, Skeleton } from "../fields";
import { CtaBandGroup, PageHeaderGroup, Panel, SeoGroup } from "../groups";
import { useSectionEditor } from "../useSectionEditor";

export default function ServicesPageEditor() {
  const { form, loaded, saving, notice, savedAt, onSave, onInvalid, onDiscard, onResetSection } =
    useSectionEditor("services", servicesPageSchema);
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  if (!loaded) return <Skeleton />;

  return (
    <form onSubmit={handleSubmit(onSave, onInvalid)} noValidate aria-label="Services page editor">
      {notice ? (
        <Notice tone={notice.tone} title={notice.title} list={notice.list}>
          {notice.body ? <p>{notice.body}</p> : null}
        </Notice>
      ) : null}

      <Panel title="Page header" lede="Banner at the top of the services page.">
        <PageHeaderGroup
          prefix="header"
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
        />
      </Panel>

      <Panel title="Call to action" lede="Closing enquiry band on the services page.">
        <CtaBandGroup
          prefix="ctaBand"
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
        />
      </Panel>

      <Panel title="SEO" lede="Search result title, description and social share image.">
        <SeoGroup
          prefix="seo"
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
