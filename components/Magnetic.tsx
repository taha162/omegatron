"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, prefersReduced } from "./motion";

/**
 * A magnetic pull toward the pointer.
 *
 * The element leans a little way toward the cursor while it is nearby and
 * springs back when it leaves. Gated on a fine pointer — there is nothing to
 * be magnetic toward on a touchscreen — and off under reduced motion.
 */
export function Magnetic({
  children,
  strength = 0.35,
  radius = 120,
  className,
}: {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReduced()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const { gsap } = motion();
    const moveX = gsap.quickTo(node, "x", { duration: 0.5, ease: "power3.out" });
    const moveY = gsap.quickTo(node, "y", { duration: 0.5, ease: "power3.out" });

    function onMove(event: PointerEvent) {
      const box = node!.getBoundingClientRect();
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height / 2);
      const distance = Math.hypot(dx, dy);
      if (distance > radius + Math.max(box.width, box.height) / 2) {
        moveX(0);
        moveY(0);
        return;
      }
      moveX(dx * strength);
      moveY(dy * strength);
    }

    function onLeave() {
      moveX(0);
      moveY(0);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onLeave);
      gsap.killTweensOf(node);
    };
  }, [strength, radius]);

  return (
    <span ref={ref} className={className} style={{ display: "inline-block" }}>
      {children}
    </span>
  );
}
