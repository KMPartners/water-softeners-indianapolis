/**
 * Hero plate pipeline. A CLIENT ASSET BUILD, run by hand, not by `npm run build`.
 *
 * Takes the licensed source photos in assets/hero-src/ and emits the responsive,
 * grayscale, heavily-compressed plates the brand layer paints into each hero.
 *
 * ── Why grayscale ──────────────────────────────────────────────────────────
 * The plate carries LUMINANCE only; the hue comes from the brand tokens at
 * runtime (brand.css blends the plate against --slab-field). Three consequences,
 * all of them the reason this is not a baked duotone:
 *   1. Re-skinning the client (new --accent) re-tints every hero automatically.
 *      A baked teal photo would have to be re-exported by hand and would quietly
 *      drift out of sync with colors.css.
 *   2. A grayscale AVIF of a low-contrast image is roughly 40% the size of the
 *      colour one. The hero is the LCP element on a phone on mobile data.
 *   3. One source photo can serve a differently-branded site unchanged, which is
 *      what makes this a starter asset rather than a one-off.
 *
 * ── Why two crops and not one resize ───────────────────────────────────────
 * A hero is wide-and-short on desktop and tall-and-narrow on a phone. Resizing
 * one landscape plate to a phone throws away the subject and keeps the empty
 * edges. These are ART-DIRECTED crops: the mobile plate is cropped to the part
 * of the frame that still reads at 390px wide.
 *
 * CONSEQUENCE of skipping this script: the sources in assets/hero-src/ are not
 * served to anyone. public/img/hero/ is the only thing the site loads, and it is
 * committed, so a normal `npm run build` never needs sharp at all.
 *
 * Usage:  node scripts/build-hero-plates.mjs
 */
import sharp from 'sharp';
import { mkdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'assets', 'hero-src');
const OUT = join(ROOT, 'public', 'img', 'hero');

/**
 * Each plate names its source, its licence, and the grade it needs.
 *
 * `linear(mul, add)` sets the plate's key BEFORE compression. Grading here
 * rather than with a CSS filter means the shipped bytes are already dark, which
 * is both smaller (less entropy) and free at paint time (a runtime filter on a
 * full-bleed element is a per-frame GPU cost on exactly the device that can
 * least afford it).
 */
const PLATES = [
  {
    name: 'caustics',
    src: 'pexels-9866870.jpg',
    credit: 'Pexels (Pexels License: free commercial use, no attribution required)',
    note: 'Homepage. Light refracted through moving water: the most presence of the three, because the homepage hero is the one screen that has to establish the category.',
    // Lift the mids so the net survives the blend, then clip the top so no
    // highlight competes with the white H1.
    //
    // The blur is not a compromise, it is the point. A caustic web is very
    // high-frequency detail; at the opacity this plate actually renders, that
    // detail is invisible to a reader but expensive twice over: it is most of
    // the AVIF bitrate (64kB sharp vs 39kB softened) and it shimmers against
    // the pixel grid while the hero scrolls. Softening it buys back both.
    grade: { mul: 0.70, add: -10, blur: 1.1 },
    desktop: { w: 1600, h: 760, pos: 'centre' },
    mobile: { w: 900, h: 860, pos: 'centre' },
  },
  {
    name: 'surface',
    src: 'pexels-28011161.jpg',
    credit: 'Pexels (Pexels License: free commercial use, no attribution required)',
    note: 'Money pages. Near-black water with faint silver crests. Deliberately the quietest plate: these pages carry the offer, so the photograph must not compete with the H1 or the quote CTA.',
    grade: { mul: 0.74, add: -10 },
    desktop: { w: 1600, h: 620, pos: 'centre' },
    mobile: { w: 900, h: 700, pos: 'centre' },
  },
  {
    name: 'ripple',
    src: 'pexels-12810804.jpg',
    credit: 'Pexels (Pexels License: free commercial use, no attribution required)',
    note: 'Supporting guides. An even, all-over ripple with no focal point, which is exactly what a guide hero wants: enough texture to separate an informational page from a money page at a glance, and nothing for the eye to stop on instead of the question in the H1.',
    // A concentric-ring frame was the first choice here and was dropped: the
    // only crop that actually contained the rings also contained floating
    // debris, which at plate opacity reads as dirt on the lens rather than as
    // water. An even texture has no such crop to get wrong.
    grade: { mul: 0.55, add: -16, blur: 0.9 },
    desktop: { w: 1600, h: 560, pos: 'centre' },
    mobile: { w: 900, h: 640, pos: 'centre' },
  },
];

if (!existsSync(SRC)) {
  console.error(`No source directory: ${SRC}\nDrop the licensed originals there first.`);
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

const kb = (p) => (statSync(p).size / 1024).toFixed(1) + 'kB';
let total = 0;

for (const plate of PLATES) {
  for (const [variant, crop] of [['desktop', plate.desktop], ['mobile', plate.mobile]]) {
    let base = sharp(join(SRC, plate.src))
      .resize(crop.w, crop.h, { fit: 'cover', position: crop.pos })
      .grayscale()
      .linear(plate.grade.mul, plate.grade.add);
    if (plate.grade.blur) base = base.blur(plate.grade.blur);

    const stem = `${plate.name}-${variant}`;
    // AVIF is the primary. WebP exists only for Safari 15.4-16.3, which can do
    // the :has() the brand layer uses but cannot decode AVIF.
    const avif = join(OUT, `${stem}.avif`);
    const webp = join(OUT, `${stem}.webp`);
    await base.clone().avif({ quality: 42, effort: 9, chromaSubsampling: '4:2:0' }).toFile(avif);
    await base.clone().webp({ quality: 62, effort: 6 }).toFile(webp);

    total += statSync(avif).size;
    console.log(`  ${stem.padEnd(18)} ${crop.w}x${crop.h}  avif ${kb(avif).padStart(8)}   webp ${kb(webp).padStart(8)}`);
  }
}

console.log(`\nAVIF total across all six plates: ${(total / 1024).toFixed(1)}kB`);
console.log('Any ONE page loads exactly one of them.');
