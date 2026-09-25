// Supabase adapter for admin inquiries (Phase 10, DEC-026).
//
// Reads and deletes inquiry records through the authenticated session (the
// middleware guarantees an allow-listed admin). Anonymous visitors can only
// insert via POST /api/inquiries and can never list the table.
// Unconfigured env falls back to the mock source so dev stays usable.

import { getSupabaseBrowser, isSupabaseConfigured } from "./client";
import { adminInquirySource, type AdminInquiry, type AdminInquirySource } from "../cms/inquiries";

function rowToInquiry(row: {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  event_date: string;
  event_type: string | null;
  venue: string | null;
  guests: string | null;
  photobooth: string | null;
  message: string | null;
  created_at: string;
}): AdminInquiry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    mobile: row.mobile ?? undefined,
    eventDate: row.event_date,
    eventType: row.event_type ?? undefined,
    venue: row.venue ?? undefined,
    guests: row.guests ?? undefined,
    photobooth: row.photobooth ?? undefined,
    message: row.message ?? undefined,
    submittedAt: row.created_at,
  };
}

export const liveInquirySource: AdminInquirySource = {
  async list(): Promise<AdminInquiry[]> {
    const { data, error } = await getSupabaseBrowser()
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Inquiries could not be loaded.");
    return (data ?? []).map(rowToInquiry);
  },

  async get(id: string): Promise<AdminInquiry | null> {
    const { data, error } = await getSupabaseBrowser()
      .from("inquiries")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error("Inquiry could not be loaded.");
    return data ? rowToInquiry(data) : null;
  },

  async remove(id: string): Promise<void> {
    const { error } = await getSupabaseBrowser().from("inquiries").delete().eq("id", id);
    if (error) throw new Error("Inquiry could not be deleted.");
  },
};

/** Live source when configured, mock source otherwise. */
export function inquirySource(): AdminInquirySource {
  return isSupabaseConfigured() ? liveInquirySource : adminInquirySource;
}
