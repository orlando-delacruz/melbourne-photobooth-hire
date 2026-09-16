import type { SiteContent } from "./types";

/**
 * PLACEHOLDER CONTENT: complete-feeling development content through the
 * `getContent()` seam. Values are CMS-editable and are NOT confirmed
 * production facts: pricing, policies, imagery and quotes are provisioned so
 * every page renders at full fidelity and are replaced by client-approved
 * content once the CMS is wired. Never carried over from Shot&Prints:
 * brand, contacts, ABN, socials, ratings, established dates, insurance.
 * Stock imagery is hotlinked from Pexels and centralised here so the
 * vendor-local swap is a one-file change.
 */
export const mockContent: SiteContent = {
  services: [
    {
      id: "premium-photobooth",
      name: "Premium Photobooth",
      badge: "Most booked",
      icon: "camera",
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
      icon: "users",
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
      icon: "video",
      tagline: "The shot everyone shares.",
      summary:
        "A 360° slow-motion platform experience. Guests strike a pose, the camera sweeps around them, and a share-ready clip lands on their phone by QR before they sit back down.",
      highlights: [
        "360° slow-motion clips",
        "Instant QR download, no app required",
        "Share-ready in seconds",
      ],
    },
  ],
  packages: [
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
  ],
  addOns: [
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
  ],
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
  processSteps: [
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
  testimonials: [
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
  ],
  bookingPolicies: [
    "A 20% deposit confirms your date, with the balance due on the day of the event.",
    "Deposits are non-refundable; rescheduling is available with reasonable notice.",
    "Every event is different, and packages can be tailored to suit your venue and guest numbers.",
    "Travel beyond the Melbourne metro area may attract a transport fee, confirmed in your quote.",
  ],
  gallery: [
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
  ],
  faqs: [
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
  ],
  site: {
    brandName: "Melbourne Photobooth Hire",
    heroHeadline: "Capture every moment.",
    heroSupporting:
      "Melbourne's photobooth hire for weddings, birthdays and corporate events, with custom prints and instant QR downloads.",
    serviceAreaStatement: "Based in Melbourne, serving surrounding regions.",
    reviewUrl: null,
  },
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

  // ── Homepage provisional content ──────────────────────────────────────
  heroBackgroundImage: {
    src: "https://images.pexels.com/photos/30562607/pexels-photo-30562607.jpeg?auto=compress&cs=tinysrgb&w=1920",
    alt: "An outdoor event set with elegant tables beneath warm string lights at night",
  },
  heroStats: [
    { value: "3", label: "booth experiences", icon: "camera" },
    { value: "4 hrs", label: "longest hire window", icon: "clock" },
    { value: "HD", label: "prints and QR downloads", icon: "qrcode" },
  ],
  serviceImages: {
    "premium-photobooth": {
      src: "https://images.pexels.com/photos/17641795/pexels-photo-17641795.jpeg?auto=compress&cs=tinysrgb&w=900",
      alt: "A guest posing inside a curtained photo booth",
    },
    "roaming-photobooth": {
      src: "https://images.pexels.com/photos/6224736/pexels-photo-6224736.jpeg?auto=compress&cs=tinysrgb&w=900",
      alt: "Two friends laughing at a party in front of a golden backdrop",
    },
    "360-video-booth": {
      src: "https://images.pexels.com/photos/38661371/pexels-photo-38661371.jpeg?auto=compress&cs=tinysrgb&w=900",
      alt: "Guests celebrating on a dance floor beneath festival lights",
    },
  },
  showcaseImages: [
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
  ctaImage: {
    src: "https://images.pexels.com/photos/29851245/pexels-photo-29851245.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "A wedding party celebrating under outdoor string lights at night",
  },
};
