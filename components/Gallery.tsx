"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, prefersReduced } from "./motion";
import type { Dictionary } from "@/lib/i18n";

/**
 * The archive, as a wall that assembles itself.
 *
 * The section is a tall runway with one screen pinned inside it. As the runway
 * is read, the wall comes up off its back foot — scaling in from three-quarters
 * and unwinding a few degrees of rotation — while each column drifts vertically
 * at its own rate, so the plates never move as one sheet.
 *
 * Every frame of that is CSS. ScrollTrigger writes a single number, and the
 * transforms hang off it; there is no per-frame layout and no per-plate tween,
 * which is what keeps a wall of photographs off the film's frame budget.
 *
 * The photographs are the team's own, and the section shows only what the team
 * has actually shot — a wall padded out with stock would say nothing.
 *
 * `project-enclosure.jpg` and `project-chamber.jpg` are named the opposite way
 * round to what they show; the alt text below follows the picture, the way the
 * rail does. See `public/images/README.md`.
 */
export function Gallery({ dict }: { dict: Dictionary }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (prefersReduced()) {
      root.style.setProperty("--gal-p", "1");
      return;
    }

    const { ScrollTrigger } = motion();

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate(self) {
        root.style.setProperty("--gal-p", self.progress.toFixed(4));
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section
      className="gal"
      id="archive"
      ref={rootRef}
      aria-labelledby="archive-title"
    >
      <div className="gal__sticky">
        <div className="container gal__head">
          <p className="sec-label mono">{dict.gallery.label}</p>
          <h2 className="gal__title" id="archive-title">
            {dict.gallery.heading}
          </h2>
          <p className="gal__lead">{dict.gallery.lead}</p>
        </div>

        <div className="gal__wall">
          <div
            className="gal__col"
            style={{ "--drift": 210, "--rows": "1.18fr 0.82fr" } as React.CSSProperties}
          >
            <figure className="gal__plate">
              <Image
                src="/images/project-chamber.jpg"
                alt={dict.projects.images.enclosureAlt}
                fill
                loading="lazy"
                sizes="(max-width: 900px) 46vw, (max-width: 1200px) 31vw, 24vw"
              />
            </figure>
            <figure className="gal__plate">
              <Image
                src="/images/project-array.jpg"
                alt={dict.projects.images.unitAlt}
                fill
                loading="lazy"
                sizes="(max-width: 900px) 46vw, (max-width: 1200px) 31vw, 24vw"
              />
            </figure>
          </div>

          {/* The anchor: one tall plate the other columns drift against. */}
          <div
            className="gal__col gal__col--anchor"
            style={{ "--drift": -260 } as React.CSSProperties}
          >
            <figure className="gal__plate">
              <Image
                src="/images/project-enclosure.jpg"
                alt={dict.projects.images.chamberAlt}
                fill
                loading="lazy"
                sizes="(max-width: 900px) 46vw, (max-width: 1200px) 31vw, 26vw"
              />
            </figure>
          </div>

          <div
            className="gal__col gal__col--tail"
            style={{ "--drift": 170, "--rows": "0.74fr", "--inset": "4%" } as React.CSSProperties}
          >
            <figure className="gal__plate">
              <Image
                src="/images/founder.jpg"
                alt={dict.founder.imageAlt}
                fill
                loading="lazy"
                sizes="(max-width: 900px) 46vw, (max-width: 1200px) 31vw, 24vw"
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
