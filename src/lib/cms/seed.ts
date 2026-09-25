// CMS seed data (DEC-018): restructured, page content separated from modules.
//
// Initial values are derived from the public-site content (src/lib/content/mock.ts)
// and the page copy currently hardcoded in the public pages. Every module item
// is seeded with highlight ON so the seeded rendering matches the public site
// exactly. Package badge strings are mapped to the new badge types. Nothing is
// deleted; images keep their original remote URLs until replaced by uploads.

import { mockContent } from "../content/mock";
import type { CmsContent, LegalPageContent, LegalPageKey } from "./types";

const HERO_IMAGE = mockContent.heroBackgroundImage;
const PREMIUM_IMAGE = mockContent.serviceImages?.["premium-photobooth"];
const ROAMING_IMAGE = mockContent.serviceImages?.["roaming-photobooth"];
const VIDEO360_IMAGE = mockContent.serviceImages?.["360-video-booth"];
const CTA_IMAGE = mockContent.ctaImage;

const SERVICE_AREA_STATEMENT = "Based in Melbourne, serving surrounding regions.";

/** Initial contact-form event types, in dropdown order. */
const EVENT_TYPE_SEEDS = [
  "Wedding",
  "Birthday",
  "Corporate Event",
  "Engagement Party",
  "School Formal",
  "Christmas/End-of-Year",
  "Private Event",
  "Other",
];

type CmsImageSeed = CmsContent["pages"]["services"]["header"]["image"];

function badgeFor(label: string | undefined): {
  badgeType: CmsContent["modules"]["packages"][number]["badgeType"];
  customBadge: string;
} {
  if (label === "Most popular") return { badgeType: "most-popular", customBadge: "" };
  if (label === "Best value") return { badgeType: "best-value", customBadge: "" };
  if (label) return { badgeType: "custom", customBadge: label };
  return { badgeType: "none", customBadge: "" };
}

export const cmsSeed: CmsContent = {
  pages: {
    home: {
      hero: {
        eyebrow: "Melbourne photobooth hire for every event",
        headline: "Turn the room into a studio.",
        supporting:
          "Open-air booths, roaming setups and 360 video for weddings, birthdays and corporate events, with prints guests keep and QR downloads in seconds.",
        primaryLabel: "Enquire now",
        secondaryLabel: "View packages",
        background: {
          key: null,
          src: HERO_IMAGE?.src ?? "",
          alt: HERO_IMAGE?.alt ?? "Photobooth event",
          caption: undefined,
        },
        stats: mockContent.heroStats ?? [],
      },
      intro: {
        eyebrow: "The experience",
        heading: "Styled for the room it's in.",
        body: "A photobooth is more than a camera in the corner. We design the lighting, the backdrop and the print around your event, then run it with the kind of hosting that gets even the quietest guest in front of the lens.",
        promises: [
          {
            title: "Arrive early, set up quietly",
            detail: "Ready before the first guest walks in.",
          },
          {
            title: "Prints and QR in seconds",
            detail: "HD prints in hand, downloads on their phone.",
          },
          { title: "One local Melbourne team", detail: "From enquiry to pack-down, same people." },
        ],
        aboutLabel: "More about us",
      },
      servicesHeading: {
        eyebrow: "The booths",
        title: "Three ways to bring the room into the frame",
        lede: "Every hire includes HD prints, QR downloads and full setup and pack-down by our team.",
      },
      servicesCardLabel: "Explore the booths",
      showcaseHeading: {
        eyebrow: "Styled moments",
        title: "The kind of night we stage",
        lede: "Backdrops, lighting and props chosen to match the room, not a default kit.",
      },
      showcaseLabel: "View gallery",
      packagesHeading: {
        eyebrow: "Packages",
        title: "All-inclusive hire, priced up front",
        lede: "No hidden extras: every inclusion is listed. Final pricing is confirmed at enquiry.",
      },
      packagesCompareLabel: "Compare all packages",
      processHeading: {
        eyebrow: "How it works",
        title: "From first enquiry to the first flash",
        lede: "Three steps between you and a room full of prints.",
      },
      steps: mockContent.processSteps,
      reviewsHeading: {
        eyebrow: "Reviews",
        title: "What hosts and guests say",
        lede: "A few words from recent weddings, birthdays and corporate nights.",
      },
      testimonials: mockContent.testimonials,
      faqHeading: {
        eyebrow: "Good to know",
        title: "Answers before you ask",
        lede: "Quick answers to the questions we hear most.",
      },
      faqCtaLabel: "Read all FAQs",
      eventTypesHeading: {
        eyebrow: "Perfect for",
        title: "Every occasion, one booth",
        lede: "Weddings, birthdays, corporate nights and everything in between.",
      },
      ctaBand: {
        eyebrow: "Ready when you are",
        headline: "Ready to book your night?",
        lede: "Tell us your date and venue, and we'll recommend the booth that fits your event, usually within one business day.",
        primaryLabel: "Enquire now",
        secondaryLabel: "View packages",
        image: {
          key: null,
          src: CTA_IMAGE?.src ?? "",
          alt: CTA_IMAGE?.alt ?? "",
          caption: undefined,
        },
      },
      seo: {
        seoTitle: "Photobooth Hire Melbourne | Melbourne Photobooth Hire",
        seoDescription:
          "Photobooth hire in Melbourne for weddings, birthdays, corporate and school events. Open-air, roaming and 360 booths with HD prints and instant QR downloads.",
        ogImage: {
          key: null,
          src: HERO_IMAGE?.src ?? "",
          alt: HERO_IMAGE?.alt ?? "",
          caption: undefined,
        },
      },
    },

    services: {
      header: {
        title: "Photobooth experiences",
        eyebrow: "Our booths",
        lede: "Three ways to put a photo studio in the middle of your event, each styled, staffed and built to keep the line moving.",
        image: {
          key: null,
          src: PREMIUM_IMAGE?.src ?? "",
          alt: PREMIUM_IMAGE?.alt ?? "",
          caption: undefined,
        },
      },
      ctaBand: {
        eyebrow: "Not sure which booth?",
        headline: "Tell us about the event.",
        lede: "Share your date, venue and guest numbers and we'll recommend the setup that fits best.",
        primaryLabel: "Start an enquiry",
        secondaryLabel: "Compare packages",
        image: {
          key: null,
          src: CTA_IMAGE?.src ?? "",
          alt: CTA_IMAGE?.alt ?? "",
          caption: undefined,
        },
      },
      seo: {
        seoTitle: "Photobooth Hire Services Melbourne | Premium, Roaming & 360",
        seoDescription:
          "Compare Melbourne photobooth hire services: open-air, roaming and 360 video booths for weddings, birthdays and corporate events, each styled and staffed.",
        ogImage: {
          key: null,
          src: HERO_IMAGE?.src ?? "",
          alt: HERO_IMAGE?.alt ?? "",
          caption: undefined,
        },
      },
    },

    packages: {
      header: {
        title: "Packages",
        eyebrow: "Simple, all-inclusive hire",
        lede: "Every booking comes dressed to impress, with red carpet and golden bollard entrance setup included as standard, with full setup and pack-down by our team.",
        image: {
          key: null,
          src: PREMIUM_IMAGE?.src ?? "",
          alt: PREMIUM_IMAGE?.alt ?? "",
          caption: undefined,
        },
      },
      plansHeading: {
        eyebrow: "Choose your hire",
        title: "Priced up front, nothing hidden",
        lede: "Deposit confirms your date, balance due on the day. Every option can be tailored at enquiry.",
      },
      emptyState: {
        title: "Package options will be shown here once confirmed.",
        body: "Until then, please enquire for current options.",
        actionLabel: "Enquire now",
      },
      footNote:
        "Every package can be tailored to your venue and guest numbers. Tell us your date and we'll confirm availability and the best fit.",
      checkDateLabel: "Check your date",
      included: {
        eyebrow: "Included as standard",
        heading: "Every hire ships with the full setup.",
        lede: "No hidden extras. From studio lighting to QR downloads, the essentials come with every package.",
        standardItems: [
          "Full photobooth service",
          "Studio-quality lighting and styling",
          "Custom-branded print template",
          "HD printing, unlimited sessions",
          "QR code digital downloads",
          "Free use of props",
        ],
      },
      addonsHeading: {
        eyebrow: "Optional extras",
        title: "Add-ons",
        lede: "Layer on photography, extra hours or a themed backdrop to make the night yours.",
      },
      addOns: mockContent.addOns,
      policies: {
        eyebrow: "Good to know",
        heading: "Booking policies",
        lede: "The essentials, in plain language, so there are no surprises on the night.",
      },
      bookingPolicies: mockContent.bookingPolicies,
      ctaBand: {
        eyebrow: "Ready when you are",
        headline: "Let's lock in your date.",
        lede: "Send your event details and we'll confirm availability and the package that fits.",
        primaryLabel: "Enquire now",
        secondaryLabel: "Explore the booths",
        image: {
          key: null,
          src: CTA_IMAGE?.src ?? "",
          alt: CTA_IMAGE?.alt ?? "",
          caption: undefined,
        },
      },
      seo: {
        seoTitle: "Photobooth Hire Packages Melbourne | Prices & Inclusions",
        seoDescription:
          "Compare photobooth hire packages in Melbourne: 2, 3 and 4 hour options with full inclusions, add-ons and booking policies. Enquire for a clear quote.",
        ogImage: {
          key: null,
          src: HERO_IMAGE?.src ?? "",
          alt: HERO_IMAGE?.alt ?? "",
          caption: undefined,
        },
      },
    },

    gallery: {
      header: {
        title: "Gallery",
        eyebrow: "Real event moments",
        lede: "A look at the booths, backdrops and moments we stage across Melbourne.",
        image: {
          key: null,
          src: VIDEO360_IMAGE?.src ?? "",
          alt: VIDEO360_IMAGE?.alt ?? "",
          caption: undefined,
        },
      },
      emptyState: {
        title: "No images are available yet.",
        body: "Once approved event photos are ready, this gallery will showcase real moments from the booth.",
        actionLabel: "Enquire now",
      },
      ctaBand: {
        eyebrow: "Your night next",
        headline: "Want your event to look like this?",
        lede: "Tell us the date, venue and the mood you're going for and we'll take it from there.",
        primaryLabel: "Enquire now",
        secondaryLabel: "View packages",
        image: {
          key: null,
          src: CTA_IMAGE?.src ?? "",
          alt: CTA_IMAGE?.alt ?? "",
          caption: undefined,
        },
      },
      seo: {
        seoTitle: "Photobooth Gallery Melbourne | Weddings, Parties & Events",
        seoDescription:
          "See the booths, backdrops and moments Melbourne Photobooth Hire stages at weddings, birthdays, corporate events and school formals.",
        ogImage: {
          key: null,
          src: HERO_IMAGE?.src ?? "",
          alt: HERO_IMAGE?.alt ?? "",
          caption: undefined,
        },
      },
    },

    about: {
      header: {
        title: mockContent.about.headline,
        eyebrow: "Our story",
        lede: mockContent.about.lede,
        image: {
          key: null,
          src: ROAMING_IMAGE?.src ?? "",
          alt: ROAMING_IMAGE?.alt ?? "",
          caption: undefined,
        },
      },
      storyEyebrow: "The business",
      storyHeading: "Photobooths for people who care how the night feels.",
      story: mockContent.about.story,
      about: {
        eyebrow: mockContent.about.eyebrow,
        headline: mockContent.about.headline,
        lede: mockContent.about.lede,
      },
      valuesHeading: {
        eyebrow: "How we work",
        title: "Three things we never treat as optional",
        lede: "The standards behind every booking, no matter the size of the event.",
      },
      values: mockContent.about.values,
      stats: mockContent.about.stats,
      next: {
        heading: "See the booths, then see the packages.",
        suffix: "Ready to talk dates?",
        servicesLabel: "View services",
        enquireLabel: "Enquire now",
      },
      ctaBand: {
        eyebrow: "Let's make something memorable",
        headline: "Bring the booth to your event.",
        lede: "Tell us the date and venue and we'll handle the styling, the setup and the prints.",
        primaryLabel: "Enquire now",
        secondaryLabel: "View gallery",
        image: {
          key: null,
          src: CTA_IMAGE?.src ?? "",
          alt: CTA_IMAGE?.alt ?? "",
          caption: undefined,
        },
      },
      seo: {
        seoTitle: "About Us | Melbourne Photobooth Hire",
        seoDescription:
          "Meet Melbourne Photobooth Hire, a local Melbourne team styling and running photobooth experiences for weddings, birthdays and corporate events.",
        ogImage: {
          key: null,
          src: HERO_IMAGE?.src ?? "",
          alt: HERO_IMAGE?.alt ?? "",
          caption: undefined,
        },
      },
    },

    faq: {
      header: {
        title: "Frequently asked questions",
        eyebrow: "Good to know",
        lede: "Everything hosts usually ask before booking. If your question isn't here, we're one message away.",
        image: {
          key: null,
          src: CTA_IMAGE?.src ?? "",
          alt: CTA_IMAGE?.alt ?? "",
          caption: undefined,
        },
      },
      searchPlaceholder: "Search questions",
      emptyCopy: "No questions match your search. Try a different word, or ask us directly.",
      support: {
        heading: "Still have a question?",
        body: "Send it through with your event details and we'll reply, usually within one business day.",
        label: "Ask a question",
      },
      ctaBand: {
        eyebrow: "Ready when you are",
        headline: "Questions answered? Let's talk dates.",
        lede: "Send your event details and we'll confirm availability and the right booth for the night.",
        primaryLabel: "Enquire now",
        secondaryLabel: "View packages",
        image: {
          key: null,
          src: CTA_IMAGE?.src ?? "",
          alt: CTA_IMAGE?.alt ?? "",
          caption: undefined,
        },
      },
      seo: {
        seoTitle: "Photobooth Hire FAQs Melbourne | Pricing, Setup & Policies",
        seoDescription:
          "Answers to common Melbourne photobooth hire questions: pricing, what's included, travel, setup time, space requirements and booking policies.",
        ogImage: {
          key: null,
          src: HERO_IMAGE?.src ?? "",
          alt: HERO_IMAGE?.alt ?? "",
          caption: undefined,
        },
      },
    },

    contact: {
      header: {
        title: "Make an enquiry",
        eyebrow: "Let's plan your night",
        lede: "Tell us about your event and we'll confirm availability, recommend the right booth and put together a clear quote.",
        image: {
          key: null,
          src: ROAMING_IMAGE?.src ?? "",
          alt: ROAMING_IMAGE?.alt ?? "",
          caption: undefined,
        },
      },
      asideHeading: "What happens next",
      steps: [
        {
          title: "Send your details",
          detail: "Your date, venue and rough guest numbers are plenty to start.",
        },
        {
          title: "We reply with options",
          detail: "Availability, the right booth for the room and a clear quote.",
        },
        {
          title: "Lock in your date",
          detail: "A 20% deposit confirms your date, with the balance due on the day.",
        },
      ],
      serviceAreaLabel: "Service area",
      typicalReplyLabel: "Typical reply",
      typicalReplyValue: "Within one business day.",
      formTitle: "Event enquiry",
      formLede: "Share a few details and we'll reply with availability and a clear quote.",
      formFoot: "We use your details only to respond to this enquiry.",
      seo: {
        seoTitle: "Contact & Enquire | Photobooth Hire Melbourne",
        seoDescription:
          "Enquire about photobooth hire in Melbourne. Send your event date, venue and guest numbers and we'll confirm availability and put together a clear quote.",
        ogImage: {
          key: null,
          src: HERO_IMAGE?.src ?? "",
          alt: HERO_IMAGE?.alt ?? "",
          caption: undefined,
        },
      },
    },
  },

  settings: {
    brandName: mockContent.site.brandName,
    serviceAreaStatement: SERVICE_AREA_STATEMENT,
    reviewUrl: "",
    messengerUrl: "https://m.me/",
    socials: [],
    footerCta: {
      title: "Ready when you are",
      lede: "Tell us your date and we'll recommend the right booth for your event.",
      label: "Enquire now",
    },
  },

  // SEO-only settings for the code-managed legal pages. Titles and
  // descriptions mirror the hardcoded page head values; nothing else set.
  seo: {
    privacy: {
      seoTitle: "Privacy Policy | Melbourne Photobooth Hire",
      seoDescription:
        "How Melbourne Photobooth Hire collects, uses, stores and protects the personal information you share through this website.",
      ogImage: {
        key: null,
        src: "",
        alt: "Melbourne Photobooth Hire",
        caption: undefined,
      },
      keywords: "",
      canonicalUrl: "",
      ogTitle: "",
      ogDescription: "",
      noindex: false,
      nofollow: false,
    },
    terms: {
      seoTitle: "Terms & Conditions | Melbourne Photobooth Hire",
      seoDescription:
        "The terms and conditions that apply to photobooth hire with Melbourne Photobooth Hire, including bookings, deposits, rescheduling and venue requirements.",
      ogImage: {
        key: null,
        src: "",
        alt: "Melbourne Photobooth Hire",
        caption: undefined,
      },
      keywords: "",
      canonicalUrl: "",
      ogTitle: "",
      ogDescription: "",
      noindex: false,
      nofollow: false,
    },
  },

  modules: {
    services: mockContent.services.map((service) => ({
      id: service.id,
      name: service.name,
      // Every service carries a badge: existing labels are kept as custom
      // badges, and the one badgeless service seeds as Basic.
      badgeType: service.badge ? ("custom" as const) : ("basic" as const),
      customBadge: service.badge ?? "",
      tagline: service.tagline ?? "",
      summary: service.summary,
      highlights: service.highlights ?? [],
      icon: service.icon,
      image: {
        key: null,
        src:
          (service.id === "premium-photobooth" ? PREMIUM_IMAGE?.src : undefined) ??
          (service.id === "roaming-photobooth" ? ROAMING_IMAGE?.src : undefined) ??
          (service.id === "360-video-booth" ? VIDEO360_IMAGE?.src : undefined) ??
          "",
        alt:
          (service.id === "premium-photobooth" ? PREMIUM_IMAGE : undefined)?.alt ??
          (service.id === "roaming-photobooth" ? ROAMING_IMAGE : undefined)?.alt ??
          (service.id === "360-video-booth" ? VIDEO360_IMAGE : undefined)?.alt ??
          service.name,
        caption: undefined,
      },
      highlight: true,
    })),
    packages: mockContent.packages.map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      summary: pkg.summary,
      durationLabel: pkg.durationLabel,
      priceLabel: pkg.priceLabel,
      badgeType: badgeFor(pkg.badge).badgeType,
      customBadge: badgeFor(pkg.badge).customBadge,
      inclusions: pkg.inclusions,
      image: { key: null, src: "", alt: "", caption: undefined } as CmsImageSeed,
      highlight: true,
    })),
    gallery: mockContent.gallery.map((item) => ({
      id: item.id,
      image: {
        key: null,
        src: item.src,
        alt: item.alt,
        caption: undefined,
      } as CmsImageSeed,
      caption: item.caption ?? "",
      highlight: true,
    })),
    faqs: mockContent.faqs.map((faq) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      highlight: true,
    })),
    // Homepage reviews (DEC-034): every saved testimonial shows in module
    // order. Seeded from the same provisional reviews as the home blob so
    // the first module-backed render matches the public site.
    testimonials: mockContent.testimonials.map((item) => ({
      id: item.id,
      quote: item.quote,
      name: item.name,
      eventType: item.eventType,
      rating: item.rating,
    })),
    // Contact-form dropdown options, preserving the documented candidate
    // values in order (formerly REQ-INQ-009 constants). Array order is the
    // dropdown order.
    "event-types": EVENT_TYPE_SEEDS.map((label, index) => ({
      id: `event-type-${index + 1}`,
      label,
    })),
  },
};

/**
 * Legal page copy, transcribed verbatim from the public privacy/terms pages
 * so the CMS-managed render is byte-identical until first edited in admin.
 */
export const legalSeed: Record<LegalPageKey, LegalPageContent> = {
  privacy: {
    header: {
      title: "Privacy Policy",
      eyebrow: "Legal",
      lede: "How we collect, use and protect the information you share with us.",
    },
    intro: [
      "Last updated: September 2026",
      'Melbourne Photobooth Hire ("we", "us", "our") respects your privacy. This policy explains what information we collect when you use our website or enquire about our services, how we use it, and the choices you have.',
    ],
    sections: [
      {
        heading: "Information we collect",
        blocks: [
          { kind: "paragraph", text: "We collect information you give us directly, including:" },
          {
            kind: "list",
            items: [
              "Your name, email address and phone number.",
              "Event details such as the date, type, venue and estimated guest numbers.",
              "Any message or additional requirements you send through our enquiry form.",
            ],
          },
          {
            kind: "paragraph",
            text: "We also collect limited technical information automatically when you visit the site, such as your browser type and general usage data, to keep the site working and secure.",
          },
        ],
      },
      {
        heading: "How we use your information",
        blocks: [
          { kind: "paragraph", text: "We use the information you provide to:" },
          {
            kind: "list",
            items: [
              "Respond to your enquiry and prepare a quote.",
              "Confirm, plan and deliver the services you request.",
              "Communicate with you about your event before and after the date.",
              "Meet our legal and accounting obligations.",
            ],
          },
        ],
      },
      {
        heading: "How we share information",
        blocks: [
          {
            kind: "paragraph",
            text: "We do not sell your personal information. We may share it with trusted service providers who help us run the business (for example, email delivery, website hosting and spam protection), only to the extent needed to provide those services. We may also disclose information where required by law.",
          },
        ],
      },
      {
        heading: "Event photography",
        blocks: [
          {
            kind: "paragraph",
            text: "Photographs taken at your event belong to the experience you booked. We only use images for our own promotion where you or the relevant guests have given permission. You can ask us to remove an image at any time.",
          },
        ],
      },
      {
        heading: "Data security and retention",
        blocks: [
          {
            kind: "paragraph",
            text: "We take reasonable steps to protect the information we hold and keep it only for as long as we need it for the purposes described here, or as required by law.",
          },
        ],
      },
      {
        heading: "Access and correction",
        blocks: [
          {
            kind: "paragraph",
            text: "You can ask us to access, correct or delete the personal information we hold about you. To make a request, contact us through the details on our contact page.",
          },
        ],
      },
      {
        heading: "Cookies",
        blocks: [
          {
            kind: "paragraph",
            text: "Our website may use cookies and similar technologies to support core functionality and understand how the site is used. You can control cookies through your browser settings.",
          },
        ],
      },
      {
        heading: "Changes to this policy",
        blocks: [
          {
            kind: "paragraph",
            text: "We may update this policy from time to time. The current version will always be available on this page.",
          },
        ],
      },
    ],
  },
  terms: {
    header: {
      title: "Terms & Conditions",
      eyebrow: "Legal",
      lede: "The terms that apply when you hire a photobooth experience from us.",
    },
    intro: [
      "Last updated: September 2026",
      'These terms apply to the photobooth hire services provided by Melbourne Photobooth Hire ("we", "us", "our"). By making an enquiry or confirming a booking, you agree to these terms.',
    ],
    sections: [
      {
        heading: "Enquiries and quotes",
        blocks: [
          {
            kind: "paragraph",
            text: "Submitting an enquiry does not create a booking or reserve a date. A booking is confirmed only when we accept it in writing and the deposit has been received. Quotes are valid for 14 days unless stated otherwise.",
          },
        ],
      },
      {
        heading: "Deposits and payment",
        blocks: [
          {
            kind: "list",
            items: [
              "A 20% deposit is required to confirm your booking.",
              "The remaining balance is due on the day of the event.",
              "Deposits are non-refundable.",
              "Extended hire is charged per hour as agreed in your quote.",
            ],
          },
        ],
      },
      {
        heading: "Rescheduling and cancellation",
        blocks: [
          {
            kind: "paragraph",
            text: "Rescheduling is available with reasonable notice and is subject to availability. If an event is cancelled, the deposit is not refunded. We may need to reschedule or cancel in exceptional circumstances such as severe weather or equipment failure; in those cases we will offer an alternative date or a refund of amounts paid for the affected service.",
          },
        ],
      },
      {
        heading: "Venue requirements",
        blocks: [
          {
            kind: "paragraph",
            text: "You agree to provide suitable access to the venue, a reasonably level area for the booth, and a power supply where required. Please tell us about stairs, load-in restrictions or limited access in advance so we can plan accordingly.",
          },
        ],
      },
      {
        heading: "Setup and hire period",
        blocks: [
          {
            kind: "paragraph",
            text: "We arrive before the hire period to set up and pack down afterwards. Setup and pack-down time is additional to the hire period unless agreed otherwise. Delays caused by venue access may reduce the available hire time.",
          },
        ],
      },
      {
        heading: "Guests and safety",
        blocks: [
          {
            kind: "paragraph",
            text: "The booth must be used in a reasonable manner. We may pause or stop the service if equipment or staff are at risk. Children should be supervised by a responsible adult while using the booth.",
          },
        ],
      },
      {
        heading: "Damage and liability",
        blocks: [
          {
            kind: "paragraph",
            text: "You are responsible for loss or damage to our equipment caused by you or your guests, other than fair wear and tear. To the extent permitted by law, our liability is limited to the value of the service provided. Nothing in these terms excludes rights that cannot be excluded under the Australian Consumer Law.",
          },
        ],
      },
      {
        heading: "Photography and content",
        blocks: [
          {
            kind: "paragraph",
            text: "Guests retain the photos taken at the event. We may use images for promotional purposes only with permission, and you may request removal at any time.",
          },
        ],
      },
      {
        heading: "Changes to these terms",
        blocks: [
          {
            kind: "paragraph",
            text: "We may update these terms from time to time. The terms that apply to your booking are those in effect when the booking is confirmed.",
          },
        ],
      },
    ],
  },
};
