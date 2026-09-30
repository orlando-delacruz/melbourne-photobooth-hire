import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

/**
 * Mobile navigation island. Styling lives in styles/mobile-nav.css
 * (token-backed, server-rendered) rather than styled-components, so the
 * trigger and panel are styled before hydration. The panel entrance/exit is
 * CSS-driven (no animation library).
 */

export interface NavItem {
  href: string;
  label: string;
}

interface Props {
  items: NavItem[];
  currentPath: string;
  ctaHref: string;
}

const MENU_ID = "mobile-menu";
/** Must match the exit transition on .mn-panel (styles/mobile-nav.css). */
const EXIT_MS = 220;

function MenuList({
  items,
  currentPath,
  ctaHref,
}: {
  items: NavItem[];
  currentPath: string;
  ctaHref: string;
}) {
  return (
    <>
      <ul className="mn-list">
        {items.map((item) => (
          <li key={item.href}>
            <a
              className={currentPath === item.href ? "mn-link mn-link--current" : "mn-link"}
              href={item.href}
              aria-current={currentPath === item.href ? "page" : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <a className="mn-cta" href={ctaHref}>
        Book Now
      </a>
    </>
  );
}

export default function MobileNav({ items, currentPath, ctaHref }: Props) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const exitTimerRef = useRef<number | undefined>(undefined);

  const close = useCallback(() => {
    setShown(false);
    window.clearTimeout(exitTimerRef.current);
    exitTimerRef.current = window.setTimeout(() => setOpen(false), EXIT_MS);
  }, []);

  const toggle = useCallback(() => {
    if (!open) {
      setOpen(true);
      return;
    }
    // During the close transition the panel is still mounted: cancel the
    // unmount and restore instead of starting another close.
    if (!shown) {
      window.clearTimeout(exitTimerRef.current);
      setShown(true);
      return;
    }
    close();
  }, [open, shown, close]);

  // Add the entrance class on the frame after the panel mounts so the CSS
  // transition runs.
  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => setShown(true));
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => () => window.clearTimeout(exitTimerRef.current), []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Let the rest of the page know the menu owns the viewport (e.g. the
  // floating Messenger CTA steps aside) without coupling the components.
  useEffect(() => {
    document.documentElement.dataset.menuOpen = open ? "true" : "false";
    return () => {
      delete document.documentElement.dataset.menuOpen;
    };
  }, [open]);

  const Icon = open ? X : Menu;
  const content = <MenuList items={items} currentPath={currentPath} ctaHref={ctaHref} />;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="mn-trigger"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={MENU_ID}
        onClick={toggle}
      >
        <Icon size={20} aria-hidden="true" />
      </button>
      {open ? (
        <nav
          id={MENU_ID}
          aria-label="Mobile"
          className={shown ? "mn-panel mn-panel--in" : "mn-panel"}
        >
          {content}
        </nav>
      ) : null}
    </>
  );
}
