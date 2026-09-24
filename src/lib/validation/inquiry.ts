import type { FieldErrors, FieldValues, Resolver } from "react-hook-form";
import * as z from "zod";

/**
 * Inquiry validation: shared client/server schema shape (Phase 2: client
 * usability layer only; the Astro Server Endpoint re-validates in Phase 4).
 *
 * PROVISIONAL: the field set, required-vs-optional designations, and option
 * lists below are the documented candidates from REQ-INQ-008 through
 * REQ-INQ-010. Final confirmation is required before production use.
 */

/** Candidate photobooth options (REQ-INQ-010). Requires client confirmation. */
export const PHOTOBOOTHS = ["Premium", "Roaming", "360", "Not Sure"] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const inquirySchema = z.object({
  name: z.string().trim().min(1, "Enter your name."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .refine((value) => EMAIL_RE.test(value), "Enter a valid email address."),
  mobile: z.string().trim().optional(),
  eventDate: z.string().min(1, "Choose your event date."),
  eventType: z.string().optional(),
  venue: z.string().trim().optional(),
  guests: z.string().trim().optional(),
  photobooth: z.string().optional(),
  message: z.string().trim().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

/**
 * Minimal Zod adapter for React Hook Form. A dedicated resolver package is
 * intentionally avoided: Astro pins Zod v4 while the adapter ecosystem still
 * targets Zod v3, and the mapping below is the only behavior needed.
 */
export function zodResolver<T extends FieldValues>(schema: z.ZodType<T>): Resolver<T> {
  return async (values) => {
    const result = schema.safeParse(values);
    if (result.success) {
      return { values: result.data, errors: {} };
    }
    const errors: FieldErrors<T> = {};
    for (const issue of result.error.issues) {
      const name = issue.path.join(".");
      if (name && !(name in errors)) {
        (errors as Record<string, { type: string; message: string }>)[name] = {
          type: issue.code,
          message: issue.message,
        };
      }
    }
    return { values: {}, errors };
  };
}
