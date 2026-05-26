"use client";

import { useState } from "react";

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

type UploadTokenResponse = {
  assetId: string;
  bucket: string;
  region: string;
  objectKey: string;
  status: string;
  upload: { mode: string; expiresIn: number };
};

export function LessonMediaForm({ lessonId, action }: { lessonId: string; action: (formData: FormData) => void | Promise<void> }) {
  const [asset, setAsset] = useState<UploadTokenResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function completeUpload(assetId: string) {
    const response = await fetch("/api/cos/complete-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId }),
    });
    const result = (await response.json()) as ApiResult<{ assetId: string; status: string }>;

    if (!response.ok || !result.ok) {
      throw new Error(result.ok ? "确认上传失败" : result.error);
    }
  }

  async function createUpload(file: File) {
    setError("");
    setAsset(null);
    setLoading(true);

    try {
      const response = await fetch("/api/cos/upload-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, mimeType: file.type || "video/mp4", sizeBytes: file.size }),
      });
      const result = (await response.json()) as ApiResult<UploadTokenResponse>;

      if (!response.ok || !result.ok) {
        throw new Error(result.ok ? "创建上传任务失败" : result.error);
      }

      await completeUpload(result.data.assetId);
      setAsset({ ...result.data, status: "uploaded" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建上传任务失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-700">视频上传/绑定</p>
      <input type="file" accept="video/mp4" onChange={(event) => {
        const file = event.target.files?.[0];
        if (file) void createUpload(file);
      }} className="mt-3 w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white" />
      {loading ? <p className="mt-3 text-sm text-slate-500">正在创建并确认上传任务...</p> : null}
      {asset ? (
        <form action={action} className="mt-3 space-y-3">
          <input type="hidden" name="lessonId" value={lessonId} />
          <input type="hidden" name="mediaAssetId" value={asset.assetId} />
          <div className="rounded-xl bg-white p-3 text-xs leading-5 text-slate-500 ring-1 ring-slate-200">
            <p className="font-medium text-slate-700">{asset.upload.mode === "mock" ? "模拟上传已完成" : "COS 上传已确认"}</p>
            <p>Bucket：{asset.bucket}</p>
            <p>ObjectKey：{asset.objectKey}</p>
          </div>
          <button className="rounded-full bg-cyan-700 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-600">绑定到该课时</button>
        </form>
      ) : null}
      {error ? <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
