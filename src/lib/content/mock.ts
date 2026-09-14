import type { SiteContent } from "./types";

/**
 * Mock adapter: PROVISIONAL DEV MOCKS (user-waived confirmation for dev).
 * Structure follows the Shot&Prints reference; values are CMS-editable and
 * must not be treated as confirmed production facts.
 * Never carried over: Shot&Prints brand, contacts, ABN, socials, ratings,
 * established dates, or insurance claims.
 */
export const mockContent: SiteContent = {
  services: [
    {
      id: "premium-photobooth",
      name: "Premium Photobooth",
      badge: "Most Popular",
      icon: "camera",
      tagline: "The centrepiece of the room.",
      summary:
        "An open-air, studio-lit booth that turns any corner of your venue into a photo studio — ideal for weddings, corporate events and milestone birthdays.",
      highlights: [
        "Open-air, studio-lit experience",
        "Ideal for weddings & corporate events",
        "Pairs with the 360 Video Booth",
      ],
    },
    {
      id: "roaming-photobooth",
      name: "Roaming Photobooth",
      badge: "Fan Favourite",
      icon: "users",
      tagline: "The booth that mingles.",
      summary:
        "A portable booth that moves through the crowd, capturing candid moments wherever your guests are.",
      highlights: [
        "Moves through the crowd",
        "No fixed backdrop needed",
        "Candid, in-the-moment shots",
      ],
    },
    {
      id: "360-video-booth",
      name: "360 Video Booth",
      icon: "video",
      tagline: "The shot everyone shares.",
      summary:
        "A 360° slow-motion experience — guests strike a pose and share-ready clips land on their phone via QR.",
      highlights: [
        "360° slow-motion clips",
        "Instant QR download",
        "Share-ready in seconds",
      ],
    },
  ],
  packages: [
    {
      id: "starter",
      name: "Starter",
      summary:
        "Every booking comes dressed to impress — red carpet and golden bollard entrance setup included as standard, with full setup and pack-down handled by our team.",
      durationLabel: "2 hours",
      priceLabel: "$350 total",
      inclusions: [
        "Full photobooth service",
        "Studio-quality lighting and styling",
        "Custom-branded print template",
        "HD printing",
        "QR code digital downloads",
        "Friendly on-site attendant (optional)",
        "Free use of props",
      ],
    },
    {
      id: "standard",
      name: "Standard",
      badge: "Most Popular",
      summary:
        "Our most-booked balance of time and value — room for group shots, guest sessions, and prints for everyone.",
      durationLabel: "3 hours",
      priceLabel: "$450 total",
      inclusions: [
        "Full photobooth service",
        "Studio-quality lighting and styling",
        "Custom-branded print template",
        "HD printing",
        "QR code digital downloads",
        "Friendly on-site attendant (optional)",
        "Free use of props",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      summary:
        "Maximum coverage for big nights — extended hire plus priority setup and pack-down and the 360 Video Booth experience.",
      durationLabel: "4 hours",
      priceLabel: "$600 total",
      inclusions: [
        "Full photobooth service",
        "Studio-quality lighting and styling",
        "Custom-branded print template",
        "HD printing",
        "QR code digital downloads",
        "Friendly on-site attendant (optional)",
        "Free use of props",
        "Priority setup & pack-down",
        "360 Video Booth experience",
      ],
    },
  ],
  addOns: [
    {
      id: "professional-photography",
      name: "Professional Photography",
      detail: "Add a photographer to capture your event alongside the booth.",
    },
    {
      id: "extended-hire",
      name: "Extended Hire",
      detail: "$150/hour — keep the booth running longer on the night.",
    },
    {
      id: "custom-backdrop",
      name: "Custom Backdrop",
      detail: "A backdrop designed to match your theme or branding.",
    },
    {
      id: "digital-guestbook",
      name: "Digital Guestbook",
      detail: "Collect guest photos and messages in one shareable place.",
    },
  ],
  eventTypes: [
    "Weddings",
    "Birthdays",
    "Corporate Events",
    "School Formals",
    "Engagement Parties",
    "Christmas Parties",
  ],
  processSteps: [
    {
      id: "enquire",
      title: "01 — Enquire",
      summary:
        "Reach out with your event date and details. We'll confirm availability and recommend the perfect booth for your occasion.",
    },
    {
      id: "customise",
      title: "02 — Customise",
      summary:
        "Choose your backdrop, print template, and props. We'll design a branded experience that matches your event perfectly.",
    },
    {
      id: "celebrate",
      title: "03 — Celebrate",
      summary:
        "We arrive early, set up quietly, and run the booth all night. You party — guests walk away with prints in hand.",
    },
  ],
  // No verified testimonials yet: stays empty until genuine, approved
  // customer feedback is confirmed (REQ-REV-007). Optional supporting
  // content is omitted when absent.
  testimonials: [],
  bookingPolicies: [
    "20% deposit required to confirm the booking. Balance due on the day.",
    "Deposit is non-refundable. Rescheduling available with notice.",
    "Every event is different — packages can be tailored to suit your requirements.",
  ],
  // No real event imagery yet: gallery keeps its empty state until the
  // client approves real photos (REQ-GAL-001, REQ-GAL-005).
  gallery: [],
  faqs: [
    {
      id: "how-far-in-advance",
      question: "How far in advance should I book?",
      answer:
        "We recommend booking at least 4–6 weeks before your event, especially during peak seasons like summer weddings and end-of-year celebrations. Popular dates fill quickly, so earlier is always better. Reach out and we'll confirm availability straight away.",
    },
    {
      id: "how-much",
      question: "How much does it cost?",
      answer:
        "Our provisional packages start at $350 for 2 hours, $450 for 3 hours, and $600 for 4 hours. Extended hire is available at $150/hour. Final pricing is confirmed at enquiry and managed through the CMS.",
    },
    {
      id: "whats-included",
      question: "What's included in every hire?",
      answer:
        "Every hire includes full photobooth service, studio-quality lighting and styling, a custom-branded print template, HD printing, QR code digital downloads, free use of props, and full setup and pack-down by our team.",
    },
    {
      id: "what-is-360",
      question: "What is the 360 Video Booth and how does it work?",
      answer:
        "The 360 Video Booth captures slow-motion video from every angle. Guests step onto the platform, the camera spins around them, and they receive a share-ready clip via instant QR download — no app required.",
    },
    {
      id: "do-you-travel",
      question: "Do you travel outside Melbourne?",
      answer:
        "Yes — we're based in Melbourne and serve surrounding areas. A transport fee may apply depending on your event location; we'll confirm it with your quote.",
    },
    {
      id: "setup-time",
      question: "How long does setup take?",
      answer:
        "We arrive early and set up quietly before your guests arrive, then pack down after the hire ends. Premium hires include priority setup and pack-down.",
    },
    {
      id: "deposit-cancellation",
      question: "What is your deposit and cancellation policy?",
      answer:
        "A 20% deposit confirms your booking with the balance due on the day. Deposits are non-refundable, and rescheduling is available with notice.",
    },
    {
      id: "insured",
      question: "Are you insured?",
      answer:
        "Provisional details about insurance cover are managed through the CMS and confirmed at enquiry — please ask and we'll provide current documentation.",
    },
    {
      id: "add-photography",
      question: "Can I add professional photography to my booking?",
      answer:
        "Yes — professional photography is available as an add-on alongside extended hire, custom backdrops, and a digital guestbook. Mention it in your enquiry and we'll tailor a package.",
    },
  ],
  site: {
    brandName: "Melbourne Photobooth Hire",
    heroHeadline: "Capture every Moment.",
    heroSupporting:
      "Melbourne's favourite photobooth hire for weddings, birthdays and corporate events — with custom prints and instant QR downloads.",
    serviceAreaStatement: "Based in Melbourne. A transport fee may apply by event location.",
    reviewUrl: null,
  },

  // ── Homepage provisional content (SAMPLE) ──────────────────────────────
  // External stock photography (Pexels) and invented stats/quotes exercise
  // homepage layout only. All marked SAMPLE; replaced via this seam by
  // client-approved imagery and confirmed content. Never published as fact.
  heroBackgroundImage: {
    src: "https://images.pexels.com/photos/30562607/pexels-photo-30562607.jpeg?auto=compress&cs=tinysrgb&w=1920",
    alt: "An outdoor event set with elegant tables beneath warm string lights at night (sample imagery)",
  },
  heroStats: [
    { value: "3", label: "booth experiences", icon: "camera" },
    { value: "4 hrs", label: "longest hire window", icon: "clock" },
    { value: "HD", label: "prints plus QR downloads", icon: "qrcode" },
  ],
  serviceImages: {
    "premium-photobooth": {
      src: "https://images.pexels.com/photos/17641795/pexels-photo-17641795.jpeg?auto=compress&cs=tinysrgb&w=900",
      alt: "A guest posing inside a curtained photo booth (sample imagery)",
    },
    "roaming-photobooth": {
      src: "https://images.pexels.com/photos/6224736/pexels-photo-6224736.jpeg?auto=compress&cs=tinysrgb&w=900",
      alt: "Two friends laughing at a party in front of a golden backdrop (sample imagery)",
    },
    "360-video-booth": {
      src: "https://images.pexels.com/photos/38661371/pexels-photo-38661371.jpeg?auto=compress&cs=tinysrgb&w=900",
      alt: "Guests celebrating on a dance floor beneath festival lights (sample imagery)",
    },
  },
  showcaseImages: [
    {
      src: "https://images.pexels.com/photos/34458014/pexels-photo-34458014.jpeg?auto=compress&cs=tinysrgb&w=900",
      alt: "Wedding guests raising a toast on the dance floor (sample imagery)",
      caption: "A wedding toast mid-dance",
    },
    {
      src: "https://images.pexels.com/photos/32333372/pexels-photo-32333372.jpeg?auto=compress&cs=tinysrgb&w=900",
      alt: "Friends celebrating a birthday in a shower of confetti (sample imagery)",
      caption: "Confetti after the candles",
    },
    {
      src: "https://images.pexels.com/photos/7638133/pexels-photo-7638133.jpeg?auto=compress&cs=tinysrgb&w=900",
      alt: "Friends laughing and dancing together at a celebration (sample imagery)",
      caption: "Laughter at a private party",
    },
  ],
  ctaImage: {
    src: "https://images.pexels.com/photos/29851245/pexels-photo-29851245.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "A wedding party celebrating under outdoor string lights at night (sample imagery)",
  },
  sampleTestimonials: [
    {
      id: "sample-1",
      quote:
        "The booth was the heart of the night — guests queued for hours and walked away with prints in hand.",
      name: "Mia & Jordan",
      eventType: "Wedding",
    },
    {
      id: "sample-2",
      quote:
        "Our team still talks about the 360 clips. It turned a corporate night into something people actually remember.",
      name: "Priya S.",
      eventType: "Corporate event",
    },
    {
      id: "sample-3",
      quote:
        "Setup was seamless and the prints looked incredible — the birthday kids wouldn't leave the booth.",
      name: "Tara N.",
      eventType: "Birthday",
    },
  ],
};
