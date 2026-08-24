"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { WORDMARK } from "@/lib/wordmark";
import { prefersReduced } from "./motion";
import type { Dictionary, Locale } from "@/lib/i18n";

/**
 * The boot screen — what the reader watches while the scene is made ready.
 *
 * ==========================================================================
 * Why it is allowed to wait for a 32 MB film
 * ==========================================================================
 *
 * It is not waiting for 32 MB. `public/media/chip-1080.mp4` is written with
 * `-movflags +faststart`: `ftyp` is 32 bytes, `moov` is 3.5 KB and sits at the
 * front, and only then does `mdat` begin. The film is all-intra at 24fps, and
 * its first sample is 90,189 bytes. So `loadeddata` — one decodable frame,
 * which is exactly what `.hero__film.is-live` puts on screen — costs about
 * 92 KB. That is 75ms on 10 Mbps and under a second on 1 Mbps.
 *
 * `canplaythrough` would be a promise about playing all 33 MB of a file nobody
 * ever plays, so it is not used. If the film is ever re-cut without faststart,
 * `moov` moves to the tail, `loadeddata` becomes a 33 MB wait, and FILM_CAP
 * below is the only thing standing between a reader and a blank screen.
 *
 * ==========================================================================
 * How it is built so it cannot trap anyone
 * ==========================================================================
 *
 * Every gate settles three ways: on success, on failure, or on its own cap.
 * Above them a CEILING hands over regardless. Above that, `.boot` carries a
 * CSS-only dead-man's switch — a keyframe that hides the panel at 12s whether
 * or not this component is alive — so even a JavaScript bundle that never
 * arrives cannot leave a curtain over the page.
 *
 * Crucially, nothing here gates the hero's own animations. An earlier design
 * paused them behind an `html.is-covered` class, which fails CLOSED: the hero
 * wordmark's trace, fill and rule all start at their hidden value and depend on
 * a `forwards` animation to appear, so a dead bundle would have left the name
 * permanently invisible. This screen draws its own copy of the mark instead.
 * By the time it lifts the hero's mark has finished drawing underneath, so the
 * handoff is one settled mark replacing another rather than a second entrance.
 */

const FLOOR = 1500; // The mark finishes plotting at ~1.26s in the longer script.
const CEILING = 9000;
const ASSET_CAP = 2500;
const FILM_CAP = 8000;

type GateName = "type" | "plate" | "film";
const GATES: GateName[] = ["type", "plate", "film"];

export function Boot({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  /*
   * The film only exists on the home route; every other page has nothing to
   * wait for and must never see a curtain.
   *
   * This is decided during render, not in the effect. Effects do not run while
   * the server renders, so deciding it there had the panel in the server markup
   * of every route and taken away again on hydration — a curtain that flashed
   * over `/start` and `/founder` for exactly as long as it took the bundle to
   * arrive, which is the slow connection where it is least welcome.
   *
   * `usePathname` returns the same value on both sides, so no hydration
   * mismatch. Reduced motion cannot be read during render at all, so that case
   * is handled twice over: the effect below, and a `display: none` in the
   * stylesheet that applies before any script runs.
   */
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  const [done, setDone] = useState<Record<GateName, boolean>>({
    type: false,
    plate: false,
    film: false,
  });
  /** `hold` -> `off` (outro running, page already live underneath) -> `gone`. */
  const [phase, setPhase] = useState<"hold" | "off" | "gone">("hold");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /*
     * Reduced motion gets no curtain at all. HeroScene returns before it ever
     * touches the video on that path, so there is nothing to wait for — and a
     * loading screen is itself motion nobody asked for. The poster is already
     * painted as the film layer's own background, so the hero has its picture.
     */
    if (!isHome || prefersReduced()) {
      setPhase("gone");
      return;
    }

    const mountedAt = performance.now();
    let alive = true;
    const timers: number[] = [];

    const settle = (name: GateName) =>
      alive && setDone((d) => (d[name] ? d : { ...d, [name]: true }));

    const cap = (name: GateName, ms: number) =>
      timers.push(window.setTimeout(() => settle(name), ms));

    /* ---------------------------------------------------------------- type */
    document.fonts?.ready.then(() => settle("type")).catch(() => settle("type"));
    if (!document.fonts) settle("type");
    cap("type", ASSET_CAP);

    /* --------------------------------------------------------------- plate
       The poster is already the film layer's CSS background, so this is a
       cache hit that resolves as soon as it has decoded. */
    const plate = new Image();
    plate.src = "/media/chip-poster.jpg";
    plate
      .decode()
      .then(() => settle("plate"))
      .catch(() => settle("plate"));
    cap("plate", ASSET_CAP);

    /* ---------------------------------------------------------------- film
       HeroScene owns the element and the fetch; this only listens. If the
       element never appears, or never reaches a decodable frame, the cap
       closes the gate anyway. */
    let video: HTMLVideoElement | null = null;
    const onLoaded = () => settle("film");

    const findVideo = () => {
      if (!alive || video) return;
      video = document.querySelector<HTMLVideoElement>(".hero__video");
      if (!video) {
        timers.push(window.setTimeout(findVideo, 120));
        return;
      }
      // readyState 2 is HAVE_CURRENT_DATA — the frame is already there.
      if (video.readyState >= 2) return settle("film");
      video.addEventListener("loadeddata", onLoaded, { once: true });
      video.addEventListener("error", onLoaded, { once: true });
    };
    findVideo();

    /*
     * A metered or very slow connection is told not to wait. The reader gets
     * the title card and the page, and the film arrives whenever it arrives.
     */
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const thin = conn?.saveData === true || /^(slow-)?2g$/.test(conn?.effectiveType ?? "");
    cap("film", thin ? 0 : FILM_CAP);

    /* ------------------------------------------------------------- release */
    const leave = () => {
      if (!alive) return;
      alive = false;
      setPhase("off");
      // The outro is 620ms in the stylesheet; unmount a little after it.
      window.setTimeout(() => setPhase("gone"), 700);
    };

    timers.push(window.setTimeout(leave, CEILING));

    /* A reader who does not want to watch does not have to. */
    const skip = () => leave();
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchstart", skip, { passive: true });
    window.addEventListener("keydown", skip);
    rootRef.current?.addEventListener("click", skip);

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      video?.removeEventListener("loadeddata", onLoaded);
      video?.removeEventListener("error", onLoaded);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      window.removeEventListener("keydown", skip);
    };
    // `mountedAt` is read by the release effect below through the ref it sets.
    void mountedAt;
  }, [isHome]);

  /*
   * The release rule, kept apart from the wiring so it can watch the gates.
   *
   * All three settled, and at least FLOOR since mount — long enough that the
   * mark is seen to plot rather than flashing. Under StrictMode's double mount
   * this simply runs twice against the same state; there is no `spent` latch to
   * poison the remount, which is what made an earlier design invisible in dev.
   */
  const startedRef = useRef<number>(0);
  if (startedRef.current === 0 && typeof performance !== "undefined") {
    startedRef.current = performance.now();
  }

  useEffect(() => {
    if (phase !== "hold") return;
    if (!GATES.every((g) => done[g])) return;

    const waited = performance.now() - startedRef.current;
    const t = window.setTimeout(
      () => {
        setPhase("off");
        window.setTimeout(() => setPhase("gone"), 700);
      },
      Math.max(0, FLOOR - waited),
    );
    return () => clearTimeout(t);
  }, [done, phase]);

  if (!isHome || phase === "gone") return null;

  const art = WORDMARK[locale] ?? WORDMARK.ar;
  const settled = GATES.filter((g) => done[g]).length;

  return (
    <div
      ref={rootRef}
      className={`boot${phase === "off" ? " is-off" : ""}`}
      role="status"
      aria-label={dict.boot.label}
      aria-live="polite"
    >
      <div className="boot__inner">
        {/*
         * The mark, plotted as bare hairlines.
         *
         * No <defs>, no gradients, no clip paths and therefore no ids — the
         * hero's own lockup is in the document at the same time and its
         * gradient and clip ids must stay unique.
         */}
        <svg
          className="boot__mark"
          viewBox={art.viewBox}
          role="img"
          aria-label={dict.meta.siteName}
        >
          {art.groups.map((d, i) => (
            <path
              className="boot__stroke"
              d={d}
              pathLength={1}
              key={i}
              style={{ "--i": i } as React.CSSProperties}
            />
          ))}
        </svg>

        {/* The meter: one rule that fills a third at a time. */}
        <div className="boot__meter" aria-hidden="true">
          <span
            className="boot__meter-fill"
            style={{ transform: `scaleX(${settled / GATES.length})` }}
          />
        </div>

        {/* The three gates, in the data register. Each lamp lights as its own
            gate closes, so the wait reads as work being done rather than as a
            spinner going round. */}
        <ul className="boot__gates" aria-hidden="true">
          {GATES.map((g, i) => (
            <li className={`boot__gate${done[g] ? " is-done" : ""}`} key={g}>
              <span className="boot__lamp" />
              <span className="boot__gate-name mono">{dict.boot.steps[i]}</span>
            </li>
          ))}
        </ul>
      </div>

      <span className="boot__scan" aria-hidden="true" />
    </div>
  );
}
