import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";

/**
 * Mobile navigation island. Styling lives in styles/mobile-nav.css
 * (token-backed, server-rendered) rather than styled-components, so the
 * trigger and panel are styled before hydration.
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
        Enquire now
      </a>
    </>
  );
}

export default function MobileNav({ items, currentPath, ctaHref }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);

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
      <AnimatePresence initial={false}>
        {open ? (
          reduceMotion ? (
            <nav id={MENU_ID} aria-label="Mobile" className="mn-panel">
              {content}
            </nav>
          ) : (
            <motion.nav
              key="panel"
              id={MENU_ID}
              aria-label="Mobile"
              className="mn-panel"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {content}
            </motion.nav>
          )
        ) : null}
      </AnimatePresence>
    </>
  );
}
