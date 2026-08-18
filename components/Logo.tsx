/**
 * OmegaTron mark — an inline SVG omega monogram.
 *
 * Inline (rather than a file) so it costs zero requests, stays crisp at every
 * size, and inherits `currentColor` on light and dark backgrounds alike.
 * To swap in the official logo file, see `public/images/README.md`.
 */
export function Logo({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="square"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path d="M6.4 26h6.2C8.6 23.4 6.2 19.5 6.2 15 6.2 9.2 10.4 5 16 5s9.8 4.2 9.8 10c0 4.5-2.4 8.4-6.4 11h6.2" />
    </svg>
  );
}
