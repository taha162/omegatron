"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n";

export const THEME_KEY = "omegatron-theme";

/**
 * Light is the default. The toggle stores an explicit choice and sets
 * `data-theme` on the document element; the inline script in the layout
 * re-applies it before first paint so the page never flashes.
 */
export function ThemeToggle({ dict }: { dict: Dictionary }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(current);
    setReady(true);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private browsing: the choice simply does not persist.
    }
  }

  const label = theme === "dark" ? dict.nav.themeLight : dict.nav.themeDark;

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={`${dict.nav.theme}: ${label}`}
      title={label}
      // Before hydration the button cannot know the stored choice, so it is
      // hidden from assistive tech rather than announcing the wrong state.
      aria-hidden={ready ? undefined : true}
    >
      <SunIcon className="theme-toggle__icon theme-toggle__icon--sun" />
      <MoonIcon className="theme-toggle__icon theme-toggle__icon--moon" />
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}
