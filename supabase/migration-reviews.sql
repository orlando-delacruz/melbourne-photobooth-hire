-- Review moderation states (DEC-035).
-- Adds the moderated-review workflow to the testimonials table: public
-- reads serve approved reviews only, and visitor submissions arrive as
-- pending through POST /api/reviews (service-role insert). Existing rows
-- are backfilled to approved so current public content is preserved.
-- Idempotent: safe to run even if the DEC-034 migration or a previous
-- attempt partially applied. Run in the Supabase SQL editor after
-- schema.sql, then verify with:
--   select slug, status from public.testimonials order by sort_order;
--   (anon) select count(*) from public.testimonials;  -- approved rows only

-- Moderation states shared by the CMS ReviewStatus union.
do $$ begin
  create type review_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

-- Column (fail-closed default: unreviewed rows stay invisible).
alter table public.testimonials
  add column if not exists status review_status not null default 'pending';

-- Backfill rows created before moderation existed. Run once at rollout,
-- before the review form goes live: pending rows created after that point
-- are genuine awaiting-moderation submissions and must NOT be re-run
-- through this update.
update public.testimonials set status = 'approved' where status = 'pending';

-- Public reads filter approved reviews in display order.
create index if not exists idx_testimonials_status_order
  on public.testimonials (status, sort_order);

-- Anonymous visitors read approved reviews only. There is deliberately no
-- anonymous insert/update/delete policy: submissions go through the server
-- endpoint, which sets status pending with the service-role client.
drop policy if exists "Public read testimonials" on public.testimonials;
drop policy if exists "Public read approved testimonials" on public.testimonials;
create policy "Public read approved testimonials" on public.testimonials
  for select to anon using (status = 'approved');
