import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { playableLessonWhere } from "@/lib/lessons/playable";

describe("playable lessons", () => {
  it("requires published lessons with uploaded media", () => {
    assert.deepEqual(playableLessonWhere(), {
      status: "published",
      mediaAsset: {
        is: {
          status: "uploaded",
        },
      },
    });
  });
});
