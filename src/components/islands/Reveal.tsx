// Entrance wrapper (compositor-only CSS).
//
// Content is server-rendered and readable without JS: the hidden state only
// applies under `html.js`, so no-JS visitors and reduced-motion users see the
// content immediately (see global.css). The entrance itself is transform +
// opacity only, driven by an IntersectionObserver for view-mode reveals and a
// single rAF for mount-mode (hero) reveals. This replaces the former
// framer-motion implementation, whose `filter: blur()` and `clip-path`
// variants were flagged as non-composited animations.
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type RevealVariant = "rise" | "blur" | "mask" | "scale";

interface Props {
  children: ReactNode;
  /** Stagger delay in seconds. */
  delay?: number;
  /**
   * "mount" animates as soon as the island hydrates (hero moment);
   * "view" animates when scrolled into view (below-the-fold sections).
   */
  mode?: "mount" | "view";
  /**
   * Material of the entrance. Variety is deliberate: media eases in, print
   * panels rise, compact groups scale.
   */
  variant?: RevealVariant;
  className?: string;
}

export default function Reveal({
  children,
  delay = 0,
  mode = "view",
  variant = "rise",
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (mode === "mount") {
      const frame = window.requestAnimationFrame(() => setShown(true));
      return () => window.cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-64px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [mode]);

  const classes = ["reveal", `reveal--${variant}`, shown ? "reveal--in" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={classes} style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </div>
  );
}
