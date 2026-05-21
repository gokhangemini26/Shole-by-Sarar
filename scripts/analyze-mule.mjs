import sharp from "sharp";

async function run() {
  const img = sharp("public/images/products/mule-no4.png");
  const { width, height } = await img.metadata();
  const raw = await img.raw().toBuffer();
  
  // Find bounding box of non-background (non-cream) pixels
  // Cream background is roughly R > 200, G > 190, B > 180
  let minX = width, maxX = 0, minY = height, maxY = 0;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = raw[idx];
      const g = raw[idx+1];
      const b = raw[idx+2];
      
      // If it's not a cream background pixel (darker or different hue)
      const isBg = r > 215 && g > 205 && b > 195;
      if (!isBg) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  
  console.log(`Shoe Bounding Box:`);
  console.log(`X: ${minX} to ${maxX} (width: ${maxX - minX})`);
  console.log(`Y: ${minY} to ${maxY} (height: ${maxY - minY})`);
}

run().catch(console.error);
