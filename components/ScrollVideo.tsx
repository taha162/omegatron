"use client";

import { useEffect, useRef } from "react";
import type { Dictionary } from "@/lib/i18n";

/**
 * A scroll-scrubbed film, not a video player.
 *
 * The section is a tall runway with a sticky stage inside it; scroll position
 * across the runway maps to the video timeline. There are no controls, no
 * autoplay and no audio track — the file is muted, all-intra encoded so every
 * seek is exact and instant, and it is only fetched once the section is close
 * to the viewport.
 *
 * Everything runs inside one rAF loop that is started by an IntersectionObserver
 * and stopped the moment the section leaves the viewport, so nothing is
 * listening to scroll while the visitor is elsewhere on the page.
 */
export function ScrollVideo({ dict }: { dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const captionRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const stage = stageRef.current;
    if (!section || !video || !stage) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    let raf = 0;
    let active = false;
    let target = 0; // where the scroll says we should be, 0..1
    let eased = 0; // where we actually are, chasing `target`
    let pointerX = 0;
    let pointerY = 0;
    let parallaxX = 0;
    let parallaxY = 0;
    let loaded = false;

    /** Progress of the sticky stage across its runway, clamped to 0..1. */
    function progress(): number {
      const rect = section!.getBoundingClientRect();
      const runway = rect.height - window.innerHeight;
      if (runway <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / runway));
    }

    function paintCaptions(p: number) {
      // Two phrases, each fading up and out across its own stretch of the runway.
      const windows: [number, number][] = [
        [0.1, 0.44],
        [0.56, 0.92],
      ];
      windows.forEach(([from, to], i) => {
        const node = captionRefs.current[i];
        if (!node) return;
        const span = to - from;
        const local = (p - from) / span; // 0..1 inside this phrase's window
        let opacity = 0;
        if (local > 0 && local < 1) {
          // ramp up over the first fifth, hold, ramp down over the last fifth
          opacity = Math.min(1, Math.min(local / 0.2, (1 - local) / 0.2));
        }
        node.style.opacity = String(opacity);
        node.style.transform = `translateY(${(1 - opacity) * 12}px)`;
      });
    }

    function frame() {
      if (!active) return;

      target = progress();
      eased += (target - eased) * 0.12;

      const duration = video!.duration;
      if (loaded && Number.isFinite(duration) && duration > 0) {
        const time = eased * duration;
        // Only seek when the change is worth a frame, so we do not thrash the
        // decoder while the page is still.
        if (Math.abs(video!.currentTime - time) > 1 / 24) {
          video!.currentTime = time;
        }
      }

      parallaxX += (pointerX - parallaxX) * 0.06;
      parallaxY += (pointerY - parallaxY) * 0.06;
      stage!.style.setProperty("--px", `${parallaxX.toFixed(2)}px`);
      stage!.style.setProperty("--py", `${parallaxY.toFixed(2)}px`);

      paintCaptions(eased);
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (active || reduced.matches) return;
      active = true;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      active = false;
      cancelAnimationFrame(raf);
    }

    function onPointerMove(event: PointerEvent) {
      if (!finePointer.matches) return;
      const rect = stage!.getBoundingClientRect();
      // −1..1 from the centre of the stage, scaled to a few pixels of drift.
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * -18;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * -12;
    }

    const onLoaded = () => {
      loaded = true;
      video.pause();
    };
    video.addEventListener("loadeddata", onLoaded);

    // Fetch the file only once the section is within a screen of the viewport.
    const preloader = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          video.preload = "auto";
          video.load();
          preloader.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    preloader.observe(section);

    // Run the loop only while the section is actually on screen.
    const runner = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) start();
        else stop();
      },
      { threshold: 0 },
    );
    runner.observe(section);

    if (reduced.matches) {
      paintCaptions(0.3);
      captionRefs.current.forEach((node) => {
        if (node) {
          node.style.opacity = "1";
          node.style.transform = "none";
        }
      });
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      stop();
      preloader.disconnect();
      runner.disconnect();
      video.removeEventListener("loadeddata", onLoaded);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <section
      className="cine"
      ref={sectionRef}
      aria-labelledby="cine-title"
      id="signal"
    >
      <div className="cine__stage" ref={stageRef}>
        <div className="cine__frame">
          {/*
            Two encodes, one download: the browser picks the first source it
            can decode. The MP4 is all-intra so Safari — the pickiest seeker —
            lands every frame exactly.
          */}
          <video
            ref={videoRef}
            className="cine__video"
            poster="/media/circuit-poster.jpg"
            preload="none"
            muted
            playsInline
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src="/media/circuit.webm" type="video/webm" />
            <source src="/media/circuit.mp4" type="video/mp4" />
          </video>
          <span className="cine__wash" aria-hidden="true" />
        </div>

        <div className="cine__captions">
          <h2 className="visually-hidden" id="cine-title">
            {dict.cine.title}
          </h2>
          {dict.cine.lines.map((line, i) => (
            <p
              className="cine__caption"
              key={line}
              ref={(node) => {
                captionRefs.current[i] = node;
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
