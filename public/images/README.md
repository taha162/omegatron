# Images

These are the team's own photographs. They are rendered through `next/image`
with `fill`, inside a wrapper that already reserves the aspect ratio, so any
source ratio works and nothing shifts as they load. Upload originals at full
resolution — AVIF/WebP variants and responsive sizes are generated
automatically.

| File | Shown in | Frame | Content |
| --- | --- | --- | --- |
| `project-enclosure.jpg` | Projects — first plate on the strip | 4:3 | Inside the sensing chamber, seen through the intake port |
| `project-chamber.jpg` | Projects — second plate | 4:3 | The printed enclosure and its side intake port |
| `project-array.jpg` | Projects — third plate | 4:3 | The unit on the bench |
| `founder.jpg` | Founder route and home teaser | 4:5, focus 50%/28% | Taha at the whiteboard |
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

`public/media/` holds the film that runs in the hero: three H.264 tiers cut
all-intra for scrubbing (1080p / 720p / 540p), one VP9 fallback for browsers
without H.264, and a 50 KB poster. The poster is the picture until the footage
arrives; the footage is fetched only after the page has loaded, and never under
reduced motion. See "The film" in the root README for the ladder and why every
frame is a keyframe.

The hero carries no photograph; the film is the picture there.

## Logo

The header, footer, and favicon use inline SVG (`components/Logo.tsx`,
`app/icon.svg`, `public/icon.svg`), redrawn from the official mark so it costs
no request and inherits its colour from the palette.
