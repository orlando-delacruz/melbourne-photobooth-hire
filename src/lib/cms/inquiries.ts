// Admin inquiries: frontend-only stage.
//
// Sample records seeded until the backend stores real submissions; deletions
// persist per browser by id so the list stays accurate between sessions. The
// source interface is shaped like the future backend API.

import type { InquiryInput } from "../validation/inquiry";

/** An enquiry submitted through the public contact form. */
export interface AdminInquiry extends InquiryInput {
  id: string;
  submittedAt: string;
}

const DELETED_KEY = "mph-inq-deleted";

function readDeleted(): string[] {
  try {
    const raw = window.localStorage.getItem(DELETED_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function isoDaysAgo(days: number, hour: number, minute: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

const SAMPLE_INQUIRIES: AdminInquiry[] = [
  {
    id: "inq-001",
    name: "Sarah Nguyen",
    email: "sarah.nguyen@example.com",
    mobile: "0412 345 678",
    eventDate: "2026-11-14",
    eventType: "Wedding",
    venue: "Yarra Valley estate",
    guests: "120",
    photobooth: "Premium",
    message: "Outdoor wedding, looking for the premium booth from 4pm.",
    submittedAt: isoDaysAgo(0, 9, 42),
  },
  {
    id: "inq-002",
    name: "Marcus Reid",
    email: "marcus.reid@example.com",
    mobile: "0407 111 222",
    eventDate: "2026-12-05",
    eventType: "Corporate Event",
    venue: "Collins Street venue",
    guests: "80",
    photobooth: "360",
    message: "End-of-year function, 360 booth preferred.",
    submittedAt: isoDaysAgo(0, 8, 15),
  },
  {
    id: "inq-003",
    name: "Aisha Thompson",
    email: "aisha.t@example.com",
    mobile: "0433 987 654",
    eventDate: "2026-10-31",
    eventType: "Birthday",
    venue: "Brunswick hall",
    guests: "40",
    photobooth: "Roaming",
    message: "",
    submittedAt: isoDaysAgo(2, 17, 8),
  },
  {
    id: "inq-004",
    name: "Tom & Ellie",
    email: "tom.ellie@example.com",
    mobile: "0400 555 888",
    eventDate: "2027-02-20",
    eventType: "Engagement Party",
    venue: "",
    guests: "60",
    photobooth: "Not Sure",
    message: "Engagement party in February, which booth would you suggest?",
    submittedAt: isoDaysAgo(5, 20, 31),
  },
  {
    id: "inq-005",
    name: "Grace Liu",
    email: "grace.liu@example.com",
    mobile: "0421 222 333",
    eventDate: "2026-11-28",
    eventType: "School Formal",
    venue: "Box Hill venue",
    guests: "150",
    photobooth: "Premium",
    message: "School formal, need a quote for three hours.",
    submittedAt: isoDaysAgo(12, 11, 5),
  },
  {
    id: "inq-006",
    name: "Jack Morrison",
    email: "jack.m@example.com",
    mobile: "",
    eventDate: "2026-12-19",
    eventType: "Christmas/End-of-Year",
    venue: "",
    guests: "",
    photobooth: "",
    message: "Checking availability before Christmas.",
    submittedAt: isoDaysAgo(20, 14, 47),
  },
];

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

class MockAdminInquirySource implements AdminInquirySource {
  async list(): Promise<AdminInquiry[]> {
    const deleted = readDeleted();
    return SAMPLE_INQUIRIES.filter((inquiry) => !deleted.includes(inquiry.id)).map((inquiry) => ({
      ...inquiry,
    }));
  }

  async get(id: string): Promise<AdminInquiry | null> {
    const found = await this.list();
    return found.find((inquiry) => inquiry.id === id) ?? null;
  }

  async remove(id: string): Promise<void> {
    const deleted = readDeleted();
    if (!deleted.includes(id)) deleted.push(id);
    window.localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
  }
}

/** The mock data source for the frontend-only admin. Accepts the source so tests can substitute a stub. */
export const adminInquirySource: AdminInquirySource = new MockAdminInquirySource();

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
