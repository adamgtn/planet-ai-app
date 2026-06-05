#!/usr/bin/env node
/**
 * Tambah gambar showcase baru: convert semua raw (png/jpg) di folder showcase
 * jadi WebP, lanjut penomoran setelah showcase-NN terakhir, hapus raw.
 *   node scripts/optimize-showcase-add.mjs
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const DIR = path.join(process.cwd(), "public", "lp", "planetprompt", "showcase");
const MAX = 800;

const files = await fs.readdir(DIR);
const raws = files
  .filter((f) => /\.(png|jpe?g)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (raws.length === 0) {
  console.log("Tidak ada gambar raw baru di folder showcase.");
  process.exit(0);
}

const nums = files
  .filter((f) => /^showcase-(\d+)\.webp$/i.test(f))
  .map((f) => parseInt(f.match(/showcase-(\d+)/i)[1], 10));
let n = (nums.length ? Math.max(...nums) : 0) + 1;

let before = 0;
let after = 0;
for (const f of raws) {
  const name = `showcase-${String(n).padStart(2, "0")}.webp`;
  const srcPath = path.join(DIR, f);
  before += (await fs.stat(srcPath)).size;
  const buf = await sharp(srcPath)
    .resize(MAX, MAX, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  await fs.writeFile(path.join(DIR, name), buf);
  await fs.unlink(srcPath);
  after += buf.length;
  console.log(`  ✓ ${f}  →  ${name}  (${(buf.length / 1024).toFixed(0)} KB)`);
  n++;
}

console.log(
  `\n${raws.length} gambar baru. Total showcase sekarang: showcase-01 s/d showcase-${String(n - 1).padStart(2, "0")}.`
);
console.log(`(${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024 / 1024).toFixed(1)}MB)`);
