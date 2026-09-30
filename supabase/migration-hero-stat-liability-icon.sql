-- Hero stat icon: give the Public Liability stat the shield-check library
-- icon (DEC-045).
--
-- The icon library keys live in src/lib/cms/icons.ts; "shield-check" renders
-- as the Lucide ShieldCheck glyph. This overrides whatever icon the stat
-- currently carries (the live row was saved with "clock"). Matches the stat
-- by label or value containing "liability" (case-insensitive), so it works
-- regardless of the exact wording chosen in the CMS.
--
-- Idempotent: re-running writes the same icon. Rows without a matching stat
-- are a no-op. Run once in the Supabase SQL editor (any time relative to
-- deploy); the updated_at trigger refreshes the home row.

update public.page_contents
   set content = jsonb_set(
         content,
         '{hero,stats}',
         (
           select jsonb_agg(
                    case
                      when elem->>'label' ilike '%liability%'
                           or elem->>'value' ilike '%liability%'
                        then elem || '{"icon":"shield-check"}'::jsonb
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
   and content::text ilike '%liability%';

-- Verify with:
--   select jsonb_pretty(content->'hero'->'stats')
--     from public.page_contents where page_key = 'home';
--   (expect "icon": "shield-check" on the liability stat)
