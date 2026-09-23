// CMS seed data: frontend-only phase.
//
// Initial values are copied verbatim from the content currently rendered by
// the public pages and the provisional mock content (src/lib/content/mock.ts).
// Where the public site hardcodes copy in .astro files, the same strings are
// mirrored here. The public site does not read this model yet.

import type { CmsContent } from "./types";

const HERO_IMAGE_SRC =
  "https://images.pexels.com/photos/30562607/pexels-photo-30562607.jpeg?auto=compress&cs=tinysrgb&w=1920";
const HERO_IMAGE_ALT =
  "An outdoor event set with elegant tables beneath warm string lights at night";

const PREMIUM_IMAGE_SRC =
  "https://images.pexels.com/photos/17641795/pexels-photo-17641795.jpeg?auto=compress&cs=tinysrgb&w=900";
const PREMIUM_IMAGE_ALT = "A guest posing inside a curtained photo booth";

const ROAMING_IMAGE_SRC =
  "https://images.pexels.com/photos/6224736/pexels-photo-6224736.jpeg?auto=compress&cs=tinysrgb&w=900";
const ROAMING_IMAGE_ALT = "Two friends laughing at a party in front of a golden backdrop";

const VIDEO360_IMAGE_SRC =
  "https://images.pexels.com/photos/38661371/pexels-photo-38661371.jpeg?auto=compress&cs=tinysrgb&w=900";
const VIDEO360_IMAGE_ALT = "Guests celebrating on a dance floor beneath festival lights";

const CTA_IMAGE_SRC =
  "https://images.pexels.com/photos/29851245/pexels-photo-29851245.jpeg?auto=compress&cs=tinysrgb&w=1600";
const CTA_IMAGE_ALT = "A wedding party celebrating under outdoor string lights at night";

const SERVICE_AREA_STATEMENT = "Based in Melbourne, serving surrounding regions.";

const SERVICES = [
  {
    id: "premium-photobooth",
    name: "Premium Photobooth",
    badge: "Most booked",
    icon: "camera" as const,
    tagline: "The centrepiece of the room.",
    summary:
      "An open-air, studio-lit booth that turns any corner of your venue into a photo studio. Professional lighting, a custom print template and a friendly attendant keep the line moving all night.",
    highlights: [
      "Open-air, studio-lit setup",
      "Unlimited sessions while you hire",
      "Custom-branded prints in seconds",
    ],
  },
  {
    id: "roaming-photobooth",
    name: "Roaming Photobooth",
    badge: "Fan favourite",
    icon: "users" as const,
    tagline: "The booth that mingles.",
    summary:
      "A portable booth that moves through the crowd, capturing candid moments wherever your guests are. Perfect for cocktail hours and venues with more than one room.",
    highlights: [
      "Moves through the crowd",
      "No fixed backdrop or floor space needed",
      "Candid, in-the-moment photography",
    ],
  },
  {
    id: "360-video-booth",
    name: "360 Video Booth",
    icon: "video" as const,
    tagline: "The shot everyone shares.",
    summary:
      "A 360° slow-motion platform experience. Guests strike a pose, the camera sweeps around them, and a share-ready clip lands on their phone by QR before they sit back down.",
    highlights: [
      "360° slow-motion clips",
      "Instant QR download, no app required",
      "Share-ready in seconds",
    ],
  },
];

const PACKAGES = [
  {
    id: "starter",
    name: "The Two Hour",
    summary:
      "A tight, high-impact hire for intimate celebrations, cocktail hours and mid-week events. Full styling included, no corners cut.",
    durationLabel: "2 hours",
    priceLabel: "$350 total",
    inclusions: [
      "Full photobooth service",
      "Studio-quality lighting and styling",
      "Custom-branded print template",
      "HD printing, unlimited sessions",
      "QR code digital downloads",
      "Red carpet and golden bollard entrance",
      "Free use of props",
    ],
  },
  {
    id: "standard",
    name: "The Three Hour",
    badge: "Most popular",
    summary:
      "Our most-booked balance of time and value: room for group shots, guest sessions and prints for everyone, without rushing the room.",
    durationLabel: "3 hours",
    priceLabel: "$450 total",
    inclusions: [
      "Everything in The Two Hour",
      "Custom-branded print template",
      "HD printing, unlimited sessions",
      "QR code digital downloads",
      "Friendly on-site attendant",
      "Free use of props",
      "Full setup and pack-down",
    ],
  },
  {
    id: "premium",
    name: "The Four Hour",
    badge: "Best value",
    summary:
      "Maximum coverage for big nights: extended hire plus priority setup and pack-down, and the option to add the 360 Video Booth for the full floor-filler.",
    durationLabel: "4 hours",
    priceLabel: "$600 total",
    inclusions: [
      "Everything in The Three Hour",
      "Priority setup and pack-down",
      "Extended guest session coverage",
      "360 Video Booth add-on available",
      "Custom backdrop styling",
      "Digital guestbook option",
    ],
  },
];

const ADD_ONS = [
  {
    id: "professional-photography",
    name: "Professional Photography",
    detail: "Add a dedicated photographer to capture the event alongside the booth.",
  },
  {
    id: "extended-hire",
    name: "Extended Hire",
    detail: "$150 per hour to keep the booth running longer on the night.",
  },
  {
    id: "custom-backdrop",
    name: "Custom Backdrop",
    detail: "A backdrop designed to match your theme, colours or branding.",
  },
  {
    id: "digital-guestbook",
    name: "Digital Guestbook",
    detail: "Collect guest photos and messages in one shareable album after the event.",
  },
];

const FAQS = [
  {
    id: "how-far-in-advance",
    question: "How far in advance should I book?",
    answer:
      "We recommend booking four to six weeks ahead, especially through summer wedding season and end-of-year celebrations. Popular Saturdays fill quickly. If your date is close, reach out anyway and we'll confirm availability straight away.",
  },
  {
    id: "how-much",
    question: "How much does photobooth hire cost?",
    answer:
      "Hire starts at $350 for two hours, $450 for three hours and $600 for four hours. Extended hire is $150 per hour. Every package includes styling, HD printing, QR downloads, props and full setup and pack-down, so there are no surprise extras.",
  },
  {
    id: "whats-included",
    question: "What's included in every hire?",
    answer:
      "Every booking includes the full photobooth service, studio-quality lighting and styling, a custom-branded print template, HD printing with unlimited sessions, QR code digital downloads, free use of props, and setup and pack-down by our team.",
  },
  {
    id: "what-is-360",
    question: "What is the 360 Video Booth and how does it work?",
    answer:
      "The 360 Video Booth films slow-motion video from every angle. Guests step onto the platform, the camera sweeps around them, and a share-ready clip is delivered by instant QR download, with no app and no waiting.",
  },
  {
    id: "do-you-travel",
    question: "Do you travel outside Melbourne?",
    answer:
      "Yes. We're based in Melbourne and regularly travel to surrounding regions. A transport fee may apply depending on your venue's location, and it's always confirmed in your quote before you commit.",
  },
  {
    id: "setup-time",
    question: "How long does setup take?",
    answer:
      "We arrive early and set up quietly before your guests arrive, then pack down after the hire ends. Premium hires include priority setup and pack-down so the newest addition to your run sheet is always covered.",
  },
  {
    id: "space-required",
    question: "How much space does the booth need?",
    answer:
      "A standard open-air setup needs roughly three by three metres with access to a power point. If space is tight, the roaming booth needs even less, and we'll advise on the best placement from your venue's floor plan.",
  },
  {
    id: "deposit-cancellation",
    question: "What is your deposit and cancellation policy?",
    answer:
      "A 20% deposit confirms your date, with the balance due on the day. Deposits are non-refundable, and rescheduling is available with reasonable notice, subject to availability.",
  },
  {
    id: "add-photography",
    question: "Can I add professional photography to my booking?",
    answer:
      "Yes. Professional photography is available as an add-on alongside extended hire, custom backdrops and a digital guestbook. Mention it in your enquiry and we'll put together a package that fits.",
  },
];

const TESTIMONIALS = [
  {
    id: "testimonial-1",
    quote:
      "The booth was the heart of the night. Guests queued for it and walked away with prints in hand. The setup was completely seamless.",
    name: "Mia & Jordan",
    eventType: "Wedding",
    rating: 5,
  },
  {
    id: "testimonial-2",
    quote:
      "Our team still talks about the 360 clips. It turned a corporate night into something people actually remember.",
    name: "Priya S.",
    eventType: "Corporate event",
    rating: 5,
  },
  {
    id: "testimonial-3",
    quote:
      "Setup was quick and the prints looked incredible. The birthday kids would not leave the booth, and neither did the adults.",
    name: "Tara N.",
    eventType: "Birthday",
    rating: 5,
  },
  {
    id: "testimonial-4",
    quote:
      "From the first email to pack-down, everything was handled. We did not think about the booth once. It just worked.",
    name: "Daniel R.",
    eventType: "Corporate event",
    rating: 5,
  },
  {
    id: "testimonial-5",
    quote:
      "The backdrop matched our styling perfectly and the prints became the favour everyone took home. Beautifully done.",
    name: "Elena & Chris",
    eventType: "Engagement party",
    rating: 5,
  },
  {
    id: "testimonial-6",
    quote:
      "Our school formal needed something the students would actually use, and this was it. The queue never stopped.",
    name: "Rebecca M.",
    eventType: "School formal",
    rating: 5,
  },
];

const GALLERY = [
  {
    id: "gallery-1",
    src: "https://images.pexels.com/photos/34458014/pexels-photo-34458014.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Wedding guests raising a toast on the dance floor",
    caption: "Wedding reception",
  },
  {
    id: "gallery-2",
    src: "https://images.pexels.com/photos/17641795/pexels-photo-17641795.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "A guest posing inside a curtained photo booth",
    caption: "Booth sessions",
  },
  {
    id: "gallery-3",
    src: "https://images.pexels.com/photos/32333372/pexels-photo-32333372.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Friends celebrating a birthday in a shower of confetti",
    caption: "Birthday party",
  },
  {
    id: "gallery-4",
    src: "https://images.pexels.com/photos/6224736/pexels-photo-6224736.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Two friends laughing together in front of a golden backdrop",
    caption: "Golden hour backdrop",
  },
  {
    id: "gallery-5",
    src: "https://images.pexels.com/photos/38661371/pexels-photo-38661371.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Guests celebrating on a dance floor beneath festival lights",
    caption: "360 Video Booth",
  },
  {
    id: "gallery-6",
    src: "https://images.pexels.com/photos/7638133/pexels-photo-7638133.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Friends laughing and dancing together at a celebration",
    caption: "Room full of laughter",
  },
  {
    id: "gallery-7",
    src: "https://images.pexels.com/photos/29851245/pexels-photo-29851245.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "A wedding party celebrating under outdoor string lights at night",
    caption: "Outdoor celebrations",
  },
  {
    id: "gallery-8",
    src: "https://images.pexels.com/photos/30562607/pexels-photo-30562607.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "An event set with elegant tables beneath warm string lights at night",
    caption: "Styled venues",
  },
];

export const cmsSeed: CmsContent = {
  home: {
    hero: {
      eyebrow: "Melbourne photobooth hire for every event",
      headline: "Turn the room into a studio.",
      supporting:
        "Open-air booths, roaming setups and 360 video for weddings, birthdays and corporate events, with prints guests keep and QR downloads in seconds.",
      primaryLabel: "Enquire now",
      secondaryLabel: "View packages",
      backgroundSrc: HERO_IMAGE_SRC,
      backgroundAlt: HERO_IMAGE_ALT,
      stats: [
        { value: "3", label: "booth experiences", icon: "camera" },
        { value: "4 hrs", label: "longest hire window", icon: "clock" },
        { value: "HD", label: "prints and QR downloads", icon: "qrcode" },
      ],
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
        {
          title: "One local Melbourne team",
          detail: "From enquiry to pack-down, same people.",
        },
      ],
      aboutLabel: "More about us",
    },
    servicesSection: {
      heading: {
        eyebrow: "The booths",
        title: "Three ways to bring the room into the frame",
        lede: "Every hire includes HD prints, QR downloads and full setup and pack-down by our team.",
      },
      cardCtaLabel: "Explore the booths",
    },
    showcase: {
      heading: {
        eyebrow: "Styled moments",
        title: "The kind of night we stage",
        lede: "Backdrops, lighting and props chosen to match the room, not a default kit.",
      },
      galleryLabel: "View gallery",
      images: [
        {
          src: "https://images.pexels.com/photos/34458014/pexels-photo-34458014.jpeg?auto=compress&cs=tinysrgb&w=900",
          alt: "Wedding guests raising a toast on the dance floor",
          caption: "A wedding toast mid-dance",
        },
        {
          src: "https://images.pexels.com/photos/32333372/pexels-photo-32333372.jpeg?auto=compress&cs=tinysrgb&w=900",
          alt: "Friends celebrating a birthday in a shower of confetti",
          caption: "Confetti after the candles",
        },
        {
          src: "https://images.pexels.com/photos/7638133/pexels-photo-7638133.jpeg?auto=compress&cs=tinysrgb&w=900",
          alt: "Friends laughing and dancing together at a celebration",
          caption: "Laughter at a private party",
        },
      ],
    },
    packagesSection: {
      heading: {
        eyebrow: "Packages",
        title: "All-inclusive hire, priced up front",
        lede: "No hidden extras: every inclusion is listed. Final pricing is confirmed at enquiry.",
      },
      compareLabel: "Compare all packages",
    },
    processSection: {
      heading: {
        eyebrow: "How it works",
        title: "From first enquiry to the first flash",
        lede: "Three steps between you and a room full of prints.",
      },
      steps: [
        {
          id: "enquire",
          icon: "message",
          title: "Enquire",
          summary:
            "Reach out with your date and venue. We confirm availability and recommend the booth that suits your event, in plain language and usually within one business day.",
        },
        {
          id: "design",
          icon: "palette",
          title: "Design",
          summary:
            "Choose your backdrop, print template and props. We prepare a branded experience that matches your theme, with everything confirmed in writing before the day.",
        },
        {
          id: "celebrate",
          icon: "sparkles",
          title: "Celebrate",
          summary:
            "We arrive early, set up quietly and run the booth all night. Guests leave with prints in hand and QR downloads already on their phones.",
        },
      ],
    },
    reviewsSection: {
      heading: {
        eyebrow: "Reviews",
        title: "What hosts and guests say",
        lede: "A few words from recent weddings, birthdays and corporate nights.",
      },
      testimonials: TESTIMONIALS,
    },
    faqSection: {
      heading: {
        eyebrow: "Good to know",
        title: "Answers before you ask",
        lede: "Quick answers to the questions we hear most.",
      },
      readAllLabel: "Read all FAQs",
    },
    eventTypesSection: {
      heading: {
        eyebrow: "Perfect for",
        title: "Every occasion, one booth",
        lede: "Weddings, birthdays, corporate nights and everything in between.",
      },
      eventTypes: [
        "Weddings",
        "Birthdays",
        "Corporate Events",
        "School Formals",
        "Engagement Parties",
        "Christmas Parties",
        "Milestone Anniversaries",
        "Product Launches",
      ],
    },
    ctaBand: {
      eyebrow: "Ready when you are",
      headline: "Ready to book your night?",
      lede: "Tell us your date and venue, and we'll recommend the booth that fits your event, usually within one business day.",
      primaryLabel: "Enquire now",
      secondaryLabel: "View packages",
      imageSrc: CTA_IMAGE_SRC,
      imageAlt: CTA_IMAGE_ALT,
    },
    seo: {
      seoTitle: "Photobooth Hire Melbourne | Melbourne Photobooth Hire",
      seoDescription:
        "Photobooth hire in Melbourne for weddings, birthdays, corporate and school events. Open-air, roaming and 360 booths with HD prints and instant QR downloads.",
      ogImage: HERO_IMAGE_SRC,
    },
  },
  services: {
    header: {
      title: "Photobooth experiences",
      eyebrow: "Our booths",
      lede: "Three ways to put a photo studio in the middle of your event, each styled, staffed and built to keep the line moving.",
      imageSrc: PREMIUM_IMAGE_SRC,
      imageAlt: PREMIUM_IMAGE_ALT,
    },
    services: SERVICES,
    ctaBand: {
      eyebrow: "Not sure which booth?",
      headline: "Tell us about the event.",
      lede: "Share your date, venue and guest numbers and we'll recommend the setup that fits best.",
      primaryLabel: "Start an enquiry",
      secondaryLabel: "Compare packages",
      imageSrc: CTA_IMAGE_SRC,
      imageAlt: CTA_IMAGE_ALT,
    },
    seo: {
      seoTitle: "Photobooth Hire Services Melbourne | Premium, Roaming & 360",
      seoDescription:
        "Compare Melbourne photobooth hire services: open-air, roaming and 360 video booths for weddings, birthdays and corporate events, each styled and staffed.",
      ogImage: HERO_IMAGE_SRC,
    },
  },
  packages: {
    header: {
      title: "Packages",
      eyebrow: "Simple, all-inclusive hire",
      lede: "Every booking comes dressed to impress, with red carpet and golden bollard entrance setup included as standard, with full setup and pack-down by our team.",
      imageSrc: PREMIUM_IMAGE_SRC,
      imageAlt: PREMIUM_IMAGE_ALT,
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
    packages: PACKAGES,
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
    addOns: ADD_ONS,
    policies: {
      eyebrow: "Good to know",
      heading: "Booking policies",
      lede: "The essentials, in plain language, so there are no surprises on the night.",
    },
    bookingPolicies: [
      "A 20% deposit confirms your date, with the balance due on the day of the event.",
      "Deposits are non-refundable; rescheduling is available with reasonable notice.",
      "Every event is different, and packages can be tailored to suit your venue and guest numbers.",
      "Travel beyond the Melbourne metro area may attract a transport fee, confirmed in your quote.",
    ],
    ctaBand: {
      eyebrow: "Ready when you are",
      headline: "Let's lock in your date.",
      lede: "Send your event details and we'll confirm availability and the package that fits.",
      primaryLabel: "Enquire now",
      secondaryLabel: "Explore the booths",
      imageSrc: CTA_IMAGE_SRC,
      imageAlt: CTA_IMAGE_ALT,
    },
    seo: {
      seoTitle: "Photobooth Hire Packages Melbourne | Prices & Inclusions",
      seoDescription:
        "Compare photobooth hire packages in Melbourne: 2, 3 and 4 hour options with full inclusions, add-ons and booking policies. Enquire for a clear quote.",
      ogImage: HERO_IMAGE_SRC,
    },
  },
  gallery: {
    header: {
      title: "Gallery",
      eyebrow: "Real event moments",
      lede: "A look at the booths, backdrops and moments we stage across Melbourne.",
      imageSrc: VIDEO360_IMAGE_SRC,
      imageAlt: VIDEO360_IMAGE_ALT,
    },
    emptyState: {
      title: "No images are available yet.",
      body: "Once approved event photos are ready, this gallery will showcase real moments from the booth.",
      actionLabel: "Enquire now",
    },
    gallery: GALLERY,
    ctaBand: {
      eyebrow: "Your night next",
      headline: "Want your event to look like this?",
      lede: "Tell us the date, venue and the mood you're going for and we'll take it from there.",
      primaryLabel: "Enquire now",
      secondaryLabel: "View packages",
      imageSrc: CTA_IMAGE_SRC,
      imageAlt: CTA_IMAGE_ALT,
    },
    seo: {
      seoTitle: "Photobooth Gallery Melbourne | Weddings, Parties & Events",
      seoDescription:
        "See the booths, backdrops and moments Melbourne Photobooth Hire stages at weddings, birthdays, corporate events and school formals.",
      ogImage: HERO_IMAGE_SRC,
    },
  },
  about: {
    header: {
      title: "Built for Melbourne's best nights.",
      eyebrow: "Our story",
      lede: "We design, style and run photobooth experiences that keep a room buzzing, and send everyone home with something worth keeping.",
      imageSrc: ROAMING_IMAGE_SRC,
      imageAlt: ROAMING_IMAGE_ALT,
    },
    storyEyebrow: "The business",
    storyHeading: "Photobooths for people who care how the night feels.",
    about: {
      eyebrow: "Our story",
      headline: "Built for Melbourne's best nights.",
      lede: "We design, style and run photobooth experiences that keep a room buzzing, and send everyone home with something worth keeping.",
      story: [
        "Melbourne Photobooth Hire exists for one reason: the moment a guest steps up to the booth, drops their guard and laughs. That frame is the one people remember long after the speeches are over.",
        "We're a local Melbourne team, which means we know the venues, the run sheets and the reality of a city that can turn on four seasons in an afternoon. We build setups that look deliberate in a ballroom, a warehouse, a backyard marquee or a boardroom, and we handle the styling, the lighting and the prints so hosts can stay in the moment.",
        "Every hire is designed around the event: the backdrop, the print template, the props and the pacing. Nothing is one-size-fits-all, and nothing is left to the night itself.",
      ],
      values: [
        {
          id: "craft",
          title: "Styled, not assembled",
          detail:
            "Lighting, backdrop and print template are chosen for your event, not pulled from a default kit.",
        },
        {
          id: "reliability",
          title: "Early, quiet, ready",
          detail:
            "We arrive ahead of schedule, set up discreetly and are running before your first guest walks in.",
        },
        {
          id: "hospitality",
          title: "Attendants who host",
          detail:
            "Our team keeps the queue moving, invites the shy guests in and makes sure nobody misses out.",
        },
      ],
      stats: [
        { value: "3", label: "booth experiences" },
        { value: "4 hrs", label: "longest hire window" },
        { value: "HD", label: "prints and QR downloads" },
        { value: "1 day", label: "typical reply time" },
      ],
    },
    valuesHeading: {
      eyebrow: "How we work",
      title: "Three things we never treat as optional",
      lede: "The standards behind every booking, no matter the size of the event.",
    },
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
      imageSrc: CTA_IMAGE_SRC,
      imageAlt: CTA_IMAGE_ALT,
    },
    seo: {
      seoTitle: "About Us | Melbourne Photobooth Hire",
      seoDescription:
        "Meet Melbourne Photobooth Hire, a local Melbourne team styling and running photobooth experiences for weddings, birthdays and corporate events.",
      ogImage: HERO_IMAGE_SRC,
    },
  },
  faq: {
    header: {
      title: "Frequently asked questions",
      eyebrow: "Good to know",
      lede: "Everything hosts usually ask before booking. If your question isn't here, we're one message away.",
      imageSrc: CTA_IMAGE_SRC,
      imageAlt: CTA_IMAGE_ALT,
    },
    searchPlaceholder: "Search questions",
    emptyCopy: "No questions match your search. Try a different word, or ask us directly.",
    support: {
      heading: "Still have a question?",
      body: "Send it through with your event details and we'll reply, usually within one business day.",
      label: "Ask a question",
    },
    faqs: FAQS,
    ctaBand: {
      eyebrow: "Ready when you are",
      headline: "Questions answered? Let's talk dates.",
      lede: "Send your event details and we'll confirm availability and the right booth for the night.",
      primaryLabel: "Enquire now",
      secondaryLabel: "View packages",
      imageSrc: CTA_IMAGE_SRC,
      imageAlt: CTA_IMAGE_ALT,
    },
    seo: {
      seoTitle: "Photobooth Hire FAQs Melbourne | Pricing, Setup & Policies",
      seoDescription:
        "Answers to common Melbourne photobooth hire questions: pricing, what's included, travel, setup time, space requirements and booking policies.",
      ogImage: HERO_IMAGE_SRC,
    },
  },
  contact: {
    header: {
      title: "Make an enquiry",
      eyebrow: "Let's plan your night",
      lede: "Tell us about your event and we'll confirm availability, recommend the right booth and put together a clear quote.",
      imageSrc: ROAMING_IMAGE_SRC,
      imageAlt: ROAMING_IMAGE_ALT,
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
      ogImage: HERO_IMAGE_SRC,
    },
  },
  settings: {
    brandName: "Melbourne Photobooth Hire",
    serviceAreaStatement: SERVICE_AREA_STATEMENT,
    reviewUrl: "",
    messengerUrl: "https://m.me/",
    socials: [],
    footerCta: {
      title: "Ready when you are",
      lede: "Tell us your date and we'll recommend the right booth for your event.",
      label: "Enquire now",
    },
    sharedImages: {
      premium: { src: PREMIUM_IMAGE_SRC, alt: PREMIUM_IMAGE_ALT },
      roaming: { src: ROAMING_IMAGE_SRC, alt: ROAMING_IMAGE_ALT },
      video360: { src: VIDEO360_IMAGE_SRC, alt: VIDEO360_IMAGE_ALT },
      cta: { src: CTA_IMAGE_SRC, alt: CTA_IMAGE_ALT },
    },
  },
};
