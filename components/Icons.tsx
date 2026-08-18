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

export function RoboticsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 2.5v3" />
      <rect x="4" y="5.5" width="16" height="10" />
      <path d="M8.5 9.5v2M15.5 9.5v2M8 15.5v3M16 15.5v3M5 21.5h6M13 21.5h6" />
    </Base>
  );
}

export function MechatronicsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 2.5 20.5 7.2v9.6L12 21.5 3.5 16.8V7.2Z" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 2.5v5.1M20.5 16.8l-4.6-2.5M3.5 16.8l4.6-2.5" />
    </Base>
  );
}

export function AiIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="5" cy="6" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6.7 7 10.4 10.8M6.7 17 10.4 13.2M14 12h3" />
    </Base>
  );
}

export function EmbeddedIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="6.5" y="6.5" width="11" height="11" />
      <rect x="10" y="10" width="4" height="4" />
      <path d="M9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21M3 9.5h3.5M3 14.5h3.5M17.5 9.5H21M17.5 14.5H21" />
    </Base>
  );
}

export function AutomationIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3.5 12a8.5 8.5 0 0 1 8.5-8.5c3.2 0 6 1.8 7.4 4.4" />
      <path d="M20.5 12a8.5 8.5 0 0 1-8.5 8.5c-3.2 0-6-1.8-7.4-4.4" />
      <path d="M19.4 3.6v4.3h-4.3M4.6 20.4v-4.3h4.3" />
    </Base>
  );
}

export function PrototypingIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 2.8 21 7.4v9.2L12 21.2 3 16.6V7.4Z" />
      <path d="M3 7.4l9 4.6 9-4.6M12 12v9.2" />
    </Base>
  );
}

export function IotIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="2.4" />
      <circle cx="4.5" cy="5.5" r="1.8" />
      <circle cx="19.5" cy="5.5" r="1.8" />
      <circle cx="4.5" cy="18.5" r="1.8" />
      <circle cx="19.5" cy="18.5" r="1.8" />
      <path d="m6 6.8 4.2 3.6M18 6.8l-4.2 3.6M6 17.2l4.2-3.6M18 17.2l-4.2-3.6" />
    </Base>
  );
}

export function MachineLearningIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3.5 20.5V3.5" />
      <path d="M3.5 20.5h17" />
      <rect x="6.5" y="13" width="3" height="4.5" />
      <rect x="11.5" y="9.5" width="3" height="8" />
      <rect x="16.5" y="6" width="3" height="11.5" />
    </Base>
  );
}

export function SensorsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M2.5 14.5h3l2-6 3 11 2.5-8 1.8 3h6.7" />
      <circle cx="12" cy="4" r="1.4" />
    </Base>
  );
}

export function MechanicalIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v3.4M12 18.1v3.4M2.5 12h3.4M18.1 12h3.4M5.3 5.3l2.4 2.4M16.3 16.3l2.4 2.4M18.7 5.3l-2.4 2.4M7.7 16.3l-2.4 2.4" />
    </Base>
  );
}

export const CAPABILITY_ICONS = [
  EmbeddedIcon,
  RoboticsIcon,
  IotIcon,
  AiIcon,
  MachineLearningIcon,
  SensorsIcon,
  AutomationIcon,
  MechanicalIcon,
  PrototypingIcon,
] as const;
