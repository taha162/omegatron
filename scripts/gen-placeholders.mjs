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
  { file: "IMG_20260820_115933_632.JPG", width: 1600, height: 1067 },
  { file: "project-array.jpg", width: 1600, height: 1067 },
  { file: "team-nurai.jpg", width: 1600, height: 1200 },
  { file: "founder.jpg", width: 1200, height: 1600 },
];

const PAPER = "#a9aeb5";
const RULE = "#9ba1a9";
const MARK = "#7d848d";

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
  <g transform="translate(${tx} ${ty}) scale(${scale / 3.125})">
    <path d="M35.1 63.3 A26 26 0 1 1 64.9 63.3" fill="none" stroke="${MARK}" stroke-width="7"/>
    <path d="M14 66 H40 L50 75 L60 66 H86" fill="none" stroke="${MARK}" stroke-width="6"/>
    <path d="M50 10 V66" fill="none" stroke="#8a7c55" stroke-width="2.4"/>
    <circle cx="50" cy="7.5" r="3.2" fill="none" stroke="#8a7c55" stroke-width="2.2"/>
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
  <rect width="1200" height="630" fill="#0a0e14"/>
  <g transform="translate(96 175) scale(2.8)">
    <path d="M35.1 63.3 A26 26 0 1 1 64.9 63.3" fill="none" stroke="#c3ccd6" stroke-width="7"/>
    <path d="M14 66 H40 L50 75 L60 66 H86" fill="none" stroke="#c3ccd6" stroke-width="6"/>
    <path d="M50 10 V66" fill="none" stroke="#d9ae45" stroke-width="2.4"/>
    <circle cx="50" cy="7.5" r="3.2" fill="none" stroke="#d9ae45" stroke-width="2.2"/>
  </g>
  <rect x="96" y="452" width="120" height="3" fill="#d9ae45"/>
</svg>`);

await writeFile(path.join(OUT, "og.png"), await sharp(og).png({ compressionLevel: 9 }).toBuffer());
console.log("og.png  1200×630");
