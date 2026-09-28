-- Client social media links (approved content).
--
-- Stored centrally in Site Wide Settings (page_contents.settings). The public
-- footer, contact page aside and Schema.org sameAs all read settings.socials,
-- so this is the single source. Idempotent: sets the list and preserves every
-- other settings key.
--
-- Run once in the Supabase SQL editor (or apply via the admin Settings panel).

update public.page_contents
   set content = jsonb_set(
     content,
     '{socials}',
     jsonb_build_array(
       jsonb_build_object(
         'label', 'Instagram',
         'url', 'https://www.instagram.com/melbournephotoboothhire.au?stkn=MXQ4dnJoaWd0eTBtcQ%3D%3D&utm_source=qr'
       ),
       jsonb_build_object(
         'label', 'Facebook',
         'url', 'https://www.facebook.com/share/1BV42dwtgq/?mibextid=wwXIfr'
       )
     )
   )
 where page_key = 'settings';

-- Verify with:
--   select jsonb_pretty(content->'socials')
--     from public.page_contents where page_key = 'settings';
