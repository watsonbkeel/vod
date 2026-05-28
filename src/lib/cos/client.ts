import COS from "cos-nodejs-sdk-v5";

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

export function getCosObjectUrl(input: { bucket: string; region: string; objectKey: string; method: "GET" | "PUT"; expiresIn: number }) {
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
