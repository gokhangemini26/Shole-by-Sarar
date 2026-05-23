import sharp from "sharp";

async function run() {
  const src = "public/images/products/pointed-flat.png";
  const img = sharp(src).ensureAlpha();
  const { width, height } = await img.metadata();
  const raw = await img.raw().toBuffer();

  const isShoe = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return false;
    const idx = (y * width + x) * 4;
    return raw[idx] < 110 && raw[idx+1] < 110 && raw[idx+2] < 110;
  };

  console.log("=== LEFT SHOE TOE PROFILE (X: 140 to 220) ===");
  for (let x = 140; x <= 220; x += 5) {
    let firstY = -1;
    let lastY = -1;
    let count = 0;
    for (let y = 0; y < height; y++) {
      if (isShoe(x, y)) {
        // We only care about the upper shoe pointing left
        // The upper shoe's Y coords are around 350-650
        if (y > 350 && y < 650) {
          if (firstY === -1) firstY = y;
          lastY = y;
          count++;
        }
      }
    }
    console.log(`x=${x} -> width=${count} (y: ${firstY}..${lastY})`);
  }

  console.log("\n=== RIGHT SHOE TOE PROFILE (X: 800 to 905) ===");
  for (let x = 800; x <= 905; x += 5) {
    let firstY = -1;
    let lastY = -1;
    let count = 0;
    for (let y = 0; y < height; y++) {
      if (isShoe(x, y)) {
        // The lower shoe's Y coords are around 550-800
        if (y > 550 && y < 800) {
          if (firstY === -1) firstY = y;
          lastY = y;
          count++;
        }
      }
    }
    console.log(`x=${x} -> width=${count} (y: ${firstY}..${lastY})`);
  }
}

run().catch(console.error);
