import sharp from "sharp";

async function run() {
  const img = sharp("public/images/products/pointed-flat.png");
  const { width, height } = await img.metadata();
  const raw = await img.raw().toBuffer();
  
  // Let's sample the top-left 100x100 pixels which are pure background
  let minR = 255, maxR = 0;
  let minG = 255, maxG = 0;
  let minB = 255, maxB = 0;
  
  for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
      const idx = (y * width + x) * 4;
      const r = raw[idx];
      const g = raw[idx+1];
      const b = raw[idx+2];
      
      if (r < minR) minR = r;
      if (r > maxR) maxR = r;
      if (g < minG) minG = g;
      if (g > maxG) maxG = g;
      if (b < minB) minB = b;
      if (b > maxB) maxB = b;
    }
  }
  
  console.log(`Background sample:`);
  console.log(`R: ${minR} to ${maxR}`);
  console.log(`G: ${minG} to ${maxG}`);
  console.log(`B: ${minB} to ${maxB}`);
}

run().catch(console.error);
