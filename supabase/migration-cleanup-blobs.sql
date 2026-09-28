-- Admin CMS alignment cleanup: strip page-content keys for sections removed
-- from the public website (homepage Perfect For + Intro, packages foot note
-- and included band, about next-step panel, contact next-steps). Run once in
-- the Supabase SQL editor. Idempotent: the `-` operator is a no-op for keys
-- that are already absent, so re-running is safe.
--
-- Deliberately preserved: the deprecated home.testimonials fallback (still
-- read at runtime per DEC-034) and every other key. After running, saving
-- any of these sections in the admin writes the cleaned shape.
--
-- Note: the updated_at trigger refreshes the touched rows, so they read as
-- freshly saved in the admin dashboard afterwards.

update public.page_contents
   set content = content - 'eventTypesHeading' - 'intro'
 where page_key = 'home';

update public.page_contents
   set content = content - 'footNote' - 'checkDateLabel' - 'included'
 where page_key = 'packages';

update public.page_contents
   set content = content - 'next'
 where page_key = 'about';

update public.page_contents
   set content = content - 'asideHeading' - 'steps'
 where page_key = 'contact';

-- Verify with (expect no rows):
--   select page_key
--     from public.page_contents
--    where (page_key = 'home' and (content ? 'eventTypesHeading' or content ? 'intro'))
--       or (page_key = 'packages' and (content ? 'footNote' or content ? 'checkDateLabel' or content ? 'included'))
--       or (page_key = 'about' and content ? 'next')
--       or (page_key = 'contact' and (content ? 'asideHeading' or content ? 'steps'));
