-- Packages card badge image: Best Seller / Top Rated.
--
-- Supersedes the earlier best_seller boolean. The admin dropdown now chooses
-- which image badge overlays the card's top-right corner:
--   'none'        -> no badge
--   'best-seller' -> /images/best-seller.png
--   'top-rated'   -> /images/top-rated.png
--
-- Idempotent and safe on any database state:
--   * fresh DB (schema.sql already defines card_badge): only the constraint
--     guard runs;
--   * live DB still on best_seller boolean: backfills 'best-seller' for the
--     rows that were true, then drops the old column.
-- Run once in the Supabase SQL editor (any time relative to deploy). Note:
-- the updated_at trigger refreshes affected rows.

alter table public.packages
  add column if not exists card_badge text not null default 'none';

-- Backfill from the old boolean only where that column still exists.
do $$
begin
  if exists (
    select 1 from information_schema.columns
     where table_schema = 'public'
       and table_name = 'packages'
       and column_name = 'best_seller'
  ) then
    execute $sql$
      update public.packages
         set card_badge = 'best-seller'
       where best_seller = true
         and card_badge = 'none'
    $sql$;
  end if;
end
$$;

-- Drop the superseded boolean if it is still present.
alter table public.packages
  drop column if exists best_seller;

-- Enforce the allowed values (drop-then-add so a re-run is a no-op).
alter table public.packages
  drop constraint if exists packages_card_badge_check;
alter table public.packages
  add constraint packages_card_badge_check
  check (card_badge in ('none', 'best-seller', 'top-rated'));

-- Verify with:
--   select slug, card_badge from public.packages order by sort_order;
--   (expect 'best-seller' on the packages that were previously flagged)
