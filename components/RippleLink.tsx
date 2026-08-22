"use client";

import Link from "next/link";
import { useCallback, type MouseEvent, type ReactNode } from "react";

/**
 * A link that leaves a ripple where it was pressed.
 *
 * The ripple is a span sized to cover the control from the point of contact
 * and removed when its animation ends, so nothing accumulates in the DOM. It
 * is decorative only — the link works identically without it, including from
 * the keyboard, where there is no pointer position to ripple from.
 */
export function RippleLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const spawn = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const host = event.currentTarget;
    const box = host.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    // Reach the furthest corner from the point of contact.
    const size =
      2 * Math.max(Math.hypot(x, y), Math.hypot(box.width - x, y),
        Math.hypot(x, box.height - y), Math.hypot(box.width - x, box.height - y));

    const ripple = document.createElement("span");
    ripple.className = "btn__ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    host.appendChild(ripple);
  }, [onClick]);

  return (
    <Link href={href} className={className} onClick={spawn}>
      {children}
    </Link>
  );
}
