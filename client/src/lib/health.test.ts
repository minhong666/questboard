import { describe, expect, it } from "vitest";
import { clampCurrentHealth } from "./health";

describe("current health clamping", () => {
  it("preserves valid health up to the full effective equipment cap", () => {
    expect(clampCurrentHealth(115, 125)).toBe(115);
    expect(clampCurrentHealth(125, 125)).toBe(125);
  });

  it("reduces current health to a lower cap after equipment is removed", () => {
    expect(clampCurrentHealth(125, 105)).toBe(105);
  });

  it("keeps health within valid bounds", () => {
    expect(clampCurrentHealth(-10, 105)).toBe(0);
    expect(clampCurrentHealth(Number.NaN, 105)).toBe(105);
    expect(clampCurrentHealth(20, Number.POSITIVE_INFINITY)).toBe(1);
  });
});
