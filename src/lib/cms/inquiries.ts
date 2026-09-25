// Admin inquiry shapes and display helpers. Records live in Supabase (see
// lib/supabase/inquiries.ts); there is no mock source or sample data.

import type { InquiryInput } from "../validation/inquiry";

/** An enquiry submitted through the public contact form. */
export interface AdminInquiry extends InquiryInput {
  id: string;
  submittedAt: string;
}

/** Full record for the detail view, including optional fields. */
export interface AdminInquiryRecord extends AdminInquiry {
  venue: string;
  guests: string;
  mobile: string;
  message: string;
}

export interface AdminInquirySource {
  list(): Promise<AdminInquiry[]>;
  get(id: string): Promise<AdminInquiry | null>;
  remove(id: string): Promise<void>;
}

export function byNewest(a: AdminInquiry, b: AdminInquiry): number {
  return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
}

export function formatInquiryDate(value: string): string {
  try {
    return new Date(value).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

export function formatInquiryDateTime(value: string): string {
  try {
    return new Date(value).toLocaleString("en-AU", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

/** Gmail compose deep link: opens a fresh Gmail message with the recipient prefilled. */
export function gmailComposeUrl(to: string, subject: string): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}`;
}
