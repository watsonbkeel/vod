import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatMoney } from "@/lib/money";

describe("money formatting", () => {
  it("formats HK dollar prefixes without RMB symbols", () => {
    assert.equal(formatMoney(69900, "HK$"), "HK$699");
    assert.equal(formatMoney(69900, "HKD"), "HKD 699");
  });

  it("keeps cents only when needed", () => {
    assert.equal(formatMoney(69950, "HK$"), "HK$699.50");
  });
});
