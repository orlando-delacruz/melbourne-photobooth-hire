-- Rename remaining "Enquire now" button labels to "Book Now".
--
-- The public site reads page copy from saved `page_contents` blobs, so the
-- seed default change alone does not update a live site whose editor has
-- already saved the packages page. This idempotently rewrites the two
-- button labels on the packages blob (CTA band + empty state) when they
-- still carry the old text. Prose (SEO descriptions, empty-state body) is
-- intentionally left unchanged — only buttons are renamed.
--
-- Run once in the Supabase SQL editor (any time relative to deploy).
-- Note: the updated_at trigger refreshes the packages row.

update public.page_contents
   set content = jsonb_set(
         jsonb_set(
           content,
           '{ctaBand,primaryLabel}',
           to_jsonb('Book Now'::text),
           false
         ),
         '{emptyState,actionLabel}',
         to_jsonb('Book Now'::text),
         false
       )
 where page_key = 'packages'
   and (
     lower(content #>> '{ctaBand,primaryLabel}') = 'enquire now'
     or lower(content #>> '{emptyState,actionLabel}') = 'enquire now'
   );

-- Verify with:
--   select content #>> '{ctaBand,primaryLabel}'    as cta_label,
--          content #>> '{emptyState,actionLabel}'  as empty_label
--     from public.page_contents where page_key = 'packages';
--   (expect both to read "Book Now")
