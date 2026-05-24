import Link from "next/link";
import {
  ArrowRight,
  Clock,
  ExternalLink,
  Lock,
  PlayCircle,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import type { Product } from "@/lib/mockData";

const STATUS_BADGE: Record<
  Product["status"],
  { label: string; className: string }
> = {
  purchased: {
    label: "Terbuka",
    className: "bg-brand text-white",
  },
  locked: {
    label: "Terkunci",
    className: "bg-ink/85 text-white",
  },
  expired: {
    label: "Kedaluwarsa",
    className: "bg-rose-500 text-white",
  },
};

export function ProductCard({ product }: { product: Product }) {
  const isLocked = product.status === "locked";
  const isExpired = product.status === "expired";
  const isOpen = product.status === "purchased";
  const badge = STATUS_BADGE[product.status];

  return (
    <article
      className={`card-base group relative flex flex-col overflow-hidden transition duration-300 ${
        isOpen ? "hover:-translate-y-1 hover:shadow-cardHover" : ""
      }`}
    >
      {/* Cover image — 1000x1000 PNG/SVG */}
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className={`h-full w-full object-cover transition duration-500 ${
            isLocked ? "scale-105 blur-sm grayscale" : ""
          } ${isExpired ? "grayscale" : ""} ${
            isOpen ? "group-hover:scale-105" : ""
          }`}
        />

        {/* Always-on top gradient for badge readability */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />

        {/* Badges */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider shadow-card ${badge.className}`}
          >
            {badge.label}
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-ink">
            {product.level}
          </span>
        </div>

        {/* Locked overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/35">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-white/95 text-ink shadow-card">
              <Lock size={22} />
            </div>
            {product.price && (
              <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink shadow-card">
                {product.price}
              </span>
            )}
          </div>
        )}

        {/* Expired overlay */}
        {isExpired && (
          <div className="absolute inset-0 grid place-items-center bg-black/30">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-white/95 text-rose-500 shadow-card">
              <RefreshCw size={22} />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-lg font-bold leading-tight text-ink">
            {product.title}
          </h3>
          <p className="mt-1 text-sm text-ink/65">{product.tagline}</p>
        </div>

        <div className="flex items-center gap-4 text-xs text-ink/60">
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} /> {product.duration}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <PlayCircle size={14} /> {product.lessonCount} lesson
          </span>
        </div>

        {isOpen && (
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink/70">
              <span>Progress</span>
              <span>{product.progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-brand transition-all"
                style={{ width: `${product.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2 pt-2">
          {isOpen && (
            <Link
              href={`/learn/${product.id}`}
              className="btn-primary w-full justify-between"
            >
              Mulai Belajar <ArrowRight size={16} />
            </Link>
          )}

          {isLocked && (
            <>
              {product.landingUrl ? (
                <a
                  href={product.landingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary w-full justify-between"
                >
                  <span className="inline-flex items-center gap-2">
                    <ShoppingBag size={16} /> Beli Sekarang
                  </span>
                  <ExternalLink size={14} />
                </a>
              ) : (
                <Link
                  href={`/produk/${product.id}`}
                  target="_blank"
                  className="btn-primary w-full justify-between"
                >
                  <span className="inline-flex items-center gap-2">
                    <ShoppingBag size={16} /> Beli Sekarang
                  </span>
                  <ExternalLink size={14} />
                </Link>
              )}
              <Link
                href={`/unlock/${product.id}`}
                className="btn-ghost w-full justify-between text-xs"
              >
                Lihat Detail Akses <Lock size={12} />
              </Link>
            </>
          )}

          {isExpired && (
            <a
              href={product.landingUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost w-full justify-between border-rose-200 text-rose-600 hover:border-rose-400 hover:text-rose-700"
            >
              <span className="inline-flex items-center gap-2">
                <RefreshCw size={14} /> Perpanjang Akses
              </span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
