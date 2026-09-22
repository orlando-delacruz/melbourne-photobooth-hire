// CMS validation schemas: frontend-only phase.
//
// Zod v4 schemas mirroring src/lib/cms/types.ts. Messages follow the
// inquiry-form convention: short, plain-language, field-specific.
// Prices stay plain strings (for example "$350 total") exactly as rendered.

import * as z from "zod";

const URL_RE = /^https?:\/\/\S+$/i;

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

/** Required URL such as image sources. */
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

/** Optional URL such as review, Messenger and social links. Empty keeps the matching public element hidden. */
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

const pageMetaSchema = z.object({
  seoTitle: shortText("the SEO title", 120),
  seoDescription: longText("the meta description", 400),
  ogImage: requiredUrl("the social share image URL"),
});

const pageHeaderSchema = z.object({
  title: shortText("the page title"),
  eyebrow: shortText("the eyebrow"),
  lede: longText("the introduction", 600),
  imageSrc: requiredUrl("the header image URL"),
  imageAlt: shortText("the header image alt text", 300),
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
  imageSrc: requiredUrl("the image URL"),
  imageAlt: shortText("the image alt text", 300),
});

const emptyStateSchema = z.object({
  title: shortText("the empty-state title"),
  body: longText("the empty-state text", 600),
  actionLabel: shortText("the button label", 60),
});

const sampleImageSchema = z.object({
  src: requiredUrl("the image URL"),
  alt: shortText("the image alt text", 300),
  caption: optionalText(200),
});

// ── Shared entities (shapes match the public content seam) ──────────────────

const serviceSchema = z.object({
  id: z.string(),
  name: shortText("the service name"),
  badge: optionalText(60),
  icon: z.enum(["camera", "users", "video"]).optional(),
  tagline: optionalText(200),
  summary: longText("the service summary", 1000),
  highlights: z.array(shortText("each highlight", 200)).max(12),
});

const packageSchema = z.object({
  id: z.string(),
  name: shortText("the package name"),
  badge: optionalText(60),
  summary: longText("the package summary", 1000),
  durationLabel: shortText("the duration", 60),
  priceLabel: shortText("the price", 60),
  inclusions: z.array(shortText("each inclusion", 200)).max(30),
});

const addOnSchema = z.object({
  id: z.string(),
  name: shortText("the add-on name"),
  detail: longText("the add-on detail", 600),
});

const faqSchema = z.object({
  id: z.string(),
  question: shortText("the question", 300),
  answer: longText("the answer"),
});

const testimonialSchema = z.object({
  id: z.string(),
  quote: longText("the testimonial", 2000),
  name: shortText("the guest name", 120),
  eventType: shortText("the event type", 120),
  rating: z.number().int().min(1).max(5).optional(),
});

const galleryItemSchema = z.object({
  id: z.string(),
  src: requiredUrl("the image URL"),
  alt: shortText("the image alt text", 300),
  caption: optionalText(200),
});

const processStepSchema = z.object({
  id: z.string(),
  icon: z.enum(["message", "palette", "sparkles"]).optional(),
  title: shortText("the step title"),
  summary: longText("the step summary", 1000),
});

const heroStatSchema = z.object({
  value: shortText("the stat value", 40),
  label: shortText("the stat label", 120),
  icon: z.enum(["camera", "clock", "qrcode"]).optional(),
});

const aboutValueSchema = z.object({
  id: z.string(),
  title: shortText("the value title"),
  detail: longText("the value detail", 1000),
});

const aboutStatSchema = z.object({
  value: shortText("the stat value", 40),
  label: shortText("the stat label", 120),
});

const aboutContentSchema = z.object({
  eyebrow: shortText("the eyebrow"),
  headline: shortText("the headline"),
  lede: longText("the introduction", 600),
  story: z.array(longText("each story paragraph", 3000)).max(12),
  values: z.array(aboutValueSchema).max(12),
  stats: z.array(aboutStatSchema).max(12),
});

// ── Sections ────────────────────────────────────────────────────────────────

export const homeSchema = z.object({
  hero: z.object({
    eyebrow: shortText("the hero eyebrow"),
    headline: shortText("the hero headline"),
    supporting: longText("the hero supporting text", 600),
    primaryLabel: shortText("the primary button label", 60),
    secondaryLabel: shortText("the secondary button label", 60),
    backgroundSrc: requiredUrl("the hero image URL"),
    backgroundAlt: shortText("the hero image alt text", 300),
    stats: z.array(heroStatSchema).min(1, "Add at least one hero stat.").max(6),
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
  servicesSection: z.object({
    heading: sectionHeadingSchema,
    cardCtaLabel: shortText("the card button label", 60),
  }),
  showcase: z.object({
    heading: sectionHeadingSchema,
    galleryLabel: shortText("the button label", 60),
    images: z.array(sampleImageSchema).max(12),
  }),
  packagesSection: z.object({
    heading: sectionHeadingSchema,
    compareLabel: shortText("the button label", 60),
  }),
  processSection: z.object({
    heading: sectionHeadingSchema,
    steps: z.array(processStepSchema).min(1, "Add at least one step.").max(12),
  }),
  reviewsSection: z.object({
    heading: sectionHeadingSchema,
    testimonials: z.array(testimonialSchema).max(30),
  }),
  faqSection: z.object({
    heading: sectionHeadingSchema,
    readAllLabel: shortText("the button label", 60),
  }),
  eventTypesSection: z.object({
    heading: sectionHeadingSchema,
    eventTypes: z
      .array(shortText("each event type", 80))
      .min(1, "Add at least one event type.")
      .max(30),
  }),
  ctaBand: ctaBandSchema,
  seo: pageMetaSchema,
});

export const servicesSchema = z.object({
  header: pageHeaderSchema,
  services: z.array(serviceSchema).min(1, "Add at least one service.").max(12),
  ctaBand: ctaBandSchema,
  seo: pageMetaSchema,
});

export const packagesSchema = z.object({
  header: pageHeaderSchema,
  plansHeading: sectionHeadingSchema,
  emptyState: emptyStateSchema,
  footNote: longText("the note below the plans", 600),
  checkDateLabel: shortText("the button label", 60),
  packages: z.array(packageSchema).min(1, "Add at least one package.").max(12),
  included: z.object({
    eyebrow: shortText("the eyebrow"),
    heading: shortText("the heading"),
    lede: longText("the supporting text", 600),
    standardItems: z.array(shortText("each inclusion", 200)).max(30),
  }),
  addonsHeading: sectionHeadingSchema,
  addOns: z.array(addOnSchema).max(20),
  policies: z.object({
    eyebrow: shortText("the eyebrow"),
    heading: shortText("the heading"),
    lede: longText("the supporting text", 600),
  }),
  bookingPolicies: z.array(shortText("each policy", 400)).max(20),
  ctaBand: ctaBandSchema,
  seo: pageMetaSchema,
});

export const gallerySchema = z.object({
  header: pageHeaderSchema,
  emptyState: emptyStateSchema,
  gallery: z.array(galleryItemSchema).max(60),
  ctaBand: ctaBandSchema,
  seo: pageMetaSchema,
});

export const aboutSchema = z.object({
  header: pageHeaderSchema,
  storyEyebrow: shortText("the eyebrow"),
  storyHeading: shortText("the story heading"),
  about: aboutContentSchema,
  valuesHeading: sectionHeadingSchema,
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
  faqs: z.array(faqSchema).max(60),
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
  sharedImages: z.object({
    premium: sampleImageSchema,
    roaming: sampleImageSchema,
    video360: sampleImageSchema,
    cta: sampleImageSchema,
  }),
});
