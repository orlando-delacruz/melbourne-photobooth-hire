-- Hero stat value sources (DEC-037).
--
-- Marks the two derived homepage hero stats so their value is computed at
-- render from live module data instead of a manually typed value:
--   "booth experiences"   -> source "services"      (count of public services)
--   "longest hire window" -> source "longest-hire"   (longest package duration)
--
-- Idempotent: rows that already carry a source are left untouched, and labels
-- that do not match keep their manual value. Run once in the Supabase SQL
-- editor (any time relative to deploy; the code treats a missing source as a
-- manual value). Note: the updated_at trigger refreshes the home row.

update public.page_contents
   set content = jsonb_set(
         content,
         '{hero,stats}',
         (
           select jsonb_agg(
                    case
                      when elem->>'label' = 'booth experiences'
                           and not (elem ? 'source')
                        then elem || '{"source":"services"}'::jsonb
                      when elem->>'label' = 'longest hire window'
                           and not (elem ? 'source')
                        then elem || '{"source":"longest-hire"}'::jsonb
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
--   (expect a "source" on the booth-experiences and longest-hire stats)
