-- Packages image removal (DEC-039): package images are never rendered on
-- the public website (cards render name, duration, price, inclusions and
-- CTA only), so the upload field is removed from the Packages module.
-- Run once in the Supabase SQL editor, before deploying the matching code.
-- Idempotent: the storage delete matches zero rows and the column drops are
-- guarded, so re-running is safe.
--
-- Order matters: orphaned package uploads are deleted from the cms-media
-- bucket first, while image_key is still readable; then the columns go.

delete from storage.objects
 where bucket_id = 'cms-media'
   and name in (
     select image_key
       from public.packages
      where image_key is not null
        and image_key <> ''
   );

alter table public.packages drop column if exists image_key;
alter table public.packages drop column if exists image_src;
alter table public.packages drop column if exists image_alt;

-- Verify with (expect zero columns):
--   select column_name
--     from information_schema.columns
--    where table_schema = 'public'
--      and table_name = 'packages'
--      and column_name in ('image_key', 'image_src', 'image_alt');
