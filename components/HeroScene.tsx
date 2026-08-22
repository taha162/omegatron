"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowIcon } from "./Icons";
import { SplitWords } from "./SplitWords";
import { Wordmark } from "./Wordmark";
import { createFilmRenderer, type FilmRenderer } from "./filmShader";
import { motion, prefersReduced } from "./motion";
import type { Dictionary, Locale } from "@/lib/i18n";

/** The film's own frame rate. Every frame is a keyframe, so a seek is exact. */
const FPS = 24;

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

    /* Captured non-null: the compiler cannot narrow a ref through the hoisted
       function declarations below. */
    const vid: HTMLVideoElement = video;
    const layer: HTMLDivElement = film;

    let ready = false;

    /*
     * ==================================================================
     * The scheduler
     * ==================================================================
     *
     * Scrubbing a 1080p all-intra film is decode work, and there are three
     * ways to get it wrong. All three produce the same symptom — a picture
     * that stalls and then jumps — and the first version of this file made
     * all three:
     *
     *  1. Asking for frames faster than the film has them. A threshold of
     *     half a frame allows ~48 requests a second for a 24fps film, and
     *     half of those land on the frame already showing. Everything below
     *     is quantised to a frame *index*, so a frame is never requested
     *     twice.
     *
     *  2. Assigning `currentTime` while a seek is still in flight. The engine
     *     abandons the first seek and starts again, so under a slow scroll —
     *     where a fresh request arrives every single frame — nothing ever
     *     completes. That is exactly why the film appeared frozen while
     *     reading slowly and then jumped when the scroll stopped. Nothing is
     *     assigned here while `video.seeking` is true.
     *
     *  3. Re-uploading the texture on every scroll event instead of on every
     *     new frame. At 60Hz that is roughly 330 MB/s of texture traffic for
     *     a film with 24 distinct frames a second to show. The upload is now
     *     driven by `requestVideoFrameCallback`, which fires when the engine
     *     actually has a new frame to paint.
     *
     * The scroll handler now records position and nothing else. Every decode
     * decision belongs to the loop, which runs at the display's rate rather
     * than at whatever rate scroll events happen to arrive.
     */
    let targetTime = 0;
    let easedTime = 0;
    let shownFrame = -1;
    let pendingFrame = -1;
    let dirty = false;
    let velocity = 0;
    let raf = 0;
    let hintGone = false;

    type FrameCallbackHost = HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: () => void) => number;
      cancelVideoFrameCallback?: (handle: number) => void;
    };
    const frameHost = video as FrameCallbackHost;
    const hasFrameCallback = typeof frameHost.requestVideoFrameCallback === "function";
    let frameHandle = 0;

    function onNewFrame() {
      dirty = true;
      if (pendingFrame >= 0) {
        shownFrame = pendingFrame;
        pendingFrame = -1;
      }
      if (hasFrameCallback) {
        frameHandle = frameHost.requestVideoFrameCallback!(onNewFrame);
      }
    }

    /* Where `requestVideoFrameCallback` is unavailable, `seeked` is the next
       best signal that the requested frame has landed. */
    const onSeeked = () => {
      dirty = true;
      if (pendingFrame >= 0) {
        shownFrame = pendingFrame;
        pendingFrame = -1;
      }
    };
    video.addEventListener("seeked", onSeeked);

    /*
     * The shader.
     *
     * Taken only where it is affordable: a machine reporting little memory, or
     * a narrow viewport, keeps the plain video element. Where it is taken the
     * video is still the source of truth — simply drawn through the canvas
     * rather than composited directly.
     */
    const canvas = canvasRef.current;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const affordable = (nav.deviceMemory ?? 8) > 4 && window.innerWidth >= 700;
    let renderer: FilmRenderer | null = null;

    /*
     * A device that cannot keep up is given a coarser grid rather than a
     * different file: it still shows 1080p, it is simply asked for a new frame
     * every second or third one. Quantising to a coarser index is what keeps a
     * phone's decoder inside its budget.
     */
    let step = pickSource(video).light ? 3 : 1;

    /*
     * The watchdog.
     *
     * No machine is asked to prove itself before the effect is offered, and
     * none is left stuttering under it either: the loop times its own frames,
     * and if the hero cannot hold its rate the shader is dropped for the rest
     * of the session and the plain video takes over. A visitor never sees a
     * page that judders — at worst they see one without a flourish.
     */
    const FRAME_BUDGET = 26; // ms. 60Hz is 16.7; this allows real headroom.
    let slowFrames = 0;
    let sampled = 0;
    let lastFrameAt = 0;
    let shaderRetired = false;

    function retireShader() {
      if (shaderRetired || !renderer) return;
      shaderRetired = true;
      renderer.destroy();
      renderer = null;
      layer.classList.remove("is-shaded");
      window.removeEventListener("resize", onResize);
      // A device that cannot afford the shader cannot afford a frame every
      // frame either.
      step = Math.max(step, 3);
    }

    function loop() {
      raf = requestAnimationFrame(loop);

      const now = performance.now();
      /*
       * Only frames the shader is actually responsible for are judged.
       *
       * A frame is counted when the film is decodable and the reader is
       * moving — during load the page is streaming a large file, decoding,
       * laying out and running its entrances, and none of that is the
       * shader's doing. Judging those frames retires the effect on machines
       * that could have carried it perfectly well, which is what the first
       * version of this watchdog did.
       */
      if (lastFrameAt && renderer && !shaderRetired && ready && Math.abs(velocity) > 0.01) {
        const delta = now - lastFrameAt;
        if (sampled < 600) {
          sampled += 1;
          if (delta > FRAME_BUDGET) slowFrames += 1;
          // A third of a sustained scroll missing its budget is not a blip.
          if (sampled > 120 && slowFrames > sampled / 3) retireShader();
        }
      }
      lastFrameAt = now;

      if (ready && Number.isFinite(vid.duration) && vid.duration > 0) {
        // Chase the scroll rather than snapping to it, so a flick asks the
        // decoder for a run of frames instead of one impossible jump.
        easedTime += (targetTime - easedTime) * 0.24;

        const total = Math.max(1, Math.round(vid.duration * FPS));
        const raw = Math.round((easedTime * FPS) / step) * step;
        const want = Math.min(total - 1, Math.max(0, raw));

        // One request in flight at a time, and never for the frame already up.
        if (want !== shownFrame && want !== pendingFrame && !vid.seeking) {
          pendingFrame = want;
          // Land mid-frame: on an exact boundary an engine may round either
          // way and hand back the neighbour.
          vid.currentTime = (want + 0.5) / FPS;
        }
      }

      if (renderer) {
        renderer.render(velocity, dirty);
        dirty = false;
      }

      velocity *= 0.9;
      if (Math.abs(velocity) < 0.001) velocity = 0;
    }

    const onResize = () => renderer?.resize();

    /*
     * The loop only runs while the scene is on screen.
     *
     * It used to run for the life of the page, which meant every section below
     * the hero was paying for a WebGL draw it could not see. Measured over a
     * read of the archive that was the whole of that section's frame cost:
     * gating the loop on visibility took it to none.
     */
    let onScreen = true;

    function startLoop() {
      if (!raf && ready) raf = requestAnimationFrame(loop);
    }

    function stopLoop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      // The watchdog measures gaps between frames; a gap that spans a pause is
      // not the shader's doing.
      lastFrameAt = 0;
    }

    const watcher = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) startLoop();
        else stopLoop();
      },
      { rootMargin: "15% 0px" }
    );
    watcher.observe(root);

    const onLoaded = () => {
      ready = true;
      video.pause();
      film.classList.add("is-live");
      dirty = true;

      if (hasFrameCallback) {
        frameHandle = frameHost.requestVideoFrameCallback!(onNewFrame);
      }

      if (canvas && affordable) {
        renderer = createFilmRenderer(video, canvas);
        if (renderer) {
          film.classList.add("is-shaded");
          window.addEventListener("resize", onResize);
        }
      }

      if (onScreen) startLoop();
    };
    video.addEventListener("loadeddata", onLoaded);

    /*
     * The film is fetched after the page's own load, not during it.
     *
     * The poster is already painted as the layer's background, so the scene
     * has its picture from the first frame; starting a multi-megabyte media
     * fetch alongside the document only pushes out the moment the hero becomes
     * readable. Until the footage is decodable, `ready` stays false and the
     * poster simply holds.
     */
    const chosen = pickSource(video);

    let idle = 0;
    let idleIsTimeout = false;

    function fetchFilm() {
      if (vid.src) return;
      vid.src = chosen.src;
      vid.load();
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

    /** Beat opacity for a given progress figure. Shared by the first paint and
        by every scroll update, so the two can never disagree. */
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

        // Position only. No decode work happens on a scroll event.
        if (ready && Number.isFinite(video.duration) && video.duration > 0) {
          targetTime = p * video.duration;
        }

        // Signed and normalised. 2800px/s is about as fast as a deliberate
        // flick goes; past that the picture would simply tear.
        const signed = Math.max(-1, Math.min(1, self.getVelocity() / 2800));
        velocity += (signed - velocity) * 0.25;

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
      watcher.disconnect();
      cancelAnimationFrame(raf);
      if (frameHandle && typeof frameHost.cancelVideoFrameCallback === "function") {
        frameHost.cancelVideoFrameCallback(frameHandle);
      }
      video.removeEventListener("seeked", onSeeked);
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
              <Wordmark locale={locale} label={dict.hero.lockup} />
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
