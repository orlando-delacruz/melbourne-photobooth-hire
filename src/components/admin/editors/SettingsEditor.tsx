// Site settings editor: brand, service area, review and Messenger links,
// social profiles and the footer call-to-action. Empty link fields mean the
// matching public element stays hidden.

import { useFieldArray } from "react-hook-form";
import { settingsSchema } from "../../../lib/cms/schemas";
import SaveBar from "../SaveBar";
import {
  AdField,
  ArraySection,
  ImageField,
  ItemCard,
  Notice,
  Skeleton,
  TextArea,
  TextInput,
} from "../fields";
import { Panel, errMsg, errorAt } from "../groups";
import { useSectionEditor } from "../useSectionEditor";
import { confirmDestructive } from "../alerts";
import type { CmsImage } from "../../../lib/cms/types";

const EMPTY_IMAGE: CmsImage = { key: null, src: "", alt: "" };

export default function SettingsEditor() {
  const { form, loaded, saving, notice, savedAt, onSave, onInvalid, onDiscard, onResetSection } =
    useSectionEditor("settings", settingsSchema);
  const {
    register,
    control,
    watch,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  const socials = useFieldArray({ control, name: "socials" });
  const trustItems = useFieldArray({ control, name: "trustItems" });
  const logo = (watch("logo") as CmsImage | undefined) ?? EMPTY_IMAGE;
  const favicon = (watch("favicon") as CmsImage | undefined) ?? EMPTY_IMAGE;

  if (!loaded) return <Skeleton />;

  const confirmRemove = (label: string, remove: () => void) => {
    void confirmDestructive({ title: `Remove "${label}"?`, confirmText: "Remove" }).then(
      (confirmed) => {
        if (confirmed) remove();
      },
    );
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
        title="Logo and favicon"
        lede="Shown in the site header and footer, and as the browser tab icon. Leave blank to keep the built-in mark and default icon."
      >
        <ImageField
          legend="Website logo."
          hint="A transparent PNG or WebP works best."
          value={logo}
          onChange={(next) => setValue("logo", next, { shouldDirty: true })}
          error={errorAt(errors, "logo")}
          altError={errorAt(errors, "logo.alt")}
        />
        <ImageField
          legend="Favicon."
          hint="A square PNG works best."
          value={favicon}
          onChange={(next) => setValue("favicon", next, { shouldDirty: true })}
          error={errorAt(errors, "favicon")}
          showAlt={false}
        />
      </Panel>

      <Panel
        title="Contact and business details"
        lede="Phone numbers, ABN, credentials and the transport note shown in the footer and on the contact page. Blank fields stay hidden."
      >
        <div className="ad-grid-2">
          <AdField
            id="settings-phone-primary"
            label="Primary phone"
            error={errMsg(errors.phonePrimary)}
          >
            <TextInput
              id="settings-phone-primary"
              type="tel"
              inputMode="tel"
              error={errMsg(errors.phonePrimary)}
              {...register("phonePrimary")}
            />
          </AdField>
          <AdField
            id="settings-phone-secondary"
            label="Secondary phone"
            error={errMsg(errors.phoneSecondary)}
          >
            <TextInput
              id="settings-phone-secondary"
              type="tel"
              inputMode="tel"
              error={errMsg(errors.phoneSecondary)}
              {...register("phoneSecondary")}
            />
          </AdField>
        </div>
        <AdField id="settings-abn" label="ABN" error={errMsg(errors.abn)}>
          <TextInput id="settings-abn" type="text" error={errMsg(errors.abn)} {...register("abn")} />
        </AdField>
        <AdField
          id="settings-transport"
          label="Transport note"
          error={errMsg(errors.transportNote)}
        >
          <TextInput
            id="settings-transport"
            type="text"
            error={errMsg(errors.transportNote)}
            {...register("transportNote")}
          />
        </AdField>
        <ArraySection
          title="Business credential list"
          count={trustItems.fields.length}
          addLabel="Add credential"
          onAdd={() => trustItems.append("")}
          emptyTitle="No credentials"
          emptyBody="Add a credential to display it on the website."
        >
          {trustItems.fields.map((field, index) => {
            const base = `trustItems.${index}` as const;
            const label = watch(base) || `Credential ${index + 1}`;
            return (
              <ItemCard
                key={field.id}
                index={index}
                title={String(label)}
                disableUp={index === 0}
                disableDown={index === trustItems.fields.length - 1}
                onMoveUp={() => trustItems.move(index, index - 1)}
                onMoveDown={() => trustItems.move(index, index + 1)}
                onDuplicate={() => {
                  const current = getValues("trustItems") as unknown as string[];
                  trustItems.insert(index + 1, current[index] ?? "");
                }}
                onRemove={() => confirmRemove(String(label), () => trustItems.remove(index))}
              >
                <AdField
                  id={`${base}-value`}
                  label="Credential"
                  required
                  error={errorAt(errors, base)}
                >
                  <TextInput
                    id={`${base}-value`}
                    type="text"
                    error={errorAt(errors, base)}
                    {...register(base)}
                  />
                </AdField>
              </ItemCard>
            );
          })}
        </ArraySection>
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

      <Panel
        title="Social profiles"
        lede="Shown in the website footer and on the contact page. Labels containing Facebook, Instagram, TikTok or YouTube get the matching icon."
      >
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
                    hint="For example Facebook, Instagram, TikTok or YouTube."
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
