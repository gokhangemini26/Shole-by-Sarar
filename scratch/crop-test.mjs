import sharp from "sharp";
import path from "node:path";

async function testCrop(name, region) {
  const src = "public/images/products/mule-no4.png";
  const dst = `public/images/products/test-crop-${name}.png`;
  
  const meta = await sharp(src).metadata();
  const W = meta.width || 1024;
  const H = meta.height || 1024;
  
  let left = Math.round(W * region.left);
  let top = Math.round(H * region.top);
  let width = Math.round(W * region.width);
  let height = Math.round(H * region.height);
  
  await sharp(src)
    .extract({ left, top, width, height })
    .resize(1024, 1024, { fit: "cover" })
    .toFile(dst);
    
  console.log(`Saved crop ${name} to ${dst}`);
}

async function run() {
  // Let's test a few regions on the smooth leather part of the shoe
  // Region 1: Side / vamp of the foreground shoe (around center-left)
  await testCrop("vamp-side", { left: 0.3, top: 0.5, width: 0.25, height: 0.25 });
  
  // Region 2: The very front of the toe of the foreground shoe
  await testCrop("toe-vamp", { left: 0.45, top: 0.6, width: 0.2, height: 0.2 });

  // Region 3: Upper side of the shoe
  await testCrop("upper-side", { left: 0.25, top: 0.45, width: 0.22, height: 0.22 });
}

run().catch(console.error);
