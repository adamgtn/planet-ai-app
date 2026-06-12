/**
 * Logika webhook Mayar — dipakai bersama oleh:
 *   - app/api/mayar/webhook          (secret via header x-callback-token/x-webhook-secret / ?secret=)
 *   - app/api/mayar/webhook/[secret] (secret via PATH — INI yang dipakai produksi,
 *                                     karena Mayar BUANG query string saat kirim)
 *
 * processMayarPayload: gate event → extract customer → provisionMember (idempotent).
 * Logika create akun SAMA dengan webhook orderonline & form admin (lib/provisionMember).
 */
import { provisionMember, type MemberTier } from "@/lib/provisionMember";

export async function parseJsonBody(req: Request): Promise<Record<string, unknown>> {
  try {
    const j = await req.json();
    return j && typeof j === "object" ? (j as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

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

// Event Mayar yang "beri akses" (bayar sukses / member baru / upgrade tier).
// Event lain (payment.reminder, membership.memberExpired/Unsubscribed,
// shipper.status, "testing", dll) diabaikan → balik 200 skipped.
const GRANT_EVENTS = new Set([
  "payment.received",
  "membership.newMemberRegistered",
  "membership.changeTierMemberRegistered",
]);

/**
 * Tentukan paket (tier) dari info produk di payload Mayar.
 * Prioritas: keyword di nama produk → fallback nominal transaksi.
 * Kalau dua-duanya nggak ketahuan → starter (tier terendah, aman — nggak
 * pernah ngasih VIP gratis), dengan log warning supaya bisa dirapikan.
 */
export function resolveTier(productName: string, amount: number): MemberTier {
  const n = productName.toLowerCase();
  if (/\bvip\b/.test(n)) return "vip";
  if (/aplikasi|full[ -]?stack|resell/.test(n)) return "aplikasi";
  if (/standar|starter/.test(n)) return "starter";

  // fallback: tebak dari nominal (harga promo/normal: starter ≤99k,
  // vip 149–299k, aplikasi 799k+). Batas dibikin longgar.
  if (amount >= 500_000) return "aplikasi";
  if (amount >= 120_000) return "vip";
  if (amount > 0) return "starter";

  console.warn(
    `[mayar-webhook] tier tidak dikenali (product="${productName}", amount=${amount}) — default starter`
  );
  return "starter";
}

export async function processMayarPayload(
  payload: Record<string, unknown>
): Promise<{ status: number; body: unknown }> {
  const data = asRecord(payload.data);

  // log sekali untuk inspeksi (server-side, aman — payload Mayar tidak memuat secret)
  console.log(
    "[mayar-webhook] event:",
    JSON.stringify(payload.event),
    "payload:",
    JSON.stringify(payload).slice(0, 1500)
  );

  // gate event — hanya proses event "beri akses"
  const event = pick([payload], ["event", "type"]);
  if (event && !GRANT_EVENTS.has(event)) {
    return { status: 200, body: { ok: true, skipped: "event diabaikan", event } };
  }

  // extract customer (Mayar: data.customerEmail/customerName/customerMobile) + fallback defensif
  const email = pick(
    [data, payload],
    ["customerEmail", "email", "customer_email", "buyer_email"]
  ).toLowerCase();
  if (!email || !email.includes("@")) {
    console.error("[mayar-webhook] email tidak ditemukan di payload");
    return { status: 422, body: { ok: false, error: "email tidak ada di payload" } };
  }
  const name = pick([data, payload], ["customerName", "name", "customer_name", "buyer_name"]);
  const phone = pick(
    [data, payload],
    ["customerMobile", "mobile", "customer_phone", "phone", "hp", "whatsapp"]
  );

  // tentukan paket dari produk yang dibeli (payload Mayar: data.productName/
  // productId/amount). productId ikut di-log supaya mapping bisa di-harden
  // pakai id persis kalau diperlukan nanti.
  const productName = pick([data, payload], ["productName", "product_name"]);
  const productId = pick([data, payload], ["productId", "product_id"]);
  const amount = Number(pick([data, payload], ["amount", "total", "nominal"])) || 0;
  const tier = resolveTier(productName, amount);
  console.log(
    `[mayar-webhook] tier=${tier} (product="${productName}" id="${productId}" amount=${amount})`
  );

  try {
    const { password, ...result } = await provisionMember({ email, name, phone, tier });
    void password;
    return { status: 200, body: result };
  } catch (e) {
    console.error("[mayar-webhook] provisionMember error:", (e as Error).message);
    return { status: 500, body: { ok: false, error: "gagal buat akun" } };
  }
}
