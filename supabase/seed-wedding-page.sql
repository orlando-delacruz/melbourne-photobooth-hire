-- Wedding occasion page content seeder (DEC-060 follow-up).
--
-- Furnishes the CMS-owned wedding page (page_contents 'wedding' +
-- page_seo 'wedding') so /wedding-photobooth-melbourne renders full copy.
-- Every line is derived from already-confirmed content: the live Services
-- module rows (open-air setup, 360 platform, roaming mingling), the
-- confirmed setup/travel/printing FAQ answers, the homepage
-- process/enquiry wording, the services CTA band, and site-wide
-- occasion/service-area statements. No new prices, policies, claims, or
-- timings are introduced.
--
-- Deliberately left blank (client to confirm in /admin/wedding-page):
--   * priceLabel / priceNote / pricingPoints — no occasion-specific price
--     is confirmed (packages are duration-based and booth-agnostic). The
--     public pricing panel omits itself while the price is blank and the
--     packages CTA remains, so nothing misleading is published.
-- Header, CTA and OG images reuse the live premium module photo (the
-- open-air setup most hired for weddings); replace with client uploads
-- when available.
--
-- How to run: Supabase SQL editor, AFTER supabase/migration-occasion-pages.sql
-- (the 'wedding' key must pass the page_key checks). Idempotent and
-- non-destructive: `on conflict do nothing` inserts only when the row is
-- absent and never overwrites admin edits. To re-seed, delete the row first:
--   delete from public.page_contents where page_key = 'wedding';
--   delete from public.page_seo where page_key = 'wedding';
-- then re-run this file. Verify with:
--   select page_key, char_length(content::text) from public.page_contents where page_key = 'wedding';
--   select page_key, seo_title from public.page_seo where page_key = 'wedding';

insert into public.page_contents (page_key, content) values (
'wedding',
'{
  "header": {
    "title": "Photobooth hire for Melbourne weddings",
    "eyebrow": "Weddings",
    "lede": "A styled open-air booth and 360 slow-motion option for your big day. Instant prints, a QR guest gallery and a friendly attendant who keeps guest photos flowing around your run-sheet.",
    "image": {
      "key": null,
      "src": "https://images.pexels.com/photos/17641795/pexels-photo-17641795.jpeg?auto=compress&cs=tinysrgb&w=900",
      "alt": "A guest posing inside a curtained photo booth"
    }
  },
  "stepsHeading": {
    "eyebrow": "How it works",
    "title": "From booking to last dance",
    "lede": "Here is how wedding hire runs with us."
  },
  "steps": [
    {
      "id": "step-date",
      "title": "Book your date",
      "summary": "Share your wedding date, venue and guest numbers and we will confirm availability and put together a clear quote.",
      "icon": "calendar-days"
    },
    {
      "id": "step-style",
      "title": "Style it your way",
      "summary": "Choose luxury backdrops and fun props, with a custom print template and personalised event branding to match your theme.",
      "icon": "palette"
    },
    {
      "id": "step-celebrate",
      "title": "Guests snap all night",
      "summary": "Unlimited sessions with instant photo printing and digital sharing, while the attendant keeps the line moving for everyone.",
      "icon": "heart"
    }
  ],
  "pricingHeading": {
    "eyebrow": "Pricing",
    "title": "Wedding photobooth pricing",
    "lede": "The current confirmed rate for wedding hire."
  },
  "priceLabel": "",
  "priceNote": "",
  "pricingPoints": [],
  "bestForHeading": {
    "eyebrow": "Good fit",
    "title": "Made for your wedding day",
    "lede": "Three ways the booth fits the celebration."
  },
  "bestFor": [
    {
      "id": "receptions",
      "title": "Receptions",
      "detail": "Group shots and guest sessions for the whole wedding party, with studio-quality photos and custom templates."
    },
    {
      "id": "cocktail-hour",
      "title": "Cocktail hour",
      "detail": "The roaming booth mingles through the crowd for candid guest photos with no fixed backdrop."
    },
    {
      "id": "after-party",
      "title": "After-party",
      "detail": "Slow-motion 360 clips made for sharing, with fun props to keep all ages in front of the camera."
    }
  ],
  "venueHeading": {
    "eyebrow": "On the day",
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
    "title": "Wedding questions, answered",
    "lede": "Quick answers about wedding hire."
  },
  "faqCtaLabel": "Read all FAQs",
  "ctaBand": {
    "eyebrow": "Planning the big day?",
    "headline": "Tell us about the wedding.",
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
    "seoTitle": "Wedding Photobooth Melbourne | Photobooth Hire for Weddings",
    "seoDescription": "Hire a photobooth for your Melbourne wedding: styled open-air and 360 setups, instant prints, QR guest gallery and a team that runs the run-sheet with you.",
    "ogImage": {
      "key": null,
      "src": "https://images.pexels.com/photos/17641795/pexels-photo-17641795.jpeg?auto=compress&cs=tinysrgb&w=900",
      "alt": "A guest posing inside a curtained photo booth"
    },
    "keywords": "",
    "canonicalUrl": "",
    "ogTitle": "",
    "ogDescription": "",
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
  'wedding',
  'Wedding Photobooth Melbourne | Photobooth Hire for Weddings',
  'Hire a photobooth for your Melbourne wedding: styled open-air and 360 setups, instant prints, QR guest gallery and a team that runs the run-sheet with you. Enquire for a clear quote.',
  '', '', '', '',
  null,
  'https://images.pexels.com/photos/17641795/pexels-photo-17641795.jpeg?auto=compress&cs=tinysrgb&w=900',
  'A guest posing inside a curtained photo booth',
  false, false
)
on conflict (page_key) do nothing;
