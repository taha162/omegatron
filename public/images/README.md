# Images

These are the team's own photographs. They are rendered through `next/image`
with `fill`, inside a wrapper that already reserves the aspect ratio, so any
source ratio works and nothing shifts as they load. Upload originals at full
resolution — AVIF/WebP variants and responsive sizes are generated
automatically.

| File | Shown in | Frame | Content |
| --- | --- | --- | --- |
| `project-enclosure.jpg` | Projects — lead image | 16:10 | Inside the sensing chamber, seen through the intake port |
| `project-chamber.jpg` | Projects — supporting, left | 3:2 | The printed enclosure and its side intake port |
| `project-array.jpg` | Projects — supporting, right | 3:2 | The unit on the bench |
| `founder.jpg` | Founder portrait | 4:5, focus 50%/34% | Taha at the whiteboard |
| `team-nurai.jpg` | not rendered on the site | — | The official logo artwork, kept as a source file |
| `og-ar.png` | Arabic social share card | 1200x630 | Drawn as flat colour and type — 29 KB |
| `og-en.png` | English social share card | 1200x630 | Drawn as flat colour and type — 36 KB |

Note that `project-enclosure.jpg` and `project-chamber.jpg` are named the
opposite way round to what they show; the alt text in `app/[lang]/page.tsx`
follows the actual content, not the filename.

The share cards are metadata images: nothing optimises them on the way out, so
they are drawn rather than exported from a photograph. Both are rendered from
the same design as the site — the needle rail, the graticule, the wordmark. To
change them, edit the copy and re-render at 1200x630.

## Video

`public/media/` holds the film that runs in the hero — one 1080p H.264 encode,
one 720p VP9 fallback for browsers without H.264, and a 48 KB poster. The poster
is the picture by default; the footage is only fetched on a wide viewport, on an
unmetered connection, and never under reduced motion. See "The film" in the root
README.

The hero carries no photograph; the film is the picture there.

## Logo

The header, footer, and favicon use inline SVG (`components/Logo.tsx`,
`app/icon.svg`, `public/icon.svg`), redrawn from the official mark so it costs
no request and inherits its colour from the palette.
