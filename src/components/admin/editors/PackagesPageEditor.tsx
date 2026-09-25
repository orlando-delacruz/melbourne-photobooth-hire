// Packages Page editor (Website CMS): header, add-ons, policies and SEO.
// The package plans themselves live in the Packages module.

import { packagesPageSchema } from "../../../lib/cms/schemas";
import { useFieldArray } from "react-hook-form";
import { createId, slugId } from "../../../lib/cms/ids";
import SaveBar from "../SaveBar";
import { AdField, ArraySection, ItemCard, Notice, Skeleton, TextArea, TextInput } from "../fields";
import {
  CtaBandGroup,
  PageHeaderGroup,
  Panel,
  SectionHeadingGroup,
  StringList,
  errMsg,
  errorAt,
} from "../groups";
import { useSectionEditor } from "../useSectionEditor";
import { confirmDestructive } from "../alerts";

export default function PackagesPageEditor() {
  const { form, loaded, saving, notice, savedAt, onSave, onInvalid, onDiscard, onResetSection } =
    useSectionEditor("packages", packagesPageSchema);
  const {
    register,
    control,
    watch,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  const addOns = useFieldArray({ control, name: "addOns" });

  const inclusionsPath = "included.standardItems" as const;
  const inclusions = (watch(inclusionsPath) as string[]) ?? [];
  const commitInclusions = (next: string[]) =>
    setValue(inclusionsPath, next, { shouldDirty: true, shouldValidate: true });

  const policiesPath = "bookingPolicies" as const;
  const policies = (watch(policiesPath) as string[]) ?? [];
  const commitPolicies = (next: string[]) =>
    setValue(policiesPath, next, { shouldDirty: true, shouldValidate: true });
  const movePolicy = (index: number, direction: -1 | 1) => {
    const next = [...policies];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    commitPolicies(next);
  };

  if (!loaded) return <Skeleton />;

  return (
    <form onSubmit={handleSubmit(onSave, onInvalid)} noValidate aria-label="Packages page editor">
      {notice ? (
        <Notice tone={notice.tone} title={notice.title} list={notice.list}>
          {notice.body ? <p>{notice.body}</p> : null}
        </Notice>
      ) : null}

      <Panel title="Page header" lede="Banner at the top of the packages page.">
        <PageHeaderGroup
          prefix="header"
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
        />
      </Panel>

      <Panel
        title="Plans section"
        lede="Heading for the plans area. The package cards come from the Packages module."
      >
        <SectionHeadingGroup prefix="plansHeading" register={register} errors={errors} />
        <div className="ad-stack">
          <AdField
            id="plans-empty-title"
            label="Empty-state title"
            required
            hint="Shown only while no packages exist."
            error={errorAt(errors, "emptyState.title")}
          >
            <TextInput
              id="plans-empty-title"
              type="text"
              error={errorAt(errors, "emptyState.title")}
              {...register("emptyState.title")}
            />
          </AdField>
          <AdField
            id="plans-empty-body"
            label="Empty-state text"
            required
            error={errorAt(errors, "emptyState.body")}
          >
            <TextArea
              id="plans-empty-body"
              rows={2}
              error={errorAt(errors, "emptyState.body")}
              {...register("emptyState.body")}
            />
          </AdField>
          <AdField
            id="plans-empty-action"
            label="Empty-state button label"
            required
            error={errorAt(errors, "emptyState.actionLabel")}
          >
            <TextInput
              id="plans-empty-action"
              type="text"
              error={errorAt(errors, "emptyState.actionLabel")}
              {...register("emptyState.actionLabel")}
            />
          </AdField>
          <AdField
            id="plans-foot"
            label="Note below the plans"
            required
            error={errMsg(errors.footNote)}
          >
            <TextArea
              id="plans-foot"
              rows={3}
              error={errMsg(errors.footNote)}
              {...register("footNote")}
            />
          </AdField>
          <AdField
            id="plans-check"
            label="Check-date button label"
            required
            error={errMsg(errors.checkDateLabel)}
          >
            <TextInput
              id="plans-check"
              type="text"
              error={errMsg(errors.checkDateLabel)}
              {...register("checkDateLabel")}
            />
          </AdField>
        </div>
      </Panel>

      <Panel
        title="Included as standard"
        lede="Fallback list used when fewer than four inclusions are shared by every plan."
      >
        <AdField
          id="included-eyebrow"
          label="Eyebrow"
          required
          error={errorAt(errors, "included.eyebrow")}
        >
          <TextInput
            id="included-eyebrow"
            type="text"
            error={errorAt(errors, "included.eyebrow")}
            {...register("included.eyebrow")}
          />
        </AdField>
        <AdField
          id="included-heading"
          label="Heading"
          required
          error={errorAt(errors, "included.heading")}
        >
          <TextInput
            id="included-heading"
            type="text"
            error={errorAt(errors, "included.heading")}
            {...register("included.heading")}
          />
        </AdField>
        <AdField
          id="included-lede"
          label="Supporting text"
          required
          error={errorAt(errors, "included.lede")}
        >
          <TextArea
            id="included-lede"
            rows={3}
            error={errorAt(errors, "included.lede")}
            {...register("included.lede")}
          />
        </AdField>
        <StringList
          label="Standard inclusion"
          addLabel="Add inclusion"
          emptyText="Standard inclusions show when plans share too little to list automatically."
          items={inclusions}
          itemError={(index) => errorAt(errors, `${inclusionsPath}.${index}`)}
          onChange={(index, value) => {
            const next = [...inclusions];
            next[index] = value;
            commitInclusions(next);
          }}
          onAdd={() => commitInclusions([...inclusions, ""])}
          onRemove={(index) => {
            void confirmDestructive({
              title: `Remove inclusion ${index + 1}?`,
              confirmText: "Remove",
            }).then((confirmed) => {
              if (confirmed) commitInclusions(inclusions.filter((_, i) => i !== index));
            });
          }}
          onMove={(index, direction) => {
            const next = [...inclusions];
            const target = index + direction;
            if (target < 0 || target >= next.length) return;
            const [moved] = next.splice(index, 1);
            next.splice(target, 0, moved);
            commitInclusions(next);
          }}
        />
      </Panel>

      <Panel title="Add-ons" lede="Optional extras below the included band.">
        <SectionHeadingGroup prefix="addonsHeading" register={register} errors={errors} />
        <ArraySection
          title="Add-on list"
          count={addOns.fields.length}
          addLabel="Add add-on"
          onAdd={() => addOns.append({ id: createId("addon"), name: "", detail: "" })}
          emptyTitle="No add-ons"
          emptyBody="Add optional extras to show them on the packages page."
        >
          {addOns.fields.map((field, index) => {
            const base = `addOns.${index}` as const;
            const title = watch(`${base}.name`) || `Add-on ${index + 1}`;
            return (
              <ItemCard
                key={field.id}
                index={index}
                title={String(title)}
                idText={field.id}
                disableUp={index === 0}
                disableDown={index === addOns.fields.length - 1}
                onMoveUp={() => addOns.move(index, index - 1)}
                onMoveDown={() => addOns.move(index, index + 1)}
                onDuplicate={() => {
                  const current = getValues("addOns");
                  addOns.insert(index + 1, {
                    ...current[index],
                    id: slugId(current[index].name || "addon", "addon"),
                  });
                }}
                onRemove={() => {
                  void confirmDestructive({
                    title: `Remove "${String(title)}"?`,
                    confirmText: "Remove",
                  }).then((confirmed) => {
                    if (confirmed) addOns.remove(index);
                  });
                }}
              >
                <AdField
                  id={`a-${index}-name`}
                  label="Name"
                  required
                  error={errorAt(errors, `${base}.name`)}
                >
                  <TextInput
                    id={`a-${index}-name`}
                    type="text"
                    error={errorAt(errors, `${base}.name`)}
                    {...register(`${base}.name`)}
                  />
                </AdField>
                <AdField
                  id={`a-${index}-detail`}
                  label="Detail"
                  required
                  error={errorAt(errors, `${base}.detail`)}
                >
                  <TextArea
                    id={`a-${index}-detail`}
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

      <Panel title="Booking policies" lede="Plain-language essentials below the add-ons.">
        <AdField
          id="policies-eyebrow"
          label="Eyebrow"
          required
          error={errorAt(errors, "policies.eyebrow")}
        >
          <TextInput
            id="policies-eyebrow"
            type="text"
            error={errorAt(errors, "policies.eyebrow")}
            {...register("policies.eyebrow")}
          />
        </AdField>
        <AdField
          id="policies-heading"
          label="Heading"
          required
          error={errorAt(errors, "policies.heading")}
        >
          <TextInput
            id="policies-heading"
            type="text"
            error={errorAt(errors, "policies.heading")}
            {...register("policies.heading")}
          />
        </AdField>
        <AdField
          id="policies-lede"
          label="Supporting text"
          required
          error={errorAt(errors, "policies.lede")}
        >
          <TextArea
            id="policies-lede"
            rows={2}
            error={errorAt(errors, "policies.lede")}
            {...register("policies.lede")}
          />
        </AdField>
        <StringList
          label="Policy"
          addLabel="Add policy"
          emptyText="Policies appear as a checklist."
          items={policies}
          itemError={(index) => errorAt(errors, `${policiesPath}.${index}`)}
          onChange={(index, value) => {
            const next = [...policies];
            next[index] = value;
            commitPolicies(next);
          }}
          onAdd={() => commitPolicies([...policies, ""])}
          onRemove={(index) => {
            void confirmDestructive({
              title: `Remove policy ${index + 1}?`,
              confirmText: "Remove",
            }).then((confirmed) => {
              if (confirmed) commitPolicies(policies.filter((_, i) => i !== index));
            });
          }}
          onMove={movePolicy}
        />
      </Panel>

      <Panel title="Call to action" lede="Closing enquiry band on the packages page.">
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
