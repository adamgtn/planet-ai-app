#!/usr/bin/env node
/**
 * Cepat commit & push tanpa hafal perintah git.
 *
 * Cara pakai:
 *   npm run push "pesan commit"          → push ke branch saat ini
 *   npm run push                          → minta pesan via prompt
 *
 *   npm run pr "judul perubahan"          → auto bikin branch baru +
 *                                            commit + push + buka URL PR
 *
 * Aman: kalau tidak ada perubahan, script exit tanpa apa-apa.
 */

import { execSync } from "node:child_process";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const MODE = process.argv[2] || "push"; // "push" or "pr"
const MESSAGE_FROM_CLI = process.argv.slice(3).join(" ").trim();

function run(cmd, opts = {}) {
  return execSync(cmd, { encoding: "utf8", stdio: "pipe", ...opts }).trim();
}

function runStream(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

async function ask(q) {
  const rl = readline.createInterface({ input, output });
  const ans = await rl.question(q);
  rl.close();
  return ans.trim();
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// ─────────────────────────────────────────────────────────────────────────────

const currentBranch = run("git branch --show-current");
console.log(`📍 Branch saat ini: ${currentBranch}\n`);

// Cek ada perubahan
const status = run("git status --porcelain");
if (!status) {
  console.log("✨ Tidak ada perubahan untuk di-commit. Tree clean.");
  process.exit(0);
}

console.log("📝 File yang berubah:");
console.log(
  status
    .split("\n")
    .map((l) => "   " + l)
    .join("\n")
);
console.log();

// Dapatkan commit message
let message = MESSAGE_FROM_CLI;
if (!message) {
  message = await ask("💬 Pesan commit: ");
  if (!message) {
    console.log("❌ Pesan kosong, batal.");
    process.exit(1);
  }
}

// ─── Mode PR: bikin branch baru ─────────────────────────────────────────────

if (MODE === "pr") {
  if (currentBranch !== "main") {
    console.log(
      `⚠️  Kamu sedang di branch '${currentBranch}', bukan 'main'.`
    );
    const confirm = await ask("   Tetap lanjut dan buat branch baru dari sini? (y/N): ");
    if (confirm.toLowerCase() !== "y") {
      console.log("Batal. Kalau ingin dari main: git checkout main && git pull");
      process.exit(0);
    }
  } else {
    // Update main dulu
    console.log("→ git pull origin main");
    try {
      runStream("git pull origin main");
    } catch {
      console.log("⚠️  git pull gagal, lanjut tanpa update.");
    }
  }

  const branchName = `feat/${slugify(message)}-${Date.now().toString(36).slice(-4)}`;
  console.log(`\n→ git checkout -b ${branchName}`);
  runStream(`git checkout -b ${branchName}`);
}

// ─── Common: add + commit + push ────────────────────────────────────────────

console.log("\n→ git add .");
runStream("git add .");

console.log(`→ git commit -m "${message}"`);
runStream(`git commit -m "${message}"`);

console.log("→ git push");
const branchToPush = MODE === "pr" ? run("git branch --show-current") : currentBranch;
try {
  runStream(`git push -u origin ${branchToPush}`);
} catch {
  console.log("❌ Push gagal. Cek error di atas.");
  process.exit(1);
}

// ─── Mode PR: kasih URL ─────────────────────────────────────────────────────

if (MODE === "pr") {
  const finalBranch = run("git branch --show-current");
  const remoteUrl = run("git remote get-url origin")
    .replace(/^git@github\.com:/, "https://github.com/")
    .replace(/\.git$/, "");
  const prUrl = `${remoteUrl}/pull/new/${finalBranch}`;
  console.log(`\n✅ Selesai. Buka PR di:\n   ${prUrl}\n`);

  // Coba buka browser otomatis (Windows)
  try {
    runStream(`start ${prUrl}`);
  } catch {}
} else {
  console.log(`\n✅ Selesai. Branch '${branchToPush}' updated.`);
  if (branchToPush === "main") {
    console.log("🚀 Deploy otomatis akan jalan di GitHub Actions.");
  }
}
