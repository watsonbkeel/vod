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
  payment: { mode: string };
};

export function PurchaseBox({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [channel, setChannel] = useState<PaymentChannel>("wechat");
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function createOrder() {
    setError("");
    setOrder(null);
    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, channel }),
      });
      const result = (await response.json()) as ApiResult<OrderResponse>;

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok || !result.ok) {
        throw new Error(result.ok ? "创建订单失败，请稍后再试" : result.error);
      }

      setOrder(result.data);
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
        {loading ? "正在创建订单" : "登录并购买"}
      </button>
      {order ? (
        <div className="rounded-2xl bg-orange-50 p-4 text-sm leading-6 text-orange-800">
          <p className="font-semibold">订单已创建：{order.merchantOrderNo}</p>
          <p>当前为 {order.payment.mode === "mock" ? "模拟支付" : "威富通支付"} 模式，后续会跳转到对应支付参数。</p>
        </div>
      ) : null}
      {error ? <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
