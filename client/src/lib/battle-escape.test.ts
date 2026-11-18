import { describe, expect, it } from "vitest";
import { isEscapeSuccessful } from "./battle-escape";

describe("battle escape chance", () => {
  it("fails when the random roll is below the 30% failure threshold", () => {
    expect(isEscapeSuccessful(0)).toBe(false);
    expect(isEscapeSuccessful(0.299999)).toBe(false);
  });

  it("succeeds at the threshold and across the remaining 70%", () => {
    expect(isEscapeSuccessful(0.3)).toBe(true);
    expect(isEscapeSuccessful(0.999999)).toBe(true);
  });
});
