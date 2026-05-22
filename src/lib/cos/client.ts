import COS from "cos-nodejs-sdk-v5";

export function getCosClient() {
  return new COS({
    SecretId: process.env.TENCENT_SECRET_ID,
    SecretKey: process.env.TENCENT_SECRET_KEY,
  });
}

export function getCosConfig() {
  const bucket = process.env.COS_BUCKET;
  const region = process.env.COS_REGION;

  if (!bucket || !region) {
    throw new Error("COS_BUCKET and COS_REGION are required");
  }

  return { bucket, region };
}

export function buildObjectKey(filename: string) {
  const prefix = process.env.COS_UPLOAD_PREFIX ?? "videos/";
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `${prefix}${Date.now()}-${safeName}`;
}
