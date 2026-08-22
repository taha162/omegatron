import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FounderStory } from "@/components/FounderStory";
import { DEFAULT_LOCALE, getDictionary, isLocale } from "@/lib/i18n";
import { FOUNDER_NAME_AR, FOUNDER_NAME_EN, SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return {
    title: dict.founder.name,
    description: `${dict.founder.role} — ${dict.founder.lead}`,
    alternates: {
      canonical: `/${locale}/founder`,
      languages: { ar: "/ar/founder", en: "/en/founder", "x-default": "/ar/founder" },
    },
    openGraph: {
      title: `${dict.founder.name} | ${dict.meta.siteName}`,
      description: dict.founder.lead,
      url: `/${locale}/founder`,
    },
  };
}

export default async function FounderPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: lang === "ar" ? FOUNDER_NAME_AR : FOUNDER_NAME_EN,
      jobTitle: dict.founder.role,
      description: `${dict.founder.lead} ${dict.founder.body}`,
      image: `${SITE_URL}/images/founder.jpg`,
      worksFor: { "@id": `${SITE_URL}/#organization` },
      url: `${SITE_URL}/${lang}/founder`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Content is fully static and authored in this repository.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FounderStory locale={lang} dict={dict} />
    </>
  );
}
