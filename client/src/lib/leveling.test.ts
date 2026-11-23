import { describe, expect, it } from "vitest";
import {
  getPlayerLevelStats,
  getXpForLevel,
  getXpForNextLevel,
  XP_PER_LEVEL,
} from "./leveling";

describe("fixed player leveling", () => {
  it("requires exactly 300 XP for every level regardless of current level", () => {
    expect(XP_PER_LEVEL).toBe(300);
    for (const level of [0, 1, 2, 10, 99]) {
      expect(getXpForNextLevel(level)).toBe(300);
    }
    expect([0, 1, 2, 3, 10].map(getXpForLevel)).toEqual([
      0, 300, 600, 900, 3000,
    ]);
  });

  it("uses fixed 300 XP boundaries for level and progress calculations", () => {
    expect(getPlayerLevelStats(0)).toMatchObject({
      level: 0,
      currentXp: 0,
      neededXp: 300,
      progress: 0,
    });
    expect(getPlayerLevelStats(298)).toMatchObject({
      level: 0,
      currentXp: 298,
      neededXp: 300,
      progress: 99,
    });
    expect(getPlayerLevelStats(300)).toMatchObject({
      level: 1,
      currentXp: 0,
      neededXp: 300,
      progress: 0,
    });
    expect(getPlayerLevelStats(598)).toMatchObject({
      level: 1,
      currentXp: 298,
      neededXp: 300,
      progress: 99,
    });
    expect(getPlayerLevelStats(600)).toMatchObject({
      level: 2,
      currentXp: 0,
      neededXp: 300,
      progress: 0,
    });
  });
});
