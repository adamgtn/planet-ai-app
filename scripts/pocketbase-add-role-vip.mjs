#!/usr/bin/env node
/**
 * Tambah nilai "vip" ke field `role` di collection `users`.
 *
 * Kenapa: app /app (AI Studio) membuka fitur VIP (AI Auto-fill) berdasarkan
 * `role === "vip"`. Field role di PocketBase awalnya cuma punya
 * super_admin/admin/member, jadi set role=vip ditolak ("Invalid value vip").
 * Script ini menambah "vip" sebagai nilai valid — TIDAK menghapus nilai lama,
 * tidak mengubah record manapun.
 *
 * Cara pakai:
 *   PB_ADMIN_EMAIL=... PB_ADMIN_PASSWORD=... npm run pb:add-role-vip
 *   (atau jalankan tanpa env — script akan tanya interaktif)
 *
 * Idempotent: kalau "vip" sudah ada di values, skip.
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
const fieldsKey = Array.isArray(users.fields) ? "fields" : "schema";
const fields = users[fieldsKey] || [];

const roleField = fields.find((f) => f.name === "role");
if (!roleField) {
  console.error("✗ Field `role` tidak ditemukan di collection users. Batal.");
  process.exit(1);
}

// values bisa di f.values (v0.23+) atau f.options.values (v0.22-)
const currentValues = roleField.values || roleField.options?.values || [];
console.log(`  role values sekarang: ${JSON.stringify(currentValues)}`);

if (currentValues.includes("vip")) {
  console.log("↺ Nilai `vip` sudah ada di field role — skip.");
  process.exit(0);
}

const newValues = [...currentValues, "vip"];
const updatedFields = fields.map((f) => {
  if (f.name !== "role") return f;
  if (f.values) return { ...f, values: newValues };
  return { ...f, options: { ...(f.options || {}), values: newValues } };
});

await pb.collections.update(users.id, { [fieldsKey]: updatedFields });

console.log(`✓ Nilai \`vip\` ditambahkan ke field role: ${JSON.stringify(newValues)}`);
console.log("\nSekarang admin /app bisa set role=vip, dan webhook Mayar otomatis");
console.log("nge-set role=vip untuk pembeli VIP / Aplikasi.");
