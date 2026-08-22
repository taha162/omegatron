"use client";

import { useEffect, useRef } from "react";
import { motion, prefersReduced } from "./motion";
import type { Dictionary } from "@/lib/i18n";

/**
 * The method, as a timeline.
 *
 * A rule runs down the leading edge and fills as the section is read, with a
 * node at each step and the step's own number set large behind its label. The
 * numbering is real information here — these five are a sequence, and the
 * order is the point.
 */
export function Methodology({ dict }: { dict: Dictionary }) {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    if (prefersReduced()) {
      list.style.setProperty("--flow-progress", "1");
      return;
    }

    const { ScrollTrigger } = motion();

    /*
     * Deliberately slow, and deliberately behind.
     *
     * Two separate things are being asked of this rule. It is stretched across
     * roughly twice the section's own scroll — starting before the list is in
     * view and ending well past its foot — so it is still travelling while the
     * steps are being read rather than full by the second one. And `scrub` is
     * a catch-up time in seconds, not a smoothing factor: at 2.6 the rule is
     * unmistakably trailing the reader, arriving at each step a moment after
     * they do. That lag is the effect. A rule that keeps up with the wheel is
     * just a scrollbar.
     */
    const trigger = ScrollTrigger.create({
      trigger: list,
      start: "top 95%",
      end: "bottom 15%",
      scrub: 2.6,
      onUpdate(self) {
        list.style.setProperty("--flow-progress", self.progress.toFixed(4));
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <ol className="flow" ref={listRef}>
      {dict.process.steps.map((step, i) => (
        <li className="flow__step" key={step}>
          <span className="flow__index" aria-hidden="true" lang="en" dir="ltr">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="flow__label">{step}</span>
        </li>
      ))}
    </ol>
  );
}
