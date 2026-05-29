"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteConfig } from "@/lib/site-settings";

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

type OrderResponse = {
  orderId: string;
  merchantOrderNo: string;
  channel: "alipay";
  amountCents: number;
  status: string;
  payment: { mode: string; codeUrl?: string | null; payInfo?: string | null };
};

export function PurchaseBox({ courseId, signedIn = false, settings }: { courseId: string; signedIn?: boolean; settings: SiteConfig["global"] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function createOrder() {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, channel: "alipay" }),
      });
      const raw = await response.text();
      const result = raw ? (JSON.parse(raw) as ApiResult<OrderResponse>) : null;

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok || !result?.ok) {
        throw new Error(result?.ok === false ? result.error : settings.createOrderError);
      }

      router.push(`/orders/${result.data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : settings.createOrderError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-2xl bg-slate-100 p-1">
        <div className="rounded-xl bg-white px-4 py-2 text-center text-sm font-medium text-slate-950 shadow-sm">
          {settings.purchasePaymentLabel}
        </div>
      </div>
      <button type="button" onClick={createOrder} disabled={loading} className="block w-full rounded-full bg-orange-600 px-6 py-3 text-center font-semibold text-white hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? settings.purchaseLoadingLabel : signedIn ? settings.purchaseSignedInLabel : settings.purchaseSignedOutLabel}
      </button>
      <p className="text-xs leading-5 text-slate-500">
        {settings.purchaseHint}
      </p>
      {error ? <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
