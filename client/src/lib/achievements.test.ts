import { describe, expect, it } from "vitest";
import {
  ACHIEVEMENTS,
  getNewAchievementIds,
  normalizeAchievementIds,
} from "./achievements";

const baseState = {
  tasks: [{ completed: false }],
  totalXp: 0,
  abilityLevel: 1,
  abilities: { strength: 18 },
  streak: 0,
  defeatedMonsterIds: [],
  timerActivities: [],
  jobClass: "warrior" as const,
};

describe("achievement system", () => {
  it("unlocks achievements from cumulative progress", () => {
    const ids = getNewAchievementIds(
      {
        ...baseState,
        tasks: [{ completed: true }],
        totalXp: 1_000,
        abilityLevel: 10,
        abilities: { strength: 100 },
        streak: 7,
        defeatedMonsterIds: ["slime"],
        timerActivities: [{ totalSeconds: 3_600 }],
      },
      []
    );

    expect(ids).toEqual(ACHIEVEMENTS.map(achievement => achievement.id));
  });

  it("does not return achievements that were already unlocked", () => {
    const ids = getNewAchievementIds(
      { ...baseState, totalXp: 1_000 },
      ["xp-1000"]
    );

    expect(ids).not.toContain("xp-1000");
  });

  it("keeps only known unique achievement ids when loading a save", () => {
    expect(
      normalizeAchievementIds(["xp-1000", "xp-1000", "unknown", 42, null])
    ).toEqual(["xp-1000"]);
  });
});
