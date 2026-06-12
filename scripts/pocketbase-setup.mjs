#!/usr/bin/env node
/**
 * Setup PocketBase collections + access rules untuk Planet AI Learning Center.
 *
 * Cara pakai:
 *   1) Set environment variables:
 *      PB_URL                = URL PocketBase (mis. https://db.planet-ai.tech)
 *      PB_ADMIN_EMAIL        = email superuser (yang kamu set saat install)
 *      PB_ADMIN_PASSWORD     = password superuser
 *   2) Jalankan: npm run pb:setup
 *
 * Script idempotent: aman dijalankan berkali-kali — akan skip collection yang
 * sudah ada dan tidak menghapus apapun.
 */

import PocketBase from "pocketbase";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const PB_URL = process.env.PB_URL || "https://db.planet-ai.tech";

async function ask(q, hidden = false) {
  const rl = readline.createInterface({ input, output });
  if (hidden) {
    // Mute echo for password
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

const email = process.env.PB_ADMIN_EMAIL || (await ask("Admin email: "));
const password =
  process.env.PB_ADMIN_PASSWORD || (await ask("Admin password: ", true));

console.log(`\n→ Connecting to ${PB_URL}...`);

const pb = new PocketBase(PB_URL);

// Auth — coba v0.23+ collection-based first, fallback ke v0.22- API
async function authAdmin() {
  try {
    await pb.collection("_superusers").authWithPassword(email, password);
    return "v0.23+";
  } catch (_e) {
    await pb.admins.authWithPassword(email, password);
    return "v0.22-";
  }
}

const apiVersion = await authAdmin();
console.log(`✓ Authenticated (PocketBase ${apiVersion})`);

// ─────────────────────────────────────────────────────────────────────────────
// Schema definitions

const ROLE_ADMIN = '@request.auth.role = "admin" || @request.auth.role = "super_admin"';
const ROLE_SUPER = '@request.auth.role = "super_admin"';
const ANY_AUTH = '@request.auth.id != ""';

const COLLECTIONS = [
  // ────────── users (auth) ──────────
  {
    name: "users",
    type: "auth",
    fields: [
      { name: "name", type: "text", required: true, max: 100 },
      {
        name: "role",
        type: "select",
        required: true,
        // "vip" = pembeli VIP/Aplikasi → buka fitur VIP di app /app (AI Studio).
        values: ["super_admin", "admin", "member", "vip"],
        maxSelect: 1,
      },
      {
        name: "status",
        type: "select",
        values: ["active", "suspended", "expired"],
        maxSelect: 1,
      },
      // tier = paket yang dibeli (catatan, beda dari role). Lihat pb:add-tier.
      {
        name: "tier",
        type: "select",
        values: ["starter", "vip", "aplikasi"],
        maxSelect: 1,
      },
      { name: "phone", type: "text", max: 20 },
      { name: "avatar", type: "file", maxSelect: 1, maxSize: 2097152 },
      { name: "last_login_at", type: "date" },
    ],
    listRule: ROLE_ADMIN,
    viewRule: `id = @request.auth.id || ${ROLE_ADMIN}`,
    createRule: ROLE_ADMIN,
    updateRule: `id = @request.auth.id || ${ROLE_ADMIN}`,
    deleteRule: ROLE_SUPER,
    options: {
      allowEmailAuth: true,
      allowOAuth2Auth: false,
      allowUsernameAuth: false,
      requireEmail: true,
      manageRule: ROLE_ADMIN,
    },
  },

  // ────────── products ──────────
  {
    name: "products",
    type: "base",
    fields: [
      { name: "title", type: "text", required: true, max: 200 },
      { name: "slug", type: "text", required: true, max: 100 },
      { name: "tagline", type: "text", max: 300 },
      {
        name: "level",
        type: "select",
        values: ["Pemula", "Menengah", "Lanjutan"],
        maxSelect: 1,
      },
      { name: "duration", type: "text", max: 50 },
      { name: "lesson_count", type: "number" },
      { name: "cover", type: "text", max: 100 },
      { name: "image", type: "text", max: 500 },
      { name: "landing_url", type: "url" },
      { name: "price", type: "text", max: 50 },
      {
        name: "status",
        type: "select",
        values: ["draft", "published", "archived"],
        maxSelect: 1,
      },
    ],
    indexes: [
      "CREATE UNIQUE INDEX `idx_products_slug` ON `products` (`slug`)",
    ],
    listRule: ANY_AUTH,
    viewRule: ANY_AUTH,
    createRule: ROLE_ADMIN,
    updateRule: ROLE_ADMIN,
    deleteRule: ROLE_ADMIN,
  },

  // ────────── modules ──────────
  {
    name: "modules",
    type: "base",
    fields: [
      {
        name: "product",
        type: "relation",
        required: true,
        collectionId: "__products__", // resolved at runtime
        cascadeDelete: true,
        maxSelect: 1,
      },
      { name: "title", type: "text", required: true, max: 200 },
      { name: "order", type: "number" },
    ],
    listRule: ANY_AUTH,
    viewRule: ANY_AUTH,
    createRule: ROLE_ADMIN,
    updateRule: ROLE_ADMIN,
    deleteRule: ROLE_ADMIN,
  },

  // ────────── lessons ──────────
  {
    name: "lessons",
    type: "base",
    fields: [
      {
        name: "module",
        type: "relation",
        required: true,
        collectionId: "__modules__",
        cascadeDelete: true,
        maxSelect: 1,
      },
      { name: "title", type: "text", required: true, max: 200 },
      { name: "duration", type: "text", max: 20 },
      { name: "video_url", type: "url" },
      { name: "description", type: "editor" },
      { name: "order", type: "number" },
    ],
    listRule: ANY_AUTH,
    viewRule: ANY_AUTH,
    createRule: ROLE_ADMIN,
    updateRule: ROLE_ADMIN,
    deleteRule: ROLE_ADMIN,
  },

  // ────────── resources ──────────
  {
    name: "resources",
    type: "base",
    fields: [
      {
        name: "lesson",
        type: "relation",
        required: true,
        collectionId: "__lessons__",
        cascadeDelete: true,
        maxSelect: 1,
      },
      { name: "name", type: "text", required: true, max: 200 },
      {
        name: "type",
        type: "select",
        values: ["PDF", "DOCX", "XLSX", "CSV", "ZIP", "PNG", "MP4", "LINK"],
        maxSelect: 1,
      },
      { name: "size", type: "text", max: 20 },
      { name: "url", type: "url" },
      { name: "file", type: "file", maxSelect: 1, maxSize: 52428800 },
    ],
    listRule: ANY_AUTH,
    viewRule: ANY_AUTH,
    createRule: ROLE_ADMIN,
    updateRule: ROLE_ADMIN,
    deleteRule: ROLE_ADMIN,
  },

  // ────────── permissions (user → product access) ──────────
  {
    name: "permissions",
    type: "base",
    fields: [
      {
        name: "user",
        type: "relation",
        required: true,
        collectionId: "__users__",
        cascadeDelete: true,
        maxSelect: 1,
      },
      {
        name: "product",
        type: "relation",
        required: true,
        collectionId: "__products__",
        cascadeDelete: true,
        maxSelect: 1,
      },
      {
        name: "status",
        type: "select",
        values: ["active", "expired"],
        maxSelect: 1,
      },
      { name: "granted_at", type: "date" },
      { name: "expires_at", type: "date" },
      { name: "progress", type: "number", min: 0, max: 100 },
    ],
    indexes: [
      "CREATE UNIQUE INDEX `idx_permissions_user_product` ON `permissions` (`user`, `product`)",
    ],
    listRule: `user = @request.auth.id || ${ROLE_ADMIN}`,
    viewRule: `user = @request.auth.id || ${ROLE_ADMIN}`,
    createRule: ROLE_ADMIN,
    updateRule: ROLE_ADMIN,
    deleteRule: ROLE_ADMIN,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Create collections (idempotent)

const idMap = {}; // collection name → id, untuk resolve relation refs

async function getExisting(name) {
  try {
    return await pb.collections.getOne(name);
  } catch {
    return null;
  }
}

function resolveRelations(fields) {
  return fields.map((f) => {
    if (f.type !== "relation") return f;
    const target = f.collectionId.replace(/^__|__$/g, "");
    const id = idMap[target];
    if (!id) {
      throw new Error(
        `Relation field "${f.name}" depends on collection "${target}" which is not yet created.`
      );
    }
    return { ...f, collectionId: id };
  });
}

console.log("\n→ Creating collections...\n");

for (const col of COLLECTIONS) {
  const existing = await getExisting(col.name);
  if (existing) {
    idMap[col.name] = existing.id;
    console.log(`  ↺ ${col.name.padEnd(15)} sudah ada — skip`);
    continue;
  }

  const payload = { ...col };
  if (payload.fields) {
    payload.fields = resolveRelations(payload.fields);
  }
  // v0.22- pakai key "schema" alih-alih "fields"
  if (apiVersion === "v0.22-") {
    payload.schema = payload.fields;
    delete payload.fields;
  }

  try {
    const created = await pb.collections.create(payload);
    idMap[col.name] = created.id;
    console.log(`  ✓ ${col.name.padEnd(15)} dibuat`);
  } catch (e) {
    console.error(`  ✗ ${col.name.padEnd(15)} GAGAL:`);
    console.error("    ", e?.data || e?.message || e);
    process.exit(1);
  }
}

console.log("\n✅ Setup PocketBase selesai.");
console.log("\nLangkah selanjutnya:");
console.log("  1) Buka https://db.planet-ai.tech/_/ — verify 6 collections muncul.");
console.log("  2) Jalankan: npm run pb:seed  (untuk migrate data demo)");
console.log("  3) Test login dengan admin pertama yang dibuat oleh seed.\n");
