"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  FileText,
  Image as ImageIcon,
  RotateCcw,
  Video,
  Wand2,
} from "lucide-react";

type Field = {
  key: string;
  label: string;
  placeholder: string;
  hint?: string;
};

type Category = {
  id: string;
  name: string;
  icon: typeof Video;
  description: string;
  fields: Field[];
  build: (v: Record<string, string>) => string;
};

const CATEGORIES: Category[] = [
  {
    id: "video",
    name: "Video AI",
    icon: Video,
    description: "Vidu AI, Kling AI, Runway. Fokus camera movement & lighting.",
    fields: [
      { key: "subject", label: "Subjek", placeholder: "Botol parfum kaca bening" },
      { key: "action", label: "Aksi / Pergerakan", placeholder: "Berputar perlahan di atas pasir" },
      { key: "setting", label: "Latar / Lokasi", placeholder: "Pemandangan pantai saat sunset" },
      { key: "camera", label: "Camera Movement", placeholder: "Slow dolly-in, low angle" },
      { key: "lighting", label: "Lighting", placeholder: "Golden hour, sinar matahari hangat" },
      { key: "mood", label: "Suasana / Mood", placeholder: "Sinematik, mewah, tenang" },
      { key: "resolution", label: "Resolusi", placeholder: "4K, 24fps, aspect 16:9" },
    ],
    build: (v) =>
      [
        v.subject && `${v.subject}`,
        v.action && `, ${v.action}`,
        v.setting && `, di ${v.setting}`,
        v.camera && `. Camera: ${v.camera}`,
        v.lighting && `. Lighting: ${v.lighting}`,
        v.mood && `. Mood: ${v.mood}`,
        v.resolution && `. ${v.resolution}`,
      ]
        .filter(Boolean)
        .join("")
        .trim(),
  },
  {
    id: "image",
    name: "Image Generation",
    icon: ImageIcon,
    description: "Midjourney, Leonardo, SDXL. Fokus style & render engine.",
    fields: [
      { key: "subject", label: "Subjek Utama", placeholder: "Astronot duduk di bulan" },
      { key: "style", label: "Gaya Visual", placeholder: "Hyperrealistic, cinematic" },
      { key: "details", label: "Detail Tambahan", placeholder: "Helmet memantulkan bumi" },
      { key: "engine", label: "Render Engine", placeholder: "Octane render, Unreal Engine 5" },
      { key: "lighting", label: "Lighting", placeholder: "Dramatic rim light" },
      { key: "ratio", label: "Aspect Ratio", placeholder: "--ar 16:9 --v 6 --style raw" },
    ],
    build: (v) =>
      [
        v.subject,
        v.style && `, ${v.style}`,
        v.details && `, ${v.details}`,
        v.engine && `, ${v.engine}`,
        v.lighting && `, ${v.lighting}`,
        v.ratio && ` ${v.ratio}`,
      ]
        .filter(Boolean)
        .join("")
        .trim(),
  },
  {
    id: "text",
    name: "Text AI",
    icon: FileText,
    description: "ChatGPT, Claude, Gemini. Fokus role + tugas + format output.",
    fields: [
      { key: "role", label: "Role / Persona", placeholder: "Senior copywriter brand fashion" },
      { key: "context", label: "Konteks", placeholder: "Sedang launching koleksi Lebaran" },
      { key: "task", label: "Tugas", placeholder: "Tulis 5 caption Instagram persuasif" },
      { key: "tone", label: "Tone of Voice", placeholder: "Hangat, ramah, sedikit playful" },
      { key: "format", label: "Format Output", placeholder: "Bullet point, max 30 kata, ada CTA" },
      { key: "constraint", label: "Constraint / Larangan", placeholder: "Hindari kata 'diskon'" },
    ],
    build: (v) =>
      [
        v.role && `Bertindaklah sebagai ${v.role}.`,
        v.context && `Konteks: ${v.context}.`,
        v.task && `Tugas: ${v.task}.`,
        v.tone && `Gunakan tone ${v.tone}.`,
        v.format && `Format output: ${v.format}.`,
        v.constraint && `Constraint: ${v.constraint}.`,
      ]
        .filter(Boolean)
        .join(" "),
  },
];

export default function PromptGeneratorPage() {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [values, setValues] = useState<Record<string, Record<string, string>>>(
    {}
  );
  const [copied, setCopied] = useState(false);

  const category = CATEGORIES.find((c) => c.id === activeCat)!;
  const formValues = values[activeCat] ?? {};

  const prompt = useMemo(() => {
    const built = category.build(formValues).trim();
    return built || "Mulai isi form di kiri untuk melihat prompt-mu di sini ✨";
  }, [category, formValues]);

  const wordCount = prompt.split(/\s+/).filter(Boolean).length;

  const setField = (key: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [activeCat]: { ...(prev[activeCat] ?? {}), [key]: value },
    }));
  };

  const reset = () => {
    setValues((prev) => ({ ...prev, [activeCat]: {} }));
    setCopied(false);
  };

  const copy = async () => {
    if (!category.build(formValues).trim()) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
      {/* Left Panel — Form */}
      <section className="card-base p-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/55">
            Pilih Kategori Template
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const active = c.id === activeCat;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.id)}
                  className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                    active
                      ? "border-brand bg-brand-50"
                      : "border-muted bg-white hover:border-brand/50"
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                      active
                        ? "bg-brand text-white"
                        : "bg-muted text-ink/60"
                    }`}
                  >
                    <Icon size={18} />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink">
                      {c.name}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-ink/55">
                      {c.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {category.fields.map((f) => (
            <div key={f.key}>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                {f.label}
              </label>
              <input
                type="text"
                value={formValues[f.key] ?? ""}
                onChange={(e) => setField(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="input-base"
              />
              {f.hint && (
                <p className="mt-1 text-[11px] text-ink/50">{f.hint}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button onClick={copy} className="btn-primary">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Tersalin!" : "Copy to Clipboard"}
          </button>
          <button onClick={reset} className="btn-ghost">
            <RotateCcw size={14} /> Reset
          </button>
          <span className="ml-auto text-xs text-ink/55">
            {Object.values(formValues).filter(Boolean).length} /{" "}
            {category.fields.length} field terisi
          </span>
        </div>
      </section>

      {/* Right Panel — Live Preview */}
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <div className="card-base overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 bg-[#0f1115] px-5 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-3 text-xs font-mono text-white/60">
                live-preview.txt
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-white/60">
              <Wand2 size={12} /> {category.name}
            </span>
          </div>

          <div className="bg-[#0f1115] p-5 text-sm leading-relaxed text-emerald-200">
            <p className="whitespace-pre-wrap font-mono">{prompt}</p>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 bg-[#0a0c10] px-5 py-3 text-[11px] text-white/55">
            <span>{wordCount} kata · {prompt.length} karakter</span>
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-600"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-dashed border-muted bg-white p-4 text-xs text-ink/60">
          💡 Tips: kosongkan field yang tidak relevan — sistem otomatis melewati
          bagian itu di prompt akhir.
        </div>
      </aside>
    </div>
  );
}
