"use client";

import { useEffect, useRef } from "react";
import { prefersReduced } from "./motion";

/** Scramble alphabets, per script, so the noise looks like the target's own. */
const LATIN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/\\<>";
const ARABIC = "أبتثجحخدذرزسشصضطظعغفقكلمنهوي٠١٢٣٤٥٦٧٨٩";

const hasArabic = (s: string) => /[؀-ۿ]/.test(s);

/**
 * Text that resolves out of noise, one position at a time.
 *
 * A readout settling: every character starts as a random glyph from its own
 * script and locks to the real one left to right. The element keeps the true
 * string as its accessible name throughout, so nothing ever reads the noise.
 *
 * Runs once, on mount. It is the page's opening gesture and repeating it on
 * every return to the top would turn a flourish into a tic.
 */
export function Scramble({
  text,
  className,
  cycles = 3,
  frame = 45,
}: {
  text: string;
  className?: string;
  /** How many random glyphs each position shows before it locks. */
  cycles?: number;
  frame?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (prefersReduced()) {
      node.textContent = text;
      return;
    }

    const pool = hasArabic(text) ? ARABIC : LATIN;
    const chars = Array.from(text);
    let tick = 0;
    let raf = 0;
    let last = 0;

    function paint(now: number) {
      if (now - last < frame) {
        raf = requestAnimationFrame(paint);
        return;
      }
      last = now;

      const locked = Math.floor(tick / cycles);
      node!.textContent = chars
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i < locked) return ch;
          return pool[Math.floor(Math.random() * pool.length)];
        })
        .join("");

      tick += 1;
      if (locked <= chars.length) raf = requestAnimationFrame(paint);
      else node!.textContent = text;
    }

    raf = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(raf);
  }, [text, cycles, frame]);

  return (
    <span className={className} aria-label={text}>
      {/* Server-rendered as the real string, so a visitor with no script — and
          every crawler — gets the name rather than a row of noise. */}
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
