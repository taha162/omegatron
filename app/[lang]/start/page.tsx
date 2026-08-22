import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackLink } from "@/components/BackLink";
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
      <section className="start-hero" aria-labelledby="start-title">
        <div className="container">
          <BackLink href={`/${lang}#contact`} label={dict.nav.back} />
          <p className="sec-label mono">{dict.start.label}</p>
          <h1 className="start-hero__title" id="start-title">
            {dict.start.heading}
          </h1>
          <p className="lead">{dict.start.lead}</p>
        </div>
      </section>

      <div className="container start-grid">
        <ProjectForm locale={lang} dict={dict} />

        <aside className="start-aside" aria-label={dict.start.aside.title}>
          <h2 className="start-aside__title">{dict.start.aside.title}</h2>
          <ul className="start-aside__list">
            {dict.start.aside.items.map((item) => (
              <li className="start-aside__item" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
