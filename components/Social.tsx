import { InstagramIcon, LinkedInIcon } from "./Icons";
import { FOUNDER_INSTAGRAM, FOUNDER_LINKEDIN } from "@/lib/site";

/**
 * The founder's public profiles.
 *
 * `rel="me"` states the identity claim, and `noopener` is set because these
 * open in a new tab — without it the destination gets a handle on this window.
 * The visible label is the network's own name, so the row is readable without
 * having to recognise a glyph.
 */
export function Social({ label }: { label: string }) {
  const profiles = [
    { href: FOUNDER_LINKEDIN, name: "LinkedIn", Icon: LinkedInIcon },
    { href: FOUNDER_INSTAGRAM, name: "Instagram", Icon: InstagramIcon },
  ];

  return (
    <ul className="social" aria-label={label}>
      {profiles.map(({ href, name, Icon }) => (
        <li key={name}>
          <a
            className="social__link"
            href={href}
            target="_blank"
            rel="me noopener noreferrer"
            aria-label={name}
            title={name}
          >
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  );
}
