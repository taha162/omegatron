import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Reveal } from "@/components/Reveal";
import { ArrowIcon } from "@/components/Icons";
import { Logo, Wordmark } from "@/components/Logo";
import { ProjectForm } from "@/components/ProjectForm";
import { FilmBackdrop } from "@/components/FilmBackdrop";
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

      {/* ---------------------------------------------------------------- Hero
          The film runs here and nowhere else: the statement stands on the
          board, and the scale along the bottom edge marks how far the board
          has advanced. */}
      <section className="hero" id="hero" aria-label={dict.meta.siteName}>
        <FilmBackdrop rangeId="hero" />

        <div className="container hero__inner">
          <p className="hero__wordmark" lang="en" dir="ltr">
            {dict.hero.wordmark}
          </p>
          <h1 className="hero__statement">{dict.hero.statement}</h1>
          <p className="hero__lead">{dict.hero.lead}</p>
          <div className="hero__actions">
            <Link href={`/${lang}/start`} className="btn">
              {dict.hero.secondaryCta}
              <ArrowIcon className="btn__arrow" />
            </Link>
            <a href="#projects" className="btn btn--ghost">
              {dict.hero.primaryCta}
            </a>
          </div>
        </div>

        <div className="hero__scale" aria-hidden="true">
          <span className="hero__scale-mark" />
        </div>
      </section>

      {/* --------------------------------------------------------------- About */}
      <section className="section" id="about" aria-labelledby="about-title">
        <div className="container sec">
          <Reveal className="sec__rail">
            <p className="sec-label mono">{dict.about.label}</p>
          </Reveal>

          <Reveal className="sec__body" delay={60}>
            <h2 className="about__statement" id="about-title">
              {dict.about.heading}
            </h2>
            <p className="about__body">{dict.about.body}</p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ Projects
          One project, read as a sheet: the plates first, then what it does,
          then the parameters that describe it. */}
      <section className="section section--tint" id="projects" aria-labelledby="projects-title">
        <div className="container sec">
          <Reveal className="sec__rail">
            <p className="sec-label mono">{dict.projects.label}</p>
          </Reveal>

          <div className="sec__body">
            <Reveal className="sec-head">
              <h2 className="sec-title" id="projects-title">
                {dict.projects.heading}
              </h2>
              <p className="projects__note">{dict.projects.oneOf}</p>
            </Reveal>

            <article aria-labelledby={`project-${project.id}`}>
              <Reveal>
                <figure className="project__hero">
                  <div className="media media--16x10">
                    <Image
                      src="/images/project-enclosure.jpg"
                      alt={dict.projects.images.chamberAlt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 860px) 92vw, 62vw"
                    />
                  </div>
                </figure>

                <div className="project__gallery">
                  <figure>
                    <div className="media media--3x2">
                      <Image
                        src="/images/project-chamber.jpg"
                        alt={dict.projects.images.enclosureAlt}
                        fill
                        loading="lazy"
                        sizes="(max-width: 860px) 45vw, 31vw"
                      />
                    </div>
                  </figure>
                  <figure>
                    <div className="media media--3x2">
                      <Image
                        src="/images/project-array.jpg"
                        alt={dict.projects.images.unitAlt}
                        fill
                        loading="lazy"
                        sizes="(max-width: 860px) 45vw, 31vw"
                      />
                    </div>
                  </figure>
                </div>
              </Reveal>

              <div className="project__body">
                <Reveal>
                  <h3 className="project__name" id={`project-${project.id}`}>
                    {project.name}
                  </h3>
                  <p className="project__summary">{project.summary}</p>
                  <ul className="project__points">
                    {project.points.map((point) => (
                      <li className="project__point" key={point}>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>

                {/* The parameter block — the same facts, set the way this team
                    would write them down. */}
                <Reveal as="dl" className="spec" delay={60}>
                  <div className="spec__row">
                    <dt className="spec__key mono">{dict.projects.spec.status}</dt>
                    <dd className="spec__val">{project.status}</dd>
                  </div>
                  <div className="spec__row">
                    <dt className="spec__key mono">{dict.projects.spec.award}</dt>
                    <dd className="spec__val spec__val--award">{project.award}</dd>
                  </div>
                  <div className="spec__row">
                    <dt className="spec__key mono">{dict.projects.spec.domains}</dt>
                    <dd>
                      <ul className="spec__list">
                        {project.domains.map((domain) => (
                          <li key={domain}>{domain}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </Reveal>
              </div>
            </article>
          </div>
        </div>
      </section>

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

            <Reveal as="ul" className="caps" delay={60}>
              {dict.capabilities.items.map((item) => (
                <li className="cap" key={item.title}>
                  <h3 className="cap__title">{item.title}</h3>
                  <p className="cap__body">{item.body}</p>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Process */}
      <section className="section section--tight" id="process" aria-labelledby="process-title">
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

            <Reveal as="ol" className="flow" delay={60}>
              {dict.process.steps.map((step, i) => (
                <li className="flow__step" key={step}>
                  <span className="flow__index mono" lang="en" dir="ltr">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flow__label">{step}</span>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- Founder
          The person is the headline: a plate, the name at display scale, the
          sentence that says what he does, and a title block signing it. */}
      <section className="section section--tint" id="founder" aria-labelledby="founder-title">
        <div className="container founder">
          <Reveal className="founder__media">
            <div className="media founder__portrait">
              <Image
                src="/images/founder.jpg"
                alt={dict.founder.imageAlt}
                fill
                loading="lazy"
                sizes="(max-width: 860px) 92vw, 38vw"
              />
            </div>
          </Reveal>

          <Reveal className="founder__copy" delay={60}>
            <p className="founder__label sec-label mono">{dict.founder.label}</p>
            <h2 className="founder__name" id="founder-title">
              {dict.founder.name}
            </h2>
            <p className="founder__role mono">{dict.founder.role}</p>
            <p className="founder__lead">{dict.founder.lead}</p>
            <p className="founder__body">{dict.founder.body}</p>

            <div className="founder__sign">
              <Logo className="founder__sign-mark" />
              <span className="founder__sign-text">
                <Wordmark className="wordmark" />
              </span>
              <Link href={`/${lang}/start`} className="btn btn--ghost founder__cta">
                {dict.nav.start}
              </Link>
            </div>
          </Reveal>
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
