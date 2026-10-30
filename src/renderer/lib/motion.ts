import type { Transition } from "motion/react";

// Springs expressed the way AppKit/SwiftUI think about them: critically
// damped (no overshoot) with a short response. They are interruptible, so a
// sheet or panel reversing mid-flight starts from where it is on screen.
export const SPRING: Transition = { type: "spring", bounce: 0, duration: 0.32 };

// Slight overshoot for things that "land" (menus, popovers, the palette).
export const SPRING_POP: Transition = {
  type: "spring",
  bounce: 0.18,
  duration: 0.3
};
