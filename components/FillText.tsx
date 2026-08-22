"use client";

import { Fragment, useEffect, useRef } from "react";
import { motion, prefersReduced } from "./motion";

/**
 * A line that lights up as it is read.
 *
 * The words start in the muted ink and take the full ink one at a time as the
 * block travels the viewport, so the reader's own scroll drives the emphasis.
 * Split on spaces only — per-character splitting severs Arabic joins.
 *
 * The whole string is the element's accessible name and the pieces are hidden
 * from the tree, so this is a colour effect and nothing more as far as
 * assistive technology is concerned.
 */
export function FillText({
  text,
  className,
  as: Tag = "p",
  id,
}: {
  text: string;
  className?: string;
  as?: "h2" | "p";
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const words = Array.from(root.querySelectorAll<HTMLElement>(".fill__word"));

    if (prefersReduced()) {
      words.forEach((w) => w.classList.add("is-lit"));
      return;
    }

    const { ScrollTrigger } = motion();
    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top 82%",
      end: "bottom 55%",
      scrub: 0.4,
      onUpdate(self) {
        // One extra step so the last word is fully lit before the block leaves.
        const lit = Math.round(self.progress * (words.length + 1));
        words.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
      },
    });

    return () => trigger.kill();
  }, [text]);

  const words = text.split(" ");

  return (
    <Tag ref={ref as never} className={className} id={id} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="fill__word" aria-hidden="true">
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
