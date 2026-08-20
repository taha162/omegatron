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

    function frame() {
      if (!active) return;

      const target = progress();
      // Enough smoothing to take the jitter out of a trackpad, not so much
      // that the film lags behind the thumb.
      eased += (target - eased) * 0.18;

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

      driftX += (pointerX - driftX) * 0.05;
      driftY += (pointerY - driftY) * 0.05;
      layer!.style.setProperty("--px", `${driftX.toFixed(2)}px`);
      layer!.style.setProperty("--py", `${driftY.toFixed(2)}px`);

      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (active) return;
      layer!.classList.add("is-live");
      if (reduced.matches) return;
      active = true;
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
    const base = wide ? "/media/circuit-1280" : "/media/circuit-854";
    const h264 = video.canPlayType('video/mp4; codecs="avc1.640028"');
    video.src = h264 ? `${base}.mp4` : `${base}.webm`;
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
