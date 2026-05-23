import sharp from "sharp";

async function run() {
  const src = "public/images/products/pointed-flat.png";
  const img = sharp(src).ensureAlpha();
  const { width, height } = await img.metadata();
  const raw = await img.raw().toBuffer();

  // Dark pixels are shoe
  const isShoe = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return false;
    const idx = (y * width + x) * 4;
    const r = raw[idx];
    const g = raw[idx+1];
    const b = raw[idx+2];
    // Shoe is dark leather
    return r < 110 && g < 110 && b < 110;
  };

  // Find bounding box
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (isShoe(x, y)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`Shoe Bounding Box: X: ${minX}..${maxX}, Y: ${minY}..${maxY}`);

  // Trace the width profile of dark pixels
  console.log("\nShoe dark-pixel width column profile (sampling every 40px):");
  for (let x = minX; x <= maxX; x += 40) {
    let shoeHeight = 0;
    let firstY = -1;
    let lastY = -1;
    for (let y = minY; y <= maxY; y++) {
      if (isShoe(x, y)) {
        shoeHeight++;
        if (firstY === -1) firstY = y;
        lastY = y;
      }
    }
    if (shoeHeight > 0) {
      console.log(`x=${x} -> width=${shoeHeight} (y: ${firstY}..${lastY})`);
    }
  }
}

run().catch(console.error);
