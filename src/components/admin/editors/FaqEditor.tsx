// FAQ page editor: header, questions and answers, support panel,
// call-to-action band and SEO metadata.

import { useFieldArray } from "react-hook-form";
import { faqPageSchema } from "../../../lib/cms/schemas";
import { createId, slugId } from "../../../lib/cms/repository";
import SaveBar from "../SaveBar";
import { AdField, ArraySection, ItemCard, Notice, Skeleton, TextArea, TextInput } from "../fields";
import { CtaBandGroup, PageHeaderGroup, Panel, SeoGroup, errMsg, errorAt } from "../groups";
import { useSectionEditor } from "../useSectionEditor";

export default function FaqEditor() {
  const { form, loaded, saving, notice, savedAt, onSave, onInvalid, onDiscard, onResetSection } =
    useSectionEditor("faq", faqPageSchema);
  const {
    register,
    control,
    watch,
    getValues,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  const faqs = useFieldArray({ control, name: "faqs" });

  if (!loaded) return <Skeleton />;

  const confirmRemove = (label: string, remove: () => void) => {
    if (window.confirm(`Remove "${label}"?`)) remove();
  };

  return (
    <form onSubmit={handleSubmit(onSave, onInvalid)} noValidate aria-label="FAQ page editor">
      {notice ? (
        <Notice tone={notice.tone} title={notice.title} list={notice.list}>
          {notice.body ? <p>{notice.body}</p> : null}
        </Notice>
      ) : null}

      <Panel title="Page header" lede="Banner at the top of the FAQ page.">
        <PageHeaderGroup prefix="header" register={register} errors={errors} watch={watch} />
      </Panel>

      <Panel
        title="Questions and answers"
        lede="The homepage shows the first four; the FAQ page shows all."
      >
        <ArraySection
          title="FAQ list"
          count={faqs.fields.length}
          addLabel="Add question"
          onAdd={() => faqs.append({ id: createId("faq"), question: "", answer: "" })}
          emptyTitle="No questions"
          emptyBody="A fallback message shows while the list is empty."
        >
          {faqs.fields.map((field, index) => {
            const base = `faqs.${index}` as const;
            const question = watch(`${base}.question`) || `Question ${index + 1}`;
            return (
              <ItemCard
                key={field.id}
                index={index}
                title={String(question).slice(0, 70)}
                idText={field.id}
                disableUp={index === 0}
                disableDown={index === faqs.fields.length - 1}
                onMoveUp={() => faqs.move(index, index - 1)}
                onMoveDown={() => faqs.move(index, index + 1)}
                onDuplicate={() => {
                  const current = getValues("faqs");
                  faqs.insert(index + 1, {
                    ...current[index],
                    id: slugId(current[index].question || "faq", "faq"),
                  });
                }}
                onRemove={() =>
                  confirmRemove(String(question).slice(0, 70), () => faqs.remove(index))
                }
              >
                <AdField
                  id={`${base}-question`}
                  label="Question"
                  required
                  error={errorAt(errors, `${base}.question`)}
                >
                  <TextInput
                    id={`${base}-question`}
                    type="text"
                    error={errorAt(errors, `${base}.question`)}
                    {...register(`${base}.question`)}
                  />
                </AdField>
                <AdField
                  id={`${base}-answer`}
                  label="Answer"
                  required
                  error={errorAt(errors, `${base}.answer`)}
                >
                  <TextArea
                    id={`${base}-answer`}
                    rows={5}
                    error={errorAt(errors, `${base}.answer`)}
                    {...register(`${base}.answer`)}
                  />
                </AdField>
              </ItemCard>
            );
          })}
        </ArraySection>
        <AdField
          id="faq-search"
          label="Search placeholder"
          required
          hint="Placeholder inside the search box."
          error={errMsg(errors.searchPlaceholder)}
        >
          <TextInput
            id="faq-search"
            type="text"
            error={errMsg(errors.searchPlaceholder)}
            {...register("searchPlaceholder")}
          />
        </AdField>
        <AdField
          id="faq-empty"
          label="No-results text"
          required
          hint="Shown when a search matches nothing."
          error={errMsg(errors.emptyCopy)}
        >
          <TextArea
            id="faq-empty"
            rows={2}
            error={errMsg(errors.emptyCopy)}
            {...register("emptyCopy")}
          />
        </AdField>
      </Panel>

      <Panel title="Support panel" lede="Aside card linking to the enquiry form.">
        <AdField
          id="support-heading"
          label="Heading"
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
        <CtaBandGroup prefix="ctaBand" register={register} errors={errors} watch={watch} />
      </Panel>

      <Panel
        title="SEO"
        lede="Search result title, description and social share image for the FAQ page."
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
