import { parseWeifutongXmlFields, postWeifutongXml } from "./xml";
import { verifyWeifutongSignature } from "./sign";

export type WeifutongTradeQuery = {
  status: string;
  resultCode: string;
  tradeState: string;
  transactionId: string | null;
  signatureValid: boolean;
  raw: Record<string, string>;
};

export async function queryWeifutongOrder(merchantOrderNo: string): Promise<WeifutongTradeQuery> {
  const merchantId = process.env.WEIFUTONG_MCH_ID;

  if (!merchantId) {
    throw new Error("威富通商户配置不完整");
  }

  const payload: Record<string, string> = {
    service: "unified.trade.query",
    version: "2.0",
    charset: "UTF-8",
    sign_type: "MD5",
    mch_id: merchantId,
    out_trade_no: merchantOrderNo,
    nonce_str: crypto.randomUUID().replaceAll("-", ""),
  };
  const text = await postWeifutongXml(payload);
  const raw = parseWeifutongXmlFields(text);

  return {
    status: raw.status || "",
    resultCode: raw.result_code || "",
    tradeState: raw.trade_state || "",
    transactionId: raw.transaction_id || raw.out_transaction_id || null,
    signatureValid: verifyWeifutongSignature(raw),
    raw,
  };
}
