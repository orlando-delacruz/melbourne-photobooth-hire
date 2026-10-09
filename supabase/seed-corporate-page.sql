-- Corporate Events occasion page content seeder (DEC-060 follow-up).
--
-- Furnishes the CMS-owned corporate page (page_contents 'corporate' +
-- page_seo 'corporate') so /corporate-photobooth-melbourne renders full
-- copy. Every line is derived from already-confirmed content: the live
-- Services module rows (360 platform, open-air setup, roaming mingling),
-- the confirmed setup/travel/printing FAQ answers, the homepage
-- process/enquiry wording, the services CTA band, and site-wide
-- occasion/service-area statements. No new prices, policies, claims, or
-- timings are introduced.
--
-- Deliberately left blank (client to confirm in /admin/corporate-page):
--   * priceLabel / priceNote / pricingPoints — no occasion-specific price
--     is confirmed (packages are duration-based and booth-agnostic). The
--     public pricing panel omits itself while the price is blank and the
--     packages CTA remains, so nothing misleading is published.
-- Header, CTA and OG images reuse the live 360 module photo (the platform
-- most hired for launches and activations); replace with client uploads
-- when available.
--
-- How to run: Supabase SQL editor, AFTER supabase/migration-occasion-pages.sql
-- (the 'corporate' key must pass the page_key checks). Idempotent and
-- non-destructive: `on conflict do nothing` inserts only when the row is
-- absent and never overwrites admin edits. To re-seed, delete the row first:
--   delete from public.page_contents where page_key = 'corporate';
--   delete from public.page_seo where page_key = 'corporate';
-- then re-run this file. Verify with:
--   select page_key, char_length(content::text) from public.page_contents where page_key = 'corporate';
--   select page_key, seo_title from public.page_seo where page_key = 'corporate';

insert into public.page_contents (page_key, content) values (
'corporate',
'{
  "header": {
    "title": "Photobooth hire for Melbourne corporate events",
    "eyebrow": "Corporate Events",
    "lede": "Branded photo and 360 video setups for launches, parties and conferences. Personalised overlays and event branding in every session, with instant sharing for the whole room.",
    "image": {
      "key": null,
      "src": "https://images.pexels.com/photos/38661371/pexels-photo-38661371.jpeg?auto=compress&cs=tinysrgb&w=900",
      "alt": "Guests celebrating on a dance floor beneath festival lights"
    }
  },
  "stepsHeading": {
    "eyebrow": "How it works",
    "title": "From brief to brand moment",
    "lede": "Here is how corporate hire runs with us."
  },
  "steps": [
    {
      "id": "step-brief",
      "title": "Brief us on the brand",
      "summary": "Share your event date, venue and guest numbers plus your branding, and we will confirm availability and put together a clear quote.",
      "icon": "briefcase"
    },
    {
      "id": "step-setup",
      "title": "Branded setup on site",
      "summary": "Professional lighting with personalised event branding, custom print templates and photo layouts dressed for your brand.",
      "icon": "sparkles"
    },
    {
      "id": "step-share",
      "title": "Instant shares, no queues",
      "summary": "Unlimited sessions with instant photo printing and instant QR downloads, while a friendly attendant keeps the line moving.",
      "icon": "qrcode"
    }
  ],
  "pricingHeading": {
    "eyebrow": "Pricing",
    "title": "Corporate photobooth pricing",
    "lede": "The current confirmed rate for corporate hire."
  },
  "priceLabel": "",
  "priceNote": "",
  "pricingPoints": [],
  "bestForHeading": {
    "eyebrow": "Good fit",
    "title": "Made for your event",
    "lede": "Three corporate occasions the booth suits best."
  },
  "bestFor": [
    {
      "id": "launches",
      "title": "Launches and activations",
      "detail": "Personalised video overlays and event branding put your brand in every clip, with instant QR sharing for the room."
    },
    {
      "id": "parties",
      "title": "EOFY and Christmas parties",
      "detail": "Fun props and guest interaction keep all ages in front of the camera, with prints and share-ready clips to take home."
    },
    {
      "id": "conferences",
      "title": "Conferences and expos",
      "detail": "The roaming booth mingles through the crowd for candid guest photos with no fixed backdrop, perfect between sessions."
    }
  ],
  "venueHeading": {
    "eyebrow": "On the day",
    "title": "Setup and travel, handled",
    "lede": "What happens before your guests arrive."
  },
  "venueNotes": [
    "We arrive early and set up quietly before your guests arrive, then pack down after the event.",
    "The open-air setup fits any corner of your venue, dressed with luxury backdrops.",
    "We are based in Melbourne and regularly travel to surrounding regions; any transport fee is confirmed in your quote before you commit."
  ],
  "faqHeading": {
    "eyebrow": "Good to know",
    "title": "Corporate questions, answered",
    "lede": "Quick answers about corporate hire."
  },
  "faqCtaLabel": "Read all FAQs",
  "ctaBand": {
    "eyebrow": "Planning a work event?",
    "headline": "Tell us about the event.",
    "lede": "Share your date, venue and guest numbers and we will recommend the setup that fits best.",
    "primaryLabel": "Start an enquiry",
    "secondaryLabel": "Compare packages",
    "image": {
      "key": null,
      "src": "https://images.pexels.com/photos/38661371/pexels-photo-38661371.jpeg?auto=compress&cs=tinysrgb&w=900",
      "alt": "Guests celebrating on a dance floor beneath festival lights"
    }
  },
  "seo": {
    "seoTitle": "Corporate Photobooth Melbourne | Event & Brand Activations",
    "seoDescription": "Photobooth hire for Melbourne corporate events: branded overlays, 360 video, instant sharing and invoice-friendly bookings for launches and EOFY parties.",
    "ogImage": {
      "key": null,
      "src": "https://images.pexels.com/photos/38661371/pexels-photo-38661371.jpeg?auto=compress&cs=tinysrgb&w=900",
      "alt": "Guests celebrating on a dance floor beneath festival lights"
    },
    "keywords": "corporate photobooth melbourne, corporate event photo booth, brand activation booth melbourne",
    "canonicalUrl": "",
    "ogTitle": "Corporate Photobooth Hire — Branded Booths & 360 Video",
    "ogDescription": "Branded overlays, 360 clips and instant sharing for launches, EOFY parties and conferences. Invoice-friendly bookings.",
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
  'corporate',
  'Corporate Photobooth Melbourne | Event & Brand Activations',
  'Photobooth hire for Melbourne corporate events: branded overlays, 360 video and instant sharing for launches, parties and conferences. Enquire today.',
  'corporate photobooth melbourne, corporate event photo booth, brand activation booth melbourne', '', 'Corporate Photobooth Hire — Branded Booths & 360 Video', 'Branded overlays, 360 clips and instant sharing for launches, EOFY parties and conferences. Invoice-friendly bookings.',
  null,
  'https://images.pexels.com/photos/38661371/pexels-photo-38661371.jpeg?auto=compress&cs=tinysrgb&w=900',
  'Guests celebrating on a dance floor beneath festival lights',
  false, false
)
on conflict (page_key) do nothing;
