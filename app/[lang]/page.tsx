import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ArrowIcon, CAPABILITY_ICONS } from "@/components/Icons";
import { DEFAULT_LOCALE, getDictionary, isLocale } from "@/lib/i18n";
import { FOUNDER_NAME_AR, FOUNDER_NAME_EN, ORG_NAME_AR, ORG_NAME_EN, SITE_URL } from "@/lib/site";

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
        },
        knowsAbout: [
          "Mechatronics",
          "Robotics",
          "Artificial Intelligence",
          "Embedded Systems",
          "Automation",
          "Rapid Prototyping",
        ],
        award: `${dict.achievement.place} — ${dict.achievement.event}`,
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

      {/* ---------------------------------------------------------------- Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero__inner">
            <div>
              <p className="hero__eyebrow mono" lang={lang}>
                {dict.hero.eyebrow}
              </p>
              <h1 className="hero__title" lang="en">
                {dict.hero.wordmark}
              </h1>
              <p className="hero__statement">{dict.hero.statement}</p>
              <p className="hero__lead">{dict.hero.lead}</p>
              <div className="hero__actions">
                <Link href={`/${lang}/start`} className="btn">
                  {dict.hero.primaryCta}
                  <ArrowIcon className="btn__arrow" />
                </Link>
                <a href="#project" className="btn btn--ghost">
                  {dict.hero.secondaryCta}
                </a>
              </div>
            </div>

            <div className="hero__media">
              <figure className="hero__figure">
                <div className="media media--4x5">
                  <Image
                    src="/images/project-unit.jpg"
                    alt={dict.hero.imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 92vw, 44vw"
                  />
                </div>
                <figcaption className="hero__caption mono" lang="en">
                  OmegaTron · Sensing Unit
                </figcaption>
              </figure>
            </div>
          </div>

          <ul className="hero__facts">
            {dict.hero.facts.map((fact) => (
              <li className="fact" key={fact.value}>
                <p className="fact__value">{fact.value}</p>
                <p className="fact__label">{fact.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------------------------------------- Achievement */}
      <section className="section section--ink" aria-labelledby="achievement-title">
        <div className="container">
          <div className="achv">
            <Reveal>
              <p className="achv__badge mono">
                <span className="achv__badge-dot" aria-hidden="true" />
                {dict.achievement.label}
              </p>
              <h2 className="achv__place" id="achievement-title">
                {dict.achievement.place}
              </h2>
              <p className="achv__event">
                <span className="achv__event-name" dir="ltr" lang="en">
                  {dict.achievement.event}
                </span>
                <span className="achv__event-scope">{dict.achievement.scope}</span>
              </p>
              <p className="achv__body">{dict.achievement.body}</p>
            </Reveal>

            <Reveal delay={80}>
              <figure className="achv__figure">
                <div className="media media--4x3">
                  <Image
                    src="/images/team-nurai.jpg"
                    alt={dict.achievement.imageAlt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 92vw, 44vw"
                  />
                </div>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- About */}
      <section className="section" id="about" aria-labelledby="about-title">
        <div className="container">
          <SectionHeading
            index={dict.about.index}
            label={dict.about.label}
            title={dict.about.heading}
            id="about-title"
          />

          <div className="about__grid">
            <Reveal className="prose">
              {dict.about.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <ul className="disciplines">
                {dict.capabilities.items.map((item) => (
                  <li className="chip" key={item.title}>
                    {item.title}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={80}>
              <ul className="principles">
                {dict.about.principles.map((principle) => (
                  <li className="principle" key={principle.title}>
                    <span className="principle__dot" aria-hidden="true" />
                    <div>
                      <h3 className="principle__title">{principle.title}</h3>
                      <p className="principle__body">{principle.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Project */}
      <section
        className="section section--surface"
        id="project"
        aria-labelledby="project-title"
      >
        <div className="container">
          <SectionHeading
            index={dict.project.index}
            label={dict.project.label}
            title={dict.project.heading}
            id="project-title"
          />

          <div className="project__top">
            <Reveal>
              <p className="lead">{dict.project.lead}</p>
            </Reveal>
            <Reveal delay={80}>
              <figure className="figure">
                <div className="media media--3x2">
                  <Image
                    src="/images/project-enclosure.jpg"
                    alt={dict.project.images.enclosureAlt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 92vw, 44vw"
                  />
                </div>
                <figcaption className="figure__cap">
                  {dict.project.images.enclosureAlt}
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <Reveal>
            <ol className="stages">
              {dict.project.stages.map((stage) => (
                <li className="stage" key={stage.index}>
                  <span className="stage__index mono">
                    {stage.index}
                  </span>
                  <h3 className="stage__title">{stage.title}</h3>
                  <p className="stage__body">{stage.body}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <div className="project__gallery">
            <Reveal>
              <figure className="figure">
                <div className="media media--3x2">
                  <Image
                    src="/images/project-chamber.jpg"
                    alt={dict.project.images.chamberAlt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 860px) 92vw, 46vw"
                  />
                </div>
                <figcaption className="figure__cap">{dict.project.images.chamberAlt}</figcaption>
              </figure>
            </Reveal>
            <Reveal delay={80}>
              <figure className="figure">
                <div className="media media--3x2">
                  <Image
                    src="/images/project-array.jpg"
                    alt={dict.project.images.unitAlt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 860px) 92vw, 46vw"
                  />
                </div>
                <figcaption className="figure__cap">{dict.project.images.unitAlt}</figcaption>
              </figure>
            </Reveal>
          </div>

          <div className="project__notes">
            <Reveal as="article" className="note">
              <h3 className="note__title">{dict.project.enclosureTitle}</h3>
              <p className="note__body">{dict.project.enclosureBody}</p>
            </Reveal>
            <Reveal as="article" className="note note--flag" delay={80}>
              <h3 className="note__title">{dict.project.confidentialTitle}</h3>
              <p className="note__body">{dict.project.confidentialBody}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Capabilities */}
      <section className="section" id="capabilities" aria-labelledby="capabilities-title">
        <div className="container">
          <SectionHeading
            index={dict.capabilities.index}
            label={dict.capabilities.label}
            title={dict.capabilities.heading}
            lead={dict.capabilities.lead}
            id="capabilities-title"
          />

          <ul className="caps">
            {dict.capabilities.items.map((item, i) => {
              const Icon = CAPABILITY_ICONS[i] ?? CAPABILITY_ICONS[0];
              return (
                <li className="cap" key={item.title}>
                  <Icon className="cap__icon" />
                  <h3 className="cap__title">{item.title}</h3>
                  <p className="cap__body">{item.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------- Founder */}
      <section
        className="section section--surface"
        id="founder"
        aria-labelledby="founder-title"
      >
        <div className="container">
          <SectionHeading
            index={dict.founder.index}
            label={dict.founder.label}
            title={dict.founder.name}
            id="founder-title"
          />

          <div className="founder">
            <Reveal>
              <figure className="founder__figure">
                <div className="media media--3x4">
                  <Image
                    src="/images/founder.jpg"
                    alt={dict.founder.imageAlt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 22rem, 32vw"
                  />
                </div>
              </figure>
            </Reveal>

            <Reveal delay={80}>
              <p className="founder__role">{dict.founder.role}</p>
              <blockquote className="founder__quote">{dict.founder.quote}</blockquote>
              <div className="prose">
                {dict.founder.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- CTA band */}
      <section className="section section--ink" aria-labelledby="cta-title">
        <div className="container">
          <div className="cta-band">
            <div>
              <h2 className="cta-band__heading" id="cta-title">
                {dict.cta.heading}
              </h2>
              <p className="cta-band__body">{dict.cta.body}</p>
            </div>
            <Link href={`/${lang}/start`} className="btn btn--inverse">
              {dict.cta.button}
              <ArrowIcon className="btn__arrow" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
