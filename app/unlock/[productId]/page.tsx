"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Lock,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { useProduct } from "@/lib/dataStore";

export default function UnlockPage() {
  const params = useParams<{ productId: string }>();
  const product = useProduct(params.productId);
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-muted/40">
      <TopBar />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-ink/60 hover:text-brand"
        >
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>

        <section className="card-base overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            {/* Cover */}
            <div className="relative aspect-square w-full overflow-hidden bg-muted md:aspect-auto">
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover blur-[1px] grayscale"
              />
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-white/95 text-ink shadow-card">
                  <Lock size={26} />
                </div>
                {product.price && (
                  <span className="rounded-full bg-white/95 px-4 py-1.5 text-sm font-bold text-ink shadow-card">
                    {product.price}
                  </span>
                )}
              </div>
            </div>

            {/* Detail */}
            <div className="flex flex-col gap-4 p-8">
              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand">
                <ShieldCheck size={12} /> Konten Premium
              </span>
              <h1 className="text-2xl font-bold text-ink md:text-3xl">
                {product.title}
              </h1>
              <p className="text-sm text-ink/65">{product.tagline}</p>

              <ul className="space-y-2 text-sm text-ink/75">
                <li className="inline-flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  {product.lessonCount} pelajaran video & latihan
                </li>
                <li className="inline-flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  {product.duration} total durasi materi
                </li>
                <li className="inline-flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Akses seumur hidup + update materi
                </li>
                <li className="inline-flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Sertifikat & template siap pakai
                </li>
              </ul>

              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <a
                  href={product.landingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary flex-1 justify-between text-base"
                >
                  <span className="inline-flex items-center gap-2">
                    <ShoppingBag size={16} /> Beli Sekarang
                  </span>
                  <ExternalLink size={14} />
                </a>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost flex-1 justify-center"
                >
                  <MessageCircle size={16} /> Tanya Admin
                </a>
              </div>

              <p className="text-[11px] text-ink/50">
                Klik <span className="font-semibold">Beli Sekarang</span> akan
                membuka landing page resmi {product.landingUrl}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
