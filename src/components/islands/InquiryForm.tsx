import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { Resolver, SubmitHandler } from "react-hook-form";
import { AlertCircle, CheckCircle2, Send, Sparkles } from "lucide-react";
import type { InquiryInput } from "../../lib/validation/inquiry";
import type { PackageItem, ServiceItem } from "../../lib/cms/types";
import { fetchEventTypes, fetchPackages, fetchServices } from "../../lib/realtime/fetchers";
import { ensureTurnstile } from "../../lib/turnstile";
import { useLiveRows } from "./useLiveSync";

/**
 * Lazily validates against the shared inquiry schema: zod + the resolver are
 * dynamically imported on the first validation attempt, keeping them out of
 * the initial page bundle.
 */
const lazyResolver: Resolver<InquiryInput> = async (values, context, options) => {
  const { inquirySchema, zodResolver } = await import("../../lib/validation/inquiry");
  return zodResolver(inquirySchema)(values, context, options);
};

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
  services,
  packages,
  initialService,
  initialPackage,
}: {
  eventTypes: string[];
  turnstileSiteKey?: string;
  services: ServiceItem[];
  packages: PackageItem[];
  /** Service/package preselected from a contextual enquiry link (DEC-036). */
  initialService?: string;
  initialPackage?: string;
}) {
  const [phase, setPhase] = useState<Phase>("editing");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  // True when the Turnstile widget reports its own error (for example a
  // misconfigured site key or disallowed hostname, console "Error: 600010").
  // Surfaced inline so a dead widget never looks like "did not complete".
  const [turnstileFailed, setTurnstileFailed] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  // Dropdown options come from the Event Types module (DEC-023) and stay
  // live: admin edits patch the open form's options without a refresh. The
  // visitor's current selection is preserved by value while it still exists.
  const liveEventTypes = useLiveRows(
    "event_types",
    eventTypes.map((label) => ({ id: label, label })),
    fetchEventTypes,
  );
  const options = liveEventTypes.map((type) => type.label);
  // Service and Package options come from the live Services/Packages modules
  // (DEC-036); the live refetch keeps the dropdowns in step with admin edits.
  const liveServices = useLiveRows("services", services, fetchServices);
  const livePackages = useLiveRows("packages", packages, fetchPackages);
  const serviceOptions = liveServices
    .filter((service) => service.highlight !== false)
    .map((service) => service.name);
  const packageOptions = livePackages
    .filter((pkg) => pkg.highlight !== false)
    .map((pkg) => pkg.name);
  const noticeRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitted },
  } = useForm<InquiryInput>({
    resolver: lazyResolver,
    reValidateMode: "onChange",
    // Preselect from a contextual enquiry link; RHF keeps these values across
    // interaction and validation, and they are never reset unexpectedly.
    defaultValues: {
      service: initialService ?? "",
      package: initialPackage ?? "",
    },
  });

  useEffect(() => {
    if (phase === "received") {
      noticeRef.current?.focus();
    }
  }, [phase]);

  // Turnstile widget (no extra dependency): the script is fetched on demand
  // and the widget renders only when a site key is provided; the token travels
  // with the submission for server verification.
  useEffect(() => {
    if (!turnstileSiteKey || !turnstileRef.current) return;
    let cancelled = false;
    void ensureTurnstile()
      .then(() => {
        const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
        if (cancelled || !api || !turnstileRef.current) return;
        try {
          widgetId.current = api.render(turnstileRef.current, {
            sitekey: turnstileSiteKey,
            // Fit the form's inner width on small screens instead of the
            // fixed 300px default that overflows a 320px phone.
            size: "flexible",
            callback: (token: string) => {
              if (!cancelled) {
                setTurnstileToken(token);
                setTurnstileFailed(false);
              }
            },
            "expired-callback": () => {
              if (!cancelled) setTurnstileToken(null);
            },
            "error-callback": () => {
              if (!cancelled) {
                setTurnstileToken(null);
                setTurnstileFailed(true);
              }
            },
          });
        } catch {
          // Widget unavailable: the submission goes without a token.
        }
      })
      .catch(() => {
        // Script unavailable: the submission goes without a token.
      });
    return () => {
      cancelled = true;
    };
  }, [turnstileSiteKey]);

  interface TurnstileApi {
    render(
      container: HTMLElement,
      options: {
        sitekey: string;
        size?: "normal" | "compact" | "flexible";
        callback?: (token: string) => void;
        "expired-callback"?: () => void;
        "error-callback"?: () => void;
      },
    ): string;
    reset(widgetId?: string): void;
  }

  // Fresh token per attempt: a consumed or expired token must never be reused.
  const resetTurnstile = () => {
    try {
      const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (api && widgetId.current) api.reset(widgetId.current);
    } catch {
      // Widget unavailable: nothing to reset.
    }
    setTurnstileToken(null);
  };

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
        resetTurnstile();
        setPhase("received");
        return;
      }
      const message =
        payload && typeof payload.message === "string" && payload.message
          ? payload.message
          : "Your enquiry could not be sent. Please try again.";
      setSubmitError(message);
      resetTurnstile();
      setPhase("editing");
    } catch {
      setSubmitError("Your enquiry could not be sent. Check your connection and try again.");
      resetTurnstile();
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
        <p className="iq-notice__body">Thanks, your enquiry is with us.</p>
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
      aria-busy={sending || undefined}
    >
      <p className="iq-form__note" id="inquiry-required-note">
        Fields marked{" "}
        <span className="iq-req" aria-hidden="true">
          *
        </span>{" "}
        are required.
      </p>

      {initialService || initialPackage ? (
        <p className="iq-context">
          <Sparkles size={16} aria-hidden="true" />
          <span>
            Enquiring about{" "}
            <strong>{[initialService, initialPackage].filter(Boolean).join(" + ")}</strong>
          </span>
        </p>
      ) : null}

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

          <div className="iq-field iq-field--wide">
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
            <label className="iq-label" htmlFor="inquiry-service">
              Service <span className="iq-optional">(optional)</span>
            </label>
            <div className="iq-select-wrap">
              <select
                className="iq-control iq-select"
                id="inquiry-service"
                defaultValue={initialService ?? ""}
                {...register("service")}
              >
                <option value="">Select…</option>
                {serviceOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="iq-field">
            <label className="iq-label" htmlFor="inquiry-package">
              Package <span className="iq-optional">(optional)</span>
            </label>
            <div className="iq-select-wrap">
              <select
                className="iq-control iq-select"
                id="inquiry-package"
                defaultValue={initialPackage ?? ""}
                {...register("package")}
              >
                <option value="">Select…</option>
                {packageOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
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
        <div className="iq-field iq-turnstile">
          <div ref={turnstileRef} />
          {turnstileFailed ? (
            <p className="iq-error" role="alert">
              <AlertCircle size={16} aria-hidden="true" />
              <span>
                Spam protection could not load. Refresh the page and try again — if it keeps
                failing, contact us directly instead.
              </span>
            </p>
          ) : null}
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
