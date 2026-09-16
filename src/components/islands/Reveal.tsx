import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";

type RevealVariant = "rise" | "blur" | "mask" | "scale";
type MotionTarget = NonNullable<ComponentProps<typeof motion.div>["initial"]>;
type MotionVisible = Exclude<MotionTarget, boolean | undefined>;

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
   * Material of the entrance. Variety is deliberate: media blurs into focus,
   * print panels unclip, compact groups scale, prose rises.
   */
  variant?: RevealVariant;
  className?: string;
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const MATERIALS: Record<RevealVariant, { initial: MotionTarget; visible: MotionVisible }> = {
  rise: {
    initial: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0 },
  },
  blur: {
    initial: { opacity: 0, y: 16, filter: "blur(14px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  mask: {
    initial: { opacity: 0, y: 26, clipPath: "inset(0% 0% 18% 0%)" },
    visible: { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" },
  },
  scale: {
    initial: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1 },
  },
};

/**
 * Entrance wrapper. Content is server-rendered and readable without JS:
 * the default `reveal` class lets global.css keep it visible when `html.js`
 * is absent; reduced-motion users receive plain content with no animation.
 */
export default function Reveal({
  children,
  delay = 0,
  mode = "view",
  variant = "rise",
  className,
}: Props) {
  const reduceMotion = useReducedMotion();
  const classes = className ? `reveal ${className}` : "reveal";

  if (reduceMotion) {
    return <div className={classes}>{children}</div>;
  }

  const { initial, visible } = MATERIALS[variant];
  const transition = { duration: 0.68, ease: EASE, delay };

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
