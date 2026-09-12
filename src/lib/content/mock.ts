import type { SiteContent } from "./types";

/**
 * Mock adapter: scaffolding only, never business fact.
 * Every value is a recognizable placeholder pending client confirmation.
 * In particular this file contains no pricing, inclusions, policies,
 * descriptions, imagery, or FAQs carried over from any reference material.
 */
export const mockContent: SiteContent = {
  services: [
    {
      id: "service-1",
      name: "[Placeholder service 1 — pending confirmation]",
      summary: "[Placeholder summary — pending client confirmation.]",
    },
    {
      id: "service-2",
      name: "[Placeholder service 2 — pending confirmation]",
      summary: "[Placeholder summary — pending client confirmation.]",
    },
    {
      id: "service-3",
      name: "[Placeholder service 3 — pending confirmation]",
      summary: "[Placeholder summary — pending client confirmation.]",
    },
  ],
  packages: [
    {
      id: "package-1",
      name: "[Placeholder package 1 — pending confirmation]",
      summary: "[Placeholder summary — pending client confirmation.]",
      durationLabel: "[Duration TBC]",
      priceLabel: "[Price TBC]",
      inclusions: ["[Placeholder inclusion — pending confirmation]"],
    },
  ],
  // No placeholder images: the gallery renders its empty state until the
  // client approves real event imagery (REQ-GAL-001, REQ-GAL-005).
  gallery: [],
  // No placeholder Q&A: the FAQ page renders its pending state until the
  // client confirms real questions and answers (REQ-FAQ-003).
  faqs: [],
  site: {
    brandName: "Melbourne Photobooth Hire",
    serviceAreaStatement: "[Service-area statement — pending client confirmation.]",
    reviewUrl: null,
  },
};
