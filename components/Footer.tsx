import Link from "next/link";
import { Logo } from "./Logo";
import { LOCALES, type Dictionary, type Locale } from "@/lib/i18n";

/**
 * Public contact address. Set NEXT_PUBLIC_CONTACT_EMAIL to surface it in the
 * footer; when unset the footer simply omits the row rather than showing a
 * placeholder address.
 */
const PUBLIC_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link href={`/${locale}`} className="brand" aria-label={dict.nav.home}>
              <Logo className="brand__mark" />
              <span className="brand__text">
                <span className="brand__name">{dict.meta.siteName}</span>
                <span className="brand__sub">Mechatronics</span>
              </span>
            </Link>
            <p className="footer__tagline">{dict.footer.tagline}</p>
          </div>

          <div>
            <h2 className="footer__title mono">{dict.footer.sections}</h2>
            <ul className="footer__list">
              <li>
                <Link href={`/${locale}#about`} className="footer__link">
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#project`} className="footer__link">
                  {dict.nav.project}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#capabilities`} className="footer__link">
                  {dict.nav.capabilities}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#founder`} className="footer__link">
                  {dict.nav.founder}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="footer__title mono">{dict.footer.contact}</h2>
            <ul className="footer__list">
              <li>
                <Link href={`/${locale}/start`} className="footer__link">
                  {dict.footer.startLabel}
                </Link>
              </li>
              {PUBLIC_EMAIL ? (
                <li>
                  <a href={`mailto:${PUBLIC_EMAIL}`} className="footer__link" dir="ltr">
                    {PUBLIC_EMAIL}
                  </a>
                </li>
              ) : null}
              <li>
                <span className="footer__link">{dict.footer.location}</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="footer__title mono">{dict.footer.language}</h2>
            <ul className="footer__list">
              {LOCALES.map((code) => (
                <li key={code}>
                  <Link
                    href={`/${code}`}
                    className="footer__link"
                    lang={code}
                    hrefLang={code}
                    aria-current={code === locale ? "true" : undefined}
                  >
                    {code === "ar" ? "العربية" : "English"}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {year} {dict.meta.siteName}. {dict.footer.rights}
          </p>
          <p className="mono" dir="ltr">
            NURAI 2026 · 3RD PLACE — IRAQ
          </p>
        </div>
      </div>
    </footer>
  );
}
