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
     * The weight, expressed as a time constant.
     *
     * The two modes Lenis offers are the same filter. In `Animate.advance` the
     * duration branch leaves exactly 2^(-10·t/D) of the gap outstanding — an
     * exponential decay with τ = D/(10·ln2) — and the lerp branch calls
     * `damp(v, target, lerp*60, dt)`, an exponential decay with τ = 1/(60·lerp)
     * evaluated against real elapsed time. Only τ decides the feel.
     *
     * That makes the old comment here wrong on every count, so it is gone: in
     * 1.3.x `damp` exponentiates dt and is frame-rate independent, exponential
     * decay has a distance-independent time constant so a short flick and a long
     * one settle at the same rate, and the lerp branch snaps home once the two
     * round to the same pixel rather than approaching forever. The only real
     * difference is that duration mode has a deadline — and `onVirtualScroll`
     * resets the clock on every wheel event, so during a gesture that deadline
     * never arrives either.
     *
     * `lerp: 0.055` is τ = 0.303s, exactly double the old 1.05s duration's
     * 0.151s, and about 0.91s for a notch to come fully to rest. The knob now
     * names τ directly instead of hiding a 6.93x factor inside an easing
     * function, and it leaves `duration`/`easing` free for the one call that
     * genuinely wants a wall-clock deadline — the anchor jump below.
     *
     * TRAP: passing `easing` without `duration` silently sets `duration = 1`,
     * and the duration branch outranks lerp. Neither key may appear here or the
     * whole tuning reverts to τ = 0.144s with nothing logged.
     */
    const lenis = new Lenis({
      lerp: 0.055,
      /* Left at 1 deliberately. A first-order lag has unity DC gain: sustained
         input settles at exactly the same px/s whatever τ is, and one notch
         still travels exactly as far — only the ramp-up and the tail lengthen.
         Raising this to "compensate" would re-pace every pinned section against
         a scroll length it was authored to, and raise the film's seek rate. */
      wheelMultiplier: 1,
      smoothWheel: true,
      /*
       * Touch is left to the platform. Same conclusion as before, different
       * evidence — the old reasoning here claimed two easing curves fight each
       * other, but with `syncTouch` on Lenis preventDefaults `touchmove` and the
       * platform curve never runs at all. There is only ever one.
       *
       * The reasons that actually hold are specific to this page. Taking touch
       * would put the scroll position itself on the main thread, which is the
       * same thread already decoding a 1080p all-intra seek and uploading it as
       * a texture — and the phone path already coarsens to every third frame
       * precisely because that thread is saturated, so a decode hitch would
       * freeze the page under the finger rather than only the film. Touch is
       * also direct manipulation: any lag has the finger itself as its
       * reference, which is why smoothing that reads as weight on a wheel reads
       * as broken under a thumb. And preventDefaulting `touchmove` costs iOS
       * Safari's URL-bar collapse for the life of the session.
       *
       * Consequence, stated plainly: none of the tuning above is felt on a
       * phone. It is a wheel and trackpad change.
       *
       * `touchMultiplier` used to sit here at 1.6 and was a verified no-op —
       * `onVirtualScroll` early-returns for every touch event while syncTouch is
       * false, discarding the delta it had just scaled.
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
      /*
       * The one call that wants a deadline rather than a decay — and no offset.
       *
       * A per-call `duration` wins over the instance's lerp inside `advance`, so
       * this jump lands in a known 1.1s however far it has to travel. Left on
       * the page's own τ = 0.303s, a page-length anchor spends well over a
       * second visibly creeping into place. A wheel event mid-jump still takes
       * over cleanly, because `onUpdate` keeps `targetScroll` on the current
       * position while the jump is programmatic.
       *
       * There used to be an `offset: -80` here as well, and it was
       * double-counting. Lenis already subtracts the root's
       * `scroll-padding-block-start` when it resolves an element target, and the
       * stylesheet sets that to `calc(var(--header-h) + 2rem)` — 104px, which is
       * exactly the clearance the fixed bar needs. The extra 80 on top landed
       * every in-page anchor 184px above its own section, so About, Projects,
       * Capabilities and Contact all overshot into the whitespace above their
       * headings. The clearance now lives in one place, in CSS, beside the
       * header height it depends on.
       */
      lenis.scrollTo(target as HTMLElement, {
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
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
