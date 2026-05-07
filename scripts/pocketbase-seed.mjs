#!/usr/bin/env node
/**
 * Seed data demo ke PocketBase setelah collections dibuat.
 *
 * Membuat:
 *   - 1 super_admin user (yang bisa login ke /admin)
 *   - 1 demo member user
 *   - 6 produk dengan modul + lesson + resource lengkap
 *   - Permission untuk demo member ke 2 produk
 *
 * Cara pakai:
 *   PB_URL=https://db.planet-ai.tech \
 *   PB_ADMIN_EMAIL=... PB_ADMIN_PASSWORD=... \
 *   npm run pb:seed
 *
 * Tambahkan opsional:
 *   SEED_SUPER_EMAIL, SEED_SUPER_PASSWORD     (default: super@planet-ai.id / change-me-12345)
 *   SEED_MEMBER_EMAIL, SEED_MEMBER_PASSWORD   (default: member@planet-ai.id / change-me-12345)
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

const SUPER_EMAIL = process.env.SEED_SUPER_EMAIL || "super@planet-ai.id";
const SUPER_PASSWORD = process.env.SEED_SUPER_PASSWORD || "change-me-12345";
const MEMBER_EMAIL = process.env.SEED_MEMBER_EMAIL || "member@planet-ai.id";
const MEMBER_PASSWORD = process.env.SEED_MEMBER_PASSWORD || "change-me-12345";

console.log(`\n→ Connecting to ${PB_URL}...`);

const pb = new PocketBase(PB_URL);

try {
  await pb.collection("_superusers").authWithPassword(email, password);
} catch {
  await pb.admins.authWithPassword(email, password);
}

console.log("✓ Authenticated\n");

// ─────────────────────────────────────────────────────────────────────────────
// Seed data

const PRODUCTS = [
  {
    slug: "prompt-engineering-mastery",
    title: "Prompt Engineering Mastery",
    tagline: "Kuasai seni berbicara dengan AI dari dasar hingga mahir.",
    level: "Pemula",
    duration: "6 jam 20 menit",
    lesson_count: 24,
    cover: "from-orange-400 to-orange-600",
    image: "/products/prompt-engineering-mastery.svg",
    landing_url: "https://planet-ai.id/produk/prompt-engineering-mastery",
    price: "Rp 499.000",
    status: "published",
    modules: [
      {
        title: "Modul 1 — Fondasi Prompt",
        order: 1,
        lessons: [
          {
            title: "Pengantar Prompt Engineering",
            duration: "08:32",
            video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            description:
              "Memahami apa itu prompt, mengapa krusial, dan kerangka berpikir saat menyusun instruksi kepada model AI.",
            order: 1,
            resources: [
              { name: "Slide-Modul-1.pdf", type: "PDF", size: "2.4 MB" },
              { name: "Cheatsheet-Prompt.pdf", type: "PDF", size: "780 KB" },
            ],
          },
          {
            title: "Anatomi Prompt yang Efektif",
            duration: "12:10",
            video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            description:
              "Bedah enam komponen prompt: peran, konteks, tugas, format, batasan, dan contoh.",
            order: 2,
            resources: [
              { name: "Template-Prompt.docx", type: "DOCX", size: "120 KB" },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "ai-automation-blueprint",
    title: "AI Automation Blueprint",
    tagline: "Otomatiskan operasional bisnismu dengan kombinasi AI + No-Code.",
    level: "Menengah",
    duration: "8 jam 45 menit",
    lesson_count: 32,
    cover: "from-amber-400 to-orange-500",
    image: "/products/ai-automation-blueprint.svg",
    landing_url: "https://planet-ai.id/produk/ai-automation-blueprint",
    price: "Rp 749.000",
    status: "published",
    modules: [],
  },
  {
    slug: "build-ai-saas",
    title: "Build Your First AI SaaS",
    tagline: "Bangun produk SaaS bertenaga AI dari nol hingga launching.",
    level: "Lanjutan",
    duration: "12 jam 10 menit",
    lesson_count: 45,
    cover: "from-orange-300 to-rose-500",
    image: "/products/build-ai-saas.svg",
    landing_url: "https://planet-ai.id/produk/build-ai-saas",
    price: "Rp 1.499.000",
    status: "published",
    modules: [],
  },
  {
    slug: "ai-content-creator",
    title: "AI Content Creator Toolkit",
    tagline: "Produksi konten visual & tulisan 10x lebih cepat dengan AI.",
    level: "Pemula",
    duration: "5 jam 30 menit",
    lesson_count: 20,
    cover: "from-orange-300 to-pink-400",
    image: "/products/ai-content-creator.svg",
    landing_url: "https://planet-ai.id/produk/ai-content-creator",
    price: "Rp 399.000",
    status: "published",
    modules: [],
  },
  {
    slug: "data-analyst-with-ai",
    title: "Data Analyst with AI",
    tagline: "Analisis data secepat kilat dengan bantuan asisten AI.",
    level: "Menengah",
    duration: "7 jam 05 menit",
    lesson_count: 28,
    cover: "from-rose-400 to-orange-500",
    image: "/products/data-analyst-with-ai.svg",
    landing_url: "https://planet-ai.id/produk/data-analyst-with-ai",
    price: "Rp 599.000",
    status: "published",
    modules: [],
  },
  {
    slug: "ai-image-generation",
    title: "AI Image Generation Pro",
    tagline: "Hasilkan visual sinematik dengan Midjourney & Stable Diffusion.",
    level: "Lanjutan",
    duration: "9 jam 20 menit",
    lesson_count: 36,
    cover: "from-orange-400 to-amber-300",
    image: "/products/ai-image-generation.svg",
    landing_url: "https://planet-ai.id/produk/ai-image-generation",
    price: "Rp 899.000",
    status: "published",
    modules: [],
  },
];

// ─────────────────────────────────────────────────────────────────────────────

async function findOrCreateUser(data) {
  try {
    const list = await pb.collection("users").getFullList({
      filter: `email = "${data.email}"`,
      requestKey: null,
    });
    if (list.length > 0) {
      console.log(`  ↺ user ${data.email.padEnd(28)} sudah ada — skip`);
      return list[0];
    }
  } catch {}

  const created = await pb.collection("users").create(data);
  console.log(`  ✓ user ${data.email.padEnd(28)} dibuat (${data.role})`);
  return created;
}

async function findOrCreateBySlug(collection, slug, data) {
  try {
    const list = await pb.collection(collection).getFullList({
      filter: `slug = "${slug}"`,
      requestKey: null,
    });
    if (list.length > 0) return list[0];
  } catch {}
  return await pb.collection(collection).create(data);
}

console.log("→ Seeding users...\n");

const superUser = await findOrCreateUser({
  email: SUPER_EMAIL,
  password: SUPER_PASSWORD,
  passwordConfirm: SUPER_PASSWORD,
  emailVisibility: true,
  name: "Super Admin",
  role: "super_admin",
  status: "active",
});

const memberUser = await findOrCreateUser({
  email: MEMBER_EMAIL,
  password: MEMBER_PASSWORD,
  passwordConfirm: MEMBER_PASSWORD,
  emailVisibility: true,
  name: "Demo Member",
  role: "member",
  status: "active",
});

console.log("\n→ Seeding products + modules + lessons + resources...\n");

const productMap = {}; // slug → id

for (const prod of PRODUCTS) {
  const { modules, ...prodPayload } = prod;
  const product = await findOrCreateBySlug("products", prod.slug, prodPayload);
  productMap[prod.slug] = product.id;
  console.log(`  ✓ product ${prod.slug}`);

  for (const mod of modules) {
    const { lessons, ...modPayload } = mod;
    const module = await pb
      .collection("modules")
      .create({ ...modPayload, product: product.id });
    console.log(`    ↳ module: ${mod.title}`);

    for (const les of lessons) {
      const { resources, ...lesPayload } = les;
      const lesson = await pb
        .collection("lessons")
        .create({ ...lesPayload, module: module.id });
      console.log(`        ↳ lesson: ${les.title}`);

      for (const res of resources) {
        await pb
          .collection("resources")
          .create({ ...res, lesson: lesson.id });
      }
    }
  }
}

console.log("\n→ Granting demo member access to 2 products...\n");

async function grantPermission(userId, productId) {
  try {
    const list = await pb.collection("permissions").getFullList({
      filter: `user = "${userId}" && product = "${productId}"`,
      requestKey: null,
    });
    if (list.length > 0) return;
  } catch {}
  await pb.collection("permissions").create({
    user: userId,
    product: productId,
    status: "active",
    granted_at: new Date().toISOString(),
    progress: 0,
  });
}

await grantPermission(memberUser.id, productMap["prompt-engineering-mastery"]);
await grantPermission(memberUser.id, productMap["ai-automation-blueprint"]);

console.log("✓ Permissions granted\n");

// ─────────────────────────────────────────────────────────────────────────────

console.log("✅ Seed selesai.\n");
console.log("Login credentials demo:");
console.log("  Super Admin:");
console.log(`    Email    : ${SUPER_EMAIL}`);
console.log(`    Password : ${SUPER_PASSWORD}`);
console.log("  Member:");
console.log(`    Email    : ${MEMBER_EMAIL}`);
console.log(`    Password : ${MEMBER_PASSWORD}`);
console.log(
  "\n⚠️  Ganti password default di atas sebelum produksi (Settings → Users di dashboard)."
);
