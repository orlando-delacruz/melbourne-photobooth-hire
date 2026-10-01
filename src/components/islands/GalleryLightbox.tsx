import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface LightboxItem {
  src: string;
  alt: string;
  caption?: string;
}

const SELECTOR = "[data-lightbox]";
/** Must match the exit transition on .lb (styles/gallery-lightbox.css). */
const EXIT_MS = 300;

function readItems(): LightboxItem[] {
  return Array.from(document.querySelectorAll<HTMLAnchorElement>(SELECTOR)).map((anchor) => {
    const img = anchor.querySelector("img");
    return {
      src: anchor.dataset.full || anchor.getAttribute("href") || img?.currentSrc || img?.src || "",
      alt: img?.alt ?? "",
      caption: anchor.dataset.caption || undefined,
    };
  });
}

/**
 * Gallery lightbox. Progressive enhancement: every gallery image is a
 * server-rendered link that opens the full image on its own, and this island
 * upgrades the click into an accessible dialog (focus in/return, Escape,
 * arrow-key navigation, focus trap). Hydrated only on pages that ship
 * gallery links.
 */
interface GalleryLightboxProps {
  /** When mounted on demand by a trigger click, open that image immediately. */
  initialAnchor?: HTMLAnchorElement;
}

export default function GalleryLightbox({ initialAnchor }: GalleryLightboxProps) {
  const [items, setItems] = useState<LightboxItem[]>([]);
  const [index, setIndex] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const exitTimerRef = useRef<number | undefined>(undefined);

  const isOpen = index !== null;

  const close = useCallback(() => {
    setShown(false);
    window.clearTimeout(exitTimerRef.current);
    exitTimerRef.current = window.setTimeout(() => setIndex(null), EXIT_MS);
  }, []);

  const step = useCallback(
    (delta: number) => {
      setIndex((current) => {
        if (current === null || items.length === 0) return current;
        return (current + delta + items.length) % items.length;
      });
    },
    [items.length],
  );

  // Add the entrance class on the frame after the dialog mounts so the CSS
  // transition runs; removal (close) transitions back out.
  useEffect(() => {
    if (!isOpen) return;
    const frame = window.requestAnimationFrame(() => setShown(true));
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => () => window.clearTimeout(exitTimerRef.current), []);

  // Opened on demand from a trigger click (load-on-demand mount).
  useEffect(() => {
    if (!initialAnchor) return;
    const all = Array.from(document.querySelectorAll<HTMLAnchorElement>(SELECTOR));
    const position = all.indexOf(initialAnchor);
    if (position < 0) return;
    setItems(readItems());
    returnFocusRef.current = initialAnchor;
    setIndex(position);
  }, [initialAnchor]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>(SELECTOR);
      if (!anchor) return;
      const all = Array.from(document.querySelectorAll<HTMLAnchorElement>(SELECTOR));
      const position = all.indexOf(anchor);
      if (position < 0) return;
      event.preventDefault();
      setItems(readItems());
      returnFocusRef.current = anchor;
      setIndex(position);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const id = window.setTimeout(() => closeRef.current?.focus(), 20);
      return () => window.clearTimeout(id);
    }
    if (returnFocusRef.current) {
      returnFocusRef.current.focus();
      returnFocusRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
        return;
      }
      if (event.key === "Home") {
        event.preventDefault();
        setIndex(items.length ? 0 : null);
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        setIndex(items.length ? items.length - 1 : null);
        return;
      }
      if (event.key === "Tab") {
        const focusables =
          dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])");
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close, step, items.length]);

  const current = index !== null ? items[index] : null;
  const activeIndex = index ?? 0;
  const hasMultiple = items.length > 1;

  return current ? (
    <div
      ref={dialogRef}
      className={shown ? "lb lb--in" : "lb"}
      role="dialog"
      aria-modal="true"
      aria-label="Event photo viewer"
    >
      <div className="lb-backdrop" aria-hidden="true" onClick={close} />
      <figure className="lb-panel">
        <div className="lb-media">
          <img
            key={current.src}
            className="lb-image"
            src={current.src}
            alt={current.alt}
            decoding="async"
          />
        </div>
        <figcaption className="lb-caption">
          <span className="lb-caption-text">{current.caption || current.alt}</span>
          {hasMultiple ? (
            <span className="lb-count" aria-live="polite">
              {activeIndex + 1} / {items.length}
            </span>
          ) : null}
        </figcaption>
      </figure>
      <button
        ref={closeRef}
        type="button"
        className="lb-close"
        aria-label="Close photo viewer"
        onClick={close}
      >
        <X size={20} aria-hidden="true" />
      </button>
      {hasMultiple ? (
        <>
          <button
            type="button"
            className="lb-nav lb-nav--prev"
            aria-label="Previous photo"
            onClick={() => step(-1)}
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="lb-nav lb-nav--next"
            aria-label="Next photo"
            onClick={() => step(1)}
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </>
      ) : null}
    </div>
  ) : null;
}
