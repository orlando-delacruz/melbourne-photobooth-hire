// Customer review submission endpoint (DEC-035).
//
// POST /api/reviews accepts the review-modal payload, re-validates it on
// the server (client validation is usability only), verifies the Turnstile
// token when a secret is configured, and stores the review with the
// privileged client as pending. Moderation status is hardcoded server-side:
// visitors can never choose it, and there is deliberately no anonymous
// insert policy on the testimonials table, so it cannot be forged from the
// browser either. Admins approve or reject reviews in the Testimonials
// module; approved reviews reach the public marquee through the existing
// realtime subscription (RLS serves approved rows only). Nothing secret or
// internal ever reaches the response.

import type { APIRoute } from "astro";
import { reviewSchema } from "../../lib/validation/review";
import { getSupabaseServiceRole } from "../../lib/supabase/server";
import { createId } from "../../lib/cms/ids";

export const prerender = false;

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function env(name: string): string | undefined {
  const fromProcess =
    typeof process !== "undefined" ? (process.env[name] as string | undefined) : undefined;
  const fromMeta = import.meta.env[name] as string | undefined;
  return fromProcess ?? fromMeta ?? undefined;
}

function fail(status: number, message: string): Response {
  return new Response(JSON.stringify({ ok: false, message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function verifyTurnstile(secret: string, token: string): Promise<boolean> {
  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = (await response.json().catch(() => null)) as { success?: unknown } | null;
    return data?.success === true;
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "That review could not be read. Please try again.");
  }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return fail(400, "Some fields need attention before sending.");
  }
  const data = parsed.data;

  const turnstileSecret = env("TURNSTILE_SECRET_KEY");
  if (turnstileSecret) {
    const token =
      body && typeof body === "object"
        ? (body as { turnstileToken?: unknown }).turnstileToken
        : undefined;
    if (typeof token !== "string" || !token) {
      return fail(400, "Spam protection did not complete. Please try again.");
    }
    if (!(await verifyTurnstile(turnstileSecret, token))) {
      return fail(400, "Spam protection did not pass. Please try again.");
    }
  }

  let supabase;
  try {
    supabase = getSupabaseServiceRole();
  } catch {
    return fail(503, "Review submissions are temporarily unavailable. Please try again later.");
  }

  // New reviews append after the current list so approvals land at the end
  // of the marquee in submission order.
  const { data: latest, error: orderError } = await supabase
    .from("testimonials")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (orderError) {
    return fail(503, "Your review could not be saved. Please try again later.");
  }
  const sortOrder = (latest?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("testimonials").insert({
    slug: createId("testimonial"),
    name: data.name,
    event_type: data.eventType,
    rating: data.rating,
    quote: data.quote,
    status: "pending",
    sort_order: sortOrder,
  });
  if (error) {
    return fail(503, "Your review could not be saved. Please try again later.");
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};
