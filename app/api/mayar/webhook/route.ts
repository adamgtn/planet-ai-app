/**
 * Webhook Mayar → auto-buat akun member setelah pembayaran sukses.
 *
 * Alur:
 *   Mayar (event payment.received / membership.*Registered) --POST JSON--> route ini
 *     1) verifikasi shared-secret (header x-callback-token / x-webhook-secret / ?secret=)
 *     2) gate event: HANYA proses event "kasih akses" (bayar sukses / member baru/upgrade)
 *     3) provisionMember (idempotent) — create user role=member + email kredensial
 *
 * Setup yang dibutuhkan:
 *   - GitHub Secrets: MAYAR_WEBHOOK_SECRET (deploy.yml nulis ke .env.production.local).
 *     Lihat pola secret: dokumentasi internal "secrets bukan di .env.production".
 *   - Dashboard Mayar → Webhook → daftarkan URL:
 *       https://planetsoft.id/api/mayar/webhook?secret=<MAYAR_WEBHOOK_SECRET>
 *     (kalau Mayar kirim header x-callback-token, isi token-nya = secret yang sama).
 *
 * Payload Mayar (docs.mayar.id/integration/webhook): JSON, field `event`
 * (mis. "payment.received") + objek `data` berisi customerEmail / customerName /
 * customerMobile. Extractor dibikin defensif + payload di-log sekali (tanpa
 * secret) supaya bisa dicek & dirapikan setelah transaksi pertama.
 *
 * Logika create akun SAMA dengan webhook orderonline & form admin: lib/provisionMember.
 */

import { provisionMember } from "@/lib/provisionMember";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

/** Ambil string non-kosong pertama dari beberapa kemungkinan key, dicari di
 *  beberapa objek (mis. payload.data lalu payload root). */
function pick(objs: Record<string, unknown>[], keys: string[]): string {
  for (const obj of objs) {
    for (const k of keys) {
      const val = obj[k];
      if (typeof val === "string" && val.trim()) return val.trim();
      if (typeof val === "number") return String(val);
    }
  }
  return "";
}

// Event Mayar yang menandakan "beri akses" (bayar sukses / member baru / upgrade tier).
// Event lain (reminder, expired, unsubscribed, shipper.status, ping/test) diabaikan.
const GRANT_EVENTS = new Set([
  "payment.received",
  "membership.newMemberRegistered",
  "membership.changeTierMemberRegistered",
]);

export async function POST(req: Request) {
  const expected = process.env.MAYAR_WEBHOOK_SECRET;
  if (!expected) {
    console.error("[mayar-webhook] MAYAR_WEBHOOK_SECRET belum di-set di env");
    return Response.json({ ok: false, error: "server not configured" }, { status: 500 });
  }

  // 1) verifikasi secret — terima dari header (x-callback-token / x-webhook-secret) atau ?secret=
  const provided =
    req.headers.get("x-callback-token") ||
    req.headers.get("x-webhook-secret") ||
    new URL(req.url).searchParams.get("secret") ||
    "";
  if (provided !== expected) {
    return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = asRecord(await req.json());
  } catch {
    return Response.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const data = asRecord(payload.data);

  // log payload (server-side, aman — secret tidak ada di body) sekali untuk inspeksi field.
  console.log(
    "[mayar-webhook] event:",
    JSON.stringify(payload.event),
    "payload:",
    JSON.stringify(payload).slice(0, 1500)
  );

  // 2) gate event — hanya proses event "beri akses".
  const event = pick([payload], ["event", "type"]);
  if (event && !GRANT_EVENTS.has(event)) {
    return Response.json({ ok: true, skipped: "event diabaikan", event });
  }

  // 3) extract customer (Mayar: data.customerEmail/customerName/customerMobile) + fallback defensif.
  const email = pick(
    [data, payload],
    ["customerEmail", "email", "customer_email", "buyer_email"]
  ).toLowerCase();
  if (!email || !email.includes("@")) {
    console.error("[mayar-webhook] email tidak ditemukan di payload");
    return Response.json({ ok: false, error: "email tidak ada di payload" }, { status: 422 });
  }
  const name = pick([data, payload], ["customerName", "name", "customer_name", "buyer_name"]);
  const phone = pick(
    [data, payload],
    ["customerMobile", "mobile", "customer_phone", "phone", "hp", "whatsapp"]
  );

  // buat akun + kirim email (logika bersama dengan webhook orderonline & form admin).
  // Password TIDAK diteruskan ke caller eksternal.
  try {
    const { password, ...result } = await provisionMember({ email, name, phone });
    void password;
    return Response.json(result);
  } catch (e) {
    console.error("[mayar-webhook] provisionMember error:", (e as Error).message);
    return Response.json({ ok: false, error: "gagal buat akun" }, { status: 500 });
  }
}

/** GET untuk cek cepat endpoint hidup (tidak mengeksekusi apa pun). */
export async function GET() {
  return Response.json({ ok: true, service: "mayar-webhook", method: "POST only" });
}
