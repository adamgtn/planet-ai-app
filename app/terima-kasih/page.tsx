"use client";

/**
 * Halaman Terima Kasih — tujuan redirect setelah pembayaran berhasil.
 *
 * SETUP: di dashboard Mayar, set "Redirect URL setelah bayar" ke:
 *   https://planetsoft.id/terima-kasih
 *
 * Optional: kalau Mayar bisa kirim query param, kita baca buat nilai Purchase:
 *   /terima-kasih?amount=97000&product=Paket%20UMKM%20Starter
 * Kalau nggak ada param, Purchase tetap ke-track (tanpa nilai).
 */

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { trackPurchase } from "@/lib/pixels";

const WA_NUMBER = "6285780685293";

function ThankYouInner() {
  const params = useSearchParams();

  useEffect(() => {
    const amountRaw = params.get("amount");
    const amount = amountRaw
      ? Number(amountRaw.replace(/[^\d]/g, ""))
      : undefined;
    const product = params.get("product") || undefined;

    trackPurchase({
      value: Number.isFinite(amount as number) ? amount : undefined,
      contentName: product,
    });
  }, [params]);

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-muted/40 to-white px-6 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-muted bg-white p-8 text-center shadow-card md:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50">
          <CheckCircle2 size={36} className="text-emerald-500" />
        </div>

        <h1 className="mt-6 text-2xl font-extrabold text-ink md:text-3xl">
          Pembayaran Berhasil! 🎉
        </h1>
        <p className="mt-3 text-ink/70">
          Terima kasih sudah bergabung dengan{" "}
          <span className="font-bold text-brand">PlanetPrompt</span>. Akun &amp;
          akses kamu sedang kami siapkan.
        </p>

        <div className="mt-6 rounded-2xl bg-muted/40 p-5 text-left text-sm text-ink/75">
          <p className="font-bold text-ink">Langkah selanjutnya:</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Cek WhatsApp / email kamu untuk detail akun login.</li>
            <li>Kalau dalam 10 menit belum ada, chat admin di bawah ya.</li>
          </ol>
        </div>

        <a
          href={`https://wa.me/${WA_NUMBER}?text=Halo%20admin,%20saya%20baru%20selesai%20bayar%20PlanetPrompt`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand/30 transition hover:scale-[1.02]"
        >
          <MessageCircle size={16} /> Konfirmasi ke Admin via WhatsApp
        </a>

        <Link
          href="/planetprompt"
          className="mt-4 inline-block text-sm font-semibold text-ink/55 underline-offset-4 hover:text-brand hover:underline"
        >
          Kembali ke halaman utama
        </Link>
      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYouInner />
    </Suspense>
  );
}
