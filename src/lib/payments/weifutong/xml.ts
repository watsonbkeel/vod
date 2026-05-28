import { signWeifutongPayload } from "./sign";

function escapeXml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

export function toWeifutongXml(payload: Record<string, string>) {
  return `<xml>${Object.entries(payload).map(([key, value]) => `<${key}>${escapeXml(value)}</${key}>`).join("")}</xml>`;
}

export function parseWeifutongXmlValue(xml: string, key: string) {
  const match = xml.match(new RegExp(`<${key}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${key}>|<${key}>([\\s\\S]*?)</${key}>`));
  return match?.[1] ?? match?.[2] ?? "";
}

export function parseWeifutongXml(xml: string, keys: string[]) {
  return Object.fromEntries(keys.map((key) => [key, parseWeifutongXmlValue(xml, key)]).filter(([, value]) => value)) as Record<string, string>;
}

export async function postWeifutongXml(payload: Record<string, string>) {
  const gatewayUrl = process.env.WEIFUTONG_GATEWAY_URL;

  if (!gatewayUrl) {
    throw new Error("威富通网关配置不完整");
  }

  payload.sign = signWeifutongPayload(payload);

  const response = await fetch(gatewayUrl, {
    method: "POST",
    headers: { "Content-Type": "text/xml;charset=UTF-8" },
    body: toWeifutongXml(payload),
  });

  if (!response.ok) {
    throw new Error("威富通请求失败");
  }

  return response.text();
}
