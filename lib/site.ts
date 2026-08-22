/**
 * Canonical origin for metadata, sitemap, and Open Graph URLs.
 *
 * Set NEXT_PUBLIC_SITE_URL to the production domain. On Vercel we fall back to
 * the project's production URL so preview builds still emit absolute URLs.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProduction) return `https://${vercelProduction}`;

  const vercelDeployment = process.env.VERCEL_URL?.trim();
  if (vercelDeployment) return `https://${vercelDeployment}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

export const ORG_NAME_EN = "OmegaTron";
export const ORG_NAME_AR = "أوميكاترون";
export const FOUNDER_NAME_EN = "Taha Jasim Mohammed";
export const FOUNDER_NAME_AR = "طه جاسم محمد";

/**
 * The founder's public profiles, as supplied by the team.
 *
 * Tracking parameters are stripped: a share link carries the campaign that
 * produced it, which has nothing to do with this site and follows anyone who
 * clicks through from here.
 */
export const FOUNDER_LINKEDIN = "https://www.linkedin.com/in/tjd162/";
export const FOUNDER_INSTAGRAM = "https://instagram.com/tjd_162";
