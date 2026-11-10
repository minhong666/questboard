import { describe, expect, it } from "vitest";
import {
  getPlayerLevelStats,
  getXpForLevel,
  getXpForNextLevel,
  XP_PER_LEVEL,
} from "./leveling";

describe("fixed player leveling", () => {
  it("requires exactly 250 XP for every level regardless of current level", () => {
    expect(XP_PER_LEVEL).toBe(250);
    for (const level of [0, 1, 2, 10, 99]) {
      expect(getXpForNextLevel(level)).toBe(250);
    }
    expect([0, 1, 2, 3, 10].map(getXpForLevel)).toEqual([
      0,
      250,
      500,
      750,
      2500,
    ]);
  });

  it("uses fixed 250 XP boundaries for level and progress calculations", () => {
    expect(getPlayerLevelStats(0)).toMatchObject({
      level: 0,
      currentXp: 0,
      neededXp: 250,
      progress: 0,
    });
    expect(getPlayerLevelStats(248)).toMatchObject({
      level: 0,
      currentXp: 248,
      neededXp: 250,
      progress: 99,
    });
    expect(getPlayerLevelStats(250)).toMatchObject({
      level: 1,
      currentXp: 0,
      neededXp: 250,
      progress: 0,
    });
    expect(getPlayerLevelStats(498)).toMatchObject({
      level: 1,
      currentXp: 248,
      neededXp: 250,
      progress: 99,
    });
    expect(getPlayerLevelStats(500)).toMatchObject({
      level: 2,
      currentXp: 0,
      neededXp: 250,
      progress: 0,
    });
  });
});
