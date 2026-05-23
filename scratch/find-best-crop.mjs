import sharp from "sharp";

async function run() {
  const src = "public/images/products/mule-no4.png";
  const img = sharp(src).ensureAlpha();
  const { width, height } = await img.metadata();
  const raw = await img.raw().toBuffer();

  console.log(`Image dimensions: ${width}x${height}`);

  // Define shoe mask (R, G, B are dark, not the cream background)
  // Cream bg is R > 215, G > 205, B > 195
  const isShoe = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return false;
    const idx = (y * width + x) * 4;
    const r = raw[idx];
    const g = raw[idx+1];
    const b = raw[idx+2];
    const isBg = r > 210 && g > 200 && b > 190;
    return !isBg;
  };

  // We want to find a square region of size S x S
  const S = Math.round(width * 0.15); // around 15% of width, which is about 154 pixels if 1024x1024
  console.log(`Target crop size: ${S}x${S}`);

  let bestX = 0;
  let bestY = 0;
  let minVariance = Infinity;
  let bestShoeFraction = 0;

  // Let's scan potential regions.
  // We want to prioritize the foreground shoe, which is typically in the middle/lower half.
  const startX = Math.round(width * 0.2);
  const endX = Math.round(width * 0.8) - S;
  const startY = Math.round(height * 0.3);
  const endY = Math.round(height * 0.8) - S;

  for (let y = startY; y < endY; y += 10) {
    for (let x = startX; x < endX; x += 10) {
      // 1. Calculate how much of this block is shoe
      let shoePixels = 0;
      let sumLuminance = 0;
      const luminances = [];

      for (let dy = 0; dy < S; dy++) {
        for (let dx = 0; dx < S; dx++) {
          const px = x + dx;
          const py = y + dy;
          if (isShoe(px, py)) {
            shoePixels++;
            const idx = (py * width + px) * 4;
            const r = raw[idx];
            const g = raw[idx+1];
            const b = raw[idx+2];
            const Y = 0.299 * r + 0.587 * g + 0.114 * b;
            sumLuminance += Y;
            luminances.push(Y);
          }
        }
      }

      const totalPixels = S * S;
      const shoeFraction = shoePixels / totalPixels;

      // We want a region that is 100% shoe
      if (shoeFraction > 0.99) {
        // Calculate variance of luminance to find the smoothest region (least texture detail / stitches)
        const avg = sumLuminance / shoePixels;
        let sumSqDiff = 0;
        for (const Y of luminances) {
          sumSqDiff += (Y - avg) * (Y - avg);
        }
        const variance = sumSqDiff / shoePixels;

        // Also check if it's too dark (we don't want absolute shadow near the sole or background)
        // Average luminance of espresso is around Y = 40-70. Let's make sure avg is in a good range.
        if (avg > 35 && avg < 80) {
          if (variance < minVariance) {
            minVariance = variance;
            bestX = x;
            bestY = y;
            bestShoeFraction = shoeFraction;
          }
        }
      }
    }
  }

  if (minVariance === Infinity) {
    console.log("No 100% shoe region found. Trying relaxed shoe fraction (0.95)...");
    // Relax criteria just in case
    for (let y = startY; y < endY; y += 10) {
      for (let x = startX; x < endX; x += 10) {
        let shoePixels = 0;
        let sumLuminance = 0;
        const luminances = [];
        for (let dy = 0; dy < S; dy++) {
          for (let dx = 0; dx < S; dx++) {
            const px = x + dx;
            const py = y + dy;
            if (isShoe(px, py)) {
              shoePixels++;
              const idx = (py * width + px) * 4;
              const r = raw[idx];
              const g = raw[idx+1];
              const b = raw[idx+2];
              const Y = 0.299 * r + 0.587 * g + 0.114 * b;
              sumLuminance += Y;
              luminances.push(Y);
            }
          }
        }
        const shoeFraction = shoePixels / (S * S);
        if (shoeFraction > 0.95) {
          const avg = sumLuminance / shoePixels;
          let sumSqDiff = 0;
          for (const Y of luminances) {
            sumSqDiff += (Y - avg) * (Y - avg);
          }
          const variance = sumSqDiff / shoePixels;
          if (avg > 30 && avg < 90) {
            if (variance < minVariance) {
              minVariance = variance;
              bestX = x;
              bestY = y;
              bestShoeFraction = shoeFraction;
            }
          }
        }
      }
    }
  }

  console.log(`\nBest Region Found:`);
  console.log(`X: ${bestX} (relative left: ${(bestX / width).toFixed(4)})`);
  console.log(`Y: ${bestY} (relative top: ${(bestY / height).toFixed(4)})`);
  console.log(`Size: ${S}x${S} (relative size: ${(S / width).toFixed(4)})`);
  console.log(`Variance: ${minVariance.toFixed(4)}`);
  console.log(`Shoe Fraction: ${(bestShoeFraction * 100).toFixed(1)}%`);
}

run().catch(console.error);
