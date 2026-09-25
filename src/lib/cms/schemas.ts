// CMS validation schemas (DEC-018).
//
// Zod v4 schemas mirroring src/lib/cms/types.ts. Messages follow the
// inquiry-form convention: short, plain-language, field-specific. Prices stay
// plain strings, exactly as rendered.

import * as z from "zod";
import { IMAGE_MAX_BYTES } from "./storage";

/** Short required text such as names, titles and labels. */
function shortText(label: string, max = 200) {
  return z
    .string()
    .trim()
    .min(1, `Enter ${label}.`)
    .max(max, `${label} must be ${max} characters or fewer.`);
}

/** Longer required text such as summaries, answers and ledes. */
function longText(label: string, max = 6000) {
  return z
    .string()
    .trim()
    .min(1, `Enter ${label}.`)
    .max(max, `${label} must be ${max} characters or fewer.`);
}

/** Optional text such as badges, taglines and captions. */
function optionalText(max = 500) {
  return z.string().trim().max(max, `Must be ${max} characters or fewer.`).optional();
}

const URL_RE = /^https?:\/\/\S+$/i;

/** Required URL such as review, Messenger and social links. */
function requiredUrl(label: string) {
  return z
    .string()
    .trim()
    .min(1, `Enter ${label}.`)
    .refine(
      (value) => URL_RE.test(value),
      `Enter a valid ${label} starting with http:// or https://.`,
    );
}

/** Optional URL such as review, Messenger and social links. Blank keeps the matching public element hidden. */
function optionalUrl(label: string) {
  return z
    .string()
    .trim()
    .max(2000, `${label} must be 2000 characters or fewer.`)
    .refine(
      (value) => value === "" || URL_RE.test(value),
      `Enter a valid ${label} starting with http:// or https://, or leave it blank.`,
    );
}

const imageSchema = z.object({
  key: z.string().max(120).nullable(),
  src: z
    .string()
    .trim()
    .max(2000, "Image must be 2000 characters or fewer.")
    .refine(
      (value) => value.startsWith("/") || URL_RE.test(value) || value === "",
      "Image must start with http://, https:// or /.",
    ),
  alt: shortText("the image alt text", 300),
  caption: optionalText(200),
});

// Packages may ship without an image (the public card does not render one);
// the field still supports upload/replace/remove like every other image.
const optionalImageSchema = z.object({
  key: z.string().max(120).nullish(),
  src: z
    .string()
    .trim()
    .max(2000)
    .refine(
      (value) => value === "" || value.startsWith("/") || URL_RE.test(value),
      "Image must start with http:// or https://, or be uploaded.",
    ),
  alt: z.string().trim().max(300).optional(),
});

export const pageMetaSchema = z.object({
  seoTitle: shortText("the SEO title", 120),
  seoDescription: longText("the meta description", 400),
  ogImage: imageSchema,
  // Internal planning aid; never rendered. Capped but optional.
  keywords: z.string().trim().max(500, "Keywords must be 500 characters or fewer.").default(""),
  // Absolute-URL override; empty follows the page URL.
  canonicalUrl: z
    .string()
    .trim()
    .max(2000, "Canonical URL must be 2000 characters or fewer.")
    .refine(
      (value) => value === "" || URL_RE.test(value),
      "Enter a valid canonical URL starting with http:// or https://, or leave it blank.",
    )
    .default(""),
  ogTitle: z.string().trim().max(120, "OG title must be 120 characters or fewer.").default(""),
  ogDescription: z
    .string()
    .trim()
    .max(400, "OG description must be 400 characters or fewer.")
    .default(""),
  noindex: z.boolean().default(false),
  nofollow: z.boolean().default(false),
});

export type PageMetaInput = z.input<typeof pageMetaSchema>;

const pageHeaderSchema = z.object({
  title: shortText("the page title"),
  eyebrow: shortText("the eyebrow"),
  lede: longText("the introduction", 600),
  image: imageSchema,
});

const sectionHeadingSchema = z.object({
  eyebrow: shortText("the eyebrow"),
  title: shortText("the section title"),
  lede: longText("the section introduction", 600),
});

const ctaBandSchema = z.object({
  eyebrow: shortText("the eyebrow"),
  headline: shortText("the headline"),
  lede: longText("the supporting text", 600),
  primaryLabel: shortText("the primary button label", 60),
  secondaryLabel: shortText("the secondary button label", 60),
  image: imageSchema,
});

const emptyStateSchema = z.object({
  title: shortText("the empty-state title"),
  body: longText("the empty-state text", 600),
  actionLabel: shortText("the button label", 60),
});

// ── Sections ────────────────────────────────────────────────────────────────

const statSchema = z.object({
  value: shortText("the stat value", 40),
  label: shortText("the stat label", 120),
});

export const homeSchema = z.object({
  hero: z.object({
    eyebrow: shortText("the hero eyebrow"),
    headline: shortText("the hero headline"),
    supporting: longText("the hero supporting text", 600),
    primaryLabel: shortText("the primary button label", 60),
    secondaryLabel: shortText("the secondary button label", 60),
    background: imageSchema,
    stats: z
      .array(
        z.object({
          value: shortText("each stat value", 40),
          label: shortText("each stat label", 120),
          icon: z.enum(["camera", "clock", "qrcode"]).optional(),
        }),
      )
      .min(1, "Add at least one hero stat.")
      .max(6),
  }),
  intro: z.object({
    eyebrow: shortText("the eyebrow"),
    heading: shortText("the heading"),
    body: longText("the body text", 2000),
    promises: z
      .array(
        z.object({
          title: shortText("each promise title"),
          detail: shortText("each promise detail", 300),
        }),
      )
      .max(6),
    aboutLabel: shortText("the button label", 60),
  }),
  servicesHeading: sectionHeadingSchema,
  servicesCardLabel: shortText("the card button label", 60),
  showcaseHeading: sectionHeadingSchema,
  showcaseLabel: shortText("the button label", 60),
  packagesHeading: sectionHeadingSchema,
  packagesCompareLabel: shortText("the button label", 60),
  processHeading: sectionHeadingSchema,
  steps: z
    .array(
      z.object({
        id: z.string(),
        title: shortText("the step title"),
        summary: longText("the step summary", 1000),
        icon: z.enum(["message", "palette", "sparkles"]).optional(),
      }),
    )
    .min(1, "Add at least one step.")
    .max(12),
  reviewsHeading: sectionHeadingSchema,
  testimonials: z
    .array(
      z.object({
        id: z.string(),
        quote: longText("the testimonial", 2000),
        name: shortText("the guest name", 120),
        eventType: shortText("the event type", 120),
        rating: z.number().int().min(1).max(5).optional(),
      }),
    )
    .max(30),
  faqHeading: sectionHeadingSchema,
  faqCtaLabel: shortText("the button label", 60),
  eventTypesHeading: sectionHeadingSchema,
  ctaBand: ctaBandSchema,
  seo: pageMetaSchema,
});

export const servicesPageSchema = z.object({
  header: pageHeaderSchema,
  ctaBand: ctaBandSchema,
  seo: pageMetaSchema,
});

export const packagesPageSchema = z.object({
  header: pageHeaderSchema,
  plansHeading: sectionHeadingSchema,
  emptyState: emptyStateSchema,
  footNote: longText("the note below the plans", 600),
  checkDateLabel: shortText("the button label", 60),
  included: z.object({
    eyebrow: shortText("the eyebrow"),
    heading: shortText("the heading"),
    lede: longText("the supporting text", 600),
    standardItems: z.array(shortText("each inclusion", 200)).max(30),
  }),
  addonsHeading: sectionHeadingSchema,
  addOns: z
    .array(
      z.object({
        id: z.string(),
        name: shortText("the add-on name"),
        detail: longText("the add-on detail", 600),
      }),
    )
    .max(20),
  policies: z.object({
    eyebrow: shortText("the eyebrow"),
    heading: shortText("the heading"),
    lede: longText("the supporting text", 600),
  }),
  bookingPolicies: z.array(shortText("each policy", 400)).max(20),
  ctaBand: ctaBandSchema,
  seo: pageMetaSchema,
});

export const galleryPageSchema = z.object({
  header: pageHeaderSchema,
  emptyState: emptyStateSchema,
  ctaBand: ctaBandSchema,
  seo: pageMetaSchema,
});

export const aboutPageSchema = z.object({
  header: pageHeaderSchema,
  storyEyebrow: shortText("the eyebrow"),
  storyHeading: shortText("the story heading"),
  story: z.array(longText("each story paragraph", 3000)).max(12),
  about: z.object({
    eyebrow: shortText("the eyebrow"),
    headline: shortText("the headline"),
    lede: longText("the introduction", 600),
  }),
  valuesHeading: sectionHeadingSchema,
  values: z
    .array(
      z.object({
        id: z.string(),
        title: shortText("the value title"),
        detail: longText("the value detail", 1000),
      }),
    )
    .max(12),
  stats: z.array(statSchema).max(12),
  next: z.object({
    heading: shortText("the heading"),
    suffix: shortText("the closing line", 200),
    servicesLabel: shortText("the services button label", 60),
    enquireLabel: shortText("the enquiry button label", 60),
  }),
  ctaBand: ctaBandSchema,
  seo: pageMetaSchema,
});

export const faqPageSchema = z.object({
  header: pageHeaderSchema,
  searchPlaceholder: shortText("the search placeholder", 80),
  emptyCopy: longText("the no-results text", 400),
  support: z.object({
    heading: shortText("the heading"),
    body: longText("the supporting text", 600),
    label: shortText("the button label", 60),
  }),
  ctaBand: ctaBandSchema,
  seo: pageMetaSchema,
});

export const contactSchema = z.object({
  header: pageHeaderSchema,
  asideHeading: shortText("the aside heading"),
  steps: z
    .array(
      z.object({
        title: shortText("each step title"),
        detail: longText("each step detail", 600),
      }),
    )
    .min(1, "Add at least one step.")
    .max(8),
  serviceAreaLabel: shortText("the service area label", 80),
  typicalReplyLabel: shortText("the reply label", 80),
  typicalReplyValue: shortText("the reply value", 200),
  formTitle: shortText("the form title"),
  formLede: longText("the form introduction", 400),
  formFoot: longText("the privacy note", 400),
  seo: pageMetaSchema,
});

export const settingsSchema = z.object({
  brandName: shortText("the brand name"),
  serviceAreaStatement: longText("the service area statement", 400),
  reviewUrl: optionalUrl("the Google review URL"),
  messengerUrl: optionalUrl("the Messenger URL"),
  socials: z
    .array(
      z.object({
        label: shortText("each social label", 80),
        url: requiredUrl("the social URL"),
      }),
    )
    .max(12),
  footerCta: z.object({
    title: shortText("the footer heading"),
    lede: longText("the footer text", 400),
    label: shortText("the button label", 60),
  }),
});

// ── Legal pages ─────────────────────────────────────────────────────────────

const legalBlockSchema = z.union([
  z.object({ kind: z.literal("paragraph"), text: longText("the paragraph", 2000) }),
  z.object({
    kind: z.literal("list"),
    items: z.array(shortText("each bullet", 500)).min(1, "Add at least one bullet.").max(20),
  }),
]);

const legalHeaderSchema = z.object({
  title: shortText("the page title"),
  eyebrow: shortText("the eyebrow"),
  lede: longText("the introduction", 600),
});

export const legalPageSchema = z.object({
  header: legalHeaderSchema,
  intro: z.array(longText("each intro paragraph", 2000)).max(6),
  sections: z
    .array(
      z.object({
        heading: shortText("each section heading", 200),
        blocks: z.array(legalBlockSchema).min(1, "Add at least one block.").max(12),
      }),
    )
    .max(20),
});

// ── Modules ─────────────────────────────────────────────────────────────────

export const servicesModuleSchema = z
  .array(
    z
      .object({
        id: z.string(),
        name: shortText("the service name"),
        badgeType: z.enum(["basic", "most-popular", "best-value", "custom"]),
        // Blank unless a custom badge is used; the superRefine below requires
        // text only when badgeType is "custom" (the form hides this field
        // otherwise).
        customBadge: z.string().trim().max(60, "Custom badge text must be 60 characters or fewer."),
        tagline: optionalText(200),
        summary: longText("the service summary", 1000),
        highlights: z.array(shortText("each highlight", 200)).max(12),
        icon: z.enum(["camera", "users", "video"]).optional(),
        image: imageSchema,
        highlight: z.boolean(),
      })
      .superRefine((value, ctx) => {
        if (value.badgeType === "custom" && value.customBadge.trim() === "") {
          ctx.addIssue({
            code: "custom",
            path: ["customBadge"],
            message: "Enter the custom badge text, or choose a built-in badge.",
          });
        }
      }),
  )
  .min(1, "Add at least one service.");

export const packagesModuleSchema = z
  .array(
    z
      .object({
        id: z.string(),
        name: shortText("the package name"),
        summary: longText("the package summary", 1000),
        durationLabel: shortText("the duration", 60),
        priceLabel: shortText("the price", 60),
        badgeType: z.enum(["none", "basic", "most-popular", "best-value", "custom"]),
        // Blank unless a custom badge is used; the superRefine below requires
        // text only when badgeType is "custom" (the form hides this field
        // otherwise, and seeded non-custom packages store "").
        customBadge: z.string().trim().max(60, "Custom badge text must be 60 characters or fewer."),
        inclusions: z.array(shortText("each inclusion", 200)).max(30),
        image: optionalImageSchema,
        highlight: z.boolean(),
      })
      .superRefine((value, ctx) => {
        if (value.badgeType === "custom" && value.customBadge.trim() === "") {
          ctx.addIssue({
            code: "custom",
            path: ["customBadge"],
            message: "Enter the custom badge text, or choose a built-in badge.",
          });
        }
      }),
  )
  .min(1, "Add at least one package.");

export const galleryModuleSchema = z
  .array(
    z.object({
      id: z.string(),
      image: imageSchema,
      caption: optionalText(200),
      highlight: z.boolean(),
    }),
  )
  .max(60);

export const faqsModuleSchema = z
  .array(
    z.object({
      id: z.string(),
      question: shortText("the question", 300),
      answer: longText("the answer"),
      highlight: z.boolean(),
    }),
  )
  .max(60);

export const eventTypesModuleSchema = z
  .array(
    z.object({
      id: z.string(),
      label: shortText("the event type label", 80),
    }),
  )
  .max(30);

/** Re-exported for editors: image meta plus the max size from the store. */
export { IMAGE_MAX_BYTES };
