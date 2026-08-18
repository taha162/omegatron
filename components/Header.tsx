"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useId, useState } from "react";
import { Logo } from "./Logo";
import { LOCALES, otherLocale, type Dictionary, type Locale } from "@/lib/i18n";

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

  const close = useCallback(() => setOpen(false), []);

  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}#about`, label: dict.nav.about },
    { href: `/${locale}#projects`, label: dict.nav.projects },
    { href: `/${locale}#capabilities`, label: dict.nav.capabilities },
    { href: `/${locale}#founder`, label: dict.nav.founder },
    { href: `/${locale}#contact`, label: dict.nav.contact },
  ];

  const alt = otherLocale(locale);

  return (
    <header className="header">
      <div className="container header__inner">
        <Link href={`/${locale}`} className="brand" aria-label={dict.nav.home} onClick={close}>
          <Logo className="brand__mark" />
          <span className="brand__text">
            <span className="brand__name">{dict.meta.siteName}</span>
            <span className="brand__sub">Mechatronics</span>
          </span>
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
            {LOCALES.map((code) => (
              <Link
                key={code}
                href={localizedPath(pathname, code)}
                className="lang-toggle__opt"
                lang={code}
                hrefLang={code}
                aria-current={code === locale ? "true" : undefined}
                aria-label={code === alt ? dict.meta.otherLocaleLabel : undefined}
                onClick={close}
              >
                {code === "ar" ? "العربية" : "EN"}
              </Link>
            ))}
          </div>

          <Link href={`/${locale}/start`} className="btn header__cta" onClick={close}>
            {dict.nav.start}
          </Link>

          <button
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

      {open ? (
        <div className="mobile-nav" id={menuId}>
          <div className="container">
            <ul className="mobile-nav__list">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="mobile-nav__link" onClick={close}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={`/${locale}/start`} className="btn mobile-nav__cta" onClick={close}>
              {dict.nav.start}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
