"use client";

import { useEffect, useRef } from "react";

/**
 * The circuit film, as the hero's instrument display.
 *
 * The picture is always there: `.film` paints the 48 KB poster as its own
 * background, so the hero has its image in the first frame the browser draws,
 * with no video element involved. The footage is an enhancement laid over that
 * poster, and it is only ever fetched when it is worth the bytes.
 *
 * When it does run, scroll across the hero's exit drives `currentTime`, and
 * the same 0..1 figure is written to `--film-progress` so the scale along the
 * hero's bottom edge can mark it. The film is not a player: no controls, no
 * sound, no autoplay, `aria-hidden` and untabbable.
 */
export function FilmBackdrop({ rangeId }: { rangeId: string }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const video = videoRef.current;
    const range = document.getElementById(rangeId);
    if (!layer || !video || !range) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    /*
     * Whether to spend the bytes at all.
     *
     * The footage is all-intra — every frame a keyframe, which is what makes
     * the scrub feel attached to the scroll — and that is why it costs 9.3 MB.
     * It is an enhancement over a poster that already shows the same picture,
     * so it is only ever fetched where it is genuinely worth that:
     *
     *   - never for somebody who has asked for less motion,
     *   - never on a connection the browser has told us is metered or slow,
     *   - never on a narrow viewport. This is the split the project always
     *     intended; there was simply never a small encode to serve, and
     *     sending the full one to a phone is not a substitute for having one.
     *     A visitor on mobile data gets the same frame at 48 KB.
     *
     * Where the browser will not say — Safari and Firefox expose no Network
     * Information API — a wide viewport is taken as good enough.
     */
    const WIDE_ENOUGH = 900;

    function worthFetching(): boolean {
      if (reduced.matches) return false;
      if (window.innerWidth < WIDE_ENOUGH) return false;

      const conn = (
        navigator as Navigator & {
          connection?: { saveData?: boolean; effectiveType?: string };
        }
      ).connection;
      if (!conn) return true;
      if (conn.saveData) return false;
      return conn.effectiveType === "4g" || conn.effectiveType === undefined;
    }

    let raf = 0;
    let active = false;
    let ready = false;
    let eased = 0;
    let last = 0;

    /** How far the hero has scrolled out of frame, 0..1. */
    function progress(): number {
      const rect = range!.getBoundingClientRect();
      if (rect.height <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / rect.height));
    }

    /* A fixed fraction per frame would settle in half the time on a 120Hz
       screen and take three times as long on a machine dropping frames. This
       converts it to a share of however long the frame actually took. */
    function share(dt: number, perFrame: number): number {
      return 1 - Math.pow(1 - perFrame, Math.min(dt, 100) / (1000 / 60));
    }

    function frame(now: number) {
      if (!active) return;
      const dt = last ? now - last : 1000 / 60;
      last = now;

      const target = progress();
      eased += (target - eased) * share(dt, 0.18);

      range!.style.setProperty("--film-progress", eased.toFixed(4));

      const duration = video!.duration;
      if (ready && Number.isFinite(duration) && duration > 0) {
        const time = eased * duration;
        // Only seek when the move is worth half a frame, so a still page does
        // not keep the decoder busy. Every frame is a keyframe, so the seek
        // itself costs one decode.
        if (Math.abs(video!.currentTime - time) > 1 / 40) {
          video!.currentTime = time;
        }
      }

      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (active || reduced.matches) return;
      active = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      active = false;
      cancelAnimationFrame(raf);
    }

    const onLoaded = () => {
      ready = true;
      video.pause();
      layer.classList.add("is-live");
    };
    video.addEventListener("loadeddata", onLoaded);

    /*
     * Choose the file rather than listing <source> elements: a fallthrough
     * list makes the browser fetch the MP4, fail to decode it, and fetch the
     * WebM as well, doubling the bytes. Asking canPlayType first means exactly
     * one request.
     */
    function fetchFilm() {
      if (video!.src) return;
      const h264 = video!.canPlayType('video/mp4; codecs="avc1.640028"');
      video!.src = h264 ? "/media/circuit-1080.mp4" : "/media/circuit-720.webm";
      video!.load();
    }

    /* Never in front of the page's own load. The poster is already showing,
       so nothing is waiting on this.
       These are called through `window` rather than through a detached
       reference: a bare `ric(fetchFilm)` is an unbound WebIDL operation, and
       some engines reject that as an illegal invocation. */
    let idle = 0;
    let idleIsTimeout = false;
    function scheduleFetch() {
      if (!worthFetching()) return;
      const go = () => {
        const w = window as Window & {
          requestIdleCallback?: (cb: () => void) => number;
        };
        if (typeof w.requestIdleCallback === "function") {
          idle = w.requestIdleCallback(fetchFilm);
        } else {
          idleIsTimeout = true;
          idle = window.setTimeout(fetchFilm, 600);
        }
      };
      if (document.readyState === "complete") go();
      else window.addEventListener("load", go, { once: true });
    }
    scheduleFetch();

    // The loop only runs while the hero is on screen. Once it is gone the film
    // has nothing left to report.
    const runner = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) start();
        else stop();
      },
      { threshold: 0 },
    );
    runner.observe(range);

    return () => {
      stop();
      runner.disconnect();
      if (idle) {
        const w = window as Window & {
          cancelIdleCallback?: (handle: number) => void;
        };
        if (!idleIsTimeout && typeof w.cancelIdleCallback === "function") {
          w.cancelIdleCallback(idle);
        } else {
          window.clearTimeout(idle);
        }
      }
      video.removeEventListener("loadeddata", onLoaded);
    };
  }, [rangeId]);

  return (
    <div className="film" ref={layerRef} aria-hidden="true">
      <video
        ref={videoRef}
        className="film__video"
        preload="none"
        muted
        playsInline
        disablePictureInPicture
        tabIndex={-1}
      />
      <span className="film__scrim" />
    </div>
  );
}
