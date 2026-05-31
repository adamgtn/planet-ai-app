#!/usr/bin/env node
/**
 * Optimize gambar kategori "use case" yang ditaruh di /public root (berat).
 * - Resize max 800px, compress PNG.
 * - Rename ke kebab-case + pindah ke /public/lp/planetprompt/use-case/.
 * - Hapus original berat di /public root.
 *
 * Cara pakai:  node scripts/optimize-usecase.mjs
 */

import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const PUB = path.join(process.cwd(), "public");
const OUT = path.join(PUB, "lp", "planetprompt", "use-case");
const MAX = 800;

// nama asli (di /public root) -> nama rapi (di folder use-case)
const MAP = {
  "makanan_minuman.png": "makanan-minuman.png",
  "fashion&apparel.png": "fashion-apparel.png",
  "beauty & screencare.png": "beauty-skincare.png",
  "jasa_lokal.png": "jasa-lokal.png",
  "produc_digital.png": "produk-digital.png",
  "marketpalce.png": "marketplace.png",
  "education.png": "education.png",
  "esport.png": "esport.png",
  "festive.png": "festive.png",
};

await fs.mkdir(OUT, { recursive: true });

let before = 0;
let after = 0;
for (const [src, dst] of Object.entries(MAP)) {
  const srcPath = path.join(PUB, src);
  try {
    await fs.access(srcPath);
  } catch {
    console.log(`  ⚠ ${src} tidak ada, skip`);
    continue;
  }
  const stat = await fs.stat(srcPath);
  before += stat.size;

  const buf = await sharp(srcPath)
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .png({ quality: 85, compressionLevel: 9, effort: 10 })
    .toBuffer();
  after += buf.length;

  await fs.writeFile(path.join(OUT, dst), buf);
  await fs.unlink(srcPath); // hapus original berat di /public root
  console.log(
    `  ✓ ${src} → use-case/${dst}  ${(stat.size / 1024).toFixed(0)}KB → ${(
      buf.length / 1024
    ).toFixed(0)}KB`
  );
}

console.log(
  `\nTotal: ${(before / 1024 / 1024).toFixed(2)}MB → ${(
    after /
    1024 /
    1024
  ).toFixed(2)}MB`
);
console.log("✅ Selesai. Gambar ada di public/lp/planetprompt/use-case/");
