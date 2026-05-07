"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  PlayCircle,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { AuthGate } from "@/components/AuthGate";
import { toEmbedUrl } from "@/lib/mockData";
import { useProduct, useProductCurriculum } from "@/lib/dataStore";

export default function LearnPage() {
  return (
    <AuthGate>
      <LearnContent />
    </AuthGate>
  );
}

function LearnContent() {
  const params = useParams<{ productId: string }>();
  const product = useProduct(params.productId);
  const { modules, loading } = useProductCurriculum(params.productId);

  if (!product) {
    if (!loading) notFound();
    return (
      <div className="grid min-h-screen place-items-center bg-muted/40">
        <p className="text-sm text-ink/60">Memuat kelas...</p>
      </div>
    );
  }

  if (product.status !== "purchased") {
    notFound();
  }

  const allLessons = useMemo(
    () =>
      modules.flatMap((m) =>
        m.lessons.map((l) => ({ moduleId: m.id, ...l }))
      ),
    [modules]
  );

  const [activeLessonId, setActiveLessonId] = useState<string | undefined>();
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  // Set lesson pertama sebagai active begitu kurikulum termuat
  useEffect(() => {
    if (!activeLessonId && allLessons.length > 0) {
      setActiveLessonId(allLessons[0].id);
    }
  }, [activeLessonId, allLessons]);

  const activeLesson = allLessons.find((l) => l.id === activeLessonId);
  const totalLessons = allLessons.length;
  const completedCount = completed.size;
  const progressPct =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const toggleComplete = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <TopBar />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[320px_1fr]">
        {/* Sidebar Curriculum */}
        <aside className="card-base h-fit overflow-hidden lg:sticky lg:top-24">
          <div className="border-b border-muted p-5">
            <Link
              href="/dashboard"
              className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-ink/60 hover:text-brand"
            >
              <ArrowLeft size={14} /> Kembali ke Dashboard
            </Link>
            <h2 className="text-lg font-bold leading-tight text-ink">
              {product.title}
            </h2>
            <p className="mt-1 text-xs text-ink/60">
              {totalLessons} pelajaran · {product.duration}
            </p>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink/70">
                <span>Progress kelas</span>
                <span>{progressPct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-brand transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          <nav className="max-h-[60vh] overflow-y-auto p-3">
            {modules.map((mod) => (
              <div key={mod.id} className="mb-3">
                <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-ink/50">
                  {mod.title}
                </p>
                <ul className="space-y-1">
                  {mod.lessons.map((lesson) => {
                    const isActive = activeLessonId === lesson.id;
                    const isDone = completed.has(lesson.id);
                    return (
                      <li key={lesson.id}>
                        <button
                          onClick={() => setActiveLessonId(lesson.id)}
                          className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                            isActive
                              ? "bg-brand-50 text-ink"
                              : "hover:bg-muted/70 text-ink/80"
                          }`}
                        >
                          <span
                            className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                              isDone
                                ? "bg-brand text-white"
                                : isActive
                                ? "bg-white text-brand ring-2 ring-brand"
                                : "bg-muted text-ink/50"
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 size={14} />
                            ) : (
                              <PlayCircle size={14} />
                            )}
                          </span>
                          <span className="flex-1">
                            <span className="block text-sm font-medium leading-snug">
                              {lesson.title}
                            </span>
                            <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-ink/50">
                              <Clock size={11} /> {lesson.duration}
                            </span>
                          </span>
                          {isActive && (
                            <ChevronRight
                              size={16}
                              className="mt-1 text-brand"
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Player */}
        <main className="space-y-6">
          {!activeLesson ? (
            <div className="card-base p-12 text-center">
              <p className="text-sm text-ink/60">
                {loading
                  ? "Memuat kurikulum..."
                  : "Kelas ini belum memiliki lesson. Hubungi admin untuk informasi."}
              </p>
            </div>
          ) : (
          <>
          <div className="card-base overflow-hidden">
            <div className="aspect-video w-full bg-black">
              {activeLesson.videoUrl ? (
                <iframe
                  key={activeLesson.id}
                  src={toEmbedUrl(activeLesson.videoUrl)}
                  title={activeLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              ) : (
                <div className="grid h-full place-items-center text-sm text-white/60">
                  Belum ada video untuk lesson ini.
                </div>
              )}
            </div>
            <div className="space-y-4 p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                    Sedang menonton
                  </p>
                  <h1 className="mt-1 text-2xl font-bold text-ink">
                    {activeLesson.title}
                  </h1>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink/60">
                    <Clock size={14} /> {activeLesson.duration}
                  </p>
                </div>
                <button
                  onClick={() => toggleComplete(activeLesson.id)}
                  className={`btn-primary whitespace-nowrap ${
                    completed.has(activeLesson.id)
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : ""
                  }`}
                >
                  <CheckCircle2 size={16} />
                  {completed.has(activeLesson.id)
                    ? "Selesai ditandai"
                    : "Tandai Selesai"}
                </button>
              </div>

              <p className="text-sm leading-relaxed text-ink/75">
                {activeLesson.description}
              </p>
            </div>
          </div>

          {/* Resources */}
          <div className="card-base p-6">
            <h3 className="text-base font-bold text-ink">Materi Pendukung</h3>
            <p className="mt-1 text-xs text-ink/60">
              Unduh aset digital untuk pelajaran ini.
            </p>
            <div className="mt-4 space-y-2">
              {activeLesson.resources.length === 0 && (
                <p className="rounded-xl border border-dashed border-muted px-4 py-6 text-center text-sm text-ink/50">
                  Belum ada materi unduh untuk pelajaran ini.
                </p>
              )}
              {activeLesson.resources.map((res) => (
                <div
                  key={res.name}
                  className="flex items-center justify-between rounded-xl border border-muted bg-white p-3 transition hover:border-brand"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {res.name}
                      </p>
                      <p className="text-xs text-ink/55">
                        {res.type}
                        {res.size ? ` · ${res.size}` : ""}
                      </p>
                    </div>
                  </div>
                  {res.url ? (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-muted px-3 py-2 text-xs font-semibold text-ink transition hover:border-brand hover:text-brand"
                    >
                      <Download size={14} /> Unduh
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center gap-2 rounded-lg border border-muted px-3 py-2 text-xs font-semibold text-ink/40"
                    >
                      <Download size={14} /> Unduh
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          </>
          )}
        </main>
      </div>
    </div>
  );
}
