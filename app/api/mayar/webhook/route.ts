/**
 * Webhook Mayar (base) — verifikasi secret via header `x-callback-token` /
 * `x-webhook-secret` atau query `?secret=`.
 *
 * ⚠️ CATATAN: Mayar BUANG query string saat kirim webhook (test URL terbukti
 * gagal pakai ?secret=). Jadi yang dipakai di Dashboard Mayar adalah route PATH:
 *   https://planetsoft.id/api/mayar/webhook/<MAYAR_WEBHOOK_SECRET>   (./[secret]/route.ts)
 * Route ini tetap ada untuk pengirim lain yang kirim secret via header/query.
 */
import { parseJsonBody, processMayarPayload } from "@/lib/mayarWebhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const expected = process.env.MAYAR_WEBHOOK_SECRET;
  if (!expected) {
    return Response.json({ ok: false, error: "server not configured" }, { status: 500 });
  }
  const provided =
    req.headers.get("x-callback-token") ||
    req.headers.get("x-webhook-secret") ||
    new URL(req.url).searchParams.get("secret") ||
    "";
  if (provided !== expected) {
    return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const { status, body } = await processMayarPayload(await parseJsonBody(req));
  return Response.json(body, { status });
}

export async function GET() {
  return Response.json({
    ok: true,
    service: "mayar-webhook",
    method: "POST only",
    hint: "Mayar buang query — daftarkan /api/mayar/webhook/<secret> (secret di path)",
  });
}
