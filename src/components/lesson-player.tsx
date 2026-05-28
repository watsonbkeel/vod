"use client";

import { useEffect, useMemo, useState } from "react";

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

type LessonItem = {
  id: string;
  title: string;
  sortOrder: number;
  positionSec: number;
  completed: boolean;
};

type PlayUrlResponse = {
  playUrl: string;
  expiresIn: number;
};

export function LessonPlayer({ courseTitle, lessons }: { courseTitle: string; lessons: LessonItem[] }) {
  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0]?.id ?? "");
  const [playUrl, setPlayUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedLesson = useMemo(() => lessons.find((lesson) => lesson.id === selectedLessonId), [lessons, selectedLessonId]);
  const [progressByLesson, setProgressByLesson] = useState<Record<string, { positionSec: number; completed: boolean }>>(() => Object.fromEntries(lessons.map((lesson) => [lesson.id, { positionSec: lesson.positionSec, completed: lesson.completed }])));
  const currentProgress = progressByLesson[selectedLessonId] ?? { positionSec: 0, completed: false };

  useEffect(() => {
    if (!selectedLessonId) return;

    async function loadPlayUrl() {
      setError("");
      setPlayUrl("");
      setLoading(true);

      try {
        const response = await fetch("/api/lessons/play-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId: selectedLessonId }),
        });
        const result = (await response.json()) as ApiResult<PlayUrlResponse>;

        if (!response.ok || !result.ok) {
          throw new Error(result.ok ? "获取播放地址失败" : result.error);
        }

        setPlayUrl(result.data.playUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "获取播放地址失败");
      } finally {
        setLoading(false);
      }
    }

    void loadPlayUrl();
  }, [selectedLessonId]);

  async function saveProgress(nextPositionSec: number, nextCompleted = currentProgress.completed) {
    if (!selectedLessonId) return;

    setProgressByLesson((current) => ({
      ...current,
      [selectedLessonId]: { positionSec: nextPositionSec, completed: nextCompleted },
    }));

    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: selectedLessonId, positionSec: nextPositionSec, completed: nextCompleted }),
    });
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px]">
      <div className="overflow-hidden rounded-3xl bg-black shadow-2xl ring-1 ring-white/10">
        <div className="flex aspect-video items-center justify-center bg-slate-900 text-slate-400">
          {loading ? (
            "正在获取播放地址..."
          ) : playUrl ? (
            <video key={playUrl} src={playUrl} controls controlsList="nodownload" className="h-full w-full" onTimeUpdate={(event) => {
              const nextPosition = Math.floor(event.currentTarget.currentTime);
              if (nextPosition > 0 && nextPosition % 15 === 0 && nextPosition !== currentProgress.positionSec) void saveProgress(nextPosition);
            }} onEnded={(event) => void saveProgress(Math.floor(event.currentTarget.duration || currentProgress.positionSec), true)} />
          ) : selectedLesson ? (
            error || "正在准备播放..."
          ) : (
            error || "暂无可播放课时"
          )}
        </div>
        <div className="border-t border-white/10 p-6">
          <p className="text-sm text-cyan-300">{selectedLesson ? `第 ${selectedLesson.sortOrder} 课` : "暂无课时"}</p>
          <h1 className="mt-2 text-2xl font-semibold">{selectedLesson?.title ?? courseTitle}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">当前进度：{currentProgress.positionSec}s · {currentProgress.completed ? "已完成" : "学习中"}</p>
          {error ? <p className="mt-3 rounded-2xl bg-red-500/10 p-4 text-sm text-red-200">{error}</p> : null}
        </div>
      </div>
      <aside className="rounded-3xl bg-white p-5 text-slate-950 shadow-xl">
        <h2 className="text-lg font-semibold">课时目录</h2>
        <div className="mt-4 space-y-2">
          {lessons.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">暂无可播放课时</p>
          ) : (
            lessons.map((lesson, index) => {
              const progress = progressByLesson[lesson.id] ?? { positionSec: lesson.positionSec, completed: lesson.completed };
              return (
                <button key={lesson.id} onClick={() => setSelectedLessonId(lesson.id)} className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left text-sm ${lesson.id === selectedLessonId ? "bg-slate-950 text-white" : "hover:bg-slate-50"}`}>
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full font-medium ${lesson.id === selectedLessonId ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600"}`}>{index + 1}</span>
                  <span>{lesson.title}</span>
                  <span className={`ml-auto text-xs ${lesson.id === selectedLessonId ? "text-slate-300" : "text-slate-400"}`}>
                    {progress.completed ? "已完成" : progress.positionSec > 0 ? `已学 ${progress.positionSec}s` : "未学习"}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </aside>
    </section>
  );
}
