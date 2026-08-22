"use client";

import { useEffect, useRef } from "react";
import { directionSign, motion, prefersReduced } from "./motion";

/**
 * A band that never stops, and leans with the page.
 *
 * The items run continuously at a slow base rate; scrolling adds to that rate
 * and can reverse it, so the band reads as geared to the page rather than
 * looping beside it. The list is rendered twice and the offset wraps at half
 * the track's width, which is what makes the seam invisible.
 *
 * The copy is duplicated visually, so the second pass is hidden from assistive
 * technology and the band is announced once.
 */
export function Marquee({ items, label }: { items: string[]; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReduced()) return;

    const { gsap, ScrollTrigger } = motion();
    const sign = directionSign();

    let offset = 0;
    let boost = 0;
    let half = track.scrollWidth / 2;

    const measure = () => {
      half = track.scrollWidth / 2;
    };
    measure();

    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top bottom",
      end: "bottom top",
      onUpdate(self) {
        boost = Math.max(-4, Math.min(4, self.getVelocity() / 340));
      },
      onRefresh: measure,
    });

    const step = () => {
      // A slow constant drift, plus whatever the page is doing.
      offset += (0.45 + boost) * sign;
      boost *= 0.94;
      if (half > 0) {
        // Wrap into [-half, 0) so the duplicate always covers the gap.
        offset = ((offset % half) + half) % half;
      }
      gsap.set(track, { x: -offset * sign });
    };

    gsap.ticker.add(step);
    window.addEventListener("resize", measure);

    return () => {
      gsap.ticker.remove(step);
      window.removeEventListener("resize", measure);
      trigger.kill();
      gsap.set(track, { x: 0 });
    };
  }, [items]);

  return (
    <div className="marquee" role="group" aria-label={label}>
      <div className="marquee__track" ref={trackRef}>
        {[0, 1].map((pass) => (
          <ul className="marquee__set" key={pass} aria-hidden={pass === 1}>
            {items.map((item) => (
              <li className="marquee__item" key={`${pass}-${item}`}>
                {item}
                <span className="marquee__tick" aria-hidden="true" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
