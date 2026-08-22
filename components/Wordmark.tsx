import { WORDMARK } from "@/lib/wordmark";
import type { Locale } from "@/lib/i18n";

/**
 * The name, drawn rather than typed.
 *
 * Every letter arrives as a hairline that traces its own contour — the way a
 * plotter lays a drawing down — and the solid form rises into the line once the
 * trace closes. Arabic is written right to left and its letters join, so the
 * strokes here are joined runs in that order: أ, then و, then ميكا, then تر,
 * and so on. Latin gets one stroke per letter.
 *
 * The shapes are the real Cairo outlines from `lib/wordmark`, so this reads as
 * the same wordmark the rest of the site is set in. No script runs: the whole
 * sequence is CSS, and `prefers-reduced-motion` gets the finished mark.
 */
export function Wordmark({
  locale,
  label,
  className,
}: {
  locale: Locale;
  /** The word itself, for anyone who cannot see the drawing. */
  label: string;
  className?: string;
}) {
  const art = WORDMARK[locale] ?? WORDMARK.ar;
  const id = `wm-${locale}`;

  // The specular band travels with the script: right to left in Arabic.
  const rtl = locale === "ar";
  const from = rtl ? art.width : -art.width * 0.55;
  const to = rtl ? -art.width * 0.55 : art.width;

  // One ramp across the whole mark, not one per stroke — object-bounding-box
  // units would restart the gradient inside every letter.
  const [vx, vy, vw, vh] = art.viewBox.split(" ").map(Number);
  const inkStart = rtl ? vx + vw : vx;
  const inkEnd = rtl ? vx : vx + vw;

  return (
    <div
      className={className ? `wordmark ${className}` : "wordmark"}
      style={
        {
          "--wm-groups": art.groups.length,
          "--wm-sweep-from": `${from.toFixed(0)}px`,
          "--wm-sweep-to": `${to.toFixed(0)}px`,
        } as React.CSSProperties
      }
    >
      <svg className="wordmark__svg" viewBox={art.viewBox} role="img" aria-label={label}>
        <defs>
          {/* Steel at the leading edge running through to the brand gold —
              the same ramp the lockup has always carried. */}
          {/* `stop-color` only reads a custom property through the style
              property, never through the presentation attribute. */}
          <linearGradient
            id={`${id}-ink`}
            gradientUnits="userSpaceOnUse"
            x1={inkStart}
            y1={vy}
            x2={inkEnd}
            y2={vy + vh * 0.75}
          >
            <stop offset="0%" style={{ stopColor: "var(--steel)" }} />
            <stop offset="30%" style={{ stopColor: "var(--ink)" }} />
            <stop offset="46%" style={{ stopColor: "#ffffff" }} />
            <stop offset="68%" style={{ stopColor: "var(--gold-bright)" }} />
            <stop offset="100%" style={{ stopColor: "var(--gold)" }} />
          </linearGradient>

          <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <clipPath id={`${id}-clip`}>
            {art.groups.map((d, i) => (
              <path d={d} key={i} />
            ))}
          </clipPath>
        </defs>

        {/* The solid letterforms, one group per stroke. */}
        {art.groups.map((d, i) => (
          <path
            className="wordmark__fill"
            d={d}
            fill={`url(#${id}-ink)`}
            key={`fill-${i}`}
            style={{ "--i": i } as React.CSSProperties}
          />
        ))}

        {/* One pass of light across the finished mark, held inside the
            letterforms by their own clip. */}
        <g clipPath={`url(#${id}-clip)`}>
          <rect
            className="wordmark__sheen"
            x={0}
            y={-2000}
            width={art.width * 0.42}
            height={4000}
            fill={`url(#${id}-sheen)`}
          />
        </g>

        {/* The trace. Drawn last so the line sits over the form it is
            describing, then lifts away once the form has arrived. */}
        {art.groups.map((d, i) => (
          <path
            className="wordmark__trace"
            d={d}
            pathLength={1}
            key={`trace-${i}`}
            style={{ "--i": i } as React.CSSProperties}
          />
        ))}
      </svg>

      <span className="wordmark__rule" aria-hidden="true" />
    </div>
  );
}
