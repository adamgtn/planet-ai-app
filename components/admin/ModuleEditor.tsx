"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";
import type { Lesson, Module } from "@/lib/mockData";
import { LessonEditor } from "./LessonEditor";

const newLesson = (): Lesson => ({
  id: `l_${Math.random().toString(36).slice(2, 8)}`,
  title: "",
  duration: "",
  videoUrl: "",
  description: "",
  resources: [],
});

export function ModuleEditor({
  module,
  index,
  onChange,
  onRemove,
}: {
  module: Module;
  index: number;
  onChange: (next: Module) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  const update = <K extends keyof Module>(key: K, value: Module[K]) =>
    onChange({ ...module, [key]: value });

  const addLesson = () =>
    update("lessons", [...module.lessons, newLesson()]);

  const updateLesson = (i: number, lesson: Lesson) =>
    update(
      "lessons",
      module.lessons.map((l, idx) => (idx === i ? lesson : l))
    );

  const removeLesson = (i: number) =>
    update("lessons", module.lessons.filter((_, idx) => idx !== i));

  return (
    <div className="rounded-2xl border border-muted bg-muted/40">
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="grid h-7 w-7 place-items-center rounded-md text-ink/55 transition hover:bg-white hover:text-brand"
          aria-label={expanded ? "Tutup modul" : "Buka modul"}
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand text-xs font-bold text-white">
          M{index + 1}
        </span>
        <input
          value={module.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Judul modul (Modul 1 — Fondasi Prompt)"
          className="flex-1 rounded-md border border-muted bg-white px-3 py-2 text-sm font-semibold focus:border-brand focus:ring-1 focus:ring-brand/30"
        />
        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-ink/65">
          {module.lessons.length} lesson
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Hapus modul"
          className="grid h-9 w-9 place-items-center rounded-md text-ink/50 transition hover:bg-rose-50 hover:text-rose-500"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {expanded && (
        <div className="space-y-2 border-t border-muted bg-white px-3 pb-3 pt-3">
          {module.lessons.length === 0 && (
            <p className="rounded-lg border border-dashed border-muted bg-muted/30 p-4 text-center text-xs text-ink/55">
              Belum ada lesson. Tambahkan lesson pertama untuk modul ini.
            </p>
          )}

          {module.lessons.map((lesson, i) => (
            <LessonEditor
              key={lesson.id}
              lesson={lesson}
              index={i}
              onChange={(l) => updateLesson(i, l)}
              onRemove={() => removeLesson(i)}
            />
          ))}

          <button
            type="button"
            onClick={addLesson}
            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-muted px-3 py-2 text-xs font-semibold text-ink/65 transition hover:border-brand hover:text-brand"
          >
            <Plus size={12} /> Tambah Lesson
          </button>
        </div>
      )}
    </div>
  );
}
