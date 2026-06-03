/**
 * Webhook orderonline.id → auto-buat akun member setelah pembayaran Lunas.
 *
 * Alur:
 *   orderonline.id (status Lunas) --POST--> route ini
 *     1) verifikasi shared-secret (header x-webhook-secret / ?secret= / body.secret)
 *     2) auth ke PocketBase sebagai akun service ber-role "admin"
 *     3) create user role=member status=active (IDEMPOTENT — skip kalau email sudah ada)
 *     4) kirim email kredensial (kalau SMTP dikonfigurasi)
 *
 * Setup yang dibutuhkan (lihat .env.example):
 *   OO_WEBHOOK_SECRET, PB_SERVICE_EMAIL, PB_SERVICE_PASSWORD, SMTP_*
 *
 * Di orderonline.id: arahkan webhook ke
 *   https://planetsoft.id/api/orderonline/webhook?secret=<OO_WEBHOOK_SECRET>
 * dan set trigger HANYA saat status order = Lunas.
 *
 * CATATAN payload: nama field dari orderonline.id belum dipastikan, jadi
 * extraktornya defensif (coba beberapa nama umum). Payload mentah di-log
 * sekali (tanpa secret) supaya bisa dicek & dirapikan setelah order pertama.
 */

import { provisionMember } from "@/lib/provisionMember";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Ambil value pertama yang ada (non-kosong) dari beberapa kemungkinan key. */
function pick(obj: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number") return String(v);
  }
  return "";
}

/** Deteksi apakah status menandakan SUDAH bayar. Kalau status tidak dikenal,
 *  anggap valid (biar tidak gagal hanya karena beda istilah). */
function looksUnpaid(status: string): boolean {
  if (!status) return false;
  const s = status.toLowerCase();
  const unpaid = ["pending", "unpaid", "belum", "menunggu", "cancel", "batal", "expired", "gagal", "failed", "refund"];
  return unpaid.some((u) => s.includes(u));
}

async function parseBody(req: Request): Promise<Record<string, unknown>> {
  const ct = req.headers.get("content-type") || "";
  try {
    if (ct.includes("application/json")) {
      return (await req.json()) as Record<string, unknown>;
    }
    // form-urlencoded / multipart
    const fd = await req.formData();
    const obj: Record<string, unknown> = {};
    fd.forEach((v, k) => {
      obj[k] = typeof v === "string" ? v : String(v);
    });
    return obj;
  } catch {
    return {};
  }
}

export async function POST(req: Request) {
  const expected = process.env.OO_WEBHOOK_SECRET;
  if (!expected) {
    console.error("[oo-webhook] OO_WEBHOOK_SECRET belum di-set di env");
    return Response.json({ ok: false, error: "server not configured" }, { status: 500 });
  }

  const payload = await parseBody(req);

  // 1) verifikasi secret — terima dari header, query, atau body
  const provided =
    req.headers.get("x-webhook-secret") ||
    new URL(req.url).searchParams.get("secret") ||
    pick(payload, ["secret", "webhook_secret", "token"]);
  if (provided !== expected) {
    return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  // log payload (tanpa secret) sekali untuk inspeksi field — aman, server-side
  const { secret, webhook_secret, token, ...safePayload } = payload;
  void secret; void webhook_secret; void token;
  console.log("[oo-webhook] payload:", JSON.stringify(safePayload));

  // gate MailChimp: webhook MailChimp kirim field `type` (subscribe/unsubscribe/
  // profile/cleaned/upemail). Kita HANYA proses "subscribe". Sumber lain
  // (orderonline langsung) tidak kirim `type`, jadi tetap lolos.
  const eventType = pick(payload, ["type"]);
  if (eventType && eventType !== "subscribe") {
    return Response.json({ ok: true, skipped: "event bukan subscribe", type: eventType });
  }

  // gate: lewati kalau status jelas BELUM bayar
  const status = pick(payload, ["status", "order_status", "payment_status", "status_pembayaran"]);
  if (looksUnpaid(status)) {
    return Response.json({ ok: true, skipped: "belum lunas", status });
  }

  // Field extractor mendukung beberapa sumber:
  //  - orderonline langsung: email / customer_email / nama / dst
  //  - MailChimp webhook (form-encoded): data[email], data[merges][FNAME], dst
  const email = pick(payload, [
    "email", "customer_email", "buyer_email", "contact_email", "user_email",
    "data[email]", "data[merges][EMAIL]",
  ]).toLowerCase();
  if (!email || !email.includes("@")) {
    console.error("[oo-webhook] email tidak ditemukan di payload");
    return Response.json({ ok: false, error: "email tidak ada di payload" }, { status: 422 });
  }
  const name = pick(payload, [
    "name", "customer_name", "buyer_name", "nama", "full_name",
    "data[merges][FNAME]", "data[merges][NAME]",
  ]);
  const phone = pick(payload, [
    "phone", "customer_phone", "buyer_phone", "telepon", "hp", "whatsapp", "no_hp",
    "data[merges][PHONE]",
  ]);

  // buat akun + kirim email (logika bersama dengan form admin). Password TIDAK
  // diteruskan ke caller eksternal — cukup status created/emailed.
  try {
    const { password, ...result } = await provisionMember({ email, name, phone });
    void password;
    return Response.json(result);
  } catch (e) {
    console.error("[oo-webhook] provisionMember error:", (e as Error).message);
    return Response.json({ ok: false, error: "gagal buat akun" }, { status: 500 });
  }
}

/** GET untuk cek cepat endpoint hidup (tidak mengeksekusi apa pun). */
export async function GET() {
  return Response.json({ ok: true, service: "orderonline-webhook", method: "POST only" });
}
