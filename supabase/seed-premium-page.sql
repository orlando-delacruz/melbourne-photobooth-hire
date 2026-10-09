-- Premium Photobooth page content seeder (DEC-058 follow-up).
--
-- Furnishes the CMS-owned premium page (page_contents 'premium' +
-- page_seo 'premium') so /premium-photobooth-melbourne renders full copy.
-- Every line is derived from already-confirmed content: the live Services
-- module premium row (summary/highlights/image), the setup and travel FAQ
-- answers, the homepage process/enquiry wording, the services CTA band,
-- and site-wide occasion/service-area statements. No new prices, policies,
-- claims, or timings are introduced.
--
-- Deliberately left blank (client to confirm in /admin/premium-page):
--   * priceLabel / priceNote / pricingPoints — no booth-specific premium
--     price is confirmed (packages are duration-based and booth-agnostic).
--     The public pricing panel omits itself while the price is blank and
--     the packages CTA remains, so nothing misleading is published.
--
-- How to run: Supabase SQL editor, AFTER supabase/migration-booth-pages.sql
-- (the 'premium' key must pass the page_key checks). Idempotent and
-- non-destructive: `on conflict do nothing` inserts only when the row is
-- absent and never overwrites admin edits. To re-seed, delete the row first:
--   delete from public.page_contents where page_key = 'premium';
--   delete from public.page_seo where page_key = 'premium';
-- then re-run this file. Verify with:
--   select page_key, char_length(content::text) from public.page_contents where page_key = 'premium';
--   select page_key, seo_title from public.page_seo where page_key = 'premium';

insert into public.page_contents (page_key, content) values (
'premium',
'{
  "header": {
    "title": "Premium Photobooth hire in Melbourne",
    "eyebrow": "Premium Photobooth",
    "lede": "An open-air, studio-lit booth that turns any corner of your venue into a photo studio. Professional lighting, a custom print template and a friendly attendant keep the line moving all night.",
    "image": {
      "key": null,
      "src": "https://images.pexels.com/photos/17641795/pexels-photo-17641795.jpeg?auto=compress&cs=tinysrgb&w=900",
      "alt": "A guest posing inside a curtained photo booth"
    }
  },
  "stepsHeading": {
    "eyebrow": "How it works",
    "title": "How your hire runs",
    "lede": "Here is how the premium experience runs on the night."
  },
  "steps": [
    {
      "id": "step-corner",
      "title": "Claim your corner",
      "summary": "The open-air booth sets up in any corner of your venue and turns it into a photo studio.",
      "icon": "camera"
    },
    {
      "id": "step-style",
      "title": "Get styled and lit",
      "summary": "Professional lighting, luxury backdrops and fun props dress the setup while the attendant keeps the line moving.",
      "icon": "sparkles"
    },
    {
      "id": "step-prints",
      "title": "Prints and downloads instantly",
      "summary": "Instant photo printing with unlimited sessions, plus digital sharing for every guest.",
      "icon": "printer"
    }
  ],
  "pricingHeading": {
    "eyebrow": "Pricing",
    "title": "Premium photobooth pricing",
    "lede": "The current confirmed rate for premium hire."
  },
  "priceLabel": "",
  "priceNote": "",
  "pricingPoints": [],
  "bestForHeading": {
    "eyebrow": "Good fit",
    "title": "Made for your event",
    "lede": "Three occasions the premium booth suits best."
  },
  "bestFor": [
    {
      "id": "weddings",
      "title": "Weddings",
      "detail": "Group shots and guest sessions for the wedding party, with studio-quality photos and custom templates."
    },
    {
      "id": "corporate",
      "title": "Corporate events",
      "detail": "Personalised event branding and photo layouts in every session, with a friendly attendant keeping the line moving."
    },
    {
      "id": "birthdays",
      "title": "Birthdays and parties",
      "detail": "Luxury backdrops, fun props and unlimited sessions with prints for everyone."
    }
  ],
  "venueHeading": {
    "eyebrow": "On the night",
    "title": "Setup and travel, handled",
    "lede": "What happens before your guests arrive."
  },
  "venueNotes": [
    "We arrive early and set up quietly before your guests arrive, then pack down after the night.",
    "The open-air setup fits any corner of your venue, dressed with luxury backdrops.",
    "We are based in Melbourne and regularly travel to surrounding regions; any transport fee is confirmed in your quote before you commit."
  ],
  "faqHeading": {
    "eyebrow": "Good to know",
    "title": "Premium questions, answered",
    "lede": "Quick answers about the premium booth."
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
      "src": "https://images.pexels.com/photos/17641795/pexels-photo-17641795.jpeg?auto=compress&cs=tinysrgb&w=900",
      "alt": "A guest posing inside a curtained photo booth"
    }
  },
  "seo": {
    "seoTitle": "Premium Photobooth Melbourne | Open-Air Booth Hire for Events",
    "seoDescription": "Hire a premium open-air photobooth in Melbourne for weddings, corporate events and birthdays: studio lighting, styled setup and instant prints.",
    "ogImage": {
      "key": null,
      "src": "https://images.pexels.com/photos/17641795/pexels-photo-17641795.jpeg?auto=compress&cs=tinysrgb&w=900",
      "alt": "A guest posing inside a curtained photo booth"
    },
    "keywords": "premium photobooth melbourne, open-air photobooth melbourne, open air photo booth hire",
    "canonicalUrl": "",
    "ogTitle": "Premium Open-Air Photobooth — Studio Light, Instant Prints",
    "ogDescription": "A styled studio-lit booth for your venue, with luxury backdrops, custom templates and unlimited instant prints.",
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
  'premium',
  'Premium Photobooth Melbourne | Open-Air Booth Hire for Events',
  'Hire a premium open-air photobooth in Melbourne for weddings, corporate events and birthdays: studio lighting, styled setup and instant prints. Enquire for a clear quote.',
  'premium photobooth melbourne, open-air photobooth melbourne, open air photo booth hire', '', 'Premium Open-Air Photobooth — Studio Light, Instant Prints', 'A styled studio-lit booth for your venue, with luxury backdrops, custom templates and unlimited instant prints.',
  null,
  'https://images.pexels.com/photos/17641795/pexels-photo-17641795.jpeg?auto=compress&cs=tinysrgb&w=900',
  'A guest posing inside a curtained photo booth',
  false, false
)
on conflict (page_key) do nothing;
