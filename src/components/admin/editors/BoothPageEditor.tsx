// Dedicated booth page editor (Website CMS, DEC-055, generalized DEC-058):
// page-level copy for one booth's commercial page (360, premium, roaming).
// Pricing stays plain confirmed text; a blank price label omits the pricing
// panel on the public page (never an invented price).

import { useFieldArray } from "react-hook-form";
import { boothPageSchema } from "../../../lib/cms/schemas";
import { createId } from "../../../lib/cms/ids";
import type { CmsPageKey } from "../../../lib/cms/types";
import SaveBar from "../SaveBar";
import {
  AdField,
  AdSelect,
  ArraySection,
  ItemCard,
  Notice,
  Skeleton,
  TextArea,
  TextInput,
} from "../fields";
import {
  CtaBandGroup,
  PageHeaderGroup,
  Panel,
  STEP_ICON_OPTIONS,
  SectionHeadingGroup,
  StringList,
  errMsg,
  errorAt,
  optionalSelect,
} from "../groups";
import { useSectionEditor } from "../useSectionEditor";
import { confirmDestructive } from "../alerts";
import CmsIcon from "../../live/CmsIcon";

export interface BoothPageEditorProps {
  pageKey: CmsPageKey;
  /** Display name, e.g. "360 Video Booth" — used in titles and descriptions. */
  pageName: string;
}

export default function BoothPageEditor({ pageKey, pageName }: BoothPageEditorProps) {
  const { form, loaded, saving, notice, savedAt, onSave, onInvalid, onDiscard, onResetSection } =
    useSectionEditor(pageKey, boothPageSchema);
  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  const steps = useFieldArray({ control, name: "steps" });
  const bestFor = useFieldArray({ control, name: "bestFor" });

  const pricingPointsPath = "pricingPoints" as const;
  const pricingPoints = (watch(pricingPointsPath) ?? []) as string[];
  const commitPricingPoints = (next: string[]) =>
    setValue(pricingPointsPath, next, { shouldDirty: true, shouldValidate: true });
  const movePricingPoints = (index: number, direction: -1 | 1) => {
    const next = [...pricingPoints];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    commitPricingPoints(next);
  };

  const venueNotesPath = "venueNotes" as const;
  const venueNotes = (watch(venueNotesPath) ?? []) as string[];
  const commitVenueNotes = (next: string[]) =>
    setValue(venueNotesPath, next, { shouldDirty: true, shouldValidate: true });
  const moveVenueNotes = (index: number, direction: -1 | 1) => {
    const next = [...venueNotes];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    commitVenueNotes(next);
  };

  if (!loaded) return <Skeleton />;

  const lowerName = pageName.toLowerCase();

  const confirmRemove = (label: string, remove: () => void) => {
    void confirmDestructive({ title: `Remove "${label}"?`, confirmText: "Remove" }).then(
      (confirmed) => {
        if (confirmed) remove();
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSave, onInvalid)} noValidate aria-label={`${pageName} page editor`}>
      {notice ? (
        <Notice tone={notice.tone} title={notice.title} list={notice.list}>
          {notice.body ? <p>{notice.body}</p> : null}
        </Notice>
      ) : null}

      <Panel title="Page header" lede={`Banner at the top of the ${lowerName} page.`}>
        <PageHeaderGroup
          prefix="header"
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
        />
      </Panel>

      <Panel title="How it works" lede={`Numbered steps explaining the ${lowerName} experience.`}>
        <SectionHeadingGroup prefix="stepsHeading" register={register} errors={errors} />
        <ArraySection
          title="Step list"
          count={steps.fields.length}
          addLabel="Add step"
          onAdd={() => steps.append({ id: createId("step"), title: "", summary: "" })}
          emptyTitle="No steps"
          emptyBody="The how-it-works section is hidden while the list is empty."
        >
          {steps.fields.map((field, index) => {
            const base = `steps.${index}` as const;
            const title = watch(`${base}.title`) || `Step ${index + 1}`;
            const icon = watch(`${base}.icon`);
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
                  const current = getValues("steps");
                  steps.insert(index + 1, { ...current[index], id: createId("step") });
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
                  <div className="ad-icon-select">
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
                    <span className="ad-icon-preview" aria-hidden="true">
                      {icon ? <CmsIcon name={String(icon)} size={18} /> : null}
                    </span>
                  </div>
                </AdField>
              </ItemCard>
            );
          })}
        </ArraySection>
      </Panel>

      <Panel title="Pricing" lede="Confirmed price block. Leave the price blank to hide the panel and send visitors to packages instead.">
        <SectionHeadingGroup prefix="pricingHeading" register={register} errors={errors} />
        <AdField id="price-label" label="Price" error={errMsg(errors.priceLabel)}>
          <TextInput
            id="price-label"
            type="text"
            error={errMsg(errors.priceLabel)}
            {...register("priceLabel")}
          />
        </AdField>
        <AdField id="price-note" label="Price note" error={errMsg(errors.priceNote)}>
          <TextInput
            id="price-note"
            type="text"
            error={errMsg(errors.priceNote)}
            {...register("priceNote")}
          />
        </AdField>
        <StringList
          label="Pricing point"
          addLabel="Add pricing point"
          emptyText="Pricing inclusions appear as a checklist under the price."
          items={pricingPoints}
          itemError={(index) => errorAt(errors, `${pricingPointsPath}.${index}`)}
          onChange={(index, value) => {
            const next = [...pricingPoints];
            next[index] = value;
            commitPricingPoints(next);
          }}
          onAdd={() => commitPricingPoints([...pricingPoints, ""])}
          onRemove={(index) => {
            void confirmDestructive({
              title: `Remove pricing point ${index + 1}?`,
              confirmText: "Remove",
            }).then((confirmed) => {
              if (confirmed) commitPricingPoints(pricingPoints.filter((_, i) => i !== index));
            });
          }}
          onMove={movePricingPoints}
        />
      </Panel>

      <Panel title="Best for" lede="Occasions this booth suits: weddings, corporate, birthdays.">
        <SectionHeadingGroup prefix="bestForHeading" register={register} errors={errors} />
        <ArraySection
          title="Occasion list"
          count={bestFor.fields.length}
          addLabel="Add occasion"
          onAdd={() => bestFor.append({ id: createId("occasion"), title: "", detail: "" })}
          emptyTitle="No occasions"
          emptyBody="The best-for grid is hidden while the list is empty."
        >
          {bestFor.fields.map((field, index) => {
            const base = `bestFor.${index}` as const;
            const title = watch(`${base}.title`) || `Occasion ${index + 1}`;
            return (
              <ItemCard
                key={field.id}
                index={index}
                title={String(title)}
                idText={field.id}
                disableUp={index === 0}
                disableDown={index === bestFor.fields.length - 1}
                onMoveUp={() => bestFor.move(index, index - 1)}
                onMoveDown={() => bestFor.move(index, index + 1)}
                onDuplicate={() => {
                  const current = getValues("bestFor");
                  bestFor.insert(index + 1, { ...current[index], id: createId("occasion") });
                }}
                onRemove={() => confirmRemove(String(title), () => bestFor.remove(index))}
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

      <Panel title="Venue fit" lede="Space, power and setup notes for this booth.">
        <SectionHeadingGroup prefix="venueHeading" register={register} errors={errors} />
        <StringList
          label="Venue note"
          addLabel="Add venue note"
          emptyText="Venue notes appear as a checklist."
          items={venueNotes}
          itemError={(index) => errorAt(errors, `${venueNotesPath}.${index}`)}
          onChange={(index, value) => {
            const next = [...venueNotes];
            next[index] = value;
            commitVenueNotes(next);
          }}
          onAdd={() => commitVenueNotes([...venueNotes, ""])}
          onRemove={(index) => {
            void confirmDestructive({
              title: `Remove venue note ${index + 1}?`,
              confirmText: "Remove",
            }).then((confirmed) => {
              if (confirmed) commitVenueNotes(venueNotes.filter((_, i) => i !== index));
            });
          }}
          onMove={moveVenueNotes}
        />
      </Panel>

      <Panel title="FAQ" lede={`Heading above the highlighted questions on the ${lowerName} page.`}>
        <SectionHeadingGroup prefix="faqHeading" register={register} errors={errors} />
        <AdField id="faq-cta-label" label="FAQ button label" required error={errMsg(errors.faqCtaLabel)}>
          <TextInput
            id="faq-cta-label"
            type="text"
            error={errMsg(errors.faqCtaLabel)}
            {...register("faqCtaLabel")}
          />
        </AdField>
      </Panel>

      <Panel title="Call to action" lede={`Closing enquiry band on the ${lowerName} page.`}>
        <CtaBandGroup prefix="ctaBand" register={register} errors={errors} watch={watch} setValue={setValue} />
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
