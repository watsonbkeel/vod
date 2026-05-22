import { z } from "zod";

export const phoneSchema = z.string().regex(/^1[3-9]\d{9}$/, "手机号格式不正确");

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return Response.json({ ok: true, data }, init);
}

export function jsonError(message: string, status = 400) {
  return Response.json({ ok: false, error: message }, { status });
}
