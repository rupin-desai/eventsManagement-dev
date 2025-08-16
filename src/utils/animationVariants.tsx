import type { Variants, Transition } from "framer-motion"

/**
 * Reusable animation variants for Framer Motion
 * These can be used across different components for consistent animations
 */

// Spring animation configuration - can be used as a basis for transitions
export const springConfig: Transition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 20,
};

// Section animations
export const sectionVariants: Variants = {
  initial: {
    opacity: 0,
    transform: "translate3d(0px, 30px, 0px)",
  },
  animate: {
    opacity: 1,
    transform: "translate3d(0px, 0px, 0px)",
    transition: springConfig,
  },
};

// Text animations
export const textVariants = {
  // For headings and section titles
  header: {
    initial: {
      opacity: 0,
      transform: "translate3d(0px, -30px, 0px)",
    },
    animate: {
      opacity: 1,
      transform: "translate3d(0px, 0px, 0px)",
      transition: springConfig,
    },
  } as Variants,
  // For titles with a slight delay
  title: {
    initial: {
      opacity: 0,
      transform: "translate3d(0px, -20px, 0px)",
    },
    animate: {
      opacity: 1,
      transform: "translate3d(0px, 0px, 0px)",
      transition: { ...springConfig, delay: 0.1 },
    },
  } as Variants,
  // For paragraphs and descriptions
  description: {
    initial: {
      opacity: 0,
      transform: "translate3d(0px, 20px, 0px)",
    },
    animate: {
      opacity: 1,
      transform: "translate3d(0px, 0px, 0px)",
      transition: { ...springConfig, delay: 0.3 },
    },
  } as Variants,
};

// Divider animations
export const dividerVariants: Variants = {
  initial: {
    opacity: 0,
    transform: "translate3d(0px, 0px, 0px) scaleX(0)",
  },
  animate: {
    opacity: 1,
    transform: "translate3d(0px, 0px, 0px) scaleX(1)",
    transition: { ...springConfig, delay: 0.2 },
  },
};

// Card and grid related animations
export const cardVariants = {
  // Container for groups of cards
  container: {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.4,
      },
    },
  } as Variants,
  // Individual card
  item: {
    initial: {
      opacity: 0,
      transform: "translate3d(0px, 40px, 0px)",
    },
    animate: {
      opacity: 1,
      transform: "translate3d(0px, 0px, 0px)",
      transition: springConfig,
    },
    hover: {
      transform: "translate3d(0px, -5px, 0px)",
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    },
  } as Variants,
};

// Icon animations
export const iconVariants: Variants = {
  initial: {
    opacity: 0,
    transform: "translate3d(0px, 0px, 0px) scale(0.8)",
  },
  animate: {
    opacity: 1,
    transform: "translate3d(0px, 0px, 0px) scale(1)",
    transition: { ...springConfig, delay: 0.1 },
  },
  hover: {
    transform: "translate3d(0px, 0px, 0px) scale(1.05)",
  },
};

// Element entry animations with configurable direction
export const fadeInVariants = (
  direction: "up" | "down" | "left" | "right" | "none" = "up", 
  delay = 0
): Variants => {
  const directions = {
    up: "translate3d(0px, 20px, 0px)",
    down: "translate3d(0px, -20px, 0px)",
    left: "translate3d(20px, 0px, 0px)",
    right: "translate3d(-20px, 0px, 0px)",
    none: "translate3d(0px, 0px, 0px)",
  };

  return {
    initial: {
      opacity: 0,
      transform: directions[direction],
    },
    animate: {
      opacity: 1,
      transform: "translate3d(0px, 0px, 0px)",
      transition: { ...springConfig, delay },
    },
  };
};

// Staggered child elements animation
export const staggerChildrenVariants = (delay = 0.05) => {
  return (index: number): Variants => ({
    initial: { 
      opacity: 0, 
      transform: "translate3d(0px, 20px, 0px)" 
    },
    animate: {
      opacity: 1,
      transform: "translate3d(0px, 0px, 0px)",
      transition: { ...springConfig, delay: delay * index },
    },
  });
};

// Swipe animation for overlay transitions (directional)
export const swipeVariants = {
  initial: (dir: "left" | "right" | null) => ({
    opacity: 0,
    transform:
      dir === "left"
        ? "translate3d(-80px, 0px, 0px)"
        : dir === "right"
        ? "translate3d(80px, 0px, 0px)"
        : "translate3d(0px, 0px, 0px)",
    scale: 0.98,
  }),
  animate: {
    opacity: 1,
    transform: "translate3d(0px, 0px, 0px)",
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
  exit: (dir: "left" | "right" | null) => ({
    opacity: 0,
    transform:
      dir === "left"
        ? "translate3d(80px, 0px, 0px)"
        : dir === "right"
        ? "translate3d(-80px, 0px, 0px)"
        : "translate3d(0px, 0px, 0px)",
    scale: 0.98,
    transition: { duration: 0.18 },
  }),
};