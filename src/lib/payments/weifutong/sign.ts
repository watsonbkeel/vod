import crypto from "crypto";

export function signWeifutongPayload(payload: Record<string, string | number | undefined>, key = process.env.WEIFUTONG_KEY ?? "") {
  const query = Object.entries(payload)
    .filter(([, value]) => value !== undefined && value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => `${name}=${value}`)
    .join("&");

  return crypto.createHash("md5").update(`${query}&key=${key}`, "utf8").digest("hex").toUpperCase();
}

export function verifyWeifutongSignature(payload: Record<string, string>, key = process.env.WEIFUTONG_KEY ?? "") {
  const { sign, ...rest } = payload;
  if (!sign) return false;
  return signWeifutongPayload(rest, key) === sign.toUpperCase();
}
