"use client";

import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Box,
  Eye,
  MousePointerClick,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  dailyVisits,
  productMetrics,
  recentActivities,
  totals,
} from "@/lib/adminData";
import { useDataStore } from "@/lib/dataStore";

export default function AdminOverview() {
  const { products } = useDataStore();
  const peakVisits = Math.max(...dailyVisits.map((d) => d.visits));

  const topProducts = useMemo(() => {
    return [...products]
      .map((p) => {
        const m = productMetrics.find((x) => x.productId === p.id);
        return { ...p, visits: m?.visits ?? 0 };
      })
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 5);
  }, [products]);

  return (
    <AdminShell
      title="Selamat datang, Admin 👋"
      description="Pantau performa platform, member aktif, dan engagement produk dalam satu tempat."
      actions={
        <>
          <Link href="/admin/users/new" className="btn-primary">
            <UserPlus size={16} /> Tambah Member
          </Link>
          <Link href="/admin/products/new" className="btn-ghost">
            <Box size={16} /> Tambah Produk
          </Link>
        </>
      }
    >
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Kpi
          icon={<Users size={18} />}
          label="Total Member"
          value={totals.members.toLocaleString("id-ID")}
          delta="+2 minggu ini"
          tone="brand"
        />
        <Kpi
          icon={<Activity size={18} />}
          label="Member Aktif"
          value={totals.activeMembers.toLocaleString("id-ID")}
          delta={`${Math.round(
            (totals.activeMembers / totals.members) * 100
          )}% dari total`}
          tone="emerald"
        />
        <Kpi
          icon={<Eye size={18} />}
          label="Visits 14 hari"
          value={totals.visits30d.toLocaleString("id-ID")}
          delta="+18.4%"
          tone="amber"
        />
        <Kpi
          icon={<MousePointerClick size={18} />}
          label="Klik Produk"
          value={totals.clicks30d.toLocaleString("id-ID")}
          delta="+12.7%"
          tone="rose"
        />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Visits chart */}
        <div className="card-base p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-ink">
                Visits & Klik 14 Hari Terakhir
              </h2>
              <p className="text-xs text-ink/55">
                Trafik dashboard member dan klik card produk.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <Legend color="bg-brand" label="Visits" />
              <Legend color="bg-amber-300" label="Klik" />
            </div>
          </div>

          <div className="flex h-56 items-end gap-1.5 sm:gap-2">
            {dailyVisits.map((d) => {
              const v = (d.visits / peakVisits) * 100;
              const c = (d.clicks / peakVisits) * 100;
              return (
                <div
                  key={d.date}
                  className="group relative flex flex-1 flex-col items-center justify-end gap-1"
                >
                  <div className="pointer-events-none absolute -top-12 z-10 hidden rounded-lg bg-ink px-2.5 py-1.5 text-[11px] text-white shadow-card group-hover:block">
                    <p className="font-semibold">{d.date}</p>
                    <p>Visits: {d.visits.toLocaleString("id-ID")}</p>
                    <p>Klik: {d.clicks.toLocaleString("id-ID")}</p>
                  </div>
                  <div className="flex w-full items-end justify-center gap-0.5">
                    <div
                      className="w-full max-w-[14px] rounded-t-md bg-brand transition-all hover:bg-brand-600"
                      style={{ height: `${v}%` }}
                    />
                    <div
                      className="w-full max-w-[14px] rounded-t-md bg-amber-300 transition-all hover:bg-amber-400"
                      style={{ height: `${c}%` }}
                    />
                  </div>
                  <span className="mt-1 text-[10px] font-medium text-ink/50">
                    {d.date.split(" ")[1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top products by visits */}
        <div className="card-base p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-ink">
                Top 5 Produk by Visits
              </h2>
              <p className="text-xs text-ink/55">14 hari terakhir.</p>
            </div>
            <Link
              href="/admin/analytics"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
            >
              Lihat semua <ArrowUpRight size={12} />
            </Link>
          </div>

          <ul className="space-y-3">
            {topProducts.map((p, i) => {
              const max = topProducts[0].visits;
              const pct = (p.visits / max) * 100;
              return (
                <li key={p.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="grid h-5 w-5 place-items-center rounded-md bg-muted text-[10px] font-bold text-ink/55">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-ink">{p.title}</span>
                    </span>
                    <span className="text-xs font-medium text-ink/55">
                      {p.visits.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-brand transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Activity & Quick Action */}
      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card-base p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Aktivitas Terbaru</h2>
            <BarChart3 size={18} className="text-ink/40" />
          </div>
          <ul className="space-y-3">
            {recentActivities.map((a) => (
              <li
                key={a.id}
                className="flex items-start gap-3 rounded-xl border border-muted bg-white p-3"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand">
                  <TrendingUp size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold text-ink">{a.user}</span>{" "}
                    <span className="text-ink/65">{a.action}</span>{" "}
                    <span className="font-medium text-ink">{a.detail}</span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-ink/45">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-base flex flex-col gap-3 p-6">
          <h2 className="text-lg font-bold text-ink">Aksi Cepat</h2>
          <Link
            href="/admin/users/new"
            className="flex items-center justify-between rounded-xl border border-muted bg-white p-4 transition hover:border-brand"
          >
            <div>
              <p className="text-sm font-semibold">Buat Akun Member</p>
              <p className="text-xs text-ink/55">
                Aktivasi setelah pembelian masuk.
              </p>
            </div>
            <UserPlus className="text-brand" size={18} />
          </Link>
          <Link
            href="/admin/products/new"
            className="flex items-center justify-between rounded-xl border border-muted bg-white p-4 transition hover:border-brand"
          >
            <div>
              <p className="text-sm font-semibold">Tambah Produk Baru</p>
              <p className="text-xs text-ink/55">
                Daftarkan kelas / tutorial baru.
              </p>
            </div>
            <Box className="text-brand" size={18} />
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center justify-between rounded-xl border border-muted bg-white p-4 transition hover:border-brand"
          >
            <div>
              <p className="text-sm font-semibold">Lihat Analytics</p>
              <p className="text-xs text-ink/55">
                Visits, klik, dan engagement per produk.
              </p>
            </div>
            <BarChart3 className="text-brand" size={18} />
          </Link>
        </div>
      </section>
    </AdminShell>
  );
}

function Kpi({
  icon,
  label,
  value,
  delta,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  tone: "brand" | "emerald" | "amber" | "rose";
}) {
  const palette = {
    brand: "bg-brand-50 text-brand",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  }[tone];

  return (
    <div className="card-base p-5">
      <div className="flex items-center justify-between">
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${palette}`}>
          {icon}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-ink/45">
          {label}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-xs text-emerald-600">{delta}</p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-ink/60">
      <span className={`h-2.5 w-2.5 rounded-sm ${color}`} /> {label}
    </span>
  );
}
