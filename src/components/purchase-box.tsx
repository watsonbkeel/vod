"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };
type PaymentChannel = "wechat" | "alipay";

type OrderResponse = {
  orderId: string;
  merchantOrderNo: string;
  channel: PaymentChannel;
  amountCents: number;
  status: string;
  payment: { mode: string; codeUrl?: string | null; payInfo?: string | null };
};

export function PurchaseBox({ courseId, signedIn = false }: { courseId: string; signedIn?: boolean }) {
  const router = useRouter();
  const [channel, setChannel] = useState<PaymentChannel>("wechat");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function createOrder() {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, channel }),
      });
      const raw = await response.text();
      const result = raw ? (JSON.parse(raw) as ApiResult<OrderResponse>) : null;

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok || !result?.ok) {
        throw new Error(result?.ok === false ? result.error : "创建订单失败，请稍后再试");
      }

      router.push(`/orders/${result.data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建订单失败，请稍后再试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
        <button type="button" onClick={() => setChannel("wechat")} className={`rounded-xl px-4 py-2 text-sm font-medium ${channel === "wechat" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}>
          微信支付
        </button>
        <button type="button" onClick={() => setChannel("alipay")} className={`rounded-xl px-4 py-2 text-sm font-medium ${channel === "alipay" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}>
          支付宝
        </button>
      </div>
      <button type="button" onClick={createOrder} disabled={loading} className="block w-full rounded-full bg-orange-600 px-6 py-3 text-center font-semibold text-white hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "正在创建订单" : signedIn ? "立即购买" : "登录并购买"}
      </button>
      {error ? <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
