// Shared Supabase Realtime channel registry (DEC-033).
//
// One refcounted channel per public table: any number of components can
// subscribe to the same table without duplicate websocket subscriptions.
// Realtime is an enhancement — subscribe failures, drops and timeouts only
// stop future patches; rendered content always stays. Nothing here ever
// surfaces an error to visitors; reconnection is realtime-js native.
//
// Security: callers subscribe only to already-public tables (the eight in
// supabase/migration-realtime.sql). RLS filters every event before delivery,
// and admin-only tables are never subscribed. Browser-only: subscribe from
// inside useEffect so server rendering never touches the socket.

import type { RealtimeChannel } from "@supabase/supabase-js";
import { getSupabaseBrowser, isSupabaseConfigured } from "../supabase/client";

export type LiveTable =
  | "services"
  | "packages"
  | "gallery_items"
  | "faqs"
  | "testimonials"
  | "event_types"
  | "page_contents"
  | "page_seo";

export type TableHandler = () => void;
export type Unsubscribe = () => void;

interface Entry {
  channel: RealtimeChannel;
  handlers: Set<TableHandler>;
}

const entries = new Map<LiveTable, Entry>();

function notify(table: LiveTable): void {
  const entry = entries.get(table);
  if (!entry) return;
  for (const handler of entry.handlers) {
    try {
      handler();
    } catch {
      // One bad handler must never break the others.
    }
  }
}

/**
 * Subscribe to any change on a public table. Returns an unsubscribe function.
 * Without Supabase env (or on the server) this is a silent no-op and the
 * caller keeps its SSR initial data.
 */
export function subscribeTable(table: LiveTable, handler: TableHandler): Unsubscribe {
  if (typeof window === "undefined" || !isSupabaseConfigured()) {
    return () => undefined;
  }
  let entry = entries.get(table);
  if (!entry) {
    let created: RealtimeChannel;
    try {
      created = getSupabaseBrowser()
        .channel(`live:${table}`)
        .on("postgres_changes", { event: "*", schema: "public", table }, () => notify(table))
        .subscribe();
    } catch {
      return () => undefined;
    }
    entry = { channel: created, handlers: new Set() };
    entries.set(table, entry);
  }
  entry.handlers.add(handler);
  const current = entry;
  return () => {
    current.handlers.delete(handler);
    if (current.handlers.size === 0 && entries.get(table) === current) {
      entries.delete(table);
      try {
        void getSupabaseBrowser().removeChannel(current.channel);
      } catch {
        // Tearing down must never throw into unmount.
      }
    }
  };
}
