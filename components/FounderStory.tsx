"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { BackLink } from "./BackLink";
import { MaskLines } from "./MaskLines";
import { Social } from "./Social";
import { Magnetic } from "./Magnetic";
import { RippleLink } from "./RippleLink";
import { ArrowIcon } from "./Icons";
import { motion, prefersReduced } from "./motion";
import type { Dictionary, Locale } from "@/lib/i18n";

/**
 * The founder's story.
 *
 * A 40/60 split: the plate on one side moving slower than the page, the
 * account on the other arriving line by line. The pull-quote is the company's
 * own philosophy — the line the founder sets the engineering by — and it types
 * itself once the reader reaches it.
 */
export function FounderStory({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const portraitRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);

  const quote = dict.about.heading;

  useEffect(() => {
    const portrait = portraitRef.current;
    const typed = quoteRef.current;
    const caret = caretRef.current;

    if (prefersReduced()) {
      if (typed) typed.textContent = quote;
      caret?.classList.add("is-done");
      return;
    }

    const { gsap, ScrollTrigger } = motion();
    const triggers: Array<{ kill: () => void }> = [];

    /*
     * The plate travels at 0.8x the page. The image is deliberately taller
     * than its frame (see `.founder-portrait img`), so the slower travel
     * reveals more of it rather than exposing an edge.
     */
    const img = portrait?.querySelector("img");
    if (portrait && img) {
      // Travels through the frame rather than out of it: starting at rest and
      // moving down would leave a gap along the top edge for a portrait that
      // is already on screen when the page loads.
      const drift = gsap.fromTo(
        img,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: portrait,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      triggers.push({ kill: () => { drift.scrollTrigger?.kill(); drift.kill(); } });
    }

    if (typed) {
      const target = quoteRef.current;
      const typer = ScrollTrigger.create({
        trigger: typed,
        // Fires as soon as the block is anywhere near the fold. Held back to
        // 78% it could sit on screen at load as an empty rule with a blinking
        // caret, which reads as a broken element rather than a pending one.
        start: "top 95%",
        once: true,
        onEnter() {
          const cursor = { n: 0 };
          gsap.to(cursor, {
            n: quote.length,
            duration: Math.min(2.2, quote.length * 0.03),
            ease: "none",
            onUpdate() {
              if (target) target.textContent = quote.slice(0, Math.round(cursor.n));
            },
            onComplete() {
              if (target) target.textContent = quote;
              caret?.classList.add("is-done");
            },
          });
        },
      });
      triggers.push(typer);
    }

    return () => triggers.forEach((t) => t.kill());
  }, [quote]);

  return (
    <div className="container founder-page">
      <BackLink href={`/${locale}#founder`} label={dict.nav.back} />

      <div className="founder-grid">
        <div className="founder-portrait" ref={portraitRef}>
          <Image
            src="/images/founder.jpg"
            alt={dict.founder.imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 92vw, 38vw"
          />
        </div>

        <div>
          <MaskLines step={80}>
            {[
              <p className="sec-label mono" key="label">
                {dict.founder.label}
              </p>,
              <h1 className="founder-name" key="name">
                {dict.founder.name}
              </h1>,
              <p className="founder-role mono" key="role">
                {dict.founder.role}
              </p>,
            ]}
          </MaskLines>

          <div className="founder-body">
            <MaskLines step={90}>
              {[
                <p key="lead">{dict.founder.lead}</p>,
                <p key="body">{dict.founder.body}</p>,
              ]}
            </MaskLines>
          </div>

          {/* The full line is the accessible name; the visible copy types, so
              assistive technology never reads a half-finished sentence. */}
          <blockquote className="founder-quote" aria-label={quote}>
            <span ref={quoteRef} aria-hidden="true" />
            <span className="founder-quote__caret" ref={caretRef} aria-hidden="true" />
          </blockquote>

          <div className="founder-actions">
            <Magnetic strength={0.3} radius={110}>
              <RippleLink href={`/${locale}/start`} className="btn">
                {dict.nav.start}
                <ArrowIcon className="btn__arrow" />
              </RippleLink>
            </Magnetic>

            <Social label={dict.founder.social} />
          </div>
        </div>
      </div>
    </div>
  );
}
