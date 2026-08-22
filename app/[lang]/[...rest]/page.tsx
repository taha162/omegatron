import { notFound } from "next/navigation";

/**
 * Anything under a locale that is not a real page.
 *
 * Without this, `/ar/anything` matched no route at all and Next answered with
 * its own built-in error screen — unstyled, English-only, and with no way back
 * into the site. A stale link, a typo or an old bookmark is exactly the moment
 * a visitor needs the site to still look like the site.
 *
 * Static segments win over a catch-all, so `/ar/founder` and `/ar/start` are
 * untouched; only paths with nothing behind them arrive here. `notFound()`
 * answers with a real 404 status and hands over to the boundary in
 * `app/[lang]/not-found.tsx` — a page that renders 404 content under a 200
 * would be a soft 404, which is worse than the screen it replaced.
 */
export default function CatchAll() {
  notFound();
}
