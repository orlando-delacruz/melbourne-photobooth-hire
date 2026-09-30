// On-demand Cloudflare Turnstile loader.
//
// The Turnstile script (~27 KB) is only useful when a protected form is
// actually shown. Pages no longer inject it globally; the inquiry island and
// the review modal call ensureTurnstile() when their widget mounts, so
// browsing pages that never open a form never pay for it. The script is
// injected once and the returned promise resolves when window.turnstile is
// ready to render.

const SCRIPT_ID = "cf-turnstile-script";
const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

type TurnstileGlobal = { turnstile?: unknown };

let loader: Promise<void> | null = null;

export function ensureTurnstile(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as TurnstileGlobal).turnstile) return Promise.resolve();
  if (loader) return loader;

  loader = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");
    if (!existing) {
      script.id = SCRIPT_ID;
      script.src = SRC;
      script.async = true;
      script.defer = true;
      script.addEventListener("load", () => resolve(), { once: true });
      script.addEventListener(
        "error",
        () => reject(new Error("Turnstile script failed to load.")),
        { once: true },
      );
      document.head.appendChild(script);
    } else if ((window as TurnstileGlobal).turnstile) {
      resolve();
    } else {
      script.addEventListener("load", () => resolve(), { once: true });
      script.addEventListener(
        "error",
        () => reject(new Error("Turnstile script failed to load.")),
        { once: true },
      );
    }
  });

  return loader;
}
