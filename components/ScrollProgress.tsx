"use client";

import { useEffect, useRef } from "react";
import { motion, prefersReduced } from "./motion";

/**
 * The reading hairline across the top of the viewport.
 *
 * Driven by the same ScrollTrigger clock as everything else rather than by a
 * scroll listener of its own, so it can never report a position the pinned
 * sections have not reached yet. Hidden entirely under reduced motion.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;
    if (!bar || prefersReduced()) return;

    const { ScrollTrigger } = motion();
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      scrub: true,
      onUpdate(self) {
        bar.style.setProperty("--page-progress", self.progress.toFixed(4));
      },
    });

    return () => trigger.kill();
  }, []);

  return <div className="scroll-progress" ref={ref} aria-hidden="true" />;
}
