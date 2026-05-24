"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  Globe,
  Pencil,
  Sparkles,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AccessDenied } from "@/components/admin/AccessDenied";
import { useAuth } from "@/lib/auth";
import { useDataStore } from "@/lib/dataStore";
import { getPB } from "@/lib/pocketbase";

type LandingRow = {
  id: string;
  product: string; // PB product id
  published: boolean;
  updated: string;
};

export default function AdminLandingListPage() {
  const { isSuperAdmin } = useAuth();
  const { products } = useDataStore();
  const [landings, setLandings] = useState<LandingRow[]>([]);

  useEffect(() => {
    if (!isSuperAdmin) return;
    const pb = getPB();
    pb.collection("landing_pages")
      .getFullList<LandingRow>({ requestKey: null })
      .then(setLandings)
      .catch(() => setLandings([]));
  }, [isSuperAdmin]);

  if (!isSuperAdmin) {
    return (
      <AdminShell
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Landing Page" },
        ]}
        title="Landing Page"
      >
        <AccessDenied reason="Hanya Super Admin yang dapat mengelola landing page produk." />
      </AdminShell>
    );
  }

  const landingByProductId = new Map(
    landings.map((l) => [l.product, l] as const)
  );

  // Build product+landing list. products from store use slug as id; we need
  // to fetch their real PB id. Use the dataStore.products which still
  // contains slug-based id. Fetch real PB products separately to map.
  return (
    <AdminShell
      breadcrumb={[
        { label: "Admin", href: "/admin" },
        { label: "Landing Page" },
      ]}
      title="Landing Page"
      description="Kelola landing page penjualan publik untuk tiap produk. Hanya Super Admin yang dapat mengakses."
    >
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Tile
          icon={<Globe size={18} />}
          tone="brand"
          label="Total Produk"
          value={products.length}
          hint="punya katalog landing"
        />
        <Tile
          icon={<CheckCircle2 size={18} />}
          tone="emerald"
          label="Published"
          value={landings.filter((l) => l.published).length}
          hint="bisa diakses publik"
        />
        <Tile
          icon={<Sparkles size={18} />}
          tone="amber"
          label="Belum Dibuat"
          value={products.length - landings.length}
          hint="butuh setup landing"
        />
      </section>

      <div className="card-base p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-ink/45">
                <th className="px-4">Produk</th>
                <th className="px-4">Status Landing</th>
                <th className="px-4">URL Publik</th>
                <th className="px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                // Find landing where landing.product.slug-mapping... we can
                // resolve via dataStore — but simpler: fetch all landings
                // and check by joined product slug. Below uses substring of
                // any landing where it was looked up via product PB id; for
                // now we keep it simple and check by counts.
                // Display: assume each landing matches one product.
                const landing = landings.find((l) =>
                  // we don't have direct mapping client-side; try matching
                  // by created-near approach? Easier: lookup later in editor.
                  // For now: show "Edit" button always; status comes from
                  // landings count separately.
                  false ? l.product === p.id : false
                );
                const hasLanding = landingByProductId.size > 0 && false; // placeholder
                const publicUrl = `/produk/${p.id}`;
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
                        <div className="min-w-0">
                          <p className="font-semibold text-ink line-clamp-1">
                            {p.title}
                          </p>
                          <p className="text-xs text-ink/55 line-clamp-1">
                            {p.tagline}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <LandingStatusBadge productSlug={p.id} />
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
                      >
                        {publicUrl} <ExternalLink size={11} />
                      </a>
                    </td>
                    <td className="rounded-r-xl px-4 py-3 text-right">
                      <Link
                        href={`/admin/landing/${p.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-muted px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-brand hover:text-brand"
                      >
                        <Pencil size={12} /> Edit
                      </Link>
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

/**
 * Component yang fetch landing untuk satu product slug (via product PB id
 * lookup). Tampilkan badge Published/Draft/Belum dibuat.
 */
function LandingStatusBadge({ productSlug }: { productSlug: string }) {
  const [status, setStatus] = useState<"none" | "draft" | "published" | null>(
    null
  );

  useEffect(() => {
    const pb = getPB();
    (async () => {
      const productMatches = await pb
        .collection("products")
        .getFullList({
          filter: `slug = "${productSlug}"`,
          requestKey: null,
        });
      if (productMatches.length === 0) {
        setStatus("none");
        return;
      }
      const productId = productMatches[0].id;
      const landingMatches = await pb
        .collection("landing_pages")
        .getFullList<{ published: boolean }>({
          filter: `product = "${productId}"`,
          requestKey: null,
        });
      if (landingMatches.length === 0) setStatus("none");
      else setStatus(landingMatches[0].published ? "published" : "draft");
    })().catch(() => setStatus("none"));
  }, [productSlug]);

  if (status === null) {
    return <span className="text-xs text-ink/40">memuat...</span>;
  }
  if (status === "published") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
        ● Published
      </span>
    );
  }
  if (status === "draft") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
        ● Draft
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-ink/55">
      ○ Belum dibuat
    </span>
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
