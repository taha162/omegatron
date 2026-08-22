import Link from "next/link";
import { getDictionary } from "@/lib/i18n";

const ar = getDictionary("ar");
const en = getDictionary("en");

/**
 * The 404.
 *
 * A not-found boundary cannot read route params, so it cannot know which
 * language the visitor was reading. It used to answer in Arabic regardless,
 * which put Arabic copy inside an English document whenever the miss happened
 * under `/en` — the one page on the site guaranteed to be seen by someone who
 * is already lost.
 *
 * So it says it in both, and stops pretending to know. Each block carries its
 * own `lang` and `dir`, so the two scripts are set correctly whichever
 * direction the document itself is running in, and each offers its own way
 * home. On a site whose whole premise is that both languages are first-class,
 * a bilingual 404 reads as intent rather than as a fallback.
 */
export default function NotFound() {
  const langs = [
    { locale: "ar" as const, dict: ar, dir: "rtl" as const },
    { locale: "en" as const, dict: en, dir: "ltr" as const },
  ];

  return (
    <div className="container nf">
      <p className="nf__code" lang="en" dir="ltr">
        404
      </p>

      <div className="nf__pair">
        {langs.map(({ locale, dict, dir }) => (
          <div className="nf__side" key={locale} lang={locale} dir={dir}>
            <h1 className="nf__title">{dict.notFound.title}</h1>
            <p className="nf__body">{dict.notFound.body}</p>
            <Link href={`/${locale}`} className="btn nf__home">
              {dict.notFound.home}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
