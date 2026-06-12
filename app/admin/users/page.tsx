"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Filter,
  MoreHorizontal,
  Pencil,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { type UserStatus, type UserTier } from "@/lib/adminData";
import { useDataStore } from "@/lib/dataStore";

type Filter = "all" | UserStatus;

const STATUS_PILL: Record<UserStatus, string> = {
  active: "bg-emerald-50 text-emerald-600",
  suspended: "bg-amber-50 text-amber-700",
  expired: "bg-rose-50 text-rose-600",
};

const STATUS_LABEL: Record<UserStatus, string> = {
  active: "Aktif",
  suspended: "Suspended",
  expired: "Kedaluwarsa",
};

const TIER_PILL: Record<UserTier, string> = {
  starter: "bg-muted text-ink/70",
  vip: "bg-amber-100 text-amber-700",
  aplikasi: "bg-rose-100 text-rose-700",
};

const TIER_LABEL: Record<UserTier, string> = {
  starter: "Starter",
  vip: "VIP",
  aplikasi: "Aplikasi",
};

export default function AdminUsersPage() {
  const { users, removeUser } = useDataStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    return users.filter((u) => {
      const matchFilter = filter === "all" || u.status === filter;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [users, filter, query]);

  const handleRemove = (id: string, name: string) => {
    if (window.confirm(`Hapus akun "${name}"?`)) removeUser(id);
  };

  return (
    <AdminShell
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Member" }]}
      title="Kelola Member"
      description="Buat akun, atur status, dan kelola hak akses produk untuk setiap member."
      actions={
        <Link href="/admin/users/new" className="btn-primary">
          <UserPlus size={16} /> Tambah Member
        </Link>
      }
    >
      <div className="card-base p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["all", "active", "suspended", "expired"] as Filter[]).map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    filter === f
                      ? "bg-brand text-white"
                      : "border border-muted text-ink/65 hover:border-brand hover:text-brand"
                  }`}
                >
                  {f === "all" ? "Semua" : STATUS_LABEL[f]}
                </button>
              )
            )}
          </div>
          <div className="relative sm:w-72">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama atau email..."
              className="input-base pl-9 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[820px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-ink/45">
                <th className="px-4">Member</th>
                <th className="px-4">Status</th>
                <th className="px-4">Paket</th>
                <th className="px-4">Akses Produk</th>
                <th className="px-4">Bergabung</th>
                <th className="px-4">Login Terakhir</th>
                <th className="px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr
                  key={u.id}
                  className="bg-white text-sm shadow-card transition hover:bg-muted/40"
                >
                  <td className="rounded-l-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 font-bold text-brand">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-ink">{u.name}</p>
                        <p className="text-xs text-ink/55">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_PILL[u.status]}`}
                    >
                      ● {STATUS_LABEL[u.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.tier ? (
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${TIER_PILL[u.tier]}`}
                      >
                        {u.tier === "vip" ? "👑 " : ""}
                        {TIER_LABEL[u.tier]}
                      </span>
                    ) : (
                      <span className="text-xs text-ink/35">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-ink/70">
                      <ShieldCheck size={12} /> {u.permissions.length} produk
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink/60">
                    {u.joinedAt}
                  </td>
                  <td className="px-4 py-3 text-xs text-ink/60">
                    {u.lastLoginAt}
                  </td>
                  <td className="rounded-r-xl px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-muted text-ink/60 transition hover:border-brand hover:text-brand"
                        aria-label="Edit"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemove(u.id, u.name)}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-muted text-ink/60 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500"
                        aria-label="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        className="grid h-8 w-8 place-items-center rounded-lg border border-muted text-ink/40 hover:border-brand hover:text-brand"
                        aria-label="Lainnya"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {list.length === 0 && (
            <div className="rounded-xl border border-dashed border-muted py-10 text-center text-sm text-ink/55">
              <Filter className="mx-auto mb-2 text-ink/30" size={20} />
              Tidak ada member yang cocok.
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-ink/55">
          Menampilkan {list.length} dari {users.length} member.
        </p>
      </div>
    </AdminShell>
  );
}
