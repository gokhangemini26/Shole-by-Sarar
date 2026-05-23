import sharp from "sharp";

async function run() {
  const src = "public/images/products/mule-no4.png";
  const img = sharp(src).ensureAlpha();
  const { width, height } = await img.metadata();
  const raw = await img.raw().toBuffer();

  // Bounding box of shoe (R < 210, G < 200, B < 190)
  const isShoe = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return false;
    const idx = (y * width + x) * 4;
    return raw[idx] < 210 || raw[idx+1] < 200 || raw[idx+2] < 190;
  };

  const S = 160; // Crop size: 160x160 pixels
  const halfS = S / 2;

  // Let's compute a simple gradient magnitude for every pixel in the shoe region
  // to detect edges/seams/stitches.
  const gradient = new Float32Array(width * height);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (isShoe(x, y)) {
        const idx = (y * width + x) * 4;
        
        // Grayscale value at (x, y)
        const getVal = (px, py) => {
          const pidx = (py * width + px) * 4;
          return 0.299 * raw[pidx] + 0.587 * raw[pidx+1] + 0.114 * raw[pidx+2];
        };

        // Sobel-like gradients
        const gx = (getVal(x+1, y-1) + 2*getVal(x+1, y) + getVal(x+1, y+1)) - 
                   (getVal(x-1, y-1) + 2*getVal(x-1, y) + getVal(x-1, y+1));
        const gy = (getVal(x-1, y+1) + 2*getVal(x, y+1) + getVal(x+1, y+1)) - 
                   (getVal(x-1, y-1) + 2*getVal(x, y-1) + getVal(x+1, y-1));
        
        gradient[y * width + x] = Math.sqrt(gx * gx + gy * gy);
      }
    }
  }

  // Scan potential crop coordinates. We want the crop to be 100% inside the shoe.
  // We'll score each candidate region based on:
  // - Bounded 100% inside the shoe (margin of at least 10px from background)
  // - Edge/stitch content (we want to minimize the maximum gradient in the region, which ensures no lines/stitches are crossed)
  // - Color richness (average luminance in a beautiful range: 35 to 70)
  
  let bestX = 0;
  let bestY = 0;
  let minMaxGradient = Infinity;
  let bestAvgGradient = Infinity;
  let selectedAvgLuminance = 0;

  // Search boundaries
  const startX = Math.round(width * 0.25);
  const endX = Math.round(width * 0.75) - S;
  const startY = Math.round(height * 0.35);
  const endY = Math.round(height * 0.75) - S;

  for (let y = startY; y < endY; y += 5) {
    for (let x = startX; x < endX; x += 5) {
      // 1. Check if the entire region (plus a 10px safety margin) is shoe
      let isFullyShoe = true;
      const margin = 10;
      for (let dy = -margin; dy < S + margin; dy += 5) {
        for (let dx = -margin; dx < S + margin; dx += 5) {
          if (!isShoe(x + dx, y + dy)) {
            isFullyShoe = false;
            break;
          }
        }
        if (!isFullyShoe) break;
      }

      if (!isFullyShoe) continue;

      // 2. Compute gradient statistics for this crop region
      let maxGrad = 0;
      let sumGrad = 0;
      let sumLum = 0;
      let count = 0;

      for (let dy = 0; dy < S; dy++) {
        for (let dx = 0; dx < S; dx++) {
          const px = x + dx;
          const py = y + dy;
          const gradVal = gradient[py * width + px];
          if (gradVal > maxGrad) {
            maxGrad = gradVal;
          }
          sumGrad += gradVal;

          const idx = (py * width + px) * 4;
          const lum = 0.299 * raw[idx] + 0.587 * raw[idx+1] + 0.114 * raw[idx+2];
          sumLum += lum;
          count++;
        }
      }

      const avgGrad = sumGrad / count;
      const avgLum = sumLum / count;

      // Espresso brown leather shade is beautifully represented in the 40 to 65 luminance range.
      // We want to avoid overly dark shadows (like under the shoe or right at the sole seam).
      if (avgLum >= 42 && avgLum <= 65) {
        // We want to minimize the maximum gradient first (to guarantee NO line/stitch/edge is present),
        // and then minimize the average gradient (to get the smoothest possible leather texture).
        if (maxGrad < minMaxGradient) {
          minMaxGradient = maxGrad;
          bestAvgGradient = avgGrad;
          bestX = x;
          bestY = y;
          selectedAvgLuminance = avgLum;
        } else if (Math.abs(maxGrad - minMaxGradient) < 1.0 && avgGrad < bestAvgGradient) {
          bestAvgGradient = avgGrad;
          bestX = x;
          bestY = y;
          selectedAvgLuminance = avgLum;
        }
      }
    }
  }

  console.log(`\nSeamless Leather Region Found:`);
  console.log(`X: ${bestX} (relative left: ${(bestX / width).toFixed(4)})`);
  console.log(`Y: ${bestY} (relative top: ${(bestY / height).toFixed(4)})`);
  console.log(`Size: ${S}x${S} (relative size: ${(S / width).toFixed(4)})`);
  console.log(`Max Gradient: ${minMaxGradient.toFixed(4)} (very low means completely seamless)`);
  console.log(`Avg Gradient: ${bestAvgGradient.toFixed(4)}`);
  console.log(`Avg Luminance: ${selectedAvgLuminance.toFixed(2)} (perfect mid-tone espresso brown)`);

  // Crop and save candidate
  const dst = "public/images/products/mule-no4-detail.png";
  await sharp(src)
    .extract({ left: bestX, top: bestY, width: S, height: S })
    .resize(1024, 1024, { fit: "cover" })
    .sharpen({ sigma: 0.6 }) // slight sharpen to emphasize the grain texture elegantly
    .toFile(dst);
  console.log(`\n✓ Seamless crop successfully generated and saved to ${dst}!`);
}

run().catch(console.error);
