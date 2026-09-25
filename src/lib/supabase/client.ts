// Browser-safe Supabase client (anon key only).
//
// Free-tier notes: no realtime, no polling here. Public pages and admin
// islands share this singleton for RLS-scoped reads/writes. The service-role
// key must never be imported into client code; see server.ts.
//
// Sessions persist in cookies (via @supabase/ssr) rather than localStorage so
// the server middleware can read them and guard /admin/* routes.

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

let browserClient: SupabaseClient<Database> | null = null;

/** True when the public Supabase env vars are present (browser only). */
export function isSupabaseConfigured(): boolean {
  return Boolean(import.meta.env.PUBLIC_SUPABASE_URL && import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseBrowser(): SupabaseClient<Database> {
  if (browserClient) return browserClient;
  const url = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  browserClient = createBrowserClient<Database>(url, anonKey);
  return browserClient;
}
