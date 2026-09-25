-- Melbourne Photobooth Hire: Storage bucket + policies (Phase 5).
-- One public bucket (cms-media) for all CMS uploads. Files stay small
-- (2 MB cap enforced in the app, matching IMAGE_MAX_BYTES) for the free tier.
-- Run in the Supabase SQL editor after schema.sql + rls.sql.

insert into storage.buckets (id, name, public)
values ('cms-media', 'cms-media', true)
on conflict (id) do nothing;

drop policy if exists "Public read cms media" on storage.objects;
drop policy if exists "Admin write cms media" on storage.objects;
drop policy if exists "Admin update cms media" on storage.objects;
drop policy if exists "Admin delete cms media" on storage.objects;

-- Anyone can read served images (public <img> tags, OG images).
create policy "Public read cms media" on storage.objects
  for select to anon using (bucket_id = 'cms-media');

-- Only allow-listed admins can upload/replace (keeps the 1 GB free quota safe).
create policy "Admin write cms media" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'cms-media' and public.is_admin()
  );

create policy "Admin update cms media" on storage.objects
  for update to authenticated using (
    bucket_id = 'cms-media' and public.is_admin()
  ) with check (
    bucket_id = 'cms-media' and public.is_admin()
  );

create policy "Admin delete cms media" on storage.objects
  for delete to authenticated using (
    bucket_id = 'cms-media' and public.is_admin()
  );

-- Free-tier hygiene: keep originals small before upload (client-side resize
-- lands with the storage lib in Phase 5); delete orphaned keys on replace.
