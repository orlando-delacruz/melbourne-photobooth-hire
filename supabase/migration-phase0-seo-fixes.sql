-- Phase 0 SEO remediation: CMS content corrections (DEC-052).
--
-- Mirrors scripts/phase0-cms-fixes.mjs, which was run against the live project
-- to apply these changes. Kept as the SQL-editor record per repo convention.
-- Idempotent: every statement matches an exact old value/pattern, so re-running
-- is a no-op. Non-destructive: field-level updates only; no rows are deleted.
--
-- Covers: test H1 removal, "packages start from $350" pricing, unverified
-- "5 star" claim removal, Public Liability label fix, phone formatting,
-- package card corrections, FAQ pricing, placeholder gallery de-highlighting,
-- and CMS OG images for pages that fell back to the Pexels placeholder.

-- 1. Services H1: remove internal test copy.
update public.page_contents
   set content = jsonb_set(content, '{header,title}',
     to_jsonb('Photobooth hire services in Melbourne'::text))
 where page_key = 'services'
   and content->'header'->>'title' ilike '%testing%';

-- 2. Pricing line: supersede "Price Starts $150/$130" with the approved
--    "Packages start from $350" (home + packages page ledes).
update public.page_contents
   set content = jsonb_set(content, '{packagesHeading,lede}',
     to_jsonb(replace(content->'packagesHeading'->>'lede',
       'Price Starts $150', 'Packages start from $350')))
 where page_key = 'home'
   and content->'packagesHeading'->>'lede' like 'Price Starts $150%';
update public.page_contents
   set content = jsonb_set(content, '{packagesHeading,lede}',
     to_jsonb(replace(content->'packagesHeading'->>'lede',
       'Price Starts $130', 'Packages start from $350')))
 where page_key = 'home'
   and content->'packagesHeading'->>'lede' like 'Price Starts $130%';
update public.page_contents
   set content = jsonb_set(content, '{plansHeading,lede}',
     to_jsonb(replace(content->'plansHeading'->>'lede',
       'Price Starts $150', 'Packages start from $350')))
 where page_key = 'packages'
   and content->'plansHeading'->>'lede' like 'Price Starts $150%';
update public.page_contents
   set content = jsonb_set(content, '{plansHeading,lede}',
     to_jsonb(replace(content->'plansHeading'->>'lede',
       'Price Starts $130', 'Packages start from $350')))
 where page_key = 'packages'
   and content->'plansHeading'->>'lede' like 'Price Starts $130%';

-- 3. Hero stats: fix the "ensured" label and retire the unverified
--    "5 / star-rated" claim for the derived services count (3 booths).
update public.page_contents
   set content = jsonb_set(content, '{hero,stats}', (
     select jsonb_agg(
       case
         when elem->>'label' ilike 'ensured'
           then jsonb_build_object('value', 'Public Liability', 'label', 'insured', 'icon', 'shield-check')
         when elem->>'icon' = 'star' or elem->>'label' ilike '%star%'
           then jsonb_build_object('value', '3', 'label', 'booth experiences', 'icon', 'camera', 'source', 'services')
         else elem
       end order by ord)
     from jsonb_array_elements(content->'hero'->'stats') with ordinality as t(elem, ord)
   ))
 where page_key = 'home'
   and content->'hero' ? 'stats'
   and jsonb_typeof(content->'hero'->'stats') = 'array'
   and content::text ~* '(ensured|star)';

-- 4. FAQ pricing answer.
update public.faqs
   set answer = replace(answer, 'Price Starts $150.', 'Packages start from $350.')
 where answer like 'Price Starts $150.%';
update public.faqs
   set answer = replace(answer, 'Price Starts $130.', 'Packages start from $350.')
 where answer like 'Price Starts $130.%';

-- 5. Package card corrections: wrong duration label on "The Four Hours",
--    duplicate inclusion, US spelling, and the "Full Liability Insured" label.
update public.packages
   set duration_label = '4 hours'
 where name ilike '%four hours%'
   and duration_label !~ '[0-9]';
update public.packages
   set inclusions = (
     select array_agg(item order by ord)
     from (
       select distinct on (normalized) normalized as item, ord
       from unnest(inclusions) with ordinality as t(raw, ord)
       cross join lateral (
         select replace(replace(raw, 'Personalized', 'Personalised'),
                        'Full Liability Insured', 'Public Liability Insured') as normalized
       ) n
       order by normalized, ord
     ) s
   )
 where inclusions && array['Personalized event branding & photo layouts', 'Full Liability Insured']
    or array_length(inclusions, 1) <> (select count(distinct x) from unnest(inclusions) x);

-- 6. Placeholder gallery rows: clear the highlight flag so the homepage
--    showcase and about story use client photos. Rows are retained for the
--    client to replace or delete in the admin (gallery page renders all rows).
update public.gallery_items
   set highlight = false
 where image_src like '%images.pexels.com%'
   and highlight is distinct from false;

-- 7. CMS OG images: pages with an empty og:image fall back to the Pexels hero
--    placeholder. Point them at the matching client-uploaded service photo.
update public.page_seo set og_image_src = s.image_src, og_image_alt = s.image_alt
  from public.services s
 where page_seo.page_key in ('services', 'packages', 'privacy', 'terms')
   and s.slug = 'premium-photobooth'
   and coalesce(page_seo.og_image_src, '') = '';
update public.page_seo set og_image_src = s.image_src, og_image_alt = s.image_alt
  from public.services s
 where page_seo.page_key in ('gallery', 'faq')
   and s.slug = '360-video-booth'
   and coalesce(page_seo.og_image_src, '') = '';
update public.page_seo set og_image_src = s.image_src, og_image_alt = s.image_alt
  from public.services s
 where page_seo.page_key in ('about', 'contact')
   and s.slug = 'roaming-photobooth'
   and coalesce(page_seo.og_image_src, '') = '';

-- 8. Settings: client-approved phone formatting and contact email.
update public.page_contents
   set content = content || jsonb_build_object(
     'phonePrimary', '+61 459 918 987',
     'phoneSecondary', '+61 402 332 908'
   )
 where page_key = 'settings';
update public.page_contents
   set content = content || jsonb_build_object('contactEmail', 'melbournephotoboothhire.au@gmail.com')
 where page_key = 'settings'
   and coalesce(content->>'contactEmail', '') = '';

-- Verify with:
--   select content->'header'->>'title' from public.page_contents where page_key = 'services';
--   select content->'packagesHeading'->>'lede' from public.page_contents where page_key = 'home';
--   select jsonb_pretty(content->'hero'->'stats') from public.page_contents where page_key = 'home';
--   select question, answer from public.faqs where question ilike '%how much%';
--   select count(*) from public.gallery_items where image_src like '%images.pexels.com%' and highlight;
--   select page_key, og_image_src from public.page_seo order by page_key;
