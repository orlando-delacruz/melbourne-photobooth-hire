// Lazy browser Supabase access for public islands (perf).
//
// Realtime and live-refetch are enhancements layered on top of the
// server-rendered content (DEC-033), so supabase-js (~230 KB) does not need
// to sit on the critical path. Static imports of this module stay tiny; the
// dynamic import() below is code-split, so the library only downloads when a
// live island first needs it, after the page has already painted.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/** True when the public Supabase env vars are present (browser only). */
export function isBrowserSupabaseConfigured(): boolean {
  return Boolean(import.meta.env.PUBLIC_SUPABASE_URL && import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
}

let clientPromise: Promise<SupabaseClient<Database>> | null = null;

/** Resolves the shared browser client, loading supabase-js on first use. */
export function getLazySupabase(): Promise<SupabaseClient<Database>> {
  clientPromise ??= import("./client").then((mod) => mod.getSupabaseBrowser());
  return clientPromise;
}
