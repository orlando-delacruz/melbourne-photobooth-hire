-- Melbourne Photobooth Hire: Realtime publication (DEC-033).
--
-- Adds the public CMS tables to the supabase_realtime publication so open
-- public pages can subscribe to postgres_changes and patch their UI without
-- a manual refresh. Admin-only tables (inquiries, admin_users) are
-- deliberately excluded: public realtime must never carry private data.
--
-- RLS still applies: anon subscriptions receive only rows the existing
-- SELECT policies allow (highlighted module items; all page_contents,
-- page_seo and event_types rows). Run once in the Supabase SQL editor.
-- Idempotent: already-added tables are skipped.

do $$
declare
  target text;
begin
  for target in
    select unnest(array[
      'public.services',
      'public.packages',
      'public.gallery_items',
      'public.faqs',
      'public.event_types',
      'public.page_contents',
      'public.page_seo'
    ])
  loop
    if not exists (
      select 1
        from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = split_part(target, '.', 1)
         and tablename = split_part(target, '.', 2)
    ) then
      execute format('alter publication supabase_realtime add table %s', target);
    end if;
  end loop;
end
$$;
