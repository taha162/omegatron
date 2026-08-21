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
                          SmoothScroll, ScrollHolds, Reveal, Logo, Icons
lib/
  i18n.ts                 every string on the site, in both languages
  mailer.ts               email transport (server-only)
  upload.ts               attachment limits shared by client and server
  site.ts                 canonical URL resolution
public/images/            photography — see public/images/README.md
public/media/             the film backdrop (one H.264, one VP9)
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

Surfaces that sit over the film are glass rather than filled panels.

**It is the light material, and that is a finding rather than a preference.**
Glass only reads as glass when there is something behind it to bend. The film is
close to black; a dark pane over a dark ground has nothing to refract and can
only ever look like tinted plastic, however the gradients are tuned. So the
panes are frosted white and carry dark type, and the scrim over the film was
lifted (0.52 → 0.40 in the mid-range) to give them something to work with — the
type on the panes no longer depends on that scrim for its contrast.

Four layers:

1. **The body.** `backdrop-filter: blur(28px) saturate(210%) brightness(1.3)` on
   the pane, under a white tint that runs 0.58–0.78 down a diagonal. Opaque
   enough to carry small dark type, translucent enough that the board is visibly
   moving behind it.
2. **The lens band.** A `::before` carrying a *second* backdrop filter, masked to
   a 12px band just inside the border, pulling what is behind the edge back
   toward the footage's own colour so the border reads as thickness rather than
   as a printed outline.
3. **The rim.** A `::after` masked down to a 1.5px ring carrying a **conic**
   gradient: a bright catch at the top-left shoulder, a soft shadow at the
   bottom-right where the pane lifts off the page — light travelling round the
   perimeter instead of sitting at one value on four borders.
4. **The speculars.** Two radial gradients painted into the pane's own
   `background` stack.

**The ink flips with the material.** Every rule in the stylesheet reads its
colour from tokens, so `.glass` re-points `--ink`, `--ink-2`, `--ink-3`,
`--paper`, `--steel`, `--accent` and the line colours on itself, and the pane's
contents turn over without a single component rule knowing where it is sitting.
`.btn--ghost` wears the material, so it takes the same flip — it was the one
element that did not, and it spent a build as light type on a light pane.

Two weights: **`.glass`** (28px blur, 12px lens) for the header, the About panel,
the founder copy and the mobile sheet; **`.glass--lite`** (18px, 9px) for the
many small panes — capability cards, project points, chips, the ghost button —
so a dozen of them can composite over a seeking video.

Every value is a custom property (`--glass-tint`, `--glass-specular`,
`--glass-body`, `--glass-body-lite`, `--glass-lens`, `--glass-lens-w`,
`--glass-rim`, `--glass-inner`, `--glass-drop`, `--glass-ink*`,
`--radius-glass`), so the material is tunable in one place.

**One build note worth keeping.** The prefixed `-webkit-backdrop-filter` is
declared in its own `@supports` rule rather than beside the standard property.
Written as a neighbouring pair, the build's CSS minifier keeps exactly one of
the two — and Safari before 18 has only the prefixed form, so losing it would
mean losing the material outright on those devices.

**The header** is a floating bar. Two things about it are worth writing down,
because both were bugs first:

- The gutter and the bar's own padding are on **different elements**. Putting
  `.container` and the glass on one element meant the container's padding served
  as internal padding and the bar itself ran flush to the screen edges — visible
  on a phone, hidden on a desktop only because the container's `max-width` was
  narrower than the viewport.
- Its three tracks are `auto 1fr auto` with each item **placed by name**
  (`grid-column: 1 | 2 | 3`). Left to auto-placement, hiding the nav below 860px
  took it out of the grid, and the actions fell into the middle column — which
  is what parked them in the centre of the bar with empty space either side.

**Corners and room.** One radius for every box on the site — `--radius`, 16px,
taken from the hero buttons and used by panes, photography, controls and chips
alike. Padding is a scale — `--pane-pad` and `--pane-pad-sm` — because a glass
pane with tight padding reads as a border round the text rather than a surface
under it.

**The mobile sheet** hangs off the bar rather than sitting in the flow, so a
closed menu costs no layout and an open one covers the page instead of pushing
it down. It stays in the document and animates in both directions — the sheet
eases down and the rows arrive behind it, 40ms apart — and `visibility: hidden`
keeps the links out of the tab order while it is shut.

**Contrast is measured, not estimated.** The panes are translucent, so what sits
behind a glyph is a blend of the tint, the specular, the lens and whatever frame
of the film happens to be underneath — there is no ground to reason about on
paper. `scripts` is not the place for it, so the check lives with the other
Playwright verification: it screenshots the page, samples a glyph-free patch of
the pane behind each target, and computes the ratio against the element's
computed colour. All 17 targets pass at their WCAG AA threshold. The tightest
are the gold section label over the film at **4.92:1** (worst of 21 scroll
positions, as the film moves under it) and the gold half of the wordmark on the
header pane at **5.52:1**; body copy on the panes runs 5.9–8.5:1.

## Weight

Two mechanisms, and they are separate on purpose.

**The holds.** Every section over the film carries a run of empty scroll at its
end with its content pinned inside it, so scrolling through the gap advances the
film without moving the page. The section then releases and the next one climbs
in behind it. That resistance, six times over, is the weight in the site.

`components/ScrollHolds.tsx` does the arithmetic, because it depends on how tall
each section's content turns out to be against the viewport — which CSS cannot
ask:

| Case | Pinned at | Why |
| --- | --- | --- |
| The hero | the top, for 115vh | It fills the screen by construction and has nothing above it, so it holds longest. |
| Content shorter than the screen | centred, for 42vh | Centring is what makes a section let go while its own bottom edge is still above the fold, so it is gone before the next one arrives. |
| Content taller than the screen | its last line, for 42vh | It scrolls up until its bottom is in view and holds there. Pinning its top would park the rest below the fold for the whole hold. |

That last column is the load-bearing part. Two sections over the film are both
transparent, so if a pinned one were still on screen when the next arrived they
would read through each other. Verified by walking the page in 61 steps and
checking that no two held sections' content boxes ever share a pixel.

The pinning itself lives in CSS under `@media (scripting: enabled)`, so the
no-JS render has no holds to unpin, and `prefers-reduced-motion` drops them.

**The damper.** `components/SmoothScroll.tsx` takes the wheel off the document.
Each notch adds to a target position and a `requestAnimationFrame` loop eases
the real scroll position toward it, so the page takes the movement up and puts
it down again. It drives the *native* scroll position rather than transforming
the page, which is what keeps `position: sticky` — and therefore the hold above
— along with anchors, IntersectionObserver, the scrollbar and find-in-page all
working. Anything that moves the page from outside the loop is detected and the
loop resynchronises to it instead of fighting it. A 900px wheel notch settles in
about 1.8 seconds.

Touch is taken over too. The finger drags the target directly — 1:1, at a much
lighter easing, because a drag is direct manipulation and the page has to stay
under the thumb — and on release the velocity it was carrying is projected
forward and handed to the same easing the wheel uses, so a flick coasts to a
stop with the weight of the rest of the site. That does replace the platform's
own momentum, which is the trade for having one feel on every device. A second
finger is left alone, and so is anything inside a control that scrolls itself.

**Both easings are measured in time, not in frames.** A fixed fraction per frame
means the page settles in half the time on a 120Hz screen and takes three times
as long on a machine dropping to 20fps — the feel would be whatever the hardware
happened to be doing. The per-frame figure is converted into the equivalent
share of however long the frame actually took.

## The hero

No photograph — the film is the picture. The hero is a statement, a lead, and
two actions, pinned over the board for the longest hold on the page.

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
ffmpeg -ss 2 -t 15 -i source.mp4 -vf "fps=20,scale=1920:1080:flags=lanczos" \
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
