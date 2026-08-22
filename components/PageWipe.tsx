"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * The shutter between routes.
 *
 * A panel covers the incoming page and wipes off it diagonally — the CSS owns
 * the animation, this only mounts the panel when the path changes and takes it
 * away when the animation ends. It is skipped on the very first render, so a
 * cold load is not held behind a wipe, and it is `pointer-events: none`
 * throughout, so it can never swallow a click even if it fails to unmount.
 */
export function PageWipe() {
  const pathname = usePathname();
  const first = useRef(true);
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setKey(`${pathname}-${Date.now()}`);
  }, [pathname]);

  if (!key) return null;

  return (
    <div
      key={key}
      className="wipe"
      aria-hidden="true"
      onAnimationEnd={() => setKey(null)}
    />
  );
}
