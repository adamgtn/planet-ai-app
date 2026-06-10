/**
 * Webhook Mayar (secret di PATH) — INI yang didaftarkan di Dashboard Mayar:
 *   https://planetsoft.id/api/mayar/webhook/<MAYAR_WEBHOOK_SECRET>
 *
 * Kenapa path, bukan query: Mayar BUANG query string (?secret=) saat kirim
 * webhook (terbukti dari Test URL yang gagal). Path segment aman, nggak dibuang.
 */
import { parseJsonBody, processMayarPayload } from "@/lib/mayarWebhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { secret: string } }) {
  console.log("[mayar-webhook] POST hit (path-secret route)");
  const expected = process.env.MAYAR_WEBHOOK_SECRET;
  if (!expected) {
    return Response.json({ ok: false, error: "server not configured" }, { status: 500 });
  }
  if (params.secret !== expected) {
    return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const { status, body } = await processMayarPayload(await parseJsonBody(req));
  return Response.json(body, { status });
}

/** GET untuk verifikasi setup: konfirmasi secret di path cocok (tanpa bocorin nilainya). */
export async function GET(_req: Request, { params }: { params: { secret: string } }) {
  const expected = process.env.MAYAR_WEBHOOK_SECRET;
  const secretOk = !!expected && params.secret === expected;
  return Response.json({
    ok: true,
    service: "mayar-webhook (path-secret)",
    method: "POST only",
    secretOk,
  });
}
