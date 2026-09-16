import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { EVENT_TYPES, PHOTOBOOTHS, inquirySchema, zodResolver } from "../../lib/validation/inquiry";
import type { InquiryInput } from "../../lib/validation/inquiry";

/**
 * Inquiry form island: Phase 2 client-side validation layer only.
 * Valid data currently resolves to an informational state; server-side
 * validation, Turnstile verification, and EmailJS delivery land in Phase 4.
 *
 * Styling lives in styles/inquiry-form.css (token-backed, server-rendered)
 * rather than styled-components, so the form is styled before hydration.
 */

type Phase = "editing" | "ready";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="iq-error" id={id}>
      <AlertCircle size={16} aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}

export default function InquiryForm() {
  const [phase, setPhase] = useState<Phase>("editing");
  const noticeRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitted },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (phase === "ready") {
      noticeRef.current?.focus();
    }
  }, [phase]);

  const onValid: SubmitHandler<InquiryInput> = () => {
    setPhase("ready");
  };

  const onInvalid = (fieldErrors: Record<string, unknown>) => {
    const first = Object.keys(fieldErrors)[0];
    if (first) {
      setFocus(first as keyof InquiryInput);
    }
  };

  const errorCount = Object.keys(errors).length;

  if (phase === "ready") {
    return (
      <div className="iq-notice" ref={noticeRef} tabIndex={-1} role="status">
        <h2 className="iq-notice__title">
          <CheckCircle2 size={22} aria-hidden="true" />
          Enquiry checked
        </h2>
        <p className="iq-notice__body">
          Your details pass validation. Online submission is being connected. Please check back soon
          to send your enquiry.
        </p>
        <button type="button" className="iq-submit" onClick={() => setPhase("editing")}>
          Back to the form
        </button>
      </div>
    );
  }

  return (
    <form
      className="iq-form"
      noValidate
      onSubmit={handleSubmit(onValid, onInvalid)}
      aria-describedby="inquiry-required-note"
    >
      <p className="iq-form__note" id="inquiry-required-note">
        Fields marked{" "}
        <span className="iq-req" aria-hidden="true">
          *
        </span>{" "}
        are required.
      </p>

      {isSubmitted && errorCount > 0 ? (
        <div className="iq-summary" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          <p>
            {errorCount === 1
              ? "There is 1 field to correct."
              : `There are ${errorCount} fields to correct.`}
          </p>
        </div>
      ) : null}

      <fieldset className="iq-group">
        <legend className="iq-group__legend">Your details</legend>
        <div className="iq-grid">
          <div className="iq-field">
            <label className="iq-label" htmlFor="inquiry-name">
              Name{" "}
              <span className="iq-req" aria-hidden="true">
                *
              </span>
            </label>
            <input
              className="iq-control"
              id="inquiry-name"
              type="text"
              autoComplete="name"
              aria-required="true"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "inquiry-name-error" : undefined}
              {...register("name")}
            />
            <FieldError id="inquiry-name-error" message={errors.name?.message} />
          </div>

          <div className="iq-field">
            <label className="iq-label" htmlFor="inquiry-email">
              Email{" "}
              <span className="iq-req" aria-hidden="true">
                *
              </span>
            </label>
            <input
              className="iq-control"
              id="inquiry-email"
              type="email"
              autoComplete="email"
              aria-required="true"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "inquiry-email-error" : undefined}
              {...register("email")}
            />
            <FieldError id="inquiry-email-error" message={errors.email?.message} />
          </div>

          <div className="iq-field">
            <label className="iq-label" htmlFor="inquiry-mobile">
              Mobile <span className="iq-optional">(optional)</span>
            </label>
            <input
              className="iq-control"
              id="inquiry-mobile"
              type="tel"
              autoComplete="tel"
              aria-describedby="inquiry-mobile-hint"
              {...register("mobile")}
            />
            <p className="iq-hint" id="inquiry-mobile-hint">
              For a faster reply.
            </p>
          </div>
        </div>
      </fieldset>

      <fieldset className="iq-group">
        <legend className="iq-group__legend">About your event</legend>
        <div className="iq-grid">
          <div className="iq-field">
            <label className="iq-label" htmlFor="inquiry-event-date">
              Event date{" "}
              <span className="iq-req" aria-hidden="true">
                *
              </span>
            </label>
            <input
              className="iq-control"
              id="inquiry-event-date"
              type="date"
              aria-required="true"
              aria-invalid={errors.eventDate ? true : undefined}
              aria-describedby={errors.eventDate ? "inquiry-event-date-error" : undefined}
              {...register("eventDate")}
            />
            <FieldError id="inquiry-event-date-error" message={errors.eventDate?.message} />
          </div>

          <div className="iq-field">
            <label className="iq-label" htmlFor="inquiry-event-type">
              Event type <span className="iq-optional">(optional)</span>
            </label>
            <div className="iq-select-wrap">
              <select
                className="iq-control iq-select"
                id="inquiry-event-type"
                defaultValue=""
                {...register("eventType")}
              >
                <option value="">Select…</option>
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="iq-field">
            <label className="iq-label" htmlFor="inquiry-venue">
              Event location / venue <span className="iq-optional">(optional)</span>
            </label>
            <input
              className="iq-control"
              id="inquiry-venue"
              type="text"
              autoComplete="address-level2"
              {...register("venue")}
            />
          </div>

          <div className="iq-field">
            <label className="iq-label" htmlFor="inquiry-guests">
              Estimated guests <span className="iq-optional">(optional)</span>
            </label>
            <input
              className="iq-control"
              id="inquiry-guests"
              type="text"
              inputMode="numeric"
              aria-describedby="inquiry-guests-hint"
              {...register("guests")}
            />
            <p className="iq-hint" id="inquiry-guests-hint">
              An approximate number is fine.
            </p>
          </div>

          <div className="iq-field">
            <label className="iq-label" htmlFor="inquiry-photobooth">
              Preferred photobooth <span className="iq-optional">(optional)</span>
            </label>
            <div className="iq-select-wrap">
              <select
                className="iq-control iq-select"
                id="inquiry-photobooth"
                defaultValue=""
                {...register("photobooth")}
              >
                <option value="">Select…</option>
                {PHOTOBOOTHS.map((booth) => (
                  <option key={booth} value={booth}>
                    {booth}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="iq-field iq-field--wide">
            <label className="iq-label" htmlFor="inquiry-message">
              Additional requirements <span className="iq-optional">(optional)</span>
            </label>
            <textarea
              className="iq-control iq-textarea"
              id="inquiry-message"
              {...register("message")}
            />
          </div>
        </div>
      </fieldset>

      <div className="iq-actions">
        <button type="submit" className="iq-submit">
          <Send size={18} aria-hidden="true" />
          Check enquiry
        </button>
      </div>
    </form>
  );
}
