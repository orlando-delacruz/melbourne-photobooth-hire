// Live contact form-card copy (DEC-033).
//
// The form title, lede and privacy footnote from the contact blob. Two
// tiny mounts sharing one page_contents(contact) subscription flank the
// InquiryForm island.
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
    <div>
      <h2 id="contact-form-heading">{contactPage.formTitle}</h2>
      <p>{contactPage.formLede}</p>
    </div>
  );
}

export function LiveContactCopyFoot({ initialPage }: { initialPage: ContactContent }) {
  const contactPage = useLiveContact(initialPage);
  return <p className="form-foot">{contactPage.formFoot}</p>;
}
