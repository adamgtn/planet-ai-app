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

export type ProvisionResult = {
  ok: true;
  created: boolean;
  emailed: boolean;
  email: string;
  /** Password plain — HANYA terisi saat akun baru dibuat. Jangan diteruskan
   *  ke caller eksternal (webhook); aman untuk admin yang terautentikasi. */
  password?: string;
  note?: string;
};

/**
 * Bikin akun member + kirim email kredensial. Idempotent: kalau email sudah
 * ada, tidak bikin dobel & tidak kirim email lagi.
 * Throw kalau auth service gagal / create gagal — caller harus catch.
 */
export async function provisionMember(input: {
  email: string;
  name?: string;
  phone?: string;
}): Promise<ProvisionResult> {
  const email = input.email.trim().toLowerCase();

  const pb = new PocketBase(PB_URL);
  await pb
    .collection("users")
    .authWithPassword(process.env.PB_SERVICE_EMAIL || "", process.env.PB_SERVICE_PASSWORD || "");

  // idempotent: skip kalau email sudah terdaftar
  const existing = await pb
    .collection("users")
    .getFirstListItem(pb.filter("email = {:email}", { email }))
    .catch(() => null);
  if (existing) {
    return { ok: true, created: false, emailed: false, email, note: "akun sudah ada" };
  }

  const password = genPassword();
  await pb.collection("users").create({
    email,
    name: input.name?.trim() || email.split("@")[0],
    phone: input.phone?.trim() || "",
    role: "member",
    status: "active",
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

  return { ok: true, created: true, emailed, email, password };
}
