-- Wedding + Corporate occasion page support: allow the keys in page_contents + page_seo.
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
      'settings', 'privacy', 'terms', '360', 'premium', 'roaming',
      'wedding', 'corporate'
    )
  );

alter table public.page_seo drop constraint if exists page_seo_page_key_check;

alter table public.page_seo
  add constraint page_seo_page_key_check
  check (
    page_key in (
      'home', 'services', 'packages', 'gallery', 'about', 'faq', 'contact',
      'privacy', 'terms', '360', 'premium', 'roaming',
      'wedding', 'corporate'
    )
  );

-- Existing RLS policies on both tables already cover all rows:
-- anonymous visitors can read, allow-listed admins have full access.
-- No policy change needed. No seed rows required: empty/missing rows fall
-- back to the built-in empty shape (sections omitted) until the CMS rows
-- are saved in admin. Realtime already publishes both tables whole, so the
-- new rows sync live with no publication change.
