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

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname() || `/${locale}`;
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  /*
   * While the sheet is open it owns the screen: Escape shuts it and hands
   * focus back to the control that opened it, and the page behind it stops
   * scrolling so a finger on the sheet cannot drag the document underneath.
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

  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}#about`, label: dict.nav.about },
    { href: `/${locale}#projects`, label: dict.nav.projects },
    { href: `/${locale}#capabilities`, label: dict.nav.capabilities },
    { href: `/${locale}#founder`, label: dict.nav.founder },
    { href: `/${locale}#contact`, label: dict.nav.contact },
  ];

  return (
    <header className="header">
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

      {/* The page dims under the open sheet, so the sheet is plainly the thing
          in front and its actions cannot be confused with the ones behind it.
          Tapping the dimmed page shuts the menu, as a tap outside a sheet
          should. */}
      <button
        type="button"
        className={`nav-scrim${open ? " is-open" : ""}`}
        aria-hidden="true"
        tabIndex={-1}
        onClick={close}
      />

      {/* Kept in the document so it can ease both open and shut; while it is
          closed CSS sets `visibility: hidden`, which also takes the links out
          of the tab order. */}
      <div className="mobile-nav-wrap">
        <div className={`mobile-nav${open ? " is-open" : ""}`} id={menuId}>
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
