"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Crown,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AccessDenied } from "@/components/admin/AccessDenied";
import {
  ADMIN_PERMISSIONS,
  type AdminRole,
} from "@/lib/adminData";
import { useAuth } from "@/lib/auth";
import { getPB } from "@/lib/pocketbase";
import { useEffect } from "react";

type AdminRow = {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin";
  active: boolean;
  createdAt: string;
  lastLoginAt: string;
};

export default function AdminsListPage() {
  const { isSuperAdmin } = useAuth();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | AdminRole>("all");
  const [adminAccounts, setAdminAccounts] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSuperAdmin) return;
    const pb = getPB();
    (async () => {
      try {
        const rows = await pb.collection("users").getFullList<{
          id: string;
          name: string;
          email: string;
          role: "super_admin" | "admin" | "member";
          status: string;
          created: string;
          last_login_at?: string;
        }>({
          filter: 'role = "admin" || role = "super_admin"',
          sort: "-created",
          $autoCancel: false,
        });
        setAdminAccounts(
          rows.map((r) => ({
            id: r.id,
            name: r.name,
            email: r.email,
            role: r.role as "super_admin" | "admin",
            active: r.status === "active",
            createdAt: r.created.slice(0, 10),
            lastLoginAt:
              r.last_login_at?.replace("T", " ").slice(0, 16) ?? "—",
          }))
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [isSuperAdmin]);

  const list = useMemo(() => {
    return adminAccounts.filter((a) => {
      const matchRole = filter === "all" || a.role === filter;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q);
      return matchRole && matchQuery;
    });
  }, [adminAccounts, query, filter]);

  if (!isSuperAdmin) {
    return (
      <AdminShell
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Admin Pengelola" },
        ]}
        title="Admin Pengelola"
        description="Kelola siapa yang bisa mengakses Admin Area."
      >
        <AccessDenied reason="Hanya Super Admin yang dapat melihat dan mengelola daftar admin." />
      </AdminShell>
    );
  }

  const superCount = adminAccounts.filter(
    (a) => a.role === "super_admin"
  ).length;
  const adminCount = adminAccounts.length - superCount;

  return (
    <AdminShell
      breadcrumb={[
        { label: "Admin", href: "/admin" },
        { label: "Admin Pengelola" },
      ]}
      title="Admin Pengelola"
      description="Kelola tim admin yang bisa mengakses backend Planet AI. Hanya Super Admin yang dapat menambah atau menghapus admin."
      actions={
        <Link href="/admin/admins/new" className="btn-primary">
          <Plus size={16} /> Tambah Admin
        </Link>
      }
    >
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Tile
          icon={<Crown size={18} />}
          tone="brand"
          label="Super Admin"
          value={superCount}
          hint="Akses penuh sistem"
        />
        <Tile
          icon={<ShieldCheck size={18} />}
          tone="emerald"
          label="Admin"
          value={adminCount}
          hint="Hanya kelola member & produk"
        />
        <Tile
          icon={<UserCog size={18} />}
          tone="amber"
          label="Admin Aktif"
          value={adminAccounts.filter((a) => a.active).length}
          hint={`dari total ${adminAccounts.length}`}
        />
      </section>

      <div className="card-base p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["all", "super_admin", "admin"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  filter === f
                    ? "bg-brand text-white"
                    : "border border-muted text-ink/65 hover:border-brand hover:text-brand"
                }`}
              >
                {f === "all"
                  ? "Semua"
                  : f === "super_admin"
                  ? "Super Admin"
                  : "Admin"}
              </button>
            ))}
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
              placeholder="Cari admin..."
              className="input-base pl-9 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-ink/45">
                <th className="px-4">Admin</th>
                <th className="px-4">Role</th>
                <th className="px-4">Status</th>
                <th className="px-4">Bergabung</th>
                <th className="px-4">Login Terakhir</th>
                <th className="px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.map((a) => {
                const isSuper = a.role === "super_admin";
                return (
                  <tr
                    key={a.id}
                    className="bg-white text-sm shadow-card transition hover:bg-muted/40"
                  >
                    <td className="rounded-l-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`grid h-9 w-9 place-items-center rounded-full text-white ${
                            isSuper ? "bg-brand" : "bg-ink/70"
                          }`}
                        >
                          {isSuper ? (
                            <Crown size={14} />
                          ) : (
                            <ShieldCheck size={14} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-ink">{a.name}</p>
                          <p className="text-xs text-ink/55">{a.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          isSuper
                            ? "bg-brand-50 text-brand"
                            : "bg-muted text-ink/70"
                        }`}
                      >
                        {isSuper ? <Crown size={11} /> : <ShieldCheck size={11} />}
                        {ADMIN_PERMISSIONS[a.role].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          a.active
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        ● {a.active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink/60">
                      {a.createdAt}
                    </td>
                    <td className="px-4 py-3 text-xs text-ink/60">
                      {a.lastLoginAt}
                    </td>
                    <td className="rounded-r-xl px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/admin/admins/${a.id}`}
                          className="grid h-8 w-8 place-items-center rounded-lg border border-muted text-ink/60 transition hover:border-brand hover:text-brand"
                          aria-label="Edit"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          disabled={isSuper}
                          title={
                            isSuper
                              ? "Super Admin tidak bisa dihapus dari daftar"
                              : "Hapus admin"
                          }
                          className="grid h-8 w-8 place-items-center rounded-lg border border-muted text-ink/60 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-muted disabled:hover:bg-transparent disabled:hover:text-ink/60"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

function Tile({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  hint: string;
  tone: "brand" | "emerald" | "amber";
}) {
  const palette = {
    brand: "bg-brand-50 text-brand",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  }[tone];
  return (
    <div className="card-base flex items-center gap-4 p-5">
      <span className={`grid h-11 w-11 place-items-center rounded-xl ${palette}`}>
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">
          {label}
        </p>
        <p className="text-2xl font-bold text-ink">{value}</p>
        <p className="text-[11px] text-ink/55">{hint}</p>
      </div>
    </div>
  );
}
