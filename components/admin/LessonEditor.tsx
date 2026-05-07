"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  Trash2,
  Youtube,
} from "lucide-react";
import { toEmbedUrl, type Lesson } from "@/lib/mockData";
import { ResourceEditor } from "./ResourceEditor";

export function LessonEditor({
  lesson,
  onChange,
  onRemove,
  index,
}: {
  lesson: Lesson;
  onChange: (next: Lesson) => void;
  onRemove: () => void;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const update = <K extends keyof Lesson>(key: K, value: Lesson[K]) =>
    onChange({ ...lesson, [key]: value });

  const embedUrl = useMemo(
    () => toEmbedUrl(lesson.videoUrl),
    [lesson.videoUrl]
  );

  return (
    <div className="rounded-xl border border-muted bg-white">
      {/* Compact header */}
      <div className="flex items-center gap-2 p-2.5">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="grid h-7 w-7 place-items-center rounded-md text-ink/50 transition hover:bg-muted hover:text-brand"
          aria-label={expanded ? "Tutup" : "Buka"}
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-brand-50 text-[11px] font-bold text-brand">
          {index + 1}
        </span>
        <input
          value={lesson.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Judul lesson"
          className="flex-1 rounded-md border border-muted bg-white px-2.5 py-1.5 text-sm focus:border-brand focus:ring-1 focus:ring-brand/30"
        />
        <div className="relative">
          <Clock
            size={12}
            className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-ink/40"
          />
          <input
            value={lesson.duration}
            onChange={(e) => update("duration", e.target.value)}
            placeholder="08:32"
            className="w-24 rounded-md border border-muted bg-white py-1.5 pl-6 pr-2 text-xs font-mono focus:border-brand focus:ring-1 focus:ring-brand/30"
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Hapus lesson"
          className="grid h-8 w-8 place-items-center rounded-md text-ink/50 transition hover:bg-rose-50 hover:text-rose-500"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {expanded && (
        <div className="space-y-4 border-t border-muted bg-muted/30 p-4">
          {/* Video URL */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink/55">
              Link Video (YouTube / Vimeo)
            </label>
            <div className="relative">
              <Youtube
                size={14}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-rose-500"
              />
              <input
                value={lesson.videoUrl}
                onChange={(e) => update("videoUrl", e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-md border border-muted bg-white py-1.5 pl-8 pr-2 font-mono text-xs focus:border-brand focus:ring-1 focus:ring-brand/30"
              />
            </div>
            {lesson.videoUrl && (
              <div className="mt-2 flex items-center gap-2 text-[11px]">
                <span className="text-ink/55">Embed:</span>
                <code className="truncate rounded bg-white px-2 py-0.5 font-mono text-ink/70">
                  {embedUrl}
                </code>
                <a
                  href={lesson.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-brand hover:underline"
                >
                  Buka <ExternalLink size={10} />
                </a>
              </div>
            )}

            {embedUrl && /youtube\.com\/embed\//.test(embedUrl) && (
              <div className="mt-3 aspect-video w-full max-w-md overflow-hidden rounded-lg bg-black">
                <iframe
                  src={embedUrl}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink/55">
              Deskripsi Lesson
            </label>
            <textarea
              value={lesson.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              placeholder="Apa yang akan dipelajari di sesi ini..."
              className="w-full rounded-md border border-muted bg-white px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand/30"
            />
          </div>

          {/* Resources */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink/55">
              Materi Pendukung
            </label>
            <ResourceEditor
              resources={lesson.resources}
              onChange={(r) => update("resources", r)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
