// Rebuild three detail images that were exact byte-duplicates of their
// hero shots. Approach: take the hero image, crop to a tight macro
// region that highlights the fabric / construction language of the
// piece, then nudge tone so it reads as a study rather than a copy.
//
// Designed to keep the SHOLÉ collection visual language: warm-cream
// editorial backgrounds, soft natural light, single-tone palette
// dominant per garment.

import path from "node:path";
import fs from "node:fs/promises";
import sharp from "sharp";

const productsDir = path.resolve("public/images/products");

async function detailFromHero({ source, target, region, modulate, sharpen }) {
  const src = path.join(productsDir, source);
  const dst = path.join(productsDir, target);
  console.log(`→ ${source}  →  ${target}`);

  const meta = await sharp(src).metadata();
  const W = meta.width ?? 1024;
  const H = meta.height ?? 1024;

  let left = Math.round(W * region.left);
  let top = Math.round(H * region.top);
  let width = Math.round(W * region.width);
  let height = Math.round(H * region.height);
  // Clamp so cropping never falls off the source canvas (rounding can
  // push left+width or top+height one pixel past the image bound).
  if (left + width > W) width = W - left;
  if (top + height > H) height = H - top;

  let pipe = sharp(src).extract({ left, top, width, height });
  // Resize the crop back up to a square so the detail card matches the
  // aspect ratio of every other detail image in the collection.
  pipe = pipe.resize(1024, 1024, { fit: "cover" });
  if (modulate) pipe = pipe.modulate(modulate);
  if (sharpen) pipe = pipe.sharpen(sharpen);
  await pipe.toFile(dst);
}

await detailFromHero({
  source: "soft-bomber.png",
  target: "soft-bomber-detail.png",
  // Pure fabric macro: the rolled left cuff against the body of the
  // jacket. No face, no hands — just cream silk weave + cuff fold.
  region: { left: 0.27, top: 0.62, width: 0.16, height: 0.16 },
  modulate: { brightness: 1.05, saturation: 0.96, hue: 3 },
  sharpen: { sigma: 0.5 },
});

await detailFromHero({
  source: "sun-up-scarf.png",
  target: "sun-up-scarf-detail.png",
  // Tight on a single silk fold so the saffron tone fills the frame —
  // the way the existing sun-up-knit-detail does for the knit.
  region: { left: 0.34, top: 0.3, width: 0.26, height: 0.26 },
  modulate: { brightness: 1.04, saturation: 1.15, hue: -3 },
  sharpen: { sigma: 0.7 },
});

await detailFromHero({
  source: "atelier-mini.png",
  target: "atelier-mini-detail.png",
  // Espresso wool surface of the skirt, including the side seam — pure
  // textile, no body visible.
  region: { left: 0.42, top: 0.44, width: 0.14, height: 0.14 },
  modulate: { brightness: 0.95, saturation: 1.1, hue: 2 },
  sharpen: { sigma: 0.7 },
});

console.log("\ndone — three detail images rebuilt.");
