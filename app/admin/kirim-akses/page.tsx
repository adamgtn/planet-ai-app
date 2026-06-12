"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Crown,
  Info,
  Mail,
  Phone,
  Send,
  User as UserIcon,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getPB } from "@/lib/pocketbase";

type Result =
  | {
      ok: true;
      created: boolean;
      emailed: boolean;
      email: string;
      password?: string;
      note?: string;
    }
  | { ok: false; error: string };

export default function KirimAksesPage() {
  // Gating ditangani oleh AdminShell (cek admin + redirect).
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tier, setTier] = useState("starter");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setCopied(false);
    try {
      const token = getPB().authStore.token;
      const res = await fetch("/api/admin/create-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, name, phone, tier }),
      });
      const data = (await res.json()) as Result;
      setResult(data);
      if (data.ok && data.created) {
        setEmail("");
        setName("");
        setPhone("");
        setTier("starter");
      }
    } catch {
      setResult({ ok: false, error: "Gagal menghubungi server. Coba lagi." });
    } finally {
      setLoading(false);
    }
  };

  const copyPwd = (pwd: string) => {
    navigator.clipboard?.writeText(pwd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AdminShell
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Kirim Akses" }]}
      title="Kirim Akses Member"
      description="Masukkan email pembeli → akun otomatis dibuat & email login langsung dikirim ke pembeli."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <form onSubmit={submit} className="card-base space-y-5 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Email pembeli <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pembeli@email.com"
                className="input-base pl-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Nama <span className="text-ink/40">(opsional)</span>
              </label>
              <div className="relative">
                <UserIcon
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama pembeli"
                  className="input-base pl-9"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                No. HP <span className="text-ink/40">(opsional)</span>
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
                />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812xxxx"
                  className="input-base pl-9"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Paket yang dibeli
            </label>
            <div className="relative">
              <Crown
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
              />
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="input-base pl-9"
              >
                <option value="starter">Paket UMKM Starter</option>
                <option value="vip">Paket VIP Member</option>
                <option value="aplikasi">Paket Aplikasi (Resell)</option>
              </select>
            </div>
            <p className="mt-1.5 text-xs text-ink/55">
              Kalau email sudah punya akun, paket hanya akan naik (tidak pernah
              turun otomatis).
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3 disabled:opacity-60"
          >
            <Send size={16} /> {loading ? "Memproses…" : "Buat Akun & Kirim Email"}
          </button>

          {/* Hasil */}
          {result && result.ok && result.created && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <p className="flex items-center gap-2 font-semibold">
                <CheckCircle2 size={16} /> Akun dibuat
                {result.emailed ? " & email terkirim" : ""}!
              </p>
              <p className="mt-1 text-emerald-700/90">
                {result.email}
                {result.emailed
                  ? " — email login sudah meluncur ke pembeli."
                  : ""}
              </p>
              {!result.emailed && (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800">
                  <p className="font-semibold">⚠️ Email gagal terkirim.</p>
                  <p className="mt-1">
                    Akun tetap aktif. Kirim manual ke pembeli — password:
                  </p>
                  {result.password && (
                    <div className="mt-2 flex items-center gap-2">
                      <code className="rounded bg-white px-2 py-1 font-mono text-ink">
                        {result.password}
                      </code>
                      <button
                        type="button"
                        onClick={() => copyPwd(result.password!)}
                        className="inline-flex items-center gap-1 rounded-lg border border-amber-300 px-2 py-1 text-xs font-semibold hover:bg-amber-100"
                      >
                        <Copy size={12} /> {copied ? "Tersalin" : "Salin"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {result && result.ok && !result.created && (
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
              <p className="flex items-center gap-2 font-semibold">
                <Info size={16} /> {result.email} sudah punya akun.
              </p>
              <p className="mt-1 text-sky-700/90">
                {result.note && result.note !== "akun sudah ada"
                  ? result.note + "."
                  : "Tidak dibuat ulang (biar tidak dobel). Kalau lupa password, pakai reset di dashboard PocketBase."}
              </p>
            </div>
          )}

          {result && !result.ok && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <p className="flex items-center gap-2 font-semibold">
                <AlertCircle size={16} /> {result.error}
              </p>
            </div>
          )}
        </form>

        {/* Panduan */}
        <aside className="card-base h-fit p-6 text-sm text-ink/70">
          <h2 className="text-base font-bold text-ink">Cara pakai</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-4">
            <li>Cek pembeli sudah benar-benar bayar di Mayar.</li>
            <li>Masukkan email (dan nama) pembeli, pilih paketnya, klik tombol.</li>
            <li>
              Akun member otomatis dibuat & email login dikirim ke pembeli lewat
              Brevo.
            </li>
            <li>Pembeli login di planetsoft.id/app.</li>
          </ol>
          <p className="mt-4 rounded-lg bg-muted/60 p-3 text-xs">
            Kalau email yang sama dimasukkan 2×, sistem tidak akan bikin akun
            dobel — aman.
          </p>
        </aside>
      </div>
    </AdminShell>
  );
}
