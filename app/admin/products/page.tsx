"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Box,
  ExternalLink,
  Eye,
  MousePointerClick,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { productMetrics } from "@/lib/adminData";
import { useDataStore } from "@/lib/dataStore";

export default function AdminProductsPage() {
  const { products, users, removeProduct } = useDataStore();
  const [query, setQuery] = useState("");

  const summary = useMemo(
    () =>
      products.map((p) => {
        const m = productMetrics.find((x) => x.productId === p.id);
        const owners = users.filter((u) => u.permissions.includes(p.id)).length;
        return {
          ...p,
          visits: m?.visits ?? 0,
          clicks: m?.clicks ?? 0,
          conversionRate: m?.conversionRate ?? 0,
          owners,
        };
      }),
    [products, users]
  );

  const list = useMemo(() => {
    const q = query.toLowerCase();
    return summary.filter(
      (p) =>
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q)
    );
  }, [summary, query]);

  const handleRemove = (id: string, title: string) => {
    if (window.confirm(`Hapus produk "${title}"?`)) removeProduct(id);
  };

  return (
    <AdminShell
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Produk" }]}
      title="Katalog Produk"
      description="Kelola kelas, tutorial, dan tools yang tersedia di Member Area."
      actions={
        <Link href="/admin/products/new" className="btn-primary">
          <Plus size={16} /> Tambah Produk
        </Link>
      }
    >
      <div className="card-base p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink/65">
            <span className="font-bold text-ink">{summary.length}</span>{" "}
            produk aktif di katalog.
          </p>
          <div className="relative sm:w-72">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk..."
              className="input-base pl-9 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[820px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-ink/45">
                <th className="px-4">Produk</th>
                <th className="px-4">Level</th>
                <th className="px-4">Owner</th>
                <th className="px-4">Visits</th>
                <th className="px-4">Klik</th>
                <th className="px-4">Conv. Rate</th>
                <th className="px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr
                  key={p.id}
                  className="bg-white text-sm shadow-card transition hover:bg-muted/40"
                >
                  <td className="rounded-l-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${p.cover}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image}
                          alt={p.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-ink line-clamp-1">
                          {p.title}
                        </p>
                        <p className="text-xs text-ink/55 line-clamp-1">
                          {p.tagline}
                        </p>
                        {p.landingUrl && (
                          <a
                            href={p.landingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline"
                          >
                            Landing page <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-ink/70">
                      {p.level}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-ink/65">
                      <Users size={12} /> {p.owners}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink">
                      <Eye size={12} className="text-brand" />
                      {p.visits.toLocaleString("id-ID")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink">
                      <MousePointerClick size={12} className="text-amber-500" />
                      {p.clicks.toLocaleString("id-ID")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-emerald-600">
                      {p.conversionRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="rounded-r-xl px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-muted text-ink/60 transition hover:border-brand hover:text-brand"
                        aria-label="Edit"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemove(p.id, p.title)}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-muted text-ink/60 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500"
                        aria-label="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {list.length === 0 && (
            <div className="rounded-xl border border-dashed border-muted py-10 text-center text-sm text-ink/55">
              <Box className="mx-auto mb-2 text-ink/30" size={20} />
              Tidak ada produk yang cocok.
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
