#!/usr/bin/env node
/**
 * Bikin collection 'landing_links' — direktori link landing page yang
 * dikelola admin. Hanya admin yang lihat list ini; member lihat produk di
 * dashboard mereka.
 *
 * Idempotent: aman dijalankan berkali-kali.
 *
 * Cara pakai:
 *   PB_URL=https://db.planet-ai.tech \
 *   PB_ADMIN_EMAIL=... PB_ADMIN_PASSWORD=... \
 *   npm run pb:setup-landing-links
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

let firstErr;
try {
  await pb.collection("_superusers").authWithPassword(email, password);
  console.log("✓ Authenticated (via _superusers)\n");
} catch (e1) {
  firstErr = e1;
  try {
    await pb.admins.authWithPassword(email, password);
    console.log("✓ Authenticated (via admins)\n");
  } catch (e2) {
    console.error("❌ Auth gagal di dua-duanya:");
    console.error("  _superusers:", e1?.message || e1);
    console.error("  admins     :", e2?.message || e2);
    console.error(
      "\nCek: email/password benar? Akun terdaftar sebagai superuser?"
    );
    process.exit(1);
  }
}

const ROLE_SUPER = '@request.auth.role = "super_admin"';

// ─── Create 'landing_links' collection ─────────────────────────────────────

console.log("→ Setting up landing_links collection...");

const existing = await pb.collections.getList(1, 1, {
  filter: 'name = "landing_links"',
  requestKey: null,
});

let collectionExists = existing.items.length > 0;

if (collectionExists) {
  console.log("  ↺ Collection 'landing_links' sudah ada — skip create\n");
} else {
  const fields = [
    { name: "name", type: "text", required: true, max: 200 },
    { name: "url", type: "text", required: true, max: 500 },
    { name: "description", type: "text", max: 1000 },
    { name: "tags", type: "json", maxSize: 50000 },
    { name: "is_active", type: "bool" },
    // Autodate fields agar bisa sort by created/updated
    { name: "created", type: "autodate", onCreate: true, onUpdate: false },
    { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
  ];

  const payload = {
    name: "landing_links",
    type: "base",
    fields,
    // Admin-only — member tidak bisa baca direktori ini
    listRule: ROLE_SUPER,
    viewRule: ROLE_SUPER,
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
  console.log("  ✓ Collection landing_links dibuat\n");
  collectionExists = true;
}

// ─── Seed: entry default '/planetprompt' ───────────────────────────────────

console.log("→ Seeding default entry '/planetprompt'...");
const existingPlanet = await pb
  .collection("landing_links")
  .getList(1, 1, { filter: 'url = "/planetprompt"', requestKey: null });

if (existingPlanet.items.length > 0) {
  console.log("  ↺ Entry '/planetprompt' sudah ada — skip\n");
} else {
  await pb.collection("landing_links").create({
    name: "PlanetPrompt — Toolkit Konten UMKM",
    url: "/planetprompt",
    description:
      "LP utama PlanetPrompt: hero, showcase, pricing 3-tier (Starter / VIP / Resell), testimonial, FAQ.",
    tags: ["UMKM", "Toolkit", "Pricing 3-tier"],
    is_active: true,
  });
  console.log("  ✓ Default entry dibuat\n");
}

console.log("✅ Setup landing links selesai.\n");
console.log("Login sebagai super_admin → buka /admin/landing untuk kelola.\n");
