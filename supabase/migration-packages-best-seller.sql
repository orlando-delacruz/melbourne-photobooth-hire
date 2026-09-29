-- Packages Best Seller flag.
--
-- Adds the best_seller toggle consumed by the package ribbon badge: when on,
-- the public package card renders the Best Seller ribbon in its top-right
-- corner. Defaults to false so existing packages are unaffected. Run once in
-- the Supabase SQL editor (any time relative to deploy). Idempotent via
-- `add column if not exists`.

alter table public.packages
  add column if not exists best_seller boolean not null default false;

-- Verify with:
--   select column_name, data_type, column_default
--     from information_schema.columns
--    where table_schema = 'public' and table_name = 'packages'
--      and column_name = 'best_seller';
--   (expect boolean, default false)
