import fs from "node:fs/promises";

async function run() {
  const content = await fs.readFile("src/lib/products.ts", "utf8");
  const lines = content.split("\n");
  lines.forEach((line, idx) => {
    if (line.includes("pointed-flat") || line.includes("Sivri Burunlu")) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  });
}

run().catch(console.error);
