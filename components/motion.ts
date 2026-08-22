"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * One GSAP registration for the whole app.
 *
 * ScrollTrigger has to be registered before any trigger is created, and doing
 * it at module scope in every component that needs it means the plugin is
 * registered several times over. This runs once, guarded, and hands back the
 * pair everything else imports.
 */
let registered = false;

export function motion() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

/** True when the visitor has asked for less movement. */
export function prefersReduced(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** RTL flips every horizontal translation on the site. */
export function directionSign(): 1 | -1 {
  if (typeof document === "undefined") return 1;
  return document.documentElement.dir === "rtl" ? -1 : 1;
}
