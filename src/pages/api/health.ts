// Backend health check (single-backend model).
//
// Public GET /api/health answers in 10 seconds what used to take an
// investigation: is the backend reachable, and is the public site rendering
// live data or the seed fallback? Only anon-readable facts are exposed
// (row counts of public tables, bucket reachability); nothing sensitive.

import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../lib/supabase/database.types";

export const prerender = false;

function env(name: string): string | undefined {
  const fromProcess =
    typeof process !== "undefined" ? (process.env[name] as string | undefined) : undefined;
  const fromMeta = import.meta.env[name] as string | undefined;
  return fromProcess ?? fromMeta ?? undefined;
}

export const GET: APIRoute = async () => {
  const headers = { "content-type": "application/json", "cache-control": "no-store" };
  const url = env("PUBLIC_SUPABASE_URL");
  const anonKey = env("PUBLIC_SUPABASE_ANON_KEY");
  if (!url || !anonKey) {
    return new Response(
      JSON.stringify({ ok: false, source: "seed", reason: "Supabase env missing." }),
      { status: 200, headers },
    );
  }
  try {
    const supabase = createClient<Database>(url, anonKey);
    const [services, packages, gallery, faqs, eventTypes, bucket] = await Promise.all([
      supabase.from("services").select("id", { count: "exact", head: true }),
      supabase.from("packages").select("id", { count: "exact", head: true }),
      supabase.from("gallery_items").select("id", { count: "exact", head: true }),
      supabase.from("faqs").select("id", { count: "exact", head: true }),
      supabase.from("event_types").select("id", { count: "exact", head: true }),
      supabase.storage.from("cms-media").list("", { limit: 1 }),
    ]);
    const errors = [services, packages, gallery, faqs, eventTypes].filter((r) => r.error);
    if (errors.length > 0 || bucket.error) {
      return new Response(
        JSON.stringify({ ok: false, source: "seed", reason: "Database query failed." }),
        { status: 200, headers },
      );
    }
    return new Response(
      JSON.stringify({
        ok: true,
        source: "live",
        counts: {
          services: services.count ?? 0,
          packages: packages.count ?? 0,
          gallery_items: gallery.count ?? 0,
          faqs: faqs.count ?? 0,
          event_types: eventTypes.count ?? 0,
        },
        storageReachable: true,
        time: new Date().toISOString(),
      }),
      { status: 200, headers },
    );
  } catch {
    return new Response(
      JSON.stringify({ ok: false, source: "seed", reason: "Backend unreachable." }),
      { status: 200, headers },
    );
  }
};
