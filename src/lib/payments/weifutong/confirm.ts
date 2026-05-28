type ExpectedWeifutongPayment = {
  merchantOrderNo: string;
  amountCents: number;
  merchantId?: string;
  currency?: string;
};

type WeifutongPaymentConfirmation =
  | {
      ok: true;
      transactionId: string;
      paidAt: Date;
    }
  | {
      ok: false;
      error: string;
    };

function firstValue(payload: Record<string, string>, keys: string[]) {
  for (const key of keys) {
    const value = payload[key]?.trim();
    if (value) return value;
  }

  return "";
}

function parsePaidAt(payload: Record<string, string>) {
  const value = firstValue(payload, ["time_end", "pay_time", "payTime"]);
  if (!value) return new Date();

  const normalized = value.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1-$2-$3T$4:$5:$6+08:00");
  const date = new Date(normalized);

  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export function confirmWeifutongPaidPayload(payload: Record<string, string>, expected: ExpectedWeifutongPayment): WeifutongPaymentConfirmation {
  const status = firstValue(payload, ["status"]);
  const resultCode = firstValue(payload, ["result_code", "resultCode"]);

  if (status && status !== "0") {
    return { ok: false, error: "威富通网关状态不是成功" };
  }

  if (resultCode && resultCode !== "0") {
    return { ok: false, error: "威富通业务结果不是成功" };
  }

  const merchantOrderNo = firstValue(payload, ["out_trade_no", "outTradeNo", "merchantOrderNo"]);
  if (!merchantOrderNo) {
    return { ok: false, error: "威富通结果缺少商户订单号" };
  }

  if (merchantOrderNo !== expected.merchantOrderNo) {
    return { ok: false, error: "威富通商户订单号不匹配" };
  }

  if (expected.merchantId) {
    const merchantId = firstValue(payload, ["mch_id", "mchId"]);
    if (!merchantId) {
      return { ok: false, error: "威富通结果缺少商户号" };
    }

    if (merchantId !== expected.merchantId) {
      return { ok: false, error: "威富通商户号不匹配" };
    }
  }

  const totalFee = firstValue(payload, ["total_fee", "totalFee"]);
  if (!totalFee) {
    return { ok: false, error: "威富通结果缺少支付金额" };
  }

  if (!/^\d+$/.test(totalFee) || Number(totalFee) !== expected.amountCents) {
    return { ok: false, error: "威富通支付金额不匹配" };
  }

  const feeType = firstValue(payload, ["fee_type", "feeType"]);
  if (expected.currency && feeType && feeType !== expected.currency) {
    return { ok: false, error: "威富通支付币种不匹配" };
  }

  const tradeState = firstValue(payload, ["trade_state", "tradeState"]);
  const payResult = firstValue(payload, ["pay_result", "payResult"]);

  if (tradeState && tradeState !== "SUCCESS") {
    return { ok: false, error: "威富通交易状态不是成功" };
  }

  if (payResult && payResult !== "0") {
    return { ok: false, error: "威富通支付结果不是成功" };
  }

  if (!tradeState && !payResult) {
    return { ok: false, error: "威富通结果缺少支付成功状态" };
  }

  const transactionId = firstValue(payload, ["transaction_id", "out_transaction_id", "trade_no", "thirdPartyOrderNo"]);
  if (!transactionId) {
    return { ok: false, error: "威富通结果缺少第三方流水号" };
  }

  return {
    ok: true,
    transactionId,
    paidAt: parsePaidAt(payload),
  };
}
