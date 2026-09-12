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
      summary:
        "Our signature open-air setup combines studio-quality lighting with an open, social experience. Guests can see the magic happening — perfect for weddings, corporate events, and milestone birthdays. Optionally pair it with our 360 Video Booth for a truly unforgettable night.",
    },
    {
      id: "roaming-photobooth",
      name: "Roaming Photobooth",
      badge: "Fan Favourite",
      summary:
        "We bring the booth to your guests. Our roaming setup mingles through the crowd, capturing candid, unforgettable moments anywhere in the venue — no backdrop needed, just pure energy.",
    },
    {
      id: "360-video-booth",
      name: "360 Video Booth",
      summary:
        "A 360-degree video experience that captures your event from every angle. Guests step in, strike a pose, and walk away with share-ready slow-motion clips via instant QR download.",
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
  testimonials: [
    {
      id: "sarah-wedding",
      quote:
        "The photobooth was the absolute highlight of our wedding reception. Guests are still talking about it weeks later. Everything from booking to pack-down was seamless.",
      name: "Sarah M.",
      eventType: "Wedding",
    },
    {
      id: "james-birthday",
      quote:
        "Booked the roaming booth for my 30th birthday and it was the best decision. Everyone got involved, the prints were gorgeous, and the attendant was so fun and professional.",
      name: "James T.",
      eventType: "Birthday Party",
    },
    {
      id: "amanda-corporate",
      quote:
        "The booth at our end-of-year corporate event was a massive hit. The QR download feature meant everyone had their photos instantly. Highly recommend!",
      name: "Amanda K.",
      eventType: "Corporate Event",
    },
    {
      id: "melissa-engagement",
      quote:
        "Excellent service from start to finish. The custom print template matched our theme perfectly and every single guest took home a print. Will absolutely book again.",
      name: "Melissa R.",
      eventType: "Engagement Party",
    },
    {
      id: "daniel-birthday",
      quote:
        "Professional, fun, and so easy to work with. The booth looked amazing in our venue and the photo quality was incredible. Our guests absolutely loved it.",
      name: "Daniel C.",
      eventType: "Birthday Party",
    },
  ],
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
};
