// Live legal page body (DEC-033).
//
// Mirrors privacy/terms.astro: header plus intro paragraphs and heading +
// paragraph/list blocks from the legal blob. Prose uses the global
// .section/.prose classes, so no style copy is needed.
import { Fragment } from "react";
import type { LegalPageContent, LegalPageKey } from "../../lib/cms/types";
import { fetchPageContent } from "../../lib/realtime/fetchers";
import LivePageHeader from "./LivePageHeader";
import { useLiveDoc } from "./useLiveSync";

export interface LiveLegalPageProps {
  pageKey: LegalPageKey;
  initial: LegalPageContent;
}

export default function LiveLegalPage({ pageKey, initial }: LiveLegalPageProps) {
  const page = useLiveDoc("page_contents", pageKey, initial, async () => {
    const content = (await fetchPageContent(pageKey)) as LegalPageContent | null;
    return content ?? initial;
  });

  return (
    <>
      <LivePageHeader pageKey={pageKey} initial={page.header} />
      <div className="section">
        <div className="prose">
          {page.intro.map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
          ))}

          {page.sections.map((section) => (
            <Fragment key={section.heading}>
              <h2>{section.heading}</h2>
              {section.blocks.map((block, index) =>
                block.kind === "paragraph" ? (
                  <p key={`${index}-${block.text.slice(0, 24)}`}>{block.text}</p>
                ) : (
                  <ul key={index}>
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ),
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
