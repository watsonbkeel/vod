"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

type UploadTokenResponse = {
  assetId: string;
  bucket: string;
  region: string;
  objectKey: string;
  status: string;
  upload: { mode: string; method: string | null; url: string | null; headers: Record<string, string> | null; expiresIn: number };
};

type BindMediaResponse = {
  lessonId: string;
  mediaAssetId: string;
  filename: string;
};

type UploadPhase = "creating" | "uploading" | "confirming" | "binding" | "";

const phaseLabels: Record<Exclude<UploadPhase, "">, string> = {
  creating: "正在创建上传任务...",
  uploading: "正在上传到 COS...",
  confirming: "正在确认 COS 视频对象...",
  binding: "正在绑定到课时...",
};

export function LessonMediaForm({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const router = useRouter();
  const [asset, setAsset] = useState<UploadTokenResponse | null>(null);
  const [error, setError] = useState("");
  const [bound, setBound] = useState(false);
  const [phase, setPhase] = useState<UploadPhase>("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loading = phase !== "";

  async function bindAsset(assetId: string) {
    if (!assetId) {
      throw new Error("请选择要绑定的视频");
    }

    setPhase("binding");
    const response = await fetch(`/api/admin/lessons/${lessonId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, mediaAssetId: assetId }),
    });
    const result = (await response.json()) as ApiResult<BindMediaResponse>;

    if (!response.ok || !result.ok) {
      throw new Error(result.ok ? "绑定视频失败" : result.error);
    }

    setBound(true);
    router.refresh();
  }

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

  function uploadToCos(upload: UploadTokenResponse["upload"], file: File) {
    return new Promise<void>((resolve, reject) => {
      if (!upload.url || upload.method !== "PUT") {
        reject(new Error("COS 上传地址无效"));
        return;
      }

      const request = new XMLHttpRequest();
      request.open("PUT", upload.url);

      for (const [key, value] of Object.entries(upload.headers ?? { "Content-Type": file.type || "video/mp4" })) {
        request.setRequestHeader(key, value);
      }

      request.upload.onprogress = (event) => {
        if (event.lengthComputable && event.total > 0) {
          setUploadProgress(Math.max(1, Math.min(99, Math.round((event.loaded / event.total) * 100))));
        }
      };
      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          setUploadProgress(100);
          resolve();
        } else {
          reject(new Error(`上传到 COS 失败（${request.status}）`));
        }
      };
      request.onerror = () => reject(new Error("上传到 COS 失败，请检查网络或 COS 跨域配置"));
      request.onabort = () => reject(new Error("上传已取消"));
      request.send(file);
    });
  }

  async function createUpload(file: File) {
    setError("");
    setAsset(null);
    setBound(false);
    setPhase("creating");
    setUploadProgress(0);

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

      if (result.data.upload.mode === "cos") {
        setPhase("uploading");
        await uploadToCos(result.data.upload, file);
      }

      setPhase("confirming");
      await completeUpload(result.data.assetId);
      setAsset({ ...result.data, status: "uploaded" });
      await bindAsset(result.data.assetId);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建上传任务失败");
    } finally {
      setPhase("");
      setUploadProgress(null);
    }
  }

  async function bindUploadedAsset(formData: FormData) {
    setError("");

    try {
      await bindAsset(String(formData.get("mediaAssetId") ?? ""));
    } catch (err) {
      setError(err instanceof Error ? err.message : "绑定视频失败");
    } finally {
      setPhase("");
    }
  }

  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-700">视频上传/绑定</p>
      <input ref={fileInputRef} type="file" accept="video/mp4" onChange={(event) => {
        const file = event.target.files?.[0];
        if (file) void createUpload(file);
      }} disabled={loading} className="mt-3 w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white disabled:cursor-not-allowed disabled:opacity-60" />
      {phase ? (
        <div className="mt-3 rounded-2xl bg-white p-3 text-sm text-slate-600 ring-1 ring-slate-200" role="status" aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <span>{phaseLabels[phase]}</span>
            {uploadProgress !== null ? <span className="font-medium text-slate-900">{uploadProgress}%</span> : null}
          </div>
          {uploadProgress !== null ? (
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-cyan-600 transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
          ) : null}
          <p className="mt-2 text-xs text-slate-400">请保持页面打开，上传完成后会自动确认并绑定到当前课时。</p>
        </div>
      ) : null}
      {asset ? (
        <form action={bindUploadedAsset} className="mt-3 space-y-3">
          <input type="hidden" name="lessonId" value={lessonId} />
          <input type="hidden" name="mediaAssetId" value={asset.assetId} />
          <div className="rounded-xl bg-white p-3 text-xs leading-5 text-slate-500 ring-1 ring-slate-200">
            <p className="font-medium text-slate-700">{bound ? "视频已绑定到该课时" : asset.upload.mode === "mock" ? "模拟上传已完成" : "COS 上传已确认"}</p>
            <p>Bucket：{asset.bucket}</p>
            <p>ObjectKey：{asset.objectKey}</p>
          </div>
          <button disabled={bound || loading} className="rounded-full bg-cyan-700 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60">
            {bound ? "已绑定" : phase === "binding" ? "绑定中" : "绑定到该课时"}
          </button>
        </form>
      ) : null}
      {error ? <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
