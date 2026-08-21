# OmegaTron | أوميكاترون

The official website of **OmegaTron**, a competitive mechatronics engineering
team. Arabic is the default language; English is a full, hand-written
translation rather than a machine pass.

Built with Next.js 16 (App Router, React 19) and TypeScript. The only runtime
dependencies are `next`, `react`, `react-dom`, and `server-only` — no UI
library, no CSS framework, no analytics, no animation library.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # then fill in the values
npm run dev                    # http://localhost:3000
```

```bash
npm run build && npm run start # production build
npm run typecheck              # tsc --noEmit
```

---

## Structure

```
app/
  [lang]/                 ar | en — both prerendered at build time
    layout.tsx            root layout: <html lang dir>, fonts, header, footer
    page.tsx              home: hero, about, projects, capabilities,
                          process, founder, contact — the film runs in
                          the hero and nowhere else
    start/page.tsx        Start a Project — the long-form request
    not-found.tsx
  api/contact/route.ts    server-side form handler and email delivery
  globals.css             the entire design system, one file
  icon.svg                favicon
  robots.ts, sitemap.ts
components/               Header, Footer, ProjectForm, FilmBackdrop,
                          Reveal, Logo, Icons
lib/
  i18n.ts                 every string on the site, in both languages
  mailer.ts               email transport (server-only)
  upload.ts               attachment limits shared by client and server
  site.ts                 canonical URL resolution
public/images/            photography — see public/images/README.md
public/media/             the hero film (one H.264, one VP9, one poster)
```

### Editing content

All copy lives in `lib/i18n.ts`. The Arabic object is the source of truth and
the English object is typed against it, so **the compiler fails if a key exists
in one language and not the other**. Add a string once and TypeScript tells you
where its translation is missing.

---

## Languages and direction

- `/` redirects to `/ar`. English lives at `/en`.
- The language toggle in the header is a pair of plain links — it swaps the
  first path segment and keeps the rest, so `/en/start` ↔ `/ar/start`. No
  JavaScript is involved in switching.
- `<html lang dir>` is set per route, and the stylesheet uses **logical
  properties throughout** (`margin-inline`, `border-inline-start`, `inset-inline`),
  so a single set of rules serves both directions correctly.
- Arabic never receives `letter-spacing`. Tracking is applied only under
  `[lang="en"]`, because spacing Arabic tears joined glyphs apart. Arabic also
  gets a taller line-height and a slightly larger base size to sit comfortably
  with Cairo's diacritics.
- `hreflang` alternates and an `x-default` pointing at Arabic are emitted on
  every page, and the sitemap carries per-language alternates.

## Theme and material

**The site is dark, and only dark.** There is no toggle and no
`localStorage` read: the palette is one `:root` block at the top of
`app/globals.css` with `color-scheme: dark`. Nothing else in the stylesheet
references a raw colour, so re-pitching the whole site means editing that one
block.

The colours come from the official logo — deep navy ground, brushed steel, one
gold accent. The mark itself is vector art in `components/Logo.tsx` — the open
omega ring, the gear quadrant, the circuit traces, the gold needle — so it costs
no network request and stays crisp at any size. `Wordmark` sets OMEGA in steel
and TRON in gold as the logo does.

### The sheet

Surfaces are drawn, not stacked. The vernacular this team actually works in is
the datasheet and the engineering drawing, so that is the material: a near-black
ground, hairlines in three weights, and one accent.

**The rail.** Every section is a narrow title block beside a wide content
column (`.sec` / `.sec__rail` / `.sec__body`). A hairline runs the height of the
rail on its leading edge, and a short gold segment sits at the top of it — the
needle from the logo mark. It is the same skeleton on every section, which is
what makes the page read as one document rather than six blocks. On a phone the
rail turns over: the needle runs across the top of the label instead of down its
edge.

**One accent, spent four times.** Gold is the only colour in the interface, and
it appears on the rail segment, the award, the current state of a control, and
the index mark on the hero scale. Everything else is greyscale, so the
photographs and the film are the only saturated things on the page — the
hardware is the only thing that glows.

**Ink.** `--ink` / `--ink-2` / `--ink-3` are 16.5:1, 8.5:1 and 5.0:1 against
`--paper`, so every text token clears WCAG AA for normal text on its own,
without having to reason about what is behind it.

**Radius is 2px.** Machined, not rounded, and not the zero-radius broadsheet
look either.

An earlier revision used a light frosted "liquid glass" material over the film.
It was removed: three stacked `backdrop-filter` layers over a seeking video are
expensive on a phone, dark type on a translucent pane has a contrast ratio that
depends on whatever video frame happens to be behind it, and white frosted
panes read as a generic product UI rather than as this team.


## Motion

Four things move, and each of them is doing a job.

**The film across the hero's exit.** Scroll drives `video.currentTime`, and the
same 0..1 figure is written to `--film-progress`, which places a gold index mark
on the scale along the hero's bottom edge. The mechanism shows itself rather
than being asserted.

**One entrance per block.** A single IntersectionObserver adds `.is-in`; the
transition is 0.4s over 8px. It never delays content — the starting state is
only applied under `@media (scripting: enabled)`, so a browser with JavaScript
off renders everything visible.

**Photographs settle** out of a slight over-scale as they enter frame, and a
**reading hairline** crosses the top of the viewport. Both are CSS
scroll-driven animations, so they never touch the main thread.

Everything else is a state change on a hairline: a tick drawn under a nav item,
a rule extending in the capabilities register, the founder's portrait coming out
of monochrome.

`prefers-reduced-motion` removes the timelines outright rather than shortening
them, and no footage is fetched at all.

### What was removed, and why

Two mechanisms were taken out in the process, because both cost the visitor more
than they returned:

- **The scroll damper** took the wheel *and* touch off the document and eased
  the scroll position toward a target, replacing the platform's own momentum. It
  put roughly 1.8 seconds between a wheel notch and the page settling, and on a
  phone it `preventDefault`ed `touchmove` and reimplemented fling physics.
- **The holds** appended a run of empty scroll to every section with the content
  pinned inside it. Measured on the built site, they made the home page **11
  viewport-heights tall** on a 1440x900 screen for six short sections, about 2.9
  of which were empty; whole screens had nothing on them but the film, and
  sections released into the sticky header and into each other.

The page is now 6.9 viewport-heights on the same screen, and scrolling is the
platform's.

## The hero

No photograph — the film is the picture. A statement, a lead, two actions that
do not look alike, and a measured bottom edge.

## The film

`components/FilmBackdrop.tsx` runs the circuit-board film as the hero's
**instrument display** — full-bleed inside the hero and nowhere else. It is not
a player: no controls, no sound, no autoplay, `aria-hidden`, untabbable.

**The picture is always there.** `.film` paints `circuit-poster.jpg` (48 KB) as
its own CSS background, so the hero has its image in the first frame the browser
draws, with no video element involved. The footage is an enhancement laid over
that poster and only fades in once it has decoded a frame.

**When the footage is fetched.** The encode is all-intra — every frame a
keyframe, which is what makes the scrub feel attached to the scroll, and also
why it costs 9.3 MB. It is therefore only fetched when it is worth that:

| Condition | Footage |
| --- | --- |
| `prefers-reduced-motion: reduce` | never |
| `Save-Data`, or `effectiveType` below 4g | never |
| viewport narrower than 900px | never |
| otherwise | after `load`, on an idle callback |

The narrow-viewport rule is the split this project always intended; there was
simply never a small encode to serve, and sending the full one to a phone is not
a substitute for having one. A visitor on mobile data gets the same frame at
48 KB. **Measured on the built site, that takes the home page on a 390px
viewport from 4.55 MB to 0.32 MB.** Re-cutting a ~540p encode and lowering that
threshold is the one obvious win still on the table.

**The two files.** A browser downloads exactly one:

| File | Codec | Size | Served to |
| --- | --- | --- | --- |
| `circuit-1080.mp4` | 1920x1080 H.264, all-intra | 9.3 MB | everything that can decode H.264 |
| `circuit-720.webm` | 1280x720 VP9 | 4.6 MB | browsers that cannot |

The component asks `canPlayType` and assigns `video.src` itself rather than
listing `<source>` elements — a fallthrough list makes the browser fetch the
MP4, fail to decode it, and fetch the WebM as well, doubling the bytes.

15 seconds at 20 fps, no audio stream. **Every frame is a keyframe** — scrubbing
lands on an arbitrary time, and with an inter-frame group the decoder would have
to walk forward from the last keyframe to get there; all-intra means one decode
per seek, at any position, in any direction. The seek target is eased toward the
scroll position and applied only when the change is worth at least a frame, so a
still page does not keep the decoder busy, and an IntersectionObserver runs the
loop only while the hero is on screen.

To re-cut the film, any full ffmpeg will do:

```bash
ffmpeg -ss 2 -t 15 -i source.mp4 -vf "fps=20,scale=1920:1080:flags=lanczos" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -g 1 -keyint_min 1 -bf 0 \
  -sc_threshold 0 -crf 32 -preset slow -movflags +faststart -an \
  public/media/circuit-1080.mp4
```


## Typography

Cairo, loaded through `next/font/google` as a **variable** font — one file per
subset covers Light (300) through ExtraBold (800). It is self-hosted at build
time, preloaded, and paired with auto-generated fallback metrics, so there is no
layout shift when it lands and no request to a third-party font host.

---

## The two enquiry forms

`components/ProjectForm.tsx` renders one of two shapes from the same component,
so validation, submission, and error handling can never diverge:

- **`compact`** — the contact section on the home page. Name, email, phone,
  project type, description of the challenge, expected outcome.
- **`full`** — the `/start` page. Adds organisation (optional), operating
  environment, current stage, budget, timeline, and attachments.

Both post to `/api/contact`, and **mandatory fields are enforced on the server,
not just in the browser**. Six fields are required on every enquiry; the long
form additionally requires environment, stage, budget, and timeline. A request
missing any of them is rejected with a 400 naming the fields, rather than
delivered half-complete. Required fields carry a gold `*` and the form states
why they are being asked for.

## Email delivery

The project-request form posts `multipart/form-data` to `/api/contact`, which
runs **server-side only**. The API key is read from the environment inside the
route handler and never reaches the browser; `lib/mailer.ts` imports
`server-only`, so importing it from a client component is a build error rather
than a leak.

| Variable             | Required | Purpose                                                          |
| -------------------- | -------- | ---------------------------------------------------------------- |
| `RESEND_API_KEY`     | yes      | Resend API key                                                    |
| `CONTACT_TO_EMAIL`   | yes      | Recipient. Comma-separate for several                             |
| `CONTACT_FROM_EMAIL` | yes      | Verified sender, e.g. `OmegaTron <requests@yourdomain.com>`        |
| `CONTACT_BCC_EMAIL`  | no       | Silent copy                                                       |
| `NEXT_PUBLIC_SITE_URL` | no     | Canonical origin. Falls back to the Vercel deployment URL         |
| `NEXT_PUBLIC_CONTACT_EMAIL` | no | If set, shown as a contact address in the footer                 |

The recipient is configurable at any time from the Vercel dashboard — no code
change and no redeploy of the source is needed beyond a restart.

**Setup:** create a key at [resend.com/api-keys](https://resend.com/api-keys),
verify your sending domain, then add the variables under
_Project → Settings → Environment Variables_. While testing you can send from
`onboarding@resend.dev` before a domain is verified.

Replies go straight to the person who submitted: `Reply-To` is set to their
address, so hitting reply in your inbox answers them directly.

**To use a different provider** (SendGrid, Postmark, SMTP): replace the body of
`sendEmail` in `lib/mailer.ts`. The route only depends on its `{ ok }` result.

### Protections on the endpoint

- Server-side revalidation of every field, independent of the browser.
- Per-field length caps, so an oversized paste cannot inflate the message.
- HTML escaping of all submitted values in the email body.
- Newlines stripped from the subject line and filenames (header-injection).
- A hidden honeypot field and a minimum fill time; both are answered with a
  normal success response so bots learn nothing.
- A best-effort in-process rate limit (5 requests per IP per 10 minutes).
- Attachments: max 3 files, 4 MB total, extension **and** MIME checked —
  deliberately under Vercel's ~4.5 MB serverless body limit.

---

## Deployment on Vercel

Import the repository; the framework preset, build command, and output are
detected automatically. Add the environment variables above for **Production**,
**Preview**, and **Development**, then deploy.

Everything except `/api/contact` is prerendered as static HTML at build time and
served from the edge cache. `/api/contact` is the only serverless function.

Set `NEXT_PUBLIC_SITE_URL` to your real domain once it is attached, so canonical
URLs, `hreflang`, `sitemap.xml`, and Open Graph tags point at it rather than the
generated `*.vercel.app` hostname.

## Performance and accessibility

- **Static by default.** Both languages of both pages are prerendered.
- **Motion is nearly free.** The progress hairline and the image settle are CSS
  scroll-driven animations, so they never touch the main thread. The film is the
  one exception: a single `requestAnimationFrame` loop, gated by an
  IntersectionObserver, and no scroll listener anywhere on the page.
- **Minimal client JavaScript.** Only three components are interactive: the
  mobile menu, the form, and the film — plus the entrance observer. Everything
  else, including the language toggle, is server-rendered HTML.
- **The film is opt-in.** See "The film" above for the conditions. On a 390px
  viewport the home page transfers **0.32 MB**; with reduced motion, or on a
  metered connection, the footage is never requested at all.
- **No layout shift.** Every image sits in a wrapper with a declared aspect
  ratio and renders with `fill`; fonts carry fallback metrics.
- **Images** are served as AVIF/WebP at responsive sizes by the Next optimiser.
  The hero image is preloaded; everything below the fold is lazy.
- **Accessibility:** a skip link, one `<h1>` per page, labelled landmarks and
  form controls, `aria-invalid` plus `role="alert"` on validation errors, a
  visible focus ring on every interactive element, and a full
  `prefers-reduced-motion` path that removes the reveal entirely. The mobile
  menu closes on Escape and returns focus to the control that opened it, locks
  the page behind it, and dims it.
- **SEO:** per-language metadata, canonical and `hreflang` alternates, a
  per-language Open Graph card, `robots.txt`, `sitemap.xml`, and JSON-LD for the
  organisation, its founder, and the award.

## Images

`public/images/` holds the team's own photography. See
[`public/images/README.md`](public/images/README.md) for the mapping of each
file to the section it appears in — including two files whose names are the
opposite way round to what they show.
