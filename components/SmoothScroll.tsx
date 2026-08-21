"use client";

import { useEffect } from "react";

/**
 * Scroll damping — the weight in the page.
 *
 * The wheel no longer moves the document directly. Each notch adds to a target
 * position, and a requestAnimationFrame loop eases the real scroll position
 * toward it, so the page takes up the movement and puts it down again rather
 * than snapping between positions. The film, which reads the scroll position
 * every frame, inherits the same weight.
 *
 * It drives the native scroll position rather than transforming the page, so
 * `position: sticky`, anchor links, IntersectionObserver, the scrollbar and
 * find-in-page all keep working. Anything that moves the page from outside this
 * loop — a keyboard, the scrollbar, an anchor jump — is detected and the loop
 * resynchronises to it instead of fighting it.
 *
 * Off for touch, where the platform's own momentum is better than anything we
 * would put in front of it, and off under `prefers-reduced-motion`.
 */
export function SmoothScroll() {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let running = false;
    let current = window.scrollY;
    let target = current;
    let last = 0;

    const limit = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    /*
     * The weight has to be measured in time, not in frames. A fixed fraction
     * per frame means the page settles in half the time on a 120Hz screen and
     * takes three times as long on a machine dropping to 20fps — the feel
     * would be whatever the hardware happened to be doing. This converts the
     * per-frame figure into the equivalent share of however long the frame
     * actually took, so the settle is the same wall-clock glide everywhere.
     */
    const PER_FRAME = 0.09;
    function share(dt: number): number {
      return 1 - Math.pow(1 - PER_FRAME, Math.min(dt, 100) / (1000 / 60));
    }

    /** Wheel deltas arrive in pixels, lines, or pages depending on the device. */
    function pixels(event: WheelEvent): number {
      if (event.deltaMode === 1) return event.deltaY * 16;
      if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
      return event.deltaY;
    }

    function frame(now: number) {
      const dt = last ? now - last : 1000 / 60;
      last = now;

      const distance = target - current;

      // Below half a pixel there is nothing left to animate; stop the loop so
      // an idle page costs nothing.
      if (Math.abs(distance) < 0.5) {
        current = target;
        running = false;
        window.scrollTo({ top: current, behavior: "instant" });
        return;
      }

      current += distance * share(dt);
      window.scrollTo({ top: current, behavior: "instant" });
      raf = requestAnimationFrame(frame);
    }

    function onWheel(event: WheelEvent) {
      // Pinch-zoom and horizontal gestures are the platform's business.
      if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      event.preventDefault();

      target = Math.min(limit(), Math.max(0, target + pixels(event)));
      if (!running) {
        running = true;
        current = window.scrollY;
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    }

    /*
     * Anything that moved the page without going through the loop — arrow
     * keys, the scrollbar, an anchor, a browser restore — wins outright. While
     * the loop is running its own writes come back as scroll events too, and
     * the browser rounds them, so mid-flight only a jump far larger than that
     * rounding counts as somebody else's.
     */
    function onScroll() {
      const drift = Math.abs(window.scrollY - current);
      if (drift <= (running ? 60 : 2)) return;
      cancelAnimationFrame(raf);
      running = false;
      current = window.scrollY;
      target = current;
    }

    function attach() {
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    function detach() {
      cancelAnimationFrame(raf);
      running = false;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
    }

    let attached = false;
    function sync() {
      const wanted = finePointer.matches && !reduced.matches;
      if (wanted === attached) return;
      attached = wanted;
      if (wanted) attach();
      else detach();
    }

    sync();
    finePointer.addEventListener("change", sync);
    reduced.addEventListener("change", sync);

    return () => {
      finePointer.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
      if (attached) detach();
    };
  }, []);

  return null;
}
