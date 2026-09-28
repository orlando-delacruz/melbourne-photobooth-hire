// Customer review validation: shared client/server schema shape.
// The visitor supplies name, event type, a 1-5 star rating and the review
// text. Moderation status is NEVER part of this schema: POST /api/reviews
// inserts every accepted submission as pending, and admins moderate it in
// the Testimonials module (DEC-035).

import * as z from "zod";

export const reviewSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(120, "Name is too long."),
  eventType: z
    .string()
    .trim()
    .min(1, "Choose your event type.")
    .max(120, "Event type is too long."),
  rating: z
    .coerce.number({ message: "Choose a star rating." })
    .int("Choose a star rating.")
    .min(1, "Choose a star rating.")
    .max(5, "Choose a star rating."),
  quote: z
    .string()
    .trim()
    .min(1, "Write your review.")
    .max(2000, "Reviews are limited to 2000 characters."),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
