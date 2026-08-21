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
 * Touch is taken over too: the finger drags the target directly and the
 * velocity it was carrying at release is projected forward, so a flick coasts
 * to a stop with the same weight the wheel has. That does replace the
 * platform's own momentum — the trade accepted for having one feel on every
 * device. Off entirely under `prefers-reduced-motion`.
 */
export function SmoothScroll() {
  useEffect(() => {
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
    const PER_FRAME = 0.06;
    /* A finger is a direct manipulation: the page has to stay under it while
       it is down, and only take on its full weight once it lets go. */
    const PER_FRAME_DRAG = 0.4;
    function share(dt: number, perFrame: number): number {
      return 1 - Math.pow(1 - perFrame, Math.min(dt, 100) / (1000 / 60));
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

      current += distance * share(dt, dragging ? PER_FRAME_DRAG : PER_FRAME);
      window.scrollTo({ top: current, behavior: "instant" });
      raf = requestAnimationFrame(frame);
    }

    function run() {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    }

    function onWheel(event: WheelEvent) {
      // Pinch-zoom and horizontal gestures are the platform's business.
      if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      event.preventDefault();

      if (!running) current = window.scrollY;
      target = Math.min(limit(), Math.max(0, target + pixels(event)));
      run();
    }

    /*
     * Touch. The platform's own momentum is replaced rather than layered on:
     * the finger drags the target directly, and on release the velocity it was
     * carrying is projected forward and handed to the same easing the wheel
     * uses, so a flick coasts to a stop with the weight of the rest of the site.
     *
     * A second finger is left alone — that is a pinch — and so is anything
     * inside a control that scrolls on its own.
     */
    let dragging = false;
    let touchY = 0;
    let touchAt = 0;
    let velocity = 0;

    function scrollsItself(node: EventTarget | null): boolean {
      let el = node instanceof Element ? node : null;
      while (el && el !== document.body) {
        if (el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) return true;
        const overflow = getComputedStyle(el).overflowY;
        if ((overflow === "auto" || overflow === "scroll") && el.scrollHeight > el.clientHeight) {
          return true;
        }
        el = el.parentElement;
      }
      return false;
    }

    function onTouchStart(event: TouchEvent) {
      if (event.touches.length !== 1 || scrollsItself(event.target)) {
        dragging = false;
        return;
      }
      dragging = true;
      touchY = event.touches[0].clientY;
      touchAt = performance.now();
      velocity = 0;
      cancelAnimationFrame(raf);
      running = false;
      current = window.scrollY;
      target = current;
    }

    function onTouchMove(event: TouchEvent) {
      if (!dragging || event.touches.length !== 1) return;
      event.preventDefault();

      const y = event.touches[0].clientY;
      const moved = touchY - y;
      touchY = y;

      const now = performance.now();
      const dt = Math.max(1, now - touchAt);
      touchAt = now;
      // Pixels per frame, smoothed, so one jittery sample cannot throw the
      // flick that follows.
      velocity = velocity * 0.7 + ((moved / dt) * (1000 / 60)) * 0.3;

      target = Math.min(limit(), Math.max(0, target + moved));
      run();
    }

    function onTouchEnd() {
      if (!dragging) return;
      dragging = false;
      // Project the flick forward. The easing does the rest of the work.
      target = Math.min(limit(), Math.max(0, target + velocity * 14));
      run();
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
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      window.addEventListener("touchcancel", onTouchEnd, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      // Without this the browser's own overscroll gestures fire underneath the
      // damper — pull-to-refresh on a page that is not scrolling itself.
      document.documentElement.style.overscrollBehaviorY = "none";
    }

    function detach() {
      cancelAnimationFrame(raf);
      running = false;
      dragging = false;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.style.removeProperty("overscroll-behavior-y");
    }

    let attached = false;
    function sync() {
      const wanted = !reduced.matches;
      if (wanted === attached) return;
      attached = wanted;
      if (wanted) attach();
      else detach();
    }

    sync();
    reduced.addEventListener("change", sync);

    return () => {
      reduced.removeEventListener("change", sync);
      if (attached) detach();
    };
  }, []);

  return null;
}
