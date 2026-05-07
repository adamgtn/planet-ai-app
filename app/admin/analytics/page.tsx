"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Eye,
  MousePointerClick,
  Timer,
  Users,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  dailyVisits,
  productMetrics,
  totals,
} from "@/lib/adminData";
import { useDataStore } from "@/lib/dataStore";

const RANGES = ["7 hari", "14 hari", "30 hari", "90 hari"] as const;
type Range = (typeof RANGES)[number];

export default function AdminAnalyticsPage() {
  const { products, users } = useDataStore();
  const [range, setRange] = useState<Range>("14 hari");

  const peakVisits = Math.max(...dailyVisits.map((d) => d.visits));
  const peakClicks = Math.max(...dailyVisits.map((d) => d.clicks));

  const totalVisits = totals.visits30d;
  const totalClicks = totals.clicks30d;
  const ctr = totalVisits > 0 ? (totalClicks / totalVisits) * 100 : 0;

  const sorted = useMemo(
    () =>
      products
        .map((p) => {
          const m = productMetrics.find((x) => x.productId === p.id);
          const owners = users.filter((u) =>
            u.permissions.includes(p.id)
          ).length;
          return {
            ...p,
            visits: m?.visits ?? 0,
            clicks: m?.clicks ?? 0,
            uniqueVisitors: m?.uniqueVisitors ?? 0,
            avgWatchMinutes: m?.avgWatchMinutes ?? 0,
            owners,
          };
        })
        .sort((a, b) => b.visits - a.visits),
    [products, users]
  );
  const max = sorted[0]?.visits ?? 0;

  return (
    <AdminShell
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Analytics" }]}
      title="Analytics & Engagement"
      description="Pantau visit, klik produk, dan engagement member secara real-time."
      actions={
        <div className="flex flex-wrap gap-1 rounded-xl border border-muted bg-white p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                range === r
                  ? "bg-brand text-white"
                  : "text-ink/60 hover:text-brand"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      }
    >
      {/* KPI */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Kpi
          icon={<Eye size={18} />}
          label="Total Visits"
          value={totalVisits.toLocaleString("id-ID")}
          delta="+18.4%"
          trend="up"
          tone="brand"
        />
        <Kpi
          icon={<MousePointerClick size={18} />}
          label="Total Klik"
          value={totalClicks.toLocaleString("id-ID")}
          delta="+12.7%"
          trend="up"
          tone="amber"
        />
        <Kpi
          icon={<Users size={18} />}
          label="Unique Visitors"
          value={sorted
            .reduce((sum, p) => sum + p.uniqueVisitors, 0)
            .toLocaleString("id-ID")}
          delta="+9.1%"
          trend="up"
          tone="emerald"
        />
        <Kpi
          icon={<Timer size={18} />}
          label="Click-Through Rate"
          value={`${ctr.toFixed(1)}%`}
          delta="-1.2%"
          trend="down"
          tone="rose"
        />
      </section>

      {/* Visits Trend */}
      <section className="card-base mt-6 p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-ink">Tren Visit & Klik</h2>
            <p className="text-xs text-ink/55">
              Detail per hari, 14 hari terakhir.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Legend color="bg-brand" label="Visits" />
            <Legend color="bg-amber-300" label="Klik" />
          </div>
        </div>

        <div className="flex h-64 items-end gap-2">
          {dailyVisits.map((d) => {
            const v = (d.visits / peakVisits) * 100;
            const c = (d.clicks / peakClicks) * 100;
            return (
              <div
                key={d.date}
                className="group relative flex flex-1 flex-col items-center justify-end gap-1"
              >
                <div className="pointer-events-none absolute -top-14 z-10 hidden whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-[11px] text-white shadow-card group-hover:block">
                  <p className="font-semibold">{d.date}</p>
                  <p>Visits: {d.visits.toLocaleString("id-ID")}</p>
                  <p>Klik: {d.clicks.toLocaleString("id-ID")}</p>
                </div>
                <div className="flex w-full items-end justify-center gap-1">
                  <div
                    className="w-full max-w-[18px] rounded-t-md bg-brand transition-all hover:bg-brand-600"
                    style={{ height: `${v}%` }}
                  />
                  <div
                    className="w-full max-w-[18px] rounded-t-md bg-amber-300 transition-all hover:bg-amber-400"
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
      </section>

      {/* Per-product detail */}
      <section className="card-base mt-6 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-ink">
            Performa per Produk
          </h2>
          <p className="text-xs text-ink/55">
            Visit, klik, dan conversion rate kartu produk di dashboard member.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-ink/45">
                <th className="px-4">Produk</th>
                <th className="px-4">Visits</th>
                <th className="px-4">Unique</th>
                <th className="px-4">Klik</th>
                <th className="px-4">CTR</th>
                <th className="px-4">Avg. Watch</th>
                <th className="px-4 w-1/4">Distribusi</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => {
                const ctrP = p.visits ? (p.clicks / p.visits) * 100 : 0;
                const pct = max ? (p.visits / max) * 100 : 0;
                return (
                  <tr
                    key={p.id}
                    className="bg-white text-sm shadow-card transition hover:bg-muted/40"
                  >
                    <td className="rounded-l-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${p.cover}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.image}
                            alt={p.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-ink">{p.title}</p>
                          <p className="text-[11px] text-ink/55">{p.level}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-ink">
                      {p.visits.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-xs text-ink/65">
                      {p.uniqueVisitors.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-ink">
                      {p.clicks.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-emerald-600">
                        {ctrP.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink/65">
                      {p.avgWatchMinutes} min
                    </td>
                    <td className="rounded-r-xl px-4 py-3">
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-brand transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Click distribution */}
      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card-base p-6">
          <h2 className="text-lg font-bold text-ink">Distribusi Klik</h2>
          <p className="text-xs text-ink/55">
            Persentase klik produk dari total klik 14 hari terakhir.
          </p>

          <div className="mt-5 space-y-3">
            {sorted.map((p) => {
              const pct = totalClicks ? (p.clicks / totalClicks) * 100 : 0;
              return (
                <div key={p.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{p.title}</span>
                    <span className="text-xs font-semibold text-ink/65">
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full bg-gradient-to-r ${p.cover}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-base p-6">
          <h2 className="text-lg font-bold text-ink">Insight Singkat</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <Insight tone="emerald">
              <strong>Prompt Engineering Mastery</strong> menyumbang{" "}
              {(
                ((sorted[0]?.clicks ?? 0) / totalClicks) *
                100
              ).toFixed(0)}
              % dari total klik produk.
            </Insight>
            <Insight tone="amber">
              CTR rata-rata <strong>{ctr.toFixed(1)}%</strong> — naikkan dengan
              memperjelas tagline & CTA card.
            </Insight>
            <Insight tone="rose">
              <strong>Data Analyst with AI</strong> punya CTR terendah, perlu
              review thumbnail / copywriting.
            </Insight>
            <Insight tone="brand">
              Trafik puncak di <strong>May 07</strong>, sehari sebelum rilis
              modul terbaru.
            </Insight>
          </ul>
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
  trend,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  tone: "brand" | "amber" | "emerald" | "rose";
}) {
  const palette = {
    brand: "bg-brand-50 text-brand",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
  }[tone];

  const trendCls =
    trend === "up" ? "text-emerald-600" : "text-rose-500";

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
      <p
        className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${trendCls}`}
      >
        {trend === "up" ? (
          <ArrowUpRight size={12} />
        ) : (
          <ArrowDownRight size={12} />
        )}
        {delta}
      </p>
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

function Insight({
  tone,
  children,
}: {
  tone: "brand" | "amber" | "emerald" | "rose";
  children: React.ReactNode;
}) {
  const palette = {
    brand: "bg-brand-50 text-brand",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
  }[tone];

  return (
    <li className={`rounded-xl px-3 py-2.5 ${palette}`}>{children}</li>
  );
}
