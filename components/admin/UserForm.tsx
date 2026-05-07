"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Mail,
  Save,
  ShieldCheck,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import type { AdminUser, UserStatus } from "@/lib/adminData";
import { makeId, useDataStore } from "@/lib/dataStore";

type Props = {
  mode: "create" | "edit";
  initial?: AdminUser;
};

const STATUS_OPTIONS: { id: UserStatus; label: string; hint: string }[] = [
  { id: "active", label: "Aktif", hint: "Bisa login dan akses produk" },
  {
    id: "suspended",
    label: "Suspended",
    hint: "Akun ditangguhkan sementara",
  },
  {
    id: "expired",
    label: "Kedaluwarsa",
    hint: "Akses berakhir, tidak bisa login",
  },
];

export function UserForm({ mode, initial }: Props) {
  const router = useRouter();
  const { products, upsertUser, removeUser } = useDataStore();
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [status, setStatus] = useState<UserStatus>(initial?.status ?? "active");
  const [tempPassword, setTempPassword] = useState("");
  const [permissions, setPermissions] = useState<string[]>(
    initial?.permissions ?? []
  );
  const [success, setSuccess] = useState(false);

  const togglePermission = (id: string) => {
    setPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const allChecked = permissions.length === products.length;
  const toggleAll = () => {
    setPermissions(allChecked ? [] : products.map((p) => p.id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const id = initial?.id ?? makeId("u");
    const today = new Date().toISOString().slice(0, 10);
    const payload: AdminUser = {
      id,
      name,
      email,
      status,
      permissions,
      joinedAt: initial?.joinedAt ?? today,
      lastLoginAt: initial?.lastLoginAt ?? "—",
    };

    upsertUser(payload);
    setSuccess(true);
    setTimeout(() => router.push("/admin/users"), 700);
  };

  const handleDelete = () => {
    if (!initial) return;
    if (!window.confirm(`Hapus akun "${initial.name}"?`)) return;
    removeUser(initial.id);
    router.push("/admin/users");
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#";
    let p = "";
    for (let i = 0; i < 12; i++)
      p += chars.charAt(Math.floor(Math.random() * chars.length));
    setTempPassword(p);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink/60 hover:text-brand"
      >
        <ArrowLeft size={14} /> Kembali ke daftar member
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: Identity & Auth */}
        <div className="space-y-6">
          <section className="card-base p-6">
            <h2 className="text-lg font-bold text-ink">Identitas Member</h2>
            <p className="mt-1 text-xs text-ink/55">
              Data ini ditampilkan di profil member.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Nama Lengkap"
                icon={<UserIcon size={16} />}
                value={name}
                onChange={setName}
                placeholder="Cth: Adam Hidayat"
                required
              />
              <Field
                label="Email"
                icon={<Mail size={16} />}
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="member@email.com"
                required
              />
            </div>
          </section>

          <section className="card-base p-6">
            <h2 className="text-lg font-bold text-ink">
              {mode === "create" ? "Password Sementara" : "Reset Password"}
            </h2>
            <p className="mt-1 text-xs text-ink/55">
              {mode === "create"
                ? "Password awal yang akan dikirim ke member. Member dapat menggantinya saat login pertama."
                : "Hanya isi jika kamu ingin mereset password member ini."}
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

          <section className="card-base p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-ink">
                  Hak Akses Produk
                </h2>
                <p className="mt-1 text-xs text-ink/55">
                  Centang produk yang bisa diakses oleh member ini.
                </p>
              </div>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs font-semibold text-brand hover:underline"
              >
                {allChecked ? "Hapus semua" : "Pilih semua"}
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {products.map((p) => {
                const checked = permissions.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                      checked
                        ? "border-brand bg-brand-50/60"
                        : "border-muted bg-white hover:border-brand/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePermission(p.id)}
                      className="mt-1 h-4 w-4 rounded border-muted text-brand focus:ring-brand"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink">
                        {p.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-ink/55">
                        {p.level} · {p.lessonCount} lesson · {p.duration}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>

            <p className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-muted/60 px-3 py-2 text-xs text-ink/60">
              <ShieldCheck size={12} /> {permissions.length} produk dipilih
            </p>
          </section>
        </div>

        {/* Right: Status & actions */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <section className="card-base p-6">
            <h2 className="text-lg font-bold text-ink">Status Akun</h2>
            <div className="mt-4 space-y-2">
              {STATUS_OPTIONS.map((s) => (
                <label
                  key={s.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                    status === s.id
                      ? "border-brand bg-brand-50/60"
                      : "border-muted bg-white hover:border-brand/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    checked={status === s.id}
                    onChange={() => setStatus(s.id)}
                    className="mt-1 h-4 w-4 border-muted text-brand focus:ring-brand"
                  />
                  <div>
                    <p className="text-sm font-semibold text-ink">{s.label}</p>
                    <p className="text-[11px] text-ink/55">{s.hint}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section className="card-base space-y-3 p-6">
            <button type="submit" className="btn-primary w-full">
              <Save size={16} />{" "}
              {mode === "create" ? "Buat Akun Member" : "Simpan Perubahan"}
            </button>

            {success && (
              <p className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-50 py-2 text-sm text-emerald-700">
                <CheckCircle2 size={14} /> Tersimpan.
              </p>
            )}

            <Link
              href="/admin/users"
              className="btn-ghost w-full justify-center"
            >
              Batal
            </Link>

            {mode === "edit" && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/40 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                <Trash2 size={14} /> Hapus Akun Permanen
              </button>
            )}
          </section>
        </aside>
      </div>
    </form>
  );
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
