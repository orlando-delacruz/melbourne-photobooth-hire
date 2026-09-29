// Customer review modal (DEC-035).
//
// Rendered once on the homepage (client:idle). Opens when any
// [data-review-open] trigger is activated — the trigger lives in the
// testimonials section (LiveMarquee), so the marquee stays presentational
// and this island owns the whole dialog, mirroring the GalleryLightbox
// mechanics: document-level trigger delegation, focus trap, Escape,
// backdrop close, body scroll lock and focus return. Reduced motion is
// respected, and the panel scrolls internally on small viewports.
//
// The form reuses the inquiry-form conventions: RHF + the shared Zod
// resolver, inline field errors, an error summary, Turnstile only when a
// site key is provided, and an inline success state. Submissions POST to
// /api/reviews and always land as pending; moderation happens in the
// Testimonials admin module.
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertCircle, CheckCircle2, Send, Star, X } from "lucide-react";
import { reviewSchema } from "../../lib/validation/review";
import type { ReviewInput } from "../../lib/validation/review";
import { zodResolver } from "../../lib/validation/inquiry";
import { fetchEventTypes } from "../../lib/realtime/fetchers";
import { useLiveRows } from "./useLiveSync";
// Field, button and dialog styling comes from the global stylesheets:
// BaseLayout loads the inquiry-form and review-modal systems (like the
// lightbox and mobile-nav styles), and the live button/section system
// arrives with the homepage islands.

const TRIGGER_SELECTOR = "[data-review-open]";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

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

function ratingText(rating: number | undefined): string {
  if (!rating) return "Select a rating";
  return rating === 1 ? "1 out of 5 stars" : `${rating} out of 5 stars`;
}

export default function ReviewModal({
  eventTypes,
  turnstileSiteKey,
}: {
  eventTypes: string[];
  turnstileSiteKey?: string;
}) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("editing");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileFailed, setTurnstileFailed] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const reduceMotion = useReducedMotion();

  const close = useCallback(() => {
    setOpen(false);
    setHovered(null);
  }, []);

  // Trigger delegation (GalleryLightbox pattern): any [data-review-open]
  // element opens the dialog and receives focus back on close.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      const trigger = (event.target as Element | null)?.closest<HTMLElement>(TRIGGER_SELECTOR);
      if (!trigger) return;
      event.preventDefault();
      returnFocusRef.current = trigger;
      setPhase((current) => (current === "received" ? "editing" : current));
      setSubmitError(null);
      setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Focus in on open, focus return on close, body scroll lock. After a
  // successful submission, focus moves to the confirmation so screen
  // readers announce it (InquiryForm notice pattern).
  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => firstFieldRef.current?.focus(), 20);
      return () => window.clearTimeout(id);
    }
    if (returnFocusRef.current) {
      returnFocusRef.current.focus();
      returnFocusRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (open && phase === "received") {
      successRef.current?.focus();
    }
  }, [open, phase]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape + full focus trap while open.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "Tab") {
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Event-type options come from the Event Types module (DEC-023), like the
  // inquiry form; the list stays live while the modal is open.
  const liveEventTypes = useLiveRows(
    "event_types",
    eventTypes.map((label) => ({ id: label, label })),
    fetchEventTypes,
  );
  const options = liveEventTypes.map((type) => type.label);

  const {
    register,
    handleSubmit,
    setFocus,
    watch,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    reValidateMode: "onChange",
  });
  // The name input carries both the RHF registration and the modal's
  // autofocus target, so the two refs are merged instead of overwritten.
  const { ref: nameRef, ...nameRest } = register("name");
  const selectedRating = watch("rating");
  const displayRating = hovered ?? selectedRating ?? 0;

  // Turnstile widget (InquiryForm pattern): mounts only while the modal is
  // open; a consumed or expired token is never reused.
  useEffect(() => {
    if (!open || !turnstileSiteKey) return;
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
            // The dialog surface is dark; the light widget default would glare.
            theme: "dark",
            // Fit the panel's inner width on small screens instead of the
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
      } else if (attempts >= 20 || cancelled) {
        window.clearInterval(timer);
      }
    }, 500);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      try {
        const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
        if (api?.remove && widgetId.current) api.remove(widgetId.current);
      } catch {
        // Widget unavailable: nothing to remove.
      }
      widgetId.current = null;
    };
  }, [open, turnstileSiteKey]);

  interface TurnstileApi {
    render(
      container: HTMLElement,
      options: {
        sitekey: string;
        theme?: string;
        size?: "normal" | "compact" | "flexible";
        callback?: (token: string) => void;
        "expired-callback"?: () => void;
        "error-callback"?: () => void;
      },
    ): string;
    reset(widgetId?: string): void;
    remove?(widgetId: string): void;
  }

  const resetTurnstile = () => {
    try {
      const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (api && widgetId.current) api.reset(widgetId.current);
    } catch {
      // Widget unavailable: nothing to reset.
    }
    setTurnstileToken(null);
  };

  const onValid: SubmitHandler<ReviewInput> = async (values) => {
    setSubmitError(null);
    setPhase("sending");
    try {
      const response = await fetch("/api/reviews", {
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
        reset();
        setHovered(null);
        setPhase("received");
        return;
      }
      const message =
        payload && typeof payload.message === "string" && payload.message
          ? payload.message
          : "Your review could not be sent. Please try again.";
      setSubmitError(message);
      resetTurnstile();
      setPhase("editing");
    } catch {
      setSubmitError("Your review could not be sent. Check your connection and try again.");
      resetTurnstile();
      setPhase("editing");
    }
  };

  const onInvalid = (fieldErrors: Record<string, unknown>) => {
    const first = Object.keys(fieldErrors)[0];
    if (first) setFocus(first as keyof ReviewInput);
  };

  const errorCount = Object.keys(errors).length;
  const sending = phase === "sending";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="rv"
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <div className="rv-backdrop" aria-hidden="true" onClick={close} />
          <motion.div
            ref={panelRef}
            className="rv-panel"
            role="document"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.965, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.46, ease: EASE }}
          >
            <div className="rv-head">
              <h2 className="rv-title" id="review-modal-title">
                {phase === "received" ? "Review received" : "Share your experience"}
              </h2>
              <button
                type="button"
                className="rv-close"
                aria-label="Close review form"
                onClick={close}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {phase === "received" ? (
              <div className="rv-success" ref={successRef} tabIndex={-1} role="status">
                <span className="rv-success-icon" aria-hidden="true">
                  <CheckCircle2 size={28} />
                </span>
                <h2>Thanks for your review</h2>
                <p>
                  Your review is with us and will appear on the website once approved. We appreciate
                  you sharing your experience.
                </p>
                <button type="button" className="iq-submit" onClick={close}>
                  Done
                </button>
              </div>
            ) : (
              <form
                className="iq-form"
                noValidate
                onSubmit={handleSubmit(onValid, onInvalid)}
                aria-describedby="review-required-note"
              >
                <p className="rv-lede" id="review-required-note">
                  Tell us about your event — your name, event type, a star rating and a few words
                  about the booth. Reviews appear on the website once approved.
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

                <div className="iq-field">
                  <label className="iq-label" htmlFor="review-name">
                    Your name{" "}
                    <span className="iq-req" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    className="iq-control"
                    id="review-name"
                    ref={(element) => {
                      nameRef(element);
                      firstFieldRef.current = element;
                    }}
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    aria-required="true"
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "review-name-error" : undefined}
                    {...nameRest}
                  />
                  <FieldError id="review-name-error" message={errors.name?.message} />
                </div>

                <div className="iq-field">
                  <label className="iq-label" htmlFor="review-event-type">
                    Event type{" "}
                    <span className="iq-req" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <div className="iq-select-wrap">
                    <select
                      className="iq-control iq-select"
                      id="review-event-type"
                      defaultValue=""
                      aria-required="true"
                      aria-invalid={errors.eventType ? true : undefined}
                      aria-describedby={errors.eventType ? "review-event-type-error" : undefined}
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
                  <FieldError id="review-event-type-error" message={errors.eventType?.message} />
                </div>

                <fieldset
                  className="rv-stars"
                  aria-required="true"
                  aria-invalid={errors.rating ? true : undefined}
                  aria-describedby={errors.rating ? "review-rating-error" : "review-rating-text"}
                >
                  <legend className="iq-label">
                    Star rating{" "}
                    <span className="iq-req" aria-hidden="true">
                      *
                    </span>
                  </legend>
                  {[1, 2, 3, 4, 5].map((value) => {
                    const active = value <= displayRating;
                    return (
                      <label
                        key={value}
                        className="rv-star"
                        data-active={active}
                        onMouseEnter={() => setHovered(value)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <input
                          type="radio"
                          value={value}
                          aria-label={`${value} star${value === 1 ? "" : "s"}`}
                          {...register("rating")}
                        />
                        <Star
                          size={44}
                          aria-hidden="true"
                          fill={active ? "currentColor" : "none"}
                        />
                      </label>
                    );
                  })}
                </fieldset>
                <p className="rv-rating-text" id="review-rating-text" aria-live="polite">
                  {ratingText(selectedRating)}
                </p>
                <FieldError id="review-rating-error" message={errors.rating?.message} />

                <div className="iq-field">
                  <label className="iq-label" htmlFor="review-quote">
                    Your review{" "}
                    <span className="iq-req" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <textarea
                    className="iq-control iq-textarea"
                    id="review-quote"
                    rows={5}
                    placeholder="What did you love about the booth?"
                    aria-required="true"
                    aria-invalid={errors.quote ? true : undefined}
                    aria-describedby={errors.quote ? "review-quote-error" : undefined}
                    {...register("quote")}
                  />
                  <FieldError id="review-quote-error" message={errors.quote?.message} />
                </div>

                {turnstileSiteKey ? (
                  <div className="iq-field iq-turnstile">
                    <div ref={turnstileRef} />
                    {turnstileFailed ? (
                      <p className="iq-error" role="alert">
                        <AlertCircle size={16} aria-hidden="true" />
                        <span>
                          Spam protection could not load. Refresh the page and try again — if it
                          keeps failing, contact us directly instead.
                        </span>
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <div className="rv-actions">
                  <button type="submit" className="iq-submit" disabled={sending}>
                    <Send size={18} aria-hidden="true" />
                    {sending ? "Sending…" : "Submit review"}
                  </button>
                  <button
                    type="button"
                    className="button button--secondary button--tone-dark"
                    onClick={close}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
