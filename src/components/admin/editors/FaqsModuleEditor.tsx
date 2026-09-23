// FAQs module editor: create, edit, remove and highlight questions.
// The FAQ page and the homepage teaser render this list.

import { faqsModuleSchema } from "../../../lib/cms/schemas";
import { createId, slugId } from "../../../lib/cms/repository";
import SaveBar from "../SaveBar";
import { AdField, ArraySection, ItemCard, Notice, Skeleton, TextArea, TextInput } from "../fields";
import { Panel } from "../groups";
import { useModuleEditor } from "../useModuleEditor";
import type { FaqItem } from "../../../lib/cms/types";

function faqError(errors: Map<string, string>, index: number, field: string): string | undefined {
  return errors.get(`${index}.${field}`);
}

export default function FaqsModuleEditor() {
  const editor = useModuleEditor<FaqItem>("mod-faqs", faqsModuleSchema);

  if (!editor.loaded) return <Skeleton />;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        editor.save();
      }}
      noValidate
      aria-label="FAQs module editor"
    >
      {editor.notice ? (
        <Notice tone={editor.notice.tone} title={editor.notice.title} list={editor.notice.list}>
          {editor.notice.body ? <p>{editor.notice.body}</p> : null}
        </Notice>
      ) : null}

      <Panel
        title="Questions and answers"
        lede="The homepage shows the first four highlighted questions; the FAQ page shows all of them."
      >
        <ArraySection
          title="FAQ list"
          count={editor.items.length}
          addLabel="Add question"
          onAdd={() =>
            editor.setItems([
              ...editor.items,
              { id: createId("faq"), question: "", answer: "", highlight: true },
            ])
          }
          emptyTitle="No questions"
          emptyBody="A fallback message shows while the list is empty."
        >
          {editor.items.map((item, index) => {
            const question = item.question || `Question ${index + 1}`;
            return (
              <ItemCard
                key={item.id}
                index={index}
                title={question.slice(0, 70)}
                idText={item.id}
                disableUp={index === 0}
                disableDown={index === editor.items.length - 1}
                onMoveUp={() => editor.moveItem(index, -1)}
                onMoveDown={() => editor.moveItem(index, 1)}
                onDuplicate={() =>
                  editor.duplicateItem(index, (source) => ({
                    ...source,
                    id: slugId(source.question || "faq", "faq"),
                  }))
                }
                onRemove={() => {
                  if (window.confirm(`Remove "${question.slice(0, 70)}"?`))
                    editor.removeItem(index);
                }}
              >
                <AdField
                  id={`f-${index}-question`}
                  label="Question"
                  required
                  error={faqError(editor.errors, index, "question")}
                >
                  <TextInput
                    id={`f-${index}-question`}
                    type="text"
                    value={item.question}
                    error={faqError(editor.errors, index, "question")}
                    onChange={(event) => editor.updateItem(index, { question: event.target.value })}
                  />
                </AdField>
                <AdField
                  id={`f-${index}-answer`}
                  label="Answer"
                  required
                  error={faqError(editor.errors, index, "answer")}
                >
                  <TextArea
                    id={`f-${index}-answer`}
                    rows={5}
                    value={item.answer}
                    error={faqError(editor.errors, index, "answer")}
                    onChange={(event) => editor.updateItem(index, { answer: event.target.value })}
                  />
                </AdField>
                <AdField
                  id={`f-${index}-highlight`}
                  label="Highlighted for homepage"
                  required
                  hint="Turned-on questions are eligible for the homepage teaser (first four)."
                  error={faqError(editor.errors, index, "highlight")}
                >
                  <label className="ad-toggle">
                    <input
                      id={`f-${index}-highlight`}
                      type="checkbox"
                      checked={item.highlight}
                      onChange={(event) =>
                        editor.updateItem(index, { highlight: event.target.checked })
                      }
                    />
                    <span>{item.highlight ? "Eligible for homepage" : "Not on homepage"}</span>
                  </label>
                </AdField>
              </ItemCard>
            );
          })}
        </ArraySection>
      </Panel>

      <SaveBar
        dirty={editor.dirty}
        saving={editor.saving}
        savedAt={editor.savedAt}
        onSave={() => editor.save()}
        onDiscard={editor.discard}
        onResetSection={editor.reset}
      />
    </form>
  );
}
