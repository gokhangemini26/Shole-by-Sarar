import path from "node:path";
import sharp from "sharp";

const productsDir = path.resolve("public/images/products");

async function processImage({ source, target, cropRegion, modulate, sharpen }) {
  const src = path.join(productsDir, source);
  const dst = path.join(productsDir, target);
  console.log(`Processing: ${source} → ${target}`);

  let pipe = sharp(src);

  if (cropRegion) {
    const meta = await sharp(src).metadata();
    const W = meta.width ?? 1024;
    const H = meta.height ?? 1024;

    let left = Math.round(W * cropRegion.left);
    let top = Math.round(H * cropRegion.top);
    let width = Math.round(W * cropRegion.width);
    let height = Math.round(H * cropRegion.height);

    if (left + width > W) width = W - left;
    if (top + height > H) height = H - top;

    pipe = pipe.extract({ left, top, width, height }).resize(1024, 1024, { fit: "cover" });
  }

  if (modulate) {
    pipe = pipe.modulate(modulate);
  }

  if (sharpen) {
    pipe = pipe.sharpen(sharpen);
  }

  await pipe.toFile(dst);
  console.log(`✓ Saved: ${target}`);
}

async function run() {
  try {
    // 1. Navy Pleated Trousers Detail: crop from the generated hero trousers shot
    await processImage({
      source: "pleated-trousers-navy.png",
      target: "pleated-trousers-navy-detail.png",
      cropRegion: { left: 0.35, top: 0.3, width: 0.3, height: 0.3 },
      modulate: { brightness: 1.02, saturation: 1.05 },
      sharpen: { sigma: 0.7 }
    });

    // 2. Silk Tuxedo Jacket Hero: modulate Navy Blazer to a sleek black evening tuxedo jacket
    await processImage({
      source: "double-breasted-blazer.png",
      target: "silk-tuxedo-jacket.png",
      modulate: { brightness: 0.38, saturation: 0 } // Desaturate navy to charcoal black
    });

    // 3. Silk Tuxedo Jacket Detail: crop the lapel of the tuxedo jacket
    await processImage({
      source: "silk-tuxedo-jacket.png",
      target: "silk-tuxedo-jacket-detail.png",
      cropRegion: { left: 0.38, top: 0.28, width: 0.24, height: 0.24 },
      sharpen: { sigma: 0.6 }
    });

    // 4. Charcoal Wool Pencil Skirt Hero: modulate Espresso Mini to a rich Charcoal Grey Skirt
    await processImage({
      source: "atelier-mini.png",
      target: "wool-pencil-skirt.png",
      modulate: { brightness: 0.8, saturation: 0 } // Desaturate espresso brown to charcoal grey
    });

    // 5. Charcoal Wool Pencil Skirt Detail: modulate Espresso Mini Detail to Charcoal Grey
    await processImage({
      source: "atelier-mini-detail.png",
      target: "wool-pencil-skirt-detail.png",
      modulate: { brightness: 0.8, saturation: 0 }
    });

    // 6. The Reimagined Trench Hero: modulate Terra Atelier Coat to beautiful Sand Cotton-Gabardine
    // Terra is orange-red. We apply hue shift and desaturation to get sand/khaki.
    await processImage({
      source: "atelier-coat.png",
      target: "trench-coat-reimagined.png",
      modulate: { brightness: 1.32, saturation: 0.45, hue: 45 } // Shift red-orange to sand-yellow-brown
    });

    // 7. The Reimagined Trench Detail: modulate Terra Atelier Coat Detail to Sand Cotton-Gabardine
    await processImage({
      source: "atelier-coat-detail.png",
      target: "trench-coat-reimagined-detail.png",
      modulate: { brightness: 1.32, saturation: 0.45, hue: 45 }
    });

    console.log("\nAll remaining images successfully generated!");
  } catch (err) {
    console.error("Error generating images:", err);
    process.exit(1);
  }
}

run();
