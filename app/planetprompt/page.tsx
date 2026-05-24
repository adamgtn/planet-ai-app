"use client";

import { useEffect, useState } from "react";
import {
  Brain,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Crown,
  ExternalLink,
  Globe,
  Infinity as InfinityIcon,
  Layers,
  MessageCircle,
  Play,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG / DUMMY CONTENT

const WA_NUMBER = "6281234567890";
const COMMUNITY_LINK = "https://chat.whatsapp.com/dummy";
const VIDEO_DEMO_ID = "dQw4w9WgXcQ";

// Gambar dummy via picsum.photos (stabil dengan seed)
const heroImages = Array.from(
  { length: 14 },
  (_, i) => `https://picsum.photos/seed/pp-hero-${i}/600/600`
);
const outputImages = Array.from(
  { length: 24 },
  (_, i) => `https://picsum.photos/seed/pp-out-${i}/500/500`
);
const testimonialPhotos = Array.from(
  { length: 9 },
  (_, i) => `https://picsum.photos/seed/pp-face-${i}/120/120`
);

// ─────────────────────────────────────────────────────────────────────────────

export default function PlanetPromptLanding() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowStickyCta(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#011117] text-slate-200 selection:bg-emerald-500/30">
      <Navbar />

      <Hero onPlayVideo={() => setVideoOpen(true)} />
      <ProblemSection />
      <SolutionSection />
      <DemoVideoTeaser onPlay={() => setVideoOpen(true)} />
      <MarqueeGallerySection />
      <WhyDifferentSection />
      <TargetAudienceSection />
      <OutputGridSection />
      <SubFeaturesSection />
      <ComparisonTableSection />
      <TestimonialsSection />
      <BonusSection />
      <PricingSection />
      <ResellRightsSection />
      <FaqSection />
      <FinalCtaSection />
      <CommunityCta />
      <Footer />

      {videoOpen && <VideoModal onClose={() => setVideoOpen(false)} />}
      {showStickyCta && <StickyMobileCta />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all ${
        scrolled
          ? "border-b border-emerald-500/10 bg-[#011117]/85 py-3 backdrop-blur-md"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/planetsoft-icon.png"
            alt="PlanetPrompt"
            className="h-8 w-8"
          />
          <span className="text-lg font-bold tracking-tight text-white">
            planet<span className="text-emerald-400">prompt</span>
          </span>
        </div>
        <a
          href={COMMUNITY_LINK}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 transition hover:border-emerald-400 hover:bg-emerald-500/20"
        >
          <MessageCircle size={14} /> Join Channel
        </a>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO

function Hero({ onPlayVideo }: { onPlayVideo: () => void }) {
  return (
    <section className="relative overflow-hidden pb-12 pt-32 lg:pt-40">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1200px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-teal-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          <Sparkles size={12} /> Tool AI untuk UMKM &amp; Seller Digital
        </span>

        <h1 className="mt-6 text-balance text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
          1000+ Prompt AI Siap Pakai —{" "}
          <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Konten Premium Dalam Hitungan Detik
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-slate-300 md:text-lg">
          Hentikan stuck cari prompt yang efektif. Library prompt yang sudah
          dikurasi untuk pasar Indonesia — copywriting, sales, marketing,
          edukasi. Compatible ChatGPT, Claude, Gemini.
        </p>

        {/* 3-step indicator */}
        <div className="mx-auto mt-7 flex max-w-2xl flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-400 md:text-sm">
          <span className="rounded-full bg-white/5 px-3 py-1.5">
            1. Copy Prompt
          </span>
          <ChevronRight size={14} className="text-emerald-500/60" />
          <span className="rounded-full bg-white/5 px-3 py-1.5">
            2. Paste ke AI
          </span>
          <ChevronRight size={14} className="text-emerald-500/60" />
          <span className="rounded-full bg-emerald-500/15 px-3 py-1.5 text-emerald-300">
            3. Konten Premium 🔥
          </span>
        </div>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-base font-bold text-[#01140e] shadow-2xl shadow-emerald-500/30 transition hover:scale-[1.02] hover:shadow-emerald-500/50"
          >
            <ShoppingBag size={18} /> Ambil PlanetPrompt • Info Update
          </a>
          <button
            type="button"
            onClick={onPlayVideo}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-emerald-400 hover:text-emerald-300"
          >
            <Play size={16} fill="currentColor" /> Lihat Demo
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          Mulai dari{" "}
          <span className="font-bold text-emerald-300">Rp 97.000</span> · Sekali
          beli, pakai selamanya
        </p>

        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500/10 px-2 py-0.5 font-bold text-rose-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
            </span>
            LIVE
          </span>
          <span>2.847 user sudah download minggu ini</span>
        </div>
      </div>

      {/* Hero gallery marquee */}
      <div className="relative mt-14 space-y-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <MarqueeRow images={heroImages} reverse={false} />
        <MarqueeRow images={[...heroImages].reverse()} reverse={true} />
      </div>
    </section>
  );
}

function MarqueeRow({
  images,
  reverse,
}: {
  images: string[];
  reverse: boolean;
}) {
  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max gap-3 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {[...images, ...images].map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt=""
            loading="lazy"
            className="h-32 w-32 shrink-0 rounded-2xl object-cover md:h-40 md:w-40"
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROBLEM

function ProblemSection() {
  const pains = [
    "**Habis 2 jam** ngetik prompt, hasilnya tetap generic kayak chatbot gratisan",
    "Sudah **beli ebook prompt** dari luar negeri tapi konteksnya tidak cocok untuk pasar lokal",
    "**Bingung pilih formula** yang efektif — banyak teori, sedikit yang aplikatif",
    "Hasil ChatGPT **berasa AI banget** — pembeli skip, scroll, lewat",
    "Mau jual jasa konten AI tapi **stuck di bahan baku** prompt-nya",
  ];

  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Masalah yang kamu rasakan
        </p>
        <h2 className="mt-3 text-center text-3xl font-bold text-white md:text-4xl">
          Pernah Ngalamin Ini?
        </h2>

        <div className="mt-10 space-y-3">
          {pains.map((p, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-rose-500/20 text-rose-400">
                <X size={16} />
              </span>
              <p
                className="text-sm leading-relaxed text-slate-300 md:text-base"
                dangerouslySetInnerHTML={{
                  __html: p.replace(
                    /\*\*(.+?)\*\*/g,
                    '<strong class="text-white">$1</strong>'
                  ),
                }}
              />
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-base italic text-slate-400">
          Kalau lebih dari satu yang kamu rasain... kamu butuh shortcut. Bukan
          teori. <span className="text-emerald-300">Solusinya ada di bawah ↓</span>
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SOLUTION

function SolutionSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Memperkenalkan
        </p>
        <div className="mt-6 inline-flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/planetsoft-icon.png"
            alt="PlanetPrompt"
            className="h-16 w-16 md:h-20 md:w-20"
          />
          <span className="text-4xl font-extrabold text-white md:text-6xl">
            planet<span className="text-emerald-400">prompt</span>
          </span>
        </div>

        {/* Mockup */}
        <div className="mx-auto mt-10 max-w-3xl">
          <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 p-2 shadow-2xl shadow-emerald-500/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://picsum.photos/seed/pp-mockup/1200/700"
              alt="PlanetPrompt mockup"
              className="w-full rounded-2xl"
            />
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-4 text-left text-slate-300">
          <p className="text-base leading-relaxed md:text-lg">
            <strong className="text-white">PlanetPrompt</strong> adalah library
            terbesar di Indonesia berisi <strong className="text-emerald-300">1.000+
            prompt siap pakai</strong> untuk ChatGPT, Claude, Gemini, dan
            Perplexity — terorganisir per kategori bisnis dan use case sehari-hari.
          </p>
          <p className="text-base leading-relaxed md:text-lg">
            Cukup pilih kategori, copy prompt, ganti variabel sesuai produkmu,
            paste ke AI favorit. Konten copywriting Instagram, naskah video TikTok,
            sales script WA, ide produk, riset kompetitor — semua tinggal pakai.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DEMO TEASER

function DemoVideoTeaser({ onPlay }: { onPlay: () => void }) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-6">
        <button
          type="button"
          onClick={onPlay}
          className="group relative block w-full overflow-hidden rounded-3xl border border-white/10"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://picsum.photos/seed/pp-demo/1200/675"
            alt="Demo PlanetPrompt"
            className="aspect-video w-full object-cover transition group-hover:scale-105"
          />
          <div className="absolute inset-0 grid place-items-center bg-black/40 transition group-hover:bg-black/30">
            <div className="flex flex-col items-center gap-3">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-emerald-500 shadow-2xl shadow-emerald-500/50 transition group-hover:scale-110">
                <Play size={32} fill="currentColor" className="text-[#011117]" />
              </span>
              <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur">
                Lihat PlanetPrompt Bekerja (60s)
              </span>
            </div>
          </div>
        </button>
      </div>
    </section>
  );
}

function VideoModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-3xl bg-black"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
        >
          <X size={18} />
        </button>
        <iframe
          src={`https://www.youtube.com/embed/${VIDEO_DEMO_ID}?autoplay=1`}
          title="Demo PlanetPrompt"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MARQUEE GALLERY (HASIL)

function MarqueeGallerySection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Galeri hasil
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Output Real dari Pengguna
          </h2>
          <p className="mt-3 text-slate-400">
            Bukan demo template — semua dari prompt asli PlanetPrompt yang sudah
            dipakai member.
          </p>
        </div>
      </div>
      <div className="mt-10 space-y-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <MarqueeRow
          images={outputImages.slice(0, 12)}
          reverse={false}
        />
        <MarqueeRow
          images={outputImages.slice(12, 24)}
          reverse={true}
        />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WHY DIFFERENT — 6 FEATURES

function WhyDifferentSection() {
  const features = [
    {
      icon: <Layers size={22} />,
      title: "1.000+ Prompt Siap Pakai",
      desc: "Library terorganisir per kategori: marketing, sales, edukasi, operasional, riset, kreatif.",
    },
    {
      icon: <Globe size={22} />,
      title: "Konteks Indonesia",
      desc: "Bukan terjemahan kasar dari English prompt — di-craft khusus untuk pasar &amp; budaya lokal.",
    },
    {
      icon: <Brain size={22} />,
      title: "Multi-AI Compatible",
      desc: "Tested di ChatGPT, Claude, Gemini, Perplexity, Mistral. Switch AI tanpa rewrite prompt.",
    },
    {
      icon: <Zap size={22} />,
      title: "Output Konsisten",
      desc: "Setiap prompt punya placeholder &amp; instruksi yang jelas — hasil sama bagus setiap dipakai.",
    },
    {
      icon: <RefreshCw size={22} />,
      title: "Update Berkala",
      desc: "Prompt baru ditambah tiap minggu mengikuti trend &amp; rilis model AI terbaru.",
    },
    {
      icon: <InfinityIcon size={22} />,
      title: "Lifetime Access",
      desc: "Bayar sekali. Akses semua materi + update masa depan tanpa biaya tambahan.",
    },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Kenapa berbeda
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            6 Alasan Member Pilih PlanetPrompt
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-emerald-500/10 bg-gradient-to-br from-white/[0.04] to-transparent p-6 transition hover:border-emerald-500/30 hover:from-emerald-500/[0.06]"
            >
              <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400">
                {f.icon}
              </span>
              <h3 className="mt-4 text-lg font-bold text-white">{f.title}</h3>
              <p
                className="mt-2 text-sm text-slate-400"
                dangerouslySetInnerHTML={{ __html: f.desc }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TARGET AUDIENCE

function TargetAudienceSection() {
  const audiences = [
    {
      icon: <ShoppingBag size={18} />,
      label: "Online Seller",
      desc: "Tokopedia, Shopee, TikTok Shop, marketplace",
    },
    {
      icon: <Tag size={18} />,
      label: "UMKM Owner",
      desc: "Bisnis lokal yang mau scale lewat AI",
    },
    {
      icon: <Sparkles size={18} />,
      label: "Content Creator",
      desc: "Instagram, TikTok, YouTube, blog",
    },
    {
      icon: <Target size={18} />,
      label: "Affiliate Marketer",
      desc: "Promosi produk digital &amp; fisik",
    },
    {
      icon: <Users size={18} />,
      label: "Social Media Manager",
      desc: "Pegang banyak akun klien",
    },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Untuk siapa
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            PlanetPrompt Cocok untuk Kamu
          </h2>
          <p className="mt-3 text-slate-400">
            Siapa pun yang butuh konten cepat &amp; konsisten tanpa harus belajar
            prompt engineering dari nol.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-5"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400">
                {a.icon}
              </span>
              <div>
                <p className="font-bold text-white">{a.label}</p>
                <p
                  className="mt-0.5 text-sm text-slate-400"
                  dangerouslySetInnerHTML={{ __html: a.desc }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OUTPUT GRID

function OutputGridSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Showcase
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Konten Premium dari 1 Prompt
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3 lg:grid-cols-5">
          {outputImages.slice(0, 15).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              loading="lazy"
              className="aspect-square w-full rounded-xl object-cover transition hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-FEATURES (4 sub-products)

function SubFeaturesSection() {
  const subs = [
    {
      name: "PromptVault",
      desc: "Library 1000+ prompt searchable + favorite. Filter per industri.",
      previews: outputImages.slice(0, 5),
    },
    {
      name: "ScriptKit",
      desc: "Naskah TikTok &amp; Reels viral siap shoot. 50+ hook template.",
      previews: outputImages.slice(5, 10),
    },
    {
      name: "SalesScript",
      desc: "Template WA closing yang sudah teruji untuk produk digital &amp; fisik.",
      previews: outputImages.slice(10, 15),
    },
    {
      name: "ContentEngine",
      desc: "Workflow content batching: 1 jam = 30 hari konten Instagram.",
      previews: outputImages.slice(15, 20),
    },
  ];

  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Fitur terbaru
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            4 Modul Eksklusif Termasuk
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {subs.map((s, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-3xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-teal-500/[0.04] p-6 transition hover:border-emerald-500/40"
            >
              <h3 className="text-2xl font-bold text-white">
                {s.name.replace(/[A-Z][a-z]+/g, (m, ofs) =>
                  ofs === 0 ? m : m.toLowerCase()
                )
                  .split(/([A-Z][a-z]+)/)
                  .filter(Boolean)
                  .map((part, idx) =>
                    idx === 0 ? (
                      <span key={idx}>{part}</span>
                    ) : (
                      <span key={idx} className="text-emerald-400">
                        {part}
                      </span>
                    )
                  )}
              </h3>
              <p
                className="mt-1 text-sm text-slate-400"
                dangerouslySetInnerHTML={{ __html: s.desc }}
              />
              <div className="mt-4 flex gap-2 overflow-hidden">
                {s.previews.map((src, j) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={j}
                    src={src}
                    alt=""
                    loading="lazy"
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPARISON

function ComparisonTableSection() {
  const rows = [
    ["Mahal per project (Rp 500K+ tiap konten)", "Sekali bayar, 1000+ prompt selamanya"],
    ["Lama: hours of trial &amp; error", "Hitungan detik — copy, paste, kirim"],
    ["Butuh skill prompt engineering", "Zero skill — tinggal isi placeholder"],
    ["Hasil tidak konsisten antar AI", "Tested di 5+ platform AI"],
    ["Ebook English yang tidak nyambung", "100% konteks &amp; bahasa Indonesia"],
    ["Trial &amp; error sendiri", "Sudah diuji 5.000+ member"],
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Perbandingan
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Cara Lama vs PlanetPrompt
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-300">
              <X size={12} /> Cara Lama
            </p>
            <ul className="mt-5 space-y-3">
              {rows.map(([old], i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-400"
                >
                  <X
                    size={16}
                    className="mt-0.5 shrink-0 text-rose-400"
                  />
                  <span
                    className="line-through decoration-rose-400/40"
                    dangerouslySetInnerHTML={{ __html: old }}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="relative rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-6 shadow-2xl shadow-emerald-500/20">
            <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-[#011117]">
              <Sparkles size={12} /> PlanetPrompt
            </span>
            <ul className="mt-5 space-y-3">
              {rows.map(([, neu], i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-white"
                >
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-emerald-400"
                  />
                  <span dangerouslySetInnerHTML={{ __html: neu }} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS

function TestimonialsSection() {
  const items = [
    {
      name: "Rini K.",
      role: "Online Seller, Bandung",
      quote:
        "Dulu mentok caption produk. Sekarang 30 caption sehari santai. Closing naik 3x dalam 2 minggu.",
      photo: testimonialPhotos[0],
    },
    {
      name: "Bagus P.",
      role: "Content Creator",
      quote:
        "Naskah TikTok yang biasanya 1 jam, sekarang 5 menit. Dari 1k follower jadi 20k dalam 3 bulan.",
      photo: testimonialPhotos[1],
    },
    {
      name: "Maya L.",
      role: "UMKM Owner",
      quote:
        "Investasi paling worth selama bisnis. Akses 1000+ prompt cuma Rp 97K — gila murahnya.",
      photo: testimonialPhotos[2],
    },
    {
      name: "Fajar N.",
      role: "Affiliate Marketer",
      quote:
        "Sales script-nya next level. CTR ads naik dari 1.2% ke 3.8% — sama budget yang sama.",
      photo: testimonialPhotos[3],
    },
    {
      name: "Kintan P.",
      role: "Social Media Manager",
      quote:
        "Pegang 8 akun klien sendirian sekarang. Workflow content batching 4 jam, biasanya 2 hari.",
      photo: testimonialPhotos[4],
    },
    {
      name: "Sinta M.",
      role: "Reseller",
      quote:
        "Beli lisensi resell, balik modal cuma 4 hari. Sekarang ini side income utama.",
      photo: testimonialPhotos[5],
    },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Testimoni
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Cerita Member Setelah Pakai
          </h2>
          <p className="mt-3 text-slate-400">
            6 dari 5.000+ member. Hasil bisa berbeda tergantung effort.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <figure
              key={i}
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition hover:border-emerald-500/30"
            >
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} size={14} fill="currentColor" />
                ))}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-slate-200">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.photo}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* WhatsApp screenshots */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[6, 7, 8].map((idx) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={idx}
              src={`https://picsum.photos/seed/pp-wa-${idx}/600/800`}
              alt="Testimoni WhatsApp"
              loading="lazy"
              className="w-full rounded-2xl border border-white/10 object-cover"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BONUS

function BonusSection() {
  const bonuses = [
    {
      badge: "Bonus Premium",
      name: "Custom GPT Templates",
      tagline: "5 Custom GPT siap deploy di akun ChatGPT kamu",
      bullets: [
        "GPT brand voice assistant",
        "GPT product description generator",
        "GPT competitor research bot",
      ],
      img: outputImages[20],
      worth: "Rp 297.000",
    },
    {
      badge: "Bonus Eksklusif",
      name: "Prompt Engineering Mini-Course",
      tagline: "Belajar bikin prompt sendiri dari nol",
      bullets: [
        "12 video tutorial",
        "Framework Anatomi Prompt",
        "Cheatsheet PDF + template",
      ],
      img: outputImages[21],
      worth: "Rp 499.000",
    },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Bonus
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            2 Bonus Khusus untuk Pembeli Hari Ini
          </h2>
          <p className="mt-3 text-slate-400">
            Total nilai bonus{" "}
            <span className="font-bold text-emerald-300">Rp 796.000</span> — gratis kalau ambil sekarang.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {bonuses.map((b, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.06] to-transparent p-6"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-bold text-amber-300">
                  <Crown size={12} /> {b.badge}
                </span>
                <span className="text-xs text-slate-400">
                  Nilai:{" "}
                  <span className="line-through">{b.worth}</span>
                </span>
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.img}
                alt={b.name}
                className="mt-5 aspect-video w-full rounded-2xl object-cover"
              />

              <h3 className="mt-5 text-xl font-bold text-white">{b.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{b.tagline}</p>

              <ul className="mt-4 space-y-2">
                {b.bullets.map((bl, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-slate-300"
                  >
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-emerald-400"
                    />
                    {bl}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICING

function PricingSection() {
  return (
    <section id="pricing" className="relative py-20 lg:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Ambil PlanetPrompt Sekarang
          </h2>
          <p className="mt-3 text-slate-400">
            Pilih lisensi yang sesuai. Sekali bayar, akses selamanya. No
            langganan.
          </p>
        </div>

        <CountdownBanner />

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <PricingCard
            badge="Personal License"
            tagline="Untuk Pemakaian Pribadi"
            priceNormal="Rp 197.000"
            pricePromo="Rp 97.000"
            features={[
              "1.000+ prompt full access",
              "Update prompt mingguan",
              "Compatible ChatGPT, Claude, Gemini",
              "Akses 4 modul eksklusif",
              "Bonus Custom GPT Templates",
              "Lifetime — sekali bayar",
            ]}
            cta="Ambil Personal • Rp 97.000"
            coupon="PROMO50"
          />
          <PricingCard
            badge="Resell License"
            tagline="Bisa Dijual Lagi (Resell Rights)"
            priceNormal="Rp 594.000"
            pricePromo="Rp 297.000"
            features={[
              "Semua benefit Personal",
              "Hak jual ulang ke konsumenmu",
              "Marketing kit (script + creative)",
              "Tutorial sales funnel reseller",
              "Bonus Prompt Engineering Course",
              "Tanpa royalti — 100% profit milikmu",
            ]}
            cta="Ambil Resell • Rp 297.000"
            coupon="RESELL50"
            highlighted
          />
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  badge,
  tagline,
  priceNormal,
  pricePromo,
  features,
  cta,
  coupon,
  highlighted = false,
}: {
  badge: string;
  tagline: string;
  priceNormal: string;
  pricePromo: string;
  features: string[];
  cta: string;
  coupon: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`relative rounded-3xl p-8 transition ${
        highlighted
          ? "border-2 border-emerald-400 bg-gradient-to-br from-emerald-500/15 to-teal-500/5 shadow-2xl shadow-emerald-500/30"
          : "border border-white/10 bg-white/[0.03]"
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#011117]">
          ⭐ Paling Populer
        </span>
      )}

      <p
        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
          highlighted
            ? "bg-emerald-500/20 text-emerald-300"
            : "bg-white/10 text-slate-300"
        }`}
      >
        {badge}
      </p>
      <p className="mt-2 text-sm text-slate-400">{tagline}</p>

      <div className="mt-6">
        <p className="text-sm text-slate-500 line-through">{priceNormal}</p>
        <p className="text-5xl font-extrabold text-white">{pricePromo}</p>
        <p className="mt-1 text-xs text-slate-500">Sekali bayar, lifetime</p>
      </div>

      <ul className="mt-8 space-y-3">
        {features.map((f, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-slate-200"
          >
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0 text-emerald-400"
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <a
        href={`https://wa.me/${WA_NUMBER}?text=Halo,%20saya%20mau%20beli%20PlanetPrompt%20${badge}`}
        target="_blank"
        rel="noreferrer"
        className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition ${
          highlighted
            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-[#011117] shadow-lg shadow-emerald-500/40 hover:scale-[1.02]"
            : "border border-emerald-400/30 bg-white/5 text-emerald-300 hover:bg-emerald-500/10"
        }`}
      >
        <ShoppingBag size={16} /> {cta}
      </a>

      <p className="mt-3 text-center text-[11px] text-slate-400">
        Gunakan kode kupon:{" "}
        <span className="font-mono font-bold text-emerald-300">{coupon}</span>{" "}
        untuk PROMO
      </p>
    </div>
  );
}

function CountdownBanner() {
  const [end, setEnd] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const key = "planetprompt-countdown-v1";
    const stored = localStorage.getItem(key);
    let t = stored ? parseInt(stored, 10) : 0;
    if (!t || t < Date.now()) {
      t = Date.now() + 24 * 3600 * 1000;
      localStorage.setItem(key, t.toString());
    }
    setEnd(t);

    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!end) return null;
  const diff = Math.max(0, end - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  const Unit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="rounded-xl border border-emerald-500/30 bg-[#011a13] px-4 py-2 font-mono text-2xl font-bold tabular-nums text-emerald-300 md:text-3xl">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </span>
    </div>
  );

  return (
    <div className="mx-auto mt-10 inline-flex w-full flex-col items-center rounded-2xl border border-rose-500/30 bg-rose-500/[0.06] p-5 text-center md:mx-auto md:w-fit md:flex-row md:gap-6">
      <div className="flex items-center gap-2 text-rose-300">
        <Clock size={18} />
        <p className="text-sm font-bold uppercase">Promo Berakhir Dalam</p>
      </div>
      <div className="mt-3 flex items-center gap-2 md:mt-0 md:gap-3">
        <Unit value={h} label="Jam" />
        <span className="text-2xl font-bold text-emerald-400">:</span>
        <Unit value={m} label="Menit" />
        <span className="text-2xl font-bold text-emerald-400">:</span>
        <Unit value={s} label="Detik" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESELL RIGHTS DETAIL

function ResellRightsSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Khusus Lisensi Resell
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              Jadikan PlanetPrompt Sumber Income Pasif
            </h2>
            <p className="mt-4 text-slate-300">
              Dengan lisensi Resell, kamu dapat hak penuh untuk{" "}
              <strong className="text-emerald-300">menjual ulang</strong> ke
              konsumenmu — tanpa royalti, 100% profit milikmu.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-slate-200">
              {[
                "🎁 Marketing kit: caption, video creative, landing page",
                "💰 Harga jual fleksibel — kamu yang tentukan",
                "📈 Sudah ada 200+ reseller sukses (rata-rata BEP &lt; 7 hari)",
                "🚀 Tutorial sales funnel + komunitas reseller",
                "📦 File final delivered ke pelanggan otomatis",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-emerald-400"
                  />
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>

            <a
              href="#pricing"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-[#011117] transition hover:bg-emerald-400"
            >
              <ShoppingBag size={16} /> Ambil Lisensi Resell
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {outputImages.slice(15, 19).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt=""
                loading="lazy"
                className="aspect-square w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ

function FaqSection() {
  const faq = [
    {
      q: "Saya tidak punya skill prompt engineering, bisa pakai?",
      a: "Bisa banget. Setiap prompt sudah dilengkapi placeholder yang tinggal diisi (nama produk, target audience, dll). Tinggal copy, edit 1-2 baris, paste ke AI.",
    },
    {
      q: "Apa bedanya dengan beli prompt di Tokopedia / Shopee?",
      a: "Yang dijual di marketplace umumnya 50-100 prompt hasil scrap. PlanetPrompt 1000+ prompt original yang sudah dikurasi, diuji, dan dikategorikan rapi. Plus update mingguan + komunitas + bonus.",
    },
    {
      q: "Tools apa yang perlu disiapkan?",
      a: "Cuma butuh akses ke salah satu AI: ChatGPT (free version OK), Claude (free version OK), atau Gemini. Tidak wajib langganan Plus.",
    },
    {
      q: "Bisa untuk produk apa saja?",
      a: "Semua produk &mdash; fisik (kuliner, fashion, gadget), digital (ebook, course, jasa), dan service (konsultasi, agency).",
    },
    {
      q: "Lisensi Resell — boleh dijual berapa harga?",
      a: "Bebas. Reseller kami biasanya jual Rp 50.000-Rp 150.000 per copy. 100% profit milikmu, tanpa royalti.",
    },
    {
      q: "Sekali bayar atau langganan?",
      a: "Sekali bayar. Selamanya. Termasuk update mingguan gratis. Tanpa biaya tersembunyi.",
    },
    {
      q: "Berapa banyak prompt yang akan saya dapat?",
      a: "Saat ini 1.080+ prompt aktif. Bertambah ~30-50 prompt setiap minggu mengikuti trend.",
    },
    {
      q: "Kenapa resell menguntungkan dibanding personal?",
      a: "Karena harga jual ke konsumenmu (Rp 50-150K) dikalikan jumlah penjualan = berkali-kali lipat dari Rp 297K. Reseller pertama biasanya BEP dalam 1 minggu.",
    },
    {
      q: "Perlu langganan ChatGPT Plus?",
      a: "Tidak wajib. Hampir semua prompt jalan di versi free. Beberapa prompt advanced (multi-step) lebih optimal di Plus, tapi opsional.",
    },
    {
      q: "Bisa dipakai untuk Claude dan Gemini juga?",
      a: "Ya. Setiap prompt sudah tested di 5+ platform: ChatGPT, Claude, Gemini, Perplexity, Mistral. Switch AI bebas.",
    },
    {
      q: "Format file-nya bagaimana?",
      a: "Akses via web member area (mobile-friendly) + export PDF + Notion template + Google Sheet. Tinggal pilih.",
    },
    {
      q: "Bagaimana cara dapat update prompt baru?",
      a: "Login ke member area kapan saja — prompt baru otomatis muncul. Plus notifikasi via WhatsApp komunitas tiap ada batch baru.",
    },
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Pertanyaan yang Sering Ditanya
          </h2>
        </div>

        <div className="mt-12 space-y-2">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-white/[0.02]"
                >
                  <span className="text-sm font-semibold text-white md:text-base">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-emerald-400 transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p
                    className="border-t border-white/5 p-5 pt-4 text-sm leading-relaxed text-slate-300"
                    dangerouslySetInnerHTML={{ __html: item.a }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FINAL CTA

function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.04] to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-96 w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance text-3xl font-extrabold leading-tight text-white md:text-5xl">
          Tunda hari ini = kehilangan{" "}
          <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">
            konten 30 hari ke depan.
          </span>
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-base text-slate-300 md:text-lg">
          Tiap hari yang lewat tanpa PlanetPrompt = jam yang habis ngetik prompt
          generic, caption yang sepi engagement, sales yang macet. Ambil
          sekarang.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-base font-bold text-[#011117] shadow-2xl shadow-emerald-500/40 transition hover:scale-105"
          >
            <ShoppingBag size={20} /> Ambil PlanetPrompt Sekarang
          </a>
        </div>

        <p className="mt-5 text-xs text-slate-400">
          Sekali beli · Pakai selamanya · Tanpa langganan ·{" "}
          <span className="text-emerald-300">7-day refund guarantee</span>
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMMUNITY

function CommunityCta() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-[#011117] to-teal-500/10 p-8 md:p-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                <Users size={12} /> 5.000+ member aktif
              </p>
              <h3 className="mt-3 text-2xl font-bold text-white md:text-3xl">
                Gabung Komunitas PlanetPrompt
              </h3>
              <p className="mt-2 max-w-lg text-sm text-slate-300">
                Insight prompt terbaru, share trick AI workflow, dan penawaran
                khusus member. Free join.
              </p>
            </div>
            <a
              href={COMMUNITY_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-[#011117] transition hover:bg-emerald-400"
            >
              <MessageCircle size={16} /> Gabung Komunitas
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER

function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center text-xs text-slate-500 md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/planetsoft-icon.png"
            alt="PlanetSoft"
            className="h-6 w-6"
          />
          <span>
            © {new Date().getFullYear()} PlanetSoft. Built for Indonesian
            creators.
          </span>
        </div>
        <div className="flex gap-5">
          <a href="#" className="hover:text-emerald-300">
            Privacy
          </a>
          <a href="#" className="hover:text-emerald-300">
            Terms
          </a>
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-300"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STICKY MOBILE CTA

function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-emerald-500/20 bg-[#011117]/95 p-3 backdrop-blur md:hidden">
      <a
        href="#pricing"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-bold text-[#011117] shadow-lg shadow-emerald-500/30"
      >
        <ShoppingBag size={18} /> Ambil PlanetPrompt • Rp 97.000
      </a>
    </div>
  );
}
