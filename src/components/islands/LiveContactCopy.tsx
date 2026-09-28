// Live contact form-card heading (DEC-033).
//
// The form title and lede from the contact blob, patched live through the
// page_contents(contact) subscription.
import type { ContactContent } from "../../lib/cms/types";
import { fetchPageContent } from "../../lib/realtime/fetchers";
import { useLiveDoc } from "./useLiveSync";

function useLiveContact(initialPage: ContactContent): ContactContent {
  return useLiveDoc("page_contents", "contact", initialPage, async () => {
    const content = (await fetchPageContent("contact")) as ContactContent | null;
    return content ?? initialPage;
  });
}

export function LiveContactCopyHead({ initialPage }: { initialPage: ContactContent }) {
  const contactPage = useLiveContact(initialPage);
  return (
    <>
      <h2 id="contact-form-heading">{contactPage.formTitle}</h2>
      <p>{contactPage.formLede}</p>
    </>
  );
}
