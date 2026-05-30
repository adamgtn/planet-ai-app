#!/usr/bin/env node
/**
 * Tambahkan collection 'landing_pages' untuk landing page penjualan per
 * produk + relax read rule pada collection 'products' (biar landing publik
 * bisa render data produk tanpa login).
 *
 * Cara pakai:
 *   PB_URL=https://db.planet-ai.tech \
 *   PB_ADMIN_EMAIL=... PB_ADMIN_PASSWORD=... \
 *   npm run pb:fix-landing
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
} catch {
  await pb.admins.authWithPassword(email, password);
}
console.log("✓ Authenticated\n");

const ROLE_SUPER = '@request.auth.role = "super_admin"';
const ROLE_ADMIN =
  '@request.auth.role = "admin" || @request.auth.role = "super_admin"';

// ─── 1) Relax 'products' read rules (public read) ───────────────────────────

console.log("→ Updating products collection rules (public read)...");
const products = await pb.collections.getOne("products");
await pb.collections.update(products.id, {
  listRule: "", // public list
  viewRule: "", // public view
  createRule: ROLE_ADMIN,
  updateRule: ROLE_ADMIN,
  deleteRule: ROLE_ADMIN,
});
console.log("  ✓ Products kini bisa dibaca tanpa login\n");

// ─── 2) Create 'landing_pages' collection ───────────────────────────────────

console.log("→ Setting up landing_pages collection...");

const existing = await pb.collections.getList(1, 1, {
  filter: 'name = "landing_pages"',
  requestKey: null,
});

if (existing.items.length > 0) {
  console.log("  ↺ Collection 'landing_pages' sudah ada — skip\n");
} else {
  const fields = [
    {
      name: "product",
      type: "relation",
      required: true,
      collectionId: products.id,
      cascadeDelete: true,
      maxSelect: 1,
    },
    { name: "headline", type: "text", max: 200 },
    { name: "subheadline", type: "editor" },
    { name: "hero_image_url", type: "text", max: 500 },
    { name: "cta_primary_text", type: "text", max: 100 },
    { name: "cta_primary_url", type: "url" },
    /**
     * benefits = [{title: string, description: string, icon?: string}]
     */
    { name: "benefits", type: "json", maxSize: 200000 },
    /**
     * testimonials = [{name, role, quote, photo_url?}]
     */
    { name: "testimonials", type: "json", maxSize: 200000 },
    /**
     * faq = [{question, answer}]
     */
    { name: "faq", type: "json", maxSize: 200000 },
    /**
     * price_features = string[] (list of bullet items)
     */
    { name: "price_features", type: "json", maxSize: 100000 },
    { name: "footer_cta_text", type: "text", max: 300 },
    { name: "published", type: "bool" },
  ];

  const payload = {
    name: "landing_pages",
    type: "base",
    fields,
    indexes: [
      "CREATE UNIQUE INDEX `idx_landing_product` ON `landing_pages` (`product`)",
    ],
    listRule: "", // publik
    viewRule: "", // publik
    createRule: ROLE_SUPER,
    updateRule: ROLE_SUPER,
    deleteRule: ROLE_SUPER,
  };

  try {
    await pb.collections.create(payload);
  } catch (_e) {
    // fallback v0.22-
    payload.schema = payload.fields;
    delete payload.fields;
    await pb.collections.create(payload);
  }
  console.log("  ✓ Collection landing_pages dibuat\n");
}

console.log("✅ Setup landing page selesai.\n");
console.log("Langkah berikutnya:");
console.log("  1. Login ke https://planetsoft.id sebagai super_admin");
console.log("  2. Sidebar admin akan muncul menu baru 'Landing Page'");
console.log("  3. Klik untuk mulai edit landing page tiap produk\n");
