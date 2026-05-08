"use client";

import { useRef } from "react";
import {
  Plus,
  Trash2,
  FileText,
  Link2,
  Upload,
  Paperclip,
  X,
} from "lucide-react";
import type { Resource } from "@/lib/mockData";

const TYPES = ["PDF", "DOCX", "XLSX", "CSV", "ZIP", "PNG", "MP4", "LINK"];

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

function typeFromName(filename: string): string {
  const ext = filename.split(".").pop()?.toUpperCase() ?? "";
  if (TYPES.includes(ext)) return ext;
  return "PDF";
}

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
          Belum ada materi. Tambahkan PDF (upload file) atau link Google Drive.
        </p>
      )}

      {resources.map((r, i) => (
        <ResourceRow
          key={i}
          resource={r}
          onUpdate={(patch) => update(i, patch)}
          onRemove={() => remove(i)}
        />
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

function ResourceRow({
  resource,
  onUpdate,
  onRemove,
}: {
  resource: Resource;
  onUpdate: (patch: Partial<Resource>) => void;
  onRemove: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasPendingFile = !!resource._pendingFile;
  const hasExistingFile = !hasPendingFile && resource.url?.includes("/api/files/");

  const onPickFile = (file: File) => {
    onUpdate({
      _pendingFile: file,
      name: resource.name || file.name,
      size: humanSize(file.size),
      type: resource.type === "LINK" ? typeFromName(file.name) : resource.type,
      url: "", // clear URL — akan di-set setelah upload selesai
    });
  };

  const clearFile = () => {
    onUpdate({ _pendingFile: undefined, url: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="rounded-lg border border-muted bg-white p-2.5 space-y-2">
      {/* Row 1: name + type + size + delete */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1.6fr_100px_90px_36px]">
        <div className="relative">
          <FileText
            size={12}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/40"
          />
          <input
            value={resource.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Nama materi (Slide-Modul-1.pdf)"
            className="w-full rounded-md border border-muted bg-white py-1.5 pl-7 pr-2 text-xs focus:border-brand focus:ring-1 focus:ring-brand/30"
          />
        </div>
        <select
          value={resource.type}
          onChange={(e) => onUpdate({ type: e.target.value })}
          className="rounded-md border border-muted bg-white px-2 py-1.5 text-xs focus:border-brand focus:ring-1 focus:ring-brand/30"
        >
          {TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <input
          value={resource.size}
          onChange={(e) => onUpdate({ size: e.target.value })}
          placeholder="2.4 MB"
          className="rounded-md border border-muted bg-white px-2 py-1.5 text-xs focus:border-brand focus:ring-1 focus:ring-brand/30"
        />
        <button
          type="button"
          onClick={onRemove}
          aria-label="Hapus materi"
          className="grid h-8 w-8 place-items-center rounded-md border border-muted text-ink/50 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Row 2: file upload OR link URL */}
      {hasPendingFile ? (
        <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs">
          <Paperclip size={12} className="text-emerald-600" />
          <span className="flex-1 truncate font-medium text-emerald-700">
            📄 {resource._pendingFile?.name}
            <span className="ml-1 text-emerald-600/70">
              ({humanSize(resource._pendingFile?.size ?? 0)}) — siap di-upload
            </span>
          </span>
          <button
            type="button"
            onClick={clearFile}
            aria-label="Hapus file"
            className="grid h-5 w-5 place-items-center rounded-md text-emerald-700 hover:bg-emerald-100"
          >
            <X size={11} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Link2
              size={12}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <input
              value={resource.url ?? ""}
              onChange={(e) => onUpdate({ url: e.target.value })}
              placeholder="https://drive.google.com/... atau link lain"
              className="w-full rounded-md border border-muted bg-white py-1.5 pl-7 pr-2 font-mono text-[11px] focus:border-brand focus:ring-1 focus:ring-brand/30"
            />
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-md border border-brand/40 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white"
          >
            <Upload size={12} /> Upload File
          </button>
        </div>
      )}

      {hasExistingFile && !hasPendingFile && (
        <p className="text-[10px] text-ink/45">
          📎 File sudah terupload — paste URL baru atau klik Upload File untuk
          ganti.
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.xlsx,.csv,.zip,.png,.mp4,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPickFile(f);
        }}
      />
    </div>
  );
}
