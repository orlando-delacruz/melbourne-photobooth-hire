-- Inquiry field alignment (DEC-036).
--
-- The contact form's "Preferred photobooth" selection became "Service"
-- (sourced from the Services module) and a new "Package" selection was
-- added. This renames the legacy column and adds the new one; existing rows
-- keep their data and read back as services. Idempotent: safe to re-run.
--
-- Run once in the Supabase SQL editor BEFORE deploying the matching code,
-- which inserts into `service` / `package`. `guests` is deliberately left in
-- place (its historical values are retained) even though the public form no
-- longer collects it.

-- Rename photobooth -> service (data preserved).
do $$ begin
  if exists (
    select 1 from information_schema.columns
     where table_schema = 'public'
       and table_name = 'inquiries'
       and column_name = 'photobooth'
  ) and not exists (
    select 1 from information_schema.columns
     where table_schema = 'public'
       and table_name = 'inquiries'
       and column_name = 'service'
  ) then
    alter table public.inquiries rename column photobooth to service;
  end if;
end $$;

-- New package selection (nullable; existing rows unaffected).
alter table public.inquiries add column if not exists package text;

-- Replace the legacy column-length checks with limits aligned to the CMS
-- source (Services/Packages names allow up to 200 characters). Drop any
-- existing check that references service/package, whatever its name, so the
-- migration is safe on both migrated and freshly-created databases.
do $$
declare c record;
begin
  for c in
    select conname
      from pg_constraint
     where conrelid = 'public.inquiries'::regclass
       and contype = 'c'
       and (pg_get_constraintdef(oid) ~* 'service' or pg_get_constraintdef(oid) ~* 'package')
  loop
    execute format('alter table public.inquiries drop constraint %I', c.conname);
  end loop;
end $$;

alter table public.inquiries
  add constraint inquiries_service_check
  check (service is null or char_length(service) <= 200);
alter table public.inquiries
  add constraint inquiries_package_check
  check (package is null or char_length(package) <= 200);

-- Verify with:
--   select column_name
--     from information_schema.columns
--    where table_schema = 'public' and table_name = 'inquiries'
--    order by column_name;   -- expect ... package, service ...
