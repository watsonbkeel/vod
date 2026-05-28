import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getAppUrl } from "@/lib/urls";

describe("app URLs", () => {
  it("prefers the configured public APP_URL", () => {
    const request = new Request("https://localhost:13000/api/auth/password", {
      headers: { host: "localhost:13000" },
    });

    assert.equal(getAppUrl("/my-courses", request, "https://v.bkeel.com").toString(), "https://v.bkeel.com/my-courses");
  });

  it("falls back to forwarded proxy headers", () => {
    const request = new Request("https://localhost:13000/api/auth/password", {
      headers: {
        "x-forwarded-host": "v.bkeel.com",
        "x-forwarded-proto": "https",
      },
    });

    assert.equal(getAppUrl("/login", request, "").toString(), "https://v.bkeel.com/login");
  });
});
