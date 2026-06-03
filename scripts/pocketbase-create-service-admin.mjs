#!/usr/bin/env node
/**
 * Bikin akun "service-admin" di collection `users` — dipakai oleh webhook
 * orderonline (app/api/orderonline/webhook) untuk membuat akun member baru.
 *
 * Kenapa role "admin" (bukan superuser)?
 *   createRule users = ROLE_ADMIN (role "admin" / "super_admin"), jadi akun
 *   ber-role "admin" sudah cukup untuk create user. Lebih aman daripada
 *   menaruh kredensial superuser asli di env aplikasi.
 *
 * Cara pakai:
 *   1) Set env:
 *      PB_URL              = URL PocketBase (default https://db.planet-ai.tech)
 *      PB_ADMIN_EMAIL      = email superuser
 *      PB_ADMIN_PASSWORD   = password superuser
 *      PB_SERVICE_EMAIL    = email untuk akun service (mis. webhook@planet-ai.tech)
 *      PB_SERVICE_PASSWORD = password untuk akun service (simpan, dipakai di app env)
 *   2) Jalankan: npm run pb:create-service-admin
 *
 * Idempotent: kalau akun dengan email itu sudah ada, script skip (tidak error).
 * Setelah jalan, salin PB_SERVICE_EMAIL & PB_SERVICE_PASSWORD ke .env.production.
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

const adminEmail = process.env.PB_ADMIN_EMAIL || (await ask("Superuser email: "));
const adminPassword =
  process.env.PB_ADMIN_PASSWORD || (await ask("Superuser password: ", true));

const serviceEmail =
  process.env.PB_SERVICE_EMAIL || (await ask("Service account email: "));
const servicePassword =
  process.env.PB_SERVICE_PASSWORD ||
  (await ask("Service account password (min 8 char): ", true));

if (!servicePassword || servicePassword.length < 8) {
  console.error("❌ Password service minimal 8 karakter.");
  process.exit(1);
}

console.log(`\n→ Connecting to ${PB_URL}...`);
const pb = new PocketBase(PB_URL);

// Auth superuser — v0.23+ collection-based, fallback ke v0.22-
try {
  await pb.collection("_superusers").authWithPassword(adminEmail, adminPassword);
} catch (_e) {
  await pb.admins.authWithPassword(adminEmail, adminPassword);
}
console.log("✓ Authenticated sebagai superuser");

// Idempotent: cek apakah sudah ada
const existing = await pb
  .collection("users")
  .getFirstListItem(pb.filter("email = {:email}", { email: serviceEmail }))
  .catch(() => null);

if (existing) {
  console.log(`✨ Akun '${serviceEmail}' sudah ada (role: ${existing.role}). Skip.`);
  if (existing.role !== "admin" && existing.role !== "super_admin") {
    console.log("→ Meng-upgrade role ke 'admin'...");
    await pb.collection("users").update(existing.id, { role: "admin", status: "active" });
    console.log("✓ Role di-set ke 'admin'.");
  }
  process.exit(0);
}

await pb.collection("users").create({
  email: serviceEmail,
  name: "Service Webhook",
  role: "admin",
  status: "active",
  password: servicePassword,
  passwordConfirm: servicePassword,
  emailVisibility: false,
  verified: true,
});

console.log(`\n✅ Akun service '${serviceEmail}' dibuat (role: admin).`);
console.log("→ Salin ke .env.production aplikasi:");
console.log(`   PB_SERVICE_EMAIL=${serviceEmail}`);
console.log("   PB_SERVICE_PASSWORD=<password yang barusan kamu masukkan>");
