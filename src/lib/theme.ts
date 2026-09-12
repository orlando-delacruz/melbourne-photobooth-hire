import "styled-components";

/**
 * Island theme for styled-components. Mirrors the CSS custom properties in
 * styles/tokens.css so React islands share the same semantic roles.
 * Provisional color values require client confirmation (see tokens.css).
 */
export const theme = {
  color: {
    background: "var(--color-background)",
    surface: "var(--color-surface)",
    elevated: "var(--color-elevated)",
    text: "var(--color-text)",
    textSecondary: "var(--color-text-secondary)",
    primary: "var(--color-primary)",
    primaryContrast: "var(--color-primary-contrast)",
    border: "var(--color-border)",
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
  },
} as const;

export type Theme = typeof theme;

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
