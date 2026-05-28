"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function postJson<T>(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = (await response.json()) as ApiResult<T>;

  if (!response.ok || !result.ok) {
    throw new Error(result.ok ? "请求失败，请稍后再试" : result.error);
  }

  return result.data;
}

export function LoginForm({ initialError = "" }: { initialError?: string }) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(initialError);
  const [loggingIn, setLoggingIn] = useState(false);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoggingIn(true);

    try {
      const result = await postJson<{ userId: string; mode: "login" | "register" }>("/api/auth/password", { phone, password });
      setMessage(result.mode === "register" ? "账号已创建，正在进入课程中心。" : "登录成功，正在进入课程中心。");
      router.push("/my-courses");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setLoggingIn(false);
    }
  }

  return (
    <form onSubmit={login} action="/api/auth/password" method="post" className="mt-8 space-y-4">
      <label className="block text-sm font-medium text-slate-700">
        手机号
        <input name="phone" value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600" placeholder="请输入手机号" inputMode="tel" autoComplete="tel" required />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        密码
        <input name="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600" placeholder="至少 6 位密码" type="password" autoComplete="current-password" minLength={6} required />
      </label>
      {message ? <p className="rounded-2xl bg-cyan-50 px-4 py-3 text-sm text-cyan-700">{message}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}
      <button disabled={loggingIn} className="w-full rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
        {loggingIn ? "处理中" : "登录 / 注册"}
      </button>
    </form>
  );
}
