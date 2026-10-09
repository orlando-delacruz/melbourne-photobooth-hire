-- 360 booth page content seeder (DEC-055 follow-up).
--
-- Furnishes the CMS-owned 360 page (page_contents '360' + page_seo '360')
-- so /360-video-booth-melbourne renders full copy. Every line is derived
-- from already-confirmed content: the live Services module 360 row
-- (summary/highlights/image), the confirmed 360 FAQ answer, the setup and
-- travel FAQ answers, the homepage process/enquiry wording, the services
-- CTA band, and site-wide occasion/service-area statements. No new prices,
-- policies, claims, or timings are introduced.
--
-- Deliberately left blank (client to confirm in /admin/360-page):
--   * priceLabel / priceNote / pricingPoints — no standalone 360 price is
--     confirmed (the Four Hour package lists 360 only as an add-on). The
--     public pricing panel omits itself while the price is blank and the
--     packages CTA remains, so nothing misleading is published.
-- Header, CTA and OG images reuse the live 360 module photo (the same image
-- the page already preloads); replace with client uploads when available.
--
-- How to run: Supabase SQL editor, AFTER supabase/migration-360-page.sql
-- (the '360' key must pass the page_key checks). Idempotent and
-- non-destructive: `on conflict do nothing` inserts only when the row is
-- absent and never overwrites admin edits. To re-seed, delete the row first:
--   delete from public.page_contents where page_key = '360';
--   delete from public.page_seo where page_key = '360';
-- then re-run this file. Verify with:
--   select page_key, char_length(content::text) from public.page_contents where page_key = '360';
--   select page_key, seo_title from public.page_seo where page_key = '360';

insert into public.page_contents (page_key, content) values (
'360',
'{
  "header": {
    "title": "360 Video Booth hire in Melbourne",
    "eyebrow": "360 Video Booth",
    "lede": "A 360° slow-motion platform experience. Guests strike a pose, the camera sweeps around them, and a share-ready clip lands on their phone by QR before they sit back down.",
    "image": {
      "key": null,
      "src": "https://images.pexels.com/photos/38661371/pexels-photo-38661371.jpeg?auto=compress&cs=tinysrgb&w=900",
      "alt": "Guests celebrating on a dance floor beneath festival lights"
    }
  },
  "stepsHeading": {
    "eyebrow": "How it works",
    "title": "Three steps to a share-ready clip",
    "lede": "Here is how the 360 experience runs on the night."
  },
  "steps": [
    {
      "id": "step-on",
      "title": "Step onto the platform",
      "summary": "Guests step onto the platform and strike a pose while the camera sweeps a full circle around them.",
      "icon": "video"
    },
    {
      "id": "we-film",
      "title": "We film every angle",
      "summary": "The booth captures slow-motion video from every angle, with professional lighting and your personalised video overlays and event branding.",
      "icon": "sparkles"
    },
    {
      "id": "share",
      "title": "Share straight away",
      "summary": "A share-ready clip lands on phones by instant QR download, with no app and no waiting.",
      "icon": "qrcode"
    }
  ],
  "pricingHeading": {
    "eyebrow": "Pricing",
    "title": "360 booth pricing",
    "lede": "The current confirmed rate for 360 hire."
  },
  "priceLabel": "",
  "priceNote": "",
  "pricingPoints": [],
  "bestForHeading": {
    "eyebrow": "Good fit",
    "title": "Made for your event",
    "lede": "Three occasions the 360 booth suits best."
  },
  "bestFor": [
    {
      "id": "weddings",
      "title": "Weddings",
      "detail": "Group shots and guest sessions for the whole wedding party, with slow-motion clips made for sharing."
    },
    {
      "id": "corporate",
      "title": "Corporate events",
      "detail": "Personalised video overlays and event branding put your brand in every clip, with instant QR sharing for the room."
    },
    {
      "id": "birthdays",
      "title": "Birthdays and parties",
      "detail": "Fun props and guest interaction keep all ages in front of the camera, with share-ready clips to take home."
    }
  ],
  "venueHeading": {
    "eyebrow": "On the night",
    "title": "Setup and travel, handled",
    "lede": "What happens before your guests arrive."
  },
  "venueNotes": [
    "We arrive early and set up quietly before your guests arrive, then pack down after the night.",
    "We are based in Melbourne and regularly travel to surrounding regions; any transport fee is confirmed in your quote before you commit."
  ],
  "faqHeading": {
    "eyebrow": "Good to know",
    "title": "360 questions, answered",
    "lede": "Quick answers about the 360 booth."
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
      "src": "https://images.pexels.com/photos/38661371/pexels-photo-38661371.jpeg?auto=compress&cs=tinysrgb&w=900",
      "alt": "Guests celebrating on a dance floor beneath festival lights"
    }
  },
  "seo": {
    "seoTitle": "360 Video Booth Melbourne | 360 Booth Hire for Events",
    "seoDescription": "Hire a 360 video booth in Melbourne for weddings, corporate events and birthdays: slow-motion platform, instant QR clips and styled setup.",
    "ogImage": {
      "key": null,
      "src": "https://images.pexels.com/photos/38661371/pexels-photo-38661371.jpeg?auto=compress&cs=tinysrgb&w=900",
      "alt": "Guests celebrating on a dance floor beneath festival lights"
    },
    "keywords": "360 photobooth melbourne, 360 video booth melbourne, 360 booth hire melbourne",
    "canonicalUrl": "",
    "ogTitle": "360 Video Booth Melbourne — Slow-Motion Clips, Instant Sharing",
    "ogDescription": "Step on, strike a pose, share the clip by QR before you sit down. 360 booth hire for Melbourne weddings, corporate events and birthdays.",
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
  '360',
  '360 Video Booth Melbourne | 360 Booth Hire for Events',
  'Hire a 360 video booth in Melbourne for weddings, corporate events and birthdays: slow-motion platform, instant QR clips and styled setup. Enquire today.',
  '360 photobooth melbourne, 360 video booth melbourne, 360 booth hire melbourne', '', '360 Video Booth Melbourne — Slow-Motion Clips, Instant Sharing', 'Step on, strike a pose, share the clip by QR before you sit down. 360 booth hire for Melbourne weddings, corporate events and birthdays.',
  null,
  'https://images.pexels.com/photos/38661371/pexels-photo-38661371.jpeg?auto=compress&cs=tinysrgb&w=900',
  'Guests celebrating on a dance floor beneath festival lights',
  false, false
)
on conflict (page_key) do nothing;
