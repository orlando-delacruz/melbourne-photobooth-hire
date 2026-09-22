// Provisional-content flags for the CMS dashboard.
//
// These notes describe seed values that mirror the public site's explicitly
// provisional content: not confirmed production facts. They live in the UI
// layer (not the data model) and are replaced by real confirmation status
// once the client approves each area.

import type { CmsSectionKey } from "./types";

export const PROVISIONAL_NOTES: Record<CmsSectionKey, string[]> = {
  home: [
    "Showcase and review content mirrors the provisional public content.",
    "Hero and section imagery is stock photography, not client photos.",
  ],
  services: ["Service descriptions mirror the provisional public content."],
  packages: [
    "Package prices ($350, $450, $600) are provisional and need client confirmation.",
    "Package summaries and add-on pricing are provisional.",
  ],
  gallery: ["All gallery images are stock photography awaiting client-approved photos."],
  about: ["About story, values and stats mirror the provisional public content."],
  faq: ["FAQ answers mirror the provisional public content, including pricing."],
  contact: ["Contact steps and reply-time copy mirror the provisional public content."],
  settings: [
    "No Google review URL yet, so the footer review link stays hidden.",
    "The Messenger link is a placeholder destination.",
    "No social profiles are on the public site yet.",
    "Shared imagery is stock photography.",
  ],
};
