"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type OrderView = {
  orderId: string;
  merchantOrderNo: string;
  channel: "wechat" | "alipay";
  status: string;
  amountCents: number;
  paidAt: string | null;
  course: { id: string; title: string; slug: string };
};

export function OrderResult({ initialOrder }: { initialOrder: OrderView }) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function mockPay() {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/orders/${order.orderId}/mock-pay`, { method: "POST" });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.ok ? "模拟支付失败" : result.error);
      }

      setOrder((current) => ({ ...current, status: result.data.status, paidAt: result.data.paidAt }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "模拟支付失败");
    } finally {
      setLoading(false);
    }
  }

  const paid = order.status === "paid";

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-medium text-cyan-700">订单结果</p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-950">{paid ? "支付成功" : "待支付"}</h1>
      <dl className="mt-6 space-y-3 text-sm text-slate-600">
        <div className="flex justify-between gap-4">
          <dt>课程</dt>
          <dd className="text-right font-medium text-slate-950">{order.course.title}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>订单号</dt>
          <dd className="text-right font-medium text-slate-950">{order.merchantOrderNo}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>支付方式</dt>
          <dd className="font-medium text-slate-950">{order.channel === "wechat" ? "微信支付" : "支付宝"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>金额</dt>
          <dd className="font-medium text-slate-950">¥{(order.amountCents / 100).toFixed(2)}</dd>
        </div>
      </dl>
      {paid ? (
        <Link href="/my-courses" className="mt-8 block rounded-full bg-slate-950 px-6 py-3 text-center font-semibold text-white hover:bg-slate-800">
          去学习课程
        </Link>
      ) : (
        <button type="button" onClick={mockPay} disabled={loading} className="mt-8 block w-full rounded-full bg-orange-600 px-6 py-3 text-center font-semibold text-white hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "处理中" : "模拟支付成功"}
        </button>
      )}
      {error ? <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
