import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises";

async function run() {
  const src = "public/images/products/pointed-flat.png";
  const dst = "public/images/products/pointed-flat.png"; // We'll overwrite the original pointed flat
  
  const img = sharp(src).ensureAlpha();
  const { width, height } = await img.metadata();
  const raw = await img.raw().toBuffer();
  
  const out = Buffer.from(raw);
  
  // Left shoe (pointing left, tip around x=142, y=513)
  // Curve profile:
  // Center of left toe: y_center = 512
  // Flat front width: half is 30px (from y=482 to y=542)
  // Transition to natural shoe body: curves from x=165 to x=185
  const getLeftBound = (y) => {
    if (y < 377 || y > 649) return 0; // Out of shoe range
    
    const yCenter = 512;
    const wFront = 35; // flat front region y = 477..547
    
    if (y >= yCenter - wFront && y <= yCenter + wFront) {
      return 165; // flat vertical front
    } else if (y < yCenter - wFront) {
      // curves up to top shoe boundary (around y=377, x=185)
      const t = (yCenter - wFront - y) / (yCenter - wFront - 377);
      return 165 + 20 * t * t;
    } else {
      // curves down to bottom shoe boundary (around y=649, x=185)
      const t = (y - (yCenter + wFront)) / (649 - (yCenter + wFront));
      return 165 + 20 * t * t;
    }
  };

  // Right shoe (pointing right, tip around x=900, y=726)
  // Curve profile:
  // Center of right toe: y_center = 688
  // Flat front width: half is 20px (from y=668 to y=708)
  // Transition: curves from x=855 to x=825
  const getRightBound = (y) => {
    if (y < 598 || y > 736) return width; // Out of shoe range
    
    const yCenter = 688;
    const wFront = 15; // flat front region y = 673..703
    
    if (y >= yCenter - wFront && y <= yCenter + wFront) {
      return 855; // flat vertical front
    } else if (y < yCenter - wFront) {
      // curves up to top shoe boundary (around y=598, x=825)
      const t = (yCenter - wFront - y) / (yCenter - wFront - 598);
      return 855 - 30 * t * t;
    } else {
      // curves down to bottom shoe boundary (around y=736, x=825)
      const t = (y - (yCenter + wFront)) / (736 - (yCenter + wFront));
      return 855 - 30 * t * t;
    }
  };

  // Apply transformations
  for (let y = 0; y < height; y++) {
    // 1. Left shoe toe square-off (erase everything to the left of the boundary)
    const leftBound = getLeftBound(y);
    if (leftBound > 0) {
      for (let x = 0; x < leftBound; x++) {
        const idx = (y * width + x) * 4;
        
        // Inpaint background from x = 120 (stable background region on the left)
        const bgIdx = (y * width + 120) * 4;
        out[idx] = raw[bgIdx];
        out[idx+1] = raw[bgIdx+1];
        out[idx+2] = raw[bgIdx+2];
        out[idx+3] = raw[bgIdx+3];
      }
    }

    // 2. Right shoe toe square-off (erase everything to the right of the boundary)
    const rightBound = getRightBound(y);
    if (rightBound < width) {
      for (let x = rightBound; x < width; x++) {
        const idx = (y * width + x) * 4;
        
        // Inpaint background from x = 915 (stable background region on the right)
        const bgIdx = (y * width + 915) * 4;
        out[idx] = raw[bgIdx];
        out[idx+1] = raw[bgIdx+1];
        out[idx+2] = raw[bgIdx+2];
        out[idx+3] = raw[bgIdx+3];
      }
    }
  }

  const tmpDst = "public/images/products/pointed-flat-temp.png";

  // Save the result to a temp file first
  await sharp(out, {
    raw: {
      width,
      height,
      channels: 4
    }
  }).png().toFile(tmpDst);

  // Now rename the temp file to the original destination
  await fs.rename(tmpDst, dst);

  console.log(`✓ Overwrote pointed-flat.png with a gorgeous square-toe flat!`);
}

run().catch(console.error);
