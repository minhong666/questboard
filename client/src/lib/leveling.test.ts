import { describe, expect, it } from "vitest";
import { getPlayerLevelStats, getXpForLevel } from "./leveling";

describe("progressive player leveling", () => {
  it("uses 150, 175, 200, 225, 250 XP for successive level-ups", () => {
    expect(getXpForLevel(1)).toBe(150);
    expect(getXpForLevel(2)).toBe(325);
    expect(getXpForLevel(3)).toBe(525);
    expect(getXpForLevel(4)).toBe(750);
    expect(getXpForLevel(5)).toBe(1000);
  });

  it("shows the current level progress against the next progressive threshold", () => {
    expect(getPlayerLevelStats(0)).toMatchObject({
      level: 0,
      currentXp: 0,
      neededXp: 150,
      progress: 0,
    });
    expect(getPlayerLevelStats(149)).toMatchObject({
      level: 0,
      currentXp: 149,
      neededXp: 150,
      progress: 99,
    });
    expect(getPlayerLevelStats(150)).toMatchObject({
      level: 1,
      currentXp: 0,
      neededXp: 175,
      progress: 0,
    });
    expect(getPlayerLevelStats(324)).toMatchObject({
      level: 1,
      currentXp: 174,
      neededXp: 175,
      progress: 99,
    });
    expect(getPlayerLevelStats(325)).toMatchObject({
      level: 2,
      currentXp: 0,
      neededXp: 200,
      progress: 0,
    });
  });
});
