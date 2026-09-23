// FAQ Page editor (Website CMS): header, search/aside copy, enquiry band and
// SEO. The questions and answers live in the FAQs module.

import { faqPageSchema } from "../../../lib/cms/schemas";
import SaveBar from "../SaveBar";
import { AdField, Notice, Skeleton, TextArea, TextInput } from "../fields";
import { CtaBandGroup, PageHeaderGroup, Panel, SeoGroup, errorAt } from "../groups";
import { useSectionEditor } from "../useSectionEditor";

export default function FaqPageEditor() {
  const { form, loaded, saving, notice, savedAt, onSave, onInvalid, onDiscard, onResetSection } =
    useSectionEditor("faq", faqPageSchema);
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  if (!loaded) return <Skeleton />;

  return (
    <form onSubmit={handleSubmit(onSave, onInvalid)} noValidate aria-label="FAQ page editor">
      {notice ? (
        <Notice tone={notice.tone} title={notice.title} list={notice.list}>
          {notice.body ? <p>{notice.body}</p> : null}
        </Notice>
      ) : null}

      <Panel title="Page header" lede="Banner at the top of the FAQ page.">
        <PageHeaderGroup
          prefix="header"
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
        />
      </Panel>

      <Panel
        title="Search and aside panels"
        lede="Search box, aside support card and no-results copy."
      >
        <AdField
          id="faq-search"
          label="Search placeholder"
          required
          hint="Text inside the search box."
          error={errorAt(errors, "searchPlaceholder")}
        >
          <TextInput
            id="faq-search"
            type="text"
            error={errorAt(errors, "searchPlaceholder")}
            {...register("searchPlaceholder")}
          />
        </AdField>
        <AdField
          id="faq-empty"
          label="No-results text"
          required
          error={errorAt(errors, "emptyCopy")}
        >
          <TextArea
            id="faq-empty"
            rows={2}
            error={errorAt(errors, "emptyCopy")}
            {...register("emptyCopy")}
          />
        </AdField>
        <AdField
          id="support-heading"
          label="Support heading"
          required
          error={errorAt(errors, "support.heading")}
        >
          <TextInput
            id="support-heading"
            type="text"
            error={errorAt(errors, "support.heading")}
            {...register("support.heading")}
          />
        </AdField>
        <AdField
          id="support-body"
          label="Supporting text"
          required
          error={errorAt(errors, "support.body")}
        >
          <TextArea
            id="support-body"
            rows={3}
            error={errorAt(errors, "support.body")}
            {...register("support.body")}
          />
        </AdField>
        <AdField
          id="support-label"
          label="Button label"
          required
          error={errorAt(errors, "support.label")}
        >
          <TextInput
            id="support-label"
            type="text"
            error={errorAt(errors, "support.label")}
            {...register("support.label")}
          />
        </AdField>
      </Panel>

      <Panel title="Call to action" lede="Closing enquiry band on the FAQ page.">
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
