"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  ImageIcon,
  Link2,
  Plus,
  Save,
  Upload,
} from "lucide-react";
import type { Module, Product } from "@/lib/mockData";
import { useDataStore, makeId } from "@/lib/dataStore";
import { ModuleEditor } from "./ModuleEditor";

type Props = {
  mode: "create" | "edit";
  initial?: Product;
};

const LEVELS: Product["level"][] = ["Pemula", "Menengah", "Lanjutan"];

const COVERS = [
  "from-orange-400 to-orange-600",
  "from-amber-400 to-orange-500",
  "from-orange-300 to-rose-500",
  "from-orange-300 to-pink-400",
  "from-rose-400 to-orange-500",
  "from-orange-400 to-amber-300",
];

const STATUS_OPTIONS: { id: Product["status"]; label: string; hint: string }[] =
  [
    {
      id: "purchased",
      label: "Aktif (Purchased)",
      hint: "Tampil sebagai kelas yang bisa diakses member.",
    },
    {
      id: "locked",
      label: "Locked",
      hint: "Member belum punya akses, tampil tombol Beli.",
    },
    {
      id: "expired",
      label: "Expired",
      hint: "Akses sudah berakhir, butuh perpanjangan.",
    },
  ];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function ProductForm({ mode, initial }: Props) {
  const router = useRouter();
  const { upsertProduct, removeProduct } = useDataStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [tagline, setTagline] = useState(initial?.tagline ?? "");
  const [level, setLevel] = useState<Product["level"]>(
    initial?.level ?? "Pemula"
  );
  const [duration, setDuration] = useState(initial?.duration ?? "");
  const [lessonCount, setLessonCount] = useState(
    initial?.lessonCount?.toString() ?? "0"
  );
  const [cover, setCover] = useState(initial?.cover ?? COVERS[0]);
  const [image, setImage] = useState<string>(initial?.image ?? "");
  const [imageError, setImageError] = useState("");
  const [landingUrl, setLandingUrl] = useState(initial?.landingUrl ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [status, setStatus] = useState<Product["status"]>(
    initial?.status ?? "purchased"
  );
  const [progress, setProgress] = useState(
    initial?.progress?.toString() ?? "0"
  );
  const [modules, setModules] = useState<Module[]>(initial?.modules ?? []);
  const [success, setSuccess] = useState(false);

  const totalLessonsLive = modules.reduce(
    (sum, m) => sum + m.lessons.length,
    0
  );

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    const id = initial?.id ?? (slugify(title) || makeId("p"));

    const payload: Product = {
      id,
      title,
      tagline,
      level,
      duration,
      lessonCount: Number(lessonCount) || totalLessonsLive || 0,
      status,
      progress: Number(progress) || 0,
      cover,
      image: image || `/products/${id}.svg`,
      landingUrl,
      price: price || undefined,
      modules,
    };

    try {
      await upsertProduct(payload);
      setSuccess(true);
      setTimeout(() => router.push("/admin/products"), 700);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Gagal menyimpan produk."
      );
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!initial) return;
    if (!window.confirm(`Hapus produk "${initial.title}" secara permanen?`))
      return;
    removeProduct(initial.id);
    router.push("/admin/products");
  };

  const handleFile = (file: File | undefined) => {
    setImageError("");
    if (!file) return;
    if (!/^(image\/png|image\/jpeg|image\/svg\+xml)$/.test(file.type)) {
      setImageError("Format harus PNG, JPG, atau SVG.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Ukuran maksimal 5 MB.");
      return;
    }

    const url = URL.createObjectURL(file);
    const probe = new Image();
    probe.onload = () => {
      if (probe.width !== probe.height) {
        setImageError(
          `Disarankan rasio 1:1 (1000×1000). Gambarmu ${probe.width}×${probe.height}.`
        );
      }
      setImage(url);
    };
    probe.onerror = () => setImage(url);
    probe.src = url;
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const addModule = () =>
    setModules((prev) => [
      ...prev,
      {
        id: makeId("m"),
        title: `Modul ${prev.length + 1} — `,
        lessons: [],
      },
    ]);

  const updateModule = (i: number, m: Module) =>
    setModules((prev) => prev.map((x, idx) => (idx === i ? m : x)));

  const removeModule = (i: number) =>
    setModules((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <form onSubmit={submit} className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink/60 hover:text-brand"
      >
        <ArrowLeft size={14} /> Kembali ke katalog produk
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Cover & image */}
          <section className="card-base overflow-hidden">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className={`relative h-72 w-full bg-gradient-to-br ${cover}`}
            >
              {image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt="Preview"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 grid place-items-center text-white/85">
                  <div className="text-center">
                    <ImageIcon className="mx-auto mb-2 opacity-80" size={36} />
                    <p className="text-sm font-semibold">
                      Drop gambar produk di sini
                    </p>
                    <p className="text-xs opacity-80">
                      PNG / JPG · 1000×1000 · Maks 5 MB
                    </p>
                  </div>
                </div>
              )}
              <div className="absolute left-5 top-5">
                <p className="rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold text-ink">
                  {level}
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink shadow-card hover:bg-white"
              >
                <Upload size={12} /> {image ? "Ganti Gambar" : "Upload Gambar"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <div className="absolute bottom-5 left-5 max-w-[80%] text-white">
                <p className="text-2xl font-bold drop-shadow">
                  {title || "Judul Produk Baru"}
                </p>
                <p className="text-sm text-white/85 drop-shadow line-clamp-1">
                  {tagline || "Tagline singkat akan muncul di sini..."}
                </p>
              </div>
            </div>

            <div className="border-t border-muted p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink/45">
                Gradient fallback (jika gambar tidak tersedia)
              </p>
              <div className="flex flex-wrap gap-2">
                {COVERS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCover(c)}
                    className={`h-9 w-16 rounded-lg bg-gradient-to-br ${c} ring-offset-2 transition ${
                      cover === c
                        ? "ring-2 ring-brand"
                        : "hover:ring-2 hover:ring-brand/40"
                    }`}
                    aria-label="Pilih gradient"
                  />
                ))}
              </div>
              {imageError && (
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  ⚠ {imageError}
                </p>
              )}
              <p className="mt-2 text-[11px] text-ink/55">
                💡 Resolusi rekomendasi <strong>1000×1000</strong> agar tampil
                tajam di card produk dan halaman detail.
              </p>
            </div>
          </section>

          <section className="card-base p-6">
            <h2 className="text-lg font-bold text-ink">Detail Produk</h2>

            <div className="mt-5 space-y-4">
              <Field
                label="Judul Produk"
                value={title}
                onChange={setTitle}
                placeholder="Cth: Prompt Engineering Mastery"
                required
              />
              <Field
                label="Tagline / Deskripsi Singkat"
                value={tagline}
                onChange={setTagline}
                placeholder="Satu kalimat yang menjelaskan benefit produk."
                required
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">
                    Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) =>
                      setLevel(e.target.value as Product["level"])
                    }
                    className="input-base"
                  >
                    {LEVELS.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <Field
                  label="Total Durasi"
                  value={duration}
                  onChange={setDuration}
                  placeholder="6 jam 20 menit"
                />
                <Field
                  label="Jumlah Lesson"
                  value={lessonCount}
                  onChange={setLessonCount}
                  type="number"
                  placeholder={`Otomatis: ${totalLessonsLive}`}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Harga"
                  value={price}
                  onChange={setPrice}
                  placeholder="Rp 499.000"
                />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">
                    Landing Page URL
                  </label>
                  <div className="relative">
                    <Link2
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
                    />
                    <input
                      type="url"
                      value={landingUrl}
                      onChange={(e) => setLandingUrl(e.target.value)}
                      placeholder="https://planet-ai.id/produk/xxx"
                      className="input-base pl-9"
                    />
                  </div>
                  {landingUrl && (
                    <a
                      href={landingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline"
                    >
                      Buka pratinjau <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Curriculum builder */}
          <section className="card-base p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-ink">
                  Kurikulum & Materi
                </h2>
                <p className="mt-1 text-xs text-ink/55">
                  Struktur modul → lesson → video YouTube → materi pendukung.
                  Total saat ini: <strong>{totalLessonsLive} lesson</strong>{" "}
                  dalam <strong>{modules.length} modul</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={addModule}
                className="btn-ghost py-2"
              >
                <Plus size={14} /> Tambah Modul
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {modules.length === 0 && (
                <div className="rounded-xl border border-dashed border-muted bg-muted/40 p-8 text-center">
                  <p className="text-sm font-semibold text-ink/70">
                    Belum ada kurikulum
                  </p>
                  <p className="mt-1 text-xs text-ink/55">
                    Mulai dengan menambah modul pertama, lalu isi lesson + video
                    YouTube + materi PDF/dataset.
                  </p>
                  <button
                    type="button"
                    onClick={addModule}
                    className="btn-primary mt-4"
                  >
                    <Plus size={14} /> Tambah Modul Pertama
                  </button>
                </div>
              )}

              {modules.map((m, i) => (
                <ModuleEditor
                  key={m.id}
                  module={m}
                  index={i}
                  onChange={(next) => updateModule(i, next)}
                  onRemove={() => removeModule(i)}
                />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <section className="card-base p-6">
            <h2 className="text-lg font-bold text-ink">Status Produk</h2>
            <div className="mt-4 space-y-2">
              {STATUS_OPTIONS.map((s) => (
                <label
                  key={s.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                    status === s.id
                      ? "border-brand bg-brand-50/60"
                      : "border-muted bg-white hover:border-brand/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    checked={status === s.id}
                    onChange={() => setStatus(s.id)}
                    className="mt-1 h-4 w-4 border-muted text-brand focus:ring-brand"
                  />
                  <div>
                    <p className="text-sm font-semibold text-ink">{s.label}</p>
                    <p className="text-[11px] text-ink/55">{s.hint}</p>
                  </div>
                </label>
              ))}
            </div>

            {status === "purchased" && (
              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-medium text-ink">
                  Progress (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  className="input-base"
                />
              </div>
            )}
          </section>

          <section className="card-base space-y-3 p-6">
            <h2 className="text-lg font-bold text-ink">Aksi</h2>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full"
            >
              <Save size={16} />
              {submitting
                ? "Menyimpan..."
                : mode === "create"
                ? "Publikasikan Produk"
                : "Simpan Perubahan"}
            </button>
            {submitError && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
                {submitError}
              </p>
            )}
            {success && (
              <p className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-50 py-2 text-sm text-emerald-700">
                <CheckCircle2 size={14} /> Tersimpan & ter-sinkron ke member
                area.
              </p>
            )}
            <Link
              href="/admin/products"
              className="btn-ghost w-full justify-center"
            >
              Batal
            </Link>

            {mode === "edit" && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/40 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                Hapus Produk
              </button>
            )}
          </section>

          <section className="card-base p-6">
            <h2 className="text-sm font-bold text-ink">Tips Konten</h2>
            <ul className="mt-3 space-y-2 text-xs text-ink/60">
              <li>✓ Gambar produk <strong>1000×1000</strong> agar tajam.</li>
              <li>✓ URL YouTube biasa OK, sistem auto-konversi ke embed.</li>
              <li>✓ Tambahkan materi PDF/CSV/ZIP per lesson.</li>
              <li>✓ Resource bisa berupa link eksternal (Notion, Drive).</li>
            </ul>
          </section>
        </aside>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="input-base"
      />
    </div>
  );
}
