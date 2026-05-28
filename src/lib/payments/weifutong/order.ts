import { parseWeifutongXml, postWeifutongXml } from "./xml";

type WeifutongChannel = "wechat" | "alipay";

type WeifutongOrderInput = {
  channel: WeifutongChannel;
  merchantOrderNo: string;
  body: string;
  amountCents: number;
  notifyUrl: string;
  callbackUrl: string;
  clientIp: string;
};

export type WeifutongOrderPayment = {
  mode: "weifutong";
  gatewayUrl: string;
  payload: Record<string, string>;
  codeUrl: string | null;
  payInfo: string | null;
  raw: Record<string, string>;
};

function getWeifutongService(channel: WeifutongChannel) {
  const defaultService = channel === "wechat" ? "pay.weixin.native" : "pay.alipay.native.intl";
  const envValue = channel === "wechat" ? process.env.WEIFUTONG_WECHAT_SERVICE : process.env.WEIFUTONG_ALIPAY_SERVICE;

  return envValue || defaultService;
}

function getWeifutongPaymentInst(channel: WeifutongChannel) {
  if (channel !== "alipay" || process.env.WEIFUTONG_CURRENCY !== "HKD") {
    return "";
  }

  return process.env.WEIFUTONG_ALIPAY_PAYMENT_INST || "ALIPAYCN";
}

export function canUseWeifutong() {
  return Boolean(process.env.WEIFUTONG_GATEWAY_URL && process.env.WEIFUTONG_MCH_ID && process.env.WEIFUTONG_KEY);
}

export async function createWeifutongOrder(input: WeifutongOrderInput): Promise<WeifutongOrderPayment> {
  const gatewayUrl = process.env.WEIFUTONG_GATEWAY_URL;
  const merchantId = process.env.WEIFUTONG_MCH_ID;

  if (!gatewayUrl || !merchantId) {
    throw new Error("威富通商户配置不完整");
  }

  const payload: Record<string, string> = {
    service: getWeifutongService(input.channel),
    version: "2.0",
    charset: "UTF-8",
    sign_type: "MD5",
    mch_id: merchantId,
    out_trade_no: input.merchantOrderNo,
    device_info: "WEB",
    body: input.body,
    total_fee: String(input.amountCents),
    mch_create_ip: input.clientIp,
    notify_url: input.notifyUrl,
    callback_url: input.callbackUrl,
    nonce_str: crypto.randomUUID().replaceAll("-", ""),
  };
  const paymentInst = getWeifutongPaymentInst(input.channel);

  if (paymentInst) {
    payload.payment_inst = paymentInst;
  }

  const text = await postWeifutongXml(payload);
  const raw = parseWeifutongXml(text, ["status", "message", "result_code", "err_code", "err_msg", "code_url", "pay_info", "pay_url", "nonce_str", "sign"]);

  if (raw.status !== "0" || raw.result_code !== "0") {
    throw new Error(raw.err_msg || raw.message || "威富通下单失败");
  }

  return {
    mode: "weifutong",
    gatewayUrl,
    payload,
    codeUrl: raw.code_url || raw.pay_url || null,
    payInfo: raw.pay_info || null,
    raw,
  };
}
