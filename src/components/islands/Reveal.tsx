import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Stagger delay in seconds. */
  delay?: number;
  /**
   * "mount" animates as soon as the island hydrates (hero moment);
   * "view" animates when scrolled into view (below-the-fold sections).
   */
  mode?: "mount" | "view";
  className?: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Entrance wrapper. Content is server-rendered and readable without JS:
 * the default `reveal` class lets global.css keep it visible when `html.js`
 * is absent; reduced-motion users receive plain content with no animation.
 */
export default function Reveal({ children, delay = 0, mode = "view", className }: Props) {
  const reduceMotion = useReducedMotion();
  const classes = className ? `reveal ${className}` : "reveal";

  if (reduceMotion) {
    return <div className={classes}>{children}</div>;
  }

  const initial = { opacity: 0, y: 24 };
  const visible = { opacity: 1, y: 0 };
  const transition = { duration: 0.6, ease: EASE, delay };

  return mode === "mount" ? (
    <motion.div className={classes} initial={initial} animate={visible} transition={transition}>
      {children}
    </motion.div>
  ) : (
    <motion.div
      className={classes}
      initial={initial}
      whileInView={visible}
      viewport={{ once: true, margin: "-64px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
