#!/usr/bin/env node
/**
 * Convert PNG showcase & use-case LP ke WebP (in-place, basename sama).
 * - Resize max 1000px (next/image resize lagi saat serve), quality 82.
 * - Hapus PNG asli setelah convert.
 *
 * Cara pakai:  node scripts/optimize-lp-webp.mjs
 * Setelah jalan: update referensi .png -> .webp di kode (sudah dilakukan).
 */

import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const PUB = path.join(process.cwd(), "public", "lp", "planetprompt");
const FOLDERS = ["showcase", "use-case"];
const MAX = 1000;

let totalBefore = 0;
let totalAfter = 0;
let count = 0;

for (const folder of FOLDERS) {
  const dir = path.join(PUB, folder);
  let files;
  try {
    files = (await fs.readdir(dir)).filter((f) => /\.png$/i.test(f));
  } catch {
    console.log(`  ⚠ folder ${folder} tidak ada, skip`);
    continue;
  }
  for (const f of files) {
    const src = path.join(dir, f);
    const dst = path.join(dir, f.replace(/\.png$/i, ".webp"));
    const before = (await fs.stat(src)).size;
    const buf = await sharp(src)
      .resize(MAX, MAX, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    await fs.writeFile(dst, buf);
    await fs.unlink(src);
    totalBefore += before;
    totalAfter += buf.length;
    count++;
    console.log(`  ✓ ${folder}/${f}  ${(before / 1024).toFixed(0)}KB → ${(buf.length / 1024).toFixed(0)}KB`);
  }
}

console.log(
  `\n${count} file. Total ${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB ` +
    `(hemat ${Math.round((1 - totalAfter / totalBefore) * 100)}%).`
);
