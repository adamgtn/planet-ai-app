#!/usr/bin/env node
/**
 * Fix collection 'users' di PocketBase: tambahkan field role, status, phone,
 * last_login_at yang ke-skip oleh setup script (karena PB v0.26+ sudah punya
 * users collection bawaan).
 *
 * Juga set role + status untuk akun demo:
 *   - super@planet-ai.id  → super_admin / active
 *   - member@planet-ai.id → member / active
 *
 * Cara pakai:
 *   PB_URL=https://db.planet-ai.tech \
 *   PB_ADMIN_EMAIL=... PB_ADMIN_PASSWORD=... \
 *   npm run pb:fix-users
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

// ─── 1) Patch schema ────────────────────────────────────────────────────────

console.log("→ Loading users collection...");
const users = await pb.collections.getOne("users");
const existingFields = (users.fields || users.schema || []).map((f) => f.name);

const NEEDED = [
  {
    name: "role",
    type: "select",
    required: true,
    values: ["super_admin", "admin", "member"],
    maxSelect: 1,
  },
  {
    name: "status",
    type: "select",
    values: ["active", "suspended", "expired"],
    maxSelect: 1,
  },
  { name: "phone", type: "text", max: 20 },
  { name: "last_login_at", type: "date" },
];

const toAdd = NEEDED.filter((f) => !existingFields.includes(f.name));

const ROLE_ADMIN =
  '@request.auth.role = "admin" || @request.auth.role = "super_admin"';
const ROLE_SUPER = '@request.auth.role = "super_admin"';
const VIEW_OWN_OR_ADMIN = `id = @request.auth.id || ${ROLE_ADMIN}`;

const updatePayload = {
  // API rules — penting agar admin bisa list & manage user lain
  listRule: ROLE_ADMIN,
  viewRule: VIEW_OWN_OR_ADMIN,
  createRule: ROLE_ADMIN,
  updateRule: VIEW_OWN_OR_ADMIN,
  deleteRule: ROLE_SUPER,
};

if (toAdd.length > 0) {
  console.log(`  + Tambah field: ${toAdd.map((f) => f.name).join(", ")}`);
  const newFields = [...(users.fields || users.schema || []), ...toAdd];
  // Coba update via 'fields' (v0.23+); fallback ke 'schema' (v0.22-)
  try {
    await pb.collections.update(users.id, {
      fields: newFields,
      ...updatePayload,
    });
  } catch (_e) {
    await pb.collections.update(users.id, {
      schema: newFields,
      ...updatePayload,
    });
  }
  console.log("  ✓ Schema + API rules users diperbarui");
} else {
  console.log("  ↺ Semua field sudah ada — update API rules saja");
  await pb.collections.update(users.id, updatePayload);
  console.log("  ✓ API rules users diperbarui");
}

// ─── 2) Set role + status untuk akun demo ──────────────────────────────────

console.log("\n→ Setting role + status untuk akun demo...");

async function setUserRole(emailAddr, role) {
  const list = await pb.collection("users").getFullList({
    filter: `email = "${emailAddr}"`,
    requestKey: null,
  });
  if (list.length === 0) {
    console.log(`  ⚠ ${emailAddr} tidak ditemukan, skip`);
    return;
  }
  await pb.collection("users").update(list[0].id, {
    role,
    status: "active",
  });
  console.log(`  ✓ ${emailAddr.padEnd(28)} → role=${role}`);
}

await setUserRole("super@planet-ai.id", "super_admin");
await setUserRole("member@planet-ai.id", "member");

console.log("\n✅ Fix selesai.\n");
console.log("Langkah berikutnya:");
console.log("  1. Buka https://app.planet-ai.tech");
console.log("  2. Logout (kalau masih login)");
console.log("  3. Hard refresh (Ctrl+Shift+R)");
console.log("  4. Login ulang dengan super@planet-ai.id");
console.log("  5. Tombol 'Admin' harusnya muncul di TopBar 🎉\n");
