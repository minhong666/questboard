import { describe, expect, it } from "vitest";
import {
  addWeeklyStats,
  createWeeklyStats,
  getWeeklyStatsKey,
  isWeeklyReportTime,
  normalizeWeeklyStats,
} from "./weekly-stats";

describe("weekly stats", () => {
  it("uses Monday as the start of a local calendar week", () => {
    expect(getWeeklyStatsKey(new Date(2026, 9, 25, 23, 0))).toBe(
      "weekly-stats-2026-10-19"
    );
    expect(getWeeklyStatsKey(new Date(2026, 9, 26, 0, 0))).toBe(
      "weekly-stats-2026-10-26"
    );
  });

  it("recognizes Sunday at 23:00 as the report time", () => {
    expect(isWeeklyReportTime(new Date(2026, 9, 25, 22, 59))).toBe(false);
    expect(isWeeklyReportTime(new Date(2026, 9, 25, 23, 0))).toBe(true);
    expect(isWeeklyReportTime(new Date(2026, 9, 26, 0, 0))).toBe(false);
  });

  it("adds task, level, coin, and ability changes", () => {
    const date = new Date(2026, 9, 21);
    const next = addWeeklyStats(createWeeklyStats(date), {
      tasksCompleted: 3,
      levelsGained: 2,
      coinsEarned: 95,
      abilitiesGained: { health: 20, strength: 2, intelligence: 4 },
    }, date);
    expect(next).toMatchObject({
      tasksCompleted: 3,
      levelsGained: 2,
      coinsEarned: 95,
      abilitiesGained: { health: 20, strength: 2, defense: 0, intelligence: 4 },
    });
  });

  it("resets incompatible or malformed saved stats without breaking the save", () => {
    const date = new Date(2026, 9, 21);
    expect(normalizeWeeklyStats({ weekKey: "old-week", tasksCompleted: 99 }, date)).toEqual(
      createWeeklyStats(date)
    );
    expect(
      normalizeWeeklyStats(
        {
          weekKey: getWeeklyStatsKey(date),
          tasksCompleted: 4.8,
          levelsGained: -2,
          coinsEarned: 80.9,
          abilitiesGained: { health: 10.4 },
          reportShownWeekKey: getWeeklyStatsKey(date),
        },
        date
      )
    ).toMatchObject({
      tasksCompleted: 4,
      levelsGained: 0,
      coinsEarned: 80,
      abilitiesGained: { health: 10, strength: 0 },
      reportShownWeekKey: getWeeklyStatsKey(date),
    });
  });
});
