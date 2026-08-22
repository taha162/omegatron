"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowIcon } from "./Icons";
import { Scramble } from "./Scramble";
import { SplitWords } from "./SplitWords";
import { createFilmRenderer, type FilmRenderer } from "./filmShader";
import { motion, prefersReduced } from "./motion";
import type { Dictionary, Locale } from "@/lib/i18n";

/** The film, cut to 167 all-intra frames at 24fps. */
const FRAME = 1 / 24;

/**
 * One encode, served to every device.
 *
 * The team asked for maximum quality everywhere, so there is no ladder: this is
 * the 1080p source re-cut at every frame with every frame a keyframe. The
 * source is 1080p, so there is nothing above it — a larger tier would be an
 * upscale of pixels that were never shot.
 *
 * It is a heavy file, and that is the accepted trade. Everything around it is
 * built so the weight is never in front of the reader: the poster is painted
 * as the layer's own background, the fetch waits for the page's own load, and
 * until the footage is decodable the scene simply holds on that first frame.
 */
const FILM = "/media/chip-1080.mp4";
const FILM_FALLBACK = "/media/chip-720.webm";

/** The one case that cannot take the MP4 at all. */
function pickSource(video: HTMLVideoElement): { src: string; light: boolean } {
  const canH264 = video.canPlayType('video/mp4; codecs="avc1.640028"') !== "";
  if (!canH264) return { src: FILM_FALLBACK, light: true };

  /*
   * `light` no longer selects a smaller file — there is only one — but it
   * still coarsens how often the decoder is asked for a frame. A phone can
   * display 1080p perfectly well; what it cannot do is decode a new frame on
   * every animation frame while the page is also scrolling.
   */
  const nav = navigator as Navigator & { deviceMemory?: number };
  const smallMemory = (nav.deviceMemory ?? 8) <= 4;
  return { src: FILM, light: smallMemory || window.innerWidth < 700 };
}

/** Ramp a progress figure across a window, clamped at both ends. */
function ramp(p: number, from: number, to: number): number {
  if (to === from) return p >= to ? 1 : 0;
  return Math.min(1, Math.max(0, (p - from) / (to - from)));
}

/**
 * Each beat is visible between its two windows and cross-fades at the edges.
 *
 * The first beat's fade-in is a degenerate window so it is fully lit at exactly
 * zero — a window of [0, 0.04] evaluates to zero at the top of the page, which
 * is where most visitors first see it. The last beat's fade-out sits past one
 * for the same reason at the other end.
 *
 * The windows overlap rather than meeting end to end. Set to hand over cleanly
 * they leave a stretch of scroll with one beat already gone and the next not
 * yet arrived — a screen of film and nothing to read, which is the whole thing
 * this pin is supposed to avoid.
 */
const BEATS: Array<[number, number, number, number]> = [
  [0, 0, 0.28, 0.36],
  [0.3, 0.38, 0.58, 0.66],
  [0.6, 0.68, 1.01, 1.01],
];

export function HeroScene({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    const film = filmRef.current;
    const hint = hintRef.current;
    if (!root || !video || !film) return;

    const beats = Array.from(root.querySelectorAll<HTMLElement>(".hero__beat"));

    /*
     * Reduced motion: no pin, no scrub, no fetch. The poster is already the
     * film's first frame, so the scene still has its picture — it simply does
     * not move, and only the first beat is shown (the stylesheet hides the
     * rest, which would otherwise repeat the same block down the page).
     */
    if (prefersReduced()) {
      beats.forEach((b) => (b.style.opacity = "1"));
      return;
    }

    const { gsap, ScrollTrigger } = motion();

    let ready = false;
    let light = false;

    const onLoaded = () => {
      ready = true;
      video.pause();
      film.classList.add("is-live");

      if (canvas && affordable) {
        renderer = createFilmRenderer(video, canvas);
        if (renderer) {
          film.classList.add("is-shaded");
          window.addEventListener("resize", onResize);
          seekedThisFrame = true;
          raf = requestAnimationFrame(paintFilm);
        }
      }
    };
    video.addEventListener("loadeddata", onLoaded);

    /*
     * The film is fetched after the page's own load, not during it.
     *
     * The poster is already painted as the layer's background, so the scene
     * has its picture from the first frame; starting a multi-megabyte media
     * fetch alongside the document only pushes out the moment the hero is
     * actually readable. The pin runs for three viewports, so the footage has
     * time to arrive before anyone can scrub far into it — and until it does,
     * `ready` stays false and the poster simply holds.
     */
    const chosen = pickSource(video);
    light = chosen.light;

    let idle = 0;
    let idleIsTimeout = false;

    function fetchFilm() {
      if (video!.src) return;
      video!.src = chosen.src;
      video!.load();
    }

    function scheduleFetch() {
      const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
      if (typeof w.requestIdleCallback === "function") {
        idle = w.requestIdleCallback(fetchFilm);
      } else {
        idleIsTimeout = true;
        idle = window.setTimeout(fetchFilm, 200);
      }
    }

    if (document.readyState === "complete") scheduleFetch();
    else window.addEventListener("load", scheduleFetch, { once: true });

    let hintGone = false;
    let lastSeek = -1;

    /*
     * The shader.
     *
     * Taken only where it is affordable: a machine that has told us it has
     * little memory, or a narrow viewport, keeps the plain video element. When
     * the renderer is taken the video is still the source of truth — it is
     * simply drawn through the canvas instead of composited directly, so
     * everything about the scrub is unchanged.
     */
    const canvas = canvasRef.current;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const affordable = (nav.deviceMemory ?? 8) > 4 && window.innerWidth >= 700;
    let renderer: FilmRenderer | null = null;

    /* Signed, normalised, and eased — the raw figure from ScrollTrigger is far
       too spiky to drive a picture with. */
    let velocity = 0;
    let seekedThisFrame = false;
    let raf = 0;

    function paintFilm() {
      if (!renderer) return;
      renderer.render(velocity, seekedThisFrame);
      seekedThisFrame = false;
      velocity *= 0.9;
      if (Math.abs(velocity) < 0.001) velocity = 0;
      raf = requestAnimationFrame(paintFilm);
    }

    const onResize = () => renderer?.resize();

    /** Beat opacity for a given progress figure. Shared by the first paint
        and by every scroll update, so the two can never disagree. */
    function paintBeats(p: number) {
      beats.forEach((beat, i) => {
        const [a, b, c, d] = BEATS[i];
        const shown = ramp(p, a, b) * (1 - ramp(p, c, d));
        beat.style.opacity = String(shown);
        beat.style.transform = `translateY(${((1 - shown) * 18).toFixed(2)}px)`;
        beat.style.pointerEvents = shown > 0.55 ? "auto" : "none";
        beat.setAttribute("aria-hidden", shown > 0.55 ? "false" : "true");
      });
    }

    paintBeats(0);

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate(self) {
        const p = self.progress;
        root.style.setProperty("--film-progress", p.toFixed(4));

        /*
         * Frame selection. A seek costs one decode — every frame is a
         * keyframe, so it is a cheap one, but not free at 120Hz. Below half a
         * frame of movement there is nothing new to show, so nothing is asked
         * for. Scrolling hard raises that threshold: at speed the eye cannot
         * resolve single frames anyway, and holding the decoder to every one
         * of them is what drops the frame rate on a phone. On a device already
         * marked light, the floor is five frames, as a deliberate coarsening.
         */
        if (ready && Number.isFinite(video.duration) && video.duration > 0) {
          const speed = Math.abs(self.getVelocity());
          const coarse = light ? 5 : 1 + Math.min(3, speed / 2200);
          const time = p * video.duration;
          if (lastSeek < 0 || Math.abs(time - lastSeek) > FRAME * coarse * 0.5) {
            video.currentTime = time;
            lastSeek = time;
            // Only a new frame is worth a texture upload.
            seekedThisFrame = true;
          }

          // Signed and normalised. 2800px/s is about as fast as a deliberate
          // flick goes; past that the picture would simply tear.
          const signed = Math.max(-1, Math.min(1, self.getVelocity() / 2800));
          velocity += (signed - velocity) * 0.25;
        }

        // Beats cross-fade with a little parallax, so the type has depth
        // against the board rather than sitting flat on it.
        paintBeats(p);

        if (!hintGone && p > 0.02 && hint) {
          hintGone = true;
          hint.classList.add("is-gone");
        }
      },
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer?.destroy();
      trigger.kill();
      window.removeEventListener("load", scheduleFetch);
      if (idle) {
        const w = window as Window & { cancelIdleCallback?: (h: number) => void };
        if (!idleIsTimeout && typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(idle);
        else window.clearTimeout(idle);
      }
      video.removeEventListener("loadeddata", onLoaded);
      video.removeAttribute("src");
      video.load();
    };
  }, []);

  return (
    <section
      className="hero"
      id="hero"
      ref={rootRef}
      aria-label={dict.meta.siteName}
    >
      <div className="hero__stage">
        {/* The poster is the layer's own background, so the scene has its
            picture in the first painted frame with no video element involved. */}
        <div className="hero__film" ref={filmRef} aria-hidden="true">
          <video
            ref={videoRef}
            className="hero__video"
            preload="none"
            muted
            playsInline
            disablePictureInPicture
            tabIndex={-1}
          />
          {/* Drawn over the video when the shader is taken; the video is then
              only a texture source and is hidden by `.is-shaded`. */}
          <canvas className="hero__canvas" ref={canvasRef} />
        </div>
        <div className="hero__scrim" aria-hidden="true" />

        <div className="container hero__inner">
          <div className="hero__beats">
            {/* Beat 1 — the thesis */}
            <div className="hero__beat">
              <Scramble className="hero__lockup" text={dict.hero.lockup} />
              <SplitWords
                as="h1"
                className="hero__statement"
                text={dict.hero.statement}
                delay={420}
              />
              <p className="hero__lead">{dict.hero.lead}</p>
              <div className="hero__actions">
                <Link href={`/${locale}/start`} className="btn">
                  {dict.hero.secondaryCta}
                  <ArrowIcon className="btn__arrow" />
                </Link>
                <a href="#projects" className="btn btn--ghost">
                  {dict.hero.primaryCta}
                </a>
              </div>
            </div>

            {/* Beat 2 — what the team crosses, read off the project itself */}
            <div className="hero__beat" aria-hidden="true">
              <div className="hero__readout mono">
                <span className="hero__readout-bar" />
                <span>{dict.projects.label}</span>
              </div>
              <p className="hero__statement">{dict.about.heading}</p>
              <p className="hero__lead">{dict.about.body}</p>
            </div>

            {/* Beat 3 — hands off to the award section below */}
            <div className="hero__beat" aria-hidden="true">
              <div className="hero__readout mono">
                <span className="hero__readout-bar" />
                <span>{dict.award.label}</span>
              </div>
              <p className="hero__statement">{dict.award.title}</p>
              <p className="hero__lead">{dict.projects.items[0].summary}</p>
            </div>
          </div>
        </div>

        {/* No caption: on a page whose whole opening is a scroll, being told
            to scroll is noise. The rule breathes and then leaves. */}
        <div className="hero__hint" ref={hintRef} aria-hidden="true">
          <span className="hero__hint-rule" />
          <span className="hero__hint-dot" />
        </div>
      </div>
    </section>
  );
}
