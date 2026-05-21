import sharp from "sharp";
import path from "node:path";

const productsDir = "public/images/products";

async function colorize(sourceName, targetName) {
  const srcPath = path.join(productsDir, sourceName);
  const dstPath = path.join(productsDir, targetName);
  
  console.log(`Colorizing ${sourceName} → ${targetName} with advanced dual-tone mapping...`);
  
  // Ensure we load the image with an alpha channel (4 channels: RGBA)
  const img = sharp(srcPath).ensureAlpha();
  const { width, height } = await sharp(srcPath).metadata();
  
  const raw = await img.raw().toBuffer();
  
  // Create output buffer
  const out = Buffer.alloc(raw.length);
  
  // Perfect rich espresso brown color
  const cr = 64;  // Red
  const cg = 38;  // Green
  const cb = 24;  // Blue
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = raw[idx];
      const g = raw[idx+1];
      const b = raw[idx+2];
      const a = raw[idx+3];
      
      const maxVal = Math.max(r, g, b);
      
      // Calculate shoe mask 'm' (1 = shoe, 0 = background)
      let m = 0;
      if (maxVal <= 130) {
        m = 1.0;
      } else if (maxVal >= 205) {
        m = 0.0;
      } else {
        m = (205 - maxVal) / (205 - 130);
      }
      
      // Calculate luminance Y for dual-tone mapping
      const Y = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      
      // Map grayscale to dual-tone (espresso brown)
      let tr, tg, tb;
      if (Y < 128) {
        tr = (Y / 128) * cr;
        tg = (Y / 128) * cg;
        tb = (Y / 128) * cb;
      } else {
        tr = cr + ((Y - 128) / 127) * (255 - cr);
        tg = cg + ((Y - 128) / 127) * (255 - cg);
        tb = cb + ((Y - 128) / 127) * (255 - cb);
      }
      
      // Interpolate between original pixel and tinted pixel based on mask 'm'
      out[idx]   = Math.round(r * (1 - m) + tr * m);
      out[idx+1] = Math.round(g * (1 - m) + tg * m);
      out[idx+2] = Math.round(b * (1 - m) + tb * m);
      out[idx+3] = a;
    }
  }
  
  // Write the colorized image to file
  await sharp(out, {
    raw: {
      width,
      height,
      channels: 4
    }
  }).png().toFile(dstPath);
  
  console.log(`✓ Successfully saved colorized shoe to ${targetName}`);
}

async function run() {
  await colorize("pointed-flat.png", "mule-no4.png");
  await colorize("pointed-flat-detail.png", "mule-no4-detail.png");
}

run().catch(console.error);
