import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface LightboxItem {
  src: string;
  alt: string;
  caption?: string;
}

const SELECTOR = "[data-lightbox]";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
export default function GalleryLightbox() {
  const [items, setItems] = useState<LightboxItem[]>([]);
  const [index, setIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const isOpen = index !== null;

  const close = useCallback(() => setIndex(null), []);

  const step = useCallback(
    (delta: number) => {
      setIndex((current) => {
        if (current === null || items.length === 0) return current;
        return (current + delta + items.length) % items.length;
      });
    },
    [items.length],
  );

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

  return (
    <AnimatePresence>
      {current ? (
        <motion.div
          ref={dialogRef}
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label="Event photo viewer"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <div className="lb-backdrop" aria-hidden="true" onClick={close} />
          <motion.figure
            className="lb-panel"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.965, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.46, ease: EASE }}
          >
            <div className="lb-media">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={current.src}
                  className="lb-image"
                  src={current.src}
                  alt={current.alt}
                  decoding="async"
                  initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
              </AnimatePresence>
            </div>
            <figcaption className="lb-caption">
              <span className="lb-caption-text">{current.caption || current.alt}</span>
              {hasMultiple ? (
                <span className="lb-count" aria-live="polite">
                  {activeIndex + 1} / {items.length}
                </span>
              ) : null}
            </figcaption>
          </motion.figure>
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
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
