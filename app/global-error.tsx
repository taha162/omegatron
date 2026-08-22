"use client";

import "./globals.css";

/**
 * The last resort.
 *
 * `global-error` replaces the root layout itself, so it renders its own
 * document — which also means none of the layout's work has run: no font is
 * loaded, no header, no dictionary. Until this file existed an uncaught error
 * in production showed Next's own error screen: unbranded, English-only, and
 * offering nothing but a stack trace the visitor cannot act on.
 *
 * The copy is written here rather than read from `lib/i18n`, deliberately. This
 * boundary catches failures in module initialisation too, and a screen that
 * imports the module that just threw is a screen that throws again. It is
 * bilingual for the same reason the 404 is: nothing here knows which language
 * the visitor was reading.
 *
 * `reset()` re-renders the tree that failed, which is worth one press for a
 * transient fault; the link out is there for when it is not.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="container nf">
          <p className="nf__code" lang="en" dir="ltr">
            500
          </p>

          <div className="nf__pair">
            <div className="nf__side" lang="ar" dir="rtl">
              <h1 className="nf__title">حدث خطأ غير متوقّع</h1>
              <p className="nf__body">
                تعذّر عرض هذه الصفحة. حاول مرة أخرى، أو عد إلى الصفحة الرئيسية.
              </p>
              <div className="nf__actions">
                <button type="button" className="btn" onClick={reset}>
                  إعادة المحاولة
                </button>
                <a href="/ar" className="btn btn--ghost">
                  الصفحة الرئيسية
                </a>
              </div>
            </div>

            <div className="nf__side" lang="en" dir="ltr">
              <h1 className="nf__title">Something went wrong</h1>
              <p className="nf__body">
                This page could not be displayed. Try again, or go back to the home page.
              </p>
              <div className="nf__actions">
                <button type="button" className="btn" onClick={reset}>
                  Try again
                </button>
                <a href="/en" className="btn btn--ghost">
                  Home
                </a>
              </div>
            </div>
          </div>

          {/* The digest is the only handle support has on a production fault;
              the message itself is stripped from the client bundle. */}
          {error.digest ? (
            <p className="nf__digest mono" lang="en" dir="ltr">
              {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
