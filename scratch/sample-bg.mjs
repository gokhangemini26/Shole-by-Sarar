import sharp from "sharp";

async function run() {
  const src = "public/images/products/pointed-flat.png";
  const img = sharp(src).ensureAlpha();
  const { width, height } = await img.metadata();
  const raw = await img.raw().toBuffer();

  console.log("Sampling corners:");
  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
    [50, 50],
    [width - 50, 50],
    [50, height - 50],
    [width - 50, height - 50]
  ];

  for (const [x, y] of corners) {
    const idx = (y * width + x) * 4;
    console.log(`(${x}, ${y}) -> R=${raw[idx]}, G=${raw[idx+1]}, B=${raw[idx+2]}, A=${raw[idx+3]}`);
  }
}

run().catch(console.error);
