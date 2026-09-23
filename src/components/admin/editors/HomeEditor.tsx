// Home page editor (Website CMS): hero, intro, headings, steps, reviews and
// event types. The services, packages, showcase images and FAQ items shown on
// the homepage are managed in Modules; this editor owns the home-only copy.

import { useFieldArray } from "react-hook-form";
import { homeSchema } from "../../../lib/cms/schemas";
import { createId } from "../../../lib/cms/repository";
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
import type { CmsImage } from "../../../lib/cms/types";

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
  const steps = useFieldArray({ control, name: "steps" });
  const testimonials = useFieldArray({ control, name: "testimonials" });

  const eventTypesPath = "eventTypes" as const;
  const eventTypes = (watch(eventTypesPath) as string[]) ?? [];
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

  const heroImage = (watch("hero.background") as CmsImage) ?? { key: null, src: "", alt: "" };

  return (
    <form onSubmit={handleSubmit(onSave, onInvalid)} noValidate aria-label="Home page editor">
      {notice ? (
        <Notice tone={notice.tone} title={notice.title} list={notice.list}>
          {notice.body ? <p>{notice.body}</p> : null}
        </Notice>
      ) : null}

      <Panel title="Hero" lede="Top of the homepage: headline, supporting text, buttons and stats.">
        <div className="ad-grid-2">
          <AdField
            id="hero-eyebrow"
            label="Eyebrow"
            required
            error={errMsg(
              (errors as never as { hero?: { eyebrow?: { message?: string } } }).hero?.eyebrow,
            )}
          >
            <TextInput
              id="hero-eyebrow"
              type="text"
              error={errMsg(
                (errors as never as { hero?: { eyebrow?: { message?: string } } }).hero?.eyebrow,
              )}
              {...register("hero.eyebrow")}
            />
          </AdField>
          <AdField
            id="hero-headline"
            label="Headline"
            required
            error={errMsg(
              (errors as never as { hero?: { headline?: { message?: string } } }).hero?.headline,
            )}
          >
            <TextInput
              id="hero-headline"
              type="text"
              error={errMsg(
                (errors as never as { hero?: { headline?: { message?: string } } }).hero?.headline,
              )}
              {...register("hero.headline")}
            />
          </AdField>
        </div>
        <AdField
          id="hero-supporting"
          label="Supporting text"
          required
          error={errMsg(
            (errors as never as { hero?: { supporting?: { message?: string } } }).hero?.supporting,
          )}
        >
          <TextArea
            id="hero-supporting"
            rows={3}
            error={errMsg(
              (errors as never as { hero?: { supporting?: { message?: string } } }).hero
                ?.supporting,
            )}
            {...register("hero.supporting")}
          />
        </AdField>
        <div className="ad-grid-2">
          <AdField
            id="hero-primary"
            label="Primary button label"
            required
            error={errMsg(
              (errors as never as { hero?: { primaryLabel?: { message?: string } } }).hero
                ?.primaryLabel,
            )}
          >
            <TextInput
              id="hero-primary"
              type="text"
              error={errMsg(
                (errors as never as { hero?: { primaryLabel?: { message?: string } } }).hero
                  ?.primaryLabel,
              )}
              {...register("hero.primaryLabel")}
            />
          </AdField>
          <AdField
            id="hero-secondary"
            label="Secondary button label"
            required
            error={errMsg(
              (errors as never as { hero?: { secondaryLabel?: { message?: string } } }).hero
                ?.secondaryLabel,
            )}
          >
            <TextInput
              id="hero-secondary"
              type="text"
              error={errMsg(
                (errors as never as { hero?: { secondaryLabel?: { message?: string } } }).hero
                  ?.secondaryLabel,
              )}
              {...register("hero.secondaryLabel")}
            />
          </AdField>
        </div>
        <ImageField
          legend="Hero background image."
          value={heroImage}
          onChange={(next) => setValue("hero.background", next, { shouldDirty: true })}
          error={errorAt(errors, "hero.background")}
          altError={errorAt(errors, "hero.background.alt")}
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
                  const current = getValues("hero.stats") as { value: string; label: string }[];
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
        <AdField
          id="intro-eyebrow"
          label="Eyebrow"
          required
          error={errorAt(errors, "intro.eyebrow")}
        >
          <TextInput
            id="intro-eyebrow"
            type="text"
            error={errorAt(errors, "intro.eyebrow")}
            {...register("intro.eyebrow")}
          />
        </AdField>
        <AdField
          id="intro-heading"
          label="Heading"
          required
          error={errorAt(errors, "intro.heading")}
        >
          <TextInput
            id="intro-heading"
            type="text"
            error={errorAt(errors, "intro.heading")}
            {...register("intro.heading")}
          />
        </AdField>
        <AdField id="intro-body" label="Body text" required error={errorAt(errors, "intro.body")}>
          <TextArea
            id="intro-body"
            rows={4}
            error={errorAt(errors, "intro.body")}
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
                  const current = getValues("intro.promises") as {
                    title: string;
                    detail: string;
                  }[];
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
          error={errorAt(errors, "intro.aboutLabel")}
        >
          <TextInput
            id="intro-about"
            type="text"
            error={errorAt(errors, "intro.aboutLabel")}
            {...register("intro.aboutLabel")}
          />
        </AdField>
      </Panel>

      <Panel
        title="Services section"
        lede="Heading and card button. The service list comes from the Services module."
      >
        <SectionHeadingGroup prefix="servicesHeading" register={register} errors={errors} />
        <AdField
          id="services-card-cta"
          label="Card button label"
          required
          error={errorAt(errors, "servicesCardLabel")}
        >
          <TextInput
            id="services-card-cta"
            type="text"
            error={errorAt(errors, "servicesCardLabel")}
            {...register("servicesCardLabel")}
          />
        </AdField>
      </Panel>

      <Panel
        title="Showcase"
        lede="Heading and link. The images come from highlighted Gallery items."
      >
        <SectionHeadingGroup prefix="showcaseHeading" register={register} errors={errors} />
        <AdField
          id="showcase-label"
          label="Gallery button label"
          required
          error={errorAt(errors, "showcaseLabel")}
        >
          <TextInput
            id="showcase-label"
            type="text"
            error={errorAt(errors, "showcaseLabel")}
            {...register("showcaseLabel")}
          />
        </AdField>
      </Panel>

      <Panel
        title="Packages section"
        lede="Heading and link. The package cards come from the Packages module."
      >
        <SectionHeadingGroup prefix="packagesHeading" register={register} errors={errors} />
        <AdField
          id="packages-compare"
          label="Compare button label"
          required
          error={errorAt(errors, "packagesCompareLabel")}
        >
          <TextInput
            id="packages-compare"
            type="text"
            error={errorAt(errors, "packagesCompareLabel")}
            {...register("packagesCompareLabel")}
          />
        </AdField>
      </Panel>

      <Panel title="Process steps" lede="The three steps from enquiry to celebration.">
        <SectionHeadingGroup prefix="processHeading" register={register} errors={errors} />
        <ArraySection
          title="Steps"
          count={steps.fields.length}
          addLabel="Add step"
          onAdd={() => steps.append({ id: createId("step"), title: "", summary: "" })}
          emptyTitle="No steps"
          emptyBody="Add at least one step; the homepage shows them in order."
        >
          {steps.fields.map((field, index) => {
            const base = `steps.${index}` as const;
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
                  const current = getValues("steps") as {
                    id: string;
                    title: string;
                    summary: string;
                  }[];
                  const source = current[index];
                  steps.insert(index + 1, {
                    ...source,
                    id: (source.id ?? "").includes("-") ? source.id : createId("step"),
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
        <SectionHeadingGroup prefix="reviewsHeading" register={register} errors={errors} />
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
            const base = `testimonials.${index}` as const;
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
                  const current = getValues("testimonials") as {
                    id: string;
                    quote: string;
                    name: string;
                    eventType: string;
                  }[];
                  const source = current[index];
                  testimonials.insert(index + 1, {
                    ...source,
                    id: `${source.id}${source.id.endsWith("-dup") ? "" : "-dup"}`,
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
        lede="Heading and link. The FAQ page shows all highlighted questions; the homepage shows the first four."
      >
        <SectionHeadingGroup prefix="faqHeading" register={register} errors={errors} />
        <AdField
          id="faq-read-all"
          label="Read-all button label"
          required
          error={errorAt(errors, "faqCtaLabel")}
        >
          <TextInput
            id="faq-read-all"
            type="text"
            error={errorAt(errors, "faqCtaLabel")}
            {...register("faqCtaLabel")}
          />
        </AdField>
      </Panel>

      <Panel title="Event types" lede="Occasion chips shown at the bottom of the homepage.">
        <SectionHeadingGroup prefix="eventTypesHeading" register={register} errors={errors} />
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
        <CtaBandGroup
          prefix="ctaBand"
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
        />
      </Panel>

      <Panel
        title="SEO"
        lede="Search result title, description and social share image for the homepage."
      >
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
