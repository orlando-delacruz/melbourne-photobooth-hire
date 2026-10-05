// GA4 conversion events (Phase 1A, DEC-052).
//
// Browser-only helper around the env-gated GA4 install in BaseLayout. When the
// measurement ID is blank no gtag function exists, so every call is a no-op and
// nothing is sent. No personally identifiable information is ever forwarded:
// only event names and non-PII context (location labels, form/service/package
// names, destination paths).
//
// Conversion events are dispatched from one delegated click listener so that
// server-rendered markup (header, footer, hero, trust strip) and hydrated
// islands are covered without per-component wiring. The inquiry form calls
// trackEvent("generate_lead") itself after a successful API response.

export type AnalyticsEventName =
  "generate_lead" | "phone_click" | "email_click" | "booking_cta_click" | "messenger_click";

type EventParams = Record<string, string | number | boolean | undefined>;

interface GtagWindow extends Window {
  gtag?: (...args: unknown[]) => void;
}

/** Send one GA4 event. Safe no-op on the server or when GA4 is disabled. */
export function trackEvent(name: AnalyticsEventName, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  const gtag = (window as GtagWindow).gtag;
  if (typeof gtag !== "function") return;
  const clean: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") clean[key] = value;
  }
  gtag("event", name, clean);
}

/** Nearest labelled region, used as the non-PII `link_location` parameter. */
function linkLocation(element: Element): string {
  const marked = element.closest<HTMLElement>("[data-ga-location]");
  if (marked?.dataset.gaLocation) return marked.dataset.gaLocation;
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  const section = element.closest<HTMLElement>("section[id]");
  if (section?.id) return section.id;
  return "page";
}

let started = false;

/**
 * Install the delegated conversion listener once per page. Idempotent so a
 * double import can never attach the listener twice.
 */
export function initAnalytics(): void {
  if (typeof window === "undefined" || started) return;
  started = true;

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      const location = linkLocation(anchor);

      if (href.startsWith("tel:")) {
        trackEvent("phone_click", { link_location: location });
        return;
      }
      if (href.startsWith("mailto:")) {
        trackEvent("email_click", { link_location: location });
        return;
      }
      if (href.includes("m.me/") || anchor.hasAttribute("data-ga-messenger")) {
        trackEvent("messenger_click", { link_location: location });
        return;
      }
      if (anchor.hasAttribute("data-ga-cta")) {
        let destination: string | undefined;
        let service: string | undefined;
        let pkg: string | undefined;
        try {
          const url = new URL(anchor.href, window.location.origin);
          destination = url.pathname;
          service = url.searchParams.get("service") ?? undefined;
          pkg = url.searchParams.get("package") ?? undefined;
        } catch {
          // Fall back to the raw href when URL parsing fails.
          destination = href;
        }
        trackEvent("booking_cta_click", {
          link_location: location,
          destination,
          service,
          package: pkg,
        });
      }
    },
    { passive: true },
  );
}
