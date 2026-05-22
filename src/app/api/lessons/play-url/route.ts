import { jsonError, jsonOk } from "@/lib/api";

export async function POST() {
  return jsonError("播放鉴权和 COS 短期签名将在课程权益接入后启用", 501);
}

export async function GET() {
  return jsonOk({ status: "play-url endpoint ready" });
}
