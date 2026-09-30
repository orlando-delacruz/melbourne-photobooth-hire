-- Hero stat: replace the "longest hire window" stat with a Public Liability
-- stat, and repair the mangled value/label that an earlier edit produced.
--
-- The live home blob currently carries the element
--   { "value": "Liability", "label": "Ensured" }
-- (the intended phrase "Public Liability ensured" split across the two hero
-- stat slots). This migration rewrites it to
--   { "value": "Public Liability", "label": "ensured" }
-- so the hero reads: big "Public Liability", small "ensured".
--
-- Idempotent: only an element that still matches the mangled pair is touched,
-- so a second run is a no-op. Rows with an empty home blob ('{}') fall back to
-- the seed default at render and need no change. Run once in the Supabase SQL
-- editor (any time relative to deploy). The updated_at trigger refreshes the
-- home row.

update public.page_contents
   set content = jsonb_set(
         content,
         '{hero,stats}',
         (
           select jsonb_agg(
                    case
                      when elem->>'value' = 'Liability'
                           and elem->>'label' = 'Ensured'
                        then jsonb_build_object('value', 'Public Liability', 'label', 'ensured')
                      else elem
                    end
                    order by ord
                  )
             from jsonb_array_elements(content->'hero'->'stats')
                  with ordinality as t(elem, ord)
         )
       )
 where page_key = 'home'
   and content ? 'hero'
   and content->'hero' ? 'stats'
   and jsonb_typeof(content->'hero'->'stats') = 'array'
   and jsonb_array_length(content->'hero'->'stats') > 0
   and content::text like '%"Liability"%';

-- Verify with:
--   select jsonb_pretty(content->'hero'->'stats')
--     from public.page_contents where page_key = 'home';
--   (expect {"value": "Public Liability", "label": "ensured"} in place of the
--    "Liability"/"Ensured" element)
