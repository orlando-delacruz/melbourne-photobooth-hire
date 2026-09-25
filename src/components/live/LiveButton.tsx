// Button markup mirror for live islands (DEC-033).
// Class-for-class copy of Button.astro; styles come from styles/live.css.
export interface LiveButtonProps {
  href: string;
  variant?: "primary" | "secondary" | "tertiary";
  tone?: "light" | "dark";
  size?: "md" | "lg";
  arrow?: boolean;
  children: React.ReactNode;
}

const ARROW_SVG = (
  <svg
    className="button__arrow"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export default function LiveButton({
  href,
  variant = "primary",
  tone = "light",
  size = "md",
  arrow = false,
  children,
}: LiveButtonProps) {
  return (
    <a href={href} className={`button button--${variant} button--tone-${tone} button--${size}`}>
      <span className="button__label">{children}</span>
      {arrow ? ARROW_SVG : null}
    </a>
  );
}
