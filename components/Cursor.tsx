"use client";

import { useEffect, useRef } from "react";
import { motion, prefersReduced } from "./motion";

/**
 * An 8px dot that inverts whatever it crosses, opening to 40px over anything
 * clickable.
 *
 * It is an addition to the system cursor, not a replacement — the real pointer
 * is left visible, so nothing is lost if this never renders. Pointer devices
 * only, and never under reduced motion.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = ref.current;
    if (!dot) return;
    if (prefersReduced()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const { gsap } = motion();
    // quickTo keeps the dot marginally behind the pointer, which is what makes
    // it read as a physical object rather than a painted-on crosshair.
    const moveX = gsap.quickTo(dot, "x", { duration: 0.18, ease: "power3.out" });
    const moveY = gsap.quickTo(dot, "y", { duration: 0.18, ease: "power3.out" });

    const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary';

    function onMove(event: PointerEvent) {
      dot!.classList.add("is-visible");
      moveX(event.clientX);
      moveY(event.clientY);
      const over = (event.target as Element | null)?.closest?.(INTERACTIVE);
      dot!.classList.toggle("is-wide", Boolean(over));
    }

    const onLeave = () => dot.classList.remove("is-visible");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(dot);
    };
  }, []);

  return <div className="cursor" ref={ref} aria-hidden="true" />;
}
