#!/usr/bin/env node
/**
 * Fix product image upload: tambah field 'image_file' (type: file) ke
 * collection 'products' supaya admin bisa upload gambar yang sungguhan
 * tersimpan di PB Storage, bukan blob URL lokal yang nggak persist.
 *
 * Existing field 'image' (text) dipertahankan untuk backward compat —
 * legacy URL tetap berfungsi. Code app prefer 'image_file' kalau ada.
 *
 * Idempotent.
 *
 * Cara pakai:
 *   PB_ADMIN_EMAIL=... PB_ADMIN_PASSWORD=... \
 *   npm run pb:fix-product-image
 */

import PocketBase from "pocketbase";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const PB_URL = process.env.PB_URL || "https://db.planet-ai.tech";

async function ask(q) {
  const rl = readline.createInterface({ input, output });
  const ans = await rl.question(q);
  rl.close();
  return ans;
}

const email = process.env.PB_ADMIN_EMAIL || (await ask("Superuser email: "));
const password =
  process.env.PB_ADMIN_PASSWORD || (await ask("Superuser password: "));

console.log(`\n→ Connecting to ${PB_URL}...`);
const pb = new PocketBase(PB_URL);

try {
  await pb.collection("_superusers").authWithPassword(email, password);
  console.log("✓ Authenticated (via _superusers)\n");
} catch (e1) {
  try {
    await pb.admins.authWithPassword(email, password);
    console.log("✓ Authenticated (via admins)\n");
  } catch (e2) {
    console.error("❌ Auth gagal:");
    console.error("  _superusers:", e1?.message || e1);
    console.error("  admins     :", e2?.message || e2);
    process.exit(1);
  }
}

console.log("→ Cek field 'image_file' di collection 'products'...");
const products = await pb.collections.getOne("products");
const hasField = (products.fields || products.schema || []).some(
  (f) => f.name === "image_file"
);

if (hasField) {
  console.log("  ↺ Field 'image_file' sudah ada — skip\n");
} else {
  const fields = [
    ...(products.fields || products.schema || []),
    {
      name: "image_file",
      type: "file",
      maxSelect: 1,
      maxSize: 5 * 1024 * 1024, // 5 MB
      mimeTypes: ["image/png", "image/jpeg", "image/svg+xml", "image/webp"],
    },
  ];

  try {
    await pb.collections.update(products.id, { fields });
  } catch (_e) {
    // fallback v0.22-
    await pb.collections.update(products.id, { schema: fields });
  }
  console.log("  ✓ Field 'image_file' ditambahkan\n");
}

console.log("✅ Selesai.");
console.log(
  "   Sekarang admin upload via /admin/products/<id> akan tersimpan di"
);
console.log("   PB Storage dan persist setelah refresh.\n");
