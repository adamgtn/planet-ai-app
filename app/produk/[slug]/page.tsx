"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  MessageCircle,
  PlayCircle,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { getPB } from "@/lib/pocketbase";
import type { LandingPage } from "@/lib/landingTypes";

type PublicProduct = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  level: string;
  duration: string;
  lesson_count: number;
  cover: string;
  image: string;
  landing_url: string;
  price?: string;
};

export default function PublicProductLanding() {
  const params = useParams<{ slug: string }>();
  const [product, setProduct] = useState<PublicProduct | null | undefined>(
    undefined
  );
  const [landing, setLanding] = useState<LandingPage | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const pb = getPB();
    (async () => {
      const productMatches = await pb
        .collection("products")
        .getFullList<PublicProduct>({
          filter: `slug = "${params.slug}"`,
          requestKey: null,
        });
      if (productMatches.length === 0) {
        setProduct(null);
        return;
      }
      setProduct(productMatches[0]);

      const landings = await pb
        .collection("landing_pages")
        .getFullList<LandingPage & { id: string }>({
          filter: `product = "${productMatches[0].id}" && published = true`,
          requestKey: null,
        });
      if (landings.length > 0) {
        setLanding(landings[0]);
      }
    })().catch(() => setProduct(null));
  }, [params.slug]);

  if (product === undefined) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/40">
        <p className="text-sm text-ink/60">Memuat...</p>
      </div>
    );
  }

  if (product === null) notFound();

  const headline = landing?.headline || product.title;
  const subheadline = landing?.subheadline || product.tagline;
  const heroImage = landing?.hero_image_url || product.image;
  const ctaText = landing?.cta_primary_text || "Beli Sekarang";
  const ctaUrl =
    landing?.cta_primary_url ||
    product.landing_url ||
    "https://wa.me/6281234567890";
  const benefits = landing?.benefits ?? [];
  const testimonials = landing?.testimonials ?? [];
  const faq = landing?.faq ?? [];
  const priceFeatures = landing?.price_features ?? [];
  const footerCta =
    landing?.footer_cta_text ||
    "Bergabung sekarang dan akses semua materi seumur hidup.";

  return (
    <div className="min-h-screen bg-white">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-muted bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-semibold text-ink/70 hover:text-brand sm:inline"
            >
              Sudah punya akun? Login
            </Link>
            <a
              href={ctaUrl}
              target={ctaUrl.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="btn-primary py-2"
            >
              {ctaText}
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand">
              <Sparkles size={14} /> {product.level}
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink md:text-5xl">
              {headline}
            </h1>
            {subheadline && (
              <div
                className="prose prose-sm mt-4 max-w-xl text-ink/70"
                dangerouslySetInnerHTML={{ __html: subheadline }}
              />
            )}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-ink/65">
              <span className="inline-flex items-center gap-1.5">
                <Clock size={16} /> {product.duration}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <PlayCircle size={16} /> {product.lesson_count} lesson
              </span>
              {product.price && (
                <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 font-bold text-brand">
                  {product.price}
                </span>
              )}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={ctaUrl}
                target={ctaUrl.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="btn-primary justify-between text-base"
              >
                <span className="inline-flex items-center gap-2">
                  <ShoppingBag size={18} /> {ctaText}
                </span>
                <ArrowRight size={16} />
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost justify-center"
              >
                <MessageCircle size={16} /> Tanya Admin
              </a>
            </div>
          </div>

          <div className="relative">
            <div
              className={`aspect-[5/4] w-full overflow-hidden rounded-3xl bg-gradient-to-br ${product.cover} shadow-2xl shadow-brand/20`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImage}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      {benefits.length > 0 && (
        <section className="bg-muted/30 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-ink lg:text-4xl">
                Yang akan kamu kuasai
              </h2>
              <p className="mt-3 text-ink/65">
                Hasil konkret yang kamu dapatkan setelah menyelesaikan kelas.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-muted bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-cardHover"
                >
                  <div className="text-3xl">{b.icon || "✨"}</div>
                  <h3 className="mt-3 text-lg font-bold text-ink">
                    {b.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-ink/65">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-ink lg:text-4xl">
                Apa kata mereka
              </h2>
              <p className="mt-3 text-ink/65">
                Cerita member yang sudah lebih dulu bergabung.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <figure
                  key={i}
                  className="rounded-2xl border border-muted bg-white p-6"
                >
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <blockquote className="mt-3 text-sm leading-relaxed text-ink/80">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 flex items-center gap-3">
                    {t.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.photo_url}
                        alt={t.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 font-bold text-brand">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {t.name}
                      </p>
                      {t.role && (
                        <p className="text-xs text-ink/55">{t.role}</p>
                      )}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRICING */}
      <section className="bg-gradient-to-br from-brand via-brand-600 to-orange-700 py-16 text-white lg:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold lg:text-4xl">
            Akses lengkap, satu kali bayar
          </h2>
          <p className="mt-3 text-white/80">
            Investasi sekali untuk akses seumur hidup ke semua materi.
          </p>

          <div className="mt-10 rounded-3xl bg-white p-8 text-ink shadow-2xl shadow-black/20 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand">
              {product.title}
            </p>
            <p className="mt-2 text-5xl font-extrabold text-ink">
              {product.price ?? "Hubungi Admin"}
            </p>
            <ul className="mt-8 space-y-3 text-left text-sm">
              {priceFeatures.length > 0
                ? priceFeatures.map((f, i) => (
                    <li key={i} className="inline-flex w-full items-start gap-2">
                      <CheckCircle2
                        size={18}
                        className="shrink-0 text-emerald-500"
                      />
                      <span className="text-ink/80">{f}</span>
                    </li>
                  ))
                : [
                    `${product.lesson_count} lesson video & latihan`,
                    `${product.duration} total durasi materi`,
                    "Akses seumur hidup + update materi",
                    "Sertifikat & template siap pakai",
                  ].map((f, i) => (
                    <li key={i} className="inline-flex w-full items-start gap-2">
                      <CheckCircle2
                        size={18}
                        className="shrink-0 text-emerald-500"
                      />
                      <span className="text-ink/80">{f}</span>
                    </li>
                  ))}
            </ul>
            <a
              href={ctaUrl}
              target={ctaUrl.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="btn-primary mt-8 w-full justify-center py-3 text-base"
            >
              {ctaText} <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-ink lg:text-4xl">
                Pertanyaan yang sering ditanyakan
              </h2>
            </div>
            <div className="mt-12 space-y-3">
              {faq.map((q, i) => {
                const open = openFaq === i;
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-muted bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="flex w-full items-center justify-between p-4 text-left"
                    >
                      <span className="font-semibold text-ink">
                        {q.question}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`shrink-0 text-ink/50 transition ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {open && (
                      <p className="border-t border-muted px-4 py-4 text-sm leading-relaxed text-ink/70">
                        {q.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER CTA */}
      <section className="relative overflow-hidden bg-muted/30 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-ink lg:text-4xl">
            Siap mulai belajar?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/65">{footerCta}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={ctaUrl}
              target={ctaUrl.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="btn-primary text-base"
            >
              <ShoppingBag size={18} /> {ctaText} <ArrowRight size={16} />
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              <MessageCircle size={16} /> Chat Admin
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-muted bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-ink/55 sm:flex-row">
          <Logo size="sm" />
          <p>© {new Date().getFullYear()} PlanetSoft. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
