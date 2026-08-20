# Images

These are the team's own photographs. They are rendered through `next/image`
with `fill`, inside a wrapper that already reserves the aspect ratio, so any
source ratio works and nothing shifts as they load. Upload originals at full
resolution — AVIF/WebP variants and responsive sizes are generated
automatically.

| File | Shown in | Frame | Content |
| --- | --- | --- | --- |
| `project-array.jpg` | Hero, right column | 4:3 | The complete unit with the sensor array on top |
| `project-enclosure.jpg` | Projects — lead image | 16:10 | Inside the sensing chamber, seen through the intake port |
| `project-chamber.jpg` | Projects — supporting, left | 3:2 | The printed enclosure and its side intake port |
| `project-array.jpg` | Projects — supporting, right | 3:2 | The unit on the bench |
| `founder.jpg` | Founder portrait | 4:5, focus 50%/34% | Taha at the whiteboard |
| `team-nurai.jpg` | Source for `og.png` | — | The official logo artwork |
| `og.png` | Social share card | 1200x630 | Generated from `team-nurai.jpg` |

Note that `project-enclosure.jpg` and `project-chamber.jpg` are named the
opposite way round to what they show; the alt text in `app/[lang]/page.tsx`
follows the actual content, not the filename.

## Video

`public/media/` holds the film that runs behind the page from the hero to the
founder — four encodes (1080/720 x H.264/VP9) plus a poster. See "The film" in
the root README for how it is cut, why the GOP is six frames, and how the
browser is made to fetch exactly one of the four.

## Logo

The header, footer, and favicon use inline SVG (`components/Logo.tsx`,
`app/icon.svg`, `public/icon.svg`), redrawn from the official mark so it costs
no request and inherits its colour from the palette. The same wordmark is
composited onto the processor in the film.
