import sharp from "sharp";
import fs from "node:fs/promises";

async function run() {
  const src = "public/images/products/pointed-flat.png";
  const img = sharp(src).ensureAlpha();
  const { width, height } = await img.metadata();
  const raw = await img.raw().toBuffer();

  // Dark pixels are black shoe leather
  const isShoe = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return false;
    const idx = (y * width + x) * 4;
    return raw[idx] < 115 && raw[idx+1] < 115 && raw[idx+2] < 115;
  };

  const S = 160; // Crop size: 160x160

  // Compute Sobel gradients
  const gradient = new Float32Array(width * height);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (isShoe(x, y)) {
        const getVal = (px, py) => {
          const pidx = (py * width + px) * 4;
          return 0.299 * raw[pidx] + 0.587 * raw[pidx+1] + 0.114 * raw[pidx+2];
        };

        const gx = (getVal(x+1, y-1) + 2*getVal(x+1, y) + getVal(x+1, y+1)) - 
                   (getVal(x-1, y-1) + 2*getVal(x-1, y) + getVal(x-1, y+1));
        const gy = (getVal(x-1, y+1) + 2*getVal(x, y+1) + getVal(x+1, y+1)) - 
                   (getVal(x-1, y-1) + 2*getVal(x, y-1) + getVal(x+1, y-1));
        
        gradient[y * width + x] = Math.sqrt(gx * gx + gy * gy);
      }
    }
  }

  let bestX = 0;
  let bestY = 0;
  let minMaxGradient = Infinity;
  let bestAvgGradient = Infinity;
  let selectedAvgLuminance = 0;

  // Search boundaries (focus on the main bodies of the shoes, avoiding sole edges and background)
  const startX = Math.round(width * 0.22);
  const endX = Math.round(width * 0.78) - S;
  const startY = Math.round(height * 0.35);
  const endY = Math.round(height * 0.78) - S;

  for (let y = startY; y < endY; y += 5) {
    for (let x = startX; x < endX; x += 5) {
      // Check if 100% shoe with safety margin
      let isFullyShoe = true;
      const margin = 12;
      for (let dy = -margin; dy < S + margin; dy += 6) {
        for (let dx = -margin; dx < S + margin; dx += 6) {
          if (!isShoe(x + dx, y + dy)) {
            isFullyShoe = false;
            break;
          }
        }
        if (!isFullyShoe) break;
      }

      if (!isFullyShoe) continue;

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

      // Black leather shade is beautifully represented in the 22 to 50 luminance range.
      // Make sure it has a rich tone (not in deep pitch-black shadows where there's no visible grain).
      if (avgLum >= 24 && avgLum <= 48) {
        if (maxGrad < minMaxGradient) {
          minMaxGradient = maxGrad;
          bestAvgGradient = avgGrad;
          bestX = x;
          bestY = y;
          selectedAvgLuminance = avgLum;
        } else if (Math.abs(maxGrad - minMaxGradient) < 0.8 && avgGrad < bestAvgGradient) {
          bestAvgGradient = avgGrad;
          bestX = x;
          bestY = y;
          selectedAvgLuminance = avgLum;
        }
      }
    }
  }

  if (minMaxGradient === Infinity) {
    console.log("No perfect region found. Trying relaxed range...");
    // Relax criteria if needed
    for (let y = startY; y < endY; y += 10) {
      for (let x = startX; x < endX; x += 10) {
        let isFullyShoe = true;
        for (let dy = 0; dy < S; dy += 10) {
          for (let dx = 0; dx < S; dx += 10) {
            if (!isShoe(x + dx, y + dy)) {
              isFullyShoe = false;
              break;
            }
          }
          if (!isFullyShoe) break;
        }
        if (!isFullyShoe) continue;

        let maxGrad = 0;
        let sumGrad = 0;
        let sumLum = 0;
        let count = 0;
        for (let dy = 0; dy < S; dy++) {
          for (let dx = 0; dx < S; dx++) {
            const px = x + dx;
            const py = y + dy;
            const gradVal = gradient[py * width + px];
            if (gradVal > maxGrad) maxGrad = gradVal;
            sumGrad += gradVal;
            const idx = (py * width + px) * 4;
            sumLum += 0.299 * raw[idx] + 0.587 * raw[idx+1] + 0.114 * raw[idx+2];
            count++;
          }
        }
        const avgLum = sumLum / count;
        if (avgLum >= 18 && avgLum <= 60) {
          const avgGrad = sumGrad / count;
          if (maxGrad < minMaxGradient) {
            minMaxGradient = maxGrad;
            bestAvgGradient = avgGrad;
            bestX = x;
            bestY = y;
            selectedAvgLuminance = avgLum;
          }
        }
      }
    }
  }

  console.log(`\nSeamless Black Leather Region Found:`);
  console.log(`X: ${bestX} (relative left: ${(bestX / width).toFixed(4)})`);
  console.log(`Y: ${bestY} (relative top: ${(bestY / height).toFixed(4)})`);
  console.log(`Size: ${S}x${S} (relative size: ${(S / width).toFixed(4)})`);
  console.log(`Max Gradient: ${minMaxGradient.toFixed(4)}`);
  console.log(`Avg Gradient: ${bestAvgGradient.toFixed(4)}`);
  console.log(`Avg Luminance: ${selectedAvgLuminance.toFixed(2)}`);

  const dst = "public/images/products/pointed-flat-detail.png";
  
  // Use fs to write to a temp file, then rename to avoid sharp locking issues
  const tmpDst = "public/images/products/pointed-flat-detail-temp.png";
  await sharp(src)
    .extract({ left: bestX, top: bestY, width: S, height: S })
    .resize(1024, 1024, { fit: "cover" })
    .sharpen({ sigma: 0.6 })
    .toFile(tmpDst);

  await fs.rename(tmpDst, dst);

  console.log(`\n✓ Seamless black leather crop successfully saved to ${dst}!`);
}

run().catch(console.error);
