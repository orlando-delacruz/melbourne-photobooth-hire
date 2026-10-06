-- 360 booth page support: allow the 360 key in page_contents + page_seo.
-- Idempotent: safe to run even if a previous attempt partially applied.
-- Run in the Supabase SQL editor, then verify with:
--   select conname, pg_get_constraintdef(oid) from pg_constraint
--   where conrelid in ('public.page_contents'::regclass, 'public.page_seo'::regclass)
--   and conname in ('page_contents_page_key_check', 'page_seo_page_key_check');

alter table public.page_contents drop constraint if exists page_contents_page_key_check;

alter table public.page_contents
  add constraint page_contents_page_key_check
  check (
    page_key in (
      'home', 'services', 'packages', 'gallery', 'about', 'faq', 'contact',
      'settings', 'privacy', 'terms', '360'
    )
  );

alter table public.page_seo drop constraint if exists page_seo_page_key_check;

alter table public.page_seo
  add constraint page_seo_page_key_check
  check (
    page_key in (
      'home', 'services', 'packages', 'gallery', 'about', 'faq', 'contact',
      'privacy', 'terms', '360'
    )
  );

-- Existing RLS policies on both tables already cover all rows:
-- anonymous visitors can read, allow-listed admins have full access.
-- No policy change needed. No seed rows required: an empty/missing 360 row
-- falls back to the built-in empty shape (sections omitted) until the CMS
-- row is saved in admin. Realtime already publishes both tables whole, so
-- the new rows sync live with no publication change.
