#!/usr/bin/env node
/**
 * Optimize showcase images:
 * 1. Rename file dengan nama random (cth: 'ChatGPT Image...png') jadi
 *    pattern konsisten 'showcase-NN.png' (lanjut nomor terakhir).
 * 2. Resize ke max 1000×1000 (cukup untuk display marquee 240-288px + retina).
 * 3. Compress PNG dengan effort tinggi.
 *
 * Idempotent: aman dijalanin berulang. File yang udah ber-format
 * 'showcase-NN.png' cuma di-re-compress.
 *
 * Cara pakai:
 *   npm run optimize:showcase
 */

import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const DIR = path.join(
  process.cwd(),
  "public",
  "lp",
  "planetprompt",
  "showcase"
);
const MAX_DIM = 1000;
const PNG_QUALITY = 85;
const PATTERN = /^showcase-\d+\.png$/i;

function fmtBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

const all = await fs.readdir(DIR);
const pngs = all.filter((f) => f.toLowerCase().endsWith(".png"));

const existing = pngs.filter((f) => PATTERN.test(f));
const toRename = pngs.filter((f) => !PATTERN.test(f)).sort();

const existingNums = existing
  .map((f) => parseInt(f.match(/\d+/)[0], 10))
  .sort((a, b) => a - b);
let nextNum = (existingNums.at(-1) ?? 0) + 1;

console.log(`📁 ${DIR}`);
console.log(`  Total PNG: ${pngs.length}`);
console.log(`  showcase-NN: ${existing.length}`);
console.log(`  Perlu rename: ${toRename.length}`);
console.log("");

let totalBefore = 0;
let totalAfter = 0;

for (const file of pngs) {
  const src = path.join(DIR, file);
  const stat = await fs.stat(src);
  totalBefore += stat.size;

  // Tentukan target name
  let targetName;
  if (PATTERN.test(file)) {
    targetName = file;
  } else {
    targetName = `showcase-${String(nextNum++).padStart(2, "0")}.png`;
  }
  const target = path.join(DIR, targetName);

  // Proses pakai sharp
  const buf = await sharp(src)
    .resize({
      width: MAX_DIM,
      height: MAX_DIM,
      fit: "inside",
      withoutEnlargement: true,
    })
    .png({ quality: PNG_QUALITY, compressionLevel: 9, effort: 10 })
    .toBuffer();

  totalAfter += buf.length;

  // Kalau target beda dari source, hapus source dulu
  if (target !== src) {
    await fs.unlink(src);
  }
  await fs.writeFile(target, buf);

  const renamed = target !== src ? ` → ${targetName}` : "";
  console.log(
    `  ✓ ${file}${renamed}\n` +
      `    ${fmtBytes(stat.size)} → ${fmtBytes(buf.length)}  (${(
        ((stat.size - buf.length) / stat.size) *
        100
      ).toFixed(0)}% smaller)`
  );
}

console.log("\n──────────────────────────────────────");
console.log(
  `Total: ${fmtBytes(totalBefore)} → ${fmtBytes(totalAfter)}  (${(
    ((totalBefore - totalAfter) / totalBefore) *
    100
  ).toFixed(0)}% smaller)`
);
console.log("✅ Selesai.");
