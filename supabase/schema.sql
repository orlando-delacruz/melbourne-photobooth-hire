-- Melbourne Photobooth Hire: Supabase schema (Phase 2).
-- Free-tier lean: no realtime, no extensions beyond pgcrypto, minimal indexes.
-- Mirrors src/lib/cms/types.ts + validation caps in src/lib/cms/schemas.ts.
-- Run once in the Supabase SQL editor, then rls.sql, storage.sql, seed.sql.

create extension if not exists "pgcrypto";

-- Badge enums mirror the CMS badgeType unions (services have no "none").
do $$ begin
  create type service_badge as enum ('basic', 'most-popular', 'best-value', 'custom');
exception when duplicate_object then null; end $$;

do $$ begin
  create type package_badge as enum ('none', 'basic', 'most-popular', 'best-value', 'custom');
exception when duplicate_object then null; end $$;

-- Reusable updated_at trigger.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Services module (mod-services).
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null check (char_length(name) between 1 and 200),
  badge_type service_badge not null default 'basic',
  custom_badge text not null default '' check (char_length(custom_badge) <= 60),
  tagline text check (tagline is null or char_length(tagline) <= 200),
  summary text not null check (char_length(summary) between 1 and 1000),
  highlights text[] not null default '{}',
  icon text check (icon is null or char_length(icon) <= 40),
  image_key text,
  image_src text not null default '' check (char_length(image_src) <= 2000),
  image_alt text not null default '' check (char_length(image_alt) <= 300),
  highlight boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_custom_badge_required
    check (badge_type <> 'custom' or char_length(trim(custom_badge)) > 0)
);

-- Packages module (mod-packages).
create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null check (char_length(name) between 1 and 200),
  summary text not null check (char_length(summary) between 1 and 1000),
  duration_label text not null check (char_length(duration_label) between 1 and 60),
  price_label text not null check (char_length(price_label) between 1 and 60),
  badge_type package_badge not null default 'none',
  custom_badge text not null default '' check (char_length(custom_badge) <= 60),
  inclusions text[] not null default '{}',
  image_key text,
  image_src text not null default '' check (char_length(image_src) <= 2000),
  image_alt text not null default '' check (char_length(image_alt) <= 300),
  highlight boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint packages_custom_badge_required
    check (badge_type <> 'custom' or char_length(trim(custom_badge)) > 0)
);

-- Gallery module (mod-gallery, max 60 items enforced in app).
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  image_key text,
  image_src text not null default '' check (char_length(image_src) <= 2000),
  image_alt text not null check (char_length(image_alt) between 1 and 300),
  caption text not null default '' check (char_length(caption) <= 200),
  highlight boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- FAQs module (mod-faqs, max 60 items enforced in app).
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  question text not null check (char_length(question) between 1 and 300),
  answer text not null check (char_length(answer) between 1 and 6000),
  highlight boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Event Types module (mod-event-types, order = dropdown order).
create table if not exists public.event_types (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  label text not null check (char_length(label) between 1 and 80),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Page-level CMS copy (7 pages + settings). Shapes differ per page, so the
-- validated content blob stays JSONB; Zod schemas remain the validator.
create table if not exists public.page_contents (
  page_key text primary key
    check (page_key in ('home','services','packages','gallery','about','faq','contact','settings')),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Per-page SEO (9 pages: 7 CMS + privacy/terms). Mirrors PageMeta.
create table if not exists public.page_seo (
  page_key text primary key
    check (page_key in ('home','services','packages','gallery','about','faq','contact','privacy','terms')),
  seo_title text not null check (char_length(seo_title) between 1 and 120),
  seo_description text not null check (char_length(seo_description) between 1 and 400),
  keywords text not null default '',
  canonical_url text not null default '',
  og_title text not null default '',
  og_description text not null default '',
  og_image_key text,
  og_image_src text not null default '',
  og_image_alt text not null default '',
  noindex boolean not null default false,
  nofollow boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Inquiries (conditional persistence; minimal fields per REQ-INQ-011).
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  mobile text check (mobile is null or char_length(mobile) <= 40),
  event_date text not null check (char_length(event_date) between 1 and 40),
  event_type text check (event_type is null or char_length(event_type) <= 80),
  venue text check (venue is null or char_length(venue) <= 300),
  guests text check (guests is null or char_length(guests) <= 60),
  photobooth text check (photobooth is null or char_length(photobooth) <= 60),
  message text check (message is null or char_length(message) <= 6000),
  created_at timestamptz not null default now()
);

-- Admin allow-list. Insert the first admin's auth.users id manually after
-- creating the user in Supabase Auth (see rls.sql for the is_admin helper).
create table if not exists public.admin_users (
  user_id uuid primary key,
  created_at timestamptz not null default now()
);

-- updated_at triggers.
drop trigger if exists trg_services_touch on public.services;
create trigger trg_services_touch before update on public.services
  for each row execute function public.touch_updated_at();
drop trigger if exists trg_packages_touch on public.packages;
create trigger trg_packages_touch before update on public.packages
  for each row execute function public.touch_updated_at();
drop trigger if exists trg_gallery_touch on public.gallery_items;
create trigger trg_gallery_touch before update on public.gallery_items
  for each row execute function public.touch_updated_at();
drop trigger if exists trg_faqs_touch on public.faqs;
create trigger trg_faqs_touch before update on public.faqs
  for each row execute function public.touch_updated_at();
drop trigger if exists trg_page_contents_touch on public.page_contents;
create trigger trg_page_contents_touch before update on public.page_contents
  for each row execute function public.touch_updated_at();
drop trigger if exists trg_page_seo_touch on public.page_seo;
create trigger trg_page_seo_touch before update on public.page_seo
  for each row execute function public.touch_updated_at();

-- Lean indexes for the free tier: highlight filters, ordering, recency.
create index if not exists idx_services_highlight on public.services (highlight, sort_order);
create index if not exists idx_packages_highlight on public.packages (highlight, sort_order);
create index if not exists idx_gallery_highlight on public.gallery_items (highlight, sort_order);
create index if not exists idx_faqs_highlight on public.faqs (highlight, sort_order);
create index if not exists idx_event_types_order on public.event_types (sort_order);
create index if not exists idx_inquiries_created on public.inquiries (created_at desc);
