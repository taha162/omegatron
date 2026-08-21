import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Reveal } from "@/components/Reveal";
import { ArrowIcon } from "@/components/Icons";
import { ProjectForm } from "@/components/ProjectForm";
import { FilmBackdrop } from "@/components/FilmBackdrop";
import { ScrollHolds } from "@/components/ScrollHolds";
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

      {/* The film runs behind everything from here down to the founder. */}
      <div className="film-range" id="film-range">
        <FilmBackdrop rangeId="film-range" />
        <ScrollHolds />

      {/* ---------------------------------------------------------------- Hero */}
      <section className="hero hold">
        <div className="hero__pin">
          <div className="container hero__inner">
            <p className="hero__wordmark" lang="en">
              {dict.hero.wordmark}
            </p>
            <h1 className="hero__statement">{dict.hero.statement}</h1>
            <p className="hero__lead">{dict.hero.lead}</p>
            <div className="hero__actions">
              <a href="#projects" className="btn">
                {dict.hero.primaryCta}
                <ArrowIcon className="btn__arrow" />
              </a>
              <Link href={`/${lang}/start`} className="btn btn--ghost">
                {dict.hero.secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- About */}
      <section className="section hold" id="about" aria-labelledby="about-title">
        <div className="container">
          <Reveal className="about">
            <div>
              <p className="sec-label mono">{dict.about.label}</p>
              <h2 className="sec-title" id="about-title">
                {dict.about.heading}
              </h2>
            </div>
            <p className="about__body glass">{dict.about.body}</p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ Projects */}
      <section
        className="section section--tint hold"
        id="projects"
        aria-labelledby="projects-title"
      >
        <div className="container">
          <Reveal className="sec-head">
            <p className="sec-label mono">{dict.projects.label}</p>
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
                    sizes="(max-width: 1200px) 94vw, 1180px"
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
                      sizes="(max-width: 620px) 46vw, 47vw"
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
                      sizes="(max-width: 620px) 46vw, 47vw"
                    />
                  </div>
                </figure>
              </div>
            </Reveal>

            <div className="project__body">
              <Reveal>
                <p className="project__meta mono">
                  <span>{project.status}</span>
                  <span className="project__award">{project.award}</span>
                </p>
                <h3 className="project__name" id={`project-${project.id}`}>
                  {project.name}
                </h3>
                <p className="project__summary">{project.summary}</p>
                <ul className="project__domains">
                  {project.domains.map((domain) => (
                    <li className="chip glass--lite" key={domain}>
                      {domain}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={80}>
                <ul className="project__points glass--lite">
                  {project.points.map((point) => (
                    <li className="project__point" key={point}>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </article>
        </div>
      </section>

      {/* -------------------------------------------------------- Capabilities */}
      <section className="section hold" id="capabilities" aria-labelledby="capabilities-title">
        <div className="container">
          <Reveal className="sec-head">
            <p className="sec-label mono">{dict.capabilities.label}</p>
            <h2 className="sec-title" id="capabilities-title">
              {dict.capabilities.heading}
            </h2>
          </Reveal>

          <Reveal as="ul" className="caps">
            {dict.capabilities.items.map((item) => (
              <li className="cap glass--lite" key={item.title}>
                <h3 className="cap__title">{item.title}</h3>
                <p className="cap__body">{item.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- Process */}
      <section className="section section--tight hold" id="process" aria-labelledby="process-title">
        <div className="container">
          <Reveal className="sec-head sec-head--tight">
            <p className="sec-label mono">{dict.process.label}</p>
            <h2 className="sec-title" id="process-title">
              {dict.process.heading}
            </h2>
          </Reveal>

          <Reveal as="ol" className="flow">
            {dict.process.steps.map((step, i) => (
              <li className="flow__step" key={step}>
                <span className="flow__index mono" lang="en">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flow__label">{step}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- Founder */}
      <section className="section section--tint hold" id="founder" aria-labelledby="founder-title">
        <div className="container founder">
          <Reveal className="founder__media">
            {/* An offset rule behind the portrait — editorial, not decorative. */}
            <span className="founder__frame" aria-hidden="true" />
            <div className="media founder__portrait">
              <Image
                src="/images/founder.jpg"
                alt={dict.founder.imageAlt}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 88vw, 42vw"
              />
              <span className="founder__grain" aria-hidden="true" />
              <span className="founder__scrim" aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal delay={80} className="founder__copy glass">
            <p className="sec-label mono">{dict.founder.label}</p>
            <h2 className="founder__name" id="founder-title">
              {dict.founder.name}
            </h2>
            <p className="founder__role">{dict.founder.role}</p>
            <p className="founder__body">{dict.founder.body}</p>
          </Reveal>
        </div>
      </section>

      </div>

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
