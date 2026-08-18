import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectForm } from "@/components/ProjectForm";
import { DEFAULT_LOCALE, getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return {
    title: dict.start.label,
    description: dict.start.lead,
    alternates: {
      canonical: `/${locale}/start`,
      languages: { ar: "/ar/start", en: "/en/start", "x-default": "/ar/start" },
    },
    openGraph: {
      title: `${dict.start.label} | ${dict.meta.siteName}`,
      description: dict.start.lead,
      url: `/${locale}/start`,
    },
  };
}

export default async function StartPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <section className="start-hero">
        <div className="container">
          <p className="sec-head__meta mono" style={{ maxWidth: "22rem" }}>
            <span className="sec-head__index">{dict.start.index}</span>
            <span>{dict.start.label}</span>
          </p>
          <h1 className="start-hero__title">{dict.start.heading}</h1>
          <p className="lead">{dict.start.lead}</p>
        </div>
      </section>

      <section aria-label={dict.start.label}>
        <div className="container">
          <ol className="steps">
            {dict.start.steps.map((step) => (
              <li className="step" key={step.index}>
                <span className="step__index mono">
                  {step.index}
                </span>
                <h2 className="step__title">{step.title}</h2>
                <p className="step__body">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--flush">
        <div className="container start-grid">
          <div className="start-grid__form">
            <ProjectForm locale={lang} dict={dict} />
          </div>

          <aside className="start-aside" aria-label={dict.start.aside.title}>
            <h2 className="start-aside__title">{dict.start.aside.title}</h2>
            <ul className="start-aside__list">
              {dict.start.aside.items.map((item) => (
                <li className="start-aside__item" key={item}>
                  <span className="start-aside__bullet" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="start-aside__note">
              <h3 className="start-aside__note-title mono">{dict.start.aside.noteTitle}</h3>
              <p className="start-aside__note-body">{dict.start.aside.noteBody}</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
