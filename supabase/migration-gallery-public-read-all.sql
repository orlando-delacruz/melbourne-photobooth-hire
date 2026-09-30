-- Gallery: allow anonymous read of ALL gallery items.
--
-- The dedicated /gallery page must show every uploaded image regardless of
-- the homepage highlight flag; the homepage showcase filters `highlight = true`
-- in code (LiveShowcaseSection). The previous anon policy
-- ("Public read highlighted gallery", using highlight = true) incorrectly hid
-- non-highlighted images from /gallery.
--
-- Idempotent: safe to run more than once. Run in the Supabase SQL editor.
-- The application code already renders every row the anon key returns, so no
-- deploy ordering requirement beyond running this migration.

drop policy if exists "Public read highlighted gallery" on public.gallery_items;
drop policy if exists "Public read gallery" on public.gallery_items;

create policy "Public read gallery" on public.gallery_items
  for select to anon using (true);
