import { describe, expect, it } from "vitest";
import { ACHIEVEMENTS, getAchievementProgress } from "./achievements";

describe("achievements", () => {
  const context = {
    completedTasks: 1,
    totalXp: 1000,
    timerSeconds: 3600,
    streak: 7,
    defeatedMonsters: 3,
    inventoryItems: 4,
    unlockedSkills: 2,
    skillUpgradeLevels: 0,
  };

  it("marks first quest, XP, focus and streak achievements complete", () => {
    for (const id of ["first-quest", "xp-hunter", "focus-hour", "unbroken-will"]) {
      const achievement = ACHIEVEMENTS.find(item => item.id === id);
      expect(achievement).toBeDefined();
      expect(getAchievementProgress(achievement!, context).completed).toBe(true);
    }
  });

  it("formats focus time as minutes and caps progress at the goal", () => {
    const achievement = ACHIEVEMENTS.find(item => item.id === "focus-hour")!;
    const progress = getAchievementProgress(achievement, {
      ...context,
      timerSeconds: 4200,
    });
    expect(progress.label).toBe("60 / 60 分鐘");
    expect(progress.value).toBe(4200);
    expect(progress.completed).toBe(true);
  });

  it("keeps incomplete collection achievements locked", () => {
    const achievement = ACHIEVEMENTS.find(item => item.id === "skill-collector")!;
    const progress = getAchievementProgress(achievement, context);
    expect(progress.label).toBe("2 / 4");
    expect(progress.completed).toBe(false);
  });
});
