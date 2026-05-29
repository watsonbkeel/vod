"use client";

import Link from "next/link";
import QRCode from "qrcode";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatMoney } from "@/lib/money";
import { formatTemplate } from "@/lib/site-content";
import type { SiteConfig } from "@/lib/site-settings";

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

type OrderView = {
  orderId: string;
  merchantOrderNo: string;
  channel: "alipay";
  status: string;
  amountCents: number;
  paidAt: string | null;
  closedAt: string | null;
  createdAt: string;
  expiresAt: string;
  paymentCodeUrl: string | null;
  paymentPayInfo: string | null;
  course: { id: string; title: string; slug: string };
};

type PaymentQrResponse = {
  status: string;
  closedAt: string | null;
  expiresAt: string;
  qrContent: string | null;
  fallbackUrl: string | null;
};

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function OrderResult({ initialOrder, settings }: { initialOrder: OrderView; settings: SiteConfig["global"] }) {
  const [order, setOrder] = useState(initialOrder);
  const [error, setError] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [fallbackUrl, setFallbackUrl] = useState("");
  const [checking, setChecking] = useState(false);
  const [remainingMs, setRemainingMs] = useState(() => new Date(initialOrder.expiresAt).getTime() - Date.now());
  const paid = order.status === "paid";
  const closed = order.status === "closed";
  const paymentLabel = settings.purchasePaymentLabel;
  const expiresAtMs = useMemo(() => new Date(order.expiresAt).getTime(), [order.expiresAt]);

  useEffect(() => {
    if (paid) {
      window.location.assign("/my-courses");
    }
  }, [paid]);

  const checkOrderStatus = useCallback(async () => {
    setChecking(true);

    try {
      const response = await fetch(`/api/orders/${order.orderId}`);
      const result = (await response.json()) as ApiResult<OrderView>;

      if (!response.ok || !result.ok) {
        throw new Error(result?.ok === false ? result.error : settings.orderStatusCheckError);
      }

      setOrder(result.data);

    } catch (err) {
      setError(err instanceof Error ? err.message : settings.orderStatusCheckError);
    } finally {
      setChecking(false);
    }
  }, [order.orderId, settings.orderStatusCheckError]);

  useEffect(() => {
    let active = true;

    async function loadQrCode() {
      if (order.status !== "pending") {
        setQrCode("");
        setFallbackUrl("");
        return;
      }

      try {
        const response = await fetch(`/api/orders/${order.orderId}/payment-qr`);
        const result = (await response.json()) as ApiResult<PaymentQrResponse>;

        if (!response.ok || !result.ok) {
          throw new Error(result?.ok === false ? result.error : settings.orderQrLoadError);
        }

        if (!active) return;

        setOrder((current) => ({ ...current, status: result.data.status, closedAt: result.data.closedAt, expiresAt: result.data.expiresAt }));
        setFallbackUrl(result.data.fallbackUrl ?? "");

        if (result.data.qrContent) {
          const dataUrl = await QRCode.toDataURL(result.data.qrContent, { margin: 2, width: 248 });
          if (active) setQrCode(dataUrl);
        } else {
          setQrCode("");
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : settings.orderQrLoadError);
      }
    }

    loadQrCode();

    return () => {
      active = false;
    };
  }, [order.orderId, order.status, settings.orderQrLoadError]);

  useEffect(() => {
    if (order.status !== "pending") return;

    const timer = window.setInterval(() => {
      const nextRemainingMs = expiresAtMs - Date.now();
      setRemainingMs(nextRemainingMs);

      if (nextRemainingMs <= 0) {
        setOrder((current) => ({ ...current, status: "closed", closedAt: current.closedAt ?? new Date().toISOString() }));
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [expiresAtMs, order.status]);

  useEffect(() => {
    if (order.status !== "pending") return;

    const timer = window.setInterval(() => {
      checkOrderStatus();
    }, 2500);

    return () => window.clearInterval(timer);
  }, [order.status, checkOrderStatus]);

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-medium text-cyan-700">{settings.orderPageEyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-950">{paid ? settings.orderPaidTitle : closed ? settings.orderClosedTitle : settings.orderPendingTitle}</h1>
      <dl className="mt-6 space-y-3 text-sm text-slate-600">
        <div className="flex justify-between gap-4">
          <dt>{settings.orderCourseLabel}</dt>
          <dd className="text-right font-medium text-slate-950">{order.course.title}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>{settings.orderNoLabel}</dt>
          <dd className="text-right font-medium text-slate-950">{order.merchantOrderNo}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>{settings.orderPaymentMethodLabel}</dt>
          <dd className="font-medium text-slate-950">{paymentLabel}{settings.orderPaymentSuffix}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>{settings.orderAmountLabel}</dt>
          <dd className="font-medium text-slate-950">{formatMoney(order.amountCents, settings.currencyPrefix)}</dd>
        </div>
      </dl>
      {paid ? (
        <div className="mt-8 rounded-2xl bg-emerald-50 p-5 text-center text-sm text-emerald-700">
          {settings.orderPaidRedirectText}
        </div>
      ) : closed ? (
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-600">{settings.orderClosedHelpText}</div>
          <Link href={`/courses/${order.course.slug}`} className="block rounded-full bg-slate-950 px-6 py-3 text-center font-semibold text-white hover:bg-slate-800">
            {settings.orderRepurchaseLabel}
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          <div className="rounded-3xl bg-slate-50 p-6 text-center text-sm text-slate-600">
            <p className="font-medium text-slate-950">{formatTemplate(settings.orderScanText, { paymentLabel })}</p>
            <div className="mx-auto mt-5 flex h-72 w-72 items-center justify-center rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              {qrCode ? <picture><img src={qrCode} alt={settings.orderQrAlt} className="h-62 w-62" /></picture> : <span className="text-slate-400">{settings.orderQrLoadingText}</span>}
            </div>
            <p className="mt-4 text-xs text-slate-500">{settings.orderRemainingPrefix} {formatRemaining(remainingMs)}</p>
            <button type="button" onClick={checkOrderStatus} disabled={checking} className="mt-4 rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
              {checking ? settings.orderCheckingLabel : settings.orderCheckLabel}
            </button>
            {fallbackUrl ? (
              <a href={fallbackUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-slate-400 underline underline-offset-2">
                {settings.orderFallbackLinkLabel}
              </a>
            ) : null}
          </div>
          <div className="rounded-2xl bg-white p-4 text-xs leading-5 text-slate-500 ring-1 ring-slate-200">
            {formatTemplate(settings.orderHelpText, { supportEmail: settings.supportEmail })}
          </div>
        </div>
      )}
      {error ? <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
