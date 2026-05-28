import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canUseMockMedia } from "@/lib/cos/client";

describe("mock media", () => {
  it("is disabled in production", () => {
    assert.equal(canUseMockMedia("production"), false);
  });

  it("remains available outside production for local upload and playback checks", () => {
    assert.equal(canUseMockMedia("development"), true);
    assert.equal(canUseMockMedia("test"), true);
  });
});
