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

export function LoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  async function sendCode() {
    setError("");
    setMessage("");
    setSending(true);

    try {
      await postJson<{ expiresIn: number }>("/api/auth/sms/send", { phone });
      setMessage("验证码已发送；本地开发模式会输出到服务端日志。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "验证码发送失败");
    } finally {
      setSending(false);
    }
  }

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoggingIn(true);

    try {
      await postJson<{ userId: string }>("/api/auth/sms/verify", { phone, code });
      router.push("/my-courses");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setLoggingIn(false);
    }
  }

  return (
    <form onSubmit={login} className="mt-8 space-y-4">
      <label className="block text-sm font-medium text-slate-700">
        手机号
        <input value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600" placeholder="请输入手机号" inputMode="tel" autoComplete="tel" />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        验证码
        <div className="mt-2 flex gap-2">
          <input value={code} onChange={(event) => setCode(event.target.value)} className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600" placeholder="短信验证码" inputMode="numeric" autoComplete="one-time-code" />
          <button type="button" onClick={sendCode} disabled={sending || !phone} className="rounded-2xl border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:border-slate-950 disabled:cursor-not-allowed disabled:opacity-50">
            {sending ? "发送中" : "获取验证码"}
          </button>
        </div>
      </label>
      {message ? <p className="rounded-2xl bg-cyan-50 px-4 py-3 text-sm text-cyan-700">{message}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}
      <button disabled={loggingIn || !phone || !code} className="w-full rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
        {loggingIn ? "登录中" : "登录"}
      </button>
    </form>
  );
}
