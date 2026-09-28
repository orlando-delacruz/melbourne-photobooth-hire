// Contact page editor: header, aside facts, form card copy
// and SEO metadata. The enquiry form fields themselves stay in code.

import { contactSchema } from "../../../lib/cms/schemas";
import SaveBar from "../SaveBar";
import { AdField, Notice, Skeleton, TextArea, TextInput } from "../fields";
import { PageHeaderGroup, Panel, errMsg } from "../groups";
import { useSectionEditor } from "../useSectionEditor";

export default function ContactEditor() {
  const { form, loaded, saving, notice, savedAt, onSave, onInvalid, onDiscard, onResetSection } =
    useSectionEditor("contact", contactSchema);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  if (!loaded) return <Skeleton />;

  return (
    <form onSubmit={handleSubmit(onSave, onInvalid)} noValidate aria-label="Contact page editor">
      {notice ? (
        <Notice tone={notice.tone} title={notice.title} list={notice.list}>
          {notice.body ? <p>{notice.body}</p> : null}
        </Notice>
      ) : null}

      <Panel title="Page header" lede="Banner at the top of the contact page.">
        <PageHeaderGroup prefix="header" register={register} errors={errors} watch={watch} />
      </Panel>

      <Panel
        title="Aside facts"
        lede="Small facts beside the enquiry form. The service area value itself comes from Site settings."
      >
        <div className="ad-grid-2">
          <AdField
            id="contact-area-label"
            label="Service area label"
            required
            error={errMsg(errors.serviceAreaLabel)}
          >
            <TextInput
              id="contact-area-label"
              type="text"
              error={errMsg(errors.serviceAreaLabel)}
              {...register("serviceAreaLabel")}
            />
          </AdField>
          <AdField
            id="contact-reply-label"
            label="Reply label"
            required
            error={errMsg(errors.typicalReplyLabel)}
          >
            <TextInput
              id="contact-reply-label"
              type="text"
              error={errMsg(errors.typicalReplyLabel)}
              {...register("typicalReplyLabel")}
            />
          </AdField>
        </div>
        <AdField
          id="contact-reply-value"
          label="Reply value"
          required
          hint="For example Within one business day."
          error={errMsg(errors.typicalReplyValue)}
        >
          <TextInput
            id="contact-reply-value"
            type="text"
            error={errMsg(errors.typicalReplyValue)}
            {...register("typicalReplyValue")}
          />
        </AdField>
      </Panel>

      <Panel
        title="Form card"
        lede="Heading and privacy note around the enquiry form. Field labels inside the form stay in code."
      >
        <AdField
          id="contact-form-title"
          label="Form title"
          required
          error={errMsg(errors.formTitle)}
        >
          <TextInput
            id="contact-form-title"
            type="text"
            error={errMsg(errors.formTitle)}
            {...register("formTitle")}
          />
        </AdField>
        <AdField
          id="contact-form-lede"
          label="Form introduction"
          required
          error={errMsg(errors.formLede)}
        >
          <TextArea
            id="contact-form-lede"
            rows={2}
            error={errMsg(errors.formLede)}
            {...register("formLede")}
          />
        </AdField>
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
