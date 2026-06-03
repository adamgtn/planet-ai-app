/**
 * Buat akun member + kirim email kredensial — DARI FORM ADMIN.
 *
 * Beda dengan webhook orderonline (yang pakai shared-secret), route ini
 * diproteksi oleh TOKEN LOGIN ADMIN: caller harus mengirim
 *   Authorization: Bearer <token PocketBase admin>
 * Token diverifikasi via authRefresh + cek role admin/super_admin.
 *
 * Dipakai oleh halaman /admin/kirim-akses.
 */

import PocketBase from "pocketbase";
import { provisionMember } from "@/lib/provisionMember";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || "https://db.planet-ai.tech";

export async function POST(req: Request) {
  // 1) ambil token dari header Authorization
  const authz = req.headers.get("authorization") || "";
  const token = authz.startsWith("Bearer ") ? authz.slice(7).trim() : "";
  if (!token) {
    return Response.json({ ok: false, error: "Butuh login admin." }, { status: 401 });
  }

  // 2) verifikasi token = admin yang valid (lewat PocketBase)
  const pb = new PocketBase(PB_URL);
  pb.authStore.save(token, null);
  let role: string | undefined;
  try {
    const refreshed = await pb.collection("users").authRefresh();
    role = (refreshed.record as { role?: string }).role;
  } catch {
    return Response.json({ ok: false, error: "Sesi tidak valid, login ulang." }, { status: 401 });
  }
  if (role !== "admin" && role !== "super_admin") {
    return Response.json({ ok: false, error: "Khusus admin." }, { status: 403 });
  }

  // 3) baca input
  let body: { email?: string; name?: string; phone?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ ok: false, error: "Data tidak valid." }, { status: 400 });
  }
  const email = (body.email || "").trim();
  if (!email || !email.includes("@")) {
    return Response.json({ ok: false, error: "Email tidak valid." }, { status: 422 });
  }

  // 4) buat akun + kirim email (logika bersama dengan webhook)
  try {
    const result = await provisionMember({ email, name: body.name, phone: body.phone });
    return Response.json(result);
  } catch (e) {
    console.error("[admin/create-member] error:", (e as Error).message);
    return Response.json({ ok: false, error: "Gagal membuat akun. Cek koneksi PocketBase." }, { status: 500 });
  }
}
