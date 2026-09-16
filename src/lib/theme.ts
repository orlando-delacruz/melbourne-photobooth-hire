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
    inkDeep: "var(--color-ink-deep)",
    inkRaised: "var(--color-ink-raised)",
    text: "var(--color-ink)",
    textSecondary: "var(--color-ink-soft)",
    textMuted: "var(--color-ink-faint)",
    onInk: "var(--color-on-ink)",
    onInkSecondary: "var(--color-on-ink-secondary)",
    primary: "var(--color-primary)",
    primaryContrast: "var(--color-primary-contrast)",
    accent: "var(--color-accent)",
    accentStrong: "var(--color-accent-strong)",
    accentOnDark: "var(--color-accent-on-dark)",
    accentWash: "var(--color-accent-wash)",
    accentLine: "var(--color-accent-line)",
    border: "var(--color-border)",
    divider: "var(--color-divider)",
    hairline: "var(--color-ink-hairline)",
    inputBorder: "var(--color-input-border)",
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    error: "var(--color-error)",
    focus: "var(--color-focus)",
    focusDark: "var(--color-focus-dark)",
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
    "3": "var(--elevation-3)",
  },
  motion: {
    quick: "var(--motion-quick)",
    settled: "var(--motion-settled)",
    ease: "var(--ease-default)",
    easeSoft: "var(--ease-soft)",
  },
} as const;

export type Theme = typeof theme;

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
