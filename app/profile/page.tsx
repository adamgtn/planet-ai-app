"use client";

import { useState } from "react";
import { CheckCircle2, KeyRound, Mail, ShieldCheck, User } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { currentUser } from "@/lib/mockData";

export default function ProfilePage() {
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (newPwd.length < 8) {
      setError("Password baru minimal 8 karakter.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    setSuccess(true);
    setOldPwd("");
    setNewPwd("");
    setConfirmPwd("");
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <TopBar />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-ink">Profil Saya</h1>
          <p className="mt-1 text-sm text-ink/60">
            Kelola informasi akun dan keamanan kamu.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_1.4fr]">
          {/* Identity Card */}
          <section className="card-base p-6">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand text-white shadow-card">
                <User size={28} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-ink">
                  {currentUser.name}
                </h2>
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand">
                  <ShieldCheck size={12} /> {currentUser.role}
                </span>
              </div>
            </div>

            <dl className="mt-6 space-y-3 text-sm">
              <Row icon={<Mail size={16} />} label="Email">
                {currentUser.email}
              </Row>
              <Row icon={<User size={16} />} label="Member Sejak">
                {currentUser.joinedAt}
              </Row>
            </dl>

            <div className="mt-6 rounded-xl border border-dashed border-muted bg-muted/40 p-4 text-xs text-ink/65">
              Untuk mengubah email atau nama, silakan hubungi admin Planet AI.
            </div>
          </section>

          {/* Change Password */}
          <section className="card-base p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand">
                <KeyRound size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-ink">Ubah Password</h2>
                <p className="text-xs text-ink/60">
                  Pastikan password baru kamu kuat dan unik.
                </p>
              </div>
            </div>

            <form onSubmit={onChangePassword} className="space-y-4">
              <Field
                label="Password Lama"
                type="password"
                value={oldPwd}
                onChange={setOldPwd}
                placeholder="Masukkan password saat ini"
              />
              <Field
                label="Password Baru"
                type="password"
                value={newPwd}
                onChange={setNewPwd}
                placeholder="Minimal 8 karakter"
              />
              <Field
                label="Konfirmasi Password Baru"
                type="password"
                value={confirmPwd}
                onChange={setConfirmPwd}
                placeholder="Ulangi password baru"
              />

              {error && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
                  {error}
                </p>
              )}
              {success && (
                <p className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  <CheckCircle2 size={16} /> Password berhasil diperbarui.
                </p>
              )}

              <button type="submit" className="btn-primary w-full">
                Simpan Perubahan
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-muted bg-white px-3 py-2.5">
      <div className="flex items-center gap-2 text-ink/60">
        <span className="text-brand">{icon}</span>
        <span className="text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span className="text-sm font-semibold text-ink">{children}</span>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-base"
        required
      />
    </div>
  );
}
