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

// Urutkan supaya hasil renumber deterministic:
// 1. File yang udah pattern showcase-NN duluan (urutan numerik)
// 2. File lain (random name dari ChatGPT dll) di belakang, urut alfabetis
const matched = pngs
  .filter((f) => PATTERN.test(f))
  .sort(
    (a, b) =>
      parseInt(a.match(/\d+/)[0], 10) - parseInt(b.match(/\d+/)[0], 10)
  );
const unmatched = pngs.filter((f) => !PATTERN.test(f)).sort();

// Final order: matched (sequential) + unmatched (append di belakang)
const ordered = [...matched, ...unmatched];

console.log(`📁 ${DIR}`);
console.log(`  Total PNG: ${pngs.length}`);
console.log(`  Sudah ber-pattern: ${matched.length} (akan di-renumber jika ada gap)`);
console.log(`  Perlu rename baru: ${unmatched.length}`);
console.log("");

let totalBefore = 0;
let totalAfter = 0;

// Step 1: rename ke nama temp dulu (hindari konflik kalau renumber overlap)
const tempRenames = [];
for (let i = 0; i < ordered.length; i++) {
  const oldName = ordered[i];
  const newName = `showcase-${String(i + 1).padStart(2, "0")}.png`;
  if (oldName === newName) {
    tempRenames.push({ oldName, tempName: oldName, newName, skipTemp: true });
  } else {
    const tempName = `__tmp__${i}__${Date.now()}.png`;
    await fs.rename(path.join(DIR, oldName), path.join(DIR, tempName));
    tempRenames.push({ oldName, tempName, newName, skipTemp: false });
  }
}

// Step 2: process tiap file (compress + rename final)
for (const item of tempRenames) {
  const { oldName, tempName, newName } = item;
  const srcPath = path.join(DIR, tempName);
  const stat = await fs.stat(srcPath);
  totalBefore += stat.size;

  const buf = await sharp(srcPath)
    .resize({
      width: MAX_DIM,
      height: MAX_DIM,
      fit: "inside",
      withoutEnlargement: true,
    })
    .png({ quality: PNG_QUALITY, compressionLevel: 9, effort: 10 })
    .toBuffer();

  totalAfter += buf.length;

  const finalPath = path.join(DIR, newName);
  // Hapus temp (atau original kalau skip temp)
  if (tempName !== newName) await fs.unlink(srcPath);
  await fs.writeFile(finalPath, buf);

  const renamed = oldName !== newName ? ` → ${newName}` : "";
  console.log(
    `  ✓ ${oldName}${renamed}\n` +
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
