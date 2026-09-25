import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { PHOTOBOOTHS, inquirySchema, zodResolver } from "../../lib/validation/inquiry";
import type { InquiryInput } from "../../lib/validation/inquiry";

/**
 * Inquiry form island: client validation, then POST /api/inquiries which
 * re-validates server-side, verifies Turnstile when configured and stores
 * the record. Styling lives in styles/inquiry-form.css (token-backed,
 * server-rendered) rather than styled-components.
 */

type Phase = "editing" | "sending" | "received";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="iq-error" id={id}>
      <AlertCircle size={16} aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}

export default function InquiryForm({
  eventTypes,
  turnstileSiteKey,
}: {
  eventTypes: string[];
  turnstileSiteKey?: string;
}) {
  const [phase, setPhase] = useState<Phase>("editing");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  // Dropdown options come from the build-time Event Types module data
  // (loadPublicEventTypes); the module is the single source of truth.
  const options = eventTypes;
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
    if (phase === "received") {
      noticeRef.current?.focus();
    }
  }, [phase]);

  // Turnstile widget (no extra dependency): renders only when a site key is
  // provided; the token travels with the submission for server verification.
  useEffect(() => {
    if (!turnstileSiteKey || !turnstileRef.current) return;
    let cancelled = false;
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (api && turnstileRef.current && !cancelled) {
        window.clearInterval(timer);
        try {
          widgetId.current = api.render(turnstileRef.current, {
            sitekey: turnstileSiteKey,
            callback: (token: string) => {
              if (!cancelled) setTurnstileToken(token);
            },
            "expired-callback": () => {
              if (!cancelled) setTurnstileToken(null);
            },
          });
        } catch {
          // Widget unavailable: the submission goes without a token.
        }
      } else if (attempts >= 20 || cancelled) {
        window.clearInterval(timer);
      }
    }, 500);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [turnstileSiteKey]);

  interface TurnstileApi {
    render(
      container: HTMLElement,
      options: {
        sitekey: string;
        callback?: (token: string) => void;
        "expired-callback"?: () => void;
      },
    ): string;
    reset(widgetId?: string): void;
  }

  const onValid: SubmitHandler<InquiryInput> = async (values) => {
    setSubmitError(null);
    setPhase("sending");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, turnstileToken: turnstileToken ?? undefined }),
      });
      const payload = (await response.json().catch(() => null)) as {
        ok?: unknown;
        message?: unknown;
      } | null;
      if (response.ok && payload?.ok === true) {
        setPhase("received");
        return;
      }
      const message =
        payload && typeof payload.message === "string" && payload.message
          ? payload.message
          : "Your enquiry could not be sent. Please try again.";
      setSubmitError(message);
      setPhase("editing");
    } catch {
      setSubmitError("Your enquiry could not be sent. Check your connection and try again.");
      setPhase("editing");
    }
  };

  const onInvalid = (fieldErrors: Record<string, unknown>) => {
    const first = Object.keys(fieldErrors)[0];
    if (first) {
      setFocus(first as keyof InquiryInput);
    }
  };

  const errorCount = Object.keys(errors).length;

  if (phase === "received") {
    return (
      <div className="iq-notice" ref={noticeRef} tabIndex={-1} role="status">
        <h2 className="iq-notice__title">
          <CheckCircle2 size={22} aria-hidden="true" />
          Enquiry received
        </h2>
        <p className="iq-notice__body">
          Thanks, your enquiry is with us. We typically reply within one business day.
        </p>
        <button type="button" className="iq-submit" onClick={() => setPhase("editing")}>
          Back to the form
        </button>
      </div>
    );
  }

  const sending = phase === "sending";

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

      {submitError ? (
        <div className="iq-summary" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          <p>{submitError}</p>
        </div>
      ) : null}

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
                {options.map((type) => (
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

      {turnstileSiteKey ? (
        <div className="iq-field">
          <div ref={turnstileRef} />
        </div>
      ) : null}

      <div className="iq-actions">
        <button type="submit" className="iq-submit" disabled={sending}>
          <Send size={18} aria-hidden="true" />
          {sending ? "Sending…" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}
