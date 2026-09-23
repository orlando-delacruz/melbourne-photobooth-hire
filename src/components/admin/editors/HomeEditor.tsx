// Home page editor: hero, intro, section headings, showcase, process steps,
// reviews, event types, call-to-action band and SEO metadata. The service,
// package and FAQ lists shown on the homepage are edited under their own
// sections; this editor owns the home-only copy around them.

import { useFieldArray } from "react-hook-form";
import { homeSchema } from "../../../lib/cms/schemas";
import { createId, slugId } from "../../../lib/cms/repository";
import SaveBar from "../SaveBar";
import {
  AdField,
  AdSelect,
  ArraySection,
  ImageField,
  ItemCard,
  Notice,
  Skeleton,
  TextArea,
  TextInput,
} from "../fields";
import {
  CtaBandGroup,
  Panel,
  RATING_OPTIONS,
  STAT_ICON_OPTIONS,
  STEP_ICON_OPTIONS,
  SectionHeadingGroup,
  SeoGroup,
  StringList,
  errMsg,
  errorAt,
  optionalSelect,
} from "../groups";
import { useSectionEditor } from "../useSectionEditor";

export default function HomeEditor() {
  const { form, loaded, saving, notice, savedAt, onSave, onInvalid, onDiscard, onResetSection } =
    useSectionEditor("home", homeSchema);
  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  const stats = useFieldArray({ control, name: "hero.stats" });
  const promises = useFieldArray({ control, name: "intro.promises" });
  const showcase = useFieldArray({ control, name: "showcase.images" });
  const steps = useFieldArray({ control, name: "processSection.steps" });
  const testimonials = useFieldArray({ control, name: "reviewsSection.testimonials" });

  const eventTypesPath = "eventTypesSection.eventTypes" as const;
  const eventTypes = watch(eventTypesPath) ?? [];
  const commitEventTypes = (next: string[]) =>
    setValue(eventTypesPath, next, { shouldDirty: true, shouldValidate: true });
  const moveEventType = (index: number, direction: -1 | 1) => {
    const next = [...eventTypes];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    commitEventTypes(next);
  };

  if (!loaded) return <Skeleton />;

  const confirmRemove = (label: string, remove: () => void) => {
    if (window.confirm(`Remove "${label}"?`)) remove();
  };

  return (
    <form onSubmit={handleSubmit(onSave, onInvalid)} noValidate aria-label="Home page editor">
      {notice ? (
        <Notice tone={notice.tone} title={notice.title} list={notice.list}>
          {notice.body ? <p>{notice.body}</p> : null}
        </Notice>
      ) : null}

      <Panel title="Hero" lede="Top of the homepage: headline, supporting text, buttons and stats.">
        <div className="ad-grid-2">
          <AdField id="hero-eyebrow" label="Eyebrow" required error={errMsg(errors.hero?.eyebrow)}>
            <TextInput
              id="hero-eyebrow"
              type="text"
              error={errMsg(errors.hero?.eyebrow)}
              {...register("hero.eyebrow")}
            />
          </AdField>
          <AdField
            id="hero-headline"
            label="Headline"
            required
            error={errMsg(errors.hero?.headline)}
          >
            <TextInput
              id="hero-headline"
              type="text"
              error={errMsg(errors.hero?.headline)}
              {...register("hero.headline")}
            />
          </AdField>
        </div>
        <AdField
          id="hero-supporting"
          label="Supporting text"
          required
          error={errMsg(errors.hero?.supporting)}
        >
          <TextArea
            id="hero-supporting"
            rows={3}
            error={errMsg(errors.hero?.supporting)}
            {...register("hero.supporting")}
          />
        </AdField>
        <div className="ad-grid-2">
          <AdField
            id="hero-primary"
            label="Primary button label"
            required
            error={errMsg(errors.hero?.primaryLabel)}
          >
            <TextInput
              id="hero-primary"
              type="text"
              error={errMsg(errors.hero?.primaryLabel)}
              {...register("hero.primaryLabel")}
            />
          </AdField>
          <AdField
            id="hero-secondary"
            label="Secondary button label"
            required
            error={errMsg(errors.hero?.secondaryLabel)}
          >
            <TextInput
              id="hero-secondary"
              type="text"
              error={errMsg(errors.hero?.secondaryLabel)}
              {...register("hero.secondaryLabel")}
            />
          </AdField>
        </div>
        <ImageField
          legend="Hero background image."
          srcProps={register("hero.backgroundSrc")}
          srcError={errMsg(errors.hero?.backgroundSrc)}
          altProps={register("hero.backgroundAlt")}
          altError={errMsg(errors.hero?.backgroundAlt)}
          previewSrc={String(watch("hero.backgroundSrc") ?? "")}
        />
        <ArraySection
          title="Hero stats"
          count={stats.fields.length}
          addLabel="Add stat"
          onAdd={() => stats.append({ value: "", label: "" })}
          emptyTitle="No hero stats"
          emptyBody="Add at least one stat; the hero shows them in a row under the buttons."
        >
          {stats.fields.map((field, index) => {
            const base = `hero.stats.${index}` as const;
            const title = watch(`${base}.value`) || `Stat ${index + 1}`;
            return (
              <ItemCard
                key={field.id}
                index={index}
                title={String(title)}
                disableUp={index === 0}
                disableDown={index === stats.fields.length - 1}
                onMoveUp={() => stats.move(index, index - 1)}
                onMoveDown={() => stats.move(index, index + 1)}
                onDuplicate={() => {
                  const current = getValues("hero.stats");
                  stats.insert(index + 1, { ...current[index] });
                }}
                onRemove={() => confirmRemove(String(title), () => stats.remove(index))}
              >
                <div className="ad-grid-2">
                  <AdField
                    id={`${base}-value`}
                    label="Value"
                    required
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
                <AdField id={`${base}-icon`} label="Icon" error={errorAt(errors, `${base}.icon`)}>
                  <AdSelect
                    id={`${base}-icon`}
                    error={errorAt(errors, `${base}.icon`)}
                    {...optionalSelect(register, base + ".icon")}
                  >
                    {STAT_ICON_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </AdSelect>
                </AdField>
              </ItemCard>
            );
          })}
        </ArraySection>
      </Panel>

      <Panel title="Intro" lede="The experience section below the hero.">
        <AdField id="intro-eyebrow" label="Eyebrow" required error={errMsg(errors.intro?.eyebrow)}>
          <TextInput
            id="intro-eyebrow"
            type="text"
            error={errMsg(errors.intro?.eyebrow)}
            {...register("intro.eyebrow")}
          />
        </AdField>
        <AdField id="intro-heading" label="Heading" required error={errMsg(errors.intro?.heading)}>
          <TextInput
            id="intro-heading"
            type="text"
            error={errMsg(errors.intro?.heading)}
            {...register("intro.heading")}
          />
        </AdField>
        <AdField id="intro-body" label="Body text" required error={errMsg(errors.intro?.body)}>
          <TextArea
            id="intro-body"
            rows={4}
            error={errMsg(errors.intro?.body)}
            {...register("intro.body")}
          />
        </AdField>
        <ArraySection
          title="Promises"
          count={promises.fields.length}
          addLabel="Add promise"
          onAdd={() => promises.append({ title: "", detail: "" })}
          emptyTitle="No promises"
          emptyBody="Promises appear as a short list under the intro text."
        >
          {promises.fields.map((field, index) => {
            const base = `intro.promises.${index}` as const;
            const title = watch(`${base}.title`) || `Promise ${index + 1}`;
            return (
              <ItemCard
                key={field.id}
                index={index}
                title={String(title)}
                disableUp={index === 0}
                disableDown={index === promises.fields.length - 1}
                onMoveUp={() => promises.move(index, index - 1)}
                onMoveDown={() => promises.move(index, index + 1)}
                onDuplicate={() => {
                  const current = getValues("intro.promises");
                  promises.insert(index + 1, { ...current[index] });
                }}
                onRemove={() => confirmRemove(String(title), () => promises.remove(index))}
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
                  <TextInput
                    id={`${base}-detail`}
                    type="text"
                    error={errorAt(errors, `${base}.detail`)}
                    {...register(`${base}.detail`)}
                  />
                </AdField>
              </ItemCard>
            );
          })}
        </ArraySection>
        <AdField
          id="intro-about"
          label="About button label"
          required
          error={errMsg(errors.intro?.aboutLabel)}
        >
          <TextInput
            id="intro-about"
            type="text"
            error={errMsg(errors.intro?.aboutLabel)}
            {...register("intro.aboutLabel")}
          />
        </AdField>
      </Panel>

      <Panel
        title="Services section"
        lede="Heading and card button. The service list itself is edited under Services."
      >
        <SectionHeadingGroup prefix="servicesSection.heading" register={register} errors={errors} />
        <AdField
          id="services-card-cta"
          label="Card button label"
          required
          error={errMsg(errors.servicesSection?.cardCtaLabel)}
        >
          <TextInput
            id="services-card-cta"
            type="text"
            error={errMsg(errors.servicesSection?.cardCtaLabel)}
            {...register("servicesSection.cardCtaLabel")}
          />
        </AdField>
      </Panel>

      <Panel title="Showcase" lede="Styled-moments image row linking to the gallery.">
        <SectionHeadingGroup prefix="showcase.heading" register={register} errors={errors} />
        <AdField
          id="showcase-label"
          label="Gallery button label"
          required
          error={errMsg(errors.showcase?.galleryLabel)}
        >
          <TextInput
            id="showcase-label"
            type="text"
            error={errMsg(errors.showcase?.galleryLabel)}
            {...register("showcase.galleryLabel")}
          />
        </AdField>
        <ArraySection
          title="Showcase images"
          count={showcase.fields.length}
          addLabel="Add image"
          onAdd={() => showcase.append({ src: "", alt: "", caption: "" })}
          emptyTitle="No showcase images"
          emptyBody="Showcase images appear in a row; each links to the gallery."
        >
          {showcase.fields.map((field, index) => {
            const base = `showcase.images.${index}` as const;
            const caption = watch(`${base}.caption`) || `Image ${index + 1}`;
            return (
              <ItemCard
                key={field.id}
                index={index}
                title={String(caption)}
                disableUp={index === 0}
                disableDown={index === showcase.fields.length - 1}
                onMoveUp={() => showcase.move(index, index - 1)}
                onMoveDown={() => showcase.move(index, index + 1)}
                onDuplicate={() => {
                  const current = getValues("showcase.images");
                  showcase.insert(index + 1, { ...current[index] });
                }}
                onRemove={() => confirmRemove(String(caption), () => showcase.remove(index))}
              >
                <ImageField
                  legend="Showcase image."
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
      </Panel>

      <Panel
        title="Packages section"
        lede="Heading and link. The package cards are edited under Packages."
      >
        <SectionHeadingGroup prefix="packagesSection.heading" register={register} errors={errors} />
        <AdField
          id="packages-compare"
          label="Compare button label"
          required
          error={errMsg(errors.packagesSection?.compareLabel)}
        >
          <TextInput
            id="packages-compare"
            type="text"
            error={errMsg(errors.packagesSection?.compareLabel)}
            {...register("packagesSection.compareLabel")}
          />
        </AdField>
      </Panel>

      <Panel title="Process steps" lede="The three steps from enquiry to celebration.">
        <SectionHeadingGroup prefix="processSection.heading" register={register} errors={errors} />
        <ArraySection
          title="Steps"
          count={steps.fields.length}
          addLabel="Add step"
          onAdd={() => steps.append({ id: createId("step"), title: "", summary: "" })}
          emptyTitle="No steps"
          emptyBody="Add at least one step; the homepage shows them in order."
        >
          {steps.fields.map((field, index) => {
            const base = `processSection.steps.${index}` as const;
            const title = watch(`${base}.title`) || `Step ${index + 1}`;
            return (
              <ItemCard
                key={field.id}
                index={index}
                title={String(title)}
                idText={field.id}
                disableUp={index === 0}
                disableDown={index === steps.fields.length - 1}
                onMoveUp={() => steps.move(index, index - 1)}
                onMoveDown={() => steps.move(index, index + 1)}
                onDuplicate={() => {
                  const current = getValues("processSection.steps");
                  steps.insert(index + 1, {
                    ...current[index],
                    id: slugId(current[index].title || "step", "step"),
                  });
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
                  id={`${base}-summary`}
                  label="Summary"
                  required
                  error={errorAt(errors, `${base}.summary`)}
                >
                  <TextArea
                    id={`${base}-summary`}
                    rows={3}
                    error={errorAt(errors, `${base}.summary`)}
                    {...register(`${base}.summary`)}
                  />
                </AdField>
                <AdField id={`${base}-icon`} label="Icon" error={errorAt(errors, `${base}.icon`)}>
                  <AdSelect
                    id={`${base}-icon`}
                    error={errorAt(errors, `${base}.icon`)}
                    {...optionalSelect(register, base + ".icon")}
                  >
                    {STEP_ICON_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </AdSelect>
                </AdField>
              </ItemCard>
            );
          })}
        </ArraySection>
      </Panel>

      <Panel title="Reviews" lede="Testimonials shown in the homepage marquee.">
        <SectionHeadingGroup prefix="reviewsSection.heading" register={register} errors={errors} />
        <ArraySection
          title="Testimonials"
          count={testimonials.fields.length}
          addLabel="Add testimonial"
          onAdd={() =>
            testimonials.append({ id: createId("testimonial"), quote: "", name: "", eventType: "" })
          }
          emptyTitle="No testimonials"
          emptyBody="The reviews section is hidden while the list is empty."
        >
          {testimonials.fields.map((field, index) => {
            const base = `reviewsSection.testimonials.${index}` as const;
            const name = watch(`${base}.name`) || `Testimonial ${index + 1}`;
            return (
              <ItemCard
                key={field.id}
                index={index}
                title={String(name)}
                idText={field.id}
                disableUp={index === 0}
                disableDown={index === testimonials.fields.length - 1}
                onMoveUp={() => testimonials.move(index, index - 1)}
                onMoveDown={() => testimonials.move(index, index + 1)}
                onDuplicate={() => {
                  const current = getValues("reviewsSection.testimonials");
                  testimonials.insert(index + 1, {
                    ...current[index],
                    id: slugId(current[index].name || "testimonial", "testimonial"),
                  });
                }}
                onRemove={() => confirmRemove(String(name), () => testimonials.remove(index))}
              >
                <AdField
                  id={`${base}-quote`}
                  label="Quote"
                  required
                  error={errorAt(errors, `${base}.quote`)}
                >
                  <TextArea
                    id={`${base}-quote`}
                    rows={4}
                    error={errorAt(errors, `${base}.quote`)}
                    {...register(`${base}.quote`)}
                  />
                </AdField>
                <div className="ad-grid-2">
                  <AdField
                    id={`${base}-name`}
                    label="Name"
                    required
                    error={errorAt(errors, `${base}.name`)}
                  >
                    <TextInput
                      id={`${base}-name`}
                      type="text"
                      error={errorAt(errors, `${base}.name`)}
                      {...register(`${base}.name`)}
                    />
                  </AdField>
                  <AdField
                    id={`${base}-event`}
                    label="Event type"
                    required
                    error={errorAt(errors, `${base}.eventType`)}
                  >
                    <TextInput
                      id={`${base}-event`}
                      type="text"
                      error={errorAt(errors, `${base}.eventType`)}
                      {...register(`${base}.eventType`)}
                    />
                  </AdField>
                </div>
                <AdField
                  id={`${base}-rating`}
                  label="Star rating"
                  hint="Leave as no rating unless a rating is confirmed."
                  error={errorAt(errors, `${base}.rating`)}
                >
                  <AdSelect
                    id={`${base}-rating`}
                    error={errorAt(errors, `${base}.rating`)}
                    {...register(`${base}.rating`, {
                      setValueAs: (value: unknown) => (value === "" ? undefined : Number(value)),
                    })}
                  >
                    {RATING_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </AdSelect>
                </AdField>
              </ItemCard>
            );
          })}
        </ArraySection>
      </Panel>

      <Panel
        title="FAQ teaser"
        lede="Heading and link. The questions are edited under FAQ; the homepage shows the first four."
      >
        <SectionHeadingGroup prefix="faqSection.heading" register={register} errors={errors} />
        <AdField
          id="faq-read-all"
          label="Read-all button label"
          required
          error={errMsg(errors.faqSection?.readAllLabel)}
        >
          <TextInput
            id="faq-read-all"
            type="text"
            error={errMsg(errors.faqSection?.readAllLabel)}
            {...register("faqSection.readAllLabel")}
          />
        </AdField>
      </Panel>

      <Panel title="Event types" lede="Occasion chips shown at the bottom of the homepage.">
        <SectionHeadingGroup
          prefix="eventTypesSection.heading"
          register={register}
          errors={errors}
        />
        <StringList
          label="Event type"
          addLabel="Add event type"
          emptyText="Add the occasions this business serves; they appear as chips."
          items={eventTypes}
          itemError={(index) => errorAt(errors, `${eventTypesPath}.${index}`)}
          onChange={(index, value) => {
            const next = [...eventTypes];
            next[index] = value;
            commitEventTypes(next);
          }}
          onAdd={() => commitEventTypes([...eventTypes, ""])}
          onRemove={(index) => {
            if (window.confirm(`Remove "${eventTypes[index] || `event type ${index + 1}`}"?`)) {
              commitEventTypes(eventTypes.filter((_, i) => i !== index));
            }
          }}
          onMove={moveEventType}
        />
      </Panel>

      <Panel title="Call to action" lede="Closing enquiry band on the homepage.">
        <CtaBandGroup prefix="ctaBand" register={register} errors={errors} watch={watch} />
      </Panel>

      <Panel
        title="SEO"
        lede="Search result title, description and social share image for the homepage."
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
