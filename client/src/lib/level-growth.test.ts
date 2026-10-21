import { describe, expect, it } from "vitest";
import {
  getWarriorExtraHealth,
  getWarriorTotalHealthGrowth,
} from "./level-growth";

describe("warrior level growth", () => {
  it("grants 20 extra health per level-up on top of the shared 10", () => {
    expect(getWarriorExtraHealth(1)).toBe(20);
    expect(getWarriorTotalHealthGrowth(1)).toBe(30);
  });

  it("scales linearly across multiple levels", () => {
    expect(getWarriorExtraHealth(3)).toBe(60);
    expect(getWarriorTotalHealthGrowth(3)).toBe(90);
  });

  it("does not grant negative or fractional level growth", () => {
    expect(getWarriorExtraHealth(-1)).toBe(0);
    expect(getWarriorTotalHealthGrowth(-1)).toBe(0);
    expect(getWarriorExtraHealth(1.8)).toBe(20);
  });
});
