-- Melbourne Photobooth Hire: provisional seed (Phase 14).
-- Mirrors src/lib/cms/seed.ts so the first Supabase-backed render matches the
-- current public site. All content is provisional/placeholder until the client
-- confirms production copy. Images stay hotlinked Pexels URLs until replaced
-- by Storage uploads. Idempotent via slug/page_key upserts.

-- Event types (dropdown order = sort_order).
insert into public.event_types (slug, label, sort_order) values
  ('event-type-1', 'Wedding', 0),
  ('event-type-2', 'Birthday', 1),
  ('event-type-3', 'Corporate Event', 2),
  ('event-type-4', 'Engagement Party', 3),
  ('event-type-5', 'School Formal', 4),
  ('event-type-6', 'Christmas/End-of-Year', 5),
  ('event-type-7', 'Private Event', 6),
  ('event-type-8', 'Other', 7)
on conflict (slug) do update set label = excluded.label, sort_order = excluded.sort_order;

-- Services (all highlighted so seeded rendering matches the public site).
insert into public.services
  (slug, name, badge_type, custom_badge, tagline, summary, highlights, icon, image_src, image_alt, highlight, sort_order)
values
  ('premium-photobooth', 'Premium Photobooth', 'custom', 'Most booked',
   'The centrepiece of the room.',
   'An open-air, studio-lit booth that turns any corner of your venue into a photo studio. Professional lighting, a custom print template and a friendly attendant keep the line moving all night.',
   ARRAY['Open-air, studio-lit setup','Unlimited sessions while you hire','Custom-branded prints in seconds'],
   'camera',
   'https://images.pexels.com/photos/17641795/pexels-photo-17641795.jpeg?auto=compress&cs=tinysrgb&w=900',
   'A guest posing inside a curtained photo booth', true, 0),
  ('roaming-photobooth', 'Roaming Photobooth', 'custom', 'Fan favourite',
   'The booth that mingles.',
   'A portable booth that moves through the crowd, capturing candid moments wherever your guests are. Perfect for cocktail hours and venues with more than one room.',
   ARRAY['Moves through the crowd','No fixed backdrop or floor space needed','Candid, in-the-moment photography'],
   'users',
   'https://images.pexels.com/photos/6224736/pexels-photo-6224736.jpeg?auto=compress&cs=tinysrgb&w=900',
   'Two friends laughing together in front of a golden backdrop', true, 1),
  ('360-video-booth', '360 Video Booth', 'basic', '',
   'The shot everyone shares.',
   'A 360° slow-motion platform experience. Guests strike a pose, the camera sweeps around them, and a share-ready clip lands on their phone by QR before they sit back down.',
   ARRAY['360 slow-motion clips','Instant QR download, no app required','Share-ready in seconds'],
   'video',
   'https://images.pexels.com/photos/38661371/pexels-photo-38661371.jpeg?auto=compress&cs=tinysrgb&w=900',
   'Guests celebrating on a dance floor beneath festival lights', true, 2)
on conflict (slug) do update set
  name = excluded.name, badge_type = excluded.badge_type, custom_badge = excluded.custom_badge,
  tagline = excluded.tagline, summary = excluded.summary, highlights = excluded.highlights,
  icon = excluded.icon, image_src = excluded.image_src, image_alt = excluded.image_alt,
  highlight = excluded.highlight, sort_order = excluded.sort_order, updated_at = now();

-- Packages (all highlighted; images empty until uploaded, matching the seed).
insert into public.packages
  (slug, name, summary, duration_label, price_label, badge_type, custom_badge, inclusions, highlight, sort_order)
values
  ('starter', 'The Two Hour',
   'A tight, high-impact hire for intimate celebrations, cocktail hours and mid-week events. Full styling included, no corners cut.',
   '2 hours', '$350 total', 'none', '',
   ARRAY['Full photobooth service','Studio-quality lighting and styling','Custom-branded print template','HD printing, unlimited sessions','QR code digital downloads','Red carpet and golden bollard entrance','Free use of props'],
   true, 0),
  ('standard', 'The Three Hour',
   'Our most-booked balance of time and value: room for group shots, guest sessions and prints for everyone, without rushing the room.',
   '3 hours', '$450 total', 'most-popular', '',
   ARRAY['Everything in The Two Hour','Custom-branded print template','HD printing, unlimited sessions','QR code digital downloads','Friendly on-site attendant','Free use of props','Full setup and pack-down'],
   true, 1),
  ('premium', 'The Four Hour',
   'Maximum coverage for big nights: extended hire plus priority setup and pack-down, and the option to add the 360 Video Booth for the full floor-filler.',
   '4 hours', '$600 total', 'best-value', '',
   ARRAY['Everything in The Three Hour','Priority setup and pack-down','Extended guest session coverage','360 Video Booth add-on available','Custom backdrop styling','Digital guestbook option'],
   true, 2)
on conflict (slug) do update set
  name = excluded.name, summary = excluded.summary, duration_label = excluded.duration_label,
  price_label = excluded.price_label, badge_type = excluded.badge_type, custom_badge = excluded.custom_badge,
  inclusions = excluded.inclusions, highlight = excluded.highlight, sort_order = excluded.sort_order,
  updated_at = now();

-- Gallery (all highlighted).
insert into public.gallery_items (slug, image_src, image_alt, caption, highlight, sort_order) values
  ('gallery-1', 'https://images.pexels.com/photos/34458014/pexels-photo-34458014.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Wedding guests raising a toast on the dance floor', 'Wedding reception', true, 0),
  ('gallery-2', 'https://images.pexels.com/photos/17641795/pexels-photo-17641795.jpeg?auto=compress&cs=tinysrgb&w=1200', 'A guest posing inside a curtained photo booth', 'Booth sessions', true, 1),
  ('gallery-3', 'https://images.pexels.com/photos/32333372/pexels-photo-32333372.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Friends celebrating a birthday in a shower of confetti', 'Birthday party', true, 2),
  ('gallery-4', 'https://images.pexels.com/photos/6224736/pexels-photo-6224736.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Two friends laughing together in front of a golden backdrop', 'Golden hour backdrop', true, 3),
  ('gallery-5', 'https://images.pexels.com/photos/38661371/pexels-photo-38661371.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Guests celebrating on a dance floor beneath festival lights', '360 Video Booth', true, 4),
  ('gallery-6', 'https://images.pexels.com/photos/7638133/pexels-photo-7638133.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Friends laughing and dancing together at a celebration', 'Room full of laughter', true, 5),
  ('gallery-7', 'https://images.pexels.com/photos/29851245/pexels-photo-29851245.jpeg?auto=compress&cs=tinysrgb&w=1200', 'A wedding party celebrating under outdoor string lights at night', 'Outdoor celebrations', true, 6),
  ('gallery-8', 'https://images.pexels.com/photos/30562607/pexels-photo-30562607.jpeg?auto=compress&cs=tinysrgb&w=1200', 'An event set with elegant tables beneath warm string lights at night', 'Styled venues', true, 7)
on conflict (slug) do update set
  image_src = excluded.image_src, image_alt = excluded.image_alt, caption = excluded.caption,
  highlight = excluded.highlight, sort_order = excluded.sort_order, updated_at = now();

-- FAQs (all highlighted).
insert into public.faqs (slug, question, answer, highlight, sort_order) values
  ('how-far-in-advance', 'How far in advance should I book?',
   'We recommend booking four to six weeks ahead, especially through summer wedding season and end-of-year celebrations. Popular Saturdays fill quickly. If your date is close, reach out anyway and we''ll confirm availability straight away.',
   true, 0),
  ('how-much', 'How much does photobooth hire cost?',
   'Hire starts at $350 for two hours, $450 for three hours and $600 for four hours. Extended hire is $150 per hour. Every package includes styling, HD printing, QR downloads, props and full setup and pack-down, so there are no surprise extras.',
   true, 1),
  ('whats-included', 'What''s included in every hire?',
   'Every booking includes the full photobooth service, studio-quality lighting and styling, a custom-branded print template, HD printing with unlimited sessions, QR code digital downloads, free use of props, and setup and pack-down by our team.',
   true, 2),
  ('what-is-360', 'What is the 360 Video Booth and how does it work?',
   'The 360 Video Booth films slow-motion video from every angle. Guests step onto the platform, the camera sweeps around them, and a share-ready clip is delivered by instant QR download, with no app and no waiting.',
   true, 3),
  ('do-you-travel', 'Do you travel outside Melbourne?',
   'Yes. We''re based in Melbourne and regularly travel to surrounding regions. A transport fee may apply depending on your venue''s location, and it''s always confirmed in your quote before you commit.',
   true, 4),
  ('setup-time', 'How long does setup take?',
   'We arrive early and set up quietly before your guests arrive, then pack down after the hire ends. Premium hires include priority setup and pack-down so the newest addition to your run sheet is always covered.',
   true, 5),
  ('space-required', 'How much space does the booth need?',
   'A standard open-air setup needs roughly three by three metres with access to a power point. If space is tight, the roaming booth needs even less, and we''ll advise on the best placement from your venue''s floor plan.',
   true, 6),
  ('deposit-cancellation', 'What is your deposit and cancellation policy?',
   'A 20% deposit confirms your date, with the balance due on the day. Deposits are non-refundable, and rescheduling is available with reasonable notice, subject to availability.',
   true, 7),
  ('add-photography', 'Can I add professional photography to my booking?',
   'Yes. Professional photography is available as an add-on alongside extended hire, custom backdrops and a digital guestbook. Mention it in your enquiry and we''ll put together a package that fits.',
   true, 8)
on conflict (slug) do update set
  question = excluded.question, answer = excluded.answer,
  highlight = excluded.highlight, sort_order = excluded.sort_order, updated_at = now();

-- Testimonials (DEC-034 one-time seed migration: the 6 home-blob reviews,
-- kept verbatim so the first module-backed render matches the public site).
insert into public.testimonials (slug, quote, name, event_type, rating, sort_order) values
  ('testimonial-1', 'The booth was the heart of the night. Guests queued for it and walked away with prints in hand. The setup was completely seamless.', 'Mia & Jordan', 'Wedding', 5, 0),
  ('testimonial-2', 'Our team still talks about the 360 clips. It turned a corporate night into something people actually remember.', 'Priya S.', 'Corporate event', 5, 1),
  ('testimonial-3', 'Setup was quick and the prints looked incredible. The birthday kids would not leave the booth, and neither did the adults.', 'Tara N.', 'Birthday', 5, 2),
  ('testimonial-4', 'From the first email to pack-down, everything was handled. We did not think about the booth once. It just worked.', 'Daniel R.', 'Corporate event', 5, 3),
  ('testimonial-5', 'The backdrop matched our styling perfectly and the prints became the favour everyone took home. Beautifully done.', 'Elena & Chris', 'Engagement party', 5, 4),
  ('testimonial-6', 'Our school formal needed something the students would actually use, and this was it. The queue never stopped.', 'Rebecca M.', 'School formal', 5, 5)
on conflict (slug) do update set
  quote = excluded.quote, name = excluded.name, event_type = excluded.event_type,
  rating = excluded.rating, sort_order = excluded.sort_order, updated_at = now();

-- Page copy shells: editors fill these in Phase 7. Seeded empty so public
-- pages keep their current hardcoded fallbacks until saved content exists.
insert into public.page_contents (page_key, content) values
  ('home', '{}'), ('services', '{}'), ('packages', '{}'), ('gallery', '{}'),
  ('about', '{}'), ('faq', '{}'), ('contact', '{}'), ('settings', '{}')
on conflict (page_key) do nothing;

-- Page SEO shells (9 pages). Titles/descriptions stay empty until edited;
-- the site keeps its hardcoded getPageSeo fallbacks until then.
insert into public.page_seo (page_key, seo_title, seo_description) values
  ('home', '', ''), ('services', '', ''), ('packages', '', ''),
  ('gallery', '', ''), ('about', '', ''), ('faq', '', ''),
  ('contact', '', ''), ('privacy', '', ''), ('terms', '', '')
on conflict (page_key) do nothing;
