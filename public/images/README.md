# Images

Every file in this folder is currently a **neutral placeholder plate**, not real
photography. They are mid-grey so they sit acceptably in both the light and the
dark theme until the real images land. Replace each one with the genuine image, keeping the **exact same
filename** — nothing in the code needs to change.

Images are rendered through `next/image` with `fill`, inside a wrapper that
already reserves the aspect ratio. That means:

- Any source aspect ratio works; the image is cropped to fit, centred.
- There is no layout shift while an image loads.
- AVIF/WebP variants and responsive sizes are generated automatically at build
  and request time — upload the **original, full-resolution** file and let the
  optimiser downscale it. Do not pre-compress.

## Files

| Filename                | Used in                       | Frame  | Suggested source              |
| ----------------------- | ----------------------------- | ------ | ----------------------------- |
| `project-unit.jpg`      | Hero, right column            | 4:5    | The complete unit, top view — sensor array on the printed base |
| `project-enclosure.jpg` | Projects — lead image         | 16:10  | The black printed enclosure with its lid and side intake port |
| `project-chamber.jpg`   | Projects — supporting, left   | 3:2    | The view into the sensing chamber through the intake port |
| `project-array.jpg`     | Projects — supporting, right  | 3:2    | A close view of the sensor array |
| `team-nurai.jpg`        | About section                 | 4:3    | Team or competition photo from NURAI 2026 |
| `founder.jpg`           | Founder — circular crop       | 1:1    | Portrait of Taha Jasim Mohammed |
| `og.png`                | Social preview card           | 1200×630 | Replace with a branded share card if you have one |

## Logo

The header, footer, and favicon use an **inline SVG omega monogram**
(`components/Logo.tsx`, `app/icon.svg`, `public/icon.svg`) so the mark costs no
network request and stays sharp at every size.

To use the official logo instead:

1. Drop the file here as `logo.svg` (preferred) or `logo.png`.
2. In `components/Logo.tsx`, replace the `<svg>` body with the official artwork,
   or swap the component for
   `<Image src="/images/logo.svg" alt="" width={32} height={32} />`.
3. Replace `app/icon.svg` and `public/icon.svg` with the logo mark so the browser
   tab and the web manifest match.

A single-colour mark that inherits `currentColor` will keep working on both the
light header and the dark footer band. A full-colour logo should be given a
fixed size and left as-is.

## Regenerating the placeholders

```bash
node scripts/gen-placeholders.mjs
```
