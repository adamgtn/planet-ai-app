"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, MessageCircle, RefreshCw } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { useProduct } from "@/lib/dataStore";

export default function RenewPage() {
  const params = useParams<{ productId: string }>();
  const product = useProduct(params.productId);
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-muted/40">
      <TopBar />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-ink/60 hover:text-brand"
        >
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>

        <section className="card-base p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-100 text-rose-600">
            <RefreshCw size={26} />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-ink">
            Akses kelas {product.title} sudah kedaluwarsa
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink/65">
            Periode akses kelas ini sudah berakhir. Perpanjang akses kamu untuk
            kembali menonton tutorial dan mengunduh materi.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              <MessageCircle size={16} /> Perpanjang via WhatsApp
            </a>
            <Link href="/dashboard" className="btn-ghost">
              Kembali ke Dashboard
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
