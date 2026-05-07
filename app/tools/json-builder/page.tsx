"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Braces,
  Check,
  Copy,
  Download,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";

type DataType = "string" | "number" | "boolean" | "array" | "object" | "null";

type Row = {
  id: string;
  key: string;
  type: DataType;
  value: string;
};

const TYPES: { id: DataType; label: string; placeholder: string }[] = [
  { id: "string", label: "String", placeholder: "Sepatu AI" },
  { id: "number", label: "Number", placeholder: "199000" },
  { id: "boolean", label: "Boolean", placeholder: "true / false" },
  { id: "array", label: "Array", placeholder: "merah, biru, hijau" },
  { id: "object", label: "Object", placeholder: '{ "warna": "merah" }' },
  { id: "null", label: "Null", placeholder: "—" },
];

const uid = () => Math.random().toString(36).slice(2, 9);

const newRow = (): Row => ({ id: uid(), key: "", type: "string", value: "" });

function castValue(row: Row): { ok: boolean; value: unknown; error?: string } {
  if (!row.key.trim()) return { ok: false, value: null, error: "Key kosong" };

  switch (row.type) {
    case "string":
      return { ok: true, value: row.value };
    case "number": {
      if (row.value.trim() === "")
        return { ok: false, value: null, error: "Nilai number kosong" };
      const n = Number(row.value);
      if (Number.isNaN(n))
        return { ok: false, value: null, error: "Bukan angka valid" };
      return { ok: true, value: n };
    }
    case "boolean": {
      const v = row.value.trim().toLowerCase();
      if (v === "true") return { ok: true, value: true };
      if (v === "false") return { ok: true, value: false };
      return {
        ok: false,
        value: null,
        error: "Boolean harus 'true' atau 'false'",
      };
    }
    case "array": {
      const trimmed = row.value.trim();
      if (!trimmed) return { ok: true, value: [] };
      // Try JSON first
      if (trimmed.startsWith("[")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (!Array.isArray(parsed))
            return { ok: false, value: null, error: "Bukan array JSON valid" };
          return { ok: true, value: parsed };
        } catch {
          return { ok: false, value: null, error: "Array JSON tidak valid" };
        }
      }
      // Fallback: comma-separated → string array (auto-cast number/bool)
      const parts = trimmed.split(",").map((p) => {
        const s = p.trim();
        if (s === "true") return true;
        if (s === "false") return false;
        if (s !== "" && !Number.isNaN(Number(s))) return Number(s);
        return s;
      });
      return { ok: true, value: parts };
    }
    case "object": {
      const trimmed = row.value.trim();
      if (!trimmed) return { ok: true, value: {} };
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed !== "object" || Array.isArray(parsed) || parsed === null)
          return { ok: false, value: null, error: "Harus berupa object JSON" };
        return { ok: true, value: parsed };
      } catch {
        return { ok: false, value: null, error: "Object JSON tidak valid" };
      }
    }
    case "null":
      return { ok: true, value: null };
  }
}

export default function JsonBuilderPage() {
  const [rows, setRows] = useState<Row[]>([
    { id: uid(), key: "nama_produk", type: "string", value: "Sepatu AI" },
    { id: uid(), key: "harga", type: "number", value: "199000" },
    { id: uid(), key: "tersedia", type: "boolean", value: "true" },
    { id: uid(), key: "ukuran", type: "array", value: "39, 40, 41, 42" },
  ]);
  const [copied, setCopied] = useState(false);

  const { json, errors } = useMemo(() => {
    const obj: Record<string, unknown> = {};
    const errs: { id: string; msg: string }[] = [];
    const seen = new Set<string>();

    for (const row of rows) {
      const result = castValue(row);
      if (!result.ok) {
        errs.push({ id: row.id, msg: result.error ?? "Tidak valid" });
        continue;
      }
      const k = row.key.trim();
      if (seen.has(k)) {
        errs.push({ id: row.id, msg: `Key "${k}" duplikat` });
        continue;
      }
      seen.add(k);
      obj[k] = result.value;
    }

    return { json: obj, errors: errs };
  }, [rows]);

  const formatted = useMemo(() => JSON.stringify(json, null, 2), [json]);

  const errorMap = useMemo(
    () => Object.fromEntries(errors.map((e) => [e.id, e.msg])),
    [errors]
  );

  const updateRow = (id: string, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const addRow = () => setRows((prev) => [...prev, newRow()]);
  const removeRow = (id: string) =>
    setRows((prev) => prev.filter((r) => r.id !== id));
  const reset = () => setRows([newRow()]);

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const download = () => {
    const blob = new Blob([formatted], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompt-builder-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
      {/* Left Panel — Editor */}
      <section className="card-base p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Visual Key-Value Editor</h2>
            <p className="text-xs text-ink/60">
              Tambahkan parameter, pilih tipe data, dan biarkan kami
              memformat JSON-nya.
            </p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button onClick={reset} className="btn-ghost py-2">
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        <div className="mb-3 hidden grid-cols-[1.2fr_120px_1.6fr_40px] gap-3 px-1 text-[11px] font-semibold uppercase tracking-wider text-ink/45 md:grid">
          <span>Key</span>
          <span>Type</span>
          <span>Value</span>
          <span />
        </div>

        <div className="space-y-2.5">
          {rows.map((row) => {
            const err = errorMap[row.id];
            return (
              <div
                key={row.id}
                className={`grid grid-cols-1 gap-2 rounded-xl border p-3 transition md:grid-cols-[1.2fr_120px_1.6fr_40px] md:gap-3 ${
                  err
                    ? "border-rose-300 bg-rose-50/50"
                    : "border-muted bg-white"
                }`}
              >
                <input
                  type="text"
                  value={row.key}
                  onChange={(e) => updateRow(row.id, { key: e.target.value })}
                  placeholder="key_name"
                  className="rounded-lg border border-muted bg-white px-3 py-2 font-mono text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
                <select
                  value={row.type}
                  onChange={(e) =>
                    updateRow(row.id, { type: e.target.value as DataType })
                  }
                  className="rounded-lg border border-muted bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                >
                  {TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={row.value}
                  onChange={(e) => updateRow(row.id, { value: e.target.value })}
                  placeholder={
                    TYPES.find((t) => t.id === row.type)?.placeholder ?? ""
                  }
                  disabled={row.type === "null"}
                  className="rounded-lg border border-muted bg-white px-3 py-2 font-mono text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:bg-muted/60 disabled:text-ink/40"
                />
                <button
                  onClick={() => removeRow(row.id)}
                  aria-label="Hapus baris"
                  className="grid h-10 w-10 place-items-center rounded-lg border border-muted text-ink/50 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500"
                >
                  <Trash2 size={16} />
                </button>

                {err && (
                  <p className="col-span-full inline-flex items-center gap-1.5 text-xs text-rose-600">
                    <AlertTriangle size={12} /> {err}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button onClick={addRow} className="btn-primary">
            <Plus size={16} /> Tambah Parameter Baru
          </button>
          <button onClick={reset} className="btn-ghost sm:hidden">
            <RotateCcw size={14} /> Reset
          </button>
          <span className="ml-auto text-xs text-ink/55">
            {rows.length} parameter ·{" "}
            {errors.length === 0 ? (
              <span className="font-semibold text-emerald-600">JSON valid</span>
            ) : (
              <span className="font-semibold text-rose-600">
                {errors.length} error
              </span>
            )}
          </span>
        </div>
      </section>

      {/* Right Panel — Code Viewer */}
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <div className="card-base overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 bg-[#0f1115] px-5 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-3 text-xs font-mono text-white/60">
                output.json
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-white/60">
              <Braces size={12} /> JSON Builder
            </span>
          </div>

          <pre className="max-h-[480px] overflow-auto bg-[#0f1115] p-5 font-mono text-sm leading-relaxed">
            <code dangerouslySetInnerHTML={{ __html: highlight(formatted) }} />
          </pre>

          <div className="flex items-center justify-between gap-2 border-t border-white/5 bg-[#0a0c10] px-5 py-3">
            <span className="text-[11px] text-white/55">
              {formatted.split("\n").length} baris · {formatted.length} char
            </span>
            <div className="flex gap-2">
              <button
                onClick={download}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                <Download size={12} /> .json
              </button>
              <button
                onClick={copyJson}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-600"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy JSON"}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlight(json: string) {
  const escaped = escapeHtml(json);
  return escaped.replace(
    /("(\\.|[^"\\])*"\s*:)|("(\\.|[^"\\])*")|(\b(?:true|false|null)\b)|(-?\d+(?:\.\d+)?)/g,
    (match) => {
      let cls = "text-emerald-300"; // string value
      if (/:$/.test(match)) {
        cls = "text-[#FF8B33]"; // key
      } else if (/^"/.test(match)) {
        cls = "text-emerald-300"; // string
      } else if (/true|false/.test(match)) {
        cls = "text-sky-300";
      } else if (/null/.test(match)) {
        cls = "text-rose-300";
      } else {
        cls = "text-amber-300"; // number
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}
