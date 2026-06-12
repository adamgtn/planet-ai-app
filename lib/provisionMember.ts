/**
 * Logika inti: bikin akun member di PocketBase (idempotent) + kirim email
 * kredensial. Dipakai bersama oleh:
 *   - webhook orderonline/MailChimp (app/api/orderonline/webhook)
 *   - form admin "Kirim Akses" (app/api/admin/create-member)
 *
 * SERVER-ONLY. Auth ke PocketBase pakai akun service (PB_SERVICE_*).
 */

import "server-only";
import PocketBase from "pocketbase";
import { sendCredentialEmail, mailerReady } from "@/lib/mailer";

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || "https://db.planet-ai.tech";

/** Password acak ramah-ketik (tanpa karakter ambigu seperti O/0/l/1). */
export function genPassword(len = 10): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  const rnd = new Uint32Array(len);
  crypto.getRandomValues(rnd);
  for (let i = 0; i < len; i++) out += chars[rnd[i] % chars.length];
  return out;
}

/** Paket yang dibeli member. Urutan rank: starter < vip < aplikasi. */
export type MemberTier = "starter" | "vip" | "aplikasi";

const TIER_RANK: Record<MemberTier, number> = {
  starter: 1,
  vip: 2,
  aplikasi: 3,
};

/** Paket → role yang dipakai app /app (AI Studio) untuk gate fitur VIP.
 *  VIP & Aplikasi sama-sama dapat akses VIP (role "vip"); Starter = "member". */
function tierToRole(tier?: MemberTier): "member" | "vip" {
  return tier === "vip" || tier === "aplikasi" ? "vip" : "member";
}

export type ProvisionResult = {
  ok: true;
  created: boolean;
  emailed: boolean;
  email: string;
  /** Tier akun setelah provisioning (kalau diketahui). */
  tier?: MemberTier;
  /** Password plain — HANYA terisi saat akun baru dibuat. Jangan diteruskan
   *  ke caller eksternal (webhook); aman untuk admin yang terautentikasi. */
  password?: string;
  note?: string;
};

/**
 * Bikin akun member + kirim email kredensial. Idempotent: kalau email sudah
 * ada, tidak bikin dobel & tidak kirim email lagi — TAPI tier tetap di-upgrade
 * kalau pembelian baru lebih tinggi (mis. member Starter beli VIP). Tier tidak
 * pernah diturunkan otomatis.
 * Throw kalau auth service gagal / create gagal — caller harus catch.
 */
export async function provisionMember(input: {
  email: string;
  name?: string;
  phone?: string;
  /** Paket yang dibeli (dari webhook Mayar / form admin). Kosong = tidak diubah. */
  tier?: MemberTier;
}): Promise<ProvisionResult> {
  const email = input.email.trim().toLowerCase();

  const pb = new PocketBase(PB_URL);
  await pb
    .collection("users")
    .authWithPassword(process.env.PB_SERVICE_EMAIL || "", process.env.PB_SERVICE_PASSWORD || "");

  // idempotent: kalau email sudah terdaftar, jangan bikin dobel — tapi cek
  // upgrade tier + role (member → vip). Role admin/super_admin TIDAK diubah.
  const existing = await pb
    .collection("users")
    .getFirstListItem<{ id: string; tier?: MemberTier; role?: string }>(
      pb.filter("email = {:email}", { email })
    )
    .catch(() => null);
  if (existing) {
    const oldTier = existing.tier;
    const oldRole = existing.role;
    const newTier = input.tier;
    const updates: Record<string, unknown> = {};

    // tier: naik kalau lebih tinggi (atau lama kosong); tidak pernah turun
    if (newTier && (!oldTier || TIER_RANK[newTier] > TIER_RANK[oldTier])) {
      updates.tier = newTier;
    }
    // role: member → vip. JANGAN demote vip→member, JANGAN sentuh admin/super_admin
    if (
      oldRole !== "admin" &&
      oldRole !== "super_admin" &&
      oldRole !== "vip" &&
      tierToRole(newTier) === "vip"
    ) {
      updates.role = "vip";
    }

    if (Object.keys(updates).length > 0) {
      await pb.collection("users").update(existing.id, updates);
      const parts: string[] = [];
      if (updates.tier) parts.push(`tier ${oldTier ?? "—"} → ${updates.tier}`);
      if (updates.role) parts.push("role → vip");
      return {
        ok: true,
        created: false,
        emailed: false,
        email,
        tier: (updates.tier as MemberTier) ?? oldTier,
        note: `akun sudah ada — di-upgrade (${parts.join(", ")})`,
      };
    }
    return {
      ok: true,
      created: false,
      emailed: false,
      email,
      tier: oldTier,
      note: "akun sudah ada",
    };
  }

  const password = genPassword();
  await pb.collection("users").create({
    email,
    name: input.name?.trim() || email.split("@")[0],
    phone: input.phone?.trim() || "",
    role: tierToRole(input.tier),
    status: "active",
    ...(input.tier ? { tier: input.tier } : {}),
    password,
    passwordConfirm: password,
    emailVisibility: true,
  });

  let emailed = false;
  if (mailerReady()) {
    try {
      await sendCredentialEmail({ to: email, name: input.name || "", password });
      emailed = true;
    } catch (e) {
      console.error("[provisionMember] gagal kirim email:", (e as Error).message);
    }
  } else {
    console.warn("[provisionMember] SMTP belum dikonfigurasi — akun dibuat tanpa email:", email);
  }

  return { ok: true, created: true, emailed, email, tier: input.tier, password };
}
