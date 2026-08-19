import Link from "next/link";
import { Logo, Wordmark } from "./Logo";
import { LOCALES, type Dictionary, type Locale } from "@/lib/i18n";

/**
 * Public contact address. Set NEXT_PUBLIC_CONTACT_EMAIL to surface it here;
 * when unset the row is simply omitted rather than showing a placeholder.
 */
const PUBLIC_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  const sections = [
    { href: `/${locale}#about`, label: dict.nav.about },
    { href: `/${locale}#projects`, label: dict.nav.projects },
    { href: `/${locale}#capabilities`, label: dict.nav.capabilities },
    { href: `/${locale}#contact`, label: dict.nav.contact },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link href={`/${locale}`} className="brand" aria-label={dict.nav.home}>
              <Logo className="brand__mark brand__mark--lg" />
              <Wordmark className="wordmark" />
            </Link>
            <p className="footer__tagline" lang="en" dir="ltr">
              {dict.meta.tagline}
            </p>
          </div>

          <div>
            <h2 className="footer__title mono">{dict.footer.sections}</h2>
            <ul className="footer__list">
              {sections.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="footer__link">
                    {item.label}
                  </Link>
                </li>
              ))}
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
          <p>{dict.footer.location}</p>
        </div>
      </div>
    </footer>
  );
}
