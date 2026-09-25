// Server-only Supabase clients. Never import this file from React islands or
// any other browser-bundled code: it can access the service-role key, which
// bypasses Row Level Security and must stay in server endpoints/middleware.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

function requiredEnv(name: string): string {
  const value = process.env[name] ?? import.meta.env[name];
  if (!value) throw new Error(`Supabase server misconfigured. Missing ${name}.`);
  return value as string;
}

/** RLS-scoped server client (anon key). Respects policies like the browser. */
export function getSupabaseServerAnon(): SupabaseClient<Database> {
  const url = requiredEnv("PUBLIC_SUPABASE_URL");
  const anonKey = requiredEnv("PUBLIC_SUPABASE_ANON_KEY");
  return createClient<Database>(url, anonKey);
}

/**
 * Privileged server client (service-role key). Bypasses RLS.
 * Use only in server endpoints for operations anonymous users must not do
 * directly, e.g. inserting inquiry records or sending delivery emails.
 */
export function getSupabaseServiceRole(): SupabaseClient<Database> {
  const url = requiredEnv("PUBLIC_SUPABASE_URL");
  const serviceKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
