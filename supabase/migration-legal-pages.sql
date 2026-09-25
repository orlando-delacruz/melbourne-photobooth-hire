-- Legal pages support: allow privacy/terms keys in page_contents.
-- Idempotent: safe to run even if a previous attempt partially applied.
-- Run in the Supabase SQL editor, then verify with:
--   select conname, pg_get_constraintdef(oid) from pg_constraint
--   where conrelid = 'public.page_contents'::regclass and conname = 'page_contents_page_key_check';

alter table public.page_contents drop constraint if exists page_contents_page_key_check;

alter table public.page_contents
  add constraint page_contents_page_key_check
  check (
    page_key in (
      'home', 'services', 'packages', 'gallery', 'about', 'faq', 'contact',
      'settings', 'privacy', 'terms'
    )
  );

-- Existing RLS policies on page_contents already cover all rows:
-- anonymous visitors can read, allow-listed admins have full access.
-- No policy change needed. No seed rows required: empty/missing rows fall
-- back to the built-in legal copy until first saved in admin.
