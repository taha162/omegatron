"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReduced } from "./motion";

/**
 * Text that lifts into place from behind its own edge.
 *
 * Each child is wrapped in a clipping box and starts pushed below it, so the
 * line arrives rather than fading — the editorial reveal the founder page is
 * built around. Children are staggered by `step` milliseconds.
 *
 * With scripting off, or under reduced motion, the lines are simply in place:
 * the transform lives on a class this adds, never on the markup.
 */
export function MaskLines({
  children,
  step = 90,
  className,
}: {
  children: ReactNode[];
  step?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const lines = Array.from(root.querySelectorAll<HTMLElement>(".mask-line"));

    if (prefersReduced() || typeof IntersectionObserver === "undefined") {
      lines.forEach((l) => l.classList.add("is-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const line = entry.target as HTMLElement;
          const index = lines.indexOf(line);
          line.style.transitionDelay = `${Math.max(0, index) * step}ms`;
          line.classList.add("is-in");
          observer.unobserve(line);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    lines.forEach((l) => observer.observe(l));
    return () => observer.disconnect();
  }, [step]);

  return (
    <div className={className} ref={ref}>
      {children.map((child, i) => (
        <div className="mask-line" key={i}>
          {child}
        </div>
      ))}
    </div>
  );
}
