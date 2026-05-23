import sharp from "sharp";

async function run() {
  const img = sharp("public/images/products/mule-no4.png");
  const { width, height } = await img.metadata();
  const raw = await img.raw().toBuffer();
  
  let sumR = 0, sumG = 0, sumB = 0, count = 0;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = raw[idx];
      const g = raw[idx+1];
      const b = raw[idx+2];
      
      // If it's a dark pixel (the shoe)
      const isBg = r > 210 && g > 200 && b > 190;
      if (!isBg && r < 120) {
        sumR += r;
        sumG += g;
        sumB += b;
        count++;
      }
    }
  }
  
  console.log(`Average shoe color: R=${Math.round(sumR/count)}, G=${Math.round(sumG/count)}, B=${Math.round(sumB/count)}`);
  console.log(`Hex: #${Math.round(sumR/count).toString(16)}${Math.round(sumG/count).toString(16)}${Math.round(sumB/count).toString(16)}`);
}

run().catch(console.error);
