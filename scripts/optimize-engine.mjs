#!/usr/bin/env node
/**
 * Optimize gambar engine kreatif yang ditaruh di /public root (berat ~2.5MB each).
 * - Resize ke max 800px, compress PNG.
 * - Rename ke kebab-case + pindah ke /public/lp/planetprompt/engine/.
 * - Hapus original berat di /public root.
 *
 * Cara pakai:  npm run optimize:engine
 */

import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const PUB = path.join(process.cwd(), "public");
const OUT = path.join(PUB, "lp", "planetprompt", "engine");
const MAX = 800;

// nama asli (di /public root) -> nama rapi (di folder engine)
const MAP = {
  "design_grafis.png": "design-grafis.png",
  "tumbneil_yputube.png": "youtube-thumbnail.png",
  "anatomi.png": "anatomi.png",
  "comic.png": "comic.png",
  "infografis.png": "infografis.png",
  "creative_promt.png": "creative-prompt.png",
  "produk.png": "produk.png",
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
    `  ✓ ${src} → engine/${dst}  ${(stat.size / 1024).toFixed(0)}KB → ${(
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
console.log("✅ Selesai. Gambar engine ada di public/lp/planetprompt/engine/");
