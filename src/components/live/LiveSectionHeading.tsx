// SectionHeading markup mirror for live islands (DEC-033).
// Class-for-class copy of SectionHeading.astro; styles from styles/live.css.
export interface LiveSectionHeadingProps {
  title: string;
  eyebrow?: string;
  lede?: string;
  id?: string;
  tone?: "light" | "dark";
  align?: "start" | "center";
  size?: "md" | "lg";
  rule?: boolean;
}

export default function LiveSectionHeading({
  title,
  eyebrow,
  lede,
  id,
  tone = "light",
  align = "start",
  size = "md",
  rule = true,
}: LiveSectionHeadingProps) {
  const classes = [
    "section-heading",
    `section-heading--${tone}`,
    `section-heading--${align}`,
    `section-heading--${size}`,
    tone === "dark" ? "on-dark" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes}>
      {eyebrow ? <p className={`eyebrow${rule ? " eyebrow--rule" : ""}`}>{eyebrow}</p> : null}
      <h2 id={id}>{title}</h2>
      {lede ? <p className="lede">{lede}</p> : null}
    </div>
  );
}
