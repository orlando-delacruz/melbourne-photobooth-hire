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
//
// Performance: supabase-js (~230 KB) is imported lazily and the connection is
// opened after first paint (requestIdleCallback), so live-sync never blocks
// the initial render or competes with the LCP image.

import type { RealtimeChannel } from "@supabase/supabase-js";
import { getLazySupabase, isBrowserSupabaseConfigured } from "../supabase/lazy";

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
  channel: RealtimeChannel | null;
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

function scheduleIdle(run: () => void): void {
  const idle = (
    window as unknown as {
      requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number;
    }
  ).requestIdleCallback;
  if (typeof idle === "function") idle(run, { timeout: 3000 });
  else window.setTimeout(run, 200);
}

async function connect(table: LiveTable, entry: Entry): Promise<void> {
  try {
    const supabase = await getLazySupabase();
    // The entry may have been torn down while supabase-js was loading.
    if (entries.get(table) !== entry) return;
    entry.channel = supabase
      .channel(`live:${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => notify(table))
      .subscribe();
  } catch {
    // No client (or subscribe failure): content stays as server-rendered.
  }
}

async function teardown(channel: RealtimeChannel): Promise<void> {
  try {
    const supabase = await getLazySupabase();
    await supabase.removeChannel(channel);
  } catch {
    // Tearing down must never throw into unmount.
  }
}

/**
 * Subscribe to any change on a public table. Returns an unsubscribe function.
 * Without Supabase env (or on the server) this is a silent no-op and the
 * caller keeps its SSR initial data.
 */
export function subscribeTable(table: LiveTable, handler: TableHandler): Unsubscribe {
  if (typeof window === "undefined" || !isBrowserSupabaseConfigured()) {
    return () => undefined;
  }
  let entry = entries.get(table);
  if (!entry) {
    entry = { channel: null, handlers: new Set() };
    entries.set(table, entry);
    scheduleIdle(() => {
      void connect(table, entry as Entry);
    });
  }
  entry.handlers.add(handler);
  const current = entry;
  return () => {
    current.handlers.delete(handler);
    if (current.handlers.size === 0 && entries.get(table) === current) {
      entries.delete(table);
      if (current.channel) void teardown(current.channel);
    }
  };
}
