-- Per-FAQ contextual link (DEC-056 follow-up).
--
-- Adds an optional related-link pair to FAQs so answers can link to the
-- related commercial page (packages, services, 360 booth, contact). Both
-- columns stay nullable: existing rows render exactly as before, and the
-- link renders only when both fields are set. Hrefs are constrained to
-- internal paths by admin validation (see faqsModuleSchema); the database
-- additionally rejects whitespace to block smuggled absolute URLs.
-- Idempotent: safe to re-run. Run in the Supabase SQL editor, then
-- regenerate types (`supabase gen types`) so database.types.ts picks up
-- the columns (rowMappers.ts tolerates their absence until then).

alter table public.faqs
  add column if not exists link_label text
    check (link_label is null or char_length(link_label) <= 80);

alter table public.faqs
  add column if not exists link_href text
    check (
      link_href is null
      or (char_length(link_href) <= 200 and link_href not like '% %')
    );

-- No RLS change (faqs policies already cover all columns), no seed data
-- change (link targets are per-row CMS content chosen in the FAQ editor).
-- Verify with:
--   select column_name, data_type, is_nullable from information_schema.columns
--   where table_schema = 'public' and table_name = 'faqs'
--   and column_name in ('link_label', 'link_href');
