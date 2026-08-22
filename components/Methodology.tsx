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
     * Deliberately slow.
     *
     * The rule used to be full before the reader had finished the first step,
     * which made it decoration. Starting later and ending well past the list's
     * own foot stretches the fill across roughly twice the scroll, so it is
     * still travelling while the steps are being read — which is the only way
     * anyone notices it is tracking them.
     */
    const trigger = ScrollTrigger.create({
      trigger: list,
      start: "top 88%",
      end: "bottom 25%",
      scrub: 1.1,
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
