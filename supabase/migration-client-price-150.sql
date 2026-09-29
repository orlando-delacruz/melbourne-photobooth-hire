-- Client-confirmed price correction: "Price Starts $150" (supersedes $130).
--
-- Run once in the Supabase SQL editor. Idempotent: the ledes are set to an
-- exact value, so re-running is safe. Matches src/lib/cms/seed.ts.

-- Homepage packages heading lede.
update public.page_contents
   set content = jsonb_set(
     content,
     '{packagesHeading,lede}',
     to_jsonb(
       'Price Starts $150. No hidden extras: every inclusion is listed. Final pricing is confirmed at enquiry.'
       ::text
     )
   )
 where page_key = 'home'
   and content ? 'packagesHeading';

-- Packages page plans heading lede.
update public.page_contents
   set content = jsonb_set(
     content,
     '{plansHeading,lede}',
     to_jsonb(
       'Price Starts $150. Deposit confirms your date, balance due on the day. Every option can be tailored at enquiry.'
       ::text
     )
   )
 where page_key = 'packages'
   and content ? 'plansHeading';

-- Verify with:
--   select content->'packagesHeading'->>'lede' as home_packages_lede
--     from public.page_contents where page_key = 'home';
--   select content->'plansHeading'->>'lede' as packages_plans_lede
--     from public.page_contents where page_key = 'packages';
