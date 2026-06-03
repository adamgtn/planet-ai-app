"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";

/**
 * Login khusus ADMIN area (terpisah dari login member di /app).
 * Halaman ini SENGAJA tidak dibungkus AdminShell (biar tidak ke-gate sendiri)
 * dan tidak ikut redirect /login → /app.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const { login, loading, isAuthenticated, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sudah login sebagai admin → langsung ke /admin
  useEffect(() => {
    if (!loading && isAuthenticated && isAdmin) router.replace("/admin");
  }, [loading, isAuthenticated, isAdmin, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/admin");
    } catch {
      setError("Email atau password salah.");
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-muted/40 to-white px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-3xl border border-muted bg-white p-7 shadow-card">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand">
            <ShieldCheck size={14} /> Admin Area
          </span>
          <h1 className="mt-3 text-2xl font-bold text-ink">Login Admin</h1>
          <p className="mt-1 text-sm text-ink/60">
            Masuk untuk mengelola member &amp; kirim akses.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
                />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@email.com"
                  className="input-base pl-9"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Password</label>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
                />
                <input
                  required
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-base pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-brand"
                  aria-label="Tampilkan password"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="inline-flex w-full items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
                <AlertCircle size={14} /> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center py-3 disabled:opacity-60"
            >
              {submitting ? "Memproses…" : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
