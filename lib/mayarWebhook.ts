/**
 * Logika webhook Mayar — dipakai bersama oleh:
 *   - app/api/mayar/webhook          (secret via header x-callback-token/x-webhook-secret / ?secret=)
 *   - app/api/mayar/webhook/[secret] (secret via PATH — INI yang dipakai produksi,
 *                                     karena Mayar BUANG query string saat kirim)
 *
 * processMayarPayload: gate event → extract customer → provisionMember (idempotent).
 * Logika create akun SAMA dengan webhook orderonline & form admin (lib/provisionMember).
 */
import { provisionMember } from "@/lib/provisionMember";

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

  try {
    const { password, ...result } = await provisionMember({ email, name, phone });
    void password;
    return { status: 200, body: result };
  } catch (e) {
    console.error("[mayar-webhook] provisionMember error:", (e as Error).message);
    return { status: 500, body: { ok: false, error: "gagal buat akun" } };
  }
}
