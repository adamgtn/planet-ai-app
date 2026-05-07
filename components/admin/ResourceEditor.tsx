"use client";

import { Plus, Trash2, FileText, Link2 } from "lucide-react";
import type { Resource } from "@/lib/mockData";

const TYPES = ["PDF", "DOCX", "XLSX", "CSV", "ZIP", "PNG", "MP4", "LINK"];

export function ResourceEditor({
  resources,
  onChange,
}: {
  resources: Resource[];
  onChange: (next: Resource[]) => void;
}) {
  const update = (i: number, patch: Partial<Resource>) =>
    onChange(resources.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const remove = (i: number) =>
    onChange(resources.filter((_, idx) => idx !== i));

  const add = () =>
    onChange([
      ...resources,
      { name: "", type: "PDF", size: "", url: "" },
    ]);

  return (
    <div className="space-y-2">
      {resources.length === 0 && (
        <p className="rounded-lg border border-dashed border-muted bg-white p-3 text-center text-[11px] text-ink/50">
          Belum ada materi. Tambahkan PDF, dataset, template, atau link
          referensi.
        </p>
      )}

      {resources.map((r, i) => (
        <div
          key={i}
          className="grid grid-cols-1 gap-2 rounded-lg border border-muted bg-white p-2.5 sm:grid-cols-[1.4fr_90px_90px_1.4fr_36px]"
        >
          <div className="relative">
            <FileText
              size={12}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <input
              value={r.name}
              onChange={(e) => update(i, { name: e.target.value })}
              placeholder="Nama materi (Slide-Modul-1.pdf)"
              className="w-full rounded-md border border-muted bg-white py-1.5 pl-7 pr-2 text-xs focus:border-brand focus:ring-1 focus:ring-brand/30"
            />
          </div>
          <select
            value={r.type}
            onChange={(e) => update(i, { type: e.target.value })}
            className="rounded-md border border-muted bg-white px-2 py-1.5 text-xs focus:border-brand focus:ring-1 focus:ring-brand/30"
          >
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <input
            value={r.size}
            onChange={(e) => update(i, { size: e.target.value })}
            placeholder="2.4 MB"
            className="rounded-md border border-muted bg-white px-2 py-1.5 text-xs focus:border-brand focus:ring-1 focus:ring-brand/30"
          />
          <div className="relative">
            <Link2
              size={12}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <input
              value={r.url ?? ""}
              onChange={(e) => update(i, { url: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-md border border-muted bg-white py-1.5 pl-7 pr-2 font-mono text-[11px] focus:border-brand focus:ring-1 focus:ring-brand/30"
            />
          </div>
          <button
            type="button"
            onClick={() => remove(i)}
            aria-label="Hapus materi"
            className="grid h-8 w-8 place-items-center rounded-md border border-muted text-ink/50 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-muted px-3 py-1.5 text-xs font-semibold text-ink/65 transition hover:border-brand hover:text-brand"
      >
        <Plus size={12} /> Tambah Materi
      </button>
    </div>
  );
}
