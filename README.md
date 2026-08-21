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
                          process, founder, contact — the first six sit
                          over the film backdrop
    start/page.tsx        Start a Project — the long-form request
    not-found.tsx
  api/contact/route.ts    server-side form handler and email delivery
  globals.css             the entire design system, one file
  icon.svg                favicon
  robots.ts, sitemap.ts
components/               Header, Footer, ProjectForm, FilmBackdrop,
                          SmoothScroll, Reveal, Logo, Icons
lib/
  i18n.ts                 every string on the site, in both languages
  mailer.ts               email transport (server-only)
  upload.ts               attachment limits shared by client and server
  site.ts                 canonical URL resolution
public/images/            photography — see public/images/README.md
public/media/             the film backdrop (two H.264 sizes, one VP9)
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

### Liquid glass

Surfaces that sit over the film are glass rather than filled panels. It is an
optical stack, not a translucent box, because a translucent box with a flat
border reads as tinted plastic no matter how it is tuned:

1. **The body.** `backdrop-filter: blur(30px) saturate(210%) brightness(0.88)
   contrast(1.06)` on the pane itself — the board stays legible through it, and
   the slight darkening keeps the material in this palette rather than Apple's
   white one.
2. **The lens band.** A `::before` carrying a *second* backdrop filter, masked
   to an 11px band just inside the border, lifting and re-saturating what is
   behind the edge relative to what is behind the middle. This is the cue that
   separates thick glass from a sheet of film. It is deliberately restrained:
   pushed harder, over near-black footage, it stops reading as refraction and
   starts reading as a second frame drawn inside the first.
3. **The rim.** A `::after` masked down to a 1.5px ring carrying a **conic**
   gradient, so the light travels around the perimeter — bright at the top-left
   shoulder, gone at the opposite corner, picked up again as a bounce along the
   bottom — instead of sitting at one value on four borders.
4. **The speculars.** Two radial gradients painted into the pane's own
   `background` stack, giving it a light source off the top-left shoulder and a
   faint bounce at the bottom-right.

Two weights: **`.glass`** (30px blur, 11px lens) for the header, the About
panel, the founder copy and the mobile sheet; **`.glass--lite`** (18px, 9px) for
the many small panes — capability cards, project points, chips, the ghost
button — so a dozen of them can composite over a seeking video.

Every value is a custom property (`--glass-tint`, `--glass-specular`,
`--glass-body`, `--glass-body-lite`, `--glass-lens`, `--glass-lens-w`,
`--glass-rim`, `--glass-inner`, `--glass-drop`, `--radius-glass`), so the
material is tunable in one place.

**One build note worth keeping.** The prefixed `-webkit-backdrop-filter` is
declared in its own `@supports` rule rather than beside the standard property.
Written as a neighbouring pair, the build's CSS minifier keeps exactly one of
the two — and Safari before 18 has only the prefixed form, so losing it would
mean losing the material outright on those devices.

The header is a floating bar: padded away from the viewport edge, with corners
rounded to `--radius-glass` rather than to a full pill, so it reads as a panel
of glass rather than a capsule. Its three tracks are `auto 1fr auto`, which
centres the nav against the bar rather than against whatever the brand and the
actions happen to measure.

**Corners and room.** One scale, all of it generous: `--radius` 16px for
controls, `--radius-lg` 26px for photography, `--radius-glass` 30px for panes.
Padding is a scale too — `--pane-pad` and `--pane-pad-sm` — because a glass pane
with tight padding reads as a border round the text rather than a surface
under it.

**The mobile sheet** hangs off the bar rather than sitting in the flow, so a
closed menu costs no layout and an open one covers the page instead of pushing
it down. It stays in the document and animates in both directions — the sheet
eases down and the rows arrive behind it, 40ms apart — and `visibility: hidden`
keeps the links out of the tab order while it is shut.

Measured contrast over the film, worst case: **4.89:1** on capability body copy,
against an assumed worst-case ground of `rgb(38,44,56)` — the scrim over the
brightest patch of footage — rather than a sampled pixel. Headings run 12:1 and
body copy 7.81:1 against the same ground.

## Weight

Two mechanisms, and they are separate on purpose.

**The hold.** The hero is given a 220vh runway with its content pinned inside
it, so the first stretch of scrolling moves the film and not the page. That
resistance is the weight at the top of the site. The statement dissolves over
the last quarter of the runway, so the release reads as a hand-off to the film
rather than the words being dragged off the top of the screen. The runway is
declared in CSS under `@media (scripting: enabled)` rather than added by script,
so there is no reflow after hydration, and only where there is a script to fade
the pinned content out again.

**The damper.** `components/SmoothScroll.tsx` takes the wheel off the document.
Each notch adds to a target position and a `requestAnimationFrame` loop eases
the real scroll position toward it, so the page takes the movement up and puts
it down again. It drives the *native* scroll position rather than transforming
the page, which is what keeps `position: sticky` — and therefore the hold above
— along with anchors, IntersectionObserver, the scrollbar and find-in-page all
working. Anything that moves the page from outside the loop is detected and the
loop resynchronises to it instead of fighting it. Off for touch, where the
platform's own momentum is better than anything we would put in front of it.

**Both easings are measured in time, not in frames.** A fixed fraction per frame
means the page settles in half the time on a 120Hz screen and takes three times
as long on a machine dropping to 20fps — the feel would be whatever the hardware
happened to be doing. The per-frame figure is converted into the equivalent
share of however long the frame actually took.

## The hero

No photograph — the film is the picture. The hero is a statement, a lead, and
two actions, pinned and centred over the board.

## The film

`components/FilmBackdrop.tsx` runs the circuit-board film as the page's
**backdrop**, not as a section. It is fixed to the viewport and sits behind
everything from the hero down to the founder; scroll position across that range
drives `video.currentTime`, so the board advances as the visitor reads the site
over it. It is not a player: no controls, no autoplay, no audio track,
`aria-hidden`, untabbable.

**How it runs.** `app/[lang]/page.tsx` wraps those six sections in
`<div className="film-range" id="film-range">`; the component measures that
element and maps `-rect.top / (height - viewportHeight)` to 0..1. A single
`requestAnimationFrame` loop does the seeking, the hand-off fade over the last
10% of the range, and the pointer drift. An IntersectionObserver runs that loop
only while the range is on screen, and the layer's `visibility` is dropped
entirely once the visitor scrolls past it, so the contact section and footer
composite against a plain background. The seek target is eased toward the scroll
position and applied only when the change is worth at least a frame, so a still
page does not keep the decoder busy. Sections below the range carry
`.section--solid`, which restores an opaque ground.

Because scroll is the only input, touch works exactly as the mouse wheel does.
The pointer parallax is gated on `(hover: hover) and (pointer: fine)` and moves
the frame by at most 16px — well inside the masked edge, so it can never expose
a hard boundary.

**How it is encoded.** Four files in `public/media/`, and a browser downloads
exactly **one**:

| File | Codec | Size | Served to |
| --- | --- | --- | --- |
| `circuit-1080.mp4` | 1920x1080 H.264, all-intra | 7.5 MB | ≥900px viewports |
| `circuit-540.mp4` | 960x540 H.264, all-intra | 2.8 MB | narrow viewports |
| `circuit-720.webm` | 1280x720 VP9 | 3.7 MB | browsers without H.264 |

The component asks `canPlayType` and assigns `video.src` itself rather than
listing `<source>` elements — a fallthrough list makes the browser fetch the
MP4, fail to decode it, and fetch the WebM as well, doubling the bytes. Every
real browser takes the MP4.

All three are 12 seconds at 20 fps with no audio stream. Desktop is served at
full 1080p — a deliberate trade of weight for sharpness, since the film is the
only picture on the page above the fold; the phone gets a quarter of the
pixels. The WebM exists for browsers without H.264, which is now a rare enough
case that one encode covers both viewports. **Every frame is a
keyframe** — that is what makes the scrub feel attached to the thumb rather
than lagging behind it. Scrubbing lands on an arbitrary time, and with an
inter-frame group the decoder has to walk forward from the last keyframe to get
there; all-intra means one decode per seek, at any position, in any direction.
240 frames across the range works out at roughly one frame per 17px of scroll.
A 28 KB poster covers the moment before the first frame decodes.

**Framing.** The element is given the footage's own 16:9 ratio rather than
being stretched to the viewport and cropped with `cover` — cover turned the
board into a macro shot, brutally so on a phone, where the viewport is more
than twice as tall as the frame. On a landscape screen it is then sized to
`100svh * 16/9 * 0.94`, so it nearly fills the viewport with only a shallow
band left top and bottom; on a portrait one it is sized to the width instead
and opened up, which is a fraction of the magnification cover was forcing.
Because the box matches the picture exactly either way, a radial mask fades the
picture's real edges into the page instead of ending on a rectangle.

**Reduced motion** shows a single frame and never scrubs — the loop simply never
starts, and the layer stays visible so the composition is intact.

To re-cut the film, any full ffmpeg will do:

```bash
ffmpeg -ss 2 -t 12 -i source.mp4 -vf "fps=20,scale=1920:1080:flags=lanczos" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -g 1 -keyint_min 1 -bf 0 \
  -sc_threshold 0 -crf 32 -preset slow -movflags +faststart -an \
  public/media/circuit-1080.mp4
```

## Scroll-linked motion

Deliberately minimal — two effects, both CSS scroll-driven animations, so there
are no scroll listeners and nothing runs on the main thread:

- a reading-progress hairline across the top of the viewport,
- photographs settling out of a slight over-scale as they enter frame.

Plus one short entrance per block, driven by a single IntersectionObserver.

Browsers without support skip the `@supports` block and get the static
composition. Every "from" state stays partly opaque rather than transparent, so
a failure can never blank the content. `prefers-reduced-motion` removes the
timelines outright rather than just shortening durations.

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
- **Minimal client JavaScript.** Only four components are interactive: the
  mobile menu, the form, the entrance observer, and the film. Everything else —
  including the language toggle — is server-rendered HTML.
- **No layout shift.** Every image sits in a wrapper with a declared aspect
  ratio and renders with `fill`; fonts carry fallback metrics.
- **Images** are served as AVIF/WebP at responsive sizes by the Next optimiser.
  The hero image is preloaded; everything below the fold is lazy.
- **Accessibility:** a skip link, one `<h1>` per page, labelled landmarks and
  form controls, `aria-invalid` plus `role="alert"` on validation errors, a
  visible focus ring on every interactive element, and a full
  `prefers-reduced-motion` path that removes the reveal entirely.
- **SEO:** per-language metadata, canonical and `hreflang` alternates, Open
  Graph and Twitter cards, `robots.txt`, `sitemap.xml`, and JSON-LD for the
  organisation, its founder, and the award.

## Images

`public/images/` holds the team's own photography. See
[`public/images/README.md`](public/images/README.md) for the mapping of each
file to the section it appears in — including two files whose names are the
opposite way round to what they show.
