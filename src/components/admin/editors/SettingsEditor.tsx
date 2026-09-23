// Site settings editor: brand, service area, review and Messenger links,
// social profiles and the footer call-to-action. Empty link fields mean the
// matching public element stays hidden.

import { useFieldArray } from "react-hook-form";
import { settingsSchema } from "../../../lib/cms/schemas";
import SaveBar from "../SaveBar";
import { AdField, ArraySection, ItemCard, Notice, Skeleton, TextArea, TextInput } from "../fields";
import { Panel, errMsg, errorAt } from "../groups";
import { useSectionEditor } from "../useSectionEditor";

export default function SettingsEditor() {
  const { form, loaded, saving, notice, savedAt, onSave, onInvalid, onDiscard, onResetSection } =
    useSectionEditor("settings", settingsSchema);
  const {
    register,
    control,
    watch,
    getValues,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  const socials = useFieldArray({ control, name: "socials" });

  if (!loaded) return <Skeleton />;

  const confirmRemove = (label: string, remove: () => void) => {
    if (window.confirm(`Remove "${label}"?`)) remove();
  };

  return (
    <form onSubmit={handleSubmit(onSave, onInvalid)} noValidate aria-label="Site settings editor">
      {notice ? (
        <Notice tone={notice.tone} title={notice.title} list={notice.list}>
          {notice.body ? <p>{notice.body}</p> : null}
        </Notice>
      ) : null}

      <Panel title="Brand and service area" lede="Name and service area shown across the website.">
        <AdField id="settings-brand" label="Brand name" required error={errMsg(errors.brandName)}>
          <TextInput
            id="settings-brand"
            type="text"
            error={errMsg(errors.brandName)}
            {...register("brandName")}
          />
        </AdField>
        <AdField
          id="settings-area"
          label="Service area statement"
          required
          error={errMsg(errors.serviceAreaStatement)}
        >
          <TextArea
            id="settings-area"
            rows={2}
            error={errMsg(errors.serviceAreaStatement)}
            {...register("serviceAreaStatement")}
          />
        </AdField>
      </Panel>

      <Panel
        title="Review and Messenger links"
        lede="Blank links keep the matching public element hidden."
      >
        <AdField
          id="settings-review"
          label="Google review URL"
          hint="Full URL from the Google Business Profile. Blank hides the footer review link."
          error={errMsg(errors.reviewUrl)}
        >
          <TextInput
            id="settings-review"
            type="url"
            inputMode="url"
            error={errMsg(errors.reviewUrl)}
            {...register("reviewUrl")}
          />
        </AdField>
        <AdField
          id="settings-messenger"
          label="Messenger URL"
          hint="Chat destination for the floating chat button."
          error={errMsg(errors.messengerUrl)}
        >
          <TextInput
            id="settings-messenger"
            type="url"
            inputMode="url"
            error={errMsg(errors.messengerUrl)}
            {...register("messengerUrl")}
          />
        </AdField>
      </Panel>

      <Panel title="Social profiles" lede="Add social profiles to show them on the website.">
        <ArraySection
          title="Social link list"
          count={socials.fields.length}
          addLabel="Add social link"
          onAdd={() => socials.append({ label: "", url: "" })}
          emptyTitle="No social links"
          emptyBody="Add a link to display it on the website."
        >
          {socials.fields.map((field, index) => {
            const base = `socials.${index}` as const;
            const label = watch(`${base}.label`) || `Social link ${index + 1}`;
            return (
              <ItemCard
                key={field.id}
                index={index}
                title={String(label)}
                disableUp={index === 0}
                disableDown={index === socials.fields.length - 1}
                onMoveUp={() => socials.move(index, index - 1)}
                onMoveDown={() => socials.move(index, index + 1)}
                onDuplicate={() => {
                  const current = getValues("socials");
                  socials.insert(index + 1, { ...current[index] });
                }}
                onRemove={() => confirmRemove(String(label), () => socials.remove(index))}
              >
                <div className="ad-grid-2">
                  <AdField
                    id={`${base}-label`}
                    label="Label"
                    required
                    hint="For example Instagram."
                    error={errorAt(errors, `${base}.label`)}
                  >
                    <TextInput
                      id={`${base}-label`}
                      type="text"
                      error={errorAt(errors, `${base}.label`)}
                      {...register(`${base}.label`)}
                    />
                  </AdField>
                  <AdField
                    id={`${base}-url`}
                    label="URL"
                    required
                    error={errorAt(errors, `${base}.url`)}
                  >
                    <TextInput
                      id={`${base}-url`}
                      type="url"
                      inputMode="url"
                      error={errorAt(errors, `${base}.url`)}
                      {...register(`${base}.url`)}
                    />
                  </AdField>
                </div>
              </ItemCard>
            );
          })}
        </ArraySection>
      </Panel>

      <Panel title="Footer call to action" lede="Enquiry block at the bottom of every page.">
        <AdField
          id="footer-title"
          label="Heading"
          required
          error={errorAt(errors, "footerCta.title")}
        >
          <TextInput
            id="footer-title"
            type="text"
            error={errorAt(errors, "footerCta.title")}
            {...register("footerCta.title")}
          />
        </AdField>
        <AdField
          id="footer-lede"
          label="Supporting text"
          required
          error={errorAt(errors, "footerCta.lede")}
        >
          <TextArea
            id="footer-lede"
            rows={2}
            error={errorAt(errors, "footerCta.lede")}
            {...register("footerCta.lede")}
          />
        </AdField>
        <AdField
          id="footer-label"
          label="Button label"
          required
          error={errorAt(errors, "footerCta.label")}
        >
          <TextInput
            id="footer-label"
            type="text"
            error={errorAt(errors, "footerCta.label")}
            {...register("footerCta.label")}
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
