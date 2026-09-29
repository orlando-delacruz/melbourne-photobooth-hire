-- Hero stat: replace "booth experiences" with a manual "5 star rated" stat.
--
-- Replaces the derived services-count stat (value "3", label
-- "booth experiences", source "services", camera icon) with a fixed value
-- "5" and label "star rated" with the star icon. Any previous icon/source
-- keys on the replaced element are dropped.
--
-- Idempotent: only elements still labelled "booth experiences" are touched,
-- so a second run is a no-op. Rows with an empty home blob ('{}') fall back
-- to the seed default at render and need no change. Run once in the Supabase
-- SQL editor (any time relative to deploy). Note: the updated_at trigger
-- refreshes the home row.
--
-- Confirmation note: the "5 star rated" claim must reflect verified business
-- fact (REQ-REV-007) before this runs against production.

update public.page_contents
   set content = jsonb_set(
         content,
         '{hero,stats}',
         (
           select jsonb_agg(
                    case
                      when elem->>'label' = 'booth experiences'
                        then jsonb_build_object('value', '5', 'label', 'star rated', 'icon', 'star')
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
   and jsonb_array_length(content->'hero'->'stats') > 0;

-- Verify with:
--   select jsonb_pretty(content->'hero'->'stats')
--     from public.page_contents where page_key = 'home';
--   (expect {"value": "5", "label": "star rated", "icon": "star"} with no "source" key)
