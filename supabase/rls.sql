-- Melbourne Photobooth Hire: Row Level Security (Phase 3).
-- Model: anonymous visitors read only public content and insert inquiries;
-- authenticated admins (public.admin_users) do all CMS CRUD. Never disable RLS.
-- Run after schema.sql in the Supabase SQL editor.

-- Admin helper: true when the caller is allow-listed. Security definer so the
-- anon/authenticated roles can evaluate it inside policies.
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- Enable RLS on every app table.
alter table public.services enable row level security;
alter table public.packages enable row level security;
alter table public.gallery_items enable row level security;
alter table public.faqs enable row level security;
alter table public.event_types enable row level security;
alter table public.testimonials enable row level security;
alter table public.page_contents enable row level security;
alter table public.page_seo enable row level security;
alter table public.inquiries enable row level security;
alter table public.admin_users enable row level security;

-- Drop existing policies for idempotent re-runs.
drop policy if exists "Public read highlighted services" on public.services;
drop policy if exists "Admin full access services" on public.services;
drop policy if exists "Public read highlighted packages" on public.packages;
drop policy if exists "Admin full access packages" on public.packages;
drop policy if exists "Public read highlighted gallery" on public.gallery_items;
drop policy if exists "Admin full access gallery" on public.gallery_items;
drop policy if exists "Public read highlighted faqs" on public.faqs;
drop policy if exists "Admin full access faqs" on public.faqs;
drop policy if exists "Public read event types" on public.event_types;
drop policy if exists "Admin full access event types" on public.event_types;
drop policy if exists "Public read testimonials" on public.testimonials;
drop policy if exists "Admin full access testimonials" on public.testimonials;
drop policy if exists "Public read page contents" on public.page_contents;
drop policy if exists "Admin full access page contents" on public.page_contents;
drop policy if exists "Public read page seo" on public.page_seo;
drop policy if exists "Admin full access page seo" on public.page_seo;
drop policy if exists "Anonymous insert inquiries" on public.inquiries;
drop policy if exists "Admin full access inquiries" on public.inquiries;
drop policy if exists "Users read own admin row" on public.admin_users;
drop policy if exists "Admins read admin list" on public.admin_users;

-- Modules: public sees highlighted items only; admins manage everything.
create policy "Public read highlighted services" on public.services
  for select to anon using (highlight = true);
create policy "Admin full access services" on public.services
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Public read highlighted packages" on public.packages
  for select to anon using (highlight = true);
create policy "Admin full access packages" on public.packages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Public read highlighted gallery" on public.gallery_items
  for select to anon using (highlight = true);
create policy "Admin full access gallery" on public.gallery_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Public read highlighted faqs" on public.faqs
  for select to anon using (highlight = true);
create policy "Admin full access faqs" on public.faqs
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Event types: whole list is public (contact dropdown); writes are admin-only.
create policy "Public read event types" on public.event_types
  for select to anon using (true);
create policy "Admin full access event types" on public.event_types
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Testimonials (DEC-034): whole list is public (homepage marquee shows every
-- saved item in order); writes are admin-only.
create policy "Public read testimonials" on public.testimonials
  for select to anon using (true);
create policy "Admin full access testimonials" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Page copy + SEO: public read; writes are admin-only.
create policy "Public read page contents" on public.page_contents
  for select to anon using (true);
create policy "Admin full access page contents" on public.page_contents
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Public read page seo" on public.page_seo
  for select to anon using (true);
create policy "Admin full access page seo" on public.page_seo
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Inquiries: anonymous visitors can only insert (no read/update/delete);
-- admins can list, view and delete. Private inquiry data is never public.
create policy "Anonymous insert inquiries" on public.inquiries
  for insert to anon with check (
    char_length(trim(name)) > 0 and char_length(email) > 3 and char_length(trim(event_date)) > 0
  );
create policy "Admin full access inquiries" on public.inquiries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Admin allow-list: users can read their own row (lets the app detect admin
-- status); only existing admins can enumerate the list. Inserts happen via a
-- privileged path (SQL editor or a bootstrapping script), never via anon.
create policy "Users read own admin row" on public.admin_users
  for select to authenticated using (user_id = auth.uid());
create policy "Admins read admin list" on public.admin_users
  for select to authenticated using (public.is_admin());

-- Manual test matrix (run as anon / authed non-admin / authed admin):
--   anon: select highlighted services ok; select non-highlighted hidden;
--   anon: insert into inquiries ok; select from inquiries denied;
--   non-admin authed: insert/update/delete on services denied;
--   admin authed: full CRUD on all tables ok.
