// Services page editor: header, the booth service list, call-to-action
// band and SEO metadata. These services also appear as cards on the homepage.

import { useFieldArray } from "react-hook-form";
import { servicesSchema } from "../../../lib/cms/schemas";
import { createId, slugId } from "../../../lib/cms/repository";
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
  SERVICE_ICON_OPTIONS,
  SeoGroup,
  StringList,
  errorAt,
  optionalSelect,
} from "../groups";
import { useSectionEditor } from "../useSectionEditor";

export default function ServicesEditor() {
  const { form, loaded, saving, notice, savedAt, onSave, onInvalid, onDiscard, onResetSection } =
    useSectionEditor("services", servicesSchema);
  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  const services = useFieldArray({ control, name: "services" });

  if (!loaded) return <Skeleton />;

  const confirmRemove = (label: string, remove: () => void) => {
    if (window.confirm(`Remove "${label}"?`)) remove();
  };

  return (
    <form onSubmit={handleSubmit(onSave, onInvalid)} noValidate aria-label="Services page editor">
      {notice ? (
        <Notice tone={notice.tone} title={notice.title} list={notice.list}>
          {notice.body ? <p>{notice.body}</p> : null}
        </Notice>
      ) : null}

      <Panel title="Page header" lede="Banner at the top of the services page.">
        <PageHeaderGroup prefix="header" register={register} errors={errors} watch={watch} />
      </Panel>

      <Panel
        title="Services"
        lede="The booth experiences. Each service links to the enquiry page; changing an id also changes its image lookup, so ids are shown read-only."
      >
        <ArraySection
          title="Service list"
          count={services.fields.length}
          addLabel="Add service"
          onAdd={() =>
            services.append({ id: createId("service"), name: "", summary: "", highlights: [] })
          }
          emptyTitle="No services"
          emptyBody="Add at least one service; the services page and homepage cards need the list."
        >
          {services.fields.map((field, index) => {
            const base = `services.${index}` as const;
            const title = watch(`${base}.name`) || `Service ${index + 1}`;
            const highlightsPath = `${base}.highlights` as const;
            const highlights = watch(highlightsPath) ?? [];
            const commitHighlights = (next: string[]) =>
              setValue(highlightsPath, next, { shouldDirty: true, shouldValidate: true });
            return (
              <ItemCard
                key={field.id}
                index={index}
                title={String(title)}
                idText={field.id}
                disableUp={index === 0}
                disableDown={index === services.fields.length - 1}
                onMoveUp={() => services.move(index, index - 1)}
                onMoveDown={() => services.move(index, index + 1)}
                onDuplicate={() => {
                  const current = getValues("services");
                  services.insert(index + 1, {
                    ...current[index],
                    id: slugId(current[index].name || "service", "service"),
                  });
                }}
                onRemove={() => confirmRemove(String(title), () => services.remove(index))}
              >
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
                    id={`${base}-badge`}
                    label="Badge"
                    hint="Optional, for example Most booked."
                    error={errorAt(errors, `${base}.badge`)}
                  >
                    <TextInput
                      id={`${base}-badge`}
                      type="text"
                      error={errorAt(errors, `${base}.badge`)}
                      {...register(`${base}.badge`)}
                    />
                  </AdField>
                </div>
                <div className="ad-grid-2">
                  <AdField id={`${base}-icon`} label="Icon" error={errorAt(errors, `${base}.icon`)}>
                    <AdSelect
                      id={`${base}-icon`}
                      error={errorAt(errors, `${base}.icon`)}
                      {...optionalSelect(register, base + ".icon")}
                    >
                      {SERVICE_ICON_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </AdSelect>
                  </AdField>
                  <AdField
                    id={`${base}-tagline`}
                    label="Tagline"
                    hint="Optional short line under the name."
                    error={errorAt(errors, `${base}.tagline`)}
                  >
                    <TextInput
                      id={`${base}-tagline`}
                      type="text"
                      error={errorAt(errors, `${base}.tagline`)}
                      {...register(`${base}.tagline`)}
                    />
                  </AdField>
                </div>
                <AdField
                  id={`${base}-summary`}
                  label="Summary"
                  required
                  error={errorAt(errors, `${base}.summary`)}
                >
                  <TextArea
                    id={`${base}-summary`}
                    rows={4}
                    error={errorAt(errors, `${base}.summary`)}
                    {...register(`${base}.summary`)}
                  />
                </AdField>
                <StringList
                  label="Highlight"
                  addLabel="Add highlight"
                  emptyText="Highlights appear as a tick list on the service."
                  items={highlights}
                  itemError={(itemIndex) => errorAt(errors, `${highlightsPath}.${itemIndex}`)}
                  onChange={(itemIndex, value) => {
                    const next = [...highlights];
                    next[itemIndex] = value;
                    commitHighlights(next);
                  }}
                  onAdd={() => commitHighlights([...highlights, ""])}
                  onRemove={(itemIndex) => {
                    if (window.confirm(`Remove highlight ${itemIndex + 1}?`)) {
                      commitHighlights(highlights.filter((_, i) => i !== itemIndex));
                    }
                  }}
                  onMove={(itemIndex, direction) => {
                    const next = [...highlights];
                    const target = itemIndex + direction;
                    if (target < 0 || target >= next.length) return;
                    const [moved] = next.splice(itemIndex, 1);
                    next.splice(target, 0, moved);
                    commitHighlights(next);
                  }}
                />
              </ItemCard>
            );
          })}
        </ArraySection>
      </Panel>

      <Panel title="Call to action" lede="Closing enquiry band on the services page.">
        <CtaBandGroup prefix="ctaBand" register={register} errors={errors} watch={watch} />
      </Panel>

      <Panel
        title="SEO"
        lede="Search result title, description and social share image for the services page."
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
