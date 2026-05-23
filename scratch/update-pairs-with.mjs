import fs from "node:fs/promises";

async function run() {
  const file = "src/lib/products.ts";
  let content = await fs.readFile(file, "utf8");

  // Replace occurrences of Pointed Leather Flat in pairsWith arrays
  const originalStr = 'name: "Pointed Leather Flat"';
  const newStr = 'name: "Square-Toe Leather Flat"';
  
  if (content.includes(originalStr)) {
    content = content.replaceAll(originalStr, newStr);
    await fs.writeFile(file, content, "utf8");
    console.log("✓ Successfully replaced Pointed Leather Flat in pairsWith arrays!");
  } else {
    console.log("No Pointed Leather Flat references found in pairsWith.");
  }
}

run().catch(console.error);
