// Contact page editor: header, next steps, aside facts, form card copy
// and SEO metadata. The enquiry form fields themselves stay in code.

import { useFieldArray } from "react-hook-form";
import { contactSchema } from "../../../lib/cms/schemas";
import SaveBar from "../SaveBar";
import { AdField, ArraySection, ItemCard, Notice, Skeleton, TextArea, TextInput } from "../fields";
import { PageHeaderGroup, Panel, errMsg, errorAt } from "../groups";
import { useSectionEditor } from "../useSectionEditor";
import { confirmDestructive } from "../alerts";

export default function ContactEditor() {
  const { form, loaded, saving, notice, savedAt, onSave, onInvalid, onDiscard, onResetSection } =
    useSectionEditor("contact", contactSchema);
  const {
    register,
    control,
    watch,
    getValues,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  const steps = useFieldArray({ control, name: "steps" });

  if (!loaded) return <Skeleton />;

  const confirmRemove = (label: string, remove: () => void) => {
    void confirmDestructive({ title: `Remove "${label}"?`, confirmText: "Remove" }).then(
      (confirmed) => {
        if (confirmed) remove();
      },
    );
  };

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

      <Panel title="What happens next" lede="Steps beside the enquiry form.">
        <AdField
          id="contact-aside"
          label="Aside heading"
          required
          error={errMsg(errors.asideHeading)}
        >
          <TextInput
            id="contact-aside"
            type="text"
            error={errMsg(errors.asideHeading)}
            {...register("asideHeading")}
          />
        </AdField>
        <ArraySection
          title="Step list"
          count={steps.fields.length}
          addLabel="Add step"
          onAdd={() => steps.append({ title: "", detail: "" })}
          emptyTitle="No steps"
          emptyBody="Add at least one step; the aside shows them in order."
        >
          {steps.fields.map((field, index) => {
            const base = `steps.${index}` as const;
            const title = watch(`${base}.title`) || `Step ${index + 1}`;
            return (
              <ItemCard
                key={field.id}
                index={index}
                title={String(title)}
                disableUp={index === 0}
                disableDown={index === steps.fields.length - 1}
                onMoveUp={() => steps.move(index, index - 1)}
                onMoveDown={() => steps.move(index, index + 1)}
                onDuplicate={() => {
                  const current = getValues("steps");
                  steps.insert(index + 1, { ...current[index] });
                }}
                onRemove={() => confirmRemove(String(title), () => steps.remove(index))}
              >
                <AdField
                  id={`${base}-title`}
                  label="Title"
                  required
                  error={errorAt(errors, `${base}.title`)}
                >
                  <TextInput
                    id={`${base}-title`}
                    type="text"
                    error={errorAt(errors, `${base}.title`)}
                    {...register(`${base}.title`)}
                  />
                </AdField>
                <AdField
                  id={`${base}-detail`}
                  label="Detail"
                  required
                  error={errorAt(errors, `${base}.detail`)}
                >
                  <TextArea
                    id={`${base}-detail`}
                    rows={3}
                    error={errorAt(errors, `${base}.detail`)}
                    {...register(`${base}.detail`)}
                  />
                </AdField>
              </ItemCard>
            );
          })}
        </ArraySection>
      </Panel>

      <Panel
        title="Aside facts"
        lede="Small facts under the steps. The service area value itself comes from Site settings."
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
        <AdField
          id="contact-form-foot"
          label="Privacy note"
          required
          error={errMsg(errors.formFoot)}
        >
          <TextArea
            id="contact-form-foot"
            rows={2}
            error={errMsg(errors.formFoot)}
            {...register("formFoot")}
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
