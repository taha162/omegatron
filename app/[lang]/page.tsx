import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Reveal } from "@/components/Reveal";
import { ArrowIcon, ArmIcon, ChipIcon, GaugeIcon, LoopIcon, NetworkIcon, SolidIcon } from "@/components/Icons";
import { HeroScene } from "@/components/HeroScene";
import { Award } from "@/components/Award";
import { ProjectRail } from "@/components/ProjectRail";
import { Methodology } from "@/components/Methodology";
import { FillText } from "@/components/FillText";
import { Marquee } from "@/components/Marquee";
import { ProjectForm } from "@/components/ProjectForm";
import { Social } from "@/components/Social";
import { DEFAULT_LOCALE, getDictionary, isLocale } from "@/lib/i18n";
import { FOUNDER_NAME_AR, FOUNDER_NAME_EN, ORG_NAME_AR, ORG_NAME_EN, SITE_URL } from "@/lib/site";

/** One mark per capability, in the dictionary's own order. */
const CAPABILITY_ICONS = [ChipIcon, ArmIcon, NetworkIcon, GaugeIcon, LoopIcon, SolidIcon];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: { canonical: `/${locale}` },
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const project = dict.projects.items[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: lang === "ar" ? ORG_NAME_AR : ORG_NAME_EN,
        alternateName: lang === "ar" ? ORG_NAME_EN : ORG_NAME_AR,
        url: `${SITE_URL}/${lang}`,
        description: dict.meta.description,
        foundingLocation: { "@type": "Place", name: "Iraq" },
        founder: {
          "@type": "Person",
          name: lang === "ar" ? FOUNDER_NAME_AR : FOUNDER_NAME_EN,
          jobTitle: dict.founder.role,
          url: `${SITE_URL}/${lang}/founder`,
        },
        knowsAbout: dict.capabilities.items.map((item) => item.title),
        award: project.award,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/${lang}`,
        name: dict.meta.siteName,
        inLanguage: lang,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Content is fully static and authored in this repository.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* The scene: pinned, scrubbed, and handing off to the award below. */}
      <HeroScene locale={lang} dict={dict} />

      {/* The achievement, immediately after the hero. */}
      <Award dict={dict} />

      {/* --------------------------------------------------------------- About */}
      <section className="section section--tint" id="about" aria-labelledby="about-title">
        <div className="container sec">
          <Reveal className="sec__rail">
            <p className="sec-label mono">{dict.about.label}</p>
          </Reveal>

          <Reveal className="sec__body" delay={60}>
            <FillText
              as="h2"
              className="about__statement"
              id="about-title"
              text={dict.about.heading}
            />
            <p className="about__body">{dict.about.body}</p>
          </Reveal>
        </div>
      </section>

      {/* The project, as a filmstrip pulled sideways by vertical scroll. */}
      <ProjectRail dict={dict} />

      {/* The band: what the team works across, geared to the page's own scroll. */}
      <Marquee
        items={dict.capabilities.items.map((item) => item.title)}
        label={dict.capabilities.heading}
      />

      {/* -------------------------------------------------------- Capabilities */}
      <section className="section" id="capabilities" aria-labelledby="capabilities-title">
        <div className="container sec">
          <Reveal className="sec__rail">
            <p className="sec-label mono">{dict.capabilities.label}</p>
          </Reveal>

          <div className="sec__body">
            <Reveal className="sec-head sec-head--tight">
              <h2 className="sec-title" id="capabilities-title">
                {dict.capabilities.heading}
              </h2>
            </Reveal>

            <Reveal as="ul" className="bento" delay={60}>
              {dict.capabilities.items.map((item, i) => {
                const Icon = CAPABILITY_ICONS[i] ?? ChipIcon;
                return (
                  <li className="bento__cell" key={item.title}>
                    <Icon className="bento__icon" />
                    <h3 className="bento__title">{item.title}</h3>
                    <p className="bento__body">{item.body}</p>
                  </li>
                );
              })}
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Methodology */}
      <section
        className="section section--tint"
        id="process"
        aria-labelledby="process-title"
      >
        <div className="container sec">
          <Reveal className="sec__rail">
            <p className="sec-label mono">{dict.process.label}</p>
          </Reveal>

          <div className="sec__body">
            <Reveal className="sec-head sec-head--tight">
              <h2 className="sec-title" id="process-title">
                {dict.process.heading}
              </h2>
            </Reveal>
            <Methodology dict={dict} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Founder
          A short introduction here; the story itself has its own route. */}
      <section className="section" id="founder" aria-labelledby="founder-title">
        <div className="container sec">
          <Reveal className="sec__rail">
            <p className="sec-label mono">{dict.founder.label}</p>
          </Reveal>

          <div className="sec__body">
            <div className="founder-grid">
              <Reveal>
                <div className="founder-portrait">
                  <Image
                    src="/images/founder.jpg"
                    alt={dict.founder.imageAlt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 92vw, 30vw"
                  />
                </div>
              </Reveal>

              <Reveal delay={60}>
                <h2 className="sec-title" id="founder-title">
                  {dict.founder.name}
                </h2>
                <p className="founder-role mono">{dict.founder.role}</p>
                <p className="about__body">{dict.founder.lead}</p>
                <div className="founder-actions">
                  <Link href={`/${lang}/founder`} className="btn btn--ghost">
                    {dict.founder.readMore}
                    <ArrowIcon className="btn__arrow" />
                  </Link>

                  <Social label={dict.founder.social} />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Contact */}
      <section className="section section--solid" id="contact" aria-labelledby="contact-title">
        <div className="container contact">
          <div>
            <p className="sec-label mono">{dict.contact.label}</p>
            <h2 className="contact__heading" id="contact-title">
              {dict.contact.heading}
            </h2>
            <p className="lead">{dict.contact.lead}</p>
            <p className="contact__full">
              {dict.contact.fullFormPrompt}{" "}
              <Link href={`/${lang}/start`} className="contact__full-link">
                {dict.contact.fullFormLink}
              </Link>
            </p>
          </div>

          <ProjectForm locale={lang} dict={dict} variant="compact" idPrefix="contact" />
        </div>
      </section>
    </>
  );
}
