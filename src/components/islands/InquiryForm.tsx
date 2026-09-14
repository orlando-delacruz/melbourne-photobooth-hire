import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { ThemeProvider, css, styled } from "styled-components";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { theme } from "../../lib/theme";
import { EVENT_TYPES, PHOTOBOOTHS, inquirySchema, zodResolver } from "../../lib/validation/inquiry";
import type { InquiryInput } from "../../lib/validation/inquiry";

/**
 * Inquiry form island — Phase 2 client-side validation layer only.
 * Valid data currently resolves to an informational state; server-side
 * validation, Turnstile verification, and EmailJS delivery land in Phase 4.
 */

type Phase = "editing" | "ready";

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space.sm};
  max-width: 44rem;
`;

const Field = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space.xs3};
`;

const Label = styled.label`
  font-weight: 500;
`;

const Required = styled.span`
  font-weight: 400;
  color: ${({ theme }) => theme.color.accent};
`;

const Hint = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.textSecondary};
  font-size: var(--text-small);
`;

const controlStyles = css`
  padding: ${({ theme }) => theme.space.xs2} ${({ theme }) => theme.space.xs};
  border: 1px solid ${({ theme }) => theme.color.inputBorder};
  border-radius: ${({ theme }) => theme.radius.sm};
  font: inherit;
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.text};
  width: 100%;
  transition: border-color ${({ theme }) => theme.motion.quick} ${({ theme }) => theme.motion.ease};
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.focus};
    outline-offset: 2px;
  }
`;

const Control = styled.input`
  ${controlStyles}
`;

const Select = styled.select`
  ${controlStyles}
`;

const Area = styled.textarea`
  ${controlStyles}
  min-height: 7rem;
`;

const ErrorText = styled.p`
  margin: 0;
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space.xs3};
  color: ${({ theme }) => theme.color.error};
  font-size: var(--text-small);
  line-height: 1.4;
`;

const Summary = styled.div`
  border: 1px solid ${({ theme }) => theme.color.error};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.error};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space.xs2};
  p {
    margin: 0;
  }
`;

const Notice = styled.div`
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space.sm};
  background: ${({ theme }) => theme.color.surface};
  box-shadow: ${({ theme }) => theme.elevation["1"]};
  max-width: 44rem;
`;

const NoticeHeading = styled.h2`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs2};
  margin: 0 0 ${({ theme }) => theme.space.xs2};
  color: ${({ theme }) => theme.color.success};
  font-family: var(--font-body);
  font-size: var(--text-h3);
`;

const Submit = styled.button`
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs2};
  background: ${({ theme }) => theme.color.primary};
  color: ${({ theme }) => theme.color.primaryContrast};
  border: none;
  border-radius: ${({ theme }) => theme.radius.pill};
  padding: 0 ${({ theme }) => theme.space.sm};
  min-height: 44px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform ${({ theme }) => theme.motion.quick} ${({ theme }) => theme.motion.ease},
    box-shadow ${({ theme }) => theme.motion.quick} ${({ theme }) => theme.motion.ease};
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.elevation["1"]};
  }
  &:active {
    transform: translateY(0);
  }
`;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <ErrorText id={id}>
      <AlertCircle size={16} aria-hidden="true" />
      <span>{message}</span>
    </ErrorText>
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

  return (
    <ThemeProvider theme={theme}>
      {phase === "ready" ? (
        <Notice ref={noticeRef} tabIndex={-1} role="status">
          <NoticeHeading>
            <CheckCircle2 size={20} aria-hidden="true" />
            Enquiry checked
          </NoticeHeading>
          <p>
            Your details pass validation. Online submission is being connected — please check back
            soon to send your enquiry.
          </p>
          <Submit type="button" onClick={() => setPhase("editing")}>
            Back to the form
          </Submit>
        </Notice>
      ) : (
        <Form
          noValidate
          onSubmit={handleSubmit(onValid, onInvalid)}
          aria-describedby="inquiry-required-note"
        >
          <p id="inquiry-required-note">
            Fields marked <Required aria-hidden="true">*</Required> are required.
          </p>
          {isSubmitted && errorCount > 0 ? (
            <Summary role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <p>
                {errorCount === 1
                  ? "There is 1 field to correct."
                  : `There are ${errorCount} fields to correct.`}
              </p>
            </Summary>
          ) : null}

          <Field>
            <Label htmlFor="inquiry-name">
              Name <Required aria-hidden="true">*</Required>
            </Label>
            <Control
              id="inquiry-name"
              type="text"
              autoComplete="name"
              aria-required="true"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "inquiry-name-error" : undefined}
              {...register("name")}
            />
            <FieldError id="inquiry-name-error" message={errors.name?.message} />
          </Field>

          <Field>
            <Label htmlFor="inquiry-email">
              Email <Required aria-hidden="true">*</Required>
            </Label>
            <Control
              id="inquiry-email"
              type="email"
              autoComplete="email"
              aria-required="true"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "inquiry-email-error" : undefined}
              {...register("email")}
            />
            <FieldError id="inquiry-email-error" message={errors.email?.message} />
          </Field>

          <Field>
            <Label htmlFor="inquiry-mobile">Mobile</Label>
            <Control
              id="inquiry-mobile"
              type="tel"
              autoComplete="tel"
              aria-describedby="inquiry-mobile-hint"
              {...register("mobile")}
            />
            <Hint id="inquiry-mobile-hint">Optional. For a faster reply.</Hint>
          </Field>

          <Field>
            <Label htmlFor="inquiry-event-date">
              Event date <Required aria-hidden="true">*</Required>
            </Label>
            <Control
              id="inquiry-event-date"
              type="date"
              aria-required="true"
              aria-invalid={errors.eventDate ? true : undefined}
              aria-describedby={errors.eventDate ? "inquiry-event-date-error" : undefined}
              {...register("eventDate")}
            />
            <FieldError id="inquiry-event-date-error" message={errors.eventDate?.message} />
          </Field>

          <Field>
            <Label htmlFor="inquiry-event-type">Event type</Label>
            <Select id="inquiry-event-type" defaultValue="" {...register("eventType")}>
              <option value="">Select…</option>
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label htmlFor="inquiry-venue">Event location / venue</Label>
            <Control id="inquiry-venue" type="text" {...register("venue")} />
          </Field>

          <Field>
            <Label htmlFor="inquiry-guests">Estimated guests</Label>
            <Control
              id="inquiry-guests"
              type="text"
              inputMode="numeric"
              aria-describedby="inquiry-guests-hint"
              {...register("guests")}
            />
            <Hint id="inquiry-guests-hint">Optional. Approximate number.</Hint>
          </Field>

          <Field>
            <Label htmlFor="inquiry-photobooth">Preferred photobooth</Label>
            <Select id="inquiry-photobooth" defaultValue="" {...register("photobooth")}>
              <option value="">Select…</option>
              {PHOTOBOOTHS.map((booth) => (
                <option key={booth} value={booth}>
                  {booth}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label htmlFor="inquiry-message">Additional requirements</Label>
            <Area id="inquiry-message" {...register("message")} />
          </Field>

          <Submit type="submit">
            <Send size={18} aria-hidden="true" />
            Check enquiry
          </Submit>
        </Form>
      )}
    </ThemeProvider>
  );
}
