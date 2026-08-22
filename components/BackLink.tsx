import Link from "next/link";
import { ArrowIcon } from "./Icons";

/**
 * The way out of a leaf page.
 *
 * A real link to a real destination rather than `history.back()`: somebody
 * arriving from a search result or a shared link has no history to step back
 * through, and a control that silently does nothing is worse than none.
 */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="back">
      <ArrowIcon className="back__arrow" />
      {label}
    </Link>
  );
}
