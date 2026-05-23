import sharp from "sharp";

async function run() {
  const img = sharp("public/images/products/pointed-flat.png");
  const { width, height } = await img.metadata();
  const raw = await img.raw().toBuffer();
  
  // Let's sample pixels that are definitely shoe (e.g. around the center of the shoe, like x=500, y=600)
  // Let's print out the RGB values of a grid in the center of the image to see what shoe pixels look like.
  console.log("Sampling center region (should contain shoe):");
  for (let y = 500; y < 700; y += 40) {
    for (let x = 300; x < 700; x += 80) {
      const idx = (y * width + x) * 4;
      const r = raw[idx];
      const g = raw[idx+1];
      const b = raw[idx+2];
      console.log(`x=${x}, y=${y} -> R=${r}, G=${g}, B=${b}`);
    }
  }
}

run().catch(console.error);
