#!/usr/bin/env node
/**
 * Tambah field `tier` (select: starter / vip / aplikasi) ke collection `users`.
 *
 * Dipakai untuk membedakan paket yang dibeli member (Starter / VIP / Paket
 * Aplikasi) — diisi otomatis oleh webhook Mayar (lib/mayarWebhook.ts) dan
 * form admin Kirim Akses. App /app (AI Studio) bisa baca field yang sama
 * untuk buka fitur VIP.
 *
 * Cara pakai:
 *   PB_ADMIN_EMAIL=... PB_ADMIN_PASSWORD=... npm run pb:add-tier
 *   (atau jalankan tanpa env — script akan tanya interaktif)
 *
 * Idempotent: kalau field sudah ada, skip tanpa mengubah apa pun.
 */

import PocketBase from "pocketbase";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const PB_URL = process.env.PB_URL || "https://db.planet-ai.tech";

async function ask(q, hidden = false) {
  const rl = readline.createInterface({ input, output });
  if (hidden) {
    const orig = output.write.bind(output);
    output.write = (chunk, ...rest) => {
      if (rl.line) return orig.call(output, "*".repeat(chunk.length), ...rest);
      return orig(chunk, ...rest);
    };
    const ans = await rl.question(q);
    output.write = orig;
    rl.close();
    process.stdout.write("\n");
    return ans;
  }
  const ans = await rl.question(q);
  rl.close();
  return ans;
}

const email = process.env.PB_ADMIN_EMAIL || (await ask("Superuser email: "));
const password =
  process.env.PB_ADMIN_PASSWORD || (await ask("Superuser password: ", true));

console.log(`\n→ Connecting to ${PB_URL}...`);
const pb = new PocketBase(PB_URL);

// Auth — coba v0.23+ collection-based first, fallback ke v0.22- API
let apiVersion;
try {
  await pb.collection("_superusers").authWithPassword(email, password);
  apiVersion = "v0.23+";
} catch {
  await pb.admins.authWithPassword(email, password);
  apiVersion = "v0.22-";
}
console.log(`✓ Authenticated (PocketBase ${apiVersion})`);

const users = await pb.collections.getOne("users");

// v0.23+ pakai `fields`, v0.22- pakai `schema`
const fieldsKey = Array.isArray(users.fields) ? "fields" : "schema";
const fields = users[fieldsKey] || [];

if (fields.some((f) => f.name === "tier")) {
  console.log("↺ Field `tier` sudah ada di collection users — skip.");
  process.exit(0);
}

const tierField = {
  name: "tier",
  type: "select",
  required: false,
  maxSelect: 1,
  values: ["starter", "vip", "aplikasi"],
};

await pb.collections.update(users.id, {
  [fieldsKey]: [...fields, tierField],
});

console.log("✓ Field `tier` (starter/vip/aplikasi) ditambahkan ke users.");
console.log("\nCatatan: member lama tier-nya kosong — set manual via dashboard");
console.log("PocketBase / halaman admin kalau perlu (cek riwayat Mayar siapa beli apa).");
