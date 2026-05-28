import { parseWeifutongXmlFields } from "./xml";

export async function parseWeifutongNotificationPayload(request: Request) {
  const contentType = (request.headers.get("content-type") ?? "").toLowerCase();

  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const formData = await request.formData();

    return Object.fromEntries(Array.from(formData.entries()).map(([key, value]) => [key, String(value)]));
  }

  const text = await request.text();
  const trimmed = text.trim();

  if (!trimmed) {
    return {};
  }

  if (contentType.includes("application/json")) {
    const json = JSON.parse(trimmed) as Record<string, unknown>;

    return Object.fromEntries(Object.entries(json).map(([key, value]) => [key, String(value)]));
  }

  if (trimmed.startsWith("<")) {
    return parseWeifutongXmlFields(trimmed);
  }

  return Object.fromEntries(new URLSearchParams(trimmed).entries());
}
