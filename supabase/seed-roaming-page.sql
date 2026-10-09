-- Roaming Photobooth page content seeder (DEC-058 follow-up).
--
-- Furnishes the CMS-owned roaming page (page_contents 'roaming' +
-- page_seo 'roaming') so /roaming-photobooth-melbourne renders full copy.
-- Every line is derived from already-confirmed content: the live Services
-- module roaming row (summary/highlights/image), the setup and travel FAQ
-- answers, the homepage process/enquiry wording, the services CTA band,
-- and site-wide occasion/service-area statements. No new prices, policies,
-- claims, or timings are introduced.
--
-- Deliberately left blank (client to confirm in /admin/roaming-page):
--   * priceLabel / priceNote / pricingPoints — no booth-specific roaming
--     price is confirmed (packages are duration-based and booth-agnostic).
--     The public pricing panel omits itself while the price is blank and
--     the packages CTA remains, so nothing misleading is published.
--
-- How to run: Supabase SQL editor, AFTER supabase/migration-booth-pages.sql
-- (the 'roaming' key must pass the page_key checks). Idempotent and
-- non-destructive: `on conflict do nothing` inserts only when the row is
-- absent and never overwrites admin edits. To re-seed, delete the row first:
--   delete from public.page_contents where page_key = 'roaming';
--   delete from public.page_seo where page_key = 'roaming';
-- then re-run this file. Verify with:
--   select page_key, char_length(content::text) from public.page_contents where page_key = 'roaming';
--   select page_key, seo_title from public.page_seo where page_key = 'roaming';

insert into public.page_contents (page_key, content) values (
'roaming',
'{
  "header": {
    "title": "Roaming Photobooth hire in Melbourne",
    "eyebrow": "Roaming Photobooth",
    "lede": "A portable booth that moves through the crowd, capturing candid moments wherever your guests are. Perfect for cocktail hours and venues with more than one room.",
    "image": {
      "key": null,
      "src": "https://images.pexels.com/photos/6224736/pexels-photo-6224736.jpeg?auto=compress&cs=tinysrgb&w=900",
      "alt": "Two friends laughing together in front of a golden backdrop"
    }
  },
  "stepsHeading": {
    "eyebrow": "How it works",
    "title": "How your hire runs",
    "lede": "Here is how the roaming experience runs on the night."
  },
  "steps": [
    {
      "id": "step-mingle",
      "title": "Meet the booth anywhere",
      "summary": "A portable booth moves through the crowd, capturing candid moments wherever your guests are.",
      "icon": "users"
    },
    {
      "id": "step-candid",
      "title": "No backdrop, no staged setup",
      "summary": "Candid, in-the-moment photography with no fixed backdrop or floor space needed.",
      "icon": "sparkles"
    },
    {
      "id": "step-follow",
      "title": "Built for cocktail hours",
      "summary": "Perfect for cocktail hours and venues with more than one room, with the booth moving through the crowd.",
      "icon": "camera"
    }
  ],
  "pricingHeading": {
    "eyebrow": "Pricing",
    "title": "Roaming photobooth pricing",
    "lede": "The current confirmed rate for roaming hire."
  },
  "priceLabel": "",
  "priceNote": "",
  "pricingPoints": [],
  "bestForHeading": {
    "eyebrow": "Good fit",
    "title": "Made for your event",
    "lede": "Three occasions the roaming booth suits best."
  },
  "bestFor": [
    {
      "id": "weddings",
      "title": "Weddings",
      "detail": "Candid moments wherever your wedding guests are — perfect for cocktail hours."
    },
    {
      "id": "corporate",
      "title": "Corporate events",
      "detail": "The booth moves through the crowd at corporate events, capturing candid moments across venues with more than one room."
    },
    {
      "id": "birthdays",
      "title": "Birthdays and parties",
      "detail": "Fun props and in-the-moment photography for birthday crowds, with no fixed backdrop."
    }
  ],
  "venueHeading": {
    "eyebrow": "On the night",
    "title": "Setup and travel, handled",
    "lede": "What happens before your guests arrive."
  },
  "venueNotes": [
    "We arrive early and set up quietly before your guests arrive, then pack down after the night.",
    "No fixed backdrop or floor space needed — ideal for venues with more than one room.",
    "We are based in Melbourne and regularly travel to surrounding regions; any transport fee is confirmed in your quote before you commit."
  ],
  "faqHeading": {
    "eyebrow": "Good to know",
    "title": "Roaming questions, answered",
    "lede": "Quick answers about the roaming booth."
  },
  "faqCtaLabel": "Read all FAQs",
  "ctaBand": {
    "eyebrow": "Not sure which booth?",
    "headline": "Tell us about the event.",
    "lede": "Share your date, venue and guest numbers and we will recommend the setup that fits best.",
    "primaryLabel": "Start an enquiry",
    "secondaryLabel": "Compare packages",
    "image": {
      "key": null,
      "src": "https://images.pexels.com/photos/6224736/pexels-photo-6224736.jpeg?auto=compress&cs=tinysrgb&w=900",
      "alt": "Two friends laughing together in front of a golden backdrop"
    }
  },
  "seo": {
    "seoTitle": "Roaming Photobooth Melbourne | Mingling Booth Hire for Events",
    "seoDescription": "Hire a roaming photobooth in Melbourne for weddings, corporate events and birthdays: candid crowd photos with no fixed backdrop, perfect for cocktail hours.",
    "ogImage": {
      "key": null,
      "src": "https://images.pexels.com/photos/6224736/pexels-photo-6224736.jpeg?auto=compress&cs=tinysrgb&w=900",
      "alt": "Two friends laughing together in front of a golden backdrop"
    },
    "keywords": "roaming photobooth melbourne, mingling photobooth, cocktail hour photo booth",
    "canonicalUrl": "",
    "ogTitle": "Roaming Photobooth — Candid Crowd Photos, No Backdrop Needed",
    "ogDescription": "The mingling booth moves through your crowd for candid photos. Perfect for cocktail hours and corporate mixers.",
    "noindex": false,
    "nofollow": false
  }
}'::jsonb
)
on conflict (page_key) do nothing;

insert into public.page_seo
  (page_key, seo_title, seo_description, keywords, canonical_url,
   og_title, og_description, og_image_key, og_image_src, og_image_alt,
   noindex, nofollow)
values (
  'roaming',
  'Roaming Photobooth Melbourne | Mingling Booth Hire for Events',
  'Hire a roaming photobooth in Melbourne for weddings, corporate events and birthdays: candid crowd photos with no fixed backdrop, perfect for cocktail hours. Enquire for a clear quote.',
  'roaming photobooth melbourne, mingling photobooth, cocktail hour photo booth', '', 'Roaming Photobooth — Candid Crowd Photos, No Backdrop Needed', 'The mingling booth moves through your crowd for candid photos. Perfect for cocktail hours and corporate mixers.',
  null,
  'https://images.pexels.com/photos/6224736/pexels-photo-6224736.jpeg?auto=compress&cs=tinysrgb&w=900',
  'Two friends laughing together in front of a golden backdrop',
  false, false
)
on conflict (page_key) do nothing;
