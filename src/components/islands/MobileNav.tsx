import { useCallback, useEffect, useRef, useState } from "react";
import { styled, ThemeProvider } from "styled-components";
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
  padding: ${({ theme }) => theme.space.xs2} ${({ theme }) => theme.space.xs};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.color.text};
  font: inherit;
  cursor: pointer;
`;

const Panel = styled.nav`
  margin-top: ${({ theme }) => theme.space.xs};
  background: ${({ theme }) => theme.color.elevated};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
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
  color: ${({ theme }) => theme.color.text};
  font-weight: ${({ $current }) => ($current ? 700 : 400)};
`;

export default function MobileNav({ items, currentPath, ctaHref }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
        aria-expanded={open}
        aria-controls={MENU_ID}
        onClick={toggle}
      >
        <Icon size={20} aria-hidden="true" />
        {open ? "Close" : "Menu"}
      </Trigger>
      {open ? (
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
      ) : null}
    </ThemeProvider>
  );
}
