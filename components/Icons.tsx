import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ size = 28, children, ...rest }: IconProps & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Direction-agnostic arrow; the stylesheet mirrors it in RTL. */
export function ArrowIcon(props: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="m4.5 10.5 3.5 3.5 7.5-8" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="m4 4 8 8M12 4l-8 8" />
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Capability marks

   Drawn on the same 24px grid with the same square joins as the logo, so the
   bento grid reads as one set rather than six borrowed glyphs.
   -------------------------------------------------------------------------- */

/** A controller die with its pins — embedded systems. */
export function ChipIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="7" y="7" width="10" height="10" />
      <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" />
    </Base>
  );
}

/** A jointed arm over a base — robotics. */
export function ArmIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 21h8M7 21v-5l6-4 4-6" />
      <circle cx="7" cy="16" r="1.6" />
      <circle cx="13" cy="12" r="1.6" />
      <path d="M15 4h5v4h-5z" />
    </Base>
  );
}

/** A small network resolving to one node — classification on device. */
export function NetworkIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="5" cy="6" r="1.8" />
      <circle cx="5" cy="18" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="12" r="1.8" />
      <path d="M6.6 7.1 10.4 10.9M6.6 16.9 10.4 13.1M13.8 12H17.2" />
    </Base>
  );
}

/** A reading taken off a scale — sensing and measurement. */
export function GaugeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 17a9 9 0 0 1 18 0" />
      <path d="M12 17 17 9" />
      <path d="M3 21h18" />
      <path d="M5.5 12.5 7 13.6M12 7.5V9M18.5 12.5 17 13.6" />
    </Base>
  );
}

/** A loop that closes on itself — control. */
export function LoopIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 9h11a4 4 0 0 1 0 8H8" />
      <path d="M7 6 4 9l3 3" />
      <path d="M11 14l-3 3 3 3" />
    </Base>
  );
}

/** A part and its enclosing volume — modelling and printing. */
export function SolidIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3 21 8v8l-9 5-9-5V8z" />
      <path d="M3 8l9 5 9-5M12 13v8" />
    </Base>
  );
}
