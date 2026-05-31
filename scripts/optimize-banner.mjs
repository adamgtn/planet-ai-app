#!/usr/bin/env node
/**
 * Optimize banner promo (banner.png di /public root) → hero/banner-promo.png.
 * Resize max 1400px, compress PNG, hapus original berat.
 *   node scripts/optimize-banner.mjs
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const PUB = path.join(process.cwd(), "public");
const OUT = path.join(PUB, "lp", "planetprompt", "hero");
const src = path.join(PUB, "banner.png");

await fs.mkdir(OUT, { recursive: true });
const meta = await sharp(src).metadata();
const orig = (await fs.stat(src)).size;
console.log(`Original: ${meta.width}x${meta.height}  ${(orig / 1024 / 1024).toFixed(2)}MB`);

const buf = await sharp(src)
  .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
  .png({ quality: 85, compressionLevel: 9, effort: 10 })
  .toBuffer();
await fs.writeFile(path.join(OUT, "banner-promo.png"), buf);
await fs.unlink(src);
console.log(`Optimized: ${(buf.length / 1024).toFixed(0)}KB → hero/banner-promo.png`);
