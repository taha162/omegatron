"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { motion, prefersReduced } from "./motion";

/**
 * The weight in the page.
 *
 * Lenis takes the wheel and the touch off the document and eases the real
 * scroll position toward a target, so movement carries momentum instead of
 * snapping. Because it drives the native scroll position rather than
 * transforming the page, `position: sticky` — and therefore every pinned
 * section — anchors, the scrollbar and find-in-page all keep working.
 *
 * Lenis and ScrollTrigger must share one clock. Left on separate loops, GSAP
 * reads a scroll position Lenis has not written yet and every pinned section
 * lags a frame behind the page. The wiring below is the fix: Lenis is stepped
 * from GSAP's ticker, and ScrollTrigger is updated from Lenis's own event.
 *
 * Off entirely under `prefers-reduced-motion` — the page then scrolls exactly
 * as the platform intends.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReduced()) return;

    const { gsap, ScrollTrigger } = motion();

    const coarse = window.matchMedia("(pointer: coarse)").matches;

    /*
     * The weight, and why it is a duration rather than a lerp.
     *
     * A lerp moves a fixed fraction of the remaining distance each frame. It
     * never actually arrives, so the last stretch of every gesture crawls, and
     * because the step depends on the distance left, a short flick and a long
     * one settle at different rates. That inconsistency is what reads as
     * "not smooth" even though nothing is dropping frames.
     *
     * A duration with an exponential ease-out gives every gesture the same
     * wall-clock settle whatever its length, and lands rather than
     * asymptotically approaching. The curve below is steep at the start and
     * flat at the end: the page takes the movement up immediately and puts it
     * down softly, which is the "precision dial" weight without the drag.
     */
    const lenis = new Lenis({
      duration: coarse ? 0.9 : 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      smoothWheel: true,
      // Without this the finger drags the page and the platform's own scroll
      // at once, and the two fight over the same gesture.
      syncTouch: true,
      syncTouchLerp: 0.075,
      // The browser's own overscroll gestures would otherwise fire underneath
      // the engine — pull-to-refresh on a page that is not scrolling itself.
      overscroll: false,
    });

    /*
     * The lean.
     *
     * Content tilts a degree or so into the direction of travel and rights
     * itself the moment the page settles — the visual half of the weight the
     * damper gives the wheel. It is written to one custom property on the root
     * and read by `.skewable`, which is only ever put on blocks that contain
     * nothing pinned: a transform on an ancestor makes `position: fixed` and
     * `sticky` resolve against that ancestor instead of the viewport, which
     * would tear the hero and the filmstrip off their pins.
     */
    const root = document.documentElement;
    let lean = 0;

    lenis.on("scroll", ({ velocity }: { velocity: number }) => {
      ScrollTrigger.update();
      const target = Math.max(-1.1, Math.min(1.1, velocity / 26));
      lean += (target - lean) * 0.16;
      root.style.setProperty("--lean", `${lean.toFixed(3)}deg`);
    });

    const step = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(step);
    // GSAP's lag smoothing pauses the ticker after a long frame, which would
    // leave the scroll stalled mid-gesture.
    gsap.ticker.lagSmoothing(0);

    /*
     * Pinned sections are measured from the document, and the document's
     * height changes as fonts land and images decode. Refreshing once things
     * have settled stops a pin starting a few hundred pixels from where the
     * section actually is — which shows up as the scene jumping when it is
     * first reached.
     */
    const settle = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});

    // An anchor inside a Lenis page has to be handled by Lenis, or the browser
    // jumps the document out from under the engine.
    function onAnchorClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.('a[href*="#"]');
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.querySelector(url.hash);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
      history.pushState(null, "", url.hash);
    }

    document.addEventListener("click", onAnchorClick);

    return () => {
      window.clearTimeout(settle);
      root.style.removeProperty("--lean");
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(step);
      lenis.destroy();
    };
  }, []);

  return null;
}
