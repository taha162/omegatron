"use client";

import { useEffect, useRef } from "react";

/**
 * The circuit film, running as the page's backdrop rather than a section.
 *
 * It is fixed to the viewport and sits behind the content from the hero down to
 * the founder; scroll position across that range drives `currentTime`, so the
 * board advances as the visitor reads. It is not a player: no controls, no
 * autoplay, no audio track, `aria-hidden` and untabbable.
 *
 * One requestAnimationFrame loop does the seeking, the fade-out at the end of
 * the range, and the pointer parallax. An IntersectionObserver runs that loop
 * only while the range is on screen, and the layer is taken out of compositing
 * entirely once the visitor scrolls past it.
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
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    let raf = 0;
    let active = false;
    let last = 0;
    let eased = 0;
    let pointerX = 0;
    let pointerY = 0;
    let driftX = 0;
    let driftY = 0;
    let ready = false;

    /** How far the reader is through the film range, 0..1. */
    function progress(): number {
      const rect = range!.getBoundingClientRect();
      const runway = rect.height - window.innerHeight;
      if (runway <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / runway));
    }

    /*
     * The hero dissolves as its hold runs out, so the release reads as a
     * hand-off to the film rather than the statement being dragged off the top
     * of the screen.
     */
    const hero = document.querySelector<HTMLElement>(".hero");
    function fadeHero() {
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const runway = rect.height - window.innerHeight;
      if (runway <= 0) return;
      const through = Math.min(1, Math.max(0, -rect.top / runway));
      const out = Math.min(1, Math.max(0, (through - 0.72) / 0.28));
      hero.style.setProperty("--hero-opacity", String(1 - out));
    }

    /* Per-frame fractions make the easing depend on the frame rate; converting
       them to a share of the elapsed time keeps the same glide on a 120Hz
       screen and on a phone dropping frames while it decodes. */
    function share(dt: number, perFrame: number): number {
      return 1 - Math.pow(1 - perFrame, Math.min(dt, 100) / (1000 / 60));
    }

    function frame(now: number) {
      if (!active) return;
      const dt = last ? now - last : 1000 / 60;
      last = now;

      const target = progress();
      // The page itself is already smoothed by the scroll damper, so this only
      // has to take the last of the jitter out.
      eased += (target - eased) * share(dt, 0.3);

      fadeHero();

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

      // Hand the film back to the page over the last stretch of the range.
      const fade = eased > 0.9 ? Math.max(0, 1 - (eased - 0.9) / 0.1) : 1;
      layer!.style.opacity = String(fade);

      driftX += (pointerX - driftX) * share(dt, 0.05);
      driftY += (pointerY - driftY) * share(dt, 0.05);
      layer!.style.setProperty("--px", `${driftX.toFixed(2)}px`);
      layer!.style.setProperty("--py", `${driftY.toFixed(2)}px`);

      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (active) return;
      layer!.classList.add("is-live");
      if (reduced.matches) return;
      active = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      active = false;
      cancelAnimationFrame(raf);
      layer!.classList.remove("is-live");
    }

    function onPointerMove(event: PointerEvent) {
      if (!finePointer.matches) return;
      pointerX = (event.clientX / window.innerWidth - 0.5) * -16;
      pointerY = (event.clientY / window.innerHeight - 0.5) * -10;
    }

    const onLoaded = () => {
      ready = true;
      video.pause();
    };
    video.addEventListener("loadeddata", onLoaded);

    // Choose the file ourselves rather than letting the browser fall through a
    // list of <source> elements — that would fetch the MP4, fail to decode it,
    // and fetch the WebM as well. Asking canPlayType first means exactly one
    // request, and the smaller H.264 file everywhere it is supported.
    const wide = window.matchMedia("(min-width: 900px)").matches;
    const h264 = video.canPlayType('video/mp4; codecs="avc1.640028"');
    video.src = h264
      ? wide
        ? "/media/circuit-1080.mp4"
        : "/media/circuit-540.mp4"
      : "/media/circuit-720.webm";
    video.load();

    const runner = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) start();
        else stop();
      },
      { threshold: 0 },
    );
    runner.observe(range);

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      stop();
      runner.disconnect();
      video.removeEventListener("loadeddata", onLoaded);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [rangeId]);

  return (
    <div className="film" ref={layerRef} aria-hidden="true">
      <video
        ref={videoRef}
        className="film__video"
        poster="/media/circuit-poster.jpg"
        preload="auto"
        muted
        playsInline
        disablePictureInPicture
        tabIndex={-1}
      />
      <span className="film__scrim" />
    </div>
  );
}
