"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Logo, Wordmark } from "./Logo";
import { LOCALES, type Dictionary, type Locale } from "@/lib/i18n";

/** Swap the locale segment of the current path, keeping the rest intact. */
function localizedPath(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${locale}`;
  segments[0] = locale;
  return `/${segments.join("/")}`;
}

/** How far down the page the HUD comes up. */
const HUD_AT = 0.15;

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname() || `/${locale}`;
  const [open, setOpen] = useState(false);
  const [hud, setHud] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  /*
   * The bar carries nothing until the visitor is past 15vh, then phases in.
   * Read from a plain scroll listener rather than a ScrollTrigger: it is one
   * boolean, it must keep working on pages that never create a timeline, and
   * Lenis dispatches native scroll events either way.
   */
  useEffect(() => {
    const mark = () => setHud(window.scrollY > window.innerHeight * HUD_AT);
    mark();
    window.addEventListener("scroll", mark, { passive: true });
    window.addEventListener("resize", mark);
    return () => {
      window.removeEventListener("scroll", mark);
      window.removeEventListener("resize", mark);
    };
  }, []);

  /*
   * While the overlay is open it owns the screen: Escape shuts it and hands
   * focus back to the control that opened it, and the page behind it stops
   * scrolling.
   */
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // The founder now has a page of its own; everything else is a section.
  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}#about`, label: dict.nav.about },
    { href: `/${locale}#projects`, label: dict.nav.projects },
    { href: `/${locale}#capabilities`, label: dict.nav.capabilities },
    { href: `/${locale}/founder`, label: dict.nav.founder },
    { href: `/${locale}#contact`, label: dict.nav.contact },
  ];

  return (
    <header className={`header${hud ? " is-hud" : ""}`}>
      <span className="header__sweep" aria-hidden="true" />

      <div className="container">
        <div className="header__inner">
          <Link href={`/${locale}`} className="brand" aria-label={dict.nav.home} onClick={close}>
            <Logo className="brand__mark" />
            <Wordmark className="wordmark" />
          </Link>

          <nav className="nav" aria-label={dict.nav.primary}>
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="nav__link">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header__actions">
            <div className="lang-toggle" role="group" aria-label={dict.footer.language}>
              {LOCALES.map((code, i) => (
                <span key={code}>
                  {i > 0 ? (
                    <span className="lang-toggle__sep" aria-hidden="true">
                      /
                    </span>
                  ) : null}
                  <Link
                    href={localizedPath(pathname, code)}
                    className="lang-toggle__opt"
                    lang={code}
                    hrefLang={code}
                    aria-current={code === locale ? "page" : undefined}
                    onClick={close}
                  >
                    {code === "ar" ? "ع" : "EN"}
                  </Link>
                </span>
              ))}
            </div>

            <Link href={`/${locale}/start`} className="btn header__cta" onClick={close}>
              {dict.nav.start}
            </Link>

            <button
              ref={toggleRef}
              type="button"
              className="nav-toggle"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? dict.nav.close : dict.nav.menu}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="nav-toggle__bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Full-screen overlay. Kept in the document so it eases both ways;
          while it is shut CSS sets `visibility: hidden`, which also takes the
          links out of the tab order. */}
      <div className={`mobile-nav${open ? " is-open" : ""}`} id={menuId}>
        <div className="container">
          <ul className="mobile-nav__list">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="mobile-nav__link"
                  tabIndex={open ? undefined : -1}
                  onClick={close}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={`/${locale}/start`}
            className="btn mobile-nav__cta"
            tabIndex={open ? undefined : -1}
            onClick={close}
          >
            {dict.nav.start}
          </Link>
        </div>
      </div>
    </header>
  );
}
