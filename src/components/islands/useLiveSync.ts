// Live-sync React hooks (DEC-033): initial SSR props + Realtime patching.
//
// Pattern per subscription:
//   mount -> render initial rows -> subscribe -> event -> debounced refetch
//   of THAT table only -> setState -> UI patches. Unmount unsubscribes.
//
// A debounced table-scoped refetch (not per-row payload patching) is the
// update mechanism: under RLS, UPDATE payloads for rows losing visibility
// arrive without the new record, and admin saves rewrite whole lists
// (upsert-all + delete-missing, including reorders). One small query per
// burst is obviously correct and never a full-site refetch. Refetch failures
// keep the last good state and retry on the next event.

import { useEffect, useRef, useState } from "react";
import { subscribeTable } from "../../lib/realtime/channels";
import type { LiveTable } from "../../lib/realtime/channels";

const BURST_WINDOW_MS = 350;

/** Live list for a module table; `refetch` returns the public rows in order. */
export function useLiveRows<T>(table: LiveTable, initial: T[], refetch: () => Promise<T[]>): T[] {
  const [rows, setRows] = useState<T[]>(initial);
  const refetchRef = useRef(refetch);
  refetchRef.current = refetch;

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    const unsubscribe = subscribeTable(table, () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        void (async () => {
          try {
            const next = await refetchRef.current();
            if (!cancelled) setRows(next);
          } catch {
            // Keep last good content; the next event retries.
          }
        })();
      }, BURST_WINDOW_MS);
    });
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, [table]);

  return rows;
}

/** Live single document (one page_contents / page_seo key). */
export function useLiveDoc<T>(
  table: LiveTable,
  key: string,
  initial: T,
  refetch: () => Promise<T>,
): T {
  const [doc, setDoc] = useState<T>(initial);
  const refetchRef = useRef(refetch);
  refetchRef.current = refetch;

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    const unsubscribe = subscribeTable(table, () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        void (async () => {
          try {
            const next = await refetchRef.current();
            if (!cancelled) setDoc(next);
          } catch {
            // Keep last good content; the next event retries.
          }
        })();
      }, BURST_WINDOW_MS);
    });
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, [table, key]);

  return doc;
}
