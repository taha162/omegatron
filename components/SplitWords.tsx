"use client";

import { Fragment, useEffect, useRef } from "react";
import { prefersReduced } from "./motion";

/**
 * A line that arrives one word at a time.
 *
 * Split on spaces, never on characters: Arabic letters join, and putting each
 * one in its own element severs those joins and renders the word as a row of
 * isolated forms. Word-level splitting keeps every script intact and still
 * gives the stagger its rhythm.
 *
 * Each word sits in a clipping box and starts below it, so the line assembles
 * from behind its own baseline rather than fading in. The whole string stays
 * readable to assistive technology because the wrapper carries it as a label
 * and the pieces are hidden from the tree.
 */
export function SplitWords({
  text,
  className,
  as: Tag = "p",
  delay = 0,
  step = 65,
  id,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "p";
  delay?: number;
  step?: number;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const words = Array.from(root.querySelectorAll<HTMLElement>(".word__inner"));

    if (prefersReduced()) {
      words.forEach((w) => w.classList.add("is-in"));
      return;
    }

    const timers = words.map((word, i) =>
      window.setTimeout(() => word.classList.add("is-in"), delay + i * step),
    );
    return () => timers.forEach(clearTimeout);
  }, [text, delay, step]);

  const words = text.split(" ");

  return (
    <Tag ref={ref as never} className={className} id={id} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="word" aria-hidden="true">
            <span className="word__inner">{word}</span>
          </span>
          {/* The space sits outside the clipping box. Inside it, `overflow:
              hidden` swallows it and the line renders as one long word. */}
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
