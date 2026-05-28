"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Coffee,
  Copy,
  Crown,
  FileText,
  Image as ImageIcon,
  Layers,
  MessageCircle,
  Palette,
  Phone,
  Play,
  Scissors,
  Shirt,
  ShoppingBag,
  Sparkles,
  Sparkles as SparklesIcon,
  Store,
  Tag,
  Users,
  Utensils,
  Wand2,
  X,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG

// Nomor admin WhatsApp PlanetPrompt — format international tanpa "+"
// (085780685293 → 62 + 85780685293)
const WA_NUMBER = "6285780685293";
const COMMUNITY_LINK = "https://chat.whatsapp.com/FRSMZRQk6mABqMJdwkZw0l";
const VIDEO_DEMO_ID = "dQw4w9WgXcQ";

// Gambar showcase produk real (15 file di /public/lp/planetprompt/showcase/)
const showcaseImages = Array.from(
  { length: 15 },
  (_, i) =>
    `/lp/planetprompt/showcase/showcase-${(i + 1).toString().padStart(2, "0")}.png`
);
const heroProducts = showcaseImages.slice(0, 4);

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
    <div className="min-h-screen bg-white text-ink">
      <Navbar />
      <Hero />
      <ShowcaseMarqueeSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <UseCaseSection />
      <FeaturesSection />
      <DesignPromptKitSection />
      <BeforeAfterSection />
      <ExampleOutputSection />
      <PricingSection />
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
          ? "border-b border-muted bg-white/90 py-3 backdrop-blur-md shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Image
            src="/brand/planetsoft-icon.png"
            alt="PlanetPrompt"
            width={72}
            height={72}
            priority
            className="h-9 w-9 shrink-0 object-contain"
          />
          <span className="text-lg font-bold tracking-tight text-ink">
            planet<span className="text-brand">prompt</span>
          </span>
        </div>
        <a
          href={COMMUNITY_LINK}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white"
        >
          <Users size={14} /> Join Member
        </a>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO

function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 lg:pt-40">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[1100px] -translate-x-1/2 rounded-full bg-brand/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-32 h-80 w-80 rounded-full bg-amber-200/30 blur-[80px]" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand">
            <Store size={12} /> Toolkit Konten untuk UMKM
          </span>

          <h1 className="mt-5 text-balance text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            Bikin Konten Jualan{" "}
            <span className="bg-gradient-to-r from-brand to-amber-500 bg-clip-text text-transparent">
              Profesional
            </span>{" "}
            Tanpa Bisa Desain
          </h1>

          {/* Banner promo — di antara H1 dan deskripsi */}
          <a
            href="#pricing"
            className="group mt-6 block overflow-hidden rounded-2xl shadow-card transition hover:shadow-cardHover"
          >
            <Image
              src="/lp/planetprompt/hero/banner.png"
              alt="PlanetPrompt — Era Baru Desain Konten Kreatif"
              width={1536}
              height={896}
              priority
              sizes="(max-width: 768px) 100vw, 800px"
              className="h-auto w-full transition group-hover:scale-[1.01]"
            />
          </a>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 md:text-lg">
            PlanetPrompt bantu kamu bikin caption, konsep banner, deskripsi
            marketplace, promosi WhatsApp, dan ide jualan — cukup pakai template
            prompt siap pakai.
          </p>

          <ul className="mt-7 space-y-3">
            {[
              "Tinggal pilih template kebutuhan kontenmu",
              "Isi nama produk, harga, dan promo",
              "Copy ke ChatGPT, Gemini, Claude, atau AI favoritmu",
              "Dapatkan ide konten & arahan promosi siap pakai",
            ].map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm text-ink/80 md:text-base">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-base font-bold text-white shadow-2xl shadow-brand/30 transition hover:scale-[1.02] hover:shadow-brand/50"
            >
              <Wand2 size={18} /> Mulai Bikin Konten Jualan
            </a>
            <a
              href="#cara-pakai"
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink/65 hover:text-brand"
            >
              Lihat cara pakai <ArrowRight size={14} />
            </a>
          </div>

          <p className="mt-5 text-xs text-ink/55">
            Sekali beli · Bisa dipakai berkali-kali · Cocok untuk pemula
          </p>
        </div>

        {/* Hero mockup — kartu prompt UMKM */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-3">
            <PromptCard
              icon="🚀"
              tone="brand"
              title="Aplikasi PlanetPrompt"
              hint="Akses dashboard prompt langsung dari browser..."
            />
            <PromptCard
              icon="🎨"
              tone="amber"
              title="Konsep Banner Promo"
              hint="Banner diskon untuk Shopee/Tokopedia..."
            />
            <PromptCard
              icon="🛠️"
              tone="emerald"
              title="Tools Kit Brand"
              hint="Kit lengkap arahan visual & copywriting..."
            />
            <PromptCard
              icon="👥"
              tone="rose"
              title="Join Member"
              hint="Komunitas VIP + mentoring langsung..."
            />
          </div>
          <div className="absolute -bottom-4 -right-4 rounded-2xl border border-muted bg-white p-4 shadow-card md:-bottom-6 md:-right-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/45">
              Total
            </p>
            <p className="text-2xl font-extrabold text-brand">1.000+</p>
            <p className="text-[11px] text-ink/55">Template siap pakai</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PromptCard({
  icon,
  title,
  hint,
  tone,
}: {
  icon: string;
  title: string;
  hint: string;
  tone: "brand" | "amber" | "emerald" | "rose";
}) {
  const palette = {
    brand: "from-brand-50 to-white border-brand/20",
    amber: "from-amber-50 to-white border-amber-200",
    emerald: "from-emerald-50 to-white border-emerald-200",
    rose: "from-rose-50 to-white border-rose-200",
  }[tone];
  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br ${palette} p-5 shadow-card transition hover:-translate-y-1 hover:shadow-cardHover`}
    >
      <div className="text-3xl">{icon}</div>
      <p className="mt-3 text-sm font-bold text-ink">{title}</p>
      <p className="mt-1 text-[11px] leading-snug text-ink/55 line-clamp-2">
        {hint}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROBLEM

function ProblemSection() {
  const pains = [
    "Mau **posting produk**, tapi bingung caption-nya apa",
    "Desain promosi kelihatan **biasa saja**",
    "**Tidak punya budget** hire designer atau admin konten",
    "Tidak tahu cara bikin **banner, story, atau poster** yang menarik",
    "Setiap hari jualan, tapi konten terasa **itu-itu saja**",
    "Sudah coba AI, tapi hasilnya masih **terlalu umum**",
  ];

  return (
    <section className="bg-muted/40 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Masalah yang kamu rasakan
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            Jualan Sudah Jalan, Tapi Kontennya Sering Mentok?
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {pains.map((p, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl bg-white p-5 shadow-card"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-500">
                <X size={14} />
              </span>
              <p
                className="text-sm leading-relaxed text-ink/75 md:text-base"
                dangerouslySetInnerHTML={{
                  __html: p.replace(
                    /\*\*(.+?)\*\*/g,
                    '<strong class="text-ink">$1</strong>'
                  ),
                }}
              />
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-base italic text-ink/65">
          Kalau kamu sering mentok bikin konten jualan, PlanetPrompt bisa jadi{" "}
          <span className="font-bold not-italic text-brand">
            tim kreatif mini
          </span>{" "}
          yang siap bantu kapan saja.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SOLUTION

function SolutionSection() {
  const items = [
    "Caption produk",
    "Headline banner",
    "Konsep desain promosi",
    "Story Instagram",
    "Broadcast WhatsApp",
    "Deskripsi marketplace",
    "Ide campaign diskon",
    "Kalender konten jualan",
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Solusi
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            PlanetPrompt Bantu Kamu Tahu{" "}
            <span className="text-brand">Harus Bikin Konten Seperti Apa</span>
          </h2>
          <p className="mt-4 text-lg text-ink/65">
            PlanetPrompt bukan hanya kumpulan prompt. Ini toolkit ide promosi
            yang bantu kamu bikin:
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-xl border border-muted bg-white px-4 py-3 shadow-sm"
            >
              <CheckCircle2
                size={16}
                className="shrink-0 text-emerald-500"
              />
              <span className="text-sm font-medium text-ink">{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 md:p-6">
          <p className="text-sm leading-relaxed text-ink/75">
            <span className="font-bold text-amber-700">📌 Catatan penting:</span>{" "}
            PlanetPrompt <strong>bukan aplikasi desain</strong> seperti Canva.
            PlanetPrompt bantu kamu bikin <strong>arahan desain, copywriting,
            konsep visual, dan teks promosi</strong> yang siap dipakai di
            berbagai AI tools atau aplikasi desain.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOW IT WORKS — 4 STEPS

function HowItWorksSection() {
  const steps = [
    {
      n: "1",
      title: "Pilih kebutuhan konten",
      desc: "Caption produk, banner promo, deskripsi marketplace, broadcast WhatsApp — pilih yang kamu butuhkan.",
      icon: <FileText size={20} />,
    },
    {
      n: "2",
      title: "Ganti bagian yang perlu diisi",
      desc: "Masukkan nama produk, harga, target pembeli, promo, tone brand, dan platform.",
      icon: <Copy size={20} />,
    },
    {
      n: "3",
      title: "Copy ke AI favoritmu",
      desc: "Pakai di ChatGPT, Gemini, Claude, Canva AI, atau AI image generator.",
      icon: <Wand2 size={20} />,
    },
    {
      n: "4",
      title: "Pakai hasilnya untuk promosi",
      desc: "Dapatkan ide konten, teks promosi, struktur banner, atau arahan visual yang siap dipakai.",
      icon: <Sparkles size={20} />,
    },
  ];

  return (
    <section id="cara-pakai" className="bg-muted/40 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Cara pakai
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            Sesederhana Isi Template
          </h2>
          <p className="mt-3 text-ink/65">
            Empat langkah. Tidak perlu belajar prompt engineering dari nol.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={i}
              className="relative rounded-2xl border border-muted bg-white p-6 shadow-card"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">
                  {s.icon}
                </span>
                <span className="text-5xl font-extrabold text-brand-100">
                  {s.n}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// USE CASE UMKM

function UseCaseSection() {
  const categories = [
    {
      icon: <Utensils size={20} />,
      tone: "rose",
      title: "Makanan & Minuman",
      examples: "Donat, kopi susu, keripik, frozen food, catering",
    },
    {
      icon: <Shirt size={20} />,
      tone: "brand",
      title: "Fashion & Apparel",
      examples: "Kaos basic, thrift, hijab, sepatu, tas lokal",
    },
    {
      icon: <Palette size={20} />,
      tone: "emerald",
      title: "Beauty & Skincare",
      examples: "Skincare lokal, parfum, salon, nail art",
    },
    {
      icon: <Scissors size={20} />,
      tone: "amber",
      title: "Jasa Lokal",
      examples: "Laundry, barbershop, fotografi, percetakan, bengkel",
    },
    {
      icon: <Layers size={20} />,
      tone: "sky",
      title: "Produk Digital",
      examples: "Template, kelas online, jasa desain, e-book",
    },
    {
      icon: <Tag size={20} />,
      tone: "violet",
      title: "Marketplace Seller",
      examples: "Shopee, Tokopedia, TikTok Shop, Instagram",
    },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Untuk siapa
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            Cocok untuk Banyak Jenis Usaha
          </h2>
          <p className="mt-3 text-ink/65">
            Apapun produkmu, ada template kontennya.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => {
            const palette = {
              rose: "bg-rose-50 text-rose-500",
              brand: "bg-brand-50 text-brand",
              emerald: "bg-emerald-50 text-emerald-600",
              amber: "bg-amber-50 text-amber-600",
              sky: "bg-sky-50 text-sky-600",
              violet: "bg-violet-50 text-violet-600",
            }[c.tone];
            return (
              <div
                key={i}
                className="rounded-2xl border border-muted bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-cardHover"
              >
                <span
                  className={`inline-grid h-12 w-12 place-items-center rounded-xl ${palette}`}
                >
                  {c.icon}
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink">{c.title}</h3>
                <p className="mt-1.5 text-sm text-ink/60">{c.examples}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHOWCASE MARQUEE — 2 baris auto-scroll horizontal L→R, gambar full

function ShowcaseMarqueeSection() {
  // Split 15 gambar jadi 2 baris (8 + 7), masing-masing slide L→R
  const row1 = showcaseImages.slice(0, 8);
  const row2 = showcaseImages.slice(7, 15);

  return (
    <section className="bg-muted/40 py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Contoh hasil
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            Konten Jualan dari{" "}
            <span className="text-brand">Member PlanetPrompt</span>
          </h2>
          <p className="mt-3 text-ink/65">
            Semua dibuat dengan template prompt — tanpa skill desain, tanpa
            Photoshop.
          </p>
        </div>
      </div>

      <DeferMount minHeight="540px">
        <div className="mt-10 space-y-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <ShowcaseRow images={row1} reverse />
          <ShowcaseRow images={row2} reverse />
        </div>
      </DeferMount>
    </section>
  );
}

function ShowcaseRow({
  images,
  reverse,
}: {
  images: string[];
  reverse: boolean;
}) {
  // reverse=true → animate-marquee-reverse → konten slide dari kiri ke kanan
  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max gap-4 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {[...images, ...images].map((src, i) => (
          <Image
            key={i}
            src={src}
            alt=""
            width={400}
            height={400}
            sizes="(max-width: 768px) 240px, 288px"
            className="h-60 w-auto shrink-0 rounded-2xl bg-muted/40 object-contain shadow-card md:h-72"
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURES — Apa Saja yang Kamu Dapatkan?

function FeaturesSection() {
  const features = [
    "1.000+ prompt AI siap pakai",
    "Template caption produk",
    "Template headline promosi",
    "Template konsep banner & poster",
    "Template story Instagram / Facebook",
    "Template broadcast WhatsApp",
    "Template deskripsi marketplace",
    "Template ide campaign diskon",
    "Template kalender konten",
    "Template brand storytelling",
    "Template copywriting iklan",
    "Template arahan visual untuk AI image generator",
  ];

  return (
    <section className="bg-muted/40 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Isi paket
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            Apa Saja yang Kamu Dapatkan?
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm"
            >
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-emerald-500"
              />
              <span className="text-sm font-medium text-ink">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN PROMPT KIT HIGHLIGHT

function DesignPromptKitSection() {
  const outputs = [
    "Headline banner",
    "Subheadline",
    "Komposisi layout",
    "Warna yang disarankan",
    "Gaya visual",
    "Elemen desain",
    "Negative prompt AI image generator",
    "Caption pendukung",
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl border border-brand/20 bg-gradient-to-br from-brand/[0.06] via-amber-50/40 to-white p-8 md:p-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                ✨ Highlight Fitur Baru
              </span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-ink md:text-4xl">
                <span className="text-brand">DesignPrompt Kit</span> — Bikin
                Konsep Desain Tanpa Bisa Desain
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink/70">
                Prompt siap pakai untuk bikin konsep desain promosi, banner,
                poster, story, katalog, dan iklan visual — walau kamu bukan
                designer.
              </p>

              <p className="mt-7 text-sm font-bold text-ink">
                Output yang kamu dapatkan:
              </p>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {outputs.map((o, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-ink/75"
                  >
                    <Check size={14} className="shrink-0 text-brand" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual mockup */}
            <div className="grid grid-cols-2 gap-3">
              {heroProducts.slice(0, 4).map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt=""
                  width={400}
                  height={400}
                  sizes="(max-width: 640px) 45vw, 200px"
                  className="aspect-square w-full rounded-2xl bg-muted/40 object-cover shadow-card"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BEFORE - AFTER

function BeforeAfterSection() {
  const rows = [
    ["Bingung bikin caption", "Tinggal pakai template caption"],
    [
      "Desain promo terlihat biasa",
      "Dapat arahan konsep desain yang lebih menarik",
    ],
    ["Tidak tahu cara pakai AI", "Prompt sudah disusun, tinggal isi"],
    ["Konten terasa itu-itu saja", "Punya banyak variasi ide konten"],
    [
      "Harus bayar designer untuk hal kecil",
      "Bisa bikin konsep awal sendiri",
    ],
    ["Butuh waktu lama bikin promosi", "Proses ide & copy lebih cepat"],
  ];

  return (
    <section className="bg-muted/40 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Sebelum vs Sesudah
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            Dari Bingung Mau Posting Apa, Jadi{" "}
            <span className="text-brand">Punya Materi Siap Pakai</span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Before */}
          <div className="rounded-2xl border border-rose-200 bg-white p-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-600">
              <X size={12} /> Sebelum PlanetPrompt
            </p>
            <ul className="mt-5 space-y-3">
              {rows.map(([before], i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-ink/55"
                >
                  <X
                    size={16}
                    className="mt-0.5 shrink-0 text-rose-400"
                  />
                  <span className="line-through decoration-rose-300">
                    {before}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div className="relative rounded-2xl border-2 border-brand bg-gradient-to-br from-brand-50 to-amber-50/60 p-6 shadow-2xl shadow-brand/20">
            <p className="inline-flex items-center gap-2 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
              <Sparkles size={12} /> Setelah PlanetPrompt
            </p>
            <ul className="mt-5 space-y-3">
              {rows.map(([, after], i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm font-medium text-ink"
                >
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-emerald-500"
                  />
                  {after}
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
// EXAMPLE OUTPUT — 3 contoh

function ExampleOutputSection() {
  const examples = [
    {
      emoji: "🌶️",
      product: "Keripik Kaca Azqiya",
      input: [
        ["Produk", "Keripik kaca pedas daun jeruk"],
        ["Harga", "Rp 25.000"],
        ["Promo", "Beli 2 gratis 1"],
        ["Target", "Anak muda pecinta camilan pedas"],
      ],
      outputs: [
        "Konsep poster premium",
        "Headline banner",
        "Caption Instagram",
        "Deskripsi marketplace",
        "Broadcast WhatsApp",
      ],
      img: showcaseImages[0],
    },
    {
      emoji: "🐕",
      product: "Pawfect Feast Premium",
      input: [
        ["Produk", "Dog food nutrisi premium"],
        ["Harga", "Rp 40.000 / kg"],
        ["Promo", "Diskon 40% pelanggan baru"],
        ["Target", "Pet owner kelas menengah"],
      ],
      outputs: [
        "Banner promo natural",
        "Caption Instagram",
        "Konsep visual outdoor",
        "Headline iklan Facebook Ads",
      ],
      img: showcaseImages[1],
    },
    {
      emoji: "🎒",
      product: "Tas Sekolah Anak",
      input: [
        ["Produk", "Tas pelangi anak SD"],
        ["Harga", "Rp 150.000"],
        ["Promo", "Free name tag"],
        ["Target", "Orang tua anak SD usia 6-10"],
      ],
      outputs: [
        "Poster ceria pastel",
        "Caption manis untuk emak-emak",
        "Konsep visual rainbow",
        "Story Instagram playful",
      ],
      img: showcaseImages[2],
    },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Contoh hasil
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            Contoh Hasil yang Bisa Kamu Buat
          </h2>
          <p className="mt-3 text-ink/65">
            Tiga contoh nyata dari produk UMKM.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {examples.map((ex, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-muted bg-white shadow-card transition hover:-translate-y-1 hover:shadow-cardHover"
            >
              <Image
                src={ex.img}
                alt={ex.product}
                width={400}
                height={400}
                sizes="(max-width: 768px) 50vw, 300px"
                className="aspect-square w-full bg-muted/60 object-contain"
              />
              <div className="p-5">
                <p className="text-2xl">{ex.emoji}</p>
                <h3 className="mt-2 text-lg font-bold text-ink">
                  {ex.product}
                </h3>

                <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
                  Output yang dihasilkan
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {ex.outputs.map((o) => (
                    <span
                      key={o}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700"
                    >
                      <Check size={10} /> {o}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICING — Paket UMKM Starter

function PricingSection() {
  const tiers: Array<{
    name: string;
    tagline: string;
    icon: React.ReactNode;
    priceNormal: string;
    pricePromo: string;
    cta: string;
    paymentUrl: string;
    whatsappText: string;
    features: string[];
    highlighted: boolean;
    tone: "brand" | "amber" | "red";
  }> = [
    {
      name: "Paket UMKM Starter",
      tagline: "Untuk pemula yang mau coba dulu",
      icon: <Store size={14} />,
      priceNormal: "Rp 197.000",
      pricePromo: "Rp 97.000",
      cta: "Ambil Paket Starter",
      paymentUrl: "https://planetsoft.myr.id/pl/paket-standar-planetprompt",
      whatsappText:
        "Halo,%20saya%20mau%20tanya%20Paket%20UMKM%20Starter%20PlanetPrompt",
      features: [
        "**AKUN LOGIN KHUSUS APLIKASI PLANETPROMPT**",
        "1.000+ prompt AI siap pakai",
        "Template caption & copywriting",
        "Template konsep banner & poster",
        "Template story Instagram",
        "Template WhatsApp marketing",
        "Template marketplace seller",
        "DesignPrompt Kit (arahan visual)",
        "Cocok untuk pemula",
      ],
      highlighted: false,
      tone: "brand",
    },
    {
      name: "Paket VIP Member",
      tagline: "Mentoring langsung + tool extra",
      icon: <Crown size={14} />,
      priceNormal: "Rp 397.000",
      pricePromo: "Rp 199.000",
      cta: "Ambil Paket VIP",
      paymentUrl: "https://planetsoft.myr.id/pl/paket-vip-planetprompt",
      whatsappText:
        "Halo,%20saya%20mau%20tanya%20Paket%20VIP%20Member%20PlanetPrompt",
      features: [
        "**AKUN VIP KHUSUS APLIKASI PLANETPROMPT**",
        "**VIP Tool — Autofill Prompt (lebih cepat)**",
        "**Grup VIP private dengan mentoring langsung**",
        "**Sesi konsultasi 1-on-1 dengan founder**",
        "Semua benefit Paket Starter",
        "Prompt extra — 2.000+ template eksklusif",
        "Update prompt mingguan",
        "Prioritas support",
      ],
      highlighted: true,
      tone: "amber",
    },
    {
      name: "Paket Resell — White Label",
      tagline: "Punya bisnis SaaS sendiri, siap launching",
      icon: <Crown size={14} />,
      priceNormal: "Rp 1.799.000",
      pricePromo: "Rp 899.000",
      cta: "Ambil Paket Resell",
      paymentUrl: "https://planetsoft.myr.id/pl/paket-aplikasi-full-stack",
      whatsappText:
        "Halo,%20saya%20mau%20tanya%20Paket%20Resell%20PlanetPrompt",
      features: [
        "**APLIKASI PROMPT GENERATOR** — siap pakai",
        "**GANTI LOGO & BRAND** dengan punya kamu",
        "**SETUP APLIKASI, WEBSITE & DATABASE** — tim kami bantu",
        "**HAK RESELL 100%** — semua keuntungan milikmu",
        "Landing page custom premium siap launching",
        "Setup payment gateway (Tripay/Mayar/Scalev)",
        "Marketing kit lengkap (banner, caption, script ads)",
        "Konsultasi 1-on-1 dengan founder",
        "Akses semua benefit VIP Member",
      ],
      highlighted: false,
      tone: "red",
    },
  ];

  return (
    <section
      id="pricing"
      className="bg-gradient-to-b from-muted/40 to-white py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            Pilih Paket yang Cocok untuk{" "}
            <span className="text-brand">Tujuan Kamu</span>
          </h2>
          <p className="mt-3 text-ink/65">
            Mulai dari starter pemula, naik ke VIP dengan mentoring, atau Resell
            untuk income tambahan.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((t, i) => (
            <PricingCard key={i} {...t} />
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-ink/55">
          Sekali bayar · Akses selamanya · Tanpa langganan ·{" "}
          <span className="font-semibold text-emerald-600">
            Garansi 7 hari
          </span>
        </p>
      </div>
    </section>
  );
}

function PricingCard({
  name,
  tagline,
  icon,
  priceNormal,
  pricePromo,
  cta,
  paymentUrl,
  whatsappText,
  features,
  highlighted,
  tone,
}: {
  name: string;
  tagline: string;
  icon: React.ReactNode;
  priceNormal: string;
  pricePromo: string;
  cta: string;
  paymentUrl: string;
  whatsappText: string;
  features: string[];
  highlighted: boolean;
  tone: "brand" | "amber" | "red";
}) {
  const palette = {
    brand: {
      badge: "bg-brand-50 text-brand",
      cta: "bg-brand text-white shadow-brand/40 hover:shadow-brand/60",
      border: highlighted ? "border-brand" : "border-muted",
      bg: "bg-white",
    },
    amber: {
      badge: "bg-amber-100 text-amber-700",
      cta: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-amber-500/40 hover:shadow-amber-500/60",
      border: highlighted ? "border-amber-500" : "border-muted",
      bg: "bg-white",
    },
    red: {
      badge: "bg-white/20 text-white backdrop-blur",
      cta: "bg-white text-rose-700 shadow-2xl shadow-black/40 hover:shadow-black/60",
      border: "border-rose-300",
      bg: "bg-gradient-to-br from-rose-600 via-red-700 to-rose-900 text-white",
    },
  }[tone];

  const isRed = tone === "red";
  return (
    <div
      className={`relative rounded-3xl border-2 p-7 transition ${palette.bg} ${
        highlighted
          ? `${palette.border} scale-105 shadow-2xl`
          : `${palette.border} ${isRed ? "shadow-2xl shadow-rose-900/30" : "shadow-card"}`
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
          ⭐ Paling Populer
        </span>
      )}

      {isRed && (
        <span className="absolute -top-3 right-6 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-900 shadow-lg">
          <Crown size={11} /> Premium
        </span>
      )}

      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${palette.badge}`}
      >
        {icon} {name}
      </span>

      <p
        className={`mt-3 text-sm ${
          isRed ? "text-rose-100" : "text-ink/60"
        }`}
      >
        {tagline}
      </p>

      <div className="mt-6">
        <p
          className={`text-sm line-through ${
            isRed ? "text-rose-200/70" : "text-ink/45"
          }`}
        >
          {priceNormal}
        </p>
        <p
          className={`text-4xl font-extrabold md:text-5xl ${
            isRed ? "text-white" : "text-ink"
          }`}
        >
          {pricePromo}
        </p>
        <p
          className={`mt-1 text-xs ${
            isRed ? "text-rose-200/80" : "text-ink/55"
          }`}
        >
          Sekali bayar, akses lifetime
        </p>
      </div>

      <ul className="mt-7 space-y-2.5">
        {features.map((f, i) => (
          <li
            key={i}
            className={`flex items-start gap-2 text-sm ${
              isRed ? "text-white" : "text-ink"
            }`}
          >
            <CheckCircle2
              size={16}
              className={`mt-0.5 shrink-0 ${
                isRed ? "text-amber-300" : "text-emerald-500"
              }`}
            />
            <span
              dangerouslySetInnerHTML={{
                __html: f.replace(
                  /\*\*(.+?)\*\*/g,
                  isRed
                    ? '<strong class="font-bold text-amber-200">$1</strong>'
                    : '<strong class="font-bold text-ink">$1</strong>'
                ),
              }}
            />
          </li>
        ))}
      </ul>

      <a
        href={paymentUrl}
        target="_blank"
        rel="noreferrer"
        className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold shadow-xl transition hover:scale-[1.02] ${palette.cta}`}
      >
        <ShoppingBag size={16} /> {cta}
      </a>

      <a
        href={`https://wa.me/${WA_NUMBER}?text=${whatsappText}`}
        target="_blank"
        rel="noreferrer"
        className={`mt-3 flex w-full items-center justify-center gap-1.5 text-xs font-semibold underline-offset-4 transition hover:underline ${
          isRed ? "text-rose-100" : "text-ink/55 hover:text-brand"
        }`}
      >
        💬 Tanya admin dulu via WhatsApp
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ

function FaqSection() {
  const faq = [
    {
      q: "Apakah saya harus bisa desain?",
      a: "Tidak. PlanetPrompt dibuat khusus untuk pemula dan pemilik UMKM yang tidak bisa desain. Kamu akan dapat arahan teks, konsep visual, struktur promosi, dan ide konten yang bisa langsung digunakan.",
    },
    {
      q: "Apakah PlanetPrompt bisa langsung bikin gambar desain?",
      a: "PlanetPrompt <strong>bukan aplikasi desain</strong> seperti Canva. PlanetPrompt berisi template prompt untuk bantu kamu bikin konsep desain, teks promosi, caption, deskripsi produk, dan arahan visual. Hasilnya bisa kamu pakai di ChatGPT, Gemini, Claude, Canva AI, atau AI image generator.",
    },
    {
      q: "Apakah cocok untuk bisnis kecil?",
      a: "Ya, sangat cocok. Makanan, minuman, fashion, skincare, jasa lokal, toko online, marketplace seller — semua tipe UMKM bisa pakai. Template prompt-nya dibuat fleksibel untuk berbagai produk.",
    },
    {
      q: "Apakah saya harus paham prompt engineering?",
      a: "Tidak. Template sudah disusun rapi agar mudah dipakai. Kamu cukup mengganti bagian seperti nama produk, harga, promo, target pembeli, dan platform.",
    },
    {
      q: "Bisa dipakai berkali-kali?",
      a: "Ya. Prompt bisa digunakan berulang kali untuk berbagai produk, campaign, dan kebutuhan konten. Sekali beli, pakai selamanya.",
    },
    {
      q: "AI apa saja yang bisa digunakan?",
      a: "Prompt bisa dipakai di <strong>ChatGPT, Gemini, Claude</strong>, dan beberapa AI tools lain. Untuk kebutuhan visual, prompt juga bisa disesuaikan ke AI image generator seperti Midjourney atau DALL-E.",
    },
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            Pertanyaan yang Sering Ditanyakan
          </h2>
        </div>

        <div className="mt-12 space-y-2">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-muted bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-muted/30"
                >
                  <span className="text-sm font-semibold text-ink md:text-base">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-brand transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p
                    className="border-t border-muted p-5 pt-4 text-sm leading-relaxed text-ink/70"
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
    <section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand-600 to-orange-700 py-20 text-white lg:py-28">
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance text-3xl font-extrabold leading-tight md:text-5xl">
          Siap Bikin Konten Jualan yang Lebih{" "}
          <span className="text-amber-200">Rapi dan Menarik?</span>
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-base text-white/85 md:text-lg">
          Mulai dari caption, banner, deskripsi marketplace, sampai promosi WhatsApp —
          semua bisa kamu buat lebih cepat dengan template prompt siap pakai
          dari PlanetPrompt.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-brand shadow-2xl transition hover:scale-105"
          >
            <ShoppingBag size={20} /> Ambil Toolkit Konten UMKM Sekarang
          </a>
        </div>

        <p className="mt-5 text-xs text-white/75">
          Cocok untuk pemula · Bisa dipakai berkali-kali · Tidak perlu bisa
          desain
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
        <div className="overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-br from-brand-50 to-white p-8 md:p-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand">
                <Users size={12} /> 5.000+ member bergabung
              </p>
              <h3 className="mt-3 text-2xl font-bold text-ink md:text-3xl">
                Gabung Komunitas PlanetPrompt
              </h3>
              <p className="mt-2 max-w-lg text-sm text-ink/65">
                Tips konten harian, share trick AI untuk jualan, dan penawaran
                khusus member. Gratis join.
              </p>
            </div>
            <a
              href={COMMUNITY_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-600"
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
    <footer className="border-t border-muted py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center text-xs text-ink/50 md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-2">
          <Image
            src="/brand/planetsoft-icon.png"
            alt="PlanetSoft"
            width={48}
            height={48}
            className="h-6 w-6 shrink-0 object-contain"
          />
          <span>
            © {new Date().getFullYear()} PlanetSoft. Toolkit konten untuk UMKM
            Indonesia.
          </span>
        </div>
        <div className="flex gap-5">
          <a href="#" className="hover:text-brand">
            Privacy
          </a>
          <a href="#" className="hover:text-brand">
            Terms
          </a>
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-brand"
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
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-muted bg-white/95 p-3 shadow-2xl backdrop-blur md:hidden">
      <a
        href="#pricing"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/30"
      >
        <ShoppingBag size={18} /> Ambil Toolkit UMKM • Rp 97.000
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO MODAL (kept for future use)

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
// DEFER MOUNT — render children hanya saat container mendekati viewport.
// Dipakai untuk section berat (marquee 30 images) supaya nggak download
// & nggak animate sebelum user scroll ke section itu. Reduces initial JS
// work + saves bandwidth di mobile.

function DeferMount({
  children,
  minHeight = "240px",
  rootMargin = "300px",
}: {
  children: React.ReactNode;
  minHeight?: string;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || mounted) return;
    // Fallback: kalau IntersectionObserver nggak ada, langsung mount
    if (typeof IntersectionObserver === "undefined") {
      setMounted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [mounted, rootMargin]);

  return (
    <div ref={ref} style={{ minHeight: mounted ? undefined : minHeight }}>
      {mounted ? children : null}
    </div>
  );
}
