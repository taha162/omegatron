"use client";

import { useEffect, useRef } from "react";
import { Magnetic } from "./Magnetic";
import { motion, prefersReduced } from "./motion";
import type { Dictionary } from "@/lib/i18n";

/**
 * Deterministic drift for the ambient data points.
 *
 * The positions must be identical on the server and in the browser or React
 * reports a hydration mismatch, so this is a seeded generator rather than
 * Math.random.
 */
function motes(count: number) {
  let seed = 0x2f6e2b1;
  const next = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  return Array.from({ length: count }, () => ({
    left: `${(next() * 100).toFixed(2)}%`,
    top: `${(next() * 100).toFixed(2)}%`,
    duration: `${(7 + next() * 9).toFixed(2)}s`,
    delay: `${(-next() * 12).toFixed(2)}s`,
    scale: 0.6 + next() * 1.1,
  }));
}

const MOTES = motes(26);

/**
 * NURAI 2026 — the monument.
 *
 * The section opens dark. As it is entered, the board's traces draw
 * themselves, three plates assemble in depth, and the badge resolves out of a
 * chromatic split. The copy beside it types rather than fades. Everything is
 * driven by one ScrollTrigger writing three custom properties, so the CSS owns
 * the appearance and this file only owns the timing.
 */
export function Award({ dict }: { dict: Dictionary }) {
  const rootRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const full = dict.award.body;
    const typed = typedRef.current;
    const caret = caretRef.current;

    if (prefersReduced()) {
      root.style.setProperty("--draw", "1");
      root.style.setProperty("--assemble", "1");
      root.style.setProperty("--glitch", "0");
      if (typed) typed.textContent = full;
      caret?.classList.add("is-done");
      return;
    }

    const { gsap, ScrollTrigger } = motion();

    // Each trace reports its own length so the dash animation is exact rather
    // than a guess that leaves some paths short and others still drawing.
    root.querySelectorAll<SVGPathElement>(".award__traces path").forEach((path) => {
      path.style.setProperty("--len", String(Math.ceil(path.getTotalLength())));
    });

    const state = { draw: 0, assemble: 0, glitch: 1 };

    const build = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top 78%",
        end: "center center",
        scrub: 0.6,
      },
      onUpdate() {
        root.style.setProperty("--draw", state.draw.toFixed(3));
        root.style.setProperty("--assemble", state.assemble.toFixed(3));
        root.style.setProperty("--glitch", state.glitch.toFixed(3));
      },
    });

    build
      .to(state, { draw: 1, duration: 1, ease: "none" })
      .to(state, { assemble: 1, duration: 1, ease: "power2.out" }, 0.35)
      .to(state, { glitch: 0, duration: 0.7, ease: "power4.out" }, 0.9);

    // The line types once, when the section has actually been reached.
    let typing: gsap.core.Tween | null = null;
    const typer = ScrollTrigger.create({
      trigger: root,
      start: "top 60%",
      once: true,
      onEnter() {
        if (!typed) return;
        const cursor = { n: 0 };
        typing = gsap.to(cursor, {
          n: full.length,
          duration: Math.min(2.6, full.length * 0.022),
          ease: "none",
          onUpdate() {
            typed.textContent = full.slice(0, Math.round(cursor.n));
          },
          onComplete() {
            typed.textContent = full;
            caret?.classList.add("is-done");
          },
        });
      },
    });

    /* The badge tilts in 3D toward the pointer while it is over it. */
    const badge = badgeRef.current;
    function onMove(event: PointerEvent) {
      if (!badge) return;
      const box = badge.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      badge.style.setProperty("--tilt-y", `${(x * 16).toFixed(2)}deg`);
      badge.style.setProperty("--tilt-x", `${(-y * 16).toFixed(2)}deg`);
    }

    function onLeave() {
      badge?.style.setProperty("--tilt-x", "0deg");
      badge?.style.setProperty("--tilt-y", "0deg");
    }

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (fine && badge) {
      badge.addEventListener("pointermove", onMove);
      badge.addEventListener("pointerleave", onLeave);
    }

    return () => {
      typing?.kill();
      typer.kill();
      build.scrollTrigger?.kill();
      build.kill();
      if (badge) {
        badge.removeEventListener("pointermove", onMove);
        badge.removeEventListener("pointerleave", onLeave);
      }
    };
  }, [dict.award.body]);

  return (
    <section className="award" id="award" ref={rootRef} aria-labelledby="award-title">
      {/* The board wiring itself up. Decorative: the section's meaning is in
          its heading and copy, not in the traces. */}
      <svg
        className="award__traces"
        viewBox="0 0 1200 600"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g stroke="var(--steel)" strokeWidth="1" opacity="0.55">
          <path d="M0 120 H180 L230 170 H420 L470 120 H700" />
          <path d="M0 300 H120 L170 250 H360 L410 300 H620 L670 350 H900" />
          <path d="M1200 200 H1000 L950 250 H760" />
          <path d="M1200 430 H980 L930 380 H700 L650 430 H430" />
          <path d="M300 600 V470 L350 420 H540" />
          <path d="M880 600 V500 L830 450 H700" />
        </g>
        <g stroke="var(--gold)" strokeWidth="1" opacity="0.5">
          <path d="M0 480 H240 L290 530 H560" />
          <path d="M1200 90 H940 L890 140 H640" />
        </g>
        <g fill="var(--gold)">
          <circle cx="230" cy="170" r="2.5" />
          <circle cx="670" cy="350" r="2.5" />
          <circle cx="950" cy="250" r="2.5" />
          <circle cx="290" cy="530" r="2.5" />
          <circle cx="890" cy="140" r="2.5" />
        </g>
      </svg>

      <div className="award__dust" aria-hidden="true">
        {MOTES.map((m, i) => (
          <span
            key={i}
            className="award__mote"
            style={{
              left: m.left,
              top: m.top,
              animationDuration: m.duration,
              animationDelay: m.delay,
              transform: `scale(${m.scale})`,
            }}
          />
        ))}
      </div>

      <div className="container">
        <div className="award__grid">
          <div className="award__stage">
            <div className="award__assembly" aria-hidden="true">
              <span className="award__plate" />
              <span className="award__plate" />
              <span className="award__plate" />
            </div>

            <Magnetic strength={0.18} radius={160} className="award__badge-anchor">
              <div className="award__badge" ref={badgeRef}>
                <p className="award__place">
                  {/* Two offset copies in the accent hues; they close onto the
                      real text as the badge resolves. */}
                  <span aria-hidden="true">{dict.award.place}</span>
                  <span aria-hidden="true">{dict.award.place}</span>
                  {dict.award.place}
                </p>
                <p className="award__year" lang="en" dir="ltr">
                  {dict.award.year}
                </p>
              </div>
            </Magnetic>
          </div>

          <div>
            <p className="sec-label mono">{dict.award.label}</p>
            <h2 className="award__title" id="award-title">
              {dict.award.title}
            </h2>
            {/* The full line is the accessible name; the visible copy is what
                types, so assistive technology never reads a partial sentence. */}
            <p className="award__body" aria-label={dict.award.body}>
              <span ref={typedRef} aria-hidden="true" />
              <span className="award__caret" ref={caretRef} aria-hidden="true" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
