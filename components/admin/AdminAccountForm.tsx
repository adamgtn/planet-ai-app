"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Crown,
  Lock,
  Mail,
  Save,
  ShieldCheck,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import {
  ADMIN_PERMISSIONS,
  type AdminAccount,
  type AdminRole,
} from "@/lib/adminData";
import { getPB } from "@/lib/pocketbase";

type Props = {
  mode: "create" | "edit";
  initial?: AdminAccount;
};

export function AdminAccountForm({ mode, initial }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [role, setRole] = useState<AdminRole>(initial?.role ?? "admin");
  const [active, setActive] = useState(initial?.active ?? true);
  const [tempPassword, setTempPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const pb = getPB();
      const status = active ? "active" : "suspended";
      if (mode === "create") {
        if (!tempPassword || tempPassword.length < 10) {
          throw new Error(
            "Password sementara minimal 10 karakter — klik Generate."
          );
        }
        await pb.collection("users").create({
          name,
          email,
          role,
          status,
          password: tempPassword,
          passwordConfirm: tempPassword,
          emailVisibility: true,
        });
      } else if (initial) {
        const payload: Record<string, unknown> = {
          name,
          role,
          status,
        };
        // Email = auth field dengan handling khusus di PocketBase. Cuma kirim
        // kalau benar-benar diubah, supaya update status/role nggak ke-blok.
        if (email !== initial.email) payload.email = email;
        if (tempPassword) {
          payload.password = tempPassword;
          payload.passwordConfirm = tempPassword;
        }
        await pb.collection("users").update(initial.id, payload);
      }
      setSuccess(true);
      setTimeout(() => router.push("/admin/admins"), 700);
    } catch (err) {
      setError(describePbError(err, "Gagal menyimpan akun admin."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initial) return;
    if (!window.confirm(`Hapus admin "${initial.name}"?`)) return;
    try {
      await getPB().collection("users").delete(initial.id);
      router.push("/admin/admins");
    } catch (err) {
      setError(describePbError(err, "Gagal menghapus admin."));
    }
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#";
    let p = "";
    for (let i = 0; i < 14; i++)
      p += chars.charAt(Math.floor(Math.random() * chars.length));
    setTempPassword(p);
  };

  const meta = ADMIN_PERMISSIONS[role];

  return (
    <form onSubmit={submit} className="space-y-6">
      <Link
        href="/admin/admins"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink/60 hover:text-brand"
      >
        <ArrowLeft size={14} /> Kembali ke daftar admin
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="card-base p-6">
            <h2 className="text-lg font-bold text-ink">Identitas Admin</h2>
            <p className="mt-1 text-xs text-ink/55">
              Email digunakan untuk login ke Admin Area.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Nama Lengkap"
                icon={<UserIcon size={16} />}
                value={name}
                onChange={setName}
                placeholder="Cth: Rini Kartika"
                required
              />
              <Field
                label="Email"
                icon={<Mail size={16} />}
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="admin@planet-ai.id"
                required
              />
            </div>
          </section>

          <section className="card-base p-6">
            <h2 className="text-lg font-bold text-ink">Pilih Role</h2>
            <p className="mt-1 text-xs text-ink/55">
              Hak akses akan diterapkan otomatis sesuai role.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(["admin", "super_admin"] as const).map((r) => {
                const m = ADMIN_PERMISSIONS[r];
                const active = role === r;
                const isSuper = r === "super_admin";
                return (
                  <label
                    key={r}
                    className={`relative cursor-pointer rounded-2xl border p-4 transition ${
                      active
                        ? "border-brand bg-brand-50/60 shadow-card"
                        : "border-muted bg-white hover:border-brand/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      checked={active}
                      onChange={() => setRole(r)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-10 w-10 place-items-center rounded-xl ${
                          active
                            ? "bg-brand text-white"
                            : isSuper
                            ? "bg-amber-50 text-amber-600"
                            : "bg-muted text-ink/65"
                        }`}
                      >
                        {isSuper ? <Crown size={18} /> : <ShieldCheck size={18} />}
                      </span>
                      <div>
                        <p className="font-bold text-ink">{m.label}</p>
                        <p className="text-[11px] text-ink/55">
                          {m.description}
                        </p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="mt-5 rounded-xl border border-muted bg-muted/40 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink/55">
                Kapabilitas {meta.label}
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-ink/75">
                {meta.capabilities.map((c) => (
                  <li key={c} className="inline-flex items-center gap-2">
                    <CheckCircle2
                      size={14}
                      className={
                        role === "super_admin" && c.includes("Admin")
                          ? "text-amber-500"
                          : "text-emerald-500"
                      }
                    />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="card-base p-6">
            <h2 className="text-lg font-bold text-ink">
              {mode === "create" ? "Password Sementara" : "Reset Password"}
            </h2>
            <p className="mt-1 text-xs text-ink/55">
              {mode === "create"
                ? "Akan dikirim ke admin via email saat akun dibuat."
                : "Hanya isi jika ingin mereset password admin ini."}
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
                />
                <input
                  type="text"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  placeholder="Klik 'Generate' untuk membuat password aman"
                  className="input-base pl-9 font-mono"
                />
              </div>
              <button
                type="button"
                onClick={generatePassword}
                className="btn-ghost"
              >
                Generate
              </button>
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <section className="card-base p-6">
            <h2 className="text-lg font-bold text-ink">Status</h2>
            <p className="mt-1 text-xs text-ink/55">
              Nonaktifkan untuk mencabut akses login admin tanpa menghapus akun.
            </p>

            <label className="mt-4 flex cursor-pointer items-center justify-between rounded-xl border border-muted bg-white p-3">
              <div>
                <p className="text-sm font-semibold text-ink">
                  {active ? "Akun Aktif" : "Akun Nonaktif"}
                </p>
                <p className="text-[11px] text-ink/55">
                  {active
                    ? "Admin bisa login & menjalankan tugas."
                    : "Admin tidak bisa login sampai diaktifkan."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActive((v) => !v)}
                aria-label="Toggle status"
                className={`relative h-6 w-11 rounded-full transition ${
                  active ? "bg-brand" : "bg-ink/20"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                    active ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </label>
          </section>

          <section className="card-base space-y-3 p-6">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full"
            >
              <Save size={16} />
              {submitting
                ? "Menyimpan..."
                : mode === "create"
                ? "Buat Akun Admin"
                : "Simpan Perubahan"}
            </button>
            {error && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
                {error}
              </p>
            )}
            {success && (
              <p className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-50 py-2 text-sm text-emerald-700">
                <CheckCircle2 size={14} /> Tersimpan.
              </p>
            )}
            <Link
              href="/admin/admins"
              className="btn-ghost w-full justify-center"
            >
              Batal
            </Link>

            {mode === "edit" && initial?.role !== "super_admin" && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/40 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                <Trash2 size={14} /> Hapus Admin
              </button>
            )}
          </section>
        </aside>
      </div>
    </form>
  );
}

/**
 * Ambil pesan error PocketBase yang informatif — termasuk error per-field
 * (mis. "role: tidak valid") yang biasanya kesembunyi di balik pesan umum
 * "Failed to update record." / "Failed to create record."
 */
function describePbError(err: unknown, fallback: string): string {
  const e = err as {
    message?: string;
    data?: {
      message?: string;
      data?: Record<string, { message?: string; code?: string }>;
    };
    response?: {
      message?: string;
      data?: Record<string, { message?: string; code?: string }>;
    };
  };
  const body = e?.response ?? e?.data;
  const top = body?.message || e?.message || fallback;
  const fields = body?.data;
  if (fields && typeof fields === "object" && Object.keys(fields).length) {
    const parts = Object.entries(fields).map(
      ([k, v]) => `${k}: ${v?.message || v?.code || "tidak valid"}`
    );
    return `${top} → ${parts.join("; ")}`;
  }
  return top;
}

function Field({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  icon?: React.ReactNode;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`input-base ${icon ? "pl-9" : ""}`}
        />
      </div>
    </div>
  );
}
