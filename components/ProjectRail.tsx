"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { directionSign, motion, prefersReduced } from "./motion";
import type { Dictionary } from "@/lib/i18n";

/**
 * The project as a filmstrip.
 *
 * The strip is pinned with `position: sticky` and pulled sideways by vertical
 * scroll. Sticky rather than GSAP's own pinning: it needs no pin-spacer in the
 * DOM, survives a resize without re-measuring the document, and degrades to an
 * ordinary block the moment the pin is switched off.
 *
 * The section's height is the viewport plus however far the strip has to
 * travel, so the pin lasts exactly as long as the horizontal run and not a
 * pixel longer — there is never a screen of nothing at either end.
 */
export function ProjectRail({ dict }: { dict: Dictionary }) {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const project = dict.projects.items[0];

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    if (prefersReduced()) {
      root.style.height = "auto";
      return;
    }

    const { gsap, ScrollTrigger } = motion();
    const sign = directionSign();
    let distance = 0;

    function measure() {
      // How far past the viewport the strip extends. Clamped at zero so a
      // strip that already fits never creates a pin with nothing to do.
      distance = Math.max(0, track!.scrollWidth - window.innerWidth);
      root!.style.height = `${window.innerHeight + distance}px`;
      return distance;
    }

    measure();

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onRefresh: measure,
      onUpdate(self) {
        const p = self.progress;
        root.style.setProperty("--rail-progress", p.toFixed(4));
        gsap.set(track, { x: -distance * p * sign });
      },
    });

    return () => {
      trigger.kill();
      gsap.set(track, { x: 0 });
      root.style.height = "";
    };
  }, []);

  const plates = [
    {
      src: "/images/project-enclosure.jpg",
      alt: dict.projects.images.chamberAlt,
      caption: project.points[0],
      specKey: dict.projects.spec.status,
      specVal: project.status,
    },
    {
      src: "/images/project-chamber.jpg",
      alt: dict.projects.images.enclosureAlt,
      caption: project.points[1],
      specKey: dict.projects.spec.award,
      specVal: project.award,
    },
    {
      src: "/images/project-array.jpg",
      alt: dict.projects.images.unitAlt,
      caption: project.points[2],
      specKey: dict.projects.spec.domains,
      specVal: project.domains.join(" · "),
    },
  ];

  return (
    <section className="rail" id="projects" ref={rootRef} aria-labelledby="projects-title">
      <div className="rail__viewport">
        <div className="rail__track" ref={trackRef}>
          <article className="rail__panel rail__panel--lead">
            <p className="sec-label mono">{dict.projects.label}</p>
            <h2 className="rail__name" id="projects-title">
              {project.name}
            </h2>
            <p className="rail__summary">{project.summary}</p>
            <ul className="rail__tags">
              {project.domains.map((domain) => (
                <li className="rail__tag" key={domain}>
                  {domain}
                </li>
              ))}
            </ul>
            <p className="rail__caption-text" style={{ marginBlockStart: "1.5rem" }}>
              {dict.projects.oneOf}
            </p>
          </article>

          {plates.map((plate, i) => (
            <figure className="rail__panel" key={plate.src}>
              <div className="rail__figure">
                <Image
                  src={plate.src}
                  alt={plate.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 620px) 78vw, (max-width: 1200px) 46vw, 34rem"
                />
                <div className="rail__spec">
                  <div className="rail__spec-row">
                    <span className="rail__spec-key mono">{plate.specKey}</span>
                    <span className="rail__spec-val">{plate.specVal}</span>
                  </div>
                </div>
              </div>
              <figcaption className="rail__caption">
                <span className="rail__index mono" lang="en" dir="ltr">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="rail__caption-text">{plate.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="rail__progress" aria-hidden="true" />
      </div>
    </section>
  );
}
