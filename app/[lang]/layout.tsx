import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Cursor } from "@/components/Cursor";
import { PageWipe } from "@/components/PageWipe";
import { DEFAULT_LOCALE, LOCALES, dirOf, getDictionary, isLocale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

/**
 * Cairo is variable on Google Fonts, so a single file per subset covers Light
 * through ExtraBold. `display: swap` plus the auto-generated fallback metrics
 * keep text visible immediately without a layout shift when the font lands.
 */
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
  preload: true,
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05070c",
  colorScheme: "dark",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.title,
      template: `%s | ${dict.meta.siteName}`,
    },
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    applicationName: dict.meta.siteName,
    authors: [{ name: "OmegaTron" }],
    creator: "OmegaTron",
    publisher: "OmegaTron",
    manifest: "/site.webmanifest",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: "/ar",
        en: "/en",
        "x-default": "/ar",
      },
    },
    openGraph: {
      type: "website",
      siteName: dict.meta.siteName,
      title: dict.meta.title,
      description: dict.meta.description,
      url: `/${locale}`,
      locale: locale === "ar" ? "ar_IQ" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_IQ",
      images: [
        {
          // One card per language: a share of the Arabic site should not
          // unfurl in English. Metadata images are served raw — no optimiser
          // sits in front of them — so these are drawn as flat colour and type
          // rather than exported from a photograph.
          url: `/images/og-${locale}.png`,
          width: 1200,
          height: 630,
          alt: dict.meta.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [`/images/og-${locale}.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    formatDetection: { telephone: false, address: false, email: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const dir = dirOf(lang);

  return (
    <html lang={lang} dir={dir} className={cairo.variable}>
      <body>
        {/* The ground the whole page sits on: the same near-black, with a
            graticule over it and two slow lights moving behind. It is fixed
            and negatively stacked, so it costs one composited layer for the
            life of the page and every section shows it through. */}
        <div className="ambient" aria-hidden="true">
          <span className="ambient__glow ambient__glow--gold" />
          <span className="ambient__glow ambient__glow--steel" />
        </div>

        <SmoothScroll />
        <ScrollProgress />
        <Cursor />
        <PageWipe />
        <a href="#main" className="skip-link">
          {dict.nav.skipToContent}
        </a>
        <Header locale={lang} dict={dict} />
        <main id="main">{children}</main>
        <Footer locale={lang} dict={dict} />
      </body>
    </html>
  );
}
