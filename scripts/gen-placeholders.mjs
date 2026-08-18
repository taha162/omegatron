/**
 * Regenerates the placeholder plates in `public/images`.
 *
 * These exist only so the layout is complete before the real photography is
 * dropped in — replace the files with the genuine images (same filenames) and
 * this script never needs to run again. It uses `sharp`, which ships with Next
 * for image optimisation.
 *
 *   node scripts/gen-placeholders.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT = path.join(process.cwd(), "public", "images");

const PLATES = [
  { file: "project-unit.jpg", width: 1200, height: 1500 },
  { file: "project-enclosure.jpg", width: 1600, height: 1067 },
  { file: "project-chamber.jpg", width: 1600, height: 1067 },
  { file: "project-array.jpg", width: 1600, height: 1067 },
  { file: "team-nurai.jpg", width: 1600, height: 1200 },
  { file: "founder.jpg", width: 1200, height: 1600 },
];

const PAPER = "#efece6";
const RULE = "#dcd7ce";
const MARK = "#c9c2b7";

function plate(width, height) {
  const step = Math.round(Math.min(width, height) / 8);
  const lines = [];

  for (let x = step; x < width; x += step) {
    lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="${RULE}" stroke-width="1"/>`);
  }
  for (let y = step; y < height; y += step) {
    lines.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${RULE}" stroke-width="1"/>`);
  }

  const size = Math.round(Math.min(width, height) * 0.22);
  const scale = size / 32;
  const tx = (width - size) / 2;
  const ty = (height - size) / 2;
  const tick = Math.round(Math.min(width, height) * 0.05);
  const inset = Math.round(Math.min(width, height) * 0.04);

  const corners = [
    `M${inset} ${inset + tick}V${inset}H${inset + tick}`,
    `M${width - inset - tick} ${inset}H${width - inset}V${inset + tick}`,
    `M${inset} ${height - inset - tick}V${height - inset}H${inset + tick}`,
    `M${width - inset - tick} ${height - inset}H${width - inset}V${height - inset - tick}`,
  ]
    .map((d) => `<path d="${d}" fill="none" stroke="${MARK}" stroke-width="2"/>`)
    .join("");

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" fill="${PAPER}"/>
  ${lines.join("")}
  ${corners}
  <g transform="translate(${tx} ${ty}) scale(${scale})">
    <path d="M6.4 26h6.2C8.6 23.4 6.2 19.5 6.2 15 6.2 9.2 10.4 5 16 5s9.8 4.2 9.8 10c0 4.5-2.4 8.4-6.4 11h6.2"
          fill="none" stroke="${MARK}" stroke-width="2.4" stroke-linecap="square"/>
  </g>
</svg>`);
}

await mkdir(OUT, { recursive: true });

for (const { file, width, height } of PLATES) {
  const buffer = await sharp(plate(width, height)).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  await writeFile(path.join(OUT, file), buffer);
  console.log(`${file}  ${width}×${height}  ${(buffer.length / 1024).toFixed(0)} KB`);
}

// Open Graph card, 1200×630.
const og = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#101418"/>
  <g transform="translate(96 220) scale(3.4)">
    <path d="M6.4 26h6.2C8.6 23.4 6.2 19.5 6.2 15 6.2 9.2 10.4 5 16 5s9.8 4.2 9.8 10c0 4.5-2.4 8.4-6.4 11h6.2"
          fill="none" stroke="#f7f6f3" stroke-width="2.4" stroke-linecap="square"/>
  </g>
  <rect x="96" y="420" width="120" height="3" fill="#a9561e"/>
</svg>`);

await writeFile(path.join(OUT, "og.png"), await sharp(og).png({ compressionLevel: 9 }).toBuffer());
console.log("og.png  1200×630");
