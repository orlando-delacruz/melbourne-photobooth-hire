-- Client-provided business information (approved content).
--
-- The public site reads the saved page_contents rows before the TypeScript
-- seed fallback, so the saved `settings` and `home` snapshots need the exact
-- client values. Event Types and the Service highlight lists already match
-- (verified against the live data) and are intentionally left untouched.
-- Idempotent: fields are merged / set, so re-running is safe.

-- Settings: service area, phone numbers, ABN, credentials and transport note.
update public.page_contents
   set content = content || jsonb_build_object(
     'serviceAreaStatement', 'Melbourne Wide / Victoria Wide',
     'phonePrimary', '+61 459918987',
     'phoneSecondary', '+61 402332908',
     'abn', '77363405585',
     'trustItems', jsonb_build_array('ABN Registered Business', 'Public Liability Insured'),
     'transportNote', 'Transportation Allowance Varies Depending to Location'
   )
 where page_key = 'settings';

-- Homepage packages heading: restore the client price line ("Price Starts $130").
update public.page_contents
   set content = jsonb_set(
     content,
     '{packagesHeading,lede}',
     to_jsonb(
       'Price Starts $130. No hidden extras: every inclusion is listed. Final pricing is confirmed at enquiry.'
       ::text
     )
   )
 where page_key = 'home'
   and content ? 'packagesHeading';

-- Verify with:
--   select content->>'serviceAreaStatement' as area,
--          content->>'phonePrimary' as phone1,
--          content->>'phoneSecondary' as phone2,
--          content->>'abn' as abn,
--          content->'trustItems' as trust,
--          content->>'transportNote' as transport
--     from public.page_contents where page_key = 'settings';
--   select content->'packagesHeading'->>'lede' as packages_lede
--     from public.page_contents where page_key = 'home';
