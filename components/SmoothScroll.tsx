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

    // A finger is direct manipulation and needs to keep up with the thumb, so
    // touch is given a shorter settle than the wheel.
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const lenis = new Lenis({
      lerp: coarse ? 0.15 : 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      smoothWheel: true,
      // The browser's own overscroll gestures would otherwise fire underneath
      // the engine — pull-to-refresh on a page that is not scrolling itself.
      overscroll: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const step = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(step);
    // GSAP's lag smoothing pauses the ticker after a long frame, which would
    // leave the scroll stalled mid-gesture.
    gsap.ticker.lagSmoothing(0);

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
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(step);
      lenis.destroy();
    };
  }, []);

  return null;
}
