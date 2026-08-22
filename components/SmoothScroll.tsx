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
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
      /*
       * Touch is left to the platform.
       *
       * iOS and Android already run momentum scrolling on their own
       * compositors, off the main thread, tuned to the device. Driving it from
       * JavaScript puts a second easing curve on top of one that is already
       * running, and the two disagree about where the page should be for the
       * whole length of every flick — which is what a finger reads as
       * stuttering. The wheel still gets the weight; a finger gets the
       * platform's own, which is better than anything this can synthesise.
       */
      syncTouch: false,
      // The browser's own overscroll gestures would otherwise fire underneath
      // the engine — pull-to-refresh on a page that is not scrolling itself.
      overscroll: false,
    });

    /*
     * One job on scroll: keep ScrollTrigger's clock on Lenis's.
     *
     * There used to be a second job here — a velocity "lean" written to a
     * custom property on `<html>`, which five blocks read to tilt a degree into
     * the direction of travel. It was measured out. A custom property on the
     * root element is inherited, so every write invalidates the style of the
     * whole document, and the write happened on every scroll event: over a
     * 6.5-second read of the page that was 2.1 seconds of style recalculation,
     * about a third of the scroll's entire wall-clock time. Removing it took
     * recalculation from 2508ms to 391ms and frame-time deviation from 4.2ms
     * to 2.6ms. A one-degree tilt is not worth a third of the frame budget.
     */
    lenis.on("scroll", () => ScrollTrigger.update());

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
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(step);
      lenis.destroy();
    };
  }, []);

  return null;
}
