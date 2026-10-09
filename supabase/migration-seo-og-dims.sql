-- SEO OG image dimensions: persist intrinsic size for og:image:width/height.pl
-- The admin upload path already captures width/height into the draft image
-- object, but page_seo had no columns for them, so BaseLayout could only
-- emit dimensions for hero-fallback images. Idempotent: safe to re-run.
-- Run in the Supabase SQL editor, then regenerate database.types.ts
-- (or align it manually) and verify with:
--   select column_name, data_type from information_schema.columns
--   where table_name = 'page_seo' and column_name like 'og_image%';

alter table public.page_seo
  add column if not exists og_image_width integer;

alter table public.page_seo
  add column if not exists og_image_height integer;
