/**
 * The OmegaTron mark, redrawn as vector art from the official logo.
 *
 * Kept inline rather than loaded as a file so it costs zero requests, stays
 * crisp at every size, and can pick up theme colours. The four elements of the
 * mark are preserved: the open omega ring, the gear quadrant on the left, the
 * circuit traces on the right, and the gold needle through the centre.
 *
 * `tone="mono"` renders the whole mark in `currentColor` — used where the mark
 * sits inside a coloured control and the gold would fight it.
 */
export function Logo({
  className,
  title,
  tone = "brand",
}: {
  className?: string;
  title?: string;
  tone?: "brand" | "mono";
}) {
  const gold = tone === "brand" ? "var(--accent, #d9ae45)" : "currentColor";

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}

      {/* Omega ring, open at the base */}
      <path
        d="M35.1 63.3 A26 26 0 1 1 64.9 63.3"
        stroke="currentColor"
        strokeWidth={7}
        strokeLinecap="butt"
      />

      {/* Base: two plates meeting in a centre chevron */}
      <path
        d="M14 66 H40 L50 75 L60 66 H86"
        stroke="currentColor"
        strokeWidth={6}
        strokeLinejoin="miter"
        strokeLinecap="butt"
      />

      {/* Gear quadrant — the mechanical half */}
      <g stroke="currentColor" strokeWidth={3} strokeLinecap="butt">
        <path d="M44 52.4 A12 12 0 0 1 45.9 30.7" />
        <path d="M40.2 50.5 36.4 48.3M37.7 44.4 33.3 43.6M37.7 38.6 33.3 39.4M40.2 33.5 36.4 35.7" />
      </g>

      {/* Circuit traces — the electronic half */}
      <g stroke="currentColor" strokeWidth={2.2} strokeLinecap="butt">
        <path d="M57 55 V41M62 55 V34M67 55 V45" />
      </g>
      <g fill="currentColor">
        <circle cx="57" cy="39" r="2.2" />
        <circle cx="62" cy="32" r="2.2" />
        <circle cx="67" cy="43" r="2.2" />
      </g>

      {/* Needle */}
      <path d="M50 10 V66" stroke={gold} strokeWidth={2.4} strokeLinecap="butt" />
      <circle cx="50" cy="7.5" r="3.2" stroke={gold} strokeWidth={2.2} />
    </svg>
  );
}

/**
 * The wordmark, split silver/gold exactly as the official logo sets it.
 * Always Latin — a brand name, not a translated string.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className} lang="en" dir="ltr">
      <span className="wordmark__a">OMEGA</span>
      <span className="wordmark__b">TRON</span>
    </span>
  );
}
