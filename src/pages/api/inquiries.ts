// Inquiry submission endpoint (Phases 10+12, DEC-026, strict delivery DEC-031).
//
// POST /api/inquiries accepts the contact-form payload, re-validates it on
// the server (client validation is usability only), verifies the Turnstile
// token when a secret is configured, stores the inquiry with the privileged
// client (anonymous visitors must not read the table), and forwards it via
// EmailJS. Success is answered only when the inquiry is both stored AND
// accepted for Gmail delivery; delivery failure answers 502 with retry
// guidance (the stored row remains as the recovery receipt the admin sees
// in /admin/inquiries). Nothing secret or internal ever reaches the response.

import type { APIRoute } from "astro";
import { inquirySchema } from "../../lib/validation/inquiry";
import { getSupabaseServiceRole } from "../../lib/supabase/server";

export const prerender = false;

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const EMAILJS_SEND_URL = "https://api.emailjs.com/api/v1.0/email/send";

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

type EmailForwardResult =
  { ok: true } | { ok: false; reason: "misconfigured" | "delivery-failed"; status?: number };

/**
 * EmailJS forward (strict delivery, DEC-031).
 * Returns success only when EmailJS accepts the send. Missing keys and
 * delivery failures are logged server-side by variable name / HTTP status
 * only (never values, never inquiry personal data) and reported as failure
 * so the caller never reports false success.
 */
async function forwardEmailJS(input: Record<string, string>): Promise<EmailForwardResult> {
  const serviceId = env("EMAILJS_SERVICE_ID");
  const templateId = env("EMAILJS_TEMPLATE_ID");
  const publicKey = env("EMAILJS_PUBLIC_KEY");
  const privateKey = env("EMAILJS_PRIVATE_KEY");
  const missing = [
    serviceId ? null : "EMAILJS_SERVICE_ID",
    templateId ? null : "EMAILJS_TEMPLATE_ID",
    publicKey ? null : "EMAILJS_PUBLIC_KEY",
  ].filter((name): name is string => name !== null);
  if (missing.length > 0) {
    console.error(`EmailJS forward skipped. Missing ${missing.join(", ")}.`);
    return { ok: false, reason: "misconfigured" };
  }
  let response: Response;
  try {
    response = await fetch(EMAILJS_SEND_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        ...(privateKey ? { accessToken: privateKey } : {}),
        template_params: { ...input },
      }),
    });
  } catch {
    // Network failure: logged server-side only; the stored record stands.
    console.error("EmailJS forward failed for an inquiry submission.");
    return { ok: false, reason: "delivery-failed" };
  }
  if (!response.ok) {
    const detail = (await response.text().catch(() => "")).slice(0, 200);
    console.error(`EmailJS forward failed with status ${response.status}. ${detail}`);
    return { ok: false, reason: "delivery-failed", status: response.status };
  }
  return { ok: true };
}

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "That submission could not be read. Please try again.");
  }

  const parsed = inquirySchema.safeParse(body);
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
    return fail(
      503,
      "Online enquiries are temporarily unavailable. Please contact us directly instead.",
    );
  }

  const { error } = await supabase.from("inquiries").insert({
    name: data.name,
    email: data.email,
    mobile: data.mobile?.trim() ? data.mobile : null,
    event_date: data.eventDate,
    event_type: data.eventType?.trim() ? data.eventType : null,
    venue: data.venue?.trim() ? data.venue : null,
    guests: data.guests?.trim() ? data.guests : null,
    photobooth: data.photobooth?.trim() ? data.photobooth : null,
    message: data.message?.trim() ? data.message : null,
  });
  if (error) {
    return fail(503, "Your enquiry could not be saved. Please try again or contact us directly.");
  }

  // Strict delivery (DEC-031): the stored row is the recovery receipt the
  // admin sees, but success is reported only when EmailJS accepts the send.
  const emailResult = await forwardEmailJS({
    name: data.name,
    email: data.email,
    mobile: data.mobile ?? "",
    event_date: data.eventDate,
    event_type: data.eventType ?? "",
    venue: data.venue ?? "",
    guests: data.guests ?? "",
    photobooth: data.photobooth ?? "",
    message: data.message ?? "",
  });
  if (!emailResult.ok) {
    return fail(
      502,
      "Your enquiry could not be sent right now. Please try again or contact us directly.",
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};
