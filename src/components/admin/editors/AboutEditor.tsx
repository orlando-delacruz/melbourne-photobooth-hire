// About page editor: header, story, values, stats, next-step panel,
// call-to-action band and SEO metadata.

import { useFieldArray } from "react-hook-form";
import { aboutPageSchema } from "../../../lib/cms/schemas";
import { createId } from "../../../lib/cms/repository";
import SaveBar from "../SaveBar";
import { AdField, ArraySection, ItemCard, Notice, Skeleton, TextArea, TextInput } from "../fields";
import {
  CtaBandGroup,
  PageHeaderGroup,
  Panel,
  SectionHeadingGroup,
  SeoGroup,
  StringList,
  errMsg,
  errorAt,
} from "../groups";
import { useSectionEditor } from "../useSectionEditor";

export default function AboutEditor() {
  const { form, loaded, saving, notice, savedAt, onSave, onInvalid, onDiscard, onResetSection } =
    useSectionEditor("about", aboutPageSchema);
  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  const values = useFieldArray({ control, name: "values" });
  const stats = useFieldArray({ control, name: "stats" });

  const storyPath = "story" as const;
  const story = (watch(storyPath) ?? []) as string[];
  const commitStory = (next: string[]) =>
    setValue(storyPath, next, { shouldDirty: true, shouldValidate: true });
  const moveStory = (index: number, direction: -1 | 1) => {
    const next = [...story];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    commitStory(next);
  };

  if (!loaded) return <Skeleton />;

  const confirmRemove = (label: string, remove: () => void) => {
    if (window.confirm(`Remove "${label}"?`)) remove();
  };

  return (
    <form onSubmit={handleSubmit(onSave, onInvalid)} noValidate aria-label="About page editor">
      {notice ? (
        <Notice tone={notice.tone} title={notice.title} list={notice.list}>
          {notice.body ? <p>{notice.body}</p> : null}
        </Notice>
      ) : null}

      <Panel title="Page header" lede="Banner at the top of the about page.">
        <PageHeaderGroup
          prefix="header"
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
        />
      </Panel>

      <Panel title="Story" lede="Business story beside the photo.">
        <AdField id="story-eyebrow" label="Eyebrow" required error={errMsg(errors.storyEyebrow)}>
          <TextInput
            id="story-eyebrow"
            type="text"
            error={errMsg(errors.storyEyebrow)}
            {...register("storyEyebrow")}
          />
        </AdField>
        <AdField id="story-heading" label="Heading" required error={errMsg(errors.storyHeading)}>
          <TextInput
            id="story-heading"
            type="text"
            error={errMsg(errors.storyHeading)}
            {...register("storyHeading")}
          />
        </AdField>
        <StringList
          label="Story paragraph"
          addLabel="Add paragraph"
          emptyText="Story paragraphs appear in order beside the photo."
          items={story}
          itemError={(index) => errorAt(errors, `${storyPath}.${index}`)}
          onChange={(index, value) => {
            const next = [...story];
            next[index] = value;
            commitStory(next);
          }}
          onAdd={() => commitStory([...story, ""])}
          onRemove={(index) => {
            if (window.confirm(`Remove paragraph ${index + 1}?`)) {
              commitStory(story.filter((_, i) => i !== index));
            }
          }}
          onMove={moveStory}
        />
      </Panel>

      <Panel title="Stats" lede="At-a-glance figures on the dark band.">
        <ArraySection
          title="Stat list"
          count={stats.fields.length}
          addLabel="Add stat"
          onAdd={() => stats.append({ value: "", label: "" })}
          emptyTitle="No stats"
          emptyBody="The stats band is hidden while the list is empty."
        >
          {stats.fields.map((field, index) => {
            const base = `stats.${index}` as const;
            const value = watch(`${base}.value`) || `Stat ${index + 1}`;
            return (
              <ItemCard
                key={field.id}
                index={index}
                title={String(value)}
                disableUp={index === 0}
                disableDown={index === stats.fields.length - 1}
                onMoveUp={() => stats.move(index, index - 1)}
                onMoveDown={() => stats.move(index, index + 1)}
                onDuplicate={() => {
                  const current = getValues("stats");
                  stats.insert(index + 1, { ...current[index] });
                }}
                onRemove={() => confirmRemove(String(value), () => stats.remove(index))}
              >
                <div className="ad-grid-2">
                  <AdField
                    id={`${base}-value`}
                    label="Value"
                    required
                    hint="For example 3, 4 hrs, HD."
                    error={errorAt(errors, `${base}.value`)}
                  >
                    <TextInput
                      id={`${base}-value`}
                      type="text"
                      error={errorAt(errors, `${base}.value`)}
                      {...register(`${base}.value`)}
                    />
                  </AdField>
                  <AdField
                    id={`${base}-label`}
                    label="Label"
                    required
                    error={errorAt(errors, `${base}.label`)}
                  >
                    <TextInput
                      id={`${base}-label`}
                      type="text"
                      error={errorAt(errors, `${base}.label`)}
                      {...register(`${base}.label`)}
                    />
                  </AdField>
                </div>
              </ItemCard>
            );
          })}
        </ArraySection>
      </Panel>

      <Panel title="Values" lede="The three standards behind every booking.">
        <SectionHeadingGroup prefix="valuesHeading" register={register} errors={errors} />
        <ArraySection
          title="Value list"
          count={values.fields.length}
          addLabel="Add value"
          onAdd={() => values.append({ id: createId("value"), title: "", detail: "" })}
          emptyTitle="No values"
          emptyBody="The values grid is hidden while the list is empty."
        >
          {values.fields.map((field, index) => {
            const base = `values.${index}` as const;
            const title = watch(`${base}.title`) || `Value ${index + 1}`;
            return (
              <ItemCard
                key={field.id}
                index={index}
                title={String(title)}
                idText={field.id}
                disableUp={index === 0}
                disableDown={index === values.fields.length - 1}
                onMoveUp={() => values.move(index, index - 1)}
                onMoveDown={() => values.move(index, index + 1)}
                onDuplicate={() => {
                  const current = getValues("values");
                  values.insert(index + 1, { ...current[index], id: createId("value") });
                }}
                onRemove={() => confirmRemove(String(title), () => values.remove(index))}
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
        title="Next step"
        lede="Panel linking on to services and the enquiry form. The first half of the paragraph comes from Site settings."
      >
        <AdField id="next-heading" label="Heading" required error={errorAt(errors, "next.heading")}>
          <TextInput
            id="next-heading"
            type="text"
            error={errorAt(errors, "next.heading")}
            {...register("next.heading")}
          />
        </AdField>
        <AdField
          id="next-suffix"
          label="Closing line"
          required
          hint="Follows the service area statement, for example Ready to talk dates?"
          error={errorAt(errors, "next.suffix")}
        >
          <TextInput
            id="next-suffix"
            type="text"
            error={errorAt(errors, "next.suffix")}
            {...register("next.suffix")}
          />
        </AdField>
        <div className="ad-grid-2">
          <AdField
            id="next-services"
            label="Services button label"
            required
            error={errorAt(errors, "next.servicesLabel")}
          >
            <TextInput
              id="next-services"
              type="text"
              error={errorAt(errors, "next.servicesLabel")}
              {...register("next.servicesLabel")}
            />
          </AdField>
          <AdField
            id="next-enquire"
            label="Enquiry button label"
            required
            error={errorAt(errors, "next.enquireLabel")}
          >
            <TextInput
              id="next-enquire"
              type="text"
              error={errorAt(errors, "next.enquireLabel")}
              {...register("next.enquireLabel")}
            />
          </AdField>
        </div>
      </Panel>

      <Panel title="Call to action" lede="Closing enquiry band on the about page.">
        <CtaBandGroup prefix="ctaBand" register={register} errors={errors} watch={watch} />
      </Panel>

      <Panel
        title="SEO"
        lede="Search result title, description and social share image for the about page."
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
