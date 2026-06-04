#!/usr/bin/env node
/**
 * Optimize SET gambar engine (banyak gambar per engine) yang ditaruh di
 * /public root dengan nama berantakan (spasi/kurung), mis:
 *   "design grafis (1).png", "logo (2).png", "tumbneil youtube (1).png"
 *
 * - Deteksi engine dari nama file → kelompokkan.
 * - Ambil maksimal 3 per engine (sorted), resize max 1000px, convert ke WebP.
 * - Simpan ke /public/lp/planetprompt/engine/ sebagai `<engine>-<n>.webp`.
 * - Hapus SEMUA original yang cocok dari /public root (termasuk yang tak terpakai).
 *
 * Cara pakai:  node scripts/optimize-engine-set.mjs
 * Idempotent-ish: kalau tidak ada file cocok di root, langsung selesai.
 */

import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const PUB = path.join(process.cwd(), "public");
const OUT = path.join(PUB, "lp", "planetprompt", "engine");
const MAX = 1000;
const PER_ENGINE = 3;

/** Petakan nama file berantakan → slug engine. */
function groupOf(name) {
  const n = name.toLowerCase();
  if (n.includes("design grafis") || n.includes("design-grafis")) return "design-grafis";
  if (n.includes("tumbneil") || n.includes("youtube")) return "youtube-thumbnail";
  if (n.includes("creative")) return "creative-prompt";
  if (n.includes("infografis")) return "infografis";
  if (n.includes("anatomi")) return "anatomi";
  if (n.includes("comic")) return "comic";
  if (n.includes("logo")) return "logo";
  return null;
}

await fs.mkdir(OUT, { recursive: true });

const all = (await fs.readdir(PUB)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
const groups = {};
for (const f of all) {
  const g = groupOf(f);
  if (!g) continue;
  (groups[g] ||= []).push(f);
}

if (Object.keys(groups).length === 0) {
  console.log("Tidak ada gambar engine di /public root. Selesai.");
  process.exit(0);
}

let used = 0;
let removed = 0;
for (const [g, list] of Object.entries(groups)) {
  list.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const pick = list.slice(0, PER_ENGINE);

  let i = 1;
  for (const f of pick) {
    const dst = path.join(OUT, `${g}-${i}.webp`);
    const buf = await sharp(path.join(PUB, f))
      .resize(MAX, MAX, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    await fs.writeFile(dst, buf);
    console.log(`  ✓ ${f}  →  ${g}-${i}.webp  (${(buf.length / 1024).toFixed(0)} KB)`);
    i++;
    used++;
  }

  // hapus SEMUA original grup ini (terpakai & sisa)
  for (const f of list) {
    await fs.unlink(path.join(PUB, f)).catch(() => {});
    removed++;
  }
}

console.log(`\nSelesai. ${used} gambar dioptimize → ${OUT}`);
console.log(`${removed} original dihapus dari /public root.`);
