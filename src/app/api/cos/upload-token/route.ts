import { z } from "zod";
import { jsonOk } from "@/lib/api";
import { buildObjectKey, getCosConfig } from "@/lib/cos/client";
import { prisma } from "@/lib/db";

const uploadRequestSchema = z.object({
  filename: z.string().trim().min(1).default("video.mp4"),
  mimeType: z.string().trim().min(1).default("video/mp4"),
  sizeBytes: z.coerce.number().int().min(0).default(0),
});

export async function POST(request: Request) {
  const body = uploadRequestSchema.parse(await request.json().catch(() => ({})));
  const { bucket, region } = getCosConfig();
  const objectKey = buildObjectKey(body.filename);
  const asset = await prisma.mediaAsset.create({
    data: {
      bucket,
      region,
      objectKey,
      filename: body.filename,
      mimeType: body.mimeType,
      sizeBytes: BigInt(body.sizeBytes),
      status: "pending",
    },
  });

  return jsonOk({
    assetId: asset.id,
    bucket,
    region,
    objectKey,
    uploadMethod: "putObject",
    status: asset.status,
    upload: {
      mode: process.env.TENCENT_SECRET_ID && process.env.TENCENT_SECRET_KEY ? "cos" : "mock",
      expiresIn: Number(process.env.COS_SIGN_EXPIRES_SECONDS ?? 600),
    },
  });
}
