"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 700);
  };

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <section className="flex flex-col justify-between p-8 lg:p-12">
        <Logo />

        <div className="mx-auto w-full max-w-md py-12">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand">
              <ShieldCheck size={14} /> Member Area Eksklusif
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink">
              Selamat datang kembali
            </h1>
            <p className="mt-2 text-sm text-ink/65">
              Masuk untuk melanjutkan pembelajaran AI kamu di Planet AI Learning
              Center.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
                />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kamu@email.com"
                  className="input-base pl-10"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
                />
                <input
                  required
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-base pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-brand"
                  aria-label="Tampilkan password"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-ink/70">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-muted text-brand focus:ring-brand"
                />
                Ingat saya
              </label>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-brand hover:underline"
              >
                Lupa password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? "Memproses..." : "Masuk ke Member Area"}
            </button>
          </form>

          <div className="mt-8 rounded-xl border border-dashed border-muted bg-muted/40 p-4 text-xs text-ink/65">
            <p className="font-semibold text-ink">
              Belum memiliki akun member?
            </p>
            <p className="mt-1">
              Akun hanya dibuat oleh admin setelah pembelian. Hubungi tim Planet
              AI di WhatsApp untuk aktivasi.
            </p>
          </div>
        </div>

        <p className="text-xs text-ink/50">
          © {new Date().getFullYear()} Planet AI. All rights reserved.
        </p>
      </section>

      <aside className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand-600 to-orange-700" />
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_45%),radial-gradient(circle_at_80%_70%,white,transparent_45%)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2 text-white/90">
            <Sparkles size={20} /> <span className="text-sm font-semibold">Powered by Planet AI</span>
          </div>

          <div>
            <h2 className="text-4xl font-bold leading-tight">
              Belajar AI yang
              <br /> terstruktur, praktis, &<br /> langsung bisa dipakai.
            </h2>
            <p className="mt-4 max-w-md text-white/80">
              Dari prompt engineering, otomasi, hingga membangun produk SaaS
              berbasis AI. Semuanya dalam satu member area.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { v: "120+", l: "Video Tutorial" },
                { v: "30+", l: "Template AI" },
                { v: "5K+", l: "Member Aktif" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-2xl bg-white/10 p-4 backdrop-blur"
                >
                  <p className="text-2xl font-bold">{s.v}</p>
                  <p className="text-xs text-white/75">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <div />
        </div>
      </aside>
    </main>
  );
}
