import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ArrowIcon, CAPABILITY_ICONS } from "@/components/Icons";
import { ProjectForm } from "@/components/ProjectForm";
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
  const caseStudy = dict.projects.items[0];

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
        areaServed: { "@type": "Country", name: "Iraq" },
        founder: {
          "@type": "Person",
          "@id": `${SITE_URL}/#founder`,
          name: lang === "ar" ? FOUNDER_NAME_AR : FOUNDER_NAME_EN,
          jobTitle: dict.founder.role,
          knowsAbout: dict.founder.expertise,
        },
        knowsAbout: dict.capabilities.items.map((item) => item.title),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: dict.capabilities.heading,
          itemListElement: dict.capabilities.items.map((item) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: item.title, description: item.body },
          })),
        },
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
      {
        "@type": "CreativeWork",
        "@id": `${SITE_URL}/#${caseStudy.id}`,
        name: caseStudy.name,
        abstract: caseStudy.summary,
        inLanguage: lang,
        creator: { "@id": `${SITE_URL}/#organization` },
        about: caseStudy.domains,
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
            <div className="hero__copy">
              <p className="hero__eyebrow mono" lang={lang}>
                {dict.hero.eyebrow}
              </p>
              <h1 className="hero__title">
                <span className="hero__wordmark" lang="en">
                  {dict.hero.wordmark}
                </span>
                <span className="hero__statement">{dict.hero.statement}</span>
              </h1>
              <p className="hero__lead">{dict.hero.lead}</p>
              <p className="hero__diff">
                <span className="hero__diff-rule" aria-hidden="true" />
                {dict.hero.differentiator}
              </p>
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

            <div className="hero__media">
              <figure className="hero__figure">
                <div className="media media--4x5">
                  <Image
                    src="/images/project-unit.jpg"
                    alt={dict.hero.imageAlt}
                    fill
                    priority
                    fetchPriority="high"
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

      {/* ------------------------------------------------------------ Projects */}
      <section
        className="section section--surface"
        id="projects"
        aria-labelledby="projects-title"
      >
        <div className="container">
          <SectionHeading
            index={dict.projects.index}
            label={dict.projects.label}
            title={dict.projects.heading}
            lead={dict.projects.lead}
            id="projects-title"
          />

          {dict.projects.items.map((project) => (
            <article className="case" key={project.id} aria-labelledby={`case-${project.id}`}>
              <Reveal className="case__head">
                <p className="case__meta">
                  <span className="case__status mono">{project.status}</span>
                  <span className="case__badge mono">{project.badge}</span>
                </p>
                <h3 className="case__name" id={`case-${project.id}`}>
                  {project.name}
                </h3>
                <p className="case__summary">{project.summary}</p>
                <ul className="case__domains">
                  {project.domains.map((domain) => (
                    <li className="chip" key={domain}>
                      {domain}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className="case__gallery" delay={60}>
                {(
                  [
                    ["/images/project-enclosure.jpg", dict.projects.images.enclosureAlt],
                    ["/images/project-chamber.jpg", dict.projects.images.chamberAlt],
                    ["/images/project-array.jpg", dict.projects.images.unitAlt],
                  ] as const
                ).map(([src, alt]) => (
                  <figure className="figure" key={src}>
                    <div className="media media--4x5">
                      <Image
                        src={src}
                        alt={alt}
                        fill
                        loading="lazy"
                        sizes="(max-width: 380px) 92vw, (max-width: 860px) 46vw, 30vw"
                      />
                    </div>
                  </figure>
                ))}
              </Reveal>

              <Reveal as="ol" className="case__blocks" delay={80}>
                {(
                  [
                    ["problem", dict.projects.blockLabels.problem, project.problem],
                    ["approach", dict.projects.blockLabels.approach, project.approach],
                    ["engineering", dict.projects.blockLabels.engineering, project.engineering],
                    ["outcome", dict.projects.blockLabels.outcome, project.outcome],
                  ] as const
                ).map(([key, label, body], i) => (
                  <li className="case-block" key={key}>
                    <p className="case-block__label">
                      <span className="case-block__index mono" lang="en">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="case-block__name">{label}</span>
                    </p>
                    <p className="case-block__body">{body}</p>
                  </li>
                ))}
              </Reveal>
            </article>
          ))}

          <Reveal as="aside" className="note note--flag">
            <h3 className="note__title">{dict.projects.confidentialTitle}</h3>
            <p className="note__body">{dict.projects.confidentialBody}</p>
          </Reveal>
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

      {/* ------------------------------------------------------------- Process */}
      <section
        className="section section--surface"
        id="process"
        aria-labelledby="process-title"
      >
        <div className="container">
          <SectionHeading
            index={dict.process.index}
            label={dict.process.label}
            title={dict.process.heading}
            lead={dict.process.lead}
            id="process-title"
          />

          <ol className="flow">
            {dict.process.steps.map((step, i) => (
              <li className="flow__step" key={step.index}>
                {/* Outside the reveal so the node stays pinned to the rule
                    while the text beneath it settles. */}
                <span className="flow__marker" aria-hidden="true" />
                <Reveal delay={i * 60}>
                  <span className="flow__index mono" lang="en">
                    {step.index}
                  </span>
                  <h3 className="flow__title">{step.title}</h3>
                  <p className="flow__body">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------------- Founder */}
      <section className="section" id="founder" aria-labelledby="founder-title">
        <div className="container">
          <SectionHeading
            index={dict.founder.index}
            label={dict.founder.label}
            title={dict.founder.name}
            id="founder-title"
          />

          <div className="founder">
            <Reveal className="founder__aside">
              <figure className="founder__figure">
                <div className="media media--4x5">
                  <Image
                    src="/images/founder.jpg"
                    alt={dict.founder.imageAlt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 20rem, 24vw"
                  />
                </div>
              </figure>
              <p className="founder__role">{dict.founder.role}</p>

              <h3 className="founder__expertise-title mono">{dict.founder.expertiseTitle}</h3>
              <ul className="founder__expertise">
                {dict.founder.expertise.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={80}>
              <blockquote className="founder__quote">{dict.founder.quote}</blockquote>
              <p className="founder__intro">{dict.founder.intro}</p>

              <dl className="founder__blocks">
                {dict.founder.blocks.map((block) => (
                  <div className="founder__block" key={block.title}>
                    <dt className="founder__block-title">{block.title}</dt>
                    <dd className="founder__block-body">{block.body}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Contact */}
      <section
        className="section section--surface"
        id="contact"
        aria-labelledby="contact-title"
      >
        <div className="container">
          <div className="contact">
            <div className="contact__intro">
              <p className="sec-head__meta mono">
                <span className="sec-head__index">{dict.contact.index}</span>
                <span>{dict.contact.label}</span>
              </p>
              <h2 className="contact__heading" id="contact-title">
                {dict.contact.heading}
              </h2>
              <p className="lead">{dict.contact.lead}</p>

              <ol className="contact__steps">
                {dict.start.steps.map((step) => (
                  <li className="contact__step" key={step.index}>
                    <span className="contact__step-index mono" lang="en">
                      {step.index}
                    </span>
                    <span>
                      <strong className="contact__step-title">{step.title}</strong>
                      <span className="contact__step-body">{step.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="contact__panel">
              <ProjectForm locale={lang} dict={dict} variant="compact" idPrefix="contact" />
              <p className="contact__full">
                {dict.contact.fullFormPrompt}{" "}
                <Link href={`/${lang}/start`} className="contact__full-link">
                  {dict.contact.fullFormLink}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
