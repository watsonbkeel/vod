import COS from "cos-nodejs-sdk-v5";

type CosMethod = "GET" | "PUT";
type CosObjectLocation = { bucket: string; region: string; objectKey: string };

export function canUseMockMedia(nodeEnv = process.env.NODE_ENV) {
  return nodeEnv !== "production";
}

export function hasCosCredentials() {
  return Boolean(process.env.TENCENT_SECRET_ID && process.env.TENCENT_SECRET_KEY);
}

export function getCosClient() {
  return new COS({
    SecretId: process.env.TENCENT_SECRET_ID,
    SecretKey: process.env.TENCENT_SECRET_KEY,
    Protocol: "https:",
  });
}

export function getCosConfig() {
  const bucket = process.env.COS_BUCKET || "dev-vod-bucket";
  const region = process.env.COS_REGION || "ap-guangzhou";

  return { bucket, region };
}

export function buildObjectKey(filename: string) {
  const prefix = process.env.COS_UPLOAD_PREFIX ?? "videos/";
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `${prefix}${Date.now()}-${safeName}`;
}

export async function checkCosObject(input: CosObjectLocation) {
  try {
    await getCosClient().headObject({
      Bucket: input.bucket,
      Region: input.region,
      Key: input.objectKey,
    });

    return { ok: true as const };
  } catch (err) {
    const statusCode = typeof (err as { statusCode?: unknown }).statusCode === "number" ? (err as { statusCode: number }).statusCode : 502;

    return { ok: false as const, statusCode };
  }
}

export function getCosObjectUrl(input: CosObjectLocation & { method: CosMethod; expiresIn: number }) {
  return getCosClient().getObjectUrl({
    Bucket: input.bucket,
    Region: input.region,
    Key: input.objectKey,
    Method: input.method,
    Sign: true,
    Expires: input.expiresIn,
    Protocol: "https:",
  });
}
