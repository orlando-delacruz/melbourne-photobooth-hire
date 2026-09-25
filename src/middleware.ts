// Admin route guard (DEC-025).
//
// Every /admin/* page except /admin/login is server-rendered, so this
// middleware runs on Vercel before any admin HTML is served. It enforces
// Supabase Auth + the admin_users allow-list; the browser session lives in
// cookies (see lib/supabase/client.ts) so the server can read it here.
//
// When Supabase env vars are absent (pre-provisioning local dev), the guard
// passes through to preserve the previous open-dashboard behavior.

import { createServerClient } from "@supabase/ssr";
import type { AstroCookieSetOptions } from "astro";
import { defineMiddleware } from "astro:middleware";

const LOGIN_PATH = "/admin/login";

function supabaseEnv(): { url: string; anonKey: string } | null {
  const url = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;
  return url && anonKey ? { url, anonKey } : null;
}

/** Split a Cookie header into name/value pairs (split on the first "=" only). */
function parseCookies(header: string): { name: string; value: string }[] {
  const pairs: { name: string; value: string }[] = [];
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index < 1) continue;
    pairs.push({ name: part.slice(0, index).trim(), value: part.slice(index + 1).trim() });
  }
  return pairs;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname.replace(/\/+$/, "") || "/";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  if (!isAdminRoute || pathname === LOGIN_PATH) return next();

  const env = supabaseEnv();
  if (!env) return next();

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll: () => parseCookies(context.request.headers.get("cookie") ?? ""),
      setAll: (cookiesToSet) => {
        for (const { name, value, options } of cookiesToSet) {
          context.cookies.set(name, value, options as AstroCookieSetOptions);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return context.redirect(LOGIN_PATH, 302);

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!adminRow) {
    await supabase.auth.signOut();
    return context.redirect(LOGIN_PATH, 302);
  }

  return next();
});
