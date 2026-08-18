import Link from "next/link";
import { DEFAULT_LOCALE, getDictionary } from "@/lib/i18n";

export default function NotFound() {
  // A not-found boundary cannot read route params, so it falls back to the
  // default language of the site.
  const dict = getDictionary(DEFAULT_LOCALE);

  return (
    <div className="container nf">
      <p className="nf__code" dir="ltr">
        404
      </p>
      <h1 className="nf__title">{dict.notFound.title}</h1>
      <p className="lead">{dict.notFound.body}</p>
      <p>
        <Link href={`/${DEFAULT_LOCALE}`} className="btn" style={{ marginBlockStart: "1rem" }}>
          {dict.notFound.home}
        </Link>
      </p>
    </div>
  );
}
