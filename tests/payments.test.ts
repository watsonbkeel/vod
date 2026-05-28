import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canUseMockPayments } from "@/lib/payments/mock";
import { confirmWeifutongPaidPayload } from "@/lib/payments/weifutong/confirm";

const basePaidPayload = {
  status: "0",
  result_code: "0",
  pay_result: "0",
  mch_id: "merchant-1",
  out_trade_no: "VOD123",
  transaction_id: "TX123",
  total_fee: "199900",
  fee_type: "HKD",
  time_end: "20260528120000",
};

describe("mock payments", () => {
  it("are disabled in production", () => {
    assert.equal(canUseMockPayments("production"), false);
  });

  it("remain available outside production for local verification", () => {
    assert.equal(canUseMockPayments("development"), true);
    assert.equal(canUseMockPayments("test"), true);
  });
});

describe("Weifutong payment confirmation", () => {
  it("accepts a fully matching paid payload", () => {
    const confirmation = confirmWeifutongPaidPayload(basePaidPayload, {
      merchantOrderNo: "VOD123",
      amountCents: 199900,
      merchantId: "merchant-1",
      currency: "HKD",
    });

    assert.equal(confirmation.ok, true);
    if (confirmation.ok) {
      assert.equal(confirmation.transactionId, "TX123");
      assert.equal(confirmation.paidAt.toISOString(), "2026-05-28T04:00:00.000Z");
    }
  });

  it("rejects an amount mismatch", () => {
    const confirmation = confirmWeifutongPaidPayload(basePaidPayload, {
      merchantOrderNo: "VOD123",
      amountCents: 1,
      merchantId: "merchant-1",
      currency: "HKD",
    });

    assert.deepEqual(confirmation, { ok: false, error: "威富通支付金额不匹配" });
  });

  it("rejects an order number mismatch", () => {
    const confirmation = confirmWeifutongPaidPayload(basePaidPayload, {
      merchantOrderNo: "VOD999",
      amountCents: 199900,
      merchantId: "merchant-1",
      currency: "HKD",
    });

    assert.deepEqual(confirmation, { ok: false, error: "威富通商户订单号不匹配" });
  });

  it("rejects a payload without an explicit paid state", () => {
    const payload: Record<string, string> = { ...basePaidPayload };
    delete payload.pay_result;
    delete payload.trade_state;
    const confirmation = confirmWeifutongPaidPayload(payload, {
      merchantOrderNo: "VOD123",
      amountCents: 199900,
      merchantId: "merchant-1",
      currency: "HKD",
    });

    assert.deepEqual(confirmation, { ok: false, error: "威富通结果缺少支付成功状态" });
  });
});
