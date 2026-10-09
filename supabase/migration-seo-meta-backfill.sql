-- SEO metadata backfill: completed titles, descriptions, keywords and OG
-- text for the 12 content pages (home, services, packages, gallery, about,
-- faq, contact, premium, roaming, 360, wedding, corporate). Values match the
-- repo seed fallbacks in src/lib/cms/seed.ts and supabase/seed-*-page.sql.
--
-- Non-destructive: updates only the five text columns, leaving OG images and
-- dimensions, canonical overrides and noindex/nofollow exactly as saved.
-- Privacy/terms are intentionally excluded (already complete).
--
-- Prerequisite: page_seo rows must exist (seeders or prior migrations).
-- Idempotent: safe to re-run; plain UPDATEs keyed on page_key. Run in the
-- Supabase SQL editor, then verify with:
--   select page_key, char_length(seo_title) as title_len,
--     char_length(seo_description) as desc_len
--   from public.page_seo
--   where page_key in ('home','services','packages','gallery','about','faq',
--     'contact','premium','roaming','360','wedding','corporate')
--   order by page_key;

update public.page_seo set
  seo_title = 'Photobooth Hire Melbourne | Premium, Roaming & 360 Booths',
  seo_description = 'Photobooth hire in Melbourne for weddings, corporate events and birthdays. Premium, roaming and 360 booths with HD prints, QR downloads and packages from $350.',
  keywords = 'photobooth hire melbourne, photo booth hire melbourne, 360 booth melbourne, wedding photobooth melbourne, corporate photobooth melbourne, roaming photobooth',
  og_title = 'Melbourne Photobooth Hire | Weddings, Events & 360 Booths',
  og_description = 'Open-air, roaming and 360 booths styled for your venue with instant prints and QR sharing. Enquire for Melbourne and Victoria availability.'
where page_key = 'home';

update public.page_seo set
  seo_title = 'Photobooth Hire Services Melbourne | Premium, Roaming & 360',
  seo_description = 'Compare Melbourne photobooth hire services: open-air, roaming and 360 video booths for weddings, birthdays and corporate events, each styled and staffed.',
  keywords = 'photobooth hire services melbourne, premium photobooth melbourne, roaming photobooth melbourne, 360 video booth melbourne, open air photobooth melbourne',
  og_title = 'Melbourne Photobooth Services | Open-Air, Roaming & 360',
  og_description = 'Three styled and staffed booths for Melbourne events: premium open-air, roaming crowd booth and 360 video. Enquire for Melbourne and Victoria availability.'
where page_key = 'services';

update public.page_seo set
  seo_title = 'Photobooth Hire Packages Melbourne | Prices & Inclusions',
  seo_description = 'Compare Melbourne photobooth hire packages from $350: 2 to 5 hour options plus 360 video booth, with add-ons and booking policies. Enquire for a clear quote.',
  keywords = 'photobooth hire packages melbourne, photobooth hire prices melbourne, 360 booth hire price melbourne, photobooth add ons, photobooth booking policies',
  og_title = 'Melbourne Photobooth Packages | 2-5 Hours + 360 Booth',
  og_description = 'All-inclusive hire from $350 with red-carpet setup, add-ons and plain-language booking policies. Send your date for availability.'
where page_key = 'packages';

update public.page_seo set
  seo_title = 'Photobooth Gallery Melbourne | Weddings, Parties & Events',
  seo_description = 'See the booths, backdrops and moments Melbourne Photobooth Hire stages at weddings, birthdays, corporate events and school formals.',
  keywords = 'photobooth gallery melbourne, wedding photobooth photos, 360 booth events melbourne, photobooth backdrops',
  og_title = 'Melbourne Photobooth Gallery | Booths & Event Moments',
  og_description = 'Open-air, roaming and 360 setups, backdrops and real event moments across Melbourne. Enquire to stage your night next.'
where page_key = 'gallery';

update public.page_seo set
  seo_title = 'About Us | Melbourne Photobooth Hire',
  seo_description = 'Meet Melbourne Photobooth Hire, a local Melbourne team styling and running photobooth experiences for weddings, birthdays and corporate events.',
  keywords = 'about melbourne photobooth hire, photobooth hire melbourne team, local photobooth hire',
  og_title = 'About Melbourne Photobooth Hire | Local Booth Team',
  og_description = 'A local Melbourne team designing styled, staffed photobooth experiences for weddings, birthdays and corporate events.'
where page_key = 'about';

update public.page_seo set
  seo_title = 'Photobooth Hire FAQs Melbourne | Pricing, Setup & Policies',
  seo_description = 'Answers to common Melbourne photobooth hire questions: pricing from $350, inclusions, travel, setup, space and booking policies.',
  keywords = 'photobooth hire faqs melbourne, photobooth hire cost, photobooth setup requirements, photobooth deposit policy',
  og_title = 'Melbourne Photobooth FAQs | Pricing, Setup & Policies',
  og_description = 'Pricing from $350, inclusions, travel, setup, space and booking policies answered. Still unsure? Ask us with your event details.'
where page_key = 'faq';

update public.page_seo set
  seo_title = 'Contact & Enquire | Photobooth Hire Melbourne',
  seo_description = 'Enquire about photobooth hire in Melbourne. Send your event date, venue and guest numbers and we''ll confirm availability and put together a clear quote.',
  keywords = 'contact photobooth hire melbourne, photobooth hire enquiry, photobooth availability melbourne',
  og_title = 'Enquire Now | Melbourne Photobooth Hire',
  og_description = 'Tell us your event date, venue and guest numbers for availability and a clear quote. Melbourne Wide and Victoria Wide, reply within one business day.'
where page_key = 'contact';

update public.page_seo set
  seo_title = 'Premium Photobooth Melbourne | Open-Air Booth Hire for Events',
  seo_description = 'Hire a premium open-air photobooth in Melbourne for weddings, corporate events and birthdays: studio lighting, styled setup and instant prints. Enquire today.',
  keywords = 'premium photobooth melbourne, open-air photobooth melbourne, open air photo booth hire',
  og_title = 'Premium Open-Air Photobooth — Studio Light, Instant Prints',
  og_description = 'A styled studio-lit booth for your venue, with luxury backdrops, custom templates and unlimited instant prints.'
where page_key = 'premium';

update public.page_seo set
  seo_title = 'Roaming Photobooth Melbourne | Mingling Booth Hire for Events',
  seo_description = 'Hire a roaming photobooth in Melbourne for weddings, corporate and birthdays: candid crowd photos, no backdrop, ideal for cocktail hours. Enquire today.',
  keywords = 'roaming photobooth melbourne, mingling photobooth, cocktail hour photo booth',
  og_title = 'Roaming Photobooth — Candid Crowd Photos, No Backdrop Needed',
  og_description = 'The mingling booth moves through your crowd for candid photos. Perfect for cocktail hours and corporate mixers.'
where page_key = 'roaming';

update public.page_seo set
  seo_title = '360 Video Booth Melbourne | 360 Booth Hire for Events',
  seo_description = 'Hire a 360 video booth in Melbourne for weddings, corporate events and birthdays: slow-motion platform, instant QR clips and styled setup. Enquire today.',
  keywords = '360 photobooth melbourne, 360 video booth melbourne, 360 booth hire melbourne',
  og_title = '360 Video Booth Melbourne — Slow-Motion Clips, Instant Sharing',
  og_description = 'Step on, strike a pose, share the clip by QR before you sit down. 360 booth hire for Melbourne weddings, corporate events and birthdays.'
where page_key = '360';

update public.page_seo set
  seo_title = 'Wedding Photobooth Melbourne | Photobooth Hire for Weddings',
  seo_description = 'Hire a photobooth for your Melbourne wedding: styled open-air and 360 setups, instant prints, QR guest gallery and run-sheet-friendly attendants. Enquire today.',
  keywords = 'wedding photobooth melbourne, wedding photo booth hire melbourne',
  og_title = 'Wedding Photobooth Hire Melbourne — Styled Setups, Instant Prints',
  og_description = 'Open-air and 360 setups with a QR guest gallery and an attendant who works your run-sheet. Enquire for your date.'
where page_key = 'wedding';

update public.page_seo set
  seo_title = 'Corporate Photobooth Melbourne | Event & Brand Activations',
  seo_description = 'Photobooth hire for Melbourne corporate events: branded overlays, 360 video and instant sharing for launches, parties and conferences. Enquire today.',
  keywords = 'corporate photobooth melbourne, corporate event photo booth, brand activation booth melbourne',
  og_title = 'Corporate Photobooth Hire — Branded Booths & 360 Video',
  og_description = 'Branded overlays, 360 clips and instant sharing for launches, parties and conferences. Enquire today.'
where page_key = 'corporate';
