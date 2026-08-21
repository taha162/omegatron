"use client";

import { useEffect } from "react";

/**
 * The holds — the page resisting, section by section.
 *
 * Each section marked `.hold` gets a run of empty scroll appended to it and its
 * content pinned inside that run, so scrolling through the gap advances the
 * film without moving the page. The section then releases and the next one
 * climbs in behind it.
 *
 * The arithmetic has to be done here rather than in CSS because it depends on
 * how tall the section's content turns out to be against the viewport:
 *
 *   - Content shorter than the screen is centred and pinned. Centring is what
 *     makes a held section let go while its own bottom edge is still above the
 *     fold, so it is gone before the next one arrives and two transparent
 *     sections can never read through each other over the film.
 *   - Content taller than the screen is pinned to its last line instead: it
 *     scrolls up until its bottom is in view and holds there. Pinning its top
 *     would park the rest of it below the fold for the whole hold.
 *   - The hero pins at the top and holds longest; it fills the screen by
 *     construction and has nothing above it.
 *
 * `@media (scripting: enabled)` in the stylesheet keeps the pinning itself out
 * of the no-JS render, and `prefers-reduced-motion` drops it entirely.
 */
export function ScrollHolds() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".hold"));
    if (sections.length === 0) return;

    let frame = 0;

    function measure() {
      const viewport = window.innerHeight;

      for (const section of sections) {
        const inner = section.firstElementChild as HTMLElement | null;
        if (!inner) continue;

        if (reduced.matches) {
          section.dataset.hold = "off";
          section.style.removeProperty("--hold-run");
          section.style.removeProperty("--hold-top");
          continue;
        }

        // The hero holds for longer than the rest: it is the first thing the
        // visitor pushes against, and the only one with nothing above it.
        const isHero = section.classList.contains("hero");
        const run = isHero ? 1.15 : 0.42;
        const height = inner.offsetHeight;

        let top: number;
        if (isHero) {
          // The hero fills the screen by construction; it pins at the top.
          top = 0;
        } else if (height <= viewport - 16) {
          // Short enough to sit whole on screen: centre it. Centring is what
          // makes a held section let go while its own bottom edge is still
          // above the fold, so it is gone before the next one arrives.
          top = Math.round((viewport - height) / 2);
        } else {
          // Taller than the screen: let it scroll up until its last line is in
          // view, then hold there. Pinning its top instead would park the rest
          // of it below the fold for the whole hold.
          top = Math.round(viewport - height - 24);
        }

        section.dataset.hold = "on";
        section.style.setProperty("--hold-run", `${Math.round(viewport * run)}px`);
        section.style.setProperty("--hold-top", `${top}px`);
      }
    }

    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    }

    measure();

    // Content reflows as fonts land and images decode, and the numbers depend
    // on the measured height, so the sections are watched rather than measured
    // once.
    const observer = new ResizeObserver(schedule);
    for (const section of sections) {
      const inner = section.firstElementChild;
      if (inner) observer.observe(inner);
    }
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, []);

  return null;
}
