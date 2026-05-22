import { nanoid } from "nanoid";
import { jsonOk } from "@/lib/api";

export async function POST(request: Request) {
  const body = await request.json();
  const channel = body.channel === "alipay" ? "alipay" : "wechat";

  return jsonOk({
    merchantOrderNo: `VOD${Date.now()}${nanoid(6)}`,
    channel,
    status: "pending",
    note: "下一步接入威富通统一下单，返回二维码或 H5 支付参数。",
  });
}
