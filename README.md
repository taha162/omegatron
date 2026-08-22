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
    page.tsx              home: hero, award, about, projects,
                          capabilities, method, founder, contact
    founder/page.tsx      the founder's own route
    start/page.tsx        Start a Project — the long-form request
    not-found.tsx
  api/contact/route.ts    server-side form handler and email delivery
  globals.css             the entire design system, one file
  icon.svg                favicon
  robots.ts, sitemap.ts
components/               Header, Footer, ProjectForm, Logo, Icons
  HeroScene.tsx           the pinned, scroll-driven film
  Award.tsx               NURAI 2026 — the monument
  ProjectRail.tsx         the pinned horizontal filmstrip
  Methodology.tsx         the method timeline
  FounderStory.tsx        the founder route's editorial layout
  SmoothScroll.tsx        Lenis, wired to the GSAP ticker
  Cursor / Magnetic / RippleLink / PageWipe / MaskLines / Reveal
  Social.tsx              the founder's profiles
  BackLink.tsx            the way out of a leaf page
  motion.ts               one GSAP + ScrollTrigger registration
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

**The site is dark, and only dark.** There is no toggle and no `localStorage`
read: the palette is one `:root` block at the top of `app/globals.css` with
`color-scheme: dark`. Nothing else in the stylesheet references a raw colour,
so re-pitching the whole site means editing that one block.

### Two accents, and what each one means

| Token | Value | What it marks |
| --- | --- | --- |
| `--gold` | `#d9ae45` | The needle through the centre of the logo mark. Achievement, the current state of a control, and the one action the page is asking for. |
| `--steel` | `#4a90d9` | The trace colour of the board in the film. Data, instrumentation, position. It never means "click here". |

The warm accent is the brand's own gold rather than a brighter amber, so the
site matches the mark on the team's hardware, documents and badge — and the
warm data points in the footage happen to sit on almost exactly that hue
already. Everything else is greyscale, so the photographs and the film are the
only saturated things on the page.

`--ink` / `--ink-2` / `--ink-3` are 17:1, 10:1 and 6.4:1 against `--paper`, and
`--steel` is 6:1, so every text token clears WCAG AA on its own without having
to reason about what is behind it.

### The sheet

Structure is drawn, not stacked. Every section is a narrow title block beside a
wide content column (`.sec` / `.sec__rail` / `.sec__body`): a hairline runs the
height of the rail on its leading edge with a short gold segment at its head —
the needle from the mark. On a phone the rail turns over, and the needle runs
across the top of the label instead of down its edge.

Radius is 2px throughout. Machined, not rounded.

## Motion

Everything that moves is driven by scroll, through **GSAP ScrollTrigger** and
**Lenis**. Those are the only two runtime dependencies the site has; there is no
Tailwind, no animation library beyond GSAP, and no component kit.

### The engine

`components/SmoothScroll.tsx` takes the wheel and the touch off the document
and eases the real scroll position toward a target, so movement carries weight
instead of snapping. Because it drives the *native* scroll position rather than
transforming the page, `position: sticky` — and therefore every pinned section —
anchors, the scrollbar and find-in-page all keep working.

**The weight is a duration, not a lerp.** A lerp moves a fixed fraction of the
remaining distance each frame: it never quite arrives, so the last stretch of
every gesture crawls, and because the step depends on the distance left, a short
flick and a long one settle at different rates. That inconsistency is what reads
as "not smooth" even when nothing is dropping frames. A duration with an
exponential ease-out (`1.15s` on a pointer, `0.9s` under a finger) gives every
gesture the same wall-clock settle whatever its length, and lands rather than
approaching. `syncTouch` stops the finger dragging Lenis and the platform's own
scroll at the same time.

**Lenis and ScrollTrigger share one clock.** Left on separate loops, GSAP reads
a scroll position Lenis has not written yet and every pinned section lags a
frame behind the page. Lenis is stepped from GSAP's ticker and ScrollTrigger is
updated from Lenis's own event; `gsap.ticker.lagSmoothing(0)` stops GSAP
pausing the ticker mid-gesture after a long frame.

### What is pinned

Three sections hold the viewport while their content advances:

| Section | Pin length | What advances |
| --- | --- | --- |
| Hero | `300svh` | The film scrubs; three beats of copy cross-fade over it |
| Projects | viewport + strip overflow | The filmstrip is pulled sideways |
| Award, Method | not pinned | Scrubbed in place as they are entered |

Pinning is done with `position: sticky`, not GSAP's own pin: it needs no
pin-spacer in the DOM, survives a resize without re-measuring the document, and
degrades to an ordinary block the moment it is switched off. The projects
section sets its own height to the viewport plus exactly the strip's overflow,
so the pin lasts as long as the horizontal run and not a pixel longer.

**No screen is ever empty.** A pinned section that hands over between states can
leave a stretch of scroll with one thing gone and the next not yet arrived,
which is a viewport of film and nothing to read. The hero's beat windows
therefore overlap rather than meeting end to end. This is checked rather than
assumed: walking the built page in 32 steps at 390px, 768px and 1440px, the
emptiest screen still carries 45 characters of visible copy.

### The shader

`components/filmShader.ts` puts the film through a fragment shader — raw WebGL,
one program, no library. Two things happen to the picture, and both are tied to
scroll velocity rather than to a clock: a lateral wave that leans the board the
way the page is moving, and a chromatic split that opens as the wave grows. At
rest both fall to zero and the frame is a pixel-exact copy of the video. That is
the point — the effect is a consequence of movement, not a filter permanently on
top of the footage.

The video stays the source of truth: it is still decoded, still seeked, and is
simply drawn through the canvas instead of composited directly. It is left
painted and covered rather than hidden, because an engine is free to stop
updating a video nothing is showing, and a hidden element is then not a
dependable `texImage2D` source.

**The texture is not uploaded once.** A scrubbed film never plays a new frame,
so a single upload that happens to land while the element is still fading in
leaves a black texture for the whole session — which is exactly what happened
the first time. It now re-uploads whenever `currentTime` has moved, plus a
90-frame warm-up after the renderer is built.

Skipped on a machine reporting 4GB or less, on viewports under 700px, and under
reduced motion. The plain video element is a complete experience on its own.

### The rest

- A custom cursor: an 8px dot in `mix-blend-mode: difference`, opening to 40px
  over anything clickable. It is an *addition* to the system pointer, not a
  replacement, so nothing is lost if it never renders. Fine pointers only.
- One reading line, and only one. The header's own bottom edge is a plain
  hairline rather than a gradient — two coloured rules that close to the top of
  the screen read as two progress bars.
- The menu control is a 2x2 array of pads, not three lines: the corner of the
  package the site opens on. Open, the array rotates and one diagonal retracts.
- **Words, not characters.** The hero's statement arrives a word at a time and
  the About line lights word by word as it is read. Splitting per character
  would sever Arabic joins and render every word as a row of isolated forms, so
  nothing on this site is ever split below the word.
- **The lockup decodes.** The team's name resolves out of random glyphs from its
  own script. It is server-rendered as the real string, so no-script visitors
  and crawlers get the name rather than noise.
- **The lean.** Content tilts about a degree into the direction of travel and
  rights itself when the page settles. Carried only by blocks with nothing
  pinned inside them — a transform on an ancestor re-parents `position: fixed`
  and `sticky`, which would tear the hero and the filmstrip off their pins.
- **The band.** The capability names run continuously and are geared to the
  page: scrolling adds to their rate and can reverse it.
- Magnetic pull on the badge and the founder's call to action; a ripple where a
  press lands.
- A diagonal shutter between routes, skipped on first load.
- One entrance per block, and mask-up line reveals on the founder page.

`prefers-reduced-motion` removes all of it: no engine, no pins, no scrub, no
cursor, no wipe, and the film is never fetched. The page becomes an ordinary
document of 8.3 screens instead of 11.1.

## The hero

No photograph — the film is the picture. A statement, a lead, two actions that
do not look alike, and three beats that cross-fade as the scene advances.

## The film

`components/HeroScene.tsx` runs the circuit-board film as a scroll-driven
sequence. It is not a player: no controls, no sound, no autoplay, no
click-to-play, `aria-hidden`, untabbable. Scroll position drives
`video.currentTime` through a `scrub: true` ScrollTrigger, so it advances as
the visitor scrolls down and rewinds as they scroll up.

**The picture is always there.** `.hero__film` paints `chip-poster.jpg` (50 KB)
as its own CSS background, so the scene has its image in the first frame the
browser draws, with no video element involved. The footage fades in over it once
it has decoded a frame, and is fetched only **after the page's own `load`**, on
an idle callback — a multi-megabyte media fetch running alongside the document
only pushes out the moment the hero becomes readable.

### One encode, at maximum quality

The team asked for the highest quality the source allows, on every device, and
accepted the weight that comes with it. So there is no ladder:

| File | Codec | Size | Served to |
| --- | --- | --- | --- |
| `chip-1080.mp4` | 1920x1080 H.264, all-intra | 31.3 MB | everything that can decode H.264 |
| `chip-720.webm` | 1280x720 VP9, all-intra | 10.6 MB | browsers that cannot |

**501 frames** — every frame of the source, at 24fps. Over a 300svh track that
is roughly one frame per 3px of scroll on a desktop screen, which is what makes
a slow scrub read as motion rather than as a slideshow.

**Every frame is a keyframe.** Scrubbing lands on an arbitrary time, and with an
inter-frame group the decoder has to walk forward from the last keyframe to get
there; all-intra means one decode per seek, at any position, in any direction.
That is the entire reason 7 seconds of footage costs 31 MB, and it is the
reason the scrub never hitches.

The source is 1080p, so **there is no tier above it** — a 1440p or 4K entry
would be an upscale of pixels that were never shot. Measured alternatives, all
rejected: HEVC saved 13% for a Safari-only branch; a short GOP saved half the
weight but made backward seeks cost up to seven decodes; a WebP image sequence
came to 12.4 MB at a *lower* resolution.

**Nothing waits on it.** `preload="none"`, the source assigned on an idle
callback after the page's own `load`, and the poster painted as the layer's own
CSS background — so the hero heading is readable in about 250ms and the footage
arrives behind it. Until it is decodable, `ready` stays false and the scene
holds on the poster, which is the film's own first frame.

On a device with 4GB of memory or less, or a viewport under 700px, the decoder
is asked for a new frame less often. It is the same file at the same
resolution; only the seek rate is coarsened, because what a phone struggles
with is decoding a fresh frame on every animation frame while also scrolling.

To re-cut the film from a new source:

```bash
ffmpeg -i source.mp4 -vf "scale=1920:1080:flags=lanczos" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -g 1 -keyint_min 1 -bf 0 \
  -sc_threshold 0 -crf 22 -preset slow -movflags +faststart -an \
  public/media/chip-1080.mp4
```

## The award

`components/Award.tsx` sits immediately after the hero and carries **two**
placings from NURAI 2026 — first at the University of Mosul, third nationally
in Iraq.

Each placing is a numeral set at the largest size anywhere on the site,
standing on its own plinth of plates that assemble in depth under a
`perspective: 1400px`. First place takes the brand gold, third the board's
steel, so the two are told apart before they are read. Both resolve out of a
chromatic split — two offset copies in the accent hues closing onto the figure —
and a scanline band crosses each one so it reads as displayed rather than
printed. Behind them the board's traces draw themselves; each path reports its
own `getTotalLength()`, so the dash animation is exact rather than a guess.

One ScrollTrigger writes three custom properties (`--draw`, `--assemble`,
`--glitch`); the stylesheet owns every appearance decision and the component
owns only the timing. The line beside it types rather than fades, and carries
the full sentence as its `aria-label` so assistive technology never reads a
half-finished one.

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
- **Two runtime dependencies.** GSAP (with ScrollTrigger) and Lenis, and
  nothing else — no Tailwind, no component kit, no second animation library.
  About 212 KB of JavaScript in total.
- **One clock.** Every scrubbed section reads the same ScrollTrigger timeline,
  which is stepped by Lenis. There is not a single `scroll` listener driving
  animation anywhere on the site.
- **The film waits for the page.** `preload="none"`, with the source assigned on
  an idle callback after `load`, so it never competes with first paint. The
  poster is already showing by then.
- **Nothing is fetched that will not be used.** Under reduced motion the footage
  is never requested and the home page transfers **0.41 MB**; `/founder` and
  `/start` transfer about 0.33 MB and never touch the film at all.
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
  organisation, the award, and a `ProfilePage` for the founder's route.
- **Verified on the built site:** no horizontal overflow from 320px to 2560px
  across all six routes, one `<h1>` per page, every image with alt text, every
  landmark named, no focusable element inside `aria-hidden`, and no console
  errors at any viewport in either language.

## Images

`public/images/` holds the team's own photography. See
[`public/images/README.md`](public/images/README.md) for the mapping of each
file to the section it appears in — including two files whose names are the
opposite way round to what they show.
