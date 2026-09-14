import { useCallback, useEffect, useRef, useState } from "react";
import { styled, ThemeProvider } from "styled-components";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { theme } from "../../lib/theme";

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

const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs2};
  min-height: 44px;
  padding: ${({ theme }) => theme.space.xs2} ${({ theme }) => theme.space.sm};
  background: transparent;
  border: 1px solid var(--color-ink-border);
  border-radius: var(--radius-pill);
  color: var(--color-on-ink);
  font: inherit;
  font-weight: 600;
  font-size: var(--text-small);
  cursor: pointer;
  transition:
    border-color var(--motion-quick) var(--ease-default),
    color var(--motion-quick) var(--ease-default);
  &:hover {
    border-color: var(--color-accent-on-dark);
    color: var(--color-accent-on-dark);
  }
`;

const Panel = styled.nav`
  margin-top: ${({ theme }) => theme.space.xs};
  background: var(--color-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--elevation-2);
  padding: ${({ theme }) => theme.space.sm};
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: ${({ theme }) => theme.space.xs2};
`;

const PanelLink = styled.a<{ $current: boolean }>`
  display: block;
  padding: ${({ theme }) => theme.space.xs2} ${({ theme }) => theme.space.xs};
  color: ${({ $current }) => ($current ? "var(--color-ink)" : "var(--color-ink-soft)")};
  font-weight: ${({ $current }) => ($current ? 700 : 500)};
  text-decoration: none;
  border-radius: var(--radius-sm);
  &:hover {
    color: var(--color-ink);
  }
`;

const MotionPanel = motion(Panel);

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

  const Icon = open ? X : Menu;

  return (
    <ThemeProvider theme={theme}>
      <Trigger
        ref={triggerRef}
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={MENU_ID}
        onClick={toggle}
      >
        <Icon size={20} aria-hidden="true" />
        <span aria-hidden="true">{open ? "Close" : "Menu"}</span>
      </Trigger>
      <AnimatePresence initial={false}>
        {open ? (
          reduceMotion ? (
            <Panel id={MENU_ID} aria-label="Mobile">
              <List>
                {items.map((item) => (
                  <li key={item.href}>
                    <PanelLink
                      href={item.href}
                      $current={currentPath === item.href}
                      aria-current={currentPath === item.href ? "page" : undefined}
                    >
                      {item.label}
                    </PanelLink>
                  </li>
                ))}
                <li>
                  <PanelLink href={ctaHref} $current={false}>
                    Enquire now
                  </PanelLink>
                </li>
              </List>
            </Panel>
          ) : (
            <MotionPanel
              key="panel"
              id={MENU_ID}
              aria-label="Mobile"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <List>
                {items.map((item) => (
                  <li key={item.href}>
                    <PanelLink
                      href={item.href}
                      $current={currentPath === item.href}
                      aria-current={currentPath === item.href ? "page" : undefined}
                    >
                      {item.label}
                    </PanelLink>
                  </li>
                ))}
                <li>
                  <PanelLink href={ctaHref} $current={false}>
                    Enquire now
                  </PanelLink>
                </li>
              </List>
            </MotionPanel>
          )
        ) : null}
      </AnimatePresence>
    </ThemeProvider>
  );
}
