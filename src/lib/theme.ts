import "styled-components";

/**
 * Island theme for styled-components. Mirrors the CSS custom properties in
 * styles/tokens.css so React islands share the same semantic roles.
 * Provisional palette/font values require client confirmation (see tokens.css).
 */
export const theme = {
  color: {
    background: "var(--color-ivory)",
    surface: "var(--color-surface)",
    surfaceDark: "var(--color-surface-dark)",
    elevated: "var(--color-elevated)",
    text: "var(--color-ink)",
    textSecondary: "var(--color-ink-soft)",
    textMuted: "var(--color-ink-faint)",
    primary: "var(--color-primary)",
    primaryContrast: "var(--color-primary-contrast)",
    accent: "var(--color-accent)",
    accentOnDark: "var(--color-accent-on-dark)",
    border: "var(--color-border)",
    inputBorder: "var(--color-input-border)",
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    error: "var(--color-error)",
    focus: "var(--color-focus)",
  },
  space: {
    xs3: "var(--space-3xs)",
    xs2: "var(--space-2xs)",
    xs: "var(--space-xs)",
    sm: "var(--space-sm)",
    md: "var(--space-md)",
    lg: "var(--space-lg)",
    xl: "var(--space-xl)",
  },
  radius: {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    pill: "var(--radius-pill)",
  },
  elevation: {
    "0": "var(--elevation-0)",
    "1": "var(--elevation-1)",
    "2": "var(--elevation-2)",
  },
  motion: {
    quick: "var(--motion-quick)",
    settled: "var(--motion-settled)",
    ease: "var(--ease-default)",
  },
} as const;

export type Theme = typeof theme;

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
