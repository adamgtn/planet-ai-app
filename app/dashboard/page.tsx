"use client";

import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { ProductCard } from "@/components/ProductCard";
import { ToolsSuiteBanner } from "@/components/ToolsSuiteBanner";
import { currentUser, type ProductStatus } from "@/lib/mockData";
import { useDataStore } from "@/lib/dataStore";

type Filter = "all" | ProductStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "purchased", label: "Terbuka" },
  { id: "locked", label: "Terkunci" },
  { id: "expired", label: "Kedaluwarsa" },
];

export default function DashboardPage() {
  const { products } = useDataStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchFilter = filter === "all" || p.status === filter;
      const matchQuery =
        !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.tagline.toLowerCase().includes(query.toLowerCase());
      return matchFilter && matchQuery;
    });
  }, [products, filter, query]);

  const stats = useMemo(() => {
    const owned = products.filter((p) => p.status === "purchased");
    const avgProgress = owned.length
      ? Math.round(
          owned.reduce((sum, p) => sum + p.progress, 0) / owned.length
        )
      : 0;
    return {
      owned: owned.length,
      avgProgress,
      total: products.length,
    };
  }, [products]);

  return (
    <div className="min-h-screen bg-muted/40">
      <TopBar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="card-base relative overflow-hidden p-8">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute -bottom-12 right-24 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand">
                <Sparkles size={14} /> Member Area
              </span>
              <h1 className="mt-3 text-3xl font-bold text-ink">
                Halo, {currentUser.name.split(" ")[0]} 👋
              </h1>
              <p className="mt-1 max-w-xl text-sm text-ink/65">
                Lanjutkan perjalanan belajar AI kamu. Akses semua kelas yang
                kamu miliki dan jelajahi modul baru.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <Stat label="Kelas Aktif" value={stats.owned} suffix="/ kelas" />
              <Stat
                label="Rata-rata Progress"
                value={stats.avgProgress}
                suffix="%"
              />
              <Stat label="Katalog" value={stats.total} suffix="kelas" />
            </div>
          </div>
        </section>

        <div className="mt-8">
          <ToolsSuiteBanner />
        </div>

        <div className="mt-10 mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink">Kelas & Produk</h2>
            <p className="mt-0.5 text-sm text-ink/60">
              Kelola dan lanjutkan kelas AI yang sudah kamu miliki.
            </p>
          </div>
        </div>

        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  filter === f.id
                    ? "bg-brand text-white shadow-card"
                    : "border border-muted bg-white text-ink/70 hover:border-brand hover:text-brand"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative md:w-72">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari kelas..."
              className="input-base pl-10"
            />
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>

        {filtered.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-muted bg-white p-10 text-center">
            <p className="text-sm text-ink/60">
              Tidak ada kelas yang cocok dengan pencarian.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix: string;
}) {
  return (
    <div className="rounded-xl border border-muted bg-white px-4 py-3 text-center">
      <p className="text-2xl font-bold text-brand">{value}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-wider text-ink/55">
        {label}
      </p>
      <p className="text-[11px] text-ink/45">{suffix}</p>
    </div>
  );
}
